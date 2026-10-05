"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  Attendance, Equipment, GymClass, Member, MembershipPlan, Payment, User,
} from "@/lib/types";
import { generateSeed, SeedData, NOW } from "@/lib/data/seed";
import { AVATAR_COLORS } from "@/lib/data/random";
import { addDays } from "date-fns";

export interface AddMemberInput {
  name: string;
  email: string;
  phone: string;
  gender: Member["gender"];
  dob: string;
  address: string;
  emergencyContact: string;
  planId: string;
  startDate: string;
  expiryDate: string;
  trainerId: string | null;
}

export type AppRole = "developer" | "gym-owner";

interface GymState extends SeedData {
  authUser: User | null;
  viewRole: AppRole; // developer = platform owner (you); gym-owner = your customer
  setViewRole: (r: AppRole) => void;
  // auth
  login: (email: string, password: string) => boolean;
  logout: () => void;
  resetDemo: () => void;
  // members
  addMember: (input: AddMemberInput) => Member;
  // attendance
  checkIn: (memberId: string) => void;
  checkOut: (attendanceId: string) => void;
  // payments
  recordPayment: (memberId: string, planId: string) => void;
  markPaymentStatus: (id: string, status: Payment["status"]) => void;
  // plans
  createPlan: (plan: Omit<MembershipPlan, "id">) => void;
  updatePlan: (id: string, patch: Partial<MembershipPlan>) => void;
  // classes
  createClass: (c: Omit<GymClass, "id" | "booked" | "cancelled">) => void;
  cancelClass: (id: string) => void;
  // equipment
  addEquipment: (e: Omit<Equipment, "id">) => void;
  updateEquipment: (id: string, patch: Partial<Equipment>) => void;
  removeEquipment: (id: string) => void;
  serviceEquipment: (id: string) => void;
}

const DEMO = { email: "admin@gymdemo.com", password: "demo123" };

export const useGymStore = create<GymState>()(
  persist(
    (set, get) => ({
      ...generateSeed(),
      authUser: null,
      viewRole: "gym-owner",

      setViewRole: (r) => set({ viewRole: r }),

      login: (email, password) => {
        if (email.trim().toLowerCase() === DEMO.email && password === DEMO.password) {
          set({ authUser: get().admin });
          return true;
        }
        return false;
      },
      logout: () => set({ authUser: null }),
      resetDemo: () => set({ ...generateSeed() }),

      addMember: (input) => {
        const members = get().members;
        const id = `member_${members.length + 1}_${Date.now()}`;
        const now = NOW.toISOString();
        const member: Member = {
          id,
          code: `PH${1001 + members.length}`,
          avatarColor: AVATAR_COLORS[members.length % AVATAR_COLORS.length],
          status: "new",
          joinedAt: now,
          lastVisit: null,
          totalVisits: 0,
          streak: 0,
          communityPoints: 0,
          ...input,
        };
        set({ members: [member, ...members] });
        // also log an initial payment
        get().recordPayment(id, input.planId);
        return member;
      },

      checkIn: (memberId) => {
        const att = get().attendance;
        if (att.some((a) => a.memberId === memberId && a.status === "inside")) return;
        const m = get().members.find((x) => x.id === memberId);
        const record: Attendance = {
          id: `att_${Date.now()}`,
          memberId,
          trainerId: m?.trainerId ?? null,
          checkIn: new Date().toISOString(),
          checkOut: null,
          status: "inside",
        };
        set({
          attendance: [record, ...att],
          members: get().members.map((x) =>
            x.id === memberId
              ? { ...x, lastVisit: record.checkIn, totalVisits: x.totalVisits + 1 }
              : x
          ),
        });
      },

      checkOut: (attendanceId) => {
        set({
          attendance: get().attendance.map((a) =>
            a.id === attendanceId
              ? { ...a, checkOut: new Date().toISOString(), status: "completed" }
              : a
          ),
        });
      },

      recordPayment: (memberId, planId) => {
        const plan = get().plans.find((p) => p.id === planId);
        if (!plan) return;
        const payment: Payment = {
          id: `pay_${Date.now()}`,
          memberId,
          planId,
          amount: plan.price,
          date: new Date().toISOString(),
          method: "UPI",
          status: "paid",
        };
        set({ payments: [payment, ...get().payments] });
      },

      markPaymentStatus: (id, status) =>
        set({ payments: get().payments.map((p) => (p.id === id ? { ...p, status } : p)) }),

      createPlan: (plan) =>
        set({ plans: [...get().plans, { ...plan, id: `plan_${Date.now()}` }] }),

      updatePlan: (id, patch) =>
        set({ plans: get().plans.map((p) => (p.id === id ? { ...p, ...patch } : p)) }),

      createClass: (c) =>
        set({
          classes: [...get().classes, { ...c, id: `class_${Date.now()}`, booked: 0, cancelled: false }],
        }),

      cancelClass: (id) =>
        set({ classes: get().classes.map((c) => (c.id === id ? { ...c, cancelled: true } : c)) }),

      addEquipment: (e) =>
        set({ equipment: [{ ...e, id: `equip_${Date.now()}` }, ...get().equipment] }),

      updateEquipment: (id, patch) =>
        set({ equipment: get().equipment.map((e) => (e.id === id ? { ...e, ...patch } : e)) }),

      removeEquipment: (id) =>
        set({ equipment: get().equipment.filter((e) => e.id !== id) }),

      serviceEquipment: (id) =>
        set({
          equipment: get().equipment.map((e) =>
            e.id === id ? { ...e, condition: "good", lastServiced: new Date().toISOString() } : e
          ),
        }),
    }),
    {
      name: "gym-demo-auth",
      storage: createJSONStorage(() => localStorage),
      // Only persist the session + role; demo data regenerates fresh each load (resettable).
      partialize: (s) => ({ authUser: s.authUser, viewRole: s.viewRole }),
    }
  )
);
