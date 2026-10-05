import { ComingSoon } from "@/components/shared/coming-soon";

export default function CrowdPage() {
  return (
    <ComingSoon
      title="Crowd Insights"
      subtitle="Turn attendance into actionable insights."
      phase="Phase 4"
      points={[
        "Current occupancy + hourly crowd graph",
        "Peak & quiet hours",
        "Auto-detected crowd flags (peak, spikes, capacity warnings)",
        "Business recommendations",
      ]}
    />
  );
}
