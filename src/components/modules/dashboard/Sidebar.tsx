"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { logoutAction } from "@/components/modules/HomePage/_logoutAction";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuBadge,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, Settings, ChevronUp, Loader2 } from "lucide-react";
import { SidebarData } from "@/types/sidebar";
import SidebarLogo from "./SidebarLogo";
import { iconRegistry } from "@/components/shared/Iconregistry";
import { UserFromCookie } from "@/types/auth.types";
import { deleteCookie } from "cookies-next";
import { useState } from "react";

type AppSidebarProps = {
  data: SidebarData;
  user: UserFromCookie | null;
};

export const AppSidebar = ({ data, user }: AppSidebarProps) => {
  const pathname = usePathname();
  const { setOpenMobile, isMobile } = useSidebar();
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const res = await logoutAction();
      if (res.success) {
        deleteCookie("user");
        deleteCookie("accessToken");
        deleteCookie("refreshToken");
        deleteCookie("better-auth.session_token");
        deleteCookie("better-auth.session_data");
        toast.success("Logged out successfully");
        if (isMobile) setOpenMobile(false);
        setIsLogoutDialogOpen(false);
        window.location.assign("/");
      }
    } catch {
      toast.error("An error occurred during logout");
      deleteCookie("user");
      deleteCookie("accessToken");
      deleteCookie("refreshToken");
      deleteCookie("better-auth.session_token");
      deleteCookie("better-auth.session_data");
      setIsLogoutDialogOpen(false);
      window.location.assign("/");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  const settingsHref =
    user?.role === "ADMIN" || user?.role === "SUPER_ADMIN"
      ? "/admin/dashboard/settings"
      : "/dashboard/settings";

  return (
    <Sidebar>
      {/* Header: Logo */}
      <SidebarHeader className="p-4">
        <SidebarLogo />
      </SidebarHeader>

      <SidebarSeparator />

      {/* Navigation groups */}
      <SidebarContent>
        {data.navGroups.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>

            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = iconRegistry[item.icon];

                  return (
                    <SidebarMenuItem key={item.label}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        tooltip={item.label}
                      >
                        <Link
                          href={item.href}
                          onClick={() => isMobile && setOpenMobile(false)}
                        >
                          {Icon && <Icon className="h-4 w-4" />}
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>

                      {item.badge !== undefined && (
                        <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
                      )}
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarSeparator />

      {/* Footer: User info + dropdown */}
      <SidebarFooter className="p-3">
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="w-full data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar className="h-8 w-8 rounded-md">
                  <AvatarImage src={user.avatar ?? undefined} alt={user.name} />
                  <AvatarFallback className="rounded-md text-xs">
                    {initials}
                  </AvatarFallback>
                </Avatar>

                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {user.email}
                  </span>
                </div>

                <ChevronUp className="ml-auto h-4 w-4 shrink-0 text-muted-foreground" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              side="top"
              align="end"
              className="w-56"
              sideOffset={8}
            >
              <div className="px-2 py-1.5">
                <p className="text-xs text-muted-foreground">Signed in as</p>
                <p className="truncate text-sm font-medium">{user.email}</p>
                <span className="mt-1 inline-block rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  {user.role}
                </span>
              </div>

              <DropdownMenuSeparator />

              <DropdownMenuItem asChild>
                <Link
                  href={settingsHref}
                  className="cursor-pointer"
                  onClick={() => isMobile && setOpenMobile(false)}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onSelect={() => setIsLogoutDialogOpen(true)}
                className="cursor-pointer text-destructive focus:text-destructive"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <p className="px-2 text-xs text-muted-foreground">Not signed in</p>
        )}
      </SidebarFooter>

      {/* Clean & Centered Confirmation Dialog */}
      <AlertDialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
        <AlertDialogContent className="max-w-[400px] rounded-lg border border-border bg-background p-6 shadow-lg">
          <AlertDialogHeader className="text-center sm:text-left space-y-1.5">
            <AlertDialogTitle className="text-xl font-semibold tracking-tight">
              Sign out now?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-muted-foreground leading-normal">
              This will end your current session. Make sure you&apos;ve saved any in-progress work before continuing.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="pt-2 sm:space-x-2">
            <AlertDialogCancel
              disabled={isLoggingOut}
              className="rounded-md text-xs h-9"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(event) => {
                event.preventDefault();
                void handleLogout();
              }}
              disabled={isLoggingOut}
              className="rounded-md bg-destructive text-xs h-9 text-destructive-foreground hover:bg-destructive/95 shadow-sm"
            >
              {isLoggingOut ? (
                <div className="flex items-center gap-1.5">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Signing out...</span>
                </div>
              ) : (
                "Sign out"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Sidebar>
  );
};