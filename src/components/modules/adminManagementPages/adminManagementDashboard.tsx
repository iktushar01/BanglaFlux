import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowUpRight, Tv, Upload, List } from "lucide-react";

const AdminManagementDashboard = () => {
  return (
    <div className="space-y-6 p-1">
      <div>
        <h1 className="text-2xl font-bold">Admin Management</h1>
        <p className="text-muted-foreground">
          Manage admin accounts and system access.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Coming soon</CardTitle>
          <CardDescription>
            Admin user management will be available in a future update.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/admin/dashboard">Back to dashboard</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminManagementDashboard;
