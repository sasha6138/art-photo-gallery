import { notFound } from "next/navigation";
import AdminDashboard from "@/components/admin/AdminDashboard";
import { chatGPTSignOutPath, requireChatGPTUser } from "@/server/auth/chatgpt";

export const dynamic = "force-dynamic";

function authorizedEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export default async function AdminPage() {
  const user = await requireChatGPTUser("/admin");
  const allowlist = authorizedEmails();

  if (!allowlist.includes(user.email.toLowerCase())) notFound();

  return (
    <AdminDashboard
      displayName={user.displayName}
      email={user.email}
      signOutPath={chatGPTSignOutPath("/")}
    />
  );
}
