# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: operator-journeys.spec.ts >> critical operator journeys >> configures alert-rule form values
- Location: e2e\operator-journeys.spec.ts:39:3

# Error details

```
Test timeout of 45000ms exceeded.
```

```
Error: locator.fill: Test timeout of 45000ms exceeded.
Call log:
  - waiting for getByLabel('Dwell breach')

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
        - button [ref=e23] [cursor=pointer]:
          - paragraph [ref=e28]: Shipments
        - button [ref=e29] [cursor=pointer]:
          - paragraph [ref=e34]: Route Planning
        - button [ref=e35] [cursor=pointer]:
          - paragraph [ref=e40]: Fleet & Drivers
        - button [active] [ref=e41] [cursor=pointer]:
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
      - generic [ref=e88]:
        - generic [ref=e89]:
          - paragraph [ref=e90]: EXCEPTION MANAGEMENT & ALERTING
          - paragraph [ref=e91]: Exception Management
          - paragraph [ref=e92]: Live severity queue, operator assignment, lifecycle tracking and presentation-level alert thresholds.
        - paragraph [ref=e96]: Updated just now - Europe
      - generic [ref=e97]:
        - generic [ref=e98]:
          - generic [ref=e99]:
            - textbox "Search exception, shipment, category, assignee..." [ref=e103]
            - generic [ref=e104]:
              - combobox [ref=e105] [cursor=pointer]: Active
              - textbox: Active
              - group
          - generic [ref=e106]:
            - generic [ref=e107]:
              - paragraph [ref=e108]: Active queue
              - paragraph [ref=e109]: "7"
            - generic [ref=e110]:
              - paragraph [ref=e111]: Critical
              - paragraph [ref=e112]: "2"
            - generic [ref=e113]:
              - paragraph [ref=e114]: Unassigned
              - paragraph [ref=e115]: "3"
            - generic [ref=e116]:
              - paragraph [ref=e117]: Total visible
              - paragraph [ref=e118]: "7"
          - generic [ref=e119]:
            - generic [ref=e120]:
              - generic [ref=e124]:
                - generic [ref=e125]:
                  - paragraph [ref=e126]: Geofence Violation
                  - generic [ref=e127]: Critical
                  - generic [ref=e129]: In Progress
                  - generic [ref=e131]: Geofence
                  - generic [ref=e133]: Map
                - paragraph [ref=e135]: Asset entered a restricted yard boundary outside the approved corridor.
                - paragraph [ref=e136]: EXC-0018 / SHP-00005 / 8/19/26, 10:41 AM
              - generic [ref=e137]:
                - generic [ref=e141]:
                  - combobox [ref=e142] [cursor=pointer]: Demo Dispatcher
                  - textbox: Demo Dispatcher
                  - group
                - generic [ref=e143]:
                  - button [ref=e144] [cursor=pointer]
                  - button "Start" [disabled]
                  - button "Resolve" [ref=e148] [cursor=pointer]
            - generic [ref=e149]:
              - generic [ref=e153]:
                - generic [ref=e154]:
                  - paragraph [ref=e155]: Temperature Excursion
                  - generic [ref=e156]: Critical
                  - generic [ref=e158]: In Progress
                  - generic [ref=e160]: Temperature
                  - generic [ref=e162]: Fleet
                - paragraph [ref=e164]: Reefer temperature is outside the configured safe range.
                - paragraph [ref=e165]: EXC-0012 / SHP-00003 / 8/19/26, 8:01 AM
              - generic [ref=e166]:
                - generic [ref=e170]:
                  - combobox [ref=e171] [cursor=pointer]: N. Gomez
                  - textbox: N. Gomez
                  - group
                - generic [ref=e172]:
                  - button [ref=e173] [cursor=pointer]
                  - button "Start" [disabled]
                  - button "Resolve" [ref=e177] [cursor=pointer]
            - generic [ref=e178]:
              - generic [ref=e182]:
                - generic [ref=e183]:
                  - paragraph [ref=e184]: Live ETA Slippage
                  - generic [ref=e185]: High
                  - generic [ref=e187]: New
                  - generic [ref=e189]: Delay
                  - generic [ref=e191]: Shipments
                - paragraph [ref=e193]: A subscribed ETA rule detected a projected delivery-window breach.
                - paragraph [ref=e194]: LIVE-ETA-20260819 / SHP-00009 / 8/20/26, 8:45 PM
              - generic [ref=e195]:
                - generic [ref=e199]:
                  - combobox [disabled] [ref=e200]: Unassigned
                  - textbox [disabled]: Unassigned
                  - group
                - generic [ref=e201]:
                  - button "Ack" [disabled]
                  - button "Start" [disabled]
                  - button "Resolve" [disabled]
            - generic [ref=e202]:
              - generic [ref=e206]:
                - generic [ref=e207]:
                  - paragraph [ref=e208]: Vehicle Breakdown
                  - generic [ref=e209]: High
                  - generic [ref=e211]: New
                  - generic [ref=e213]: Breakdown
                  - generic [ref=e215]: Fleet
                - paragraph [ref=e217]: Vehicle reported a critical mechanical fault.
                - paragraph [ref=e218]: EXC-0009 / SHP-00005 / 8/19/26, 8:37 AM
              - generic [ref=e219]:
                - generic [ref=e223]:
                  - combobox [ref=e224] [cursor=pointer]: Unassigned
                  - textbox: Unassigned
                  - group
                - generic [ref=e225]:
                  - button [ref=e226] [cursor=pointer]
                  - button [ref=e230] [cursor=pointer]
                  - button "Resolve" [ref=e234] [cursor=pointer]
            - generic [ref=e235]:
              - generic [ref=e239]:
                - generic [ref=e240]:
                  - paragraph [ref=e241]: Missed Scan
                  - generic [ref=e242]: Medium
                  - generic [ref=e244]: In Progress
                  - generic [ref=e246]: Missed scan
                  - generic [ref=e248]: Shipments
                - paragraph [ref=e250]: Container has missed the required transfer scan at the relay facility.
                - paragraph [ref=e251]: EXC-0015 / SHP-00007 / 8/19/26, 10:22 AM
              - generic [ref=e252]:
                - generic [ref=e256]:
                  - combobox [ref=e257] [cursor=pointer]: N. Gomez
                  - textbox: N. Gomez
                  - group
                - generic [ref=e258]:
                  - button [ref=e259] [cursor=pointer]
                  - button "Start" [disabled]
                  - button "Resolve" [ref=e263] [cursor=pointer]
            - generic [ref=e264]:
              - generic [ref=e268]:
                - generic [ref=e269]:
                  - paragraph [ref=e270]: ETA Slippage
                  - generic [ref=e271]: Medium
                  - generic [ref=e273]: Acknowledged
                  - generic [ref=e275]: Delay
                  - generic [ref=e277]: Shipments
                - paragraph [ref=e279]: Estimated arrival has slipped beyond the committed delivery window.
                - paragraph [ref=e280]: EXC-0006 / SHP-00009 / 8/19/26, 9:13 AM
              - generic [ref=e281]:
                - generic [ref=e285]:
                  - combobox [ref=e286] [cursor=pointer]: Demo Dispatcher
                  - textbox: Demo Dispatcher
                  - group
                - generic [ref=e287]:
                  - button "Ack" [disabled]
                  - button [ref=e288] [cursor=pointer]
                  - button "Resolve" [ref=e292] [cursor=pointer]
            - generic [ref=e293]:
              - generic [ref=e297]:
                - generic [ref=e298]:
                  - paragraph [ref=e299]: Dwell Breach
                  - generic [ref=e300]: Low
                  - generic [ref=e302]: New
                  - generic [ref=e304]: Dwell
                  - generic [ref=e306]: Facilities
                - paragraph [ref=e308]: Asset dwell time exceeded the facility threshold.
                - paragraph [ref=e309]: EXC-0003 / SHP-00007 / 8/19/26, 9:49 AM
              - generic [ref=e310]:
                - generic [ref=e314]:
                  - combobox [ref=e315] [cursor=pointer]: Unassigned
                  - textbox: Unassigned
                  - group
                - generic [ref=e316]:
                  - button [ref=e317] [cursor=pointer]
                  - button [ref=e321] [cursor=pointer]
                  - button "Resolve" [ref=e325] [cursor=pointer]
        - generic [ref=e326]:
          - generic [ref=e330]:
            - paragraph [ref=e331]: Alerting Rules
            - paragraph [ref=e332]: Presentation/subscription thresholds
          - generic [ref=e333]:
            - generic [ref=e334]:
              - generic [ref=e335]:
                - paragraph [ref=e336]: Dwell breach
                - paragraph [ref=e337]: 45 min
              - generic [ref=e339]:
                - spinbutton [ref=e340]: "45"
                - group
              - progressbar [ref=e341]
            - generic [ref=e343]:
              - generic [ref=e344]:
                - paragraph [ref=e345]: ETA slippage
                - paragraph [ref=e346]: 30 min
              - generic [ref=e348]:
                - spinbutton [ref=e349]: "30"
                - group
              - progressbar [ref=e350]
            - generic [ref=e352]:
              - generic [ref=e353]:
                - paragraph [ref=e354]: Missed scan
                - paragraph [ref=e355]: 20 min
              - generic [ref=e357]:
                - spinbutton [ref=e358]: "20"
                - group
              - progressbar [ref=e359]
            - generic [ref=e361]:
              - generic [ref=e362]:
                - paragraph [ref=e363]: Reefer upper temp
                - paragraph [ref=e364]: 8 C
              - generic [ref=e366]:
                - spinbutton [ref=e367]: "8"
                - group
              - progressbar [ref=e368]
          - generic [ref=e370]:
            - paragraph [ref=e374]: Active subscriptions
            - paragraph [ref=e375]: Alerts above these thresholds enter the live queue and notification center. Critical alerts stay visible until acknowledgement.
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
> 44 |     await dwellInput.fill('75');
     |                      ^ Error: locator.fill: Test timeout of 45000ms exceeded.
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