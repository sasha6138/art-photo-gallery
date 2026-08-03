import { notFound } from "next/navigation";
import { getChatGPTUser, requireChatGPTUser } from "./chatgpt";

function authorizedEmails() {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

function isAuthorized(email: string) {
  return authorizedEmails().includes(email.toLowerCase());
}

export async function requireAdministratorPage() {
  const user = await requireChatGPTUser("/admin");
  if (!isAuthorized(user.email)) notFound();
  return user;
}

export async function requireAdministratorApi() {
  const user = await getChatGPTUser();
  if (!user) return { error: Response.json({ error: "Authentication required." }, { status: 401 }) } as const;
  if (!isAuthorized(user.email)) return { error: Response.json({ error: "Administrator access required." }, { status: 403 }) } as const;
  return { user } as const;
}
