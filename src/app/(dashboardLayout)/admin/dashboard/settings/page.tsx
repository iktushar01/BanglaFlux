import ThemeSettingsPage from "@/components/modules/settings/ThemeSettingsPage";
import AdminNoticeSettings from "@/components/modules/adminDashboardPages/AdminNoticeSettings";

const AdminSettingsPage = () => {
  return <ThemeSettingsPage scope="admin" extraContent={<AdminNoticeSettings />} />;
};

export default AdminSettingsPage;
