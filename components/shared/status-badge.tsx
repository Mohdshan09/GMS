import { Badge } from "@/components/ui/badge";
import { MemberStatus, PaymentStatus } from "@/lib/types";

const memberTone: Record<MemberStatus, Parameters<typeof Badge>[0]["tone"]> = {
  active: "success",
  new: "primary",
  expiring: "warning",
  expired: "danger",
  inactive: "muted",
};

export function MemberStatusBadge({ status }: { status: MemberStatus }) {
  return <Badge tone={memberTone[status]}>{status[0].toUpperCase() + status.slice(1)}</Badge>;
}

const payTone: Record<PaymentStatus, Parameters<typeof Badge>[0]["tone"]> = {
  paid: "success",
  pending: "warning",
  failed: "danger",
  refunded: "muted",
};

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  return <Badge tone={payTone[status]}>{status[0].toUpperCase() + status.slice(1)}</Badge>;
}
