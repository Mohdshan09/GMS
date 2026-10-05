"use client";

import { useMemo, useState } from "react";
import { differenceInMinutes, format } from "date-fns";
import { LogIn, LogOut, Zap } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { BarSeries } from "@/components/charts/charts";
import { useGymStore } from "@/lib/store";
import { memberName, todayAttendanceSummary } from "@/lib/services/queries";
import { toast } from "@/components/ui/toast";

export default function AttendancePage() {
  const attendance = useGymStore((s) => s.attendance);
  const members = useGymStore((s) => s.members);
  const trainers = useGymStore((s) => s.trainers);
  const dailyAttendance = useGymStore((s) => s.dailyAttendance);
  const checkIn = useGymStore((s) => s.checkIn);
  const checkOut = useGymStore((s) => s.checkOut);
  const [selected, setSelected] = useState("");

  const summary = todayAttendanceSummary(attendance);
  const trainerName = (id: string | null) => trainers.find((t) => t.id === id)?.name ?? "—";

  const sorted = useMemo(
    () => [...attendance].sort((a, b) => +new Date(b.checkIn) - +new Date(a.checkIn)).slice(0, 25),
    [attendance]
  );

  const insideMember = (mid: string) => attendance.some((a) => a.memberId === mid && a.status === "inside");
  const avgDaily = Math.round(dailyAttendance.reduce((s, d) => s + d.count, 0) / dailyAttendance.length);
  const peakIndex = dailyAttendance.reduce((mi, d, i, arr) => (d.count > arr[mi].count ? i : mi), 0);

  const doManualCheckIn = () => {
    if (!selected) { toast.error("Select a member first."); return; }
    checkIn(selected);
    toast.success(`${memberName(members, selected)} checked in`);
    setSelected("");
  };
  const simulate = () => {
    const candidate = members.find((m) => m.status !== "expired" && !insideMember(m.id));
    if (!candidate) return;
    checkIn(candidate.id);
    toast.success(`${candidate.name} checked in`);
  };

  return (
    <>
      <PageHeader title="Attendance" subtitle="Live check-ins across your gym today">
        <Button variant="outline" onClick={simulate}><Zap /> Simulate Check-in</Button>
      </PageHeader>

      {/* Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Stat label="Checked In" value={summary.checkedIn} tone="primary" />
        <Stat label="Checked Out" value={summary.checkedOut} tone="muted" />
        <Stat label="Currently Inside" value={summary.inside} tone="success" />
      </div>

      {/* Manual check-in */}
      <Card className="mt-4">
        <CardContent className="flex flex-col gap-3 pt-5 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label className="mb-1.5 block text-sm font-medium">Manual Check-in</label>
            <Select value={selected} onChange={(e) => setSelected(e.target.value)}>
              <option value="">Select member…</option>
              {members.filter((m) => !insideMember(m.id) && m.status !== "expired").slice(0, 60).map((m) => (
                <option key={m.id} value={m.id}>{m.name} · {m.code}</option>
              ))}
            </Select>
          </div>
          <Button onClick={doManualCheckIn}><LogIn /> Check In</Button>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="mt-4">
        <CardHeader><CardTitle>Recent Activity</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <THead>
              <TR><TH>Member</TH><TH>Check-in</TH><TH>Check-out</TH><TH>Duration</TH><TH>Trainer</TH><TH>Status</TH><TH /></TR>
            </THead>
            <TBody>
              {sorted.map((a) => {
                const m = members.find((x) => x.id === a.memberId);
                const dur = a.checkOut ? differenceInMinutes(new Date(a.checkOut), new Date(a.checkIn)) : null;
                return (
                  <TR key={a.id}>
                    <TD className="flex items-center gap-2">
                      <Avatar name={m?.name ?? "?"} color={m?.avatarColor} size="sm" />
                      <span className="font-medium">{m?.name ?? "Unknown"}</span>
                    </TD>
                    <TD className="text-muted-foreground">{format(new Date(a.checkIn), "h:mm a")}</TD>
                    <TD className="text-muted-foreground">{a.checkOut ? format(new Date(a.checkOut), "h:mm a") : "—"}</TD>
                    <TD>{dur !== null ? `${dur} min` : "—"}</TD>
                    <TD className="text-muted-foreground">{trainerName(a.trainerId)}</TD>
                    <TD>
                      {a.status === "inside"
                        ? <Badge tone="success">Inside</Badge>
                        : <Badge tone="muted">Completed</Badge>}
                    </TD>
                    <TD className="text-right">
                      {a.status === "inside" && (
                        <Button variant="outline" size="sm" onClick={() => { checkOut(a.id); toast.success("Checked out"); }}>
                          <LogOut /> Out
                        </Button>
                      )}
                    </TD>
                  </TR>
                );
              })}
            </TBody>
          </Table>
        </CardContent>
      </Card>

      {/* Analytics */}
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Daily Attendance — Last 30 Days</CardTitle></CardHeader>
          <CardContent><BarSeries data={dailyAttendance} xKey="date" yKey="count" highlightIndex={peakIndex} /></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Highlights</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Highlight label="Average Daily Attendance" value={String(avgDaily)} />
            <Highlight label="Peak Hour" value="6 PM – 8 PM" />
            <Highlight label="Most Active Day" value="Monday" />
          </CardContent>
        </Card>
      </div>
    </>
  );
}

function Stat({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <Card className="p-5">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className={`mt-1 text-3xl font-bold ${tone === "success" ? "text-success" : tone === "primary" ? "text-primary" : ""}`}>{value}</p>
    </Card>
  );
}
function Highlight({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-accent/50 p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-lg font-bold">{value}</p>
    </div>
  );
}
