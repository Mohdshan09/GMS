"use client";

import Link from "next/link";
import { format } from "date-fns";
import {
  Building2, CheckCircle2, IndianRupee, Clock, TrendingDown, UserPlus, ArrowRight,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { KpiCard } from "@/components/shared/kpi-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarSeries } from "@/components/charts/charts";
import { useGymStore } from "@/lib/store";
import { formatINR } from "@/lib/utils";

const statusTone = { active: "success", trial: "warning", churned: "danger" } as const;

export default function DeveloperOverview() {
  const devStats = useGymStore((s) => s.devStats);
  const customers = useGymStore((s) => s.customers);
  const saasPlans = useGymStore((s) => s.saasPlans);

  const byPlan = saasPlans.map((p) => ({
    plan: p.name,
    gyms: customers.filter((c) => c.planId === p.id && c.status !== "churned").length,
  }));

  const recent = [...customers].sort((a, b) => +new Date(b.joinedAt) - +new Date(a.joinedAt)).slice(0, 6);

  return (
    <>
      <PageHeader title="Platform Overview" subtitle="How GymOS is performing across all your gym customers" />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        <KpiCard label="Total Gyms" value={String(devStats.totalGyms)} icon={<Building2 className="size-4" />} />
        <KpiCard label="Active" value={String(devStats.activeGyms)} deltaLabel="subscriptions" icon={<CheckCircle2 className="size-4" />} />
        <KpiCard label="MRR" value={formatINR(devStats.mrr, { compact: true })} delta={9.4} icon={<IndianRupee className="size-4" />} />
        <KpiCard label="On Trial" value={String(devStats.trialGyms)} deltaLabel="converting" icon={<Clock className="size-4" />} />
        <KpiCard label="Churn Rate" value={`${devStats.churnRate}%`} icon={<TrendingDown className="size-4" />} />
        <KpiCard label="New This Month" value={String(devStats.newThisMonth)} icon={<UserPlus className="size-4" />} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Gyms by Plan</CardTitle></CardHeader>
          <CardContent><BarSeries data={byPlan} xKey="plan" yKey="gyms" /></CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle>Recent Signups</CardTitle>
            <Link href="/developer/customers" className="text-sm font-medium text-primary hover:underline">All</Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {recent.map((c) => (
              <div key={c.id} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{c.gymName}</p>
                  <p className="text-xs text-muted-foreground">{c.city} · {format(new Date(c.joinedAt), "dd MMM")}</p>
                </div>
                <Badge tone={statusTone[c.status]}>{c.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4">
        <CardContent className="flex flex-col items-start justify-between gap-3 py-5 sm:flex-row sm:items-center">
          <div>
            <p className="font-semibold">Manage your subscription plans</p>
            <p className="text-sm text-muted-foreground">Create and price the tiers your gym customers subscribe to.</p>
          </div>
          <Link href="/developer/plans"><Button>Subscription Plans <ArrowRight /></Button></Link>
        </CardContent>
      </Card>
    </>
  );
}
