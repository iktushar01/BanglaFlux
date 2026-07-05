import Link from "next/link";
import { LayoutDashboard, Settings } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/app-config";

const ClientDashboardPage = () => {
  return (
    <div className="space-y-8 p-1">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="max-w-2xl text-muted-foreground">
          Welcome to the default client area for {APP_NAME}. Replace this page with
          your project&apos;s main user experience.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <LayoutDashboard className="h-5 w-5" />
              Getting started
            </CardTitle>
            <CardDescription>
              Use this layout as the base for authenticated client pages.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline">
              <Link href="/profile">View profile</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Settings className="h-5 w-5" />
              Account settings
            </CardTitle>
            <CardDescription>
              Manage preferences and account details from the settings page.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline">
              <Link href="/dashboard/settings">Open settings</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClientDashboardPage;
