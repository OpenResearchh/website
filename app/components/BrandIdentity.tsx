import Image from "next/image";

export function BrandSymbol({
  className = "",
  priority = false,
  sizes = "160px",
}: {
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={`brand-symbol relative inline-block aspect-[39/16] shrink-0 ${className}`}
    >
      <Image
        src="/logos/open-research-symbol.svg"
        alt=""
        fill
        priority={priority}
        sizes={sizes}
        className="brand-symbol-light object-contain"
      />
      <Image
        src="/logos/open-research-symbol-reversed.svg"
        alt=""
        fill
        priority={priority}
        sizes={sizes}
        className="brand-symbol-dark object-contain"
      />
    </span>
  );
}

export function BrandName({ className = "" }: { className?: string }) {
  return <span className={className}>Open Research</span>;
}
