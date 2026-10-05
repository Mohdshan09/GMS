import {
  Attendance, Challenge, Comment, CommunityPost, CrowdSnapshot, Equipment,
  EquipmentCategory, EquipmentCondition, GymClass, Gym, Member, MembershipPlan,
  Notification, Payment, PostType, Trainer, User,
} from "@/lib/types";
import { makeRng, AVATAR_COLORS } from "./random";
import { FIRST_NAMES, LAST_NAMES, TRAINER_SPECIALTIES } from "./names";
import {
  addDays, addMinutes, differenceInCalendarDays, format, setHours, setMinutes,
  startOfDay, subDays,
} from "date-fns";

// Fixed "now" for a deterministic demo (today per project context).
export const NOW = new Date("2026-10-05T18:30:00");
export const CAPACITY = 240;

// Hourly occupancy % curve (gym open 5AM–10PM). Peak 6–8PM, quiet 1–4PM.
const HOUR_CURVE: Record<number, number> = {
  5: 14, 6: 34, 7: 56, 8: 60, 9: 46, 10: 38, 11: 34, 12: 40,
  13: 30, 14: 28, 15: 33, 16: 46, 17: 63, 18: 85, 19: 94, 20: 88,
  21: 60, 22: 30,
};

export interface SeedData {
  gym: Gym;
  admin: User;
  plans: MembershipPlan[];
  trainers: Trainer[];
  members: Member[];
  payments: Payment[];
  classes: GymClass[];
  attendance: Attendance[];
  dailyAttendance: { date: string; count: number }[];
  posts: CommunityPost[];
  comments: Comment[];
  challenges: Challenge[];
  crowdToday: CrowdSnapshot[];
  crowdDaily: { date: string; avg: number; peak: number }[];
  equipment: Equipment[];
  notifications: Notification[];
  stats: {
    totalMembers: number;
    activeMembers: number;
    todayAttendance: number;
    monthlyRevenue: number;
    expiringMemberships: number;
    newMembers: number;
    collected: number;
    pending: number;
    communityActive: number;
    postsThisWeek: number;
    comments: number;
    challengeParticipation: number;
  };
}

function iso(d: Date) {
  return d.toISOString();
}

