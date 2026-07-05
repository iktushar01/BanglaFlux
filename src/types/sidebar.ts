import { IconName } from "@/components/shared/Iconregistry";

export type NavItem = {
  label: string;
  icon: IconName;
  href: string;
  badge?: string | number;
};

export type NavGroup = {
  title: string;
  items: NavItem[];
};

export type SidebarData = {
  logo: {
    src: string;
    alt: string;
    title: string;
    description: string;
  };
  navGroups: NavGroup[];
};