# Logistics Control Tower

A browser-based logistics operations cockpit for dispatchers, planners, warehouse coordinators, operations managers, administrators, and read-only viewers. The MVP combines dashboard KPIs, shipment visibility, fleet telemetry, exception handling, facilities context, capacity planning, route planning, map views, and administrative workflows in one React application.

## Tech Stack

- React 19, TypeScript, Vite
- Material UI and Emotion
- Redux Toolkit, RTK Query, React Redux
- React Router with protected and role-scoped routes
- i18next and react-i18next
- JSON Server mock API using `db.json`
- Vitest, Testing Library, Playwright, axe-core
- Oxlint and Prettier

## Getting Started

Install dependencies:

```bash
npm install
```

Start the mock API:

```bash
npm run mock-api
```

In a second terminal, start the frontend:

```bash
npm run dev
```

Open the Vite URL shown in the terminal, usually `http://localhost:5173`.

## Demo Login

The demo identity data lives in `db.json`.

| Role                  | Email                  | Password       |
| --------------------- | ---------------------- | -------------- |
| Dispatcher            | `dispatcher@nexus.com` | `password123`  |
| Administrator         | `admin@nexus.com`      | `admin123`     |
| Operations Manager    | `manager@nexus.com`    | `manager123`   |
| Planner               | `planner@nexus.com`    | `planner123`   |
| Warehouse Coordinator | `warehouse@nexus.com`  | `warehouse123` |
| Read-only Viewer      | `viewer@nexus.com`     | `viewer123`    |

## Environment

The frontend defaults to `http://localhost:3002` for API calls. Override it with:

```bash
VITE_API_BASE_URL=http://localhost:3002
```

For Windows PowerShell:

```powershell
$env:VITE_API_BASE_URL="http://localhost:3002"
npm run dev
```

## Available Scripts

| Command                 | Purpose                                              |
| ----------------------- | ---------------------------------------------------- |
| `npm run dev`           | Start Vite development server.                       |
| `npm run mock-api`      | Start JSON Server on port `3002`.                    |
| `npm run build`         | Type-check and build production assets into `dist/`. |
| `npm run preview`       | Preview the production build locally.                |
| `npm run lint`          | Run Oxlint.                                          |
| `npm run format:check`  | Check Prettier formatting.                           |
| `npm run test:run`      | Run Vitest once.                                     |
| `npm run test:coverage` | Run unit tests with coverage thresholds.             |
| `npm run test:e2e`      | Run Playwright end-to-end tests.                     |
| `npm run test:all`      | Run coverage and end-to-end tests.                   |

## Documentation

- [Architecture PDF](docs/architecture.pdf)

## Project Structure

```text
src/
  app/              Application routes
  components/       Shared UI components
  config/           Region and app configuration
  features/         Domain feature modules
  i18n/             Translation setup and resources
  layout/           Application shell and navigation
  routes/           Route guards
  store/            Redux store, slices, and RTK Query APIs
  test/             Shared test setup and render helpers
  theme/            Material UI theme provider and tokens
  utils/            Shared utility functions
```

## Development Notes

- Keep server-state fetching in `src/store/api` using injected RTK Query endpoints.
- Keep durable client auth/session state in `src/store/slices/authSlice.ts`.
- Use role checks through `ProtectedRoute` and `canAccess`.
- Add feature-local controller hooks or utilities when UI logic becomes complex.
- Update docs and ADRs when a change alters architecture, deployment, state management, routing, or integration strategy.
