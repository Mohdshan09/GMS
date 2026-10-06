"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Users, UserCheck, CalendarCheck, IndianRupee, Clock, UserPlus,
  Activity, MessagesSquare, ArrowRight, Flame, Megaphone, Trophy,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { KpiCard } from "@/components/shared/kpi-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Segmented } from "@/components/ui/tabs";
import { AreaTrend } from "@/components/charts/charts";
import { AddMemberDialog } from "@/components/shared/add-member-dialog";
import { useGymStore } from "@/lib/store";
import { crowdBand, currentCrowd, peakSnapshot } from "@/lib/services/queries";
import { formatINR } from "@/lib/utils";

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning";
  if (h < 17) return "Good Afternoon";
  return "Good Evening";
}

export default function DashboardPage() {
  const stats = useGymStore((s) => s.stats);
  const user = useGymStore((s) => s.authUser);
  const firstName = user?.name?.split(" ")[0] ?? "there";
  const crowdToday = useGymStore((s) => s.crowdToday);
  const crowdDaily = useGymStore((s) => s.crowdDaily);
  const challenges = useGymStore((s) => s.challenges);
  const [addOpen, setAddOpen] = useState(false);
  const [range, setRange] = useState<"today" | "30d">("today");

  const current = currentCrowd(crowdToday);
  const band = crowdBand(current.percentage);
  const peak = peakSnapshot(crowdToday);
  const activeChallenge = challenges.find((c) => c.status === "active")!;

  const timelineData =
    range === "today"
      ? crowdToday.map((c) => ({
          label: new Date(c.timestamp).toLocaleTimeString("en-IN", { hour: "numeric", hour12: true }),
          value: c.percentage,
        }))
      : crowdDaily.map((c) => ({ label: c.date, value: c.avg }));

  return (
    <>
      <PageHeader title={`${greeting()}, ${firstName} 👋`} subtitle="Here's what's happening at your gym today.">
        <Link href="/community">
          <Button variant="outline"><Megaphone /> Announcement</Button>
        </Link>
        <Link href="/community">
          <Button variant="outline"><Trophy /> Challenge</Button>
        </Link>
        <Button onClick={() => setAddOpen(true)}>
          <UserPlus /> Add Member
        </Button>
      </PageHeader>

      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        <KpiCard label="Total Members" value={stats.totalMembers.toLocaleString("en-IN")} delta={8.2} deltaLabel="this month" icon={<Users className="size-4" />} />
        <KpiCard label="Active Members" value={stats.activeMembers.toLocaleString("en-IN")} deltaLabel={`${Math.round((stats.activeMembers / stats.totalMembers) * 100)}% active`} icon={<UserCheck className="size-4" />} />
        <KpiCard label="Today's Attendance" value={String(stats.todayAttendance)} delta={12} deltaLabel="vs yesterday" icon={<CalendarCheck className="size-4" />} />
        <KpiCard label="Monthly Revenue" value={formatINR(stats.monthlyRevenue, { compact: true })} delta={14.6} icon={<IndianRupee className="size-4" />} />
        <KpiCard label="Expiring Soon" value={String(stats.expiringMemberships)} deltaLabel="next 7 days" icon={<Clock className="size-4" />} />
        <KpiCard label="New Members" value={String(stats.newMembers)} deltaLabel="this month" icon={<UserPlus className="size-4" />} />
      </div>

      {/* Hero: Crowd + Community */}
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Crowd Intelligence */}
        <Card className="overflow-hidden border-primary/20">
          <div className="flex items-center justify-between border-b bg-primary/5 px-5 py-3">
            <div className="flex items-center gap-2 font-semibold">
              <Activity className="size-4 text-primary" /> Crowd Intelligence
            </div>
            <Badge tone="primary">Live</Badge>
          </div>
          <CardContent className="pt-5">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Currently</p>
                <p className="text-4xl font-bold">{current.percentage}%</p>
                <p className="text-sm text-muted-foreground">{current.occupancy} / {current.capacity} capacity</p>
              </div>
              <Badge tone={band.tone as any} className="mb-1 text-sm">{band.label}</Badge>
            </div>
            <Progress value={current.percentage} className="mt-4 h-3" barClassName={current.percentage > 85 ? "bg-danger" : current.percentage > 70 ? "bg-warning" : "bg-primary"} />
            <div className="mt-4 flex items-center gap-2 rounded-lg bg-accent/60 p-3 text-sm">
              <Flame className="size-4 text-warning" />
              <span><b>Peak Hour</b> detected around {new Date(peak.timestamp).toLocaleTimeString("en-IN", { hour: "numeric", hour12: true })} ({peak.percentage}%)</span>
            </div>
            <Link href="/crowd" className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
              View Crowd Insights <ArrowRight className="size-4" />
            </Link>
          </CardContent>
        </Card>

        {/* Community */}
        <Card className="overflow-hidden border-primary/20">
          <div className="flex items-center justify-between border-b bg-primary/5 px-5 py-3">
            <div className="flex items-center gap-2 font-semibold">
              <MessagesSquare className="size-4 text-primary" /> Community
            </div>
            <Badge tone="success">+18% engagement</Badge>
          </div>
          <CardContent className="pt-5">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active members</p>
                <p className="text-4xl font-bold">{stats.communityActive}</p>
              </div>
              <div className="text-right text-sm">
                <p><b>{stats.postsThisWeek}</b> <span className="text-muted-foreground">posts</span></p>
                <p><b>{stats.comments}</b> <span className="text-muted-foreground">comments</span></p>
              </div>
            </div>
            <div className="mt-4 rounded-lg bg-accent/60 p-3">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{activeChallenge.title}</span>
                <span className="text-muted-foreground">{activeChallenge.progressPct}%</span>
              </div>
              <Progress value={activeChallenge.progressPct} className="mt-2" />
              <p className="mt-2 text-xs text-muted-foreground">{activeChallenge.participants} participants · {stats.challengeParticipation}% participation</p>
            </div>
            <Link href="/community" className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
              Open Community <ArrowRight className="size-4" />
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Crowd timeline */}
      <Card className="mt-6">
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>Crowd Level</CardTitle>
            <p className="text-sm text-muted-foreground">Occupancy across the day</p>
          </div>
          <Segmented
            value={range}
            onChange={setRange}
            options={[{ label: "Today", value: "today" }, { label: "Last 30 Days", value: "30d" }]}
          />
        </CardHeader>
        <CardContent>
          <AreaTrend data={timelineData} xKey="label" yKey="value" unit="%" />
        </CardContent>
      </Card>

      <AddMemberDialog open={addOpen} onClose={() => setAddOpen(false)} />
    </>
  );
}
