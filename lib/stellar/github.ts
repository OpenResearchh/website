import { cache } from "react";

const MAX_SOURCE_BYTES = 512 * 1024;
const COMMIT_RE = /^(?:[0-9a-f]{40}|[0-9a-f]{64})$/i;
const REPOSITORY_PART_RE = /^[a-z0-9_.-]+$/i;

const README_FALLBACK_PATHS = ["README.MD", "readme.md"] as const;
const PURPOSE_FALLBACK_PATHS = [
  ".openresearch/program.md",
  "PURPOSE.md",
  "purpose.md",
  "STATEMENT_OF_PURPOSE.md",
  "statement-of-purpose.md",
] as const;

export interface GitHubSourceFile {
  path: string;
  text: string;
  url: string;
}

export interface GitHubProjectProfile {
  owner: string;
  repository: string;
  repositoryUrl: string;
  commitUrl: string;
  title: string;
  summary: string;
  summarySource: GitHubSourceFile | null;
  readme: GitHubSourceFile | null;
}

interface GitHubRepositoryRef {
  owner: string;
  repository: string;
  repositoryUrl: string;
}

function parseGitHubRepository(cloneUrl: string): GitHubRepositoryRef | null {
  let url: URL;
  try {
    url = new URL(cloneUrl);
  } catch {
    return null;
  }

  if (url.protocol !== "https:" || url.hostname.toLowerCase() !== "github.com") {
    return null;
  }
  if (url.username || url.password || url.port || url.search || url.hash) {
    return null;
  }

  const parts = url.pathname.replace(/^\/+|\/+$/g, "").split("/");
  if (parts.length !== 2) return null;

  const owner = parts[0];
  const repository = parts[1].replace(/\.git$/i, "");
  if (
    !owner ||
    !repository ||
    owner === "." ||
    owner === ".." ||
    repository === "." ||
    repository === ".." ||
    !REPOSITORY_PART_RE.test(owner) ||
    !REPOSITORY_PART_RE.test(repository)
  ) {
    return null;
  }

  return {
    owner,
    repository,
    repositoryUrl: `https://github.com/${owner}/${repository}`,
  };
}

function sourceUrls(
  repository: GitHubRepositoryRef,
  commit: string,
  path: string,
): { raw: string; web: string } {
  const encodedPath = path.split("/").map(encodeURIComponent).join("/");
  const owner = encodeURIComponent(repository.owner);
  const repo = encodeURIComponent(repository.repository);
  return {
    raw: `https://raw.githubusercontent.com/${owner}/${repo}/${commit}/${encodedPath}`,
    web: `${repository.repositoryUrl}/blob/${commit}/${encodedPath}`,
  };
}

async function fetchSourceFile(
  repository: GitHubRepositoryRef,
  commit: string,
  path: string,
): Promise<GitHubSourceFile | null> {
  const urls = sourceUrls(repository, commit, path);
  try {
    const response = await fetch(urls.raw, {
      cache: "force-cache",
      signal: AbortSignal.timeout(5_000),
    });
    if (!response.ok) return null;

    const declaredBytes = Number(response.headers.get("content-length") ?? "0");
    if (declaredBytes > MAX_SOURCE_BYTES) return null;

    const bytes = await response.arrayBuffer();
    if (bytes.byteLength > MAX_SOURCE_BYTES) return null;
    const text = new TextDecoder("utf-8", { fatal: false }).decode(bytes).trim();
    if (!text) return null;
    return { path, text, url: urls.web };
  } catch {
    return null;
  }
}

async function firstAvailableFile(
  repository: GitHubRepositoryRef,
  commit: string,
  paths: readonly string[],
): Promise<GitHubSourceFile | null> {
  const files = await Promise.all(
    paths.map((path) => fetchSourceFile(repository, commit, path)),
  );
  return files.find((file): file is GitHubSourceFile => file !== null) ?? null;
}

