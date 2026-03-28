# Pro-Life Frontend Base

Production-ready React + Vite baseline with:

- Bootstrap theme pipeline (SCSS)
- i18n (react-i18next)
- SEO base setup
- Analytics scaffolding (GTM/GA4)
- Routing shell + route error boundary
- TanStack Query client + API client template
- API contract validation with zod
- Testing (Vitest + RTL)
- Accessibility testing (vitest-axe)
- E2E testing (Playwright)
- Linting (ESLint + Stylelint)
- TypeScript typecheck baseline for incremental migration
- CI pipeline (GitHub Actions)
- Sentry monitoring scaffold
- Sentry release automation workflow
- Security baseline (CSP headers + dependency audit workflow)
- Performance budgets for built assets

## Scripts

- `npm run dev`
- `npm run build`
- `npm run build:sourcemap`
- `npm run format`
- `npm run format:check`
- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run test:a11y`
- `npm run test:e2e`
- `npm run ci:check`
- `npm run audit:deps`
- `npm run perf:budget`

## Git Quality Gates

- `husky` runs local git hooks after install.
- `pre-commit`: runs `lint-staged` only for staged files.
- `commit-msg`: validates conventional commit format via `commitlint`.

## Environment Setup

1. Copy `.env.example` into `.env.local`.
2. Fill real values for analytics and monitoring variables.
3. Keep `.env.local` uncommitted.

Reference placeholders:

- `.analytics.sample`
- `.monitoring.sample`
