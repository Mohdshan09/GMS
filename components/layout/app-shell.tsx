"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { FullPageLoader } from "@/components/ui/loader";
import { useGymStore } from "@/lib/store";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const router = useRouter();
  const authUser = useGymStore((s) => s.authUser);

  // Wait for zustand persist to rehydrate before deciding on auth.
  useEffect(() => setHydrated(true), []);
  useEffect(() => {
    if (hydrated && !authUser) router.replace("/");
  }, [hydrated, authUser, router]);

  if (!hydrated || !authUser) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <FullPageLoader />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onMenu={() => setMobileOpen(true)} />
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
