# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: operator-journeys.spec.ts >> critical operator journeys >> shows simulated incoming real-time exception in queue
- Location: e2e\operator-journeys.spec.ts:49:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('Live ETA Slippage')
Expected: visible
Timeout: 6000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 6000ms
  - waiting for getByText('Live ETA Slippage')

```

```yaml
- navigation:
  - heading "Logistics" [level=6]
  - text: Control Tower
  - separator
  - list:
    - button "Dashboard":
      - paragraph: Dashboard
    - button "Live Map":
      - paragraph: Live Map
    - button "Shipments":
      - paragraph: Shipments
    - button "Route Planning":
      - paragraph: Route Planning
    - button "Fleet & Drivers":
      - paragraph: Fleet & Drivers
    - button "Exceptions":
      - paragraph: Exceptions
- main:
  - textbox "Search shipment, order, asset or facility":
    - /placeholder: Search shipment, order, asset or facility...
  - text: ⌘ K
  - combobox: Europe
  - button "Toggle theme"
  - button "Notifications"
  - paragraph: Demo Dispatcher
  - paragraph: Dispatcher / light
  - button "Logout"
  - separator
  - paragraph: Personalized dashboard
  - button "Configure widgets"
  - paragraph: Active shipments
  - paragraph: 5,000
  - paragraph: +2.8% vs yesterday
  - paragraph: Vehicles moving
  - paragraph: "33"
  - paragraph: Across selected region
  - paragraph: At-risk shipments
  - paragraph: "893"
  - paragraph: Requires attention
  - paragraph: Critical exceptions
  - paragraph: "2"
  - paragraph: Unresolved
  - paragraph: On-time delivery
  - paragraph: 94.7%
  - paragraph: +1.4 pts this week
  - region "Map"
  - button "Zoom in"
  - button "Zoom out"
  - button "Drag to rotate map, click to reset north"
  - group:
    - link "MapLibre":
      - /url: https://maplibre.org/
  - paragraph: Live Map Preview
  - paragraph: Europe - 3,100 assets - 08:45:40 PM
  - button "Open Live Map"
  - paragraph: Priority Queue
  - paragraph: Active Exceptions
  - paragraph: View all
  - button
  - paragraph: Dwell Breach
  - text: Low
  - paragraph: Asset dwell time exceeded the facility threshold.
  - paragraph: SHP-00007 - 09:49 AM
  - paragraph: ETA Slippage
  - text: Medium
  - paragraph: Estimated arrival has slipped beyond the committed delivery window.
  - paragraph: SHP-00009 - 09:13 AM
  - paragraph: Vehicle Breakdown
  - text: High
  - paragraph: Vehicle reported a critical mechanical fault.
  - paragraph: SHP-00005 - 08:37 AM
  - paragraph: Temperature Excursion
  - text: High
  - paragraph: Reefer temperature is outside the configured safe range.
  - paragraph: SHP-00003 - 08:01 AM
  - paragraph: SHIPMENT GRID WIDGET
  - paragraph: SHP-00002
  - paragraph: Dallas to Paris
  - paragraph: In Transit
  - paragraph: Medium
  - paragraph: SHP-00006
  - paragraph: Rotterdam to Hamburg
  - paragraph: In Transit
  - paragraph: Low
  - paragraph: SHP-00008
  - paragraph: Munich to Lisbon
  - paragraph: Delivered
  - paragraph: High
  - paragraph: SHP-00009
  - paragraph: Frankfurt to Prague
  - paragraph: Delayed
  - paragraph: High
```

# Test source

```ts
  1  | import { expect, test } from '@playwright/test';
  2  | 
  3  | import { loginAs } from './helpers';
  4  | 
  5  | test.describe('critical operator journeys', () => {
  6  |   test('configures dashboard widgets', async ({ page }) => {
  7  |     await loginAs(page);
  8  | 
  9  |     await page.getByRole('button', { name: /configure widgets/i }).click();
  10 |     await page.getByLabel('grid').uncheck();
  11 |     await page.getByRole('button', { name: /save dashboard/i }).click();
  12 | 
  13 |     await expect(page.getByText('SHIPMENT GRID WIDGET')).toBeHidden();
  14 |   });
  15 | 
  16 |   test('searches globally and opens a result', async ({ page }) => {
  17 |     await loginAs(page);
  18 | 
  19 |     await page.getByLabel('Search shipment, order, asset or facility').fill('SHP');
  20 |     await page.getByRole('button').filter({ hasText: /Shipments|Orders|Assets|Facilities/ }).first().click();
  21 | 
  22 |     await expect(page).toHaveURL(/\/(shipments|fleet|facilities)/);
  23 |   });
  24 | 
  25 |   test('filters shipment grid and performs confirmed bulk action', async ({ page }) => {
  26 |     await loginAs(page);
  27 |     await page.getByRole('button', { name: 'Shipments' }).click();
  28 | 
  29 |     await page.getByPlaceholder('Search reference, customer, PO, container, trailer...').fill('SHP-00002');
  30 |     await expect(page.getByText('SHP-00002')).toBeVisible();
  31 | 
  32 |     await page.locator('tbody input[type="checkbox"]').first().check();
  33 |     await page.getByRole('button', { name: 'Flag' }).click();
  34 |     await page.getByRole('button', { name: 'Confirm' }).click();
  35 | 
  36 |     await expect(page.getByText(/queued for flag selected shipments/i)).toBeVisible();
  37 |   });
  38 | 
  39 |   test('configures alert-rule form values', async ({ page }) => {
  40 |     await loginAs(page);
  41 |     await page.getByRole('button', { name: 'Exceptions' }).click();
  42 | 
  43 |     const dwellInput = page.getByLabel('Dwell breach');
  44 |     await dwellInput.fill('75');
  45 | 
  46 |     await expect(page.getByText('75 min')).toBeVisible();
  47 |   });
  48 | 
  49 |   test('shows simulated incoming real-time exception in queue', async ({ page }) => {
  50 |     await loginAs(page);
  51 |     await page.getByRole('button', { name: 'Exceptions' }).click();
  52 | 
> 53 |     await expect(page.getByText('Live ETA Slippage')).toBeVisible({ timeout: 6_000 });
     |                                                       ^ Error: expect(locator).toBeVisible() failed
  54 |   });
  55 | 
  56 |   test('handles API failure without losing shell navigation', async ({ page }) => {
  57 |     await loginAs(page);
  58 | 
  59 |     await page.route('**/shipments**', (route) => route.abort());
  60 |     await page.getByRole('button', { name: 'Shipments' }).click();
  61 | 
  62 |     await expect(page.getByText('Shipments')).toBeVisible();
  63 |     await expect(page.getByRole('button', { name: 'Dashboard' })).toBeVisible();
  64 |   });
  65 | });
  66 | 
```