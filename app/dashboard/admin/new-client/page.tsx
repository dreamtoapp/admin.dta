import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import NewClientClient from "./NewClientClient";

export default async function NewClientPage() {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    redirect("/auth/signin");
  }

  return (
    <div className="space-y-6">
      <NewClientClient
        user={{
          id: session.user.id,
          name: (session.user.name as string) || session.user.fullName || null,
          email: session.user.email || "",
          role: session.user.role || "client",
        }}
      />
    </div>
  );
}


