"use client";

import { useMemo, useState } from "react";
import { format } from "date-fns";
import { Search, Building2 } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Segmented } from "@/components/ui/tabs";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { EmptyState } from "@/components/shared/empty-state";
import { useGymStore } from "@/lib/store";
import { formatINR } from "@/lib/utils";
import { planName } from "@/lib/services/queries";
import { Customer } from "@/lib/types";

const statusTone = { active: "success", trial: "warning", churned: "danger" } as const;
type Filter = "all" | Customer["status"];

export default function CustomersPage() {
  const customers = useGymStore((s) => s.customers);
  const saasPlans = useGymStore((s) => s.saasPlans);
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return customers.filter((c) => {
      if (filter !== "all" && c.status !== filter) return false;
      if (!q) return true;
      return [c.gymName, c.ownerName, c.city].some((f) => f.toLowerCase().includes(q));
    });
  }, [customers, filter, query]);

  return (
    <>
      <PageHeader title="Gym Customers" subtitle={`${customers.length} gyms on the platform`} />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Segmented
          value={filter}
          onChange={setFilter}
          options={[
            { label: "All", value: "all" },
            { label: "Active", value: "active" },
            { label: "Trial", value: "trial" },
            { label: "Churned", value: "churned" },
          ]}
        />
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search gym, owner, city…" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
      </div>

      <Card>
        {rows.length === 0 ? (
          <EmptyState title="No gyms found" description="Try another filter or search." icon={<Building2 className="size-10" />} />
        ) : (
          <Table>
            <THead>
              <TR><TH>Gym</TH><TH>Owner</TH><TH>City</TH><TH>Plan</TH><TH>Members</TH><TH>MRR</TH><TH>Joined</TH><TH>Status</TH></TR>
            </THead>
            <TBody>
              {rows.map((c) => (
                <TR key={c.id}>
                  <TD className="flex items-center gap-2">
                    <Avatar name={c.gymName} size="sm" />
                    <span className="font-medium">{c.gymName}</span>
                  </TD>
                  <TD className="text-muted-foreground">{c.ownerName}</TD>
                  <TD className="text-muted-foreground">{c.city}</TD>
                  <TD>{planName(saasPlans, c.planId)}</TD>
                  <TD>{c.members}</TD>
                  <TD className="font-medium">{c.mrr ? formatINR(c.mrr) : "—"}</TD>
                  <TD className="text-muted-foreground">{format(new Date(c.joinedAt), "dd MMM yyyy")}</TD>
                  <TD><Badge tone={statusTone[c.status]}>{c.status}</Badge></TD>
                </TR>
              ))}
            </TBody>
          </Table>
        )}
      </Card>
    </>
  );
}
