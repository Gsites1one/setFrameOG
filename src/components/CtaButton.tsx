import Link from "next/link";

type CtaButtonProps = {
  size?: "sm" | "lg";
  className?: string;
};

const SIZE_CLASSES: Record<NonNullable<CtaButtonProps["size"]>, string> = {
  sm: "px-4 py-1.5 text-xs",
  lg: "px-6 py-3 text-sm",
};

export function CtaButton({ size = "lg", className = "" }: CtaButtonProps) {
  return (
    <Link
      href="/contact"
      className={`inline-flex items-center justify-center rounded-full border border-accent/50 font-display font-semibold tracking-wide text-accent transition-colors hover:border-accent hover:bg-accent/10 ${SIZE_CLASSES[size]} ${className}`}
    >
      [ Start a conversation ]
    </Link>
  );
}
