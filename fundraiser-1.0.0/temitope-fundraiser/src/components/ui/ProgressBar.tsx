"use client";
import { useEffect, useState } from "react";
import { calcPercent, formatNaira } from "@/lib/format";

interface ProgressBarProps {
  raised: number;
  goal: number;
  showLabels?: boolean;
  size?: "sm" | "md";
}

export function ProgressBar({ raised, goal, showLabels = true, size = "md" }: ProgressBarProps) {
  const [width, setWidth] = useState(0);
  const pct = calcPercent(raised, goal);

  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), 100);
    return () => clearTimeout(t);
  }, [pct]);

  const h = size === "sm" ? 6 : 10;

  return (
    <div className="w-full">
      <div
        style={{ height: h, background: "#E8E6E1", borderRadius: 99, overflow: "hidden" }}
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${pct}% of campaign goal reached`}
      >
        <div
          className="progress-fill"
          style={{
            height: "100%",
            width: `${width}%`,
            background: "#1B3A5C",
            borderRadius: 99,
          }}
        />
      </div>
      {showLabels && (
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 12, color: "#6B6860" }}>
          <span>{pct}% of goal reached</span>
          <span>Goal: {formatNaira(goal)}</span>
        </div>
      )}
    </div>
  );
}
