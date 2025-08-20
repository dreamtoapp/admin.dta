import { getServerSession } from "@/lib/auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export interface AuthGuardOptions {
  requiredRole?: "ADMIN" | "STAFF" | "CLIENT";
  redirectTo?: string;
}

/**
 * Server-side authentication guard
 * Use this in server components and server actions
 */
export async function requireAuth(options: AuthGuardOptions = {}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect(options.redirectTo || "/auth/signin");
  }

  if (options.requiredRole) {
    const userRole = session.user.role;

    // Role hierarchy: ADMIN > STAFF > CLIENT
    const roleHierarchy = {
      ADMIN: 3,
      STAFF: 2,
      CLIENT: 1
    };

    if (roleHierarchy[userRole as keyof typeof roleHierarchy] < roleHierarchy[options.requiredRole]) {
      redirect(options.redirectTo || "/auth/unauthorized");
    }
  }

  return session;
}

/**
 * Check if user has specific role
 */
export async function hasRole(requiredRole: "ADMIN" | "STAFF" | "CLIENT"): Promise<boolean> {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return false;

    const userRole = session.user.role;
    const roleHierarchy = {
      ADMIN: 3,
      STAFF: 2,
      CLIENT: 1
    };

    return roleHierarchy[userRole as keyof typeof roleHierarchy] >= roleHierarchy[requiredRole];
  } catch {
    return false;
  }
}

/**
 * Check if user is admin
 */
export async function isAdmin(): Promise<boolean> {
  return hasRole("ADMIN");
}

/**
 * Check if user is staff or admin
 */
export async function isStaffOrAdmin(): Promise<boolean> {
  return hasRole("STAFF");
}

/**
 * Get current user session with type safety
 */
export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  if (!session) return null;

  return {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name,
    role: session.user.role,
    department: session.user.department,
    image: session.user.image
  };
}

/**
 * Redirect if not authenticated
 */
export async function redirectIfNotAuth(redirectTo: string = "/auth/signin") {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect(redirectTo);
  }
  return session;
}

/**
 * Redirect if not authorized for role
 */
export async function redirectIfNotAuthorized(
  requiredRole: "ADMIN" | "STAFF" | "CLIENT",
  redirectTo: string = "/auth/unauthorized"
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/auth/signin");
  }

  const userRole = session.user.role;
  const roleHierarchy = {
    ADMIN: 3,
    STAFF: 2,
    CLIENT: 1
  };

  if (roleHierarchy[userRole as keyof typeof roleHierarchy] < roleHierarchy[requiredRole]) {
    redirect(redirectTo);
  }

  return session;
}
