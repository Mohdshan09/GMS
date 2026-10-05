import { ComingSoon } from "@/components/shared/coming-soon";

export default function ReportsPage() {
  return (
    <ComingSoon
      title="Reports"
      subtitle="Make decisions based on how your gym actually behaves."
      phase="Phase 5"
      points={[
        "Member growth & retention",
        "Revenue analytics",
        "Attendance trends",
        "Community & crowd reports with date filters",
      ]}
    />
  );
}
