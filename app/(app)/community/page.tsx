import { ComingSoon } from "@/components/shared/coming-soon";

export default function CommunityPage() {
  return (
    <ComingSoon
      title="Community"
      subtitle="Keep members engaged beyond their workouts."
      phase="Phase 5"
      points={[
        "Social feed with posts, likes & comments",
        "Challenges & leaderboards",
        "Admin announcements & moderation",
        "Community engagement analytics",
      ]}
    />
  );
}
