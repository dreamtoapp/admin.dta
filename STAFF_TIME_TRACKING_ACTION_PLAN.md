### Staff Time Tracking via Login/Logout — Simple & Effective Plan

Purpose: Track staff working time automatically when they log in and log out, with an optional manual fallback. Keep it minimal, reliable, and easy to maintain.

---

### High-level Approach
- On successful login, create a new attendance session with `loginAt`.
- On logout, close the latest open session by setting `logoutAt` and computing `durationMin`.
- If a user closes the tab without logging out, auto-close any stale open session the next time they log in (configurable idle cap, e.g., 12 hours).
- Optional: Manual Check In/Check Out buttons for edge cases (mobile, network glitches).

This uses:
- Prisma model `Attendance`
- NextAuth events (`signIn`, `signOut`) for automatic tracking
- Minimal API routes for manual fallback

---

### Data Model (Prisma)
```prisma
model Attendance {
  id           String   @id @default(auto()) @map("_id") @db.ObjectId
  userId       String   @db.ObjectId
  loginAt      DateTime
  logoutAt     DateTime?
  durationMin  Int?     // Computed on close: ceil((logoutAt - loginAt)/60_000)
  source       String   // AUTO_LOGIN_LOGOUT | MANUAL_BUTTON
  ip           String?
  userAgent    String?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId, loginAt])
}
```

Notes:
- `source` helps distinguish auto vs manual sessions.
- `ip`/`userAgent` are optional for auditing (fill from request headers if available).

---

### Automatic Tracking (NextAuth Events)
Add event handlers in `lib/auth.ts` (or wherever NextAuth is configured) to persist check-in/out.

```ts
import { prisma } from "@/lib/prisma";

export const authOptions = {
  // ... providers, callbacks, etc.
  events: {
    async signIn({ user /*, account, profile, isNewUser*/ }) {
      try {
        // Close any stale open session from previous day or >12h idle
        await prisma.attendance.updateMany({
          where: {
            userId: user.id!,
            logoutAt: null,
            loginAt: { lt: new Date(Date.now() - 12 * 60 * 60 * 1000) },
          },
          data: {
            logoutAt: new Date(),
            durationMin: 12 * 60,
          },
        });

        // Start a new session
        await prisma.attendance.create({
          data: {
            userId: user.id!,
            loginAt: new Date(),
            source: "AUTO_LOGIN_LOGOUT",
          },
        });
      } catch (e) {
        console.error("[attendance:signIn]", e);
      }
    },
    async signOut({ token /*, session*/ }) {
      try {
        if (!token?.sub) return;
        // Close latest open session
        const open = await prisma.attendance.findFirst({
          where: { userId: token.sub, logoutAt: null },
          orderBy: { loginAt: "desc" },
        });
        if (open) {
          const now = new Date();
          const minutes = Math.max(
            1,
            Math.ceil((now.getTime() - open.loginAt.getTime()) / 60000)
          );
          await prisma.attendance.update({
            where: { id: open.id },
            data: { logoutAt: now, durationMin: minutes },
          });
        }
      } catch (e) {
        console.error("[attendance:signOut]", e);
      }
    },
  },
};
```

Notes:
- This uses NextAuth `events.signIn/signOut` (App Router compatible). If you need request IP/UA, capture in a small API route (see below) or via middleware.

---

### Manual Fallback APIs (Optional)
Provide endpoints in `app/api/attendance/check-in` and `app/api/attendance/check-out` for a small Check In/Check Out UI.

```ts
// POST /api/attendance/check-in
// Requires session; creates a session only if there is no open one
```

```ts
// POST /api/attendance/check-out
// Requires session; closes the latest open session and computes duration
```

Validation rules:
- Prevent multiple open sessions per user.
- If a user checks in with an existing open session, return the existing one (idempotent).

---

### Minimal UI
- Auto mode: nothing to add; time is captured on login/logout.
- Optional manual controls (if you want visible buttons):
  - Add a small `Check In` / `Check Out` pair in the header of `StaffProfileClient` (visible only when `isEditing` is false), calling the APIs.
  - Add a badge “Online” when a session is open and “Last session: 2h 15m” when closed.

---

### Reporting (Phase 2, Optional)
- A simple page at `admin > staff > attendance` listing:
  - Daily totals per user
  - Filters by date range
  - CSV export
- Compute totals server-side with Prisma aggregations:
  - Sum of `durationMin` grouped by day and user.

---

### Edge Cases & Rules
- Stale sessions: auto-close on next login if older than 12 hours (configurable).
- Multiple tabs: treat as a single session (only one open session per user).
- Missing logout: handled by stale session close rule.
- Timezone: display in user’s local time; store UTC in DB.

---

### Step-by-step Checklist
1) Prisma: add `Attendance` model and run migration.
2) NextAuth: add `events.signIn` and `events.signOut` handlers.
3) Optional APIs: `/api/attendance/check-in` and `/api/attendance/check-out` (idempotent).
4) UI (optional): small buttons in staff header; status badge.
5) Admin report (optional): simple list with total minutes per day.
6) Configure `STALE_SESSION_HOURS` (default 12) via env if desired.

---

### Rollout
- Deploy Prisma migration.
- Ship NextAuth events.
- Monitor the first week: validate session closures and totals.
- Add manual controls only if users request them.

---

### Success Criteria
- Every login creates an open session; logout closes it with a computed duration.
- No user has more than one open session.
- Admins can see accurate totals; staff can see their latest session status.


