"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Star, Mail, Phone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { MemberStatusBadge } from "@/components/shared/status-badge";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { useGymStore } from "@/lib/store";

export default function TrainerProfilePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const trainer = useGymStore((s) => s.trainers.find((t) => t.id === id));
  const members = useGymStore((s) => s.members.filter((m) => m.trainerId === id));
  const classes = useGymStore((s) => s.classes.filter((c) => c.trainerId === id && !c.cancelled));

  if (!trainer) {
    return <EmptyState title="Trainer not found" action={<Button onClick={() => router.push("/trainers")}>Back</Button>} />;
  }

  return (
    <>
      <Button variant="ghost" size="sm" className="mb-3" onClick={() => router.back()}><ArrowLeft /> Back</Button>

      <Card className="mb-4">
        <CardContent className="flex flex-col gap-4 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Avatar name={trainer.name} color={trainer.avatarColor} size="lg" />
            <div>
              <h1 className="text-xl font-bold">{trainer.name}</h1>
              <Badge tone="primary" className="mt-1">{trainer.specialty}</Badge>
              <p className="mt-2 max-w-md text-sm text-muted-foreground">{trainer.bio}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge tone="warning" className="text-sm"><Star className="size-3.5" /> {trainer.rating.toFixed(1)}</Badge>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader><CardTitle>Contact</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p className="flex items-center gap-2"><Mail className="size-4 text-muted-foreground" /> {trainer.email}</p>
            <p className="flex items-center gap-2"><Phone className="size-4 text-muted-foreground" /> {trainer.phone}</p>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Today's Schedule</CardTitle></CardHeader>
          <CardContent>
            {classes.length === 0 ? (
              <p className="text-sm text-muted-foreground">No classes scheduled.</p>
            ) : (
              <ul className="space-y-2">
                {classes.slice(0, 5).map((c) => (
                  <li key={c.id} className="flex items-center justify-between rounded-lg bg-accent/50 px-3 py-2 text-sm">
                    <span className="font-medium">{c.title}</span>
                    <span className="text-muted-foreground">{c.day} · {c.startTime} · {c.booked}/{c.capacity}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader><CardTitle>Assigned Members ({members.length})</CardTitle></CardHeader>
        <CardContent>
          {members.length === 0 ? (
            <p className="text-sm text-muted-foreground">No members assigned.</p>
          ) : (
            <Table>
              <THead><TR><TH>Member</TH><TH>Status</TH><TH>Visits</TH></TR></THead>
              <TBody>
                {members.slice(0, 10).map((m) => (
                  <TR key={m.id}>
                    <TD className="flex items-center gap-2">
                      <Avatar name={m.name} color={m.avatarColor} size="sm" /> {m.name}
                    </TD>
                    <TD><MemberStatusBadge status={m.status} /></TD>
                    <TD>{m.totalVisits}</TD>
                  </TR>
                ))}
              </TBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </>
  );
}
