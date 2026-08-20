import { expect, test } from '@playwright/test';

import { loginAs } from './helpers';

test.describe('critical operator journeys', () => {
  test('configures dashboard widgets', async ({ page }) => {
    await loginAs(page);

    await page.getByRole('button', { name: /configure widgets/i }).click();
    await page.getByLabel('grid').uncheck();
    await page.getByRole('button', { name: /save dashboard/i }).click();

    await expect(page.getByText('SHIPMENT GRID WIDGET')).toBeHidden();
  });

  test('searches globally and opens a result', async ({ page }) => {
    await loginAs(page);

    await page.getByLabel('Search shipment, order, asset or facility').fill('SHP');
    await page.getByRole('button').filter({ hasText: /Shipments|Orders|Assets|Facilities/ }).first().click();

    await expect(page).toHaveURL(/\/(shipments|fleet|facilities)/);
  });

  test('filters shipment grid and performs confirmed bulk action', async ({ page }) => {
    await loginAs(page);
    await page.getByRole('button', { name: 'Shipments' }).click();

    await page.getByPlaceholder('Search reference, customer, PO, container, trailer...').fill('SHP-00002');
    await expect(page.getByText('SHP-00002')).toBeVisible();

    await page.locator('tbody input[type="checkbox"]').first().check();
    await page.getByRole('button', { name: 'Flag' }).click();
    await page.getByRole('button', { name: 'Confirm' }).click();

    await expect(page.getByText(/queued for flag selected shipments/i)).toBeVisible();
  });

  test('configures alert-rule form values', async ({ page }) => {
    await loginAs(page);
    await page.getByRole('button', { name: 'Exceptions' }).click();

    const dwellInput = page.getByLabel('Dwell breach');
    await dwellInput.fill('75');

    await expect(page.getByText('75 min')).toBeVisible();
  });

  test('shows simulated incoming real-time exception in queue', async ({ page }) => {
    await loginAs(page);
    await page.getByRole('button', { name: 'Exceptions' }).click();

    await expect(page.getByText('Live ETA Slippage')).toBeVisible({ timeout: 6_000 });
  });

  test('handles API failure without losing shell navigation', async ({ page }) => {
    await loginAs(page);

    await page.route('**/shipments**', (route) => route.abort());
    await page.getByRole('button', { name: 'Shipments' }).click();

    await expect(page.getByText('Shipments')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Dashboard' })).toBeVisible();
  });
});
