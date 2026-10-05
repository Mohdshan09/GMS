"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Loader } from "@/components/ui/loader";
import { useGymStore } from "@/lib/store";
import { toast } from "@/components/ui/toast";

const DEMO_EMAIL = "admin@gymdemo.com";
const DEMO_PASSWORD = "demo123";

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
      if (login(email, password)) {
        toast.success("Welcome back, Shan 👋");
        router.push("/dashboard");
      } else {
        toast.error("Invalid credentials. Use the demo login.");
        setLoading(false);
      }
    }, 400);
  };

  return (
    <Dialog open={open} onClose={onClose} title="Sign in" description="Access your gym dashboard." className="max-w-sm">
      <form onSubmit={submit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="l-email">Email</Label>
          <Input id="l-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@gymdemo.com" required />
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

      <div className="mt-5 rounded-lg bg-muted/50 p-3">
        <div className="flex items-center justify-between gap-3">
          <div className="text-xs">
            <p className="font-semibold text-muted-foreground">DEMO CREDENTIALS</p>
            <p className="mt-1 font-mono">{DEMO_EMAIL}</p>
            <p className="font-mono text-muted-foreground">{DEMO_PASSWORD}</p>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={() => { setEmail(DEMO_EMAIL); setPassword(DEMO_PASSWORD); }}>
            Autofill
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
