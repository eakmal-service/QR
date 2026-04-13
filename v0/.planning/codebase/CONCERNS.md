# Codebase Concerns

- **Absence of Unit Tests**: The application lacks formalized unit testing (No Jest, Cypress, Vitest), which raises mutation risk.
- **Configuration Clutter**: The root directory is deeply polluted with operational expectation files (`.exp`) and ad-hoc troubleshooting scripts (e.g., `fix_install.exp`, `check_logs.exp`). This should ideally be moved inside a `/deploy` or `/ops` folder for cleanliness.
- **Hardcoded Authorization Logic**: Past instances of email-based hardcoded admin assertions existed. While mitigated by ENV variables, it suggests lack of formal Role-Based Access Control (RBAC) in the Prisma schema.
- **AI Error Handling Parsing**: Generative AI paths parse responses heavily assuming they arrive in pure JSON or structured Markdown. While `.replace(/^```json/g, '')` exists, edge cases from dynamic models may break extraction.
