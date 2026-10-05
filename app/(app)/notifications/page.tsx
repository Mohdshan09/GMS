"use client";

import { formatDistanceToNow } from "date-fns";
import {
  BadgeIndianRupee, CalendarCheck, Activity, MessagesSquare, CreditCard,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useGymStore } from "@/lib/store";
import { NotificationCategory } from "@/lib/types";

const META: Record<NotificationCategory, { icon: React.ReactNode; tone: any; label: string }> = {
  membership: { icon: <BadgeIndianRupee className="size-4" />, tone: "primary", label: "Membership" },
  attendance: { icon: <CalendarCheck className="size-4" />, tone: "success", label: "Attendance" },
  crowd: { icon: <Activity className="size-4" />, tone: "warning", label: "Crowd" },
  community: { icon: <MessagesSquare className="size-4" />, tone: "primary", label: "Community" },
  payment: { icon: <CreditCard className="size-4" />, tone: "danger", label: "Payment" },
};

export default function NotificationsPage() {
  const notifications = useGymStore((s) => s.notifications);

  return (
    <>
      <PageHeader title="Notifications" subtitle="Everything that needs your attention" />
      <div className="space-y-3">
        {notifications.map((n) => {
          const m = META[n.category];
          return (
            <Card key={n.id} className={n.read ? "" : "border-primary/30"}>
              <CardContent className="flex items-start gap-3 py-4">
                <div className={`flex size-9 shrink-0 items-center justify-center rounded-lg bg-${m.tone === "primary" ? "primary" : m.tone}/10`} style={{ backgroundColor: "hsl(var(--accent))" }}>
                  {m.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Badge tone={m.tone}>{m.label}</Badge>
                    {!n.read && <span className="size-2 rounded-full bg-primary" />}
                  </div>
                  <p className="mt-1.5 text-sm font-medium">{n.message}</p>
                  <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </>
  );
}
