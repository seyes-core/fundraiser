import { cn } from "@/lib/utils";

export function SectionLabel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "text-[11px] font-bold uppercase tracking-[0.12em] text-navy mb-3",
        className,
      )}
    >
      {children}
    </div>
  );
}

export default SectionLabel;
