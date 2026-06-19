import AdminLayoutClient from "@/components/admin/AdminLayout";

export const metadata = {
  title: "Admin Panel - Curious Mind",
  description: "Manage your website content",
};

export default function AdminRootLayout({ children }) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
