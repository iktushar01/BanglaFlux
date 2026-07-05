import EditChannelPage from "@/components/modules/adminDashboardPages/EditChannelPage";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminEditChannelPage({ params }: PageProps) {
  const { id } = await params;
  return <EditChannelPage channelId={id} />;
}
