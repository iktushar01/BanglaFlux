"use client";

import { syncAuthUserAction } from "@/actions/authActions/_syncAuthUserAction";
import Link from "next/link";
import { ModeToggle } from "@/components/shared/modeToggle";
import { Button } from "@/components/ui/button";
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
import { Menu, LogOut, User, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMutation, useQuery } from "@tanstack/react-query";
import { logoutAction } from "./_logoutAction";
import { getCookie, deleteCookie } from "cookies-next";
import { useState } from "react";
import Logo from "@/components/shared/logo/logo";
import type { UserFromCookie } from "@/types/auth.types";

const Navbar = () => {
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  const [user, setUser] = useState<UserFromCookie | null>(() => {
    const userCookie = getCookie("user");
    if (!userCookie) return null;

    try {
      return JSON.parse(userCookie as string) as UserFromCookie;
    } catch {
      return null;
    }
  });

  const { data: syncedUser } = useQuery({
    queryKey: ["auth-user-sync"],
    queryFn: syncAuthUserAction,
    enabled: !user,
    staleTime: 60_000,
    retry: false,
  });
  
  const resolvedUser =
    user ??
    (syncedUser?.success && syncedUser.data
      ? syncedUser.data
      : null);

  const { mutate: handleLogout, isPending: isLoggingOut } = useMutation({
    mutationFn: logoutAction,
    onSuccess: () => {
      deleteCookie("user");
      deleteCookie("accessToken");
      deleteCookie("refreshToken");
      deleteCookie("better-auth.session_token");
      deleteCookie("better-auth.session_data");
      setUser(null);
      setIsLogoutDialogOpen(false);
      window.location.assign("/");
    },
    onError: () => {
      deleteCookie("user");
      deleteCookie("accessToken");
      deleteCookie("refreshToken");
      deleteCookie("better-auth.session_token");
      deleteCookie("better-auth.session_data");
      setUser(null);
      setIsLogoutDialogOpen(false);
      window.location.assign("/");
    },
  });

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-14 items-center justify-between px-4 max-w-6xl">
        <Logo />

        <div className="flex items-center gap-2">
          <ModeToggle />

          <div className="mx-1 hidden h-4 w-px bg-border sm:block" />

          {resolvedUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full p-0 border border-border"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={resolvedUser.avatar ?? resolvedUser.image ?? undefined}
                      alt={resolvedUser.name}
                    />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                      {resolvedUser.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="mt-1 w-56 rounded-xl shadow-md"
                align="end"
              >
                <DropdownMenuLabel className="p-2 font-normal">
                  <div className="flex flex-col space-y-0.5">
                    <p className="text-sm font-medium text-foreground">{resolvedUser.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {resolvedUser.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    className="cursor-pointer gap-2 rounded-lg py-1.5"
                    asChild
                  >
                    <Link href="/profile">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setIsLogoutDialogOpen(true)}
                  disabled={isLoggingOut}
                  className="cursor-pointer gap-2 rounded-lg py-1.5 text-destructive focus:bg-destructive/10 focus:text-destructive"
                >
                  {isLoggingOut ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <LogOut className="h-4 w-4" />
                  )}
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              {/* Mobile View Navigation Menu */}
              <div className="sm:hidden">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="mt-1 w-40 rounded-xl"
                  >
                    <DropdownMenuItem asChild className="cursor-pointer rounded-lg">
                      <Link href="/login">Log In</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer rounded-lg font-medium text-primary">
                      <Link href="/register">Sign Up</Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Desktop Auth Actions */}
              <div className="hidden items-center gap-1.5 sm:flex">
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="font-medium h-9 text-muted-foreground hover:text-foreground"
                >
                  <Link href="/login">Log In</Link>
                </Button>
                <Button
                  size="sm"
                  asChild
                  className="h-9 rounded-lg px-4 font-semibold shadow-sm"
                >
                  <Link href="/register">Sign Up</Link>
                </Button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Simplified and Sleek Sign Out Confirmation Box */}
      <AlertDialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
        <AlertDialogContent className="max-w-md rounded-xl border border-border bg-background p-6 shadow-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold tracking-tight">
              Sign out?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-muted-foreground leading-relaxed">
              You will be disconnected from your session. Any unsaved page context state configuration might reset.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="mt-4 sm:gap-2">
            <AlertDialogCancel
              disabled={isLoggingOut}
              className="h-10 rounded-lg font-medium border-border"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(event) => {
                event.preventDefault();
                handleLogout();
              }}
              disabled={isLoggingOut}
              className="h-10 rounded-lg bg-destructive text-destructive-foreground font-semibold hover:bg-destructive/90"
            >
              {isLoggingOut ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Signing out...</span>
                </div>
              ) : (
                "Sign out"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </nav>
  );
};

export default Navbar;