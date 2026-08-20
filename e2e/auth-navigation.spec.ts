import { expect, test } from '@playwright/test';

import { loginAs } from './helpers';

test.describe('authentication and navigation', () => {
  test('redirects unauthenticated users to login and signs in', async ({ page }) => {
    await page.goto('/shipments');
    await expect(page).toHaveURL(/\/login$/);

    await loginAs(page);
    await expect(page).toHaveURL(/\/dashboard$/);
  });

  test('logs out and protects secured pages', async ({ page }) => {
    await loginAs(page);

    await page.getByLabel('Logout').click();
    await expect(page).toHaveURL(/\/login$/);

    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/login$/);
  });

  test('redirects access-denied admin route for non-admin users', async ({ page }) => {
    await loginAs(page, 'dispatcher@nexus.com', 'password123');

    await page.goto('/admin');

    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(page.getByText('Personalized dashboard')).toBeVisible();
  });

  test('navigates across core layouts and feature modules', async ({ page }) => {
    await loginAs(page);

    const targets = [
      ['Live Map', /\/map$/],
      ['Shipments', /\/shipments$/],
      ['Route Planning', /\/routes$/],
      ['Fleet & Drivers', /\/fleet$/],
      ['Exceptions', /\/exceptions$/],
    ] as const;

    for (const [label, url] of targets) {
      await page.getByRole('button', { name: label }).click();
      await expect(page).toHaveURL(url);
    }
  });
});
