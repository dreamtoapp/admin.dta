import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function SettingsPage() {
  const session = await auth();

  if (!session) {
    // Redirect to signin without locale prefix
    redirect('/auth/signin');
  }

  // Redirect to the default locale settings page
  redirect('/ar/settings');
}

