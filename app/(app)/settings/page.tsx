"use client";

import { useState } from "react";
import { RotateCcw, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Segmented } from "@/components/ui/tabs";
import { useGymStore } from "@/lib/store";
import { toast } from "@/components/ui/toast";

export default function SettingsPage() {
  const gym = useGymStore((s) => s.gym);
  const resetDemo = useGymStore((s) => s.resetDemo);
  const viewRole = useGymStore((s) => s.viewRole);
  const setViewRole = useGymStore((s) => s.setViewRole);
  const [toggles, setToggles] = useState({
    expiry: true, payments: true, crowd: true, community: false,
  });

  const toggle = (k: keyof typeof toggles) =>
    setToggles((t) => ({ ...t, [k]: !t[k] }));

  return (
    <>
      <PageHeader title="Settings" subtitle="Manage your gym configuration" />

      {/* Role switcher (demo) */}
      <Card className="mb-4 border-primary/30">
        <CardHeader>
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-4 text-primary" />
            <CardTitle>Access Role (demo)</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-md text-sm text-muted-foreground">
            Switch between the <b>Developer</b> view (you — manage subscription plans) and the <b>Gym Owner</b> view (your customer — read-only plans). Currently viewing as <b>{viewRole === "developer" ? "Developer" : "Gym Owner"}</b>.
          </p>
          <Segmented
            value={viewRole}
            onChange={(v) => { setViewRole(v); toast.success(`Now viewing as ${v === "developer" ? "Developer" : "Gym Owner"}`); }}
            options={[{ label: "Gym Owner", value: "gym-owner" }, { label: "Developer", value: "developer" }]}
          />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Gym Profile</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <Field label="Gym Name" value={gym.name} />
            <Field label="Address" value={gym.address} />
            <Field label="Phone" value={gym.phone} />
            <Field label="Email" value={gym.email} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Capacity & Hours</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <Field label="Maximum Capacity" value={String(gym.capacity)} />
            <Field label="Operating Hours" value={gym.openHours} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Notifications</CardTitle></CardHeader>
          <CardContent className="space-y-1">
            <Toggle label="Membership expiry" on={toggles.expiry} onClick={() => toggle("expiry")} />
            <Toggle label="Payment reminders" on={toggles.payments} onClick={() => toggle("payments")} />
            <Toggle label="Crowd alerts" on={toggles.crowd} onClick={() => toggle("crowd")} />
            <Toggle label="Community notifications" on={toggles.community} onClick={() => toggle("community")} />
          </CardContent>
        </Card>

        <Card className="border-danger/30">
          <CardHeader><CardTitle>Demo Data</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Reset all members, payments, attendance and community data back to the original seeded demo state.
            </p>
            <Button
              variant="destructive"
              className="mt-4"
              onClick={() => { resetDemo(); toast.success("Demo data reset"); }}
            >
              <RotateCcw /> Reset Demo Data
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Input defaultValue={value} />
    </div>
  );
}

function Toggle({ label, on, onClick }: { label: string; on: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex w-full items-center justify-between py-2 text-sm">
      <span>{label}</span>
      <span className={`relative h-5 w-9 rounded-full transition-colors ${on ? "bg-primary" : "bg-muted"}`}>
        <span className={`absolute top-0.5 size-4 rounded-full bg-white transition-all ${on ? "left-4" : "left-0.5"}`} />
      </span>
    </button>
  );
}
