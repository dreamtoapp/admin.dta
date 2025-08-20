import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import SignInForm from "./SignInForm";
import Image from "next/image";

export default async function SignInPage() {
  const session = await auth();

  if (session) {
    const role = session.user?.role?.toUpperCase();
    if (role === "ADMIN") {
      redirect("/dashboard/admin");
    } else if (role === "STAFF") {
      redirect("/dashboard/staff");
    } else {
      redirect("/dashboard/client");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <Image
              src="/assets/dreamtoapp/dreamToApp.svg"
              alt="DreamToApp"
              width={180}
              height={48}
              className="block dark:hidden h-12 w-auto"
              priority
            />
            <Image
              src="/assets/dreamtoapp/dreamToApp-dark.svg"
              alt="DreamToApp"
              width={180}
              height={48}
              className="hidden dark:block h-12 w-auto"
              priority
            />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-foreground">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Access your unified dashboard
          </p>
        </div>
        <SignInForm />
      </div>
    </div>
  );
}

