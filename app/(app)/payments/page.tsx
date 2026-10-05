"use client";

import { useMemo, useState } from "react";
import { format } from "date-fns";
import { IndianRupee, Wallet, Clock } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Segmented } from "@/components/ui/tabs";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { PaymentStatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { useGymStore } from "@/lib/store";
import { formatINR } from "@/lib/utils";
import { planName } from "@/lib/services/queries";
import { PaymentStatus } from "@/lib/types";

type Filter = "all" | PaymentStatus;

export default function PaymentsPage() {
  const payments = useGymStore((s) => s.payments);
  const members = useGymStore((s) => s.members);
  const plans = useGymStore((s) => s.plans);
  const stats = useGymStore((s) => s.stats);
  const [filter, setFilter] = useState<Filter>("all");

  const rows = useMemo(() => {
    const sorted = [...payments].sort((a, b) => +new Date(b.date) - +new Date(a.date));
    return filter === "all" ? sorted : sorted.filter((p) => p.status === filter);
  }, [payments, filter]);

  return (
    <>
      <PageHeader title="Payments" subtitle="Revenue and transaction history" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Metric icon={<IndianRupee className="size-4" />} label="Revenue This Month" value={formatINR(stats.monthlyRevenue)} tone="text-foreground" />
        <Metric icon={<Wallet className="size-4" />} label="Collected" value={formatINR(stats.collected)} tone="text-success" />
        <Metric icon={<Clock className="size-4" />} label="Pending" value={formatINR(stats.pending)} tone="text-warning" />
      </div>

      <div className="mt-4">
        <Segmented
          value={filter}
          onChange={setFilter}
          options={[
            { label: "All", value: "all" },
            { label: "Paid", value: "paid" },
            { label: "Pending", value: "pending" },
            { label: "Failed", value: "failed" },
            { label: "Refunded", value: "refunded" },
          ]}
        />
      </div>

      <Card className="mt-4">
        {rows.length === 0 ? (
          <EmptyState title="No payments" description="No transactions match this filter." />
        ) : (
          <Table>
            <THead>
              <TR><TH>Member</TH><TH>Plan</TH><TH>Amount</TH><TH>Date</TH><TH>Method</TH><TH>Status</TH></TR>
            </THead>
            <TBody>
              {rows.map((p) => {
                const m = members.find((x) => x.id === p.memberId);
                return (
                  <TR key={p.id}>
                    <TD className="flex items-center gap-2">
                      <Avatar name={m?.name ?? "?"} color={m?.avatarColor} size="sm" />
                      <span className="font-medium">{m?.name ?? "Unknown"}</span>
                    </TD>
                    <TD className="text-muted-foreground">{planName(plans, p.planId)}</TD>
                    <TD className="font-semibold">{formatINR(p.amount)}</TD>
                    <TD className="text-muted-foreground">{format(new Date(p.date), "dd MMM yyyy")}</TD>
                    <TD className="text-muted-foreground">{p.method}</TD>
                    <TD><PaymentStatusBadge status={p.status} /></TD>
                  </TR>
                );
              })}
            </TBody>
          </Table>
        )}
      </Card>
    </>
  );
}

function Metric({ icon, label, value, tone }: { icon: React.ReactNode; label: string; value: string; tone: string }) {
  return (
    <Card className="p-5">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">{icon}{label}</div>
      <p className={`mt-2 text-2xl font-bold ${tone}`}>{value}</p>
    </Card>
  );
}
