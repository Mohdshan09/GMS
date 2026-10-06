import {
  LayoutDashboard, Users, Dumbbell, CalendarCheck, CreditCard, BadgeIndianRupee,
  CalendarDays, MessagesSquare, Activity, BarChart3, Bell, Settings, LucideIcon,
  Boxes, Building2,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  hero?: boolean;
}

/** Gym Owner panel — manage their own gym. */
export const OWNER_NAV: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Members", href: "/members", icon: Users },
  { label: "Trainers", href: "/trainers", icon: Dumbbell },
  { label: "Attendance", href: "/attendance", icon: CalendarCheck },
  { label: "Membership Plans", href: "/memberships", icon: BadgeIndianRupee },
  { label: "Payments", href: "/payments", icon: CreditCard },
  { label: "Classes", href: "/classes", icon: CalendarDays },
  { label: "Equipment", href: "/equipment", icon: Boxes },
  { label: "Community", href: "/community", icon: MessagesSquare, hero: true },
  { label: "Crowd Insights", href: "/crowd", icon: Activity, hero: true },
  { label: "Reports", href: "/reports", icon: BarChart3 },
  { label: "Notifications", href: "/notifications", icon: Bell },
  { label: "Settings", href: "/settings", icon: Settings },
];

/** Developer / platform panel — manage the SaaS product & customers. */
export const DEVELOPER_NAV: NavItem[] = [
  { label: "Overview", href: "/developer", icon: LayoutDashboard },
  { label: "Gym Customers", href: "/developer/customers", icon: Building2 },
  { label: "Subscription Plans", href: "/developer/plans", icon: BadgeIndianRupee },
  { label: "Settings", href: "/settings", icon: Settings },
];

export function navForRole(role?: string): NavItem[] {
  return role === "developer" ? DEVELOPER_NAV : OWNER_NAV;
}
