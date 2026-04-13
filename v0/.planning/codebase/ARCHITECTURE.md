# Architecture

This project is a full-stack Next.js application utilizing the App Router framework.

- **Data Flow**: Client components trigger actions or API hooks (via `fetch` to `/api/*`) and SSR is handled by reading the Prisma client directly in Server Components (`page.tsx`).
- **Layers**: 
  - **Presentation**: `app/**/*`, `components/**/*`. Client logic leverages heavy React patterns (providers, react-hook-form, framer-motion).
  - **API Layer**: `app/api/**/*` serving JSON output and executing server-only logic, integrating AI agents and authentications.
  - **Data Access**: Centralized by Prisma (`prisma/schema.prisma`), exported through a globally cached client (likely in `lib/prisma.ts`).
- **Authorization**: Governed by NextAuth module middleware (`middleware.ts`). Check for admin authorization is done directly against email environments via `getServerSession`.
- **Key Subsystems**:
  - **QR Code Management**: Generating and storing QR code data.
  - **Smart Reviews**: Complex user review processing system (`smart-review`, `test-review`).
