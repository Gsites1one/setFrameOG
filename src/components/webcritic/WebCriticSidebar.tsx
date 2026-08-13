"use client";

// Left rail for /webcriticapp. Exactly four items, by instruction: Dashboard,
// New Audit, Audit History, Settings. No Reports, no Templates, and nothing
// account- or billing-related — this is a public lead-magnet tool with no
// login, so anything implying an account would be a lie about the product.
//
// Icons are drawn here in the site's own thin-line style (1.5 stroke,
// currentColor), matching the process and device icons elsewhere, rather than
// lifted from any reference set. Colour is the existing palette only: surface
// panel, copper for active and hover, Space Mono labels.
//
// Below lg it becomes a horizontal scrolling row above the content instead of
// a rail — a fixed left column would eat most of a 320px screen.

type IconProps = { className?: string };

function IconDashboard({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
      strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="3" y="3" width="7.5" height="7.5" rx="1.5" />
      <rect x="13.5" y="3" width="7.5" height="7.5" rx="1.5" />
      <rect x="3" y="13.5" width="7.5" height="7.5" rx="1.5" />
      <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.5" />
    </svg>
  );
}

function IconNewAudit({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
      strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <circle cx="11" cy="11" r="6.5" />
      <path d="M15.8 15.8 21 21" />
      <path d="M11 8.5v5M8.5 11h5" />
    </svg>
  );
}

function IconHistory({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
      strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M20 12a8 8 0 1 1-2.3-5.6" />
      <path d="M20 4v4h-4" />
      <path d="M12 8v4.5l3 1.8" />
    </svg>
  );
}

function IconSettings({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
      strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21M5.6 5.6l1.8 1.8M16.6 16.6l1.8 1.8M18.4 5.6l-1.8 1.8M7.4 16.6l-1.8 1.8" />
    </svg>
  );
}

const BASE =
  "flex w-full shrink-0 items-center gap-2.5 rounded-lg px-3 py-2 text-left font-mono text-[11px] tracking-wide transition-[color,background-color] duration-200";

export function WebCriticSidebar({
  onNewAudit,
  onHistory,
}: {
  onNewAudit: () => void;
  onHistory: () => void;
}) {
  return (
    <nav
      aria-label="Website Critic sections"
      className="lg:w-48 lg:shrink-0"
    >
      <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] lg:flex-col lg:gap-1 lg:overflow-visible lg:rounded-2xl lg:border lg:border-white/10 lg:bg-surface/40 lg:p-3 [&::-webkit-scrollbar]:hidden">
        {/* Dashboard is the current page, so it is a state rather than a
            control — rendered as aria-current instead of a link that would
            navigate to where the visitor already is. */}
        <span
          aria-current="page"
          className={`${BASE} bg-accent/15 text-accent`}
        >
          <IconDashboard className="h-4 w-4 shrink-0" />
          Dashboard
        </span>

        <button type="button" onClick={onNewAudit} className={`${BASE} text-foreground/55 hover:bg-accent/10 hover:text-accent`}>
          <IconNewAudit className="h-4 w-4 shrink-0" />
          New Audit
        </button>

        <button type="button" onClick={onHistory} className={`${BASE} text-foreground/55 hover:bg-accent/10 hover:text-accent`}>
          <IconHistory className="h-4 w-4 shrink-0" />
          Audit History
        </button>

        {/* Nothing sits behind Settings yet. Rendered disabled rather than as a
            live control that silently does nothing when clicked — a dead
            button reads as broken, a dimmed one reads as not-yet. */}
        <button
          type="button"
          disabled
          aria-disabled="true"
          title="Not available yet"
          className={`${BASE} cursor-not-allowed text-foreground/25`}
        >
          <IconSettings className="h-4 w-4 shrink-0" />
          Settings
        </button>
      </div>
    </nav>
  );
}
