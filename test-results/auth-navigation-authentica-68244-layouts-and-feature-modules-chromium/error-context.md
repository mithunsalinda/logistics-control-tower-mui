# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth-navigation.spec.ts >> authentication and navigation >> navigates across core layouts and feature modules
- Location: e2e\auth-navigation.spec.ts:33:3

# Error details

```
Error: locator.click: Error: strict mode violation: getByRole('button', { name: 'Live Map' }) resolved to 2 elements:
    1) <div tabindex="0" role="button" class="MuiButtonBase-root MuiListItemButton-root MuiListItemButton-gutters css-1exrf5f-MuiButtonBase-root-MuiListItemButton-root">…</div> aka getByRole('button', { name: 'Live Map', exact: true })
    2) <button tabindex="0" type="button" class="MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-sizeSmall MuiButton-colorPrimary css-1q5h8ps-MuiButtonBase-root-MuiButton-root">Open Live Map</button> aka getByRole('button', { name: 'Open Live Map' })

Call log:
  - waiting for getByRole('button', { name: 'Live Map' })

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
              - paragraph [ref=e155]: Europe - 3,100 assets - 08:45:27 PM
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
  5  | test.describe('authentication and navigation', () => {
  6  |   test('redirects unauthenticated users to login and signs in', async ({ page }) => {
  7  |     await page.goto('/shipments');
  8  |     await expect(page).toHaveURL(/\/login$/);
  9  | 
  10 |     await loginAs(page);
  11 |     await expect(page).toHaveURL(/\/dashboard$/);
  12 |   });
  13 | 
  14 |   test('logs out and protects secured pages', async ({ page }) => {
  15 |     await loginAs(page);
  16 | 
  17 |     await page.getByLabel('Logout').click();
  18 |     await expect(page).toHaveURL(/\/login$/);
  19 | 
  20 |     await page.goto('/dashboard');
  21 |     await expect(page).toHaveURL(/\/login$/);
  22 |   });
  23 | 
  24 |   test('redirects access-denied admin route for non-admin users', async ({ page }) => {
  25 |     await loginAs(page, 'dispatcher@nexus.com', 'password123');
  26 | 
  27 |     await page.goto('/admin');
  28 | 
  29 |     await expect(page).toHaveURL(/\/dashboard$/);
  30 |     await expect(page.getByText('Personalized dashboard')).toBeVisible();
  31 |   });
  32 | 
  33 |   test('navigates across core layouts and feature modules', async ({ page }) => {
  34 |     await loginAs(page);
  35 | 
  36 |     const targets = [
  37 |       ['Live Map', /\/map$/],
  38 |       ['Shipments', /\/shipments$/],
  39 |       ['Route Planning', /\/routes$/],
  40 |       ['Fleet & Drivers', /\/fleet$/],
  41 |       ['Exceptions', /\/exceptions$/],
  42 |     ] as const;
  43 | 
  44 |     for (const [label, url] of targets) {
> 45 |       await page.getByRole('button', { name: label }).click();
     |                                                       ^ Error: locator.click: Error: strict mode violation: getByRole('button', { name: 'Live Map' }) resolved to 2 elements:
  46 |       await expect(page).toHaveURL(url);
  47 |     }
  48 |   });
  49 | });
  50 | 
```