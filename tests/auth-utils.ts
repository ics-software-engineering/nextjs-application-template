import { test as base, expect, Page } from '@playwright/test';

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Base configuration
const BASE_URL = process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000';
const SESSION_STORAGE_PATH = path.join(__dirname, 'playwright-auth-sessions');

// Ensure session directory exists
if (!fs.existsSync(SESSION_STORAGE_PATH)) {
  fs.mkdirSync(SESSION_STORAGE_PATH, { recursive: true });
}

// Define our custom fixtures
interface AuthFixtures {
  getUserPage: (email: string, password: string) => Promise<Page>;
}
/**
 * Authenticate using the UI with robust waiting and error handling
 */
async function authenticateWithUI(
  page: Page,
  email: string,
  password: string,
  sessionName: string
): Promise<void> {
  const sessionPath = path.join(SESSION_STORAGE_PATH, `${sessionName}.json`);

  // Try to restore session from storage if available
  if (fs.existsSync(sessionPath)) {
    try {
      const sessionData = JSON.parse(fs.readFileSync(sessionPath, 'utf8'));
      await page.context().addCookies(sessionData.cookies);

      // Navigate to homepage to verify session
      await page.goto(BASE_URL);
      await page.waitForLoadState('networkidle');

      // Check if we're authenticated by looking for a sign-out option or user email
      const isAuthenticated = await Promise.race([
        page.getByText(email).isVisible().then((visible) => visible),
        page.getByRole('button', { name: email }).isVisible().then((visible) => visible),
        page.getByText('Sign out').isVisible().then((visible) => visible),
        page.getByRole('button', { name: 'Sign out' }).isVisible().then((visible) => visible),
        new Promise<boolean>((resolve) => setTimeout(() => resolve(false), 3000)),
      ]);

      if (isAuthenticated) {
        console.log(`✓ Restored session for ${email}`);
        return;
      }

      console.log(`× Saved session for ${email} expired, re-authenticating...`);
    } catch (error) {
      console.log(`× Error restoring session: ${error}`);
    }
  }

  // If session restoration fails, authenticate via UI
  try {
    console.log(`→ Authenticating ${email} via UI...`);

    // Navigate to login page
    await page.goto(`${BASE_URL}/auth/signin`);
    await page.waitForLoadState('networkidle');

    // Fill in credentials with retry logic
    await fillFormWithRetry(page, [
      { selector: 'input[name="email"]', value: email },
      { selector: 'input[name="password"]', value: password },
    ]);

    // Click submit button and wait for navigation
    const submitButton = page.getByRole('button', { name: /sign[ -]?in/i });
    if (!await submitButton.isVisible({ timeout: 1000 })) {
      // Try alternative selector if the first one doesn't work
      await page.getByRole('button', { name: /log[ -]?in/i }).click();
    } else {
      await submitButton.click();
    }


    // Wait for a clear post-login indicator (user button or sign out button)
    const userButton = page.getByRole('button', { name: email });
    const signOutButton = page.getByRole('button', { name: /sign out/i });
    await Promise.any([
      expect(userButton).toBeVisible({ timeout: 10000 }),
      expect(signOutButton).toBeVisible({ timeout: 10000 })
    ]);

    // Save session for future tests
    const cookies = await page.context().cookies();
    fs.writeFileSync(sessionPath, JSON.stringify({ cookies }));
    console.log(`✓ Successfully authenticated ${email} and saved session`);
  } catch (error) {
    console.error(`× Authentication failed for ${email}:`, error);

    throw new Error(`Authentication failed: ${error}`);
  }
}

/**
 * Helper to fill form fields with retry logic
 */
async function fillFormWithRetry(
  page: Page,
  fields: Array<{ selector: string; value: string }>
): Promise<void> {
  for (const field of fields) {
    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
      try {
        const element = page.locator(field.selector);
        await element.waitFor({ state: 'visible', timeout: 2000 });
        await element.clear();
        await element.fill(field.value);
        await element.evaluate((el) => el.blur()); // Trigger blur event
        break;
      } catch {
        attempts++;
        if (attempts >= maxAttempts) {
          throw new Error(`Failed to fill field ${field.selector} after ${maxAttempts} attempts`);
        }
        await page.waitForTimeout(500);
      }
    }
  }
}

// Create custom test with authenticated fixtures
export const test = base.extend<AuthFixtures>({
  getUserPage: async ({ browser }, fixtureCallback) => {
    const createUserPage = async (email: string, password: string) => {
      const context = await browser.newContext();
      const page = await context.newPage();

      await authenticateWithUI(page, email, password, `session-${email}`);
      return page;
    };

    await fixtureCallback(createUserPage);
  },
});

export { expect } from '@playwright/test';
