import { Dumbbell } from "lucide-react";

/** Faint scattered dumbbell motifs for an athletic backdrop. */
export function DumbbellField({ className = "" }: { className?: string }) {
  const items = [
    { top: "8%", left: "6%", size: 46, rot: -18, op: 0.07 },
    { top: "22%", left: "84%", size: 70, rot: 24, op: 0.06 },
    { top: "62%", left: "12%", size: 58, rot: 12, op: 0.06 },
    { top: "74%", left: "72%", size: 40, rot: -28, op: 0.08 },
    { top: "42%", left: "48%", size: 90, rot: 8, op: 0.04 },
    { top: "12%", left: "40%", size: 34, rot: 40, op: 0.07 },
  ];
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      {items.map((it, i) => (
        <Dumbbell
          key={i}
          className="absolute text-white"
          style={{
            top: it.top,
            left: it.left,
            width: it.size,
            height: it.size,
            opacity: it.op,
            transform: `rotate(${it.rot}deg)`,
          }}
        />
      ))}
    </div>
  );
}
