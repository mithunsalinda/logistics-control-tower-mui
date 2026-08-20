# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: operator-journeys.spec.ts >> critical operator journeys >> handles API failure without losing shell navigation
- Location: e2e\operator-journeys.spec.ts:56:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('Shipments')
Expected: visible
Error: strict mode violation: getByText('Shipments') resolved to 4 elements:
    1) <p class="MuiTypography-root MuiTypography-body1 css-kb26n0-MuiTypography-root">Shipments</p> aka getByRole('button', { name: 'Shipments' })
    2) <p class="MuiTypography-root MuiTypography-body1 css-11rafv1-MuiTypography-root">Active shipments</p> aka getByText('Active shipments')
    3) <p class="MuiTypography-root MuiTypography-body1 css-11rafv1-MuiTypography-root">At-risk shipments</p> aka getByText('At-risk shipments')
    4) <p class="MuiTypography-root MuiTypography-body1 css-kb26n0-MuiTypography-root">Shipments</p> aka getByText('Shipments').nth(3)

Call log:
  - Expect "toBeVisible" with timeout 8000ms
  - waiting for getByText('Shipments')

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - navigation [ref=e4]:
    - generic [ref=e5]:
      - generic [ref=e7]:
        - heading "Logistics" [level=6] [ref=e8]
        - text: Control Tower
      - separator [ref=e9]
      - list [ref=e10]:
        - button [ref=e11] [cursor=pointer]:
          - paragraph [ref=e16]: Dashboard
        - button [ref=e17] [cursor=pointer]:
          - paragraph [ref=e22]: Live Map
        - button [active] [ref=e23] [cursor=pointer]:
          - paragraph [ref=e28]: Shipments
        - button [ref=e29] [cursor=pointer]:
          - paragraph [ref=e34]: Route Planning
        - button [ref=e35] [cursor=pointer]:
          - paragraph [ref=e40]: Fleet & Drivers
        - button [ref=e41] [cursor=pointer]:
          - paragraph [ref=e46]: Exceptions
  - main [ref=e47]:
    - generic [ref=e48]:
      - generic [ref=e50]:
        - generic [ref=e51]:
          - textbox "Search shipment, order, asset or facility" [ref=e56]:
            - /placeholder: Search shipment, order, asset or facility...
          - generic [ref=e57]: ⌘ K
        - generic [ref=e61]:
          - combobox [ref=e62] [cursor=pointer]: Europe
          - textbox: EUROPE
          - group
        - generic [ref=e63]:
          - button "Toggle theme" [ref=e64] [cursor=pointer]
          - generic [ref=e67]:
            - button "Notifications" [ref=e68] [cursor=pointer]
            - generic [ref=e71]: "11"
          - generic [ref=e73]:
            - generic [ref=e77]:
              - paragraph [ref=e78]: Demo Dispatcher
              - paragraph [ref=e79]: Dispatcher / light
            - button "Logout" [ref=e80] [cursor=pointer]
      - separator [ref=e84]
    - generic [ref=e86]:
      - generic [ref=e87]:
        - paragraph [ref=e88]: Personalized dashboard
        - button "Configure widgets" [ref=e90] [cursor=pointer]
      - generic [ref=e91]:
        - generic [ref=e97]:
          - paragraph [ref=e98]: Active shipments
          - paragraph [ref=e99]: 5,000
          - paragraph [ref=e100]: +2.8% vs yesterday
        - generic [ref=e105]:
          - paragraph [ref=e106]: Vehicles moving
          - paragraph [ref=e107]: "33"
          - paragraph [ref=e108]: Across selected region
        - generic [ref=e113]:
          - paragraph [ref=e114]: At-risk shipments
          - paragraph [ref=e115]: "893"
          - paragraph [ref=e116]: Requires attention
        - generic [ref=e121]:
          - paragraph [ref=e122]: Critical exceptions
          - paragraph [ref=e123]: "2"
          - paragraph [ref=e124]: Unresolved
        - generic [ref=e129]:
          - paragraph [ref=e130]: On-time delivery
          - paragraph [ref=e131]: 94.7%
          - paragraph [ref=e132]: +1.4 pts this week
      - generic [ref=e133]:
        - generic [ref=e135]:
          - generic [ref=e136]:
            - region "Map" [ref=e137]
            - generic:
              - generic [ref=e138]:
                - button "Zoom in" [ref=e139] [cursor=pointer]
                - button "Zoom out" [ref=e141] [cursor=pointer]
                - button "Drag to rotate map, click to reset north" [ref=e143]
              - group [ref=e145]:
                - generic "Toggle attribution" [ref=e146] [cursor=pointer]
                - link "MapLibre" [ref=e148] [cursor=pointer]:
                  - /url: https://maplibre.org/
          - generic [ref=e149]:
            - generic [ref=e153]:
              - paragraph [ref=e154]: Live Map Preview
              - paragraph [ref=e155]: Europe - 3,100 assets - 08:45:35 PM
            - button "Open Live Map" [ref=e156] [cursor=pointer]
        - generic [ref=e158]:
          - generic [ref=e159]:
            - generic [ref=e160]:
              - paragraph [ref=e161]: Priority Queue
              - paragraph [ref=e162]: Active Exceptions
            - generic [ref=e163] [cursor=pointer]:
              - paragraph [ref=e164]: View all
              - button [ref=e165]
          - generic [ref=e168]:
            - generic [ref=e175]:
              - generic [ref=e176]:
                - paragraph [ref=e177]: Dwell Breach
                - generic [ref=e178]: Low
              - paragraph [ref=e180]: Asset dwell time exceeded the facility threshold.
              - paragraph [ref=e181]: SHP-00007 - 09:49 AM
            - generic [ref=e188]:
              - generic [ref=e189]:
                - paragraph [ref=e190]: ETA Slippage
                - generic [ref=e191]: Medium
              - paragraph [ref=e193]: Estimated arrival has slipped beyond the committed delivery window.
              - paragraph [ref=e194]: SHP-00009 - 09:13 AM
            - generic [ref=e201]:
              - generic [ref=e202]:
                - paragraph [ref=e203]: Vehicle Breakdown
                - generic [ref=e204]: High
              - paragraph [ref=e206]: Vehicle reported a critical mechanical fault.
              - paragraph [ref=e207]: SHP-00005 - 08:37 AM
            - generic [ref=e214]:
              - generic [ref=e215]:
                - paragraph [ref=e216]: Temperature Excursion
                - generic [ref=e217]: High
              - paragraph [ref=e219]: Reefer temperature is outside the configured safe range.
              - paragraph [ref=e220]: SHP-00003 - 08:01 AM
        - generic [ref=e222]:
          - paragraph [ref=e223]: SHIPMENT GRID WIDGET
          - generic [ref=e224]:
            - generic [ref=e225]:
              - paragraph [ref=e226]: SHP-00002
              - paragraph [ref=e227]: Dallas to Paris
              - paragraph [ref=e228]: In Transit
              - paragraph [ref=e229]: Medium
            - generic [ref=e230]:
              - paragraph [ref=e231]: SHP-00006
              - paragraph [ref=e232]: Rotterdam to Hamburg
              - paragraph [ref=e233]: In Transit
              - paragraph [ref=e234]: Low
            - generic [ref=e235]:
              - paragraph [ref=e236]: SHP-00008
              - paragraph [ref=e237]: Munich to Lisbon
              - paragraph [ref=e238]: Delivered
              - paragraph [ref=e239]: High
            - generic [ref=e240]:
              - paragraph [ref=e241]: SHP-00009
              - paragraph [ref=e242]: Frankfurt to Prague
              - paragraph [ref=e243]: Delayed
              - paragraph [ref=e244]: High
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
  53 |     await expect(page.getByText('Live ETA Slippage')).toBeVisible({ timeout: 6_000 });
  54 |   });
  55 | 
  56 |   test('handles API failure without losing shell navigation', async ({ page }) => {
  57 |     await loginAs(page);
  58 | 
  59 |     await page.route('**/shipments**', (route) => route.abort());
  60 |     await page.getByRole('button', { name: 'Shipments' }).click();
  61 | 
> 62 |     await expect(page.getByText('Shipments')).toBeVisible();
     |                                               ^ Error: expect(locator).toBeVisible() failed
  63 |     await expect(page.getByRole('button', { name: 'Dashboard' })).toBeVisible();
  64 |   });
  65 | });
  66 | 
```