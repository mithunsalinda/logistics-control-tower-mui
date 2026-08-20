# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: operator-journeys.spec.ts >> critical operator journeys >> filters shipment grid and performs confirmed bulk action
- Location: e2e\operator-journeys.spec.ts:25:3

# Error details

```
Test timeout of 45000ms exceeded.
```

```
Error: locator.click: Test timeout of 45000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: 'Confirm' })

```

# Page snapshot

```yaml
- generic [ref=e1]:
  - generic [ref=e3]:
    - navigation [ref=e4]:
      - generic [ref=e5]:
        - generic [ref=e7]:
          - heading [level=6] [ref=e8]: Logistics
          - text: Control Tower
        - separator [ref=e9]
        - list [ref=e10]:
          - button [ref=e11] [cursor=pointer]:
            - paragraph [ref=e16]: Dashboard
          - button [ref=e17] [cursor=pointer]:
            - paragraph [ref=e22]: Live Map
          - button [ref=e23] [cursor=pointer]:
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
            - textbox [ref=e56]:
              - /placeholder: Search shipment, order, asset or facility...
            - generic [ref=e57]: ⌘ K
          - generic [ref=e61]:
            - combobox [ref=e62] [cursor=pointer]: Europe
            - textbox: EUROPE
            - group
          - generic [ref=e63]:
            - button [ref=e64] [cursor=pointer]
            - generic [ref=e67]:
              - button [ref=e68] [cursor=pointer]
              - generic [ref=e71]: "11"
            - generic [ref=e73]:
              - generic [ref=e77]:
                - paragraph [ref=e78]: Demo Dispatcher
                - paragraph [ref=e79]: Dispatcher / light
              - button [ref=e80] [cursor=pointer]
        - separator [ref=e84]
      - generic [ref=e86]:
        - generic [ref=e90]:
          - paragraph [ref=e91]: ORDER & SHIPMENT MANAGEMENT
          - paragraph [ref=e92]: Shipments
          - paragraph [ref=e93]: Server-driven shipment grid, order context and bulk workflows in Europe.
        - generic [ref=e94]:
          - generic [ref=e95]:
            - textbox [ref=e99]:
              - /placeholder: Search reference, customer, PO, container, trailer...
              - text: SHP-00002
            - generic [ref=e101]:
              - combobox [ref=e102] [cursor=pointer]: "Status: All"
              - textbox: All
              - group
            - generic [ref=e104]:
              - combobox [ref=e105] [cursor=pointer]: "Risk: All"
              - textbox: All
              - group
            - generic [ref=e107]:
              - combobox [ref=e108] [cursor=pointer]: "Carrier: All"
              - textbox: All
              - group
            - generic [ref=e110]:
              - combobox [ref=e111] [cursor=pointer]: No grouping
              - textbox: none
              - group
          - generic [ref=e112]:
            - generic [ref=e113]:
              - generic [ref=e114]:
                - paragraph [ref=e115]: Sort 1
                - generic [ref=e117]:
                  - combobox [ref=e118] [cursor=pointer]: estimatedArrival
                  - textbox: estimatedArrival
                  - group
                - generic [ref=e120]:
                  - combobox [ref=e121] [cursor=pointer]: asc
                  - textbox: asc
                  - group
              - generic [ref=e122]:
                - paragraph [ref=e123]: Sort 2
                - generic [ref=e125]:
                  - combobox [ref=e126] [cursor=pointer]: risk
                  - textbox: risk
                  - group
                - generic [ref=e128]:
                  - combobox [ref=e129] [cursor=pointer]: desc
                  - textbox: desc
                  - group
            - generic [ref=e130]:
              - generic [ref=e131] [cursor=pointer]:
                - checkbox [checked] [ref=e133]
                - paragraph [ref=e136]: Shipment
              - generic [ref=e137] [cursor=pointer]:
                - checkbox [checked] [ref=e139]
                - paragraph [ref=e142]: Lane
              - generic [ref=e143] [cursor=pointer]:
                - checkbox [checked] [ref=e145]
                - paragraph [ref=e148]: Carrier
              - generic [ref=e149] [cursor=pointer]:
                - checkbox [checked] [ref=e151]
                - paragraph [ref=e154]: Status
              - generic [ref=e155] [cursor=pointer]:
                - checkbox [checked] [ref=e157]
                - paragraph [ref=e160]: Planned / estimated
              - generic [ref=e161] [cursor=pointer]:
                - checkbox [checked] [ref=e163]
                - paragraph [ref=e166]: Risk
              - generic [ref=e167] [cursor=pointer]:
                - checkbox [checked] [ref=e169]
                - paragraph [ref=e172]: Orders
          - generic [ref=e173]:
            - paragraph [ref=e174]: 1 selected / 1 in result set
            - generic [ref=e175]:
              - button [ref=e176] [cursor=pointer]: Flag
              - button [ref=e177] [cursor=pointer]: Reassign carrier
              - button [ref=e178] [cursor=pointer]: Notify customer
              - button [ref=e179] [cursor=pointer]: Export CSV
        - generic [ref=e180]:
          - table [ref=e182]:
            - rowgroup [ref=e183]:
              - row [ref=e184]:
                - columnheader [ref=e185]:
                  - checkbox [checked] [ref=e187] [cursor=pointer]
                - columnheader [ref=e190]: Shipment
                - columnheader [ref=e191]: Lane
                - columnheader [ref=e192]: Carrier
                - columnheader [ref=e193]: Status
                - columnheader [ref=e194]: Planned / estimated
                - columnheader [ref=e195]: Risk
                - columnheader [ref=e196]: Orders
                - columnheader [ref=e197]: Action
            - rowgroup [ref=e198]:
              - row [ref=e199]:
                - cell [ref=e200]:
                  - checkbox [checked] [ref=e202] [cursor=pointer]
                - cell [ref=e205]:
                  - paragraph [ref=e206]: SHP-00002
                  - paragraph [ref=e207]: REF-20260001
                  - paragraph [ref=e208]: PO-88421
                - cell [ref=e209]:
                  - paragraph [ref=e210]: Dallas
                  - paragraph [ref=e211]: to Paris
                - cell [ref=e212]: BlueLine Logistics
                - cell [ref=e213]:
                  - generic [ref=e214]: In Transit
                - cell [ref=e216]:
                  - generic [ref=e217]:
                    - paragraph [ref=e218]: Planned 8/19/26, 10:17 AM
                    - paragraph [ref=e219]: ETA 8/19/26, 11:17 AM
                - cell [ref=e220]:
                  - generic [ref=e221]: Medium
                - cell [ref=e223]:
                  - paragraph [ref=e224]: ORD-10001
                  - paragraph [ref=e225]: CONT-000002
                - cell [ref=e226]:
                  - button [ref=e227] [cursor=pointer]: Details
          - generic [ref=e228]:
            - paragraph [ref=e229]: 1 shipment(s), page 1 of 1
            - navigation [ref=e230]:
              - list [ref=e231]:
                - listitem [ref=e232]:
                  - button [disabled]
                - listitem [ref=e233]:
                  - button [ref=e234] [cursor=pointer]: "1"
                - listitem [ref=e235]:
                  - button [disabled]
  - dialog [active] [ref=e238]:
    - heading [level=2] [ref=e239]:
      - paragraph [ref=e242]: Confirm Bulk Action
    - paragraph [ref=e244]: Apply this action to 1 selected shipment(s)? The action will be recorded in the audit log.
    - generic [ref=e245]:
      - button "Cancel" [ref=e246] [cursor=pointer]
      - button "Apply action" [ref=e247] [cursor=pointer]
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
> 34 |     await page.getByRole('button', { name: 'Confirm' }).click();
     |                                                         ^ Error: locator.click: Test timeout of 45000ms exceeded.
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
  62 |     await expect(page.getByText('Shipments')).toBeVisible();
  63 |     await expect(page.getByRole('button', { name: 'Dashboard' })).toBeVisible();
  64 |   });
  65 | });
  66 | 
```