import { expect, test } from '../fixtures';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';

// Selenium: IsolationTests.seededAccountStartsClean
//   Creates an account through the API, logs in as it through the login page, and checks:
//   the welcome text, 3 holdings and the balance "₹1,25,000.50".
test('12 A freshly seeded account starts with the default holdings and balance', async ({ page, createAccount }) => {
  const account = await createAccount();
  const loginPage = new LoginPage(page);
  await loginPage.open();
  await loginPage.login('Retail Banking', account.username, account.password);
  await loginPage.expectOnDashboard();

  const dashboard = new DashboardPage(page);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(`Welcome, ${account.username}`);
  await expect(dashboard.holdings).toHaveCount(3);
  await expect(page.getByText('₹1,25,000.50', { exact: true })).toBeVisible();
});
