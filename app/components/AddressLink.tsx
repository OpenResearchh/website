import type { ComponentPropsWithoutRef } from "react";
import { explorerAddressUrl, shortAddress } from "@/lib/openResearch/format";

type AddressLinkProps = {
  address: string;
  display?: string;
  className?: string;
} & Omit<ComponentPropsWithoutRef<"a">, "href" | "children">;

/**
 * Renders an on-chain address as an explorer link.
 */
export function AddressLink({
  address,
  display,
  className,
  title,
  ...rest
}: AddressLinkProps) {
  return (
    <a
      {...rest}
      href={explorerAddressUrl(address)}
      target="_blank"
      rel="noreferrer noopener"
      title={title ?? `View ${address} on explorer`}
      className={
        "relative z-20 cursor-pointer underline-offset-4 hover:text-[var(--color-accent)] hover:underline pointer-events-auto" +
        (className ? ` ${className}` : "")
      }
    >
      {display ?? shortAddress(address)}
    </a>
  );
}
