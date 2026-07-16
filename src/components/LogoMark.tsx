// Inline logo mark (P7.3): the brand wordmark reused inside body copy — "Set"
// in medium weight, "Frame" bold, wrapped in copper brackets, matching the nav
// logo treatment. This is the one sanctioned inline reuse of the bracket
// motif; the brackets are aria-hidden so assistive tech reads "SetFrame".
export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <span className={`whitespace-nowrap font-display font-medium ${className}`}>
      <span aria-hidden="true" className="text-accent">
        [
      </span>
      Set<span className="font-bold">Frame</span>
      <span aria-hidden="true" className="text-accent">
        ]
      </span>
    </span>
  );
}
