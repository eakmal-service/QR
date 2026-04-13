# Directory Structure

- `/app/`: The core Next.js App Router root. Contains layouts, pages, API handlers.
  - `/app/api/`: Backend REST routes.
  - `/app/admin/`: Admin dashboard.
  - `/app/dashboard/`: Normal user dashboard.
  - `/app/generate/`: Subsystem for generating QR codes.
  - `/app/login/` & `/app/register/`: Authentication views.
- `/components/`: Reusable React UI components, many from shadcn/ui.
- `/prisma/`: Contains `schema.prisma`, `dev.db`, and `seed.ts`. Prisma database abstractions.
- `/lib/`: Utility functions and clients (e.g. Prisma client instantiations).
- `/scripts/`: Operational setup, exp expect scripts, and utility server configurations. Contains `.exp` expect scripts primarily managing VPS, reverse proxies, and Nginx setups.
- `/public/`: Static assets (`.svg`, images, favicons).
