import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DOCS, DocArticle, DocPager, getDoc } from "../docs";

// Every page except the first (the first is served at /docs).
export function generateStaticParams() {
  return DOCS.slice(1).map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const doc = getDoc(slug);
  if (!doc) return { title: "Not found" };
  return { title: doc.title, description: doc.summary };
}

export default async function DocSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const doc = getDoc(slug);
  // The intro lives at /docs, not /docs/introduction.
  if (!doc || slug === DOCS[0].slug) notFound();

  return (
    <>
      <DocArticle page={doc} />
      <DocPager slug={doc.slug} />
    </>
  );
}
