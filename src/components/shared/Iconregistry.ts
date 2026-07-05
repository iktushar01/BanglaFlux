import {
  LayoutDashboard,
  ClipboardList,
  BarChart3,
  BarChart,
  Users,
  Settings,
  ShieldCheck,
  Bell,
  BookOpen,
  CalendarDays,
  MessageSquare,
  Heart,
  type LucideProps,
} from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";

export type IconName =
  | "LayoutDashboard"
  | "ClipboardList"
  | "BarChart3"
  | "BarChart"
  | "Users"
  | "Settings"
  | "ShieldCheck"
  | "Bell"
  | "BookOpen"
  | "CalendarDays"
  | "MessageSquare"
  | "Heart";

type LucideIcon = ForwardRefExoticComponent<
  Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
>;

export const iconRegistry: Record<IconName, LucideIcon> = {
  LayoutDashboard,
  ClipboardList,
  BarChart3,
  BarChart,
  Users,
  Settings,
  ShieldCheck,
  Bell,
  BookOpen,
  CalendarDays,
  MessageSquare,
  Heart,
};