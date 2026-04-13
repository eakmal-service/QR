# Code Conventions

- **Component Structure**: `React.FC` or standard function declarations with distinct "use client" directives where interactivity or state hooks (`useState`) are required.
- **Styling**: Tailwind utility classes. For complex components, `clsx` and `tailwind-merge` (`cn` utility) are heavily favored (standard shadcn/ui structure).
- **Error Handling**: Standard Try/Catch blocks within the `/api` routes returning `NextResponse.json({ error: 'Message' }, { status: XXX })`.
- **Auth Checking**: Often achieved inside Route Handlers (`app/api/**/*`) using `getServerSession(authOptions)` and environment variable checks (`process.env.ADMIN_EMAILS`).
- **Linting & Formatting**: Enforced via ESLint inside Next.js build step (`npm run lint`). TSX strictness is mostly adhered to, with occasional exceptions (e.g., `any` casts in catch blocks).
