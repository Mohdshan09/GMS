"use client";

import { useMemo, useState } from "react";
import { format } from "date-fns";
import {
  Plus, Search, Wrench, Trash2, Boxes, AlertTriangle, IndianRupee, Pencil,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label, Select } from "@/components/ui/input";
import { Segmented } from "@/components/ui/tabs";
import { Dialog } from "@/components/ui/dialog";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { EmptyState } from "@/components/shared/empty-state";
import { CATEGORY_ICON, ConditionBadge } from "@/components/shared/equipment-meta";
import { useGymStore } from "@/lib/store";
import { formatINR } from "@/lib/utils";
import { toast } from "@/components/ui/toast";
import { Equipment, EquipmentCategory } from "@/lib/types";

const CATEGORIES: EquipmentCategory[] = [
  "Cardio", "Strength Machines", "Free Weights", "Functional", "Accessories",
];
type Filter = "all" | EquipmentCategory;

export default function EquipmentPage() {
  const equipment = useGymStore((s) => s.equipment);
  const addEquipment = useGymStore((s) => s.addEquipment);
  const updateEquipment = useGymStore((s) => s.updateEquipment);
  const removeEquipment = useGymStore((s) => s.removeEquipment);
  const serviceEquipment = useGymStore((s) => s.serviceEquipment);

  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const today = format(new Date(), "yyyy-MM-dd");
  const emptyForm = {
    name: "", category: "Cardio" as EquipmentCategory, brand: "", quantity: "1",
    location: "", condition: "excellent", cost: "", purchaseDate: today,
  };
  const [form, setForm] = useState(emptyForm);

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setOpen(true);
  };
  const openEdit = (e: Equipment) => {
    setEditingId(e.id);
    setForm({
      name: e.name,
      category: e.category,
      brand: e.brand,
      quantity: String(e.quantity),
      location: e.location,
      condition: e.condition,
      cost: String(e.cost),
      purchaseDate: format(new Date(e.purchaseDate), "yyyy-MM-dd"),
    });
    setOpen(true);
  };

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return equipment.filter((e) => {
      if (filter !== "all" && e.category !== filter) return false;
      if (!q) return true;
      return [e.name, e.brand, e.location].some((f) => f.toLowerCase().includes(q));
    });
  }, [equipment, filter, query]);

  const totalItems = equipment.reduce((s, e) => s + e.quantity, 0);
  const needsService = equipment.filter((e) => e.condition === "needs-service").length;
  const outOfOrder = equipment.filter((e) => e.condition === "out-of-order").length;
  const assetValue = equipment.reduce((s, e) => s + e.cost * e.quantity, 0);

  const submit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!form.name || !form.brand) { toast.error("Name and brand are required."); return; }
    const payload = {
      name: form.name,
      category: form.category,
      brand: form.brand,
      quantity: Number(form.quantity) || 1,
      location: form.location || "Main Floor",
      condition: form.condition as any,
      cost: Number(form.cost) || 0,
      purchaseDate: new Date(form.purchaseDate).toISOString(),
    };
    if (editingId) {
      updateEquipment(editingId, payload);
      toast.success("Equipment updated");
    } else {
      addEquipment({ ...payload, lastServiced: new Date().toISOString() });
      toast.success("Equipment added");
    }
    setOpen(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  return (
    <>
      <PageHeader title="Equipment" subtitle="Track and maintain your gym's inventory">
        <Button onClick={openAdd}><Plus /> Add Equipment</Button>
      </PageHeader>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat icon={<Boxes className="size-4" />} label="Total Items" value={String(totalItems)} />
        <Stat icon={<AlertTriangle className="size-4" />} label="Needs Service" value={String(needsService)} tone="text-warning" />
        <Stat icon={<AlertTriangle className="size-4" />} label="Out of Order" value={String(outOfOrder)} tone="text-danger" />
        <Stat icon={<IndianRupee className="size-4" />} label="Asset Value" value={formatINR(assetValue, { compact: true })} />
      </div>

      {/* Filters */}
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Segmented
          value={filter}
          onChange={(v) => setFilter(v)}
          options={[{ label: "All", value: "all" }, ...CATEGORIES.map((c) => ({ label: c, value: c }))]}
        />
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search name, brand, zone…" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
      </div>

      {/* Listing */}
      <Card className="mt-4">
        {rows.length === 0 ? (
          <EmptyState title="No equipment found" description="Try another category or add a new item." />
        ) : (
          <Table>
            <THead>
              <TR>
                <TH>Equipment</TH><TH>Category</TH><TH>Qty</TH><TH>Location</TH>
                <TH>Condition</TH><TH>Last Serviced</TH><TH>Value</TH><TH className="text-right">Actions</TH>
              </TR>
            </THead>
            <TBody>
              {rows.map((e) => {
                const Icon = CATEGORY_ICON[e.category];
                return (
                  <TR key={e.id}>
                    <TD>
                      <div className="flex items-center gap-3">
                        <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <Icon className="size-4" />
                        </div>
                        <div>
                          <p className="font-medium">{e.name}</p>
                          <p className="text-xs text-muted-foreground">{e.brand}</p>
                        </div>
                      </div>
                    </TD>
                    <TD className="text-muted-foreground">{e.category}</TD>
                    <TD>{e.quantity}</TD>
                    <TD className="text-muted-foreground">{e.location}</TD>
                    <TD><ConditionBadge condition={e.condition} /></TD>
                    <TD className="text-muted-foreground">{format(new Date(e.lastServiced), "dd MMM yyyy")}</TD>
                    <TD className="font-medium">{formatINR(e.cost * e.quantity, { compact: true })}</TD>
                    <TD>
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" aria-label="Edit" onClick={() => openEdit(e)}>
                          <Pencil />
                        </Button>
                        <Button variant="ghost" size="icon" aria-label="Mark serviced"
                          onClick={() => { serviceEquipment(e.id); toast.success(`${e.name} marked serviced`); }}>
                          <Wrench />
                        </Button>
                        <Button variant="ghost" size="icon" aria-label="Remove"
                          onClick={() => { removeEquipment(e.id); toast.success("Equipment removed"); }}>
                          <Trash2 className="text-danger" />
                        </Button>
                      </div>
                    </TD>
                  </TR>
                );
              })}
            </TBody>
          </Table>
        )}
      </Card>

      {/* Add dialog */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title={editingId ? "Edit Equipment" : "Add Equipment"}
        description={editingId ? "Update this inventory record." : "Register a new item in your inventory."}
      >
        <form onSubmit={submit} className="grid grid-cols-2 gap-4">
          <div className="col-span-2 space-y-1.5"><Label>Name</Label><Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Treadmill Pro X9" /></div>
          <div className="space-y-1.5"><Label>Category</Label>
            <Select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as EquipmentCategory }))}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </Select>
          </div>
          <div className="space-y-1.5"><Label>Brand</Label><Input value={form.brand} onChange={(e) => setForm((f) => ({ ...f, brand: e.target.value }))} placeholder="Technogym" /></div>
          <div className="space-y-1.5"><Label>Quantity</Label><Input type="number" min="1" value={form.quantity} onChange={(e) => setForm((f) => ({ ...f, quantity: e.target.value }))} /></div>
          <div className="space-y-1.5"><Label>Unit Cost (₹)</Label><Input type="number" value={form.cost} onChange={(e) => setForm((f) => ({ ...f, cost: e.target.value }))} placeholder="120000" /></div>
          <div className="space-y-1.5"><Label>Location / Zone</Label><Input value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} placeholder="Cardio Zone" /></div>
          <div className="space-y-1.5"><Label>Condition</Label>
            <Select value={form.condition} onChange={(e) => setForm((f) => ({ ...f, condition: e.target.value }))}>
              <option value="excellent">Excellent</option>
              <option value="good">Good</option>
              <option value="needs-service">Needs Service</option>
              <option value="out-of-order">Out of Order</option>
            </Select>
          </div>
          <div className="col-span-2 space-y-1.5"><Label>Purchase Date</Label><Input type="date" value={form.purchaseDate} onChange={(e) => setForm((f) => ({ ...f, purchaseDate: e.target.value }))} /></div>
          <div className="col-span-2 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit">{editingId ? "Save Changes" : "Add Equipment"}</Button>
          </div>
        </form>
      </Dialog>
    </>
  );
}

function Stat({ icon, label, value, tone }: { icon: React.ReactNode; label: string; value: string; tone?: string }) {
  return (
    <Card className="p-5">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">{icon}{label}</div>
      <p className={`mt-2 text-2xl font-bold ${tone ?? ""}`}>{value}</p>
    </Card>
  );
}
