# Testing

- Currently, there is an absence of dedicated test frameworks like Jest, Vitest, or Playwright in `package.json`.
- Minimal ad-hoc scripts exist (like `test_db.js`, `test_menu_items.ts`, and `.exp` files) indicating manual validation checks or server diagnostic scripts.
- Expect scripts (`.exp`) are heavily used for CI/CD checks testing server sanity, PM2 connections, DB connections, and Nginx configurations, acting as black-box ops tests.
