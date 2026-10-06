"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, Code2 } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Loader } from "@/components/ui/loader";
import { useGymStore } from "@/lib/store";
import { toast } from "@/components/ui/toast";

const OWNER = { email: "owner@gymdemo.com", password: "demo123" };
const DEV = { email: "developer@gymdemo.com", password: "demo123" };

export function LoginDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const login = useGymStore((s) => s.login);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const role = login(email, password);
      if (role === "owner") {
        toast.success("Welcome back, Rohan 👋");
        router.push("/dashboard");
      } else if (role === "developer") {
        toast.success("Welcome to the platform console");
        router.push("/developer");
      } else {
        toast.error("Invalid credentials. Use a demo login below.");
        setLoading(false);
      }
    }, 400);
  };

  return (
    <Dialog open={open} onClose={onClose} title="Sign in" description="Choose who you're signing in as." className="max-w-sm">
      <form onSubmit={submit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="l-email">Email</Label>
          <Input id="l-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="owner@gymdemo.com" required />
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="l-pass">Password</Label>
            <button type="button" className="text-xs text-primary hover:underline" onClick={() => toast.info("Password reset is disabled in demo.")}>
              Forgot?
            </button>
          </div>
          <Input id="l-pass" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
        </div>
        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading ? (<><Loader size={18} className="text-primary-foreground" /> Signing in…</>) : "Login"}
        </Button>
      </form>

      <div className="mt-5 space-y-2">
        <p className="text-xs font-semibold text-muted-foreground">DEMO LOGINS</p>
        <DemoRow
          icon={<Building2 className="size-4 text-primary" />}
          title="Gym Owner"
          sub="Manage a gym (members, attendance, payments…)"
          onClick={() => { setEmail(OWNER.email); setPassword(OWNER.password); }}
        />
        <DemoRow
          icon={<Code2 className="size-4 text-primary" />}
          title="Developer (you)"
          sub="Platform console — plans & gym customers"
          onClick={() => { setEmail(DEV.email); setPassword(DEV.password); }}
        />
      </div>
    </Dialog>
  );
}

function DemoRow({ icon, title, sub, onClick }: { icon: React.ReactNode; title: string; sub: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-lg border bg-card p-3 text-left transition-colors hover:border-primary/40 hover:bg-accent/50"
    >
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">{icon}</div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">{title}</p>
        <p className="truncate text-xs text-muted-foreground">{sub}</p>
      </div>
      <span className="text-xs font-medium text-primary">Use</span>
    </button>
  );
}
