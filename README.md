# Injentro Client

Next.js frontend for the full-stack starter. It provides role-based authentication, protected dashboards, and a modern UI built on the App Router.

## Tech Stack

| Category | Technologies |
|----------|--------------|
| Framework | Next.js 15 (App Router), React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS v4, shadcn/ui, Lucide icons |
| Forms | TanStack Form, React Hook Form, Zod |
| Data fetching | TanStack React Query |
| HTTP | Axios (server-side with token refresh) |
| Auth | JWT cookies + Better Auth session, Edge middleware |
| Theming | next-themes (light / dark / system) |

## Features

### Authentication

- Email/password login and registration
- Google OAuth login
- Email verification with OTP
- Forgot password and reset password flows
- Forced password reset when required by account state
- Automatic token refresh in middleware
- Session sync with the backend API

### Role-based access

| Role | Default area |
|------|----------------|
| `CLIENT` | `/dashboard` |
| `ADMIN` | `/admin/dashboard` |
| `SUPER_ADMIN` | `/admin/dashboard` (+ admin management) |

Shared authenticated routes: `/profile`, `/change-password`.

### Pages & layouts

**Public**

- `/` — Landing page
- `/login`, `/register`, `/forgot-password`, `/reset-password`, `/verify-email`
- `/google/callback` — OAuth completion handler

**Client dashboard**

- `/dashboard` — Client home
- `/dashboard/settings` — Theme preferences

**Admin dashboard**

- `/admin/dashboard` — Admin home
- `/admin/dashboard/settings` — Theme and admin settings
- `/admin/admin-management` — Admin management (SUPER_ADMIN)

**Profile**

- `/profile` — Edit name, contact, address, gender, and avatar

### UI & infrastructure

- Responsive sidebar layout with breadcrumbs
- Sonner toast notifications
- Server Actions for auth and profile updates
- React Query with streamed hydration
- Reusable shadcn/ui component library

## Prerequisites

Before running the client locally, make sure you have:

1. **Node.js 20+**
2. **pnpm 10** (declared in `package.json`)
3. **Injentro-server** running (default: `http://localhost:5000`)
4. PostgreSQL configured for the backend
5. Matching `ACCESS_TOKEN_SECRET` on both client and server

Optional for Google login:

- Google OAuth credentials configured on the server
- Server `FRONTEND_URL` set to `http://localhost:3000`

## Local installation

### 1. Install dependencies

```bash
cd Injentro-client
pnpm install
```

### 2. Configure environment variables

Copy the example env file and edit it:

```bash
cp .env.example .env.local
```

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_APP_NAME` | No | App title shown in UI (default: `Starter App`) |
| `NEXT_PUBLIC_API_BASE_URL` | Yes | Backend API URL, e.g. `http://localhost:5000/api/v1` |
| `NEXT_PUBLIC_BASE_URL` | No | Frontend URL (optional, for future use) |
| `ACCESS_TOKEN_SECRET` | Yes | Must match the server `ACCESS_TOKEN_SECRET` |

### 3. Start the backend

From the server directory:

```bash
cd ../Injentro-server
npm install
cp .env.example .env
# Edit .env with your database and secrets
npm run db:migrate
npm run dev
```

### 4. Run the client

```bash
cd ../Injentro-client
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Available scripts

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `pnpm dev` | Start development server |
| `build` | `pnpm build` | Create production build |
| `start` | `pnpm start` | Serve production build |
| `lint` | `pnpm lint` | Run ESLint |
| `typecheck` | `pnpm typecheck` | Run TypeScript check |

## Project structure

```
Injentro-client/
├── src/
│   ├── actions/           # Server Actions (auth, current user)
│   ├── app/               # App Router pages and layouts
│   │   ├── (authRouteGroup)/     # Login, register, verify, reset
│   │   ├── (commonLayout)/       # Landing, profile
│   │   ├── (dashboardLayout)/    # Client & admin dashboards
│   │   └── api/                  # API routes (OAuth cookie handler)
│   ├── components/
│   │   ├── modules/       # Feature components (auth, dashboard, settings)
│   │   ├── shared/        # Shared UI pieces
│   │   └── ui/            # shadcn/ui components
│   ├── lib/               # Auth utils, axios client, JWT helpers
│   ├── middleware.ts      # Route protection entry
│   ├── proxy.ts           # Auth middleware logic
│   ├── providers/         # React Query provider
│   ├── services/          # API service layer
│   ├── types/             # TypeScript types
│   └── zod/               # Validation schemas
├── public/                # Static assets
├── .env.example
└── package.json
```

## Authentication flow

1. User logs in or registers via Server Actions.
2. The backend sets HTTP-only cookies: `accessToken`, `refreshToken`, and `better-auth.session_token`.
3. Next.js middleware verifies the JWT and enforces role-based routing.
4. If the access token is close to expiry, middleware refreshes it automatically.
5. Google OAuth redirects through the server, then completes via `/google/callback` and `/api/auth/oauth/complete`.

## Customization

- Update `NEXT_PUBLIC_APP_NAME` to change the app title.
- Edit sidebar links in `src/components/data/clientSidebar.ts` and `adminSidebar.ts`.
- Replace dashboard placeholder content under `src/components/modules/dashboard/` and `adminDashboardPages/`.
- Add your logo to `public/logo.png` (referenced by the sidebar).

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `packages field missing or empty` | Ensure `pnpm-workspace.yaml` includes `packages: ['.']` |
| Middleware auth errors | Verify `ACCESS_TOKEN_SECRET` matches the server |
| API connection failed | Confirm `NEXT_PUBLIC_API_BASE_URL` and that the server is running on port 5000 |
| Google login fails | Check server Google OAuth env vars and `FRONTEND_URL` |
