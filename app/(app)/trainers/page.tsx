"use client";

import Link from "next/link";
import { Star, Users, CalendarCheck } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { useGymStore } from "@/lib/store";

export default function TrainersPage() {
  const trainers = useGymStore((s) => s.trainers);

  return (
    <>
      <PageHeader title="Trainers" subtitle={`${trainers.length} active trainers`} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {trainers.map((t) => (
          <Link key={t.id} href={`/trainers/${t.id}`}>
            <Card className="transition-colors hover:border-primary/40">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <Avatar name={t.name} color={t.avatarColor} size="lg" />
                  <div>
                    <p className="font-semibold">{t.name}</p>
                    <Badge tone="primary" className="mt-1">{t.specialty}</Badge>
                  </div>
                </div>
                <div className="mt-5 grid grid-cols-3 gap-2 text-center">
                  <Stat icon={<Users className="size-4" />} value={String(t.memberCount)} label="Members" />
                  <Stat icon={<CalendarCheck className="size-4" />} value={String(t.todaySessions)} label="Today" />
                  <Stat icon={<Star className="size-4 text-warning" />} value={t.rating.toFixed(1)} label="Rating" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </>
  );
}

function Stat({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="rounded-lg bg-accent/50 py-3">
      <div className="flex items-center justify-center text-muted-foreground">{icon}</div>
      <p className="mt-1 text-lg font-bold">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
