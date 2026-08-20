# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: accessibility.spec.ts >> automated accessibility checks >> dashboard has no critical accessibility violations
- Location: e2e\accessibility.spec.ts:7:3

# Error details

```
Error: expect(received).toEqual(expected) // deep equality

- Expected  -  1
+ Received  + 95

- Array []
+ Array [
+   Object {
+     "description": "Ensure buttons have discernible text",
+     "help": "Buttons must have discernible text",
+     "helpUrl": "https://dequeuniversity.com/rules/axe/4.13/button-name?application=playwright",
+     "id": "button-name",
+     "impact": "critical",
+     "nodes": Array [
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": null,
+             "id": "button-has-visible-text",
+             "impact": "critical",
+             "message": "Element does not have inner text that is visible to screen readers",
+             "relatedNodes": Array [],
+           },
+           Object {
+             "data": null,
+             "id": "aria-label",
+             "impact": "critical",
+             "message": "aria-label attribute does not exist or is empty",
+             "relatedNodes": Array [],
+           },
+           Object {
+             "data": null,
+             "id": "aria-labelledby",
+             "impact": "critical",
+             "message": "aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty",
+             "relatedNodes": Array [],
+           },
+           Object {
+             "data": Object {
+               "messageKey": "noAttr",
+             },
+             "id": "non-empty-title",
+             "impact": "critical",
+             "message": "Element has no title attribute",
+             "relatedNodes": Array [],
+           },
+           Object {
+             "data": null,
+             "id": "implicit-label",
+             "impact": "critical",
+             "message": "Element does not have an implicit (wrapped) <label>",
+             "relatedNodes": Array [],
+           },
+           Object {
+             "data": null,
+             "id": "explicit-label",
+             "impact": "critical",
+             "message": "Element does not have an explicit <label>",
+             "relatedNodes": Array [],
+           },
+           Object {
+             "data": null,
+             "id": "presentational-role",
+             "impact": "critical",
+             "message": "Element's default semantics were not overridden with role=\"none\" or role=\"presentation\"",
+             "relatedNodes": Array [],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element does not have inner text that is visible to screen readers
+   aria-label attribute does not exist or is empty
+   aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty
+   Element has no title attribute
+   Element does not have an implicit (wrapped) <label>
+   Element does not have an explicit <label>
+   Element's default semantics were not overridden with role=\"none\" or role=\"presentation\"",
+         "html": "<button class=\"MuiButtonBase-root MuiIconButton-root MuiIconButton-sizeSmall css-ltruez-MuiButtonBase-root-MuiIconButton-root\" tabindex=\"0\" type=\"button\">",
+         "impact": "critical",
+         "none": Array [],
+         "target": Array [
+           ".MuiIconButton-sizeSmall",
+         ],
+       },
+     ],
+     "tags": Array [
+       "cat.name-role-value",
+       "wcag2a",
+       "wcag412",
+       "section508",
+       "section508.22.a",
+       "TTv5",
+       "TT6.a",
+       "EN-301-549",
+       "EN-9.4.1.2",
+       "ACT",
+       "RGAAv4",
+       "RGAA-11.9.1",
+     ],
+   },
+ ]
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
              - paragraph [ref=e155]: Europe - 3,100 assets - 08:45:28 PM
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
  1  | import AxeBuilder from '@axe-core/playwright';
  2  | import { expect, test } from '@playwright/test';
  3  | 
  4  | import { loginAs } from './helpers';
  5  | 
  6  | test.describe('automated accessibility checks', () => {
  7  |   test('dashboard has no critical accessibility violations', async ({ page }) => {
  8  |     await loginAs(page);
  9  | 
  10 |     const results = await new AxeBuilder({ page })
  11 |       .disableRules(['color-contrast'])
  12 |       .analyze();
  13 |     const criticalViolations = results.violations.filter((violation) => violation.impact === 'critical');
  14 | 
> 15 |     expect(criticalViolations).toEqual([]);
     |                                ^ Error: expect(received).toEqual(expected) // deep equality
  16 |   });
  17 | });
  18 | 
```