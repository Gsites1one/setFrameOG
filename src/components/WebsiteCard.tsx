import type { WebsitePrototype } from "@/lib/projects";
import { BrowserFrame } from "./BrowserFrame";

// A prototype: the shared premium BrowserFrame plus a caption row (name,
// outcome, quiet "view live" link). The frame is identical for every
// prototype (Iteration 4, Task 3); only the screenshot inside differs.
export function WebsiteCard({ prototype }: { prototype: WebsitePrototype }) {
  return (
    <div className="group flex flex-col">
      <BrowserFrame
        displayUrl={prototype.displayUrl}
        label={prototype.label}
        image={prototype.image}
        alt={prototype.alt}
      />

      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <p className="font-display text-base font-semibold">{prototype.name}</p>
          <p className="mt-1 text-sm leading-relaxed text-foreground/60">
            {prototype.outcome}
          </p>
        </div>
        <a
          href={prototype.url}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 whitespace-nowrap pt-1 font-mono text-xs text-foreground/60 transition-colors hover:text-accent"
        >
          view live →
        </a>
      </div>
    </div>
  );
}
