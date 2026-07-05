"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowUpRight,
  LayoutDashboard,
  Loader2,
  Settings,
  ShieldCheck,
  UserCog,
} from "lucide-react";

import { getCurrentUserAction } from "@/actions/_getCurrentUserAction";
import { APP_NAME } from "@/lib/app-config";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const quickLinks = [
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
  {
    title: "Profile",
    description: "View and edit your account details.",
    href: "/profile",
    icon: ShieldCheck,
    roles: ["ADMIN", "SUPER_ADMIN"] as const,
  },
];

const AdminDashboardHome = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUserAction,
  });

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
    link.roles.includes(user.role as "ADMIN" | "SUPER_ADMIN"),
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
            This is the default admin home for {APP_NAME}. Replace this page with
            project-specific metrics, tables, and workflows when you start a new app.
          </p>
        </div>
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
