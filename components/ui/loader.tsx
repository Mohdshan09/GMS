import { Dumbbell } from "lucide-react";
import { cn } from "@/lib/utils";

/** Rotating dumbbell loader — used in place of a generic spinner. */
export function Loader({
  size = 24,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <Dumbbell
      className={cn("animate-spin text-primary", className)}
      style={{ width: size, height: size, animationDuration: "1.1s" }}
      aria-label="Loading"
    />
  );
}

/** Centered full-area loader with a label. */
export function FullPageLoader({ label = "Loading your gym…" }: { label?: string }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <Loader size={40} />
      <p className="eyebrow text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
