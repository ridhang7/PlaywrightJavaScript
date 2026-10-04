import { expect, test } from '../fixtures';
import { DashboardPage } from '../pages/DashboardPage';
import path from 'path';
import { LoginPage } from '../pages/LoginPage';

test.describe('shared authenticated account', () => {
  test.use({ storageState: path.resolve(__dirname, '../playwright/.auth/user.json') });

  test('04 Dashboard lists the holdings for the account', async ({ page }) => {
    await page.goto('/dashboard');

    const dashboard = new DashboardPage(page);
    await expect(dashboard.holdings).toHaveCount(3);
    await expect(dashboard.firstHoldingName).toHaveText('Bluechip Growth Fund');
    await expect(dashboard.firstHoldingDetails).toContainText('NSE');
  });
});

test('05 An account with no holdings shows the empty message', async ({page}) => {
    const loginPage = new LoginPage(page);
    loginPage.open();
    await loginPage.login('Retail Banking', 'emptyholder', 'demo1234');
    await loginPage.expectOnDashboard();

    const dashboard = new DashboardPage(page);
    await expect(dashboard.holdings).toHaveCount(0);
    await expect(dashboard.page.getByText('No holdings remaining.')).toBeVisible();
});
