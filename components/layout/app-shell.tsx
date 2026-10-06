"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { FullPageLoader } from "@/components/ui/loader";
import { useGymStore } from "@/lib/store";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const authUser = useGymStore((s) => s.authUser);

  const inDevArea = pathname.startsWith("/developer");
  const isDev = authUser?.role === "developer";
  // Settings is shared between both roles.
  const wrongArea = authUser
    ? pathname !== "/settings" && (isDev ? !inDevArea : inDevArea)
    : false;

  // Wait for zustand persist to rehydrate before deciding on auth.
  useEffect(() => setHydrated(true), []);
  useEffect(() => {
    if (!hydrated) return;
    if (!authUser) { router.replace("/"); return; }
    if (wrongArea) router.replace(isDev ? "/developer" : "/dashboard");
  }, [hydrated, authUser, wrongArea, isDev, router]);

  if (!hydrated || !authUser || wrongArea) {
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
