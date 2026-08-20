import type { Page } from '@playwright/test';

export async function loginAs(
  page: Page,
  email = 'dispatcher@nexus.com',
  password = 'password123',
) {
  await page.goto('/login');
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: /sign in to control tower/i }).click();
  await page.getByText('Personalized dashboard').waitFor();
}

export async function openNavigation(page: Page, label: string) {
  await page.getByRole('button', { name: label }).click();
}