export function generateSeed(): SeedData {
  const r = makeRng(20261005);

  // --- Gym + Admin ---
  const gym: Gym = {
    id: "gym1",
    name: "PowerHouse Fitness",
    address: "2nd Floor, Orion Mall, Koramangala, Bengaluru 560034",
    phone: "+91 98450 12345",
    email: "hello@powerhousefitness.in",
    capacity: CAPACITY,
    openHours: "Mon–Sat · 5:00 AM – 10:00 PM",
    logoText: "PH",
  };
  const admin: User = {
    id: "admin1",
    name: "Shan Mohammed",
    email: "admin@gymdemo.com",
    role: "ADMIN",
    avatarColor: AVATAR_COLORS[0],
  };

  // --- Plans ---
  const plans: MembershipPlan[] = [
    { id: "plan_basic", name: "Basic", price: 999, active: true, features: ["Gym access", "Basic equipment"] },
    { id: "plan_standard", name: "Standard", price: 1499, active: true, features: ["Gym access", "Group classes", "Trainer consultation"] },
    { id: "plan_premium", name: "Premium", price: 2499, active: true, features: ["Unlimited access", "Personal training", "Group classes", "Community challenges"] },
  ];

  // --- Trainers ---
  const trainers: Trainer[] = Array.from({ length: 5 }).map((_, i) => {
    const name = `${r.pick(FIRST_NAMES)} ${r.pick(LAST_NAMES)}`;
    return {
      id: `trainer_${i + 1}`,
      name,
      email: `${name.split(" ")[0].toLowerCase()}@powerhousefitness.in`,
      phone: `+91 9${r.int(100000000, 999999999)}`,
      specialty: TRAINER_SPECIALTIES[i],
      avatarColor: AVATAR_COLORS[(i + 1) % AVATAR_COLORS.length],
      rating: +(4.4 + r.next() * 0.5).toFixed(1),
      memberCount: r.int(28, 48),
      todaySessions: r.int(3, 8),
      bio: `${TRAINER_SPECIALTIES[i]} specialist with ${r.int(4, 12)} years of coaching experience.`,
    };
  });

  // --- Members (120 detailed) ---
  const members: Member[] = [];
  const usedNames = new Set<string>();
  for (let i = 0; i < 120; i++) {
    let name = `${r.pick(FIRST_NAMES)} ${r.pick(LAST_NAMES)}`;
    let guard = 0;
    while (usedNames.has(name) && guard++ < 10) name = `${r.pick(FIRST_NAMES)} ${r.pick(LAST_NAMES)}`;
    usedNames.add(name);

    const planId = r.pick(["plan_basic", "plan_basic", "plan_standard", "plan_standard", "plan_premium"]);
    const joinedDaysAgo = r.int(5, 420);
    const joinedAt = subDays(NOW, joinedDaysAgo);
    // expiry relative to now: mix of active/expiring/expired
    const expiryOffset = r.int(-40, 60);
    const expiryDate = addDays(NOW, expiryOffset);
    const lastVisitDaysAgo = r.int(0, 25);

    let status: Member["status"];
    if (expiryOffset < 0) status = "expired";
    else if (expiryOffset <= 7) status = "expiring";
    else if (joinedDaysAgo <= 30) status = "new";
    else if (lastVisitDaysAgo > 14) status = "inactive";
    else status = "active";

    members.push({
      id: `member_${i + 1}`,
      code: `PH${String(1001 + i)}`,
      name,
      email: `${name.split(" ")[0].toLowerCase()}${i}@gmail.com`,
      phone: `+91 9${r.int(100000000, 999999999)}`,
      gender: r.pick(["Male", "Male", "Female", "Female", "Other"]) as Member["gender"],
      dob: iso(subDays(NOW, r.int(6500, 16000))),
      address: `${r.int(1, 240)}, ${r.pick(["Indiranagar", "Koramangala", "HSR Layout", "BTM", "Jayanagar", "Whitefield"])}, Bengaluru`,
      emergencyContact: `+91 9${r.int(100000000, 999999999)}`,
      avatarColor: r.pick(AVATAR_COLORS),
      planId,
      startDate: iso(joinedAt),
      expiryDate: iso(expiryDate),
      trainerId: r.bool(0.7) ? r.pick(trainers).id : null,
      status,
      joinedAt: iso(joinedAt),
      lastVisit: status === "expired" ? null : iso(subDays(NOW, lastVisitDaysAgo)),
      totalVisits: r.int(8, 180),
      streak: r.int(0, 32),
      communityPoints: r.int(0, 520),
    });
  }

  // --- Payments (~60, recent) ---
  const payments: Payment[] = [];
  for (let i = 0; i < 64; i++) {
    const m = r.pick(members);
    const plan = plans.find((p) => p.id === m.planId)!;
    const status = r.pick<Payment["status"]>([
      "paid", "paid", "paid", "paid", "pending", "pending", "failed", "refunded",
    ]);
    payments.push({
      id: `pay_${i + 1}`,
      memberId: m.id,
      planId: plan.id,
      amount: plan.price,
      date: iso(subDays(NOW, r.int(0, 30))),
      method: r.pick(["UPI", "UPI", "Card", "Cash", "Netbanking"]),
      status,
    });
  }

  // --- Classes (~30, weekly grid) ---
  const classDefs = [
    { title: "Strength Training", time: "06:00", dur: 60 },
    { title: "Yoga Flow", time: "07:30", dur: 60 },
    { title: "HIIT Burn", time: "18:00", dur: 45 },
    { title: "Spin Cycle", time: "19:00", dur: 45 },
    { title: "CrossFit WOD", time: "20:00", dur: 60 },
  ];
  const days: GymClass["day"][] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const classes: GymClass[] = [];
  let ci = 0;
  for (const day of days) {
    for (const def of classDefs) {
      if (r.bool(0.85)) {
        const capacity = r.pick([20, 24, 28, 30]);
        classes.push({
          id: `class_${ci++}`,
          title: def.title,
          trainerId: r.pick(trainers).id,
          day,
          startTime: def.time,
          durationMin: def.dur,
          capacity,
          booked: r.int(Math.floor(capacity * 0.4), capacity),
          cancelled: r.bool(0.05),
        });
      }
    }
  }

  // --- Crowd snapshots: today (hourly) + 30-day daily ---
  const crowdToday: CrowdSnapshot[] = [];
  const today0 = startOfDay(NOW);
  for (let h = 5; h <= 22; h++) {
    const base = HOUR_CURVE[h] ?? 20;
    const jitter = r.int(-4, 4);
    const percentage = Math.max(5, Math.min(99, base + jitter));
    const occupancy = Math.round((percentage / 100) * CAPACITY);
    crowdToday.push({
      id: `crowd_${h}`,
      timestamp: iso(setHours(today0, h)),
      occupancy,
      capacity: CAPACITY,
      percentage,
    });
  }

  const crowdDaily: { date: string; avg: number; peak: number }[] = [];
  const dailyAttendance: { date: string; count: number }[] = [];
  for (let d = 29; d >= 0; d--) {
    const day = subDays(NOW, d);
    const weekend = [0, 6].includes(day.getDay());
    const factor = weekend ? 0.8 : 1 + (day.getDay() === 1 ? 0.08 : 0); // Monday busiest
    const avg = Math.round((52 + r.int(-6, 8)) * factor);
    const peak = Math.min(99, Math.round((90 + r.int(-5, 6)) * factor));
    crowdDaily.push({ date: format(day, "dd MMM"), avg, peak });
    dailyAttendance.push({ date: format(day, "dd MMM"), count: Math.round((avg / 100) * CAPACITY * 3.6) });
  }

  // --- Attendance today (~190 check-ins, 44 inside) ---
  const attendance: Attendance[] = [];
  const todayMembers = r.shuffle(members.filter((m) => m.status !== "expired")).slice(0, 190);
  const nowHour = NOW.getHours();
  todayMembers.forEach((m, idx) => {
    // bias check-in hours toward the curve
    const hour = r.pick([6, 7, 8, 9, 17, 18, 18, 19, 19, 20]);
    const checkIn = setMinutes(setHours(today0, hour), r.int(0, 59));
    const stillInside = hour >= nowHour - 1 && r.bool(0.5);
    const durationMin = r.int(45, 110);
    attendance.push({
      id: `att_${idx}`,
      memberId: m.id,
      trainerId: m.trainerId,
      checkIn: iso(checkIn),
      checkOut: stillInside ? null : iso(addMinutes(checkIn, durationMin)),
      status: stillInside ? "inside" : "completed",
    });
  });

  // --- Community posts + comments ---
  const postTemplates: { type: PostType; title?: string; content: string }[] = [
    { type: "ACHIEVEMENT", title: "🏆 30 Day Streak!", content: "Just completed my 30th consecutive workout. Let's keep going! 💪" },
    { type: "WORKOUT", title: "💪 Leg Day Done", content: "New personal best on squats today — 120kg x 5. Thanks coach!" },
    { type: "MILESTONE", title: "🎯 10kg Down", content: "Hit my weight goal after 4 months of consistency. This community kept me going." },
    { type: "GENERAL", content: "Who's in for the 6AM strength session tomorrow? Looking for a lifting partner." },
    { type: "ACHIEVEMENT", title: "🏆 First Pull-up!", content: "Finally got my first unassisted pull-up today. Small wins add up!" },
    { type: "WORKOUT", title: "💪 Morning HIIT", content: "Brutal HIIT session this morning. Burned 480 calories 🔥" },
    { type: "MILESTONE", title: "🎯 100 Workouts", content: "Crossed 100 total workouts at PowerHouse. Grateful for the trainers here." },
    { type: "GENERAL", content: "The new spin bikes are amazing. Great upgrade!" },
    { type: "ANNOUNCEMENT", title: "📢 Diwali Timings", content: "Gym will operate 6 AM – 2 PM on Diwali. Plan your sessions accordingly!" },
    { type: "ACHIEVEMENT", title: "🏆 Challenge Winner", content: "Topped the September consistency challenge with 24 workouts 🙌" },
  ];
  const posts: CommunityPost[] = [];
  const comments: Comment[] = [];
  for (let i = 0; i < 30; i++) {
    const t = postTemplates[i % postTemplates.length];
    const author = t.type === "ANNOUNCEMENT" ? admin : r.pick(members);
    const createdAt = subDays(NOW, r.int(0, 10));
    const commentsCount = r.int(0, 12);
    posts.push({
      id: `post_${i}`,
      authorId: author.id,
      authorName: author.name,
      authorColor: author.avatarColor,
      type: t.type,
      title: t.title,
      content: t.content,
      createdAt: iso(createdAt),
      likesCount: r.int(3, 86),
      likedByMe: false,
      commentsCount,
      pinned: t.type === "ANNOUNCEMENT" && i < 10,
      featured: t.type === "ACHIEVEMENT" && r.bool(0.3),
    });
    for (let c = 0; c < Math.min(commentsCount, 3); c++) {
      const cm = r.pick(members);
      comments.push({
        id: `cmt_${i}_${c}`,
        postId: `post_${i}`,
        authorId: cm.id,
        authorName: cm.name,
        content: r.pick(["Great work! 🔥", "Keep it up 💪", "Inspiring!", "Let's go!", "Beast mode 👏"]),
        createdAt: iso(addMinutes(createdAt, r.int(10, 600))),
      });
    }
  }

  // --- Challenges (6) ---
  const challenges: Challenge[] = [
    { id: "ch1", title: "30 Day Consistency Challenge", description: "Complete 20 workouts in 30 days.", target: 20, participants: 84, progressPct: 78, status: "active", startDate: iso(subDays(NOW, 18)), endDate: iso(addDays(NOW, 12)) },
    { id: "ch2", title: "October Step-Up", description: "Log 15 cardio sessions this month.", target: 15, participants: 56, progressPct: 42, status: "active", startDate: iso(subDays(NOW, 5)), endDate: iso(addDays(NOW, 25)) },
    { id: "ch3", title: "Strength Builder", description: "Hit 12 strength sessions in 3 weeks.", target: 12, participants: 39, progressPct: 61, status: "active", startDate: iso(subDays(NOW, 9)), endDate: iso(addDays(NOW, 12)) },
    { id: "ch4", title: "Early Bird Club", description: "Attend 10 morning (before 8AM) workouts.", target: 10, participants: 47, progressPct: 100, status: "completed", startDate: iso(subDays(NOW, 40)), endDate: iso(subDays(NOW, 10)) },
    { id: "ch5", title: "Summer Shred", description: "25 workouts in 6 weeks.", target: 25, participants: 112, progressPct: 100, status: "completed", startDate: iso(subDays(NOW, 90)), endDate: iso(subDays(NOW, 48)) },
    { id: "ch6", title: "New Year Kickstart", description: "Commit to 30 sessions in January.", target: 30, participants: 0, progressPct: 0, status: "upcoming", startDate: iso(addDays(NOW, 20)), endDate: iso(addDays(NOW, 51)) },
  ];

  // --- Notifications ---
  const notifications: Notification[] = [
    { id: "n1", category: "membership", message: "23 memberships expire this week.", createdAt: iso(subDays(NOW, 0)), read: false },
    { id: "n2", category: "crowd", message: "Gym reached 92% capacity at 7:10 PM.", createdAt: iso(subDays(NOW, 0)), read: false },
    { id: "n3", category: "attendance", message: "Attendance is 18% higher than usual today.", createdAt: iso(subDays(NOW, 0)), read: false },
    { id: "n4", category: "community", message: "Your 30 Day Challenge has 84 participants.", createdAt: iso(subDays(NOW, 1)), read: true },
    { id: "n5", category: "payment", message: "12 payments are pending.", createdAt: iso(subDays(NOW, 1)), read: false },
    { id: "n6", category: "community", message: "Rahul Sharma shared a new achievement.", createdAt: iso(subDays(NOW, 1)), read: true },
    { id: "n7", category: "membership", message: "Priya Nair's Premium plan renews in 3 days.", createdAt: iso(subDays(NOW, 2)), read: true },
    { id: "n8", category: "crowd", message: "Peak hour detected: 6 PM – 8 PM.", createdAt: iso(subDays(NOW, 2)), read: true },
  ];

  // --- Equipment inventory ---
  const equipmentDefs: { name: string; category: EquipmentCategory; brand: string; cost: number; zone: string }[] = [
    { name: "Treadmill Pro X9", category: "Cardio", brand: "Technogym", cost: 285000, zone: "Cardio Zone" },
    { name: "Elliptical Cross-Trainer", category: "Cardio", brand: "Life Fitness", cost: 195000, zone: "Cardio Zone" },
    { name: "Indoor Spin Bike", category: "Cardio", brand: "Keiser", cost: 120000, zone: "Studio A" },
    { name: "Rowing Machine", category: "Cardio", brand: "Concept2", cost: 95000, zone: "Cardio Zone" },
    { name: "StairMaster", category: "Cardio", brand: "Matrix", cost: 240000, zone: "Cardio Zone" },
    { name: "Leg Press Machine", category: "Strength Machines", brand: "Hammer Strength", cost: 175000, zone: "Strength Floor" },
    { name: "Lat Pulldown", category: "Strength Machines", brand: "Life Fitness", cost: 110000, zone: "Strength Floor" },
    { name: "Chest Press Machine", category: "Strength Machines", brand: "Technogym", cost: 130000, zone: "Strength Floor" },
    { name: "Smith Machine", category: "Strength Machines", brand: "Hammer Strength", cost: 210000, zone: "Strength Floor" },
    { name: "Cable Crossover", category: "Strength Machines", brand: "Matrix", cost: 165000, zone: "Strength Floor" },
    { name: "Seated Leg Curl", category: "Strength Machines", brand: "Life Fitness", cost: 98000, zone: "Strength Floor" },
    { name: "Olympic Barbell (20kg)", category: "Free Weights", brand: "Eleiko", cost: 32000, zone: "Free Weights" },
    { name: "Dumbbell Set (2.5–50kg)", category: "Free Weights", brand: "Rogue", cost: 320000, zone: "Free Weights" },
    { name: "Bumper Weight Plates", category: "Free Weights", brand: "Eleiko", cost: 180000, zone: "Free Weights" },
    { name: "Kettlebell Set", category: "Free Weights", brand: "Rogue", cost: 85000, zone: "Free Weights" },
    { name: "Adjustable Bench", category: "Free Weights", brand: "Rep Fitness", cost: 28000, zone: "Free Weights" },
    { name: "Power Squat Rack", category: "Free Weights", brand: "Rogue", cost: 145000, zone: "Free Weights" },
    { name: "Battle Ropes (15m)", category: "Functional", brand: "Rep Fitness", cost: 9000, zone: "Functional Zone" },
    { name: "TRX Suspension Kit", category: "Functional", brand: "TRX", cost: 14000, zone: "Functional Zone" },
    { name: "Plyo Box Set", category: "Functional", brand: "Rogue", cost: 22000, zone: "Functional Zone" },
    { name: "Medicine Ball Set", category: "Functional", brand: "Dynamax", cost: 18000, zone: "Functional Zone" },
    { name: "Resistance Bands Set", category: "Accessories", brand: "Rep Fitness", cost: 6000, zone: "Studio B" },
    { name: "Yoga Mats", category: "Accessories", brand: "Manduka", cost: 4500, zone: "Studio B" },
    { name: "Foam Rollers", category: "Accessories", brand: "TriggerPoint", cost: 3500, zone: "Recovery Area" },
  ];
  const conditions: EquipmentCondition[] = ["excellent", "excellent", "good", "good", "good", "needs-service", "out-of-order"];
  const equipment: Equipment[] = equipmentDefs.map((d, i) => {
    const purchasedDaysAgo = r.int(90, 1400);
    return {
      id: `equip_${i + 1}`,
      name: d.name,
      category: d.category,
      brand: d.brand,
      quantity: d.category === "Accessories" || d.category === "Cardio" ? r.int(4, 14) : r.int(1, 6),
      location: d.zone,
      condition: r.pick(conditions),
      purchaseDate: iso(subDays(NOW, purchasedDaysAgo)),
      lastServiced: iso(subDays(NOW, r.int(3, 120))),
      cost: d.cost,
    };
  });

  // --- Headline stats (demo-scale, matches sales script §33) ---
  const collected = payments.filter((p) => p.status === "paid").reduce((s, p) => s + p.amount, 0);
  const stats = {
    totalMembers: 1248,
    activeMembers: 1084,
    todayAttendance: 186,
    monthlyRevenue: 482500,
    expiringMemberships: 23,
    newMembers: 42,
    collected: 442000,
    pending: 40500,
    communityActive: 742,
    postsThisWeek: 128,
    comments: 342,
    challengeParticipation: 68,
  };

  return {
    gym, admin, plans, trainers, members, payments, classes, attendance,
    dailyAttendance, posts, comments, challenges, crowdToday, crowdDaily,
    equipment, notifications, stats,
  };
}
