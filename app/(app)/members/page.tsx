"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { Search, UserPlus, Eye } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Segmented } from "@/components/ui/tabs";
import { Avatar } from "@/components/ui/avatar";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { MemberStatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { AddMemberDialog } from "@/components/shared/add-member-dialog";
import { useGymStore } from "@/lib/store";
import { planName } from "@/lib/services/queries";
import { MemberStatus } from "@/lib/types";

type Filter = "all" | MemberStatus;
const PAGE_SIZE = 10;

export default function MembersPage() {
  const members = useGymStore((s) => s.members);
  const plans = useGymStore((s) => s.plans);
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [addOpen, setAddOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return members.filter((m) => {
      if (filter !== "all" && m.status !== filter) return false;
      if (!q) return true;
      return (
        m.name.toLowerCase().includes(q) ||
        m.phone.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.code.toLowerCase().includes(q)
      );
    });
  }, [members, filter, query]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const rows = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  return (
    <>
      <PageHeader title="Members" subtitle={`${members.length} total members`}>
        <Button onClick={() => setAddOpen(true)}>
          <UserPlus /> Add Member
        </Button>
      </PageHeader>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Segmented
          value={filter}
          onChange={(v) => { setFilter(v); setPage(1); }}
          options={[
            { label: "All", value: "all" },
            { label: "Active", value: "active" },
            { label: "Expiring", value: "expiring" },
            { label: "Expired", value: "expired" },
            { label: "New", value: "new" },
            { label: "Inactive", value: "inactive" },
          ]}
        />
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search name, phone, email, ID…"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(1); }}
          />
        </div>
      </div>

      <Card>
        {rows.length === 0 ? (
          <EmptyState title="No members found" description="Try adjusting your filters or search." />
        ) : (
          <Table>
            <THead>
              <TR>
                <TH>Member</TH><TH>Phone</TH><TH>Membership</TH><TH>Status</TH>
                <TH>Last Visit</TH><TH>Visits</TH><TH>Expiry</TH><TH className="text-right">Actions</TH>
              </TR>
            </THead>
            <TBody>
              {rows.map((m) => (
                <TR key={m.id}>
                  <TD>
                    <Link href={`/members/${m.id}`} className="flex items-center gap-3 hover:underline">
                      <Avatar name={m.name} color={m.avatarColor} size="sm" />
                      <div>
                        <p className="font-medium">{m.name}</p>
                        <p className="text-xs text-muted-foreground">{m.code}</p>
                      </div>
                    </Link>
                  </TD>
                  <TD className="text-muted-foreground">{m.phone}</TD>
                  <TD>{planName(plans, m.planId)}</TD>
                  <TD><MemberStatusBadge status={m.status} /></TD>
                  <TD className="text-muted-foreground">{m.lastVisit ? format(new Date(m.lastVisit), "dd MMM") : "—"}</TD>
                  <TD>{m.totalVisits}</TD>
                  <TD className="text-muted-foreground">{format(new Date(m.expiryDate), "dd MMM yyyy")}</TD>
                  <TD className="text-right">
                    <Link href={`/members/${m.id}`}>
                      <Button variant="ghost" size="icon" aria-label="View"><Eye /></Button>
                    </Link>
                  </TD>
                </TR>
              ))}
            </TBody>
          </Table>
        )}
      </Card>

      {pages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm">
          <p className="text-muted-foreground">
            Showing {(current - 1) * PAGE_SIZE + 1}–{Math.min(current * PAGE_SIZE, filtered.length)} of {filtered.length}
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={current <= 1} onClick={() => setPage(current - 1)}>Previous</Button>
            <Button variant="outline" size="sm" disabled={current >= pages} onClick={() => setPage(current + 1)}>Next</Button>
          </div>
        </div>
      )}

      <AddMemberDialog open={addOpen} onClose={() => setAddOpen(false)} />
    </>
  );
}
