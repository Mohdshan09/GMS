import {
  LayoutDashboard, Users, Dumbbell, CalendarCheck, CreditCard, BadgeIndianRupee,
  CalendarDays, MessagesSquare, Activity, BarChart3, Bell, Settings, LucideIcon,
  Boxes,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  hero?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Members", href: "/members", icon: Users },
  { label: "Trainers", href: "/trainers", icon: Dumbbell },
  { label: "Attendance", href: "/attendance", icon: CalendarCheck },
  { label: "Memberships", href: "/memberships", icon: BadgeIndianRupee },
  { label: "Payments", href: "/payments", icon: CreditCard },
  { label: "Classes", href: "/classes", icon: CalendarDays },
  { label: "Equipment", href: "/equipment", icon: Boxes },
  { label: "Community", href: "/community", icon: MessagesSquare, hero: true },
  { label: "Crowd Insights", href: "/crowd", icon: Activity, hero: true },
  { label: "Reports", href: "/reports", icon: BarChart3 },
  { label: "Notifications", href: "/notifications", icon: Bell },
  { label: "Settings", href: "/settings", icon: Settings },
];
