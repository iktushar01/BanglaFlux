"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowUpRight,
  LayoutDashboard,
  Loader2,
  Settings,
  Tv,
  Upload,
  UserCog,
} from "lucide-react";

import { getCurrentUserAction } from "@/actions/_getCurrentUserAction";
import { useAdminStats } from "@/hooks/useChannels";
import { APP_NAME } from "@/lib/app-config";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const quickLinks = [
  {
    title: "Upload Playlist",
    description: "Import M3U file or URL.",
    href: "/admin/playlists",
    icon: Upload,
    roles: ["ADMIN", "SUPER_ADMIN"] as const,
  },
  {
    title: "Manage Channels",
    description: "Edit, toggle, or delete channels.",
    href: "/admin/channels",
    icon: Tv,
    roles: ["ADMIN", "SUPER_ADMIN"] as const,
  },
  {
    title: "Admin Management",
    description: "Create and manage admin accounts.",
    href: "/admin/admin-management",
    icon: UserCog,
    roles: ["SUPER_ADMIN"] as const,
  },
  {
    title: "Settings",
    description: "Update your admin profile and preferences.",
    href: "/admin/dashboard/settings",
    icon: Settings,
    roles: ["ADMIN", "SUPER_ADMIN"] as const,
  },
];

const AdminDashboardHome = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUserAction,
  });

  const { data: stats, isLoading: statsLoading } = useAdminStats();

  const user = data?.data;

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Unable to load dashboard</CardTitle>
            <CardDescription>
              Your session could not be verified. Try signing in again.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/login">Go to login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const visibleLinks = quickLinks.filter((link) =>
    (link.roles as readonly string[]).includes(user.role),
  );

  return (
    <div className="space-y-8 p-1">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="secondary" className="gap-1">
            <LayoutDashboard className="h-3.5 w-3.5" />
            Admin Dashboard
          </Badge>
          <Badge variant="outline">{user.role.replace("_", " ")}</Badge>
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {user.name}
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Manage {APP_NAME} IPTV channels, playlists, and streaming content.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statsLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <div className="h-4 w-24 animate-pulse rounded bg-muted" />
              </CardHeader>
              <CardContent>
                <div className="h-8 w-16 animate-pulse rounded bg-muted" />
              </CardContent>
            </Card>
          ))
        ) : (
          <>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Channels</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{stats?.total ?? 0}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Active</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-green-500">{stats?.active ?? 0}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Inactive</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-muted-foreground">{stats?.inactive ?? 0}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Playlists</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{stats?.playlists ?? 0}</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {visibleLinks.map((link) => {
          const Icon = link.icon;

          return (
            <Card key={link.href} className="transition-colors hover:border-primary/40">
              <CardHeader className="space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border bg-muted/50">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-lg">{link.title}</CardTitle>
                  <CardDescription>{link.description}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full justify-between">
                  <Link href={link.href}>
                    Open
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default AdminDashboardHome;
