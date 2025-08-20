## Staff Productivity Dashboard – Simple MVP

### Goals
- [ ] Staff can publish what they worked on (with evidence) in minutes
- [ ] Admin can review (approve/reject) and see basic activity
- [ ] Keep schema, endpoints, and UI minimal

### Minimal Prisma Changes

```prisma
model WorkLog {
  id           String   @id @default(auto()) @map("_id") @db.ObjectId
  userId       String   @db.ObjectId
  taskId       String?  @db.ObjectId
  title        String
  summary      String?
  timeSpentMin Int?
  links        String[]
  attachments  String[]
  status       WorkLogStatus @default(PENDING)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  task Task? @relation(fields: [taskId], references: [id], onDelete: SetNull)
}

enum WorkLogStatus {
  PENDING
  APPROVED
  REJECTED
}

// Optional back-relations (no FKs here; referenced by WorkLog)
model User {
  // ...existing...
  workLogs WorkLog[]
}

model Task {
  // ...existing...
  workLogs WorkLog[]
}
```

Indexes (recommended):
- [ ] `(userId, createdAt desc)`
- [ ] `(status, createdAt desc)`
- [ ] `(taskId)`

Migration steps:
- [ ] Update `prisma/schema.prisma`
- [ ] Run `pnpm prisma generate`

### Minimal API
- [ ] POST `/api/worklogs` (staff create)
  - body: `{ title, summary?, timeSpentMin?, taskId?, links?: string[], attachments?: string[] }`
- [ ] GET `/api/worklogs` (role-aware list)
  - staff → own logs; admin → all, filter by `userId`, `from`, `to`, `status`
- [ ] POST `/api/worklogs/[id]/review`
  - admin only; body: `{ action: 'approve'|'reject' }`

### Minimal UI – Staff
- [ ] On `/{locale}/staff/dashboard` add button “Publish Work” → modal/form
- [ ] Fields: Title (required), Summary (optional), Time Spent (optional), Task (select), Links[], Attachments[]
- [ ] After submit → toast (Sonner), list shows Today/This Week logs with status

### Minimal UI – Admin
- [ ] Table: Date, User, Title, Time, Task, Status, Actions
- [ ] Filters: Date range, User, Status
- [ ] Actions: Approve | Reject

### Minimal KPIs
- [ ] Per-user: logs Today, logs This Week
- [ ] Team total: logs Today/This Week

### Governance (MVP)
- [ ] Server guards with `auth()`; staff see own, admin see all
- [ ] Editable only while `PENDING`; locked after review
- [ ] Localize strings (next-intl); use Sonner toasts

---

## Execution Plan (End‑to‑End, Zero‑Error Checklist)

### Frontend‑First Build (do this BEFORE backend)
- [ ] Add UI and validation without real APIs; wire later
- [ ] All forms use React Hook Form + Zod + shadcn/ui (toasts via Sonner)
- [ ] Locale‑aware links/redirects via `@/i18n/routing`

Frontend deliverables:
- [ ] `WorkLogForm` (client) — publish work
  - Fields: Title (required), Summary, Time Spent (minutes), Task (select), Links[], Attachments[] (Cloudinary uploader), Submit
  - Validation: `lib/validations/worklog.ts` (Zod) with `createWorkLogSchema`
  - UX: Dialog/Drawer + keyboard submit, disabled state, error summaries
- [ ] Staff list (client) — “My Work (Today/Week)”
  - Card rows: title, date, time, task, status chip
  - Filters: quick tabs Today | Week
  - Data: temporary in‑memory store (or `localStorage` via `hooks/useFormPersistence.ts`)
- [ ] Admin review table (skeleton only for now)
  - Columns: Date, User, Title, Time, Task, Status, Actions (disabled until backend)
  - Filters UI only (no data yet)
- [ ] i18n strings added to `messages/en.json` + `messages/ar.json`
- [ ] No hardcoded colors/text; follow design tokens and existing components

File map (proposed, minimal):
- [ ] `app/[locale]/staff/dashboard/WorkLogForm.tsx` (client)
- [ ] `app/[locale]/staff/dashboard/components/WorkLogCard.tsx` (client)
- [ ] `app/[locale]/staff/dashboard/components/WorkLogList.tsx` (client)
- [ ] `lib/validations/worklog.ts` (Zod schemas shared later with API)
- [ ] (Optional) `app/[locale]/admin/dashboard/WorkLogsTable.tsx` (client, skeleton)

Temporary data layer (no backend):
- [ ] `helpers/worklogs.client.ts` with `createDraftWorkLog`, `listMyWorkLogs`, using `localStorage` key `worklogs:v1:${userId}` for demo
- [ ] Replace with real API calls in backend phase

