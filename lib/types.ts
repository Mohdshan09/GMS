// ---- Shared ----
export type ID = string;
export type Role = "ADMIN" | "TRAINER" | "MEMBER";

export interface User {
  id: ID;
  name: string;
  email: string;
  role: Role;
  avatarColor: string;
}

export interface Gym {
  id: ID;
  name: string;
  address: string;
  phone: string;
  email: string;
  capacity: number;
  openHours: string;
  logoText: string;
}

// ---- Membership ----
export interface MembershipPlan {
  id: ID;
  name: "Basic" | "Standard" | "Premium" | string;
  price: number; // monthly, INR
  features: string[];
  active: boolean;
}

export type MemberStatus = "active" | "expiring" | "expired" | "inactive" | "new";

export interface Member {
  id: ID;
  code: string; // Member ID e.g. GYM0042
  name: string;
  email: string;
  phone: string;
  gender: "Male" | "Female" | "Other";
  dob: string; // ISO date
  address: string;
  emergencyContact: string;
  avatarColor: string;
  planId: ID;
  startDate: string; // ISO
  expiryDate: string; // ISO
  trainerId: ID | null;
  status: MemberStatus;
  joinedAt: string; // ISO
  lastVisit: string | null; // ISO
  totalVisits: number;
  streak: number;
  communityPoints: number;
}

export interface Trainer {
  id: ID;
  name: string;
  email: string;
  phone: string;
  specialty: string;
  avatarColor: string;
  rating: number;
  memberCount: number;
  todaySessions: number;
  bio: string;
}

// ---- Attendance ----
export type AttendanceStatus = "inside" | "completed";

export interface Attendance {
  id: ID;
  memberId: ID;
  trainerId: ID | null;
  checkIn: string; // ISO datetime
  checkOut: string | null;
  status: AttendanceStatus;
}

// ---- Payments ----
export type PaymentStatus = "paid" | "pending" | "failed" | "refunded";
export type PaymentMethod = "UPI" | "Card" | "Cash" | "Netbanking";

export interface Payment {
  id: ID;
  memberId: ID;
  planId: ID;
  amount: number;
  date: string; // ISO
  method: PaymentMethod;
  status: PaymentStatus;
}

// ---- Classes ----
export interface GymClass {
  id: ID;
  title: string;
  trainerId: ID;
  day: "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";
  startTime: string; // "06:00"
  durationMin: number;
  capacity: number;
  booked: number;
  cancelled: boolean;
}

// ---- Community ----
export type PostType = "GENERAL" | "ACHIEVEMENT" | "WORKOUT" | "MILESTONE" | "ANNOUNCEMENT";

export interface Comment {
  id: ID;
  postId: ID;
  authorId: ID;
  authorName: string;
  content: string;
  createdAt: string;
}

export interface CommunityPost {
  id: ID;
  authorId: ID;
  authorName: string;
  authorColor: string;
  type: PostType;
  title?: string;
  content: string;
  createdAt: string;
  likesCount: number;
  likedByMe: boolean;
  commentsCount: number;
  pinned: boolean;
  featured: boolean;
}

export type ChallengeStatus = "upcoming" | "active" | "completed";

export interface Challenge {
  id: ID;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  target: number;
  participants: number;
  progressPct: number;
  status: ChallengeStatus;
}

// ---- Crowd ----
export interface CrowdSnapshot {
  id: ID;
  timestamp: string; // ISO datetime
  occupancy: number;
  capacity: number;
  percentage: number;
}

export type CrowdFlagType =
  | "CAPACITY_WARNING"
  | "PEAK_HOUR"
  | "LOW_TRAFFIC"
  | "UNUSUAL_SPIKE"
  | "TRAINER_LOAD";

export interface CrowdFlag {
  id: ID;
  type: CrowdFlagType;
  title: string;
  description: string;
  severity: "info" | "warning" | "critical";
  startTime: string;
  endTime: string;
  occupancy: number;
  recommendation?: string;
}

// ---- Equipment ----
export type EquipmentCategory =
  | "Cardio"
  | "Strength Machines"
  | "Free Weights"
  | "Functional"
  | "Accessories";

export type EquipmentCondition = "excellent" | "good" | "needs-service" | "out-of-order";

export interface Equipment {
  id: ID;
  name: string;
  category: EquipmentCategory;
  brand: string;
  quantity: number;
  location: string; // zone in the gym
  condition: EquipmentCondition;
  purchaseDate: string; // ISO
  lastServiced: string; // ISO
  cost: number; // per unit, INR
}

// ---- Notifications ----
export type NotificationCategory =
  | "membership"
  | "attendance"
  | "crowd"
  | "community"
  | "payment";

export interface Notification {
  id: ID;
  category: NotificationCategory;
  message: string;
  createdAt: string;
  read: boolean;
}
