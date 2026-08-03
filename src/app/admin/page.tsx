import AdminDashboard from "@/components/admin/AdminDashboard";
import { chatGPTSignOutPath } from "@/server/auth/chatgpt";
import { requireAdministratorPage } from "@/server/auth/administrator";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const user = await requireAdministratorPage();

  return (
    <AdminDashboard
      displayName={user.displayName}
      email={user.email}
      signOutPath={chatGPTSignOutPath("/")}
    />
  );
}

