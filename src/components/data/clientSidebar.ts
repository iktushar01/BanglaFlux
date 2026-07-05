import { SidebarData } from "@/types/sidebar";
import { APP_NAME } from "@/lib/app-config";

export const getClientSidebarData = async (): Promise<SidebarData> => {
  return {
    logo: {
      src: "/logo.png",
      alt: `${APP_NAME} logo`,
      title: APP_NAME,
      description: "Student Panel",
    },
    navGroups: [
      {
        title: "Main",
        items: [
          {
            label: "Dashboard",
            icon: "LayoutDashboard",
            href: "/dashboard",
          },
          {
            label: "Settings",
            icon: "Settings",
            href: "/dashboard/settings",
          },
        ],
      },
    ],
  };
};