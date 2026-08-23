import type { Metadata } from "next";
import { DOCS, DocArticle, DocPager } from "./docs";

const intro = DOCS[0];

export const metadata: Metadata = {
  title: "Documentation",
  description: intro.summary,
};

export default function DocsIndexPage() {
  return (
    <>
      <DocArticle page={intro} />
      <DocPager slug={intro.slug} />
    </>
  );
}
