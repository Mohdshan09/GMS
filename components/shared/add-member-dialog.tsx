"use client";

import { useState } from "react";
import { addMonths, format } from "date-fns";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input, Label, Select } from "@/components/ui/input";
import { useGymStore } from "@/lib/store";
import { toast } from "@/components/ui/toast";

export function AddMemberDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const plans = useGymStore((s) => s.plans);
  const trainers = useGymStore((s) => s.trainers);
  const addMember = useGymStore((s) => s.addMember);

  const today = format(new Date(), "yyyy-MM-dd");
  const [form, setForm] = useState({
    name: "", email: "", phone: "", gender: "Male", dob: "",
    address: "", emergencyContact: "", planId: plans[0]?.id ?? "",
    startDate: today, expiryDate: format(addMonths(new Date(), 1), "yyyy-MM-dd"),
    trainerId: "",
  });

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone) {
      toast.error("Name and phone are required.");
      return;
    }
    addMember({
      ...form,
      gender: form.gender as any,
      dob: form.dob || today,
      trainerId: form.trainerId || null,
    });
    toast.success("Member added successfully");
    onClose();
    setForm((f) => ({ ...f, name: "", email: "", phone: "", dob: "", address: "", emergencyContact: "" }));
  };

  return (
    <Dialog open={open} onClose={onClose} title="Add Member" description="Create a new gym membership.">
      <form onSubmit={submit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Full Name" required>
          <Input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Rahul Sharma" />
        </Field>
        <Field label="Phone" required>
          <Input value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+91 98XXX XXXXX" />
        </Field>
        <Field label="Email">
          <Input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="rahul@gmail.com" />
        </Field>
        <Field label="Date of Birth">
          <Input type="date" value={form.dob} onChange={(e) => set("dob", e.target.value)} />
        </Field>
        <Field label="Gender">
          <Select value={form.gender} onChange={(e) => set("gender", e.target.value)}>
            <option>Male</option><option>Female</option><option>Other</option>
          </Select>
        </Field>
        <Field label="Emergency Contact">
          <Input value={form.emergencyContact} onChange={(e) => set("emergencyContact", e.target.value)} placeholder="+91 ..." />
        </Field>
        <Field label="Address" className="sm:col-span-2">
          <Input value={form.address} onChange={(e) => set("address", e.target.value)} placeholder="Area, City" />
        </Field>
        <Field label="Membership Plan">
          <Select value={form.planId} onChange={(e) => set("planId", e.target.value)}>
            {plans.map((p) => (
              <option key={p.id} value={p.id}>{p.name} — ₹{p.price}/mo</option>
            ))}
          </Select>
        </Field>
        <Field label="Assigned Trainer">
          <Select value={form.trainerId} onChange={(e) => set("trainerId", e.target.value)}>
            <option value="">Unassigned</option>
            {trainers.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </Select>
        </Field>
        <Field label="Start Date">
          <Input type="date" value={form.startDate} onChange={(e) => set("startDate", e.target.value)} />
        </Field>
        <Field label="Expiry Date">
          <Input type="date" value={form.expiryDate} onChange={(e) => set("expiryDate", e.target.value)} />
        </Field>

        <div className="mt-2 flex justify-end gap-2 sm:col-span-2">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit">Add Member</Button>
        </div>
      </form>
    </Dialog>
  );
}

function Field({
  label, required, className, children,
}: {
  label: string; required?: boolean; className?: string; children: React.ReactNode;
}) {
  return (
    <div className={`space-y-1.5 ${className ?? ""}`}>
      <Label>
        {label} {required && <span className="text-danger">*</span>}
      </Label>
      {children}
    </div>
  );
}
