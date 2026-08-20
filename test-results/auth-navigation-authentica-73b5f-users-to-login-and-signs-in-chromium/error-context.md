# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth-navigation.spec.ts >> authentication and navigation >> redirects unauthenticated users to login and signs in
- Location: e2e\auth-navigation.spec.ts:6:3

# Error details

```
Test timeout of 45000ms exceeded.
```

```
Error: locator.waitFor: Test timeout of 45000ms exceeded.
Call log:
  - waiting for getByText('Personalized dashboard') to be visible

```

# Page snapshot

```yaml
- generic [ref=f1e3]:
  - navigation [ref=f1e4]:
    - generic [ref=f1e5]:
      - generic [ref=f1e7]:
        - heading "Logistics" [level=6] [ref=f1e8]
        - text: Control Tower
      - separator [ref=f1e9]
      - list [ref=f1e10]:
        - button [ref=f1e11] [cursor=pointer]:
          - paragraph [ref=f1e16]: Dashboard
        - button [ref=f1e17] [cursor=pointer]:
          - paragraph [ref=f1e22]: Live Map
        - button [ref=f1e23] [cursor=pointer]:
          - paragraph [ref=f1e28]: Shipments
        - button [ref=f1e29] [cursor=pointer]:
          - paragraph [ref=f1e34]: Route Planning
        - button [ref=f1e35] [cursor=pointer]:
          - paragraph [ref=f1e40]: Fleet & Drivers
        - button [ref=f1e41] [cursor=pointer]:
          - paragraph [ref=f1e46]: Exceptions
  - main [ref=f1e47]:
    - generic [ref=f1e48]:
      - generic [ref=f1e50]:
        - generic [ref=f1e51]:
          - textbox "Search shipment, order, asset or facility" [ref=f1e56]:
            - /placeholder: Search shipment, order, asset or facility...
          - generic [ref=f1e57]: ⌘ K
        - generic [ref=f1e61]:
          - combobox [ref=f1e62] [cursor=pointer]: Europe
          - textbox: EUROPE
          - group
        - generic [ref=f1e63]:
          - button "Toggle theme" [ref=f1e64] [cursor=pointer]
          - generic [ref=f1e67]:
            - button "Notifications" [ref=f1e68] [cursor=pointer]
            - generic [ref=f1e71]: "11"
          - generic [ref=f1e73]:
            - generic [ref=f1e77]:
              - paragraph [ref=f1e78]: Demo Dispatcher
              - paragraph [ref=f1e79]: Dispatcher / light
            - button "Logout" [ref=f1e80] [cursor=pointer]
      - separator [ref=f1e84]
    - generic [ref=f1e86]:
      - generic [ref=f1e90]:
        - paragraph [ref=f1e91]: ORDER & SHIPMENT MANAGEMENT
        - paragraph [ref=f1e92]: Shipments
        - paragraph [ref=f1e93]: Server-driven shipment grid, order context and bulk workflows in Europe.
      - generic [ref=f1e94]:
        - generic [ref=f1e95]:
          - textbox "Search reference, customer, PO, container, trailer..." [ref=f1e99]
          - generic [ref=f1e101]:
            - combobox [ref=f1e102] [cursor=pointer]: "Status: All"
            - textbox: All
            - group
          - generic [ref=f1e104]:
            - combobox [ref=f1e105] [cursor=pointer]: "Risk: All"
            - textbox: All
            - group
          - generic [ref=f1e107]:
            - combobox [ref=f1e108] [cursor=pointer]: "Carrier: All"
            - textbox: All
            - group
          - generic [ref=f1e110]:
            - combobox [ref=f1e111] [cursor=pointer]: No grouping
            - textbox: none
            - group
        - generic [ref=f1e112]:
          - generic [ref=f1e113]:
            - generic [ref=f1e114]:
              - paragraph [ref=f1e115]: Sort 1
              - generic [ref=f1e117]:
                - combobox [ref=f1e118] [cursor=pointer]: estimatedArrival
                - textbox: estimatedArrival
                - group
              - generic [ref=f1e120]:
                - combobox [ref=f1e121] [cursor=pointer]: asc
                - textbox: asc
                - group
            - generic [ref=f1e122]:
              - paragraph [ref=f1e123]: Sort 2
              - generic [ref=f1e125]:
                - combobox [ref=f1e126] [cursor=pointer]: risk
                - textbox: risk
                - group
              - generic [ref=f1e128]:
                - combobox [ref=f1e129] [cursor=pointer]: desc
                - textbox: desc
                - group
          - generic [ref=f1e130]:
            - generic [ref=f1e131] [cursor=pointer]:
              - checkbox "Shipment" [checked] [ref=f1e133]
              - paragraph [ref=f1e136]: Shipment
            - generic [ref=f1e137] [cursor=pointer]:
              - checkbox "Lane" [checked] [ref=f1e139]
              - paragraph [ref=f1e142]: Lane
            - generic [ref=f1e143] [cursor=pointer]:
              - checkbox "Carrier" [checked] [ref=f1e145]
              - paragraph [ref=f1e148]: Carrier
            - generic [ref=f1e149] [cursor=pointer]:
              - checkbox "Status" [checked] [ref=f1e151]
              - paragraph [ref=f1e154]: Status
            - generic [ref=f1e155] [cursor=pointer]:
              - checkbox "Planned / estimated" [checked] [ref=f1e157]
              - paragraph [ref=f1e160]: Planned / estimated
            - generic [ref=f1e161] [cursor=pointer]:
              - checkbox "Risk" [checked] [ref=f1e163]
              - paragraph [ref=f1e166]: Risk
            - generic [ref=f1e167] [cursor=pointer]:
              - checkbox "Orders" [checked] [ref=f1e169]
              - paragraph [ref=f1e172]: Orders
        - generic [ref=f1e173]:
          - paragraph [ref=f1e174]: 0 selected / 4 in result set
          - generic [ref=f1e175]:
            - button "Flag" [ref=f1e176] [cursor=pointer]
            - button "Reassign carrier" [ref=f1e177] [cursor=pointer]
            - button "Notify customer" [ref=f1e178] [cursor=pointer]
            - button "Export CSV" [ref=f1e179] [cursor=pointer]
      - generic [ref=f1e180]:
        - table [ref=f1e182]:
          - rowgroup [ref=f1e183]:
            - row [ref=f1e184]:
              - columnheader [ref=f1e185]:
                - checkbox [ref=f1e187] [cursor=pointer]
              - columnheader "Shipment" [ref=f1e190]
              - columnheader "Lane" [ref=f1e191]
              - columnheader "Carrier" [ref=f1e192]
              - columnheader "Status" [ref=f1e193]
              - columnheader "Planned / estimated" [ref=f1e194]
              - columnheader "Risk" [ref=f1e195]
              - columnheader "Orders" [ref=f1e196]
              - columnheader "Action" [ref=f1e197]
          - rowgroup [ref=f1e198]:
            - row [ref=f1e199]:
              - cell [ref=f1e200]:
                - checkbox [ref=f1e202] [cursor=pointer]
              - cell [ref=f1e205]:
                - paragraph [ref=f1e206]: SHP-00002
                - paragraph [ref=f1e207]: REF-20260001
                - paragraph [ref=f1e208]: PO-88421
              - cell [ref=f1e209]:
                - paragraph [ref=f1e210]: Dallas
                - paragraph [ref=f1e211]: to Paris
              - cell "BlueLine Logistics" [ref=f1e212]
              - cell "In Transit" [ref=f1e213]
              - cell [ref=f1e216]:
                - generic [ref=f1e217]:
                  - paragraph [ref=f1e218]: Planned 8/19/26, 10:17 AM
                  - paragraph [ref=f1e219]: ETA 8/19/26, 11:17 AM
              - cell "Medium" [ref=f1e220]
              - cell [ref=f1e223]:
                - paragraph [ref=f1e224]: ORD-10001
                - paragraph [ref=f1e225]: CONT-000002
              - cell [ref=f1e226]:
                - button "Details" [ref=f1e227] [cursor=pointer]
            - row [ref=f1e228]:
              - cell [ref=f1e229]:
                - checkbox [ref=f1e231] [cursor=pointer]
              - cell [ref=f1e234]:
                - paragraph [ref=f1e235]: SHP-00006
                - paragraph [ref=f1e236]: REF-20260005
                - paragraph [ref=f1e237]: PO-55209
              - cell [ref=f1e238]:
                - paragraph [ref=f1e239]: Rotterdam
                - paragraph [ref=f1e240]: to Hamburg
              - cell "NorthStar Freight" [ref=f1e241]
              - cell "In Transit" [ref=f1e242]
              - cell [ref=f1e245]:
                - generic [ref=f1e246]:
                  - paragraph [ref=f1e247]: Planned 8/19/26, 2:17 PM
                  - paragraph [ref=f1e248]: ETA 8/19/26, 3:17 PM
              - cell "Low" [ref=f1e249]
              - cell [ref=f1e252]:
                - paragraph [ref=f1e253]: ORD-10005
                - paragraph [ref=f1e254]: CONT-000006
              - cell [ref=f1e255]:
                - button "Details" [ref=f1e256] [cursor=pointer]
            - row [ref=f1e257]:
              - cell [ref=f1e258]:
                - checkbox [ref=f1e260] [cursor=pointer]
              - cell [ref=f1e263]:
                - paragraph [ref=f1e264]: SHP-00008
                - paragraph [ref=f1e265]: REF-20260007
                - paragraph [ref=f1e266]: PO-88421
              - cell [ref=f1e267]:
                - paragraph [ref=f1e268]: Munich
                - paragraph [ref=f1e269]: to Lisbon
              - cell "JetStream Cargo" [ref=f1e270]
              - cell "Delivered" [ref=f1e271]
              - cell [ref=f1e274]:
                - generic [ref=f1e275]:
                  - paragraph [ref=f1e276]: Planned 8/20/26, 6:20 AM
                  - paragraph [ref=f1e277]: ETA 8/20/26, 9:20 AM
              - cell "High" [ref=f1e278]
              - cell [ref=f1e281]:
                - paragraph [ref=f1e282]: ORD-10001
                - paragraph [ref=f1e283]: CONT-000008
              - cell [ref=f1e284]:
                - button "Details" [ref=f1e285] [cursor=pointer]
            - row [ref=f1e286]:
              - cell [ref=f1e287]:
                - checkbox [ref=f1e289] [cursor=pointer]
              - cell [ref=f1e292]:
                - paragraph [ref=f1e293]: SHP-00009
                - paragraph [ref=f1e294]: REF-20260008
                - paragraph [ref=f1e295]: PO-66218
              - cell [ref=f1e296]:
                - paragraph [ref=f1e297]: Frankfurt
                - paragraph [ref=f1e298]: to Prague
              - cell "Apex Transit" [ref=f1e299]
              - cell "Delayed" [ref=f1e300]
              - cell [ref=f1e303]:
                - generic [ref=f1e304]:
                  - paragraph [ref=f1e305]: Planned 8/20/26, 7:00 AM
                  - paragraph [ref=f1e306]: ETA 8/20/26, 11:00 AM
              - cell "High" [ref=f1e307]
              - cell [ref=f1e310]:
                - paragraph [ref=f1e311]: ORD-10003
                - paragraph [ref=f1e312]: CONT-000009
              - cell [ref=f1e313]:
                - button "Details" [ref=f1e314] [cursor=pointer]
        - generic [ref=f1e315]:
          - paragraph [ref=f1e316]: 4 shipment(s), page 1 of 1
          - navigation "pagination navigation" [ref=f1e317]:
            - list [ref=f1e318]:
              - listitem [ref=f1e319]:
                - button "Go to previous page" [disabled]
              - listitem [ref=f1e320]:
                - button "page 1" [ref=f1e321] [cursor=pointer]: "1"
              - listitem [ref=f1e322]:
                - button "Go to next page" [disabled]
```

# Test source

```ts
  1  | import type { Page } from '@playwright/test';
  2  | 
  3  | export async function loginAs(
  4  |   page: Page,
  5  |   email = 'dispatcher@nexus.com',
  6  |   password = 'password123',
  7  | ) {
  8  |   await page.goto('/login');
  9  |   await page.getByLabel('Email').fill(email);
  10 |   await page.getByLabel('Password').fill(password);
  11 |   await page.getByRole('button', { name: /sign in to control tower/i }).click();
> 12 |   await page.getByText('Personalized dashboard').waitFor();
     |                                                  ^ Error: locator.waitFor: Test timeout of 45000ms exceeded.
  13 | }
  14 | 
  15 | export async function openNavigation(page: Page, label: string) {
  16 |   await page.getByRole('button', { name: label }).click();
  17 | }
  18 | 
```