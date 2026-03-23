import { test, expect } from './auth-utils';

test.slow();
test('can authenticate a specific user', async ({ getUserPage }) => {

  // Call the getUserPage fixture with users signin info to get authenticated session for user
  const customUserPage = await getUserPage('john@foo.com', 'changeme');

  // Navigate to the home page and wait for post-login indicator
  await customUserPage.goto('http://localhost:3000/');
  await expect(
    customUserPage.getByRole('button', { name: 'john@foo.com' })
  ).toBeVisible({ timeout: 10000 });

  // Now check for navigation links and headings
  await expect(
    customUserPage.getByRole('link', { name: 'Add Stuff' })
  ).toBeVisible({ timeout: 5000 });
  await expect(
    customUserPage.getByRole('link', { name: 'List Stuff' })
  ).toBeVisible({ timeout: 5000 });

  await customUserPage.getByRole('link', { name: 'Add Stuff' }).click();
  await expect(
    customUserPage.getByRole('heading', { name: 'Add Stuff' })
  ).toBeVisible({ timeout: 5000 });

  await customUserPage.getByRole('link', { name: 'List Stuff' }).click();
  await expect(
    customUserPage.getByRole('heading', { name: 'Stuff' })
  ).toBeVisible({ timeout: 5000 });

});
