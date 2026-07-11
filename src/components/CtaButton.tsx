import { CONTACT_EMAIL } from "@/lib/constants";

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
    <a
      href={`mailto:${CONTACT_EMAIL}`}
      className={`inline-flex items-center justify-center rounded-full border border-accent/50 font-mono text-accent transition-colors hover:border-accent hover:bg-accent/10 ${SIZE_CLASSES[size]} ${className}`}
    >
      [ Start a conversation ]
    </a>
  );
}
