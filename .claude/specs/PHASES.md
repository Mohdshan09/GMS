# Gym Management SaaS — Phase-Wise Implementation Plan

> **Status (2026-10-05):** ✅ Phases 0–3 built & building clean (`npm run build` passes, 17 routes). Phases 4–7 pending. `/crowd`, `/community`, `/reports` show "coming next" placeholders; `/notifications` & `/settings` (incl. Reset Demo Data) are live.


> Goal: a **convincing sales demo**, not a production ERP. Hero features = **Crowd Intelligence** + **Community**. Prioritize visual quality, smooth workflow, realistic ₹/Indian data.

## Architecture Decision (locked)

| Concern | Choice | Why |
|---|---|---|
| Framework | Next.js (App Router) + TypeScript | spec §39 |
| Styling | Tailwind CSS + shadcn/ui + Lucide | spec §34, §39 |
| Charts | Recharts | spec §39 |
| State | Zustand | demo-wide reactive store, resettable |
| Data | **Mock layer** — seeded TS modules behind a `services/` API | spec §39/§47/§52: no real DB/gateway in MVP |
| Auth | Fake credential check + route guard (localStorage session) | demo only, spec §5 |

**Service boundary rule:** all pages read/write through `lib/services/*` (e.g. `memberService.list()`). Internally they hit the mock store today; swapping to real `fetch()` later touches only `services/`. No page imports seed data directly.

Folder shape:
```
app/(auth)/login
app/(app)/dashboard, members, trainers, attendance, memberships, payments,
          classes, community, crowd, reports, notifications, settings
components/ui (shadcn)  components/shared  components/charts
lib/data (seed)  lib/services  lib/store (zustand)  lib/types  lib/crowd (flag logic)
```

---

## Phase 0 — Scaffold (foundation prep)
- [ ] `create-next-app` (TS, Tailwind, App Router, src-less, alias `@/`)
- [ ] Install: shadcn/ui, lucide-react, recharts, zustand, date-fns, clsx/cva, sonner (toasts)
- [ ] Base theme tokens (light/dark), fonts, global layout shell
- [ ] `lib/types.ts` — all entities from spec §40 (User, Gym, Member, Trainer, MembershipPlan, Membership, Attendance, Payment, Class, ClassBooking, CommunityPost, Comment, PostLike, Challenge, ChallengeParticipant, CrowdSnapshot, CrowdFlag, Notification)

## Phase 1 — App Shell & Auth (spec §4, §5)
- [ ] Sidebar (12 nav items) + collapsible + mobile drawer/bottom nav (§35)
- [ ] Topbar: gym profile, user profile, DEMO MODE badge (§47)
- [ ] Login page with demo credentials shown + fake auth + route guard → `/dashboard`
- [ ] Logout
- [ ] Toast provider, skeleton + empty + error primitives (§36)

## Phase 2 — Demo Data Engine (spec §32, §41, §42)
- [ ] Deterministic seed generators (seedable RNG) producing: 5 trainers, 120 members, 3 plans, 60 payments, 30 classes, 600 attendance records, 60 community posts, 6 challenges, crowd snapshots (per-hour, 30 days), 30 crowd flags, notifications
- [ ] Realistic Indian names, ₹ currency, plausible dates relative to 2026-10-05
- [ ] Zustand store hydrated from seeds; `resetDemoData()` action
- [ ] `lib/services/*` CRUD wrappers over store (members, attendance, payments, community, crowd, etc.)

## Phase 3 — Core Gym Management (spec §20–28)
- [ ] **Dashboard** (§6, §7, §45): header greeting, 6 KPI cards, quick actions, Crowd Intelligence hero card, Community hero card
- [ ] **Members** (§20–22): table (cols/filters/search), Add Member dialog, Member Profile
- [ ] **Attendance** (§23–24): today stats, table, manual check-in/out, simulate check-ins
- [ ] **Memberships** (§25): 3 plan cards, subscribers, create/edit/disable
- [ ] **Payments** (§26): revenue dashboard, table, statuses
- [ ] **Trainers** (§27): trainer cards + profile
- [ ] **Classes** (§28): weekly calendar, create/edit/cancel, assign trainer

## Phase 4 — Crowd Intelligence (HERO) (spec §8–12, §41)
- [ ] Crowd status component (Low/Moderate/Busy/Very Busy bands)
- [ ] Crowd timeline chart (Today/Yesterday/7d/30d)
- [ ] `lib/crowd/flags.ts` — deterministic flag generation (§11 rules) → typed `CrowdFlag`
- [ ] `/crowd` page: current crowd, hourly graph, peak/quiet hours, flag list, recommendations

## Phase 5 — Community (HERO) (spec §13–19, §42)
- [ ] `/community` feed: post types (General/Achievement/Workout/Milestone/Announcement), like, comment
- [ ] Create post + create announcement (admin)
- [ ] Challenges: create + progress + participants
- [ ] Leaderboard (4 categories)
- [ ] Member engagement/progress widget + community analytics (admin)
- [ ] Admin controls: pin/remove/delete/feature

## Phase 6 — Analytics, Notifications, Reports, Settings (spec §29–31, §43)
- [ ] `/reports`: member growth, revenue, attendance, retention, community, crowd (with 7/30/90/year filters)
- [ ] `/notifications`: 5 categories
- [ ] `/settings`: gym profile, capacity, hours, notification toggles, **Reset Demo Data**

## Phase 7 — Polish (spec §34–38, §48)
- [ ] Skeletons/empty/error on every async page, success toasts
- [ ] Responsive pass (desktop/tablet/mobile)
- [ ] Pagination on large tables, lazy-load charts, perf cleanup
- [ ] Demo scenario walkthrough (§33) verified end-to-end

## Acceptance
Tracked against spec §50 checklist; MVP complete when all boxes pass and the §33 demo flow runs.
