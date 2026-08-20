import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

import { loginAs } from './helpers';

test.describe('automated accessibility checks', () => {
  test('dashboard has no critical accessibility violations', async ({ page }) => {
    await loginAs(page);

    const results = await new AxeBuilder({ page })
      .disableRules(['color-contrast'])
      .analyze();
    const criticalViolations = results.violations.filter((violation) => violation.impact === 'critical');

    expect(criticalViolations).toEqual([]);
  });
});
