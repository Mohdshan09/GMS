"use client";

import { useState } from "react";
import { Check, Plus, Building2 } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog } from "@/components/ui/dialog";
import { Input, Label, Textarea } from "@/components/ui/input";
import { useGymStore } from "@/lib/store";
import { formatINR } from "@/lib/utils";
import { toast } from "@/components/ui/toast";

export default function SaasPlansPage() {
  const saasPlans = useGymStore((s) => s.saasPlans);
  const customers = useGymStore((s) => s.customers);
  const createSaasPlan = useGymStore((s) => s.createSaasPlan);
  const updateSaasPlan = useGymStore((s) => s.updateSaasPlan);

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", tagline: "", price: "", features: "" });

  const gymsOn = (planId: string) => customers.filter((c) => c.planId === planId && c.status !== "churned").length;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price) { toast.error("Name and price are required."); return; }
    createSaasPlan({
      name: form.name,
      tagline: form.tagline || undefined,
      price: Number(form.price),
      features: form.features.split("\n").map((f) => f.trim()).filter(Boolean),
      active: true,
    });
    toast.success("Plan created");
    setOpen(false);
    setForm({ name: "", tagline: "", price: "", features: "" });
  };

  return (
    <>
      <PageHeader title="Subscription Plans" subtitle="The tiers your gym-owner customers subscribe to">
        <Button onClick={() => setOpen(true)}><Plus /> Create Plan</Button>
      </PageHeader>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {saasPlans.map((p, i) => (
          <Card key={p.id} className={i === 2 ? "border-primary/40 shadow-md" : ""}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{p.name}</CardTitle>
                {i === 2 && <Badge tone="primary">Best value</Badge>}
                {!p.active && <Badge tone="muted">Disabled</Badge>}
              </div>
              <p className="text-3xl font-bold">{formatINR(p.price)}<span className="text-sm font-normal text-muted-foreground">/month</span></p>
              {p.tagline && <p className="text-sm font-medium text-muted-foreground">{p.tagline}</p>}
            </CardHeader>
            <CardContent>
              <ul className="space-y-2.5">
                {p.features.map((f) => {
                  const isInherit = f.toLowerCase().startsWith("everything in");
                  const isHero = /crowd intelligence|community/i.test(f);
                  if (isInherit) {
                    return <li key={f} className="pb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{f}</li>;
                  }
                  return (
                    <li key={f} className={`flex items-start gap-2 text-sm ${isHero ? "font-semibold text-primary" : ""}`}>
                      <Check className={`mt-0.5 size-4 shrink-0 ${isHero ? "text-primary" : "text-success"}`} /> {f}
                    </li>
                  );
                })}
              </ul>
              <div className="mt-5 flex items-center justify-between border-t pt-4">
                <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Building2 className="size-4" /> {gymsOn(p.id)} gyms
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => { updateSaasPlan(p.id, { active: !p.active }); toast.success(p.active ? "Plan disabled" : "Plan enabled"); }}
                >
                  {p.active ? "Disable" : "Enable"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={open} onClose={() => setOpen(false)} title="Create Subscription Plan" description="Add a new platform tier.">
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-1.5"><Label>Plan Name</Label><Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Scale" /></div>
          <div className="space-y-1.5"><Label>Tagline</Label><Input value={form.tagline} onChange={(e) => setForm((f) => ({ ...f, tagline: e.target.value }))} placeholder="For multi-branch gyms" /></div>
          <div className="space-y-1.5"><Label>Monthly Price (₹)</Label><Input type="number" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} placeholder="4999" /></div>
          <div className="space-y-1.5"><Label>Features (one per line)</Label><Textarea value={form.features} onChange={(e) => setForm((f) => ({ ...f, features: e.target.value }))} placeholder={"Everything in Premium\nMulti-branch management\n24/7 priority support"} /></div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit">Create</Button>
          </div>
        </form>
      </Dialog>
    </>
  );
}
