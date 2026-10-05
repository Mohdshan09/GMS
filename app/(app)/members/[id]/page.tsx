"use client";

import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  ArrowLeft, Phone, Mail, MapPin, CalendarDays, Flame, Trophy,
  MessagesSquare, Dumbbell, CalendarCheck,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { MemberStatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { useGymStore } from "@/lib/store";
import { formatINR } from "@/lib/utils";
import { toast } from "@/components/ui/toast";

export default function MemberProfilePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const member = useGymStore((s) => s.members.find((m) => m.id === id));
  const plan = useGymStore((s) => s.plans.find((p) => p.id === member?.planId));
  const trainer = useGymStore((s) => s.trainers.find((t) => t.id === member?.trainerId));
  const attendance = useGymStore((s) => s.attendance.filter((a) => a.memberId === id));
  const checkIn = useGymStore((s) => s.checkIn);

  if (!member) {
    return <EmptyState title="Member not found" action={<Button onClick={() => router.push("/members")}>Back to Members</Button>} />;
  }

  return (
    <>
      <Button variant="ghost" size="sm" className="mb-3" onClick={() => router.back()}>
        <ArrowLeft /> Back
      </Button>

      {/* Hero */}
      <Card className="mb-4">
        <CardContent className="flex flex-col gap-4 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Avatar name={member.name} color={member.avatarColor} size="lg" />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold">{member.name}</h1>
                <MemberStatusBadge status={member.status} />
              </div>
              <p className="text-sm text-muted-foreground">{member.code} · Joined {format(new Date(member.joinedAt), "dd MMM yyyy")}</p>
            </div>
          </div>
          <Button onClick={() => { checkIn(member.id); toast.success("Checked in"); }}>
            <CalendarCheck /> Check In
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Left column */}
        <div className="space-y-4 lg:col-span-2">
          <Card>
            <CardHeader><CardTitle>Personal Information</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Info icon={<Phone className="size-4" />} label="Phone" value={member.phone} />
              <Info icon={<Mail className="size-4" />} label="Email" value={member.email} />
              <Info icon={<CalendarDays className="size-4" />} label="Date of Birth" value={format(new Date(member.dob), "dd MMM yyyy")} />
              <Info icon={<MapPin className="size-4" />} label="Address" value={member.address} />
              <Info icon={<Dumbbell className="size-4" />} label="Trainer" value={trainer?.name ?? "Unassigned"} />
              <Info icon={<Phone className="size-4" />} label="Emergency" value={member.emergencyContact} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Activity Timeline</CardTitle></CardHeader>
            <CardContent>
              {attendance.length === 0 ? (
                <p className="text-sm text-muted-foreground">No recent check-ins recorded.</p>
              ) : (
                <ol className="space-y-4">
                  {attendance.slice(0, 6).map((a) => (
                    <li key={a.id} className="flex gap-3">
                      <div className="mt-1 size-2 shrink-0 rounded-full bg-primary" />
                      <div className="text-sm">
                        <p className="font-medium">Checked in at {format(new Date(a.checkIn), "h:mm a")}</p>
                        <p className="text-muted-foreground">
                          {format(new Date(a.checkIn), "dd MMM yyyy")}
                          {a.checkOut ? ` · left ${format(new Date(a.checkOut), "h:mm a")}` : " · currently inside"}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle>Membership</CardTitle></CardHeader>
            <CardContent>
              <p className="text-lg font-bold">{plan?.name} Plan</p>
              <p className="text-sm text-muted-foreground">{plan ? formatINR(plan.price) : "—"}/month</p>
              <div className="mt-3 rounded-lg bg-accent/60 p-3 text-sm">
                <p className="text-muted-foreground">Expires</p>
                <p className="font-semibold">{format(new Date(member.expiryDate), "dd MMM yyyy")}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Attendance</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              <Row label="Total Visits" value={String(member.totalVisits)} />
              <Row label="Current Streak" value={`${member.streak} days`} icon={<Flame className="size-4 text-warning" />} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Community</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              <Row label="Community Points" value={String(member.communityPoints)} icon={<Trophy className="size-4 text-primary" />} />
              <Row label="Engagement" value="Active" icon={<MessagesSquare className="size-4 text-primary" />} />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

function Info({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 text-muted-foreground">{icon}</div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}

function Row({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="flex items-center gap-1.5 font-semibold">{icon}{value}</span>
    </div>
  );
}
