/* Shared inline icons. All use `currentColor` so they inherit text color and
   flip correctly between light and dark themes. */

export function StellarMark({
  size = 24,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={(size * 200) / 236.36}
      viewBox="0 0 236.36 200"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M203,26.16l-28.46,14.5-137.43,70a82.49,82.49,0,0,1-.7-10.68A81.87,81.87,0,0,1,158.2,28.6l16.29-8.3,2.43-1.24A100,100,0,0,0,18.18,100q0,3.82.29,7.61a18.19,18.19,0,0,1-9.88,17.58L0,129.57V150l25.29-12.89,0,0,8.19-4.18,8.07-4.11v0L186.83,55.34l16.28-8.29,33.25-16.94V10.31Z" />
      <path d="M236.36,50,49.78,145,33.5,153.31.31,170.16v20.38L28.45,176l28.46-14.5,137.57-70.1a83.45,83.45,0,0,1,.68,10.6A81.87,81.87,0,0,1,78.16,171.4l-1,.53-17.66,9A100,100,0,0,0,218.18,100c0-2.57-.1-5.11-.29-7.63a18.18,18.18,0,0,1,9.87-17.57l8.6-4.38Z" />
    </svg>
  );
}

export function XMark({
  size = 16,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export function GitHubMark({
  size = 16,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 .5A11.5 11.5 0 0 0 .5 12a11.5 11.5 0 0 0 7.86 10.92c.575.106.785-.25.785-.556 0-.274-.01-1.001-.015-1.965-3.196.695-3.87-1.54-3.87-1.54-.523-1.328-1.277-1.682-1.277-1.682-1.043-.713.08-.699.08-.699 1.153.081 1.76 1.184 1.76 1.184 1.026 1.758 2.693 1.25 3.35.955.104-.743.401-1.25.73-1.538-2.552-.29-5.235-1.276-5.235-5.68 0-1.255.448-2.28 1.183-3.084-.119-.29-.513-1.459.112-3.041 0 0 .965-.309 3.162 1.178a11 11 0 0 1 2.879-.387c.977.005 1.96.132 2.879.387 2.196-1.487 3.16-1.178 3.16-1.178.626 1.582.232 2.751.114 3.041.737.805 1.182 1.83 1.182 3.084 0 4.415-2.687 5.386-5.247 5.67.413.355.78 1.056.78 2.13 0 1.538-.014 2.778-.014 3.156 0 .309.207.668.79.555A11.5 11.5 0 0 0 23.5 12 11.5 11.5 0 0 0 12 .5z" />
    </svg>
  );
}

export function ArrowUpRight({
  size = 14,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M4 12 12 4M6 4h6v6" />
    </svg>
  );
}