### 0) Prerequisites
- [ ] Ensure `.env` has `AUTH_URL`, `AUTH_SECRET`, and (dev) `AUTH_TRUST_HOST=true`
- [ ] Confirm `pnpm` is used; Node ≥ 18; Typescript ≥ 5.9; Next.js 15
- [ ] Run baseline checks: `pnpm build` and `npx tsc --noEmit`

### 1) Branch & Skeleton
- [ ] Create feature branch: `git checkout -b feat/worklogs-mvp`
- [ ] Create folder placeholders:
  - [ ] `app/api/worklogs/` (index route)
  - [ ] `app/api/worklogs/[id]/` (review route)
  - [ ] `lib/validations/worklog.ts` (Zod schemas)

### 2) Prisma Schema
- [ ] Add `WorkLog` model + `WorkLogStatus` enum (as above Minimal Prisma Changes)
- [ ] Add back-relations on `User` and `Task` (optional for convenience)
- [ ] Add recommended indexes
- [ ] Generate client: `pnpm prisma generate`
- [ ] Optional: add a small seed script to insert demo WorkLogs

### 3) Validation (Zod)
- [ ] Create `lib/validations/worklog.ts` with:
  - [ ] `createWorkLogSchema`: `{ title: string(min 2), summary?: string, timeSpentMin?: number, taskId?: string, links?: string[], attachments?: string[] }`
  - [ ] `reviewWorkLogSchema`: `{ action: enum(['approve','reject']) }`
  - [ ] Export `infer` types for API/UI

### 4) API Routes (App Router)
- [ ] POST `/{locale?}/api/worklogs` (staff create)
  - [ ] Guard with `auth()`; deny if no session
  - [ ] Parse body with `createWorkLogSchema`
  - [ ] Insert WorkLog with `status=PENDING`
  - [ ] Return JSON `{ success, workLog }`
- [ ] GET `/{locale?}/api/worklogs` (role‑aware list)
  - [ ] Guard with `auth()`
  - [ ] If role=STAFF → `where: { userId: session.user.id }`
  - [ ] If role=ADMIN → allow filters `userId, status, from, to`
  - [ ] Order by `createdAt desc`; paginate `?page&limit`
- [ ] POST `/{locale?}/api/worklogs/[id]/review` (admin review)
  - [ ] Guard with `auth()`; require `ADMIN`
  - [ ] Validate `{ action }`; update `status` accordingly
  - [ ] Return JSON `{ success }` and optionally create `TaskNotification`
  - [ ] Use Promise‑based `context.params` typing per Next.js 15

### 5) Staff UI – Publish Work
- [ ] Add "Publish Work" button on `/{locale}/staff/dashboard`
- [ ] Create `WorkLogForm` (client component) with React Hook Form + Zod Resolver
  - [ ] Fields: Title, Summary, Time Spent (minutes), Task (select from user tasks), Links[], Attachments[] (Cloudinary), Submit
  - [ ] Use existing shadcn/ui inputs; toasts via Sonner [[6426015]]
- [ ] On submit: POST to API; optimistic UI; success toast; refresh list
- [ ] Below dashboard stats, show "My Work (Today/This Week)" list with status chips

### 6) Admin UI – Review
- [ ] In `/{locale}/admin/dashboard` (or staff dashboard if role=ADMIN, as a tab):
  - [ ] Table: Date, User, Title, Time, Task, Status, Actions
  - [ ] Filters: Date range, User (select), Status
  - [ ] Actions: Approve | Reject → POST review endpoint → toast → refresh

### 7) Internationalization
- [ ] Add i18n keys to `messages/en.json` and `messages/ar.json` for all new labels/buttons/toasts
- [ ] No hardcoded text or colors; follow existing design tokens [[4891125]]

### 8) Quality Gates
- [ ] Typecheck: `npx tsc --noEmit` (zero errors)
- [ ] Lint: `pnpm lint` (fix where trivial)
- [ ] Build: `pnpm build` (no Next.js typing issues; ensure Promise‑params in routes)
- [ ] Manual QA:
  - [ ] Staff: create, view, and edit pending Work Log; resubmit
  - [ ] Admin: list, filter, approve, reject
  - [ ] Permissions: staff cannot see others’ logs; cannot edit after approval
  - [ ] Locale switching preserves routes (prefix via `@/i18n/routing`)

### 9) Deliverables & Definition of Done
- [ ] `WorkLog` schema migrated and Prisma generated
- [ ] 3 API endpoints implemented with guards and Zod validation
- [ ] Staff dashboard has working Publish Work modal and self list
- [ ] Admin review table with approve/reject
- [ ] i18n complete for en/ar; toasts via Sonner; zero TS errors and build clean
- [ ] Short README block in `doc/STAFF_PRODUCTIVITY_DASHBOARD.md` on how to use


