export { auth as middleware } from "@/lib/auth"

export const config = {
  matcher: [
    // Protect all dashboard routes
    "/dashboard/:path*",
    "/api/users/management/:path*",
    "/api/tasks/:path*",
    // Exclude password change endpoint - let it handle auth internally
    // Exclude all other routes (including homepage and auth)
  ],
};
