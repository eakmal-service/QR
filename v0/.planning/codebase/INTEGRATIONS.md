# Integrations & External Services

- **Authentication Providers**: Likely Google OAuth or Email credentials (managed via NextAuth).
- **Google Generative AI**: Uses `@google/generative-ai` (`gemini-2.5-flash-lite` seen in routes) for text extraction, translation, or content parsing generation.
- **Vercel Analytics**: Application uses `@vercel/analytics` indicating it is deployed or prepared for deployment on Vercel platform.
- **Database**: Local SQLite environment `dev.db` handled locally but likely integrated to a remote PostgreSQL or MySQL in production via Prisma.