function inlineMarkdownToText(value: string): string {
  return value
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/<https?:\/\/[^>]+>/g, "")
    .replace(/<[^>]+>/g, "")
    .replace(/[`*_~]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function firstMarkdownHeading(markdown: string): string | null {
  for (const line of markdown.split(/\r?\n/)) {
    const match = /^#\s+(.+?)\s*#*\s*$/.exec(line.trim());
    if (!match) continue;
    const title = inlineMarkdownToText(match[1]);
    if (title) return title.slice(0, 120);
  }
  return null;
}

function firstMarkdownParagraph(markdown: string): string | null {
  const paragraphs = markdown.replace(/\r\n/g, "\n").split(/\n\s*\n/);
  for (const block of paragraphs) {
    const trimmed = block.trim();
    if (
      !trimmed ||
      /^#{1,6}\s/.test(trimmed) ||
      /^```/.test(trimmed) ||
      /^(?:[-*+] |\d+\. )/.test(trimmed) ||
      /^\|/.test(trimmed)
    ) {
      continue;
    }
    const paragraph = inlineMarkdownToText(trimmed.replace(/^>\s?/gm, ""));
    if (paragraph.length >= 20) return paragraph.slice(0, 420);
  }
  return null;
}

function protocolMetadata(text: string): {
  title: string | null;
  purpose: string | null;
} {
  try {
    const parsed = JSON.parse(text) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return { title: null, purpose: null };
    }
    const root = parsed as Record<string, unknown>;
    const meta =
      root.meta && typeof root.meta === "object" && !Array.isArray(root.meta)
        ? (root.meta as Record<string, unknown>)
        : {};
    const stringValue = (...values: unknown[]) =>
      values.find(
        (value): value is string =>
          typeof value === "string" && value.trim().length > 0,
      )?.trim() ?? null;
    return {
      title: stringValue(meta.title, meta.name, root.title, root.name),
      purpose: stringValue(
        meta.purposeStatement,
        meta.statementOfPurpose,
        meta.statement_of_purpose,
        meta.purpose,
        meta.description,
        root.purposeStatement,
        root.statementOfPurpose,
        root.statement_of_purpose,
        root.purpose,
        root.description,
      ),
    };
  } catch {
    return { title: null, purpose: null };
  }
}

function readmeWithoutLeadingTitle(markdown: string): string {
  return markdown.replace(/^\s*#\s+.+?(?:\r?\n)+/, "").trim();
}

/**
 * Resolve display metadata from public GitHub files at the exact on-chain
 * baseline commit. Only github.com clone URLs are accepted, preventing the
 * contract value from becoming an arbitrary server-side fetch target.
 */
export const getGitHubProjectProfile = cache(
  async (
    cloneUrl: string,
    baselineCommit: string,
  ): Promise<GitHubProjectProfile | null> => {
    const repository = parseGitHubRepository(cloneUrl);
    if (!repository || !COMMIT_RE.test(baselineCommit)) return null;

    const [primaryReadme, program, rootProtocol, nestedProtocol] =
      await Promise.all([
        fetchSourceFile(repository, baselineCommit, "README.md"),
        fetchSourceFile(repository, baselineCommit, "program.md"),
        fetchSourceFile(repository, baselineCommit, "protocol.json"),
        fetchSourceFile(
          repository,
          baselineCommit,
          ".openresearch/protocol.json",
        ),
      ]);

    const readme =
      primaryReadme ??
      (await firstAvailableFile(
        repository,
        baselineCommit,
        README_FALLBACK_PATHS,
      ));
    const fallbackPurpose = program
      ? null
      : await firstAvailableFile(
          repository,
          baselineCommit,
          PURPOSE_FALLBACK_PATHS,
        );
    const purposeFile = program ?? fallbackPurpose;
    const protocolFile = nestedProtocol ?? rootProtocol;
    const protocol = protocolFile
      ? protocolMetadata(protocolFile.text)
      : { title: null, purpose: null };

    const readmeTitle = readme ? firstMarkdownHeading(readme.text) : null;
    const purposeSummary = purposeFile
      ? firstMarkdownParagraph(purposeFile.text)
      : null;
    const readmeSummary = readme
      ? firstMarkdownParagraph(readme.text)
      : null;
    const summary =
      protocol.purpose ??
      purposeSummary ??
      readmeSummary ??
      `OpenResearch project sourced from ${repository.owner}/${repository.repository}.`;
    const summarySource = protocol.purpose
      ? protocolFile
      : purposeSummary
        ? purposeFile
        : readmeSummary
          ? readme
          : null;

    return {
      owner: repository.owner,
      repository: repository.repository,
      repositoryUrl: repository.repositoryUrl,
      commitUrl: `${repository.repositoryUrl}/commit/${baselineCommit}`,
      title: (protocol.title ?? readmeTitle ?? repository.repository).slice(0, 120),
      summary: inlineMarkdownToText(summary).slice(0, 420),
      summarySource,
      readme: readme
        ? { ...readme, text: readmeWithoutLeadingTitle(readme.text) }
        : null,
    };
  },
);
