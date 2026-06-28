import { clsx } from "clsx";

interface TagProps {
  children: React.ReactNode;
  variant?: "default" | "navy" | "amber" | "success";
}

const variants = {
  default: { bg: "#F3F2EF", color: "#6B6860", border: "#E8E6E1" },
  navy:    { bg: "#EEF3F8", color: "#1B3A5C", border: "#C8D8E8" },
  amber:   { bg: "#FDF4E4", color: "#8B5E0A", border: "#E8C97A" },
  success: { bg: "#EAF5EE", color: "#2D6A4F", border: "#B7DFC9" },
};

export function Tag({ children, variant = "default" }: TagProps) {
  const v = variants[variant];
  return (
    <span
      style={{
        display: "inline-block",
        padding: "3px 10px",
        borderRadius: 99,
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: "0.04em",
        background: v.bg,
        color: v.color,
        border: `1px solid ${v.border}`,
      }}
    >
      {children}
    </span>
  );
}
