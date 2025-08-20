# 🧭 Layout Organization Task Plan & Checklist (Best Practices)

This plan converts your layout strategy into actionable tasks with checklists and official documentation references.

## 🔗 Quick Reference (Official Docs)
- Next.js App Router – Layouts & Templates: https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts
- Next.js App Router – Route Groups: https://nextjs.org/docs/app/building-your-application/routing/route-groups
- Next.js App Router – Loading UI: https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming
- Next.js App Router – Error Handling: https://nextjs.org/docs/app/building-your-application/routing/error-handling
- Next.js – Metadata: https://nextjs.org/docs/app/building-your-application/optimizing/metadata
- React – Server vs Client Components: https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns#using-server-and-client-components-together
- next-intl (v3) – App Router Setup: https://next-intl.dev/docs/next-13/server-components
- next-auth – App Router: https://authjs.dev/getting-started/installation?framework=next.js

---

## 🎯 Objectives
- Normalize layout responsibilities (root vs locale vs route-group)
- Avoid duplicate semantic HTML (one <main> only)
- Add consistent loading/error boundaries
- Place i18n, auth, and providers at the correct levels

---

## ✅ Phase 0 — Audit (Inventory & Agreements)
- [ ] Inventory layout files
  - [ ] `app/layout.tsx`
  - [ ] `app/[locale]/layout.tsx`
  - [ ] `app/[locale]/(dashboard)/admin/dashboard/layout.tsx`
  - [ ] Missing (create): `app/[locale]/(homepage)/layout.tsx`, `app/[locale]/(dashboard)/layout.tsx`
- [ ] Agree responsibilities per level
  - [ ] Root: HTML shell + global providers/scripts only
  - [ ] Locale: Navbar/Footer, i18n/session providers, single <main>
  - [ ] Route groups: section-specific structure (homepage, dashboard, admin)

---

## 🧱 Phase 1 — Root Layout Cleanup (`app/layout.tsx`)
- [ ] Keep only global concerns
  - [ ] `<html>`, `<head>`, `<body>` structure
  - [ ] Global scripts (e.g., GTM)
  - [ ] Global providers (Theme, GTMProvider)
  - [ ] Utilities (Toaster, BackToTopWrapper)
- [ ] Remove content framing from root
  - [ ] Remove `<main>` wrapper (belongs in locale layout)
  - [ ] Remove Footer (belongs in locale layout)
- [ ] Locale handling
  - [ ] `const locale = await getLocale()`
  - [ ] `<html lang={locale} dir={locale === 'en' ? 'ltr' : 'rtl'}>`
- [ ] Metadata aligns with docs (see link above)

---

## 🌐 Phase 2 — Locale Layout (`app/[locale]/layout.tsx`)
- [ ] Validate locale + load messages
  - [ ] `type Locale = typeof locales[number]`
  - [ ] `if (!locales.includes(locale)) notFound()`
  - [ ] `const messages = await getMessages()`
- [ ] Providers
  - [ ] `NextIntlClientProvider`
  - [ ] `SessionProvider`
- [ ] App shell
  - [ ] Navbar (Suspense fallback)
  - [ ] PWAStatus (Suspense fallback)
  - [ ] Single `<main className="flex-1">{children}</main>`
  - [ ] Footer
  - [ ] FloatingConsultationCTA after shell
- [ ] Directionality: `dir={isRTL(locale) ? 'rtl' : 'ltr'}`
- [ ] Server/Client boundary respected (see docs link)

---

## 🧩 Phase 3 — Route Group Layouts
- Homepage (`app/[locale]/(homepage)/layout.tsx`)
  - [ ] Create lightweight wrapper for homepage providers (optional)
  - [ ] No auth checks
- Dashboard (`app/[locale]/(dashboard)/layout.tsx`)
  - [ ] Server component with `auth()` guard
  - [ ] Redirect unauthenticated to locale-aware signin
- Admin (`app/[locale]/(dashboard)/admin/layout.tsx`)
  - [ ] Server component with ADMIN role guard
  - [ ] Sidebar + content layout

Use Route Groups to scope layouts without changing URLs (see docs link).

---

## ⏳ Phase 4 — Loading & Error Boundaries
- [ ] At each layout level ensure:
  - [ ] `loading.tsx` present
  - [ ] `error.tsx` present
  - [ ] `not-found.tsx` where appropriate
- [ ] Keep fallbacks minimal to avoid CLS

---

## ♿ Phase 5 — Accessibility & Semantics
- [ ] Exactly one `<main>` in the rendered tree (in locale layout)
- [ ] Consider "Skip to content" link (`#main-content`)
- [ ] Proper roles: navigation/contentinfo
- [ ] `lang` and `dir` reflect locale

---

## 🚀 Phase 6 — Performance & UX
- [ ] Small, non-blocking Suspense fallbacks
- [ ] Preconnect/dns-prefetch only in root `<head>`
- [ ] Keep group layouts lean to reduce re-renders
- [ ] Prefer Server Components; add "use client" only when required

---

## 🌏 Phase 7 — Internationalization (next-intl)
- [ ] Plugin enabled via `next-intl/plugin`
- [ ] `next-intl.config.ts` locales match `i18n/routing.ts`
- [ ] `localePrefix: 'always'` confirmed
- [ ] `/` redirects to default locale (`/ar`)
- [ ] Messages exist for all used keys (`messages/en.json`, `messages/ar.json`)

---

## 🔐 Phase 8 — Authentication (App Router)
- [ ] Use server `auth()` in server layouts
- [ ] `SessionProvider` placed at lowest necessary client level (locale OK)
- [ ] Role check in admin; redirect unauthorized
- [ ] Auth routes exist under `(homepage)/auth` and/or `app/auth`

---

## 🧪 Phase 9 — Manual QA Checklist
- [ ] Root `/` → `/ar` redirect works
- [ ] Locale switch `/en` ↔ `/ar` preserves context
- [ ] Navbar/Footer render once per page
- [ ] No duplicate `<main>`
- [ ] Homepage renders without auth
- [ ] Dashboard requires login; admin requires admin role
- [ ] Loading fallbacks appear during navigation
- [ ] No hydration warnings
- [ ] No missing import 404s

---

## 📁 Target File Structure (Post-Tasks)
```
app/
├── layout.tsx                          # Root layout (global only)
├── [locale]/
│   ├── layout.tsx                      # Locale layout (navigation + content)
│   ├── (homepage)/
│   │   ├── layout.tsx                  # Homepage layout (NEW)
│   │   └── page.tsx
│   └── (dashboard)/
│       ├── layout.tsx                  # Dashboard layout (NEW)
│       └── admin/
│           ├── layout.tsx              # Admin layout (role-guarded)
│           └── dashboard/
│               └── page.tsx
```

---

## 📦 Deliverables Definition (DoD)
- [ ] Root layout has no `<main>`/Footer; only global concerns
- [ ] Locale layout provides app shell (Navbar, `<main>`, Footer)
- [ ] Route group layouts exist and are minimal/purposeful
- [ ] Auth guards implemented for dashboard/admin
- [ ] Loading/error boundaries added per layout level
- [ ] i18n and directionality verified across pages
- [ ] Manual QA checklist passes

This task plan follows official Next.js, next-intl, and auth best practices and will stabilize layout architecture with clear separation of concerns.
