// Pure derived selectors over store data. Pages call these instead of
// recomputing aggregates inline — swap internals for real API calls later.
import { Attendance, CrowdSnapshot, Member, Payment } from "@/lib/types";
import { NOW } from "@/lib/data/seed";

export function crowdBand(pct: number): { label: string; tone: string } {
  if (pct <= 40) return { label: "Quiet", tone: "success" };
  if (pct <= 70) return { label: "Comfortable", tone: "primary" };
  if (pct <= 85) return { label: "Busy", tone: "warning" };
  return { label: "Very Crowded", tone: "danger" };
}

export function currentCrowd(crowdToday: CrowdSnapshot[]): CrowdSnapshot {
  const hour = NOW.getHours();
  return (
    crowdToday.find((c) => new Date(c.timestamp).getHours() === hour) ??
    crowdToday[crowdToday.length - 1]
  );
}

export function peakSnapshot(crowdToday: CrowdSnapshot[]): CrowdSnapshot {
  return crowdToday.reduce((a, b) => (b.percentage > a.percentage ? b : a));
}

export function quietSnapshot(crowdToday: CrowdSnapshot[]): CrowdSnapshot {
  return crowdToday.reduce((a, b) => (b.percentage < a.percentage ? b : a));
}

export function memberStatusCounts(members: Member[]) {
  const c = { active: 0, expiring: 0, expired: 0, inactive: 0, new: 0 };
  members.forEach((m) => (c[m.status] += 1));
  return c;
}

export function todayAttendanceSummary(attendance: Attendance[]) {
  const checkedIn = attendance.length;
  const inside = attendance.filter((a) => a.status === "inside").length;
  return { checkedIn, checkedOut: checkedIn - inside, inside };
}

export function revenueSummary(payments: Payment[]) {
  const collected = payments.filter((p) => p.status === "paid").reduce((s, p) => s + p.amount, 0);
  const pending = payments.filter((p) => p.status === "pending").reduce((s, p) => s + p.amount, 0);
  return { collected, pending, total: collected + pending };
}

export function planName(plans: { id: string; name: string }[], id: string) {
  return plans.find((p) => p.id === id)?.name ?? "—";
}

export function memberName(members: Member[], id: string) {
  return members.find((m) => m.id === id)?.name ?? "Unknown";
}
