import Image from "next/image";
import Link from "next/link";

// Shared header for the standalone pages (/services, /about). The wordmark
// doubles as the route home, with a quiet text link beside it — the same
// anatomy /contact and /knowledge already use, kept in one place now that
// there is more than one page carrying it.
//
// The wordmark is `priority` here because on these pages it IS above the fold
// and there is no hero art competing for the connection, unlike the homepage.
export function PageHeader({ backLabel = "← Back" }: { backLabel?: string }) {
  return (
    <div className="mb-12 flex items-center justify-between">
      <Link href="/" aria-label="Back to the SetFrame homepage">
        <Image
          src="/brand/wordmark-white.png"
          alt="SetFrame"
          width={150}
          height={100}
          priority
          className="h-auto w-36 transition-opacity hover:opacity-80"
        />
      </Link>
      <Link
        href="/"
        className="font-mono text-xs text-foreground/60 transition-colors hover:text-accent"
      >
        {backLabel}
      </Link>
    </div>
  );
}
