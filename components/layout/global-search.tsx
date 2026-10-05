"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Users, Dumbbell } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { useGymStore } from "@/lib/store";

interface Result {
  id: string;
  name: string;
  sub: string;
  color: string;
  href: string;
  kind: "member" | "trainer";
}

export function GlobalSearch() {
  const router = useRouter();
  const members = useGymStore((s) => s.members);
  const trainers = useGymStore((s) => s.trainers);
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  const results = useMemo<Result[]>(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const m: Result[] = members
      .filter((x) =>
        [x.name, x.phone, x.email, x.code].some((f) => f.toLowerCase().includes(q))
      )
      .slice(0, 6)
      .map((x) => ({ id: x.id, name: x.name, sub: `${x.code} · ${x.phone}`, color: x.avatarColor, href: `/members/${x.id}`, kind: "member" }));
    const t: Result[] = trainers
      .filter((x) => [x.name, x.specialty].some((f) => f.toLowerCase().includes(q)))
      .slice(0, 3)
      .map((x) => ({ id: x.id, name: x.name, sub: x.specialty, color: x.avatarColor, href: `/trainers/${x.id}`, kind: "trainer" }));
    return [...m, ...t];
  }, [query, members, trainers]);

  const go = (href: string) => {
    router.push(href);
    setQuery("");
    setFocused(false);
    (document.activeElement as HTMLElement)?.blur();
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (results[0]) go(results[0].href);
  };

  const show = focused && query.trim().length > 0;

  return (
    <div ref={boxRef} className="relative hidden flex-1 md:block md:max-w-md">
      <form onSubmit={onSubmit}>
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          placeholder="Search members, trainers…"
          className="h-9 w-full rounded-md border border-input bg-card pl-9 pr-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </form>

      {show && (
        <div className="absolute left-0 right-0 top-11 z-50 overflow-hidden rounded-lg border bg-card shadow-lg animate-fade-in">
          {results.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-muted-foreground">No results for “{query}”</p>
          ) : (
            <ul className="max-h-80 overflow-y-auto py-1">
              {results.map((r) => (
                <li key={`${r.kind}-${r.id}`}>
                  <button
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => go(r.href)}
                    className="flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-accent"
                  >
                    <Avatar name={r.name} color={r.color} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{r.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{r.sub}</p>
                    </div>
                    {r.kind === "member" ? (
                      <Users className="size-3.5 text-muted-foreground" />
                    ) : (
                      <Dumbbell className="size-3.5 text-muted-foreground" />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
