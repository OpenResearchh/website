import { Footer } from "../components/Footer";
import { Nav } from "../components/Nav";
import { DocsSidebar } from "./DocsSidebar";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Nav />
      <main className="container-page py-10 md:py-14">
        <div className="grid gap-10 md:grid-cols-[210px_minmax(0,1fr)] lg:gap-16">
          <aside className="md:sticky md:top-24 md:h-max">
            <DocsSidebar />
          </aside>
          <div className="min-w-0">{children}</div>
        </div>
      </main>
      <Footer />
    </>
  );
}
