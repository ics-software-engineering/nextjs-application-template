import { test, expect } from './auth-utils';

test.slow();
test('test access to admin page', async ({ getUserPage }) => {
  // Call the getUserPage fixture with admin signin info to get authenticated session for admin
  const adminPage = await getUserPage('admin@foo.com', 'changeme');

  // Navigate to the home page and wait for post-login indicator
  await adminPage.goto('http://localhost:3000/');
  await expect(
    adminPage.getByRole('button', { name: 'admin@foo.com' })
  ).toBeVisible({ timeout: 10000 });

  // Check for navigation elements
  await expect(
    adminPage.getByRole('link', { name: 'Next.js Application Template' })
  ).toBeVisible({ timeout: 5000 });
  await expect(
    adminPage.getByRole('link', { name: 'Add Stuff' })
  ).toBeVisible({ timeout: 5000 });
  await expect(
    adminPage.getByRole('link', { name: 'List Stuff' })
  ).toBeVisible({ timeout: 5000 });
  await expect(
    adminPage.getByRole('link', { name: 'Admin' })
  ).toBeVisible({ timeout: 5000 });

  // Test Add Stuff adminPage
  await adminPage.getByRole('link', { name: 'Add Stuff' }).click();
  await expect(
    adminPage.getByRole('heading', { name: 'Add Stuff' })
  ).toBeVisible({ timeout: 5000 });

  // Test List Stuff adminPage
  await adminPage.getByRole('link', { name: 'List Stuff' }).click();
  await expect(
    adminPage.getByRole('heading', { name: 'Stuff' })
  ).toBeVisible({ timeout: 5000 });

  // Test Admin adminPage
  await adminPage.getByRole('link', { name: 'Admin' }).click();
  await expect(
    adminPage.getByRole('heading', { name: 'List Stuff Admin' })
  ).toBeVisible({ timeout: 5000 });
  await expect(
    adminPage.getByRole('heading', { name: 'List Users Admin' })
  ).toBeVisible({ timeout: 5000 });

});