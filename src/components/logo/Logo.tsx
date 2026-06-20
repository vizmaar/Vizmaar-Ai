import Link from "next/link";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`group flex items-center gap-2.5 ${className}`}>
      <svg
        width="36"
        height="36"
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="transition-transform group-hover:scale-105"
      >
        <rect width="36" height="36" rx="10" className="fill-brand" />
        <path
          d="M8 24L14 12L20 20L26 10L28 24H8Z"
          fill="white"
          fillOpacity="0.9"
        />
        <circle cx="26" cy="10" r="3" fill="#FDE047" />
      </svg>
      <span className="text-xl font-bold tracking-tight text-foreground">
        VIZ<span className="text-brand">MAAR</span>
      </span>
    </Link>
  );
}
