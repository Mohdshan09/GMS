"use client";

import { useState } from "react";
import { Plus, Users, X } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog } from "@/components/ui/dialog";
import { Input, Label, Select } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useGymStore } from "@/lib/store";
import { toast } from "@/components/ui/toast";
import { GymClass } from "@/lib/types";

const DAYS: GymClass["day"][] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function ClassesPage() {
  const classes = useGymStore((s) => s.classes);
  const trainers = useGymStore((s) => s.trainers);
  const createClass = useGymStore((s) => s.createClass);
  const cancelClass = useGymStore((s) => s.cancelClass);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", day: "Mon", startTime: "06:00", durationMin: "60", capacity: "24", trainerId: trainers[0]?.id ?? "" });

  const trainerName = (id: string) => trainers.find((t) => t.id === id)?.name ?? "—";
  const byDay = (d: string) =>
    classes.filter((c) => c.day === d).sort((a, b) => a.startTime.localeCompare(b.startTime));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title) { toast.error("Class title is required."); return; }
    createClass({
      title: form.title,
      day: form.day as GymClass["day"],
      startTime: form.startTime,
      durationMin: Number(form.durationMin),
      capacity: Number(form.capacity),
      trainerId: form.trainerId,
    });
    toast.success("Class created");
    setOpen(false);
    setForm((f) => ({ ...f, title: "" }));
  };

  return (
    <>
      <PageHeader title="Classes & Schedule" subtitle="Weekly class timetable">
        <Button onClick={() => setOpen(true)}><Plus /> Create Class</Button>
      </PageHeader>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {DAYS.map((d) => (
          <div key={d} className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground">{d}</h3>
            {byDay(d).length === 0 && <p className="text-xs text-muted-foreground">No classes</p>}
            {byDay(d).map((c) => (
              <Card key={c.id} className={c.cancelled ? "opacity-50" : ""}>
                <CardContent className="space-y-2 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs font-medium text-primary">{c.startTime}</p>
                      <p className="font-semibold leading-tight">{c.title}</p>
                    </div>
                    {c.cancelled ? (
                      <Badge tone="danger">Cancelled</Badge>
                    ) : (
                      <button
                        onClick={() => { cancelClass(c.id); toast.success("Class cancelled"); }}
                        className="text-muted-foreground hover:text-danger"
                        aria-label="Cancel class"
                      >
                        <X className="size-4" />
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{trainerName(c.trainerId)} · {c.durationMin}min</p>
                  <div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Users className="size-3" /> {c.booked}/{c.capacity}</span>
                      <span>{Math.round((c.booked / c.capacity) * 100)}%</span>
                    </div>
                    <Progress value={(c.booked / c.capacity) * 100} className="mt-1 h-1.5" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ))}
      </div>

      <Dialog open={open} onClose={() => setOpen(false)} title="Create Class" description="Add a class to the weekly schedule.">
        <form onSubmit={submit} className="grid grid-cols-2 gap-4">
          <div className="col-span-2 space-y-1.5"><Label>Title</Label><Input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="Strength Training" /></div>
          <div className="space-y-1.5"><Label>Day</Label>
            <Select value={form.day} onChange={(e) => setForm((f) => ({ ...f, day: e.target.value }))}>
              {DAYS.map((d) => <option key={d}>{d}</option>)}
            </Select>
          </div>
          <div className="space-y-1.5"><Label>Start Time</Label><Input type="time" value={form.startTime} onChange={(e) => setForm((f) => ({ ...f, startTime: e.target.value }))} /></div>
          <div className="space-y-1.5"><Label>Duration (min)</Label><Input type="number" value={form.durationMin} onChange={(e) => setForm((f) => ({ ...f, durationMin: e.target.value }))} /></div>
          <div className="space-y-1.5"><Label>Capacity</Label><Input type="number" value={form.capacity} onChange={(e) => setForm((f) => ({ ...f, capacity: e.target.value }))} /></div>
          <div className="col-span-2 space-y-1.5"><Label>Trainer</Label>
            <Select value={form.trainerId} onChange={(e) => setForm((f) => ({ ...f, trainerId: e.target.value }))}>
              {trainers.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </Select>
          </div>
          <div className="col-span-2 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit">Create</Button>
          </div>
        </form>
      </Dialog>
    </>
  );
}
