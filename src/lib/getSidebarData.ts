import { adminSidebar } from "@/components/data/adminSidebar";
import { getClientSidebarData } from "@/components/data/clientSidebar";
import { SidebarData } from "@/types/sidebar";
import { UserRole } from "./authUtils";

export const getSidebarData = async (role: UserRole): Promise<SidebarData> => {
  switch (role) {
    case "ADMIN":
    case "SUPER_ADMIN":
      return adminSidebar;
    case "CLIENT":
    default:
      return await getClientSidebarData();
  }
};