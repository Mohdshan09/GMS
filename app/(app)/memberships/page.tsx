"use client";

import { useState } from "react";
import { Check, Plus, Users } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog } from "@/components/ui/dialog";
import { Input, Label, Textarea } from "@/components/ui/input";
import { useGymStore } from "@/lib/store";
import { formatINR } from "@/lib/utils";
import { toast } from "@/components/ui/toast";

export default function MembershipsPage() {
  const plans = useGymStore((s) => s.plans);
  const members = useGymStore((s) => s.members);
  const createPlan = useGymStore((s) => s.createPlan);
  const updatePlan = useGymStore((s) => s.updatePlan);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", price: "", features: "" });

  const subscribers = (planId: string) => members.filter((m) => m.planId === planId).length;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price) { toast.error("Name and price are required."); return; }
    createPlan({
      name: form.name,
      price: Number(form.price),
      features: form.features.split("\n").map((f) => f.trim()).filter(Boolean),
      active: true,
    });
    toast.success("Plan created");
    setOpen(false);
    setForm({ name: "", price: "", features: "" });
  };

  return (
    <>
      <PageHeader title="Memberships" subtitle="Your plans and subscribers">
        <Button onClick={() => setOpen(true)}><Plus /> Create Plan</Button>
      </PageHeader>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {plans.map((p, i) => (
          <Card key={p.id} className={i === 2 ? "border-primary/40 shadow-md" : ""}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{p.name}</CardTitle>
                {i === 2 && <Badge tone="primary">Popular</Badge>}
                {!p.active && <Badge tone="muted">Disabled</Badge>}
              </div>
              <p className="text-3xl font-bold">{formatINR(p.price)}<span className="text-sm font-normal text-muted-foreground">/month</span></p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check className="size-4 text-success" /> {f}
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex items-center justify-between border-t pt-4">
                <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Users className="size-4" /> {subscribers(p.id)} subscribers
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    updatePlan(p.id, { active: !p.active });
                    toast.success(p.active ? "Plan disabled" : "Plan enabled");
                  }}
                >
                  {p.active ? "Disable" : "Enable"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={open} onClose={() => setOpen(false)} title="Create Plan" description="Add a new membership plan.">
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-1.5"><Label>Plan Name</Label><Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Elite" /></div>
          <div className="space-y-1.5"><Label>Monthly Price (₹)</Label><Input type="number" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} placeholder="2999" /></div>
          <div className="space-y-1.5"><Label>Features (one per line)</Label><Textarea value={form.features} onChange={(e) => setForm((f) => ({ ...f, features: e.target.value }))} placeholder={"Unlimited access\nPersonal training"} /></div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit">Create</Button>
          </div>
        </form>
      </Dialog>
    </>
  );
}
