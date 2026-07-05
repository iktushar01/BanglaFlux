import { SidebarData } from "@/types/sidebar";
import { APP_NAME } from "@/lib/app-config";

export const adminSidebar: SidebarData = {
  logo: {
    src: "/logo.png",
    alt: `${APP_NAME} logo`,
    title: APP_NAME,
    description: "Admin Panel",
  },
  navGroups: [
    {
      title: "Overview",
      items: [
        { label: "Dashboard",      icon: "LayoutDashboard", href: "/admin/dashboard" },
      ],
    },
    // {
    //   title: "Management",
    //   items: [
    //     { label: "Users",               icon: "Users",       href: "/dashboard/admin/users" },
    //     { label: "Roles & Permissions", icon: "ShieldCheck", href: "/dashboard/admin/roles" },
    //   ],
    // },
    {
      title: "System",
      items: [
        { label: "Settings", icon: "Settings", href: "/admin/dashboard/settings" },
      ],
    },
  ],
};
