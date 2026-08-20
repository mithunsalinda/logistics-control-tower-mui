# Logistics Control Tower MVP Requirements

## Business Analyst Summary

The business needs a single browser-based operations cockpit for dispatchers, planners, warehouse coordinators, operations managers, and administrators. The current landscape forces operators to stitch together TMS, telematics, WMS, spreadsheets, and chat/email during time-sensitive incidents. The target product shortens the detect-diagnose-act loop by combining real-time visibility, exception workflow, shipment/fleet/facility context, and capacity planning into one experience.

## Primary Business Outcomes

- Reduce exception detection from about 35 minutes to under 60 seconds.
- Reduce exception resolution time by 40 percent through unified context.
- Reduce operator tool switching from 4-6 tools to one control tower.
- Improve on-time delivery by 3-5 percentage points.
- Increase dispatcher throughput by about 25 percent.

## MVP Scope Implemented In This Frontend

| Area | Requirement Coverage | Current Frontend Implementation |
| --- | --- | --- |
| Authentication | FR-36 | JSON Server-backed demo login with RTK Query mutation and persisted Redux auth state. |
| Dashboard KPIs | FR-38, NFR-06 | Dashboard metrics loaded from `/dashboardMetrics` through shared RTK Query cache. |
| Shipments | FR-13, FR-16, FR-18 | Shipment grid loaded from `/shipments`, with search, status/risk filters, pagination, and ETA formatting. |
| Fleet & Drivers | FR-08, FR-09, FR-10, FR-11 | Vehicle cards loaded from `/vehicles`, including status, speed, HOS, telemetry freshness time, utilization, and fuel data contract. |
| Exceptions | FR-24, FR-25, FR-26, FR-28 | Exception queue loaded from `/exceptions`, with severity, state, shipment linkage, assignee-ready data, and dashboard priority queue. |
| Facilities | FR-33, FR-34 | Facility cards loaded from `/facilities`, including dock utilization, queues, dwell, staffing, and affected shipment counts. |
| Capacity | FR-30, FR-31, FR-32 | Capacity forecasts loaded from `/capacityForecasts`, with what-if adjustment UI. |
| API Architecture | NFR-06, 6.9 | One shared RTK Query `baseApi` with injected domain endpoints and a single reducer/middleware path. |

## Prioritized Next Increments

1. Add mutation endpoints for exception acknowledge/resolve and persist state back to JSON Server.
2. Add server-driven query params for shipment pagination, filtering, sorting, and regional scope.
3. Introduce route-level lazy loading for heavy domains.
4. Add real-time simulation using polling or a lightweight event stream abstraction.
5. Add role-based route/menu gating for administrator vs dispatcher workflows.
6. Add Playwright journeys for login, shipment filtering, and exception lifecycle.

## Technical Architecture Decision

Server state belongs in `src/store/api` using RTK Query. Feature components consume generated hooks from the common `src/store` boundary. Local UI state remains in components. Auth/session state remains a Redux slice under `src/store/slices`. This gives the app one place for caching, request de-duplication, invalidation tags, and future retry/error conventions.
