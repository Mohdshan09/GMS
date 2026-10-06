"use client";

import { useState } from "react";
import {
  Activity, MessagesSquare, Users, CalendarCheck, CreditCard, CalendarDays,
  BarChart3, Flame, Trophy, ArrowRight, Check, Sparkles, TrendingUp,
  ShieldCheck, Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { LoginDialog } from "@/components/landing/login-dialog";
import { DumbbellField } from "@/components/landing/decor";

const GYM_HERO = "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1920&q=80";
const GYM_CTA = "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1920&q=80";

export default function LandingPage() {
  const [loginOpen, setLoginOpen] = useState(false);
  const open = () => setLoginOpen(true);

  return (
    <div className="min-h-screen bg-background">
      <Nav onLogin={open} />
      <Hero onLogin={open} />
      <CrowdSection onLogin={open} />
      <CommunitySection onLogin={open} />
      <CoreFeatures />
      <StatsBand />
      <Pricing onLogin={open} />
      <FinalCta onLogin={open} />
      <Footer />
      <LoginDialog open={loginOpen} onClose={() => setLoginOpen(false)} />
    </div>
  );
}

/* ---------------- Nav ---------------- */
function Nav({ onLogin }: { onLogin: () => void }) {
  const links = [
    { label: "Crowd Intelligence", href: "#crowd" },
    { label: "Community", href: "#community" },
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
  ];
  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a href="#top" className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">PH</div>
          <span className="font-bold">PowerHouse</span>
        </a>
        <nav className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              {l.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-1.5">
          <ThemeToggle />
          <Button variant="ghost" size="sm" onClick={onLogin}>Sign in</Button>
          <Button size="sm" onClick={onLogin}>Book a demo</Button>
        </div>
      </div>
    </header>
  );
}

/* ---------------- Hero ---------------- */
function Hero({ onLogin }: { onLogin: () => void }) {
  return (
    <section id="top" className="relative overflow-hidden bg-neutral-950 text-white">
      {/* gym photo background + overlays */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={{ backgroundImage: `url('${GYM_HERO}')` }}
        aria-hidden
      />
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/80 via-neutral-950/70 to-neutral-950" aria-hidden />
      <DumbbellField />

      <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-20 text-center sm:px-6 sm:pt-28">
        <p className="eyebrow mb-4 text-xs text-primary">
          Crowd Intelligence · Community · Gym OS
        </p>
        <h1 className="heading-xl mx-auto max-w-4xl text-5xl font-bold sm:text-7xl">
          Train hard. <span className="text-primary">Run it smarter.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-white/70">
          The all-in-one platform that doesn't just run your gym — it shows you how your gym actually behaves and keeps your members coming back long after the last rep.
        </p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button size="lg" onClick={onLogin}>Get started <ArrowRight /></Button>
          <Button size="lg" variant="outline" className="border-white/30 bg-white/5 text-white hover:bg-white/10" onClick={onLogin}>
            Sign in to demo
          </Button>
        </div>
        <p className="mt-4 flex items-center justify-center gap-2 text-xs text-white/50">
          <Sparkles className="size-3.5" /> No setup required · Explore with live demo data
        </p>

        {/* Dashboard preview mock */}
        <div className="mx-auto mt-16 max-w-4xl">
          <DashboardPreview />
        </div>
      </div>
    </section>
  );
}

function DashboardPreview() {
  return (
    <Card className="overflow-hidden p-0 text-left shadow-xl">
      <div className="flex items-center gap-1.5 border-b bg-muted/40 px-4 py-3">
        <span className="size-3 rounded-full bg-danger/60" />
        <span className="size-3 rounded-full bg-warning/60" />
        <span className="size-3 rounded-full bg-success/60" />
        <span className="ml-3 text-xs text-muted-foreground">PowerHouse · Dashboard</span>
      </div>
      <div className="grid gap-4 p-5 sm:grid-cols-3">
        <MiniKpi label="Total Members" value="1,248" delta="+8.2%" />
        <MiniKpi label="Today's Attendance" value="186" delta="+12%" />
        <MiniKpi label="Monthly Revenue" value="₹4.82L" delta="+14.6%" />
        <div className="rounded-lg border bg-card p-4 sm:col-span-2">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1.5 font-medium"><Activity className="size-4 text-primary" /> Crowd Intelligence</span>
            <Badge tone="warning">Busy · 88%</Badge>
          </div>
          <Progress value={88} className="mt-3 h-2.5" barClassName="bg-warning" />
          <div className="mt-3 flex items-center gap-2 rounded-md bg-accent/60 px-3 py-2 text-xs">
            <Flame className="size-3.5 text-warning" /> Peak hour detected · 6 PM – 8 PM
          </div>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-1.5 text-sm font-medium"><MessagesSquare className="size-4 text-primary" /> Community</div>
          <p className="mt-2 text-2xl font-bold">742</p>
          <p className="text-xs text-muted-foreground">active members</p>
          <Progress value={68} className="mt-3 h-2" />
          <p className="mt-2 text-xs text-muted-foreground">30 Day Challenge · 68%</p>
        </div>
      </div>
    </Card>
  );
}

function MiniKpi({ label, value, delta }: { label: string; value: string; delta: string }) {
  return (
    <div className="rounded-lg border bg-card p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
      <p className="mt-0.5 flex items-center gap-0.5 text-xs font-medium text-success"><TrendingUp className="size-3" /> {delta}</p>
    </div>
  );
}

/* ---------------- Crowd section ---------------- */
function CrowdSection({ onLogin }: { onLogin: () => void }) {
  return (
    <section id="crowd" className="border-t bg-muted/30 py-20">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2">
        <div>
          <Badge tone="primary"><Activity className="size-3.5" /> Hero feature</Badge>
          <h2 className="heading-xl mt-5 text-4xl font-bold sm:text-5xl">Turn attendance into actionable insights</h2>
          <p className="mt-4 text-muted-foreground">
            Most software just counts check-ins. PowerHouse watches how your gym fills up through the day and automatically flags what matters — peak hours, quiet windows, unusual spikes and capacity warnings.
          </p>
          <ul className="mt-6 space-y-3">
            <Bullet>Live occupancy with Low / Busy / Very Crowded status</Bullet>
            <Bullet>Automatic crowd flags with business recommendations</Bullet>
            <Bullet>Peak & quiet hour detection across any date range</Bullet>
          </ul>
          <Button className="mt-7" onClick={onLogin}>See it live <ArrowRight /></Button>
        </div>
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Gym Crowd · Today</span>
            <Badge tone="danger">94% · Very Crowded</Badge>
          </div>
          <Progress value={94} className="mt-3 h-3" barClassName="bg-danger" />
          <p className="mt-1.5 text-xs text-muted-foreground">226 / 240 capacity</p>
          <div className="mt-5 space-y-2.5">
            <Flag icon={<Flame className="size-4 text-danger" />} title="Peak Hour" desc="Reached 94% between 6:30–7:30 PM" tone="danger" />
            <Flag icon={<Zap className="size-4 text-warning" />} title="Unusual Spike" desc="Attendance up 42% vs last Tuesday" tone="warning" />
            <Flag icon={<ShieldCheck className="size-4 text-success" />} title="Low Traffic" desc="Below 30% between 1–4 PM" tone="success" />
          </div>
        </Card>
      </div>
    </section>
  );
}

function Flag({ icon, title, desc, tone }: { icon: React.ReactNode; title: string; desc: string; tone: string }) {
  return (
    <div className="flex items-start gap-3 rounded-lg border bg-card p-3">
      <div className="mt-0.5">{icon}</div>
      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
    </div>
  );
}

/* ---------------- Community section ---------------- */
function CommunitySection({ onLogin }: { onLogin: () => void }) {
  return (
    <section id="community" className="py-20">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2">
        <Card className="order-2 p-5 lg:order-1">
          <div className="flex items-center gap-2 text-sm font-medium"><Trophy className="size-4 text-primary" /> Weekly Leaders</div>
          <div className="mt-3 space-y-2">
            {[["Rahul Sharma", "6 workouts"], ["Ankit Verma", "5 workouts"], ["Priya Nair", "5 workouts"], ["Aman Gupta", "4 workouts"]].map(([n, w], i) => (
              <div key={n} className="flex items-center justify-between rounded-lg bg-accent/50 px-3 py-2 text-sm">
                <span className="flex items-center gap-2"><span className="flex size-5 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">{i + 1}</span>{n}</span>
                <span className="text-muted-foreground">{w}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-lg border bg-card p-3">
            <div className="flex items-center justify-between text-sm"><span className="font-medium">30 Day Consistency</span><span className="text-muted-foreground">78%</span></div>
            <Progress value={78} className="mt-2" />
            <p className="mt-1.5 text-xs text-muted-foreground">84 participants</p>
          </div>
        </Card>
        <div className="order-1 lg:order-2">
          <Badge tone="primary"><MessagesSquare className="size-3.5" /> Hero feature</Badge>
          <h2 className="heading-xl mt-5 text-4xl font-bold sm:text-5xl">Keep members engaged beyond their workouts</h2>
          <p className="mt-4 text-muted-foreground">
            A lightweight social layer inside your gym — posts, achievements, challenges and leaderboards that turn solo workouts into a community your members don't want to leave.
          </p>
          <ul className="mt-6 space-y-3">
            <Bullet>Social feed with posts, likes, comments & milestones</Bullet>
            <Bullet>Challenges and leaderboards that build consistency</Bullet>
            <Bullet>Engagement analytics so you can see retention grow</Bullet>
          </ul>
          <Button className="mt-7" onClick={onLogin}>Explore community <ArrowRight /></Button>
        </div>
      </div>
    </section>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2.5 text-sm">
      <Check className="mt-0.5 size-4 shrink-0 text-success" />
      <span>{children}</span>
    </li>
  );
}

/* ---------------- Core features ---------------- */
function CoreFeatures() {
  const items = [
    { icon: Users, title: "Member Management", desc: "Profiles, filters, search and membership tracking." },
    { icon: CalendarCheck, title: "Attendance", desc: "Live check-ins, history and attendance analytics." },
    { icon: CreditCard, title: "Payments", desc: "Revenue tracking, pending dues and payment status." },
    { icon: Users, title: "Trainers", desc: "Trainer profiles, assigned members and schedules." },
    { icon: CalendarDays, title: "Classes", desc: "Weekly timetable with capacity and bookings." },
    { icon: BarChart3, title: "Reports", desc: "Growth, retention, revenue and crowd analytics." },
  ];
  return (
    <section id="features" className="border-t bg-muted/30 py-20">
      <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
        <h2 className="heading-xl text-4xl font-bold sm:text-5xl">Everything you need to run the gym</h2>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">The operational basics done well — so you can focus on the two things that grow your business.</p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((f) => (
            <Card key={f.title} className="p-6 text-left transition-colors hover:border-primary/40">
              <div className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary"><f.icon className="size-5" /></div>
              <h3 className="mt-4 font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Stats band ---------------- */
function StatsBand() {
  const stats = [["1,248", "Members managed"], ["94%", "Peak occupancy tracked"], ["742", "Active community"], ["+18%", "Engagement lift"]];
  return (
    <section className="py-16">
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 px-4 sm:px-6 lg:grid-cols-4">
        {stats.map(([v, l]) => (
          <div key={l} className="text-center">
            <p className="text-3xl font-bold text-primary sm:text-4xl">{v}</p>
            <p className="mt-1 text-sm text-muted-foreground">{l}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Pricing ---------------- */
function Pricing({ onLogin }: { onLogin: () => void }) {
  const plans = [
    {
      name: "Basic", price: "₹999", tagline: "Run the front desk", popular: false,
      features: ["Up to 150 members", "Member management", "Attendance tracking", "Payment & dues tracking", "Email support"],
    },
    {
      name: "Standard", price: "₹1,499", tagline: "Grow with full insight", popular: false,
      features: ["Everything in Basic", "Up to 250 members", "Trainers & class scheduling", "Equipment inventory", "Attendance & revenue analytics", "Up to 3 staff accounts"],
    },
    {
      name: "Premium", price: "₹2,499", tagline: "Full intelligence + engagement", popular: true,
      features: ["Everything in Standard", "Unlimited members", "Crowd Intelligence suite", "Community feed & challenges", "Automated reminders & exports", "Dedicated account manager"],
    },
  ];
  return (
    <section id="pricing" className="border-t bg-muted/30 py-20">
      <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
        <h2 className="heading-xl text-4xl font-bold sm:text-5xl">Simple membership plans</h2>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">Flexible pricing your members will understand at a glance.</p>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {plans.map((p) => (
            <Card key={p.name} className={`p-6 text-left ${p.popular ? "border-primary shadow-lg ring-1 ring-primary/20" : ""}`}>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{p.name}</h3>
                {p.popular && <Badge tone="primary">Most popular</Badge>}
              </div>
              <p className="mt-3 text-3xl font-bold">{p.price}<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
              <p className="mt-1 text-sm font-medium text-muted-foreground">{p.tagline}</p>
              <ul className="mt-5 space-y-2.5">
                {p.features.map((f) => {
                  if (f.toLowerCase().startsWith("everything in"))
                    return <li key={f} className="pt-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{f}</li>;
                  const hero = /crowd intelligence|community/i.test(f);
                  return (
                    <li key={f} className={`flex items-start gap-2.5 text-sm ${hero ? "font-semibold text-primary" : ""}`}>
                      <Check className={`mt-0.5 size-4 shrink-0 ${hero ? "text-primary" : "text-success"}`} />
                      <span>{f}</span>
                    </li>
                  );
                })}
              </ul>
              <Button className="mt-6 w-full" variant={p.popular ? "default" : "outline"} onClick={onLogin}>Choose {p.name}</Button>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Final CTA ---------------- */
function FinalCta({ onLogin }: { onLogin: () => void }) {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-2xl bg-neutral-950 px-8 py-16 text-center text-white">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{ backgroundImage: `url('${GYM_CTA}')` }}
            aria-hidden
          />
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/90 to-primary/40" aria-hidden />
          <DumbbellField />
          <div className="relative">
            <p className="eyebrow mb-3 text-xs text-primary">No excuses</p>
            <h2 className="heading-xl text-4xl font-bold sm:text-5xl">Ready to understand your gym?</h2>
            <p className="mx-auto mt-4 max-w-lg text-white/70">Jump straight into a fully-loaded demo. No sign-up, no setup — just explore.</p>
            <Button size="lg" className="mt-8" onClick={onLogin}>Launch the demo <ArrowRight /></Button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Footer ---------------- */
function Footer() {
  return (
    <footer className="border-t py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">PH</div>
          <span className="text-sm font-semibold">PowerHouse Fitness</span>
        </div>
        <p className="text-xs text-muted-foreground">Know your gym. Grow your community. · © 2026 PowerHouse · Demo</p>
      </div>
    </footer>
  );
}
