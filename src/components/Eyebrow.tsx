// Quiet section label, styled (Iteration 4.1, item 3). Replaces the bare
// grey mono line that read as unfinished. Anatomy: copper hairline(s), a
// small copper node, and the label in mono caps with wide tracking, brighter
// than before. Two variants:
//  - "center": hairlines flank the label symmetrically (strip subheadings)
//  - "left":   short hairline + node leads into the label (card eyebrows)
export function Eyebrow({
  children,
  align = "left",
  className = "",
}: {
  children: React.ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  const node = (
    <span
      aria-hidden="true"
      className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent shadow-[0_0_8px_1px_rgba(199,123,63,0.55)]"
    />
  );
  const line = (
    <span
      aria-hidden="true"
      className="h-px w-10 shrink-0 bg-gradient-to-r from-transparent via-accent/60 to-accent/60"
    />
  );
  const lineFlip = (
    <span
      aria-hidden="true"
      className="h-px w-10 shrink-0 bg-gradient-to-l from-transparent via-accent/60 to-accent/60"
    />
  );

  if (align === "center") {
    return (
      <p
        className={`flex items-center justify-center gap-3 font-mono text-xs uppercase tracking-[0.25em] text-foreground/70 ${className}`}
      >
        {line}
        {node}
        <span>{children}</span>
        {node}
        {lineFlip}
      </p>
    );
  }

  return (
    <p
      className={`flex items-center gap-3 font-mono text-xs uppercase tracking-[0.25em] text-foreground/70 ${className}`}
    >
      {node}
      <span
        aria-hidden="true"
        className="h-px w-8 shrink-0 bg-accent/60"
      />
      <span>{children}</span>
    </p>
  );
}
