import { expect, test } from '../fixtures';
import path from 'path';
import { StatementPage } from '../pages/StatementPage';

// The dashboard has a "View statement" link that opens the statement in a NEW WINDOW.
// Selenium handled that with getWindowHandles() and switchTo().window().
test.describe('shared authenticated account', () => {
  test.use({ storageState: path.resolve(__dirname, '../playwright/.auth/user.json') });
  // Selenium: StatementTests.statementOpensInNewWindow
  //   Click the link, wait until there are two windows, switch to the new one, expect the
  //   heading "Account Statement", close it, and return to the dashboard.
  test('13 The statement opens in a new window', async ({ page }) => {
    await page.goto('/dashboard');

    const statementPage = new StatementPage(page);
    const popup = await statementPage.open();
    await expect(popup.getByRole('heading', { name: 'Account Statement' })).toBeVisible();

    await popup.close();
    await expect(page).toHaveURL(/\/dashboard/);
  });

  // Selenium: StatementTests.termsCanBeAcceptedInIframe
  //   In the statement window there is an iframe titled "Statement terms" with an
  //   "Accept terms" button. Click it and expect the text "Terms accepted" inside the frame.
  //   Selenium used switchTo().frame() and switchTo().defaultContent().
  test('14 The terms can be accepted inside the iframe', async ({ page }) => {
    await page.goto('/dashboard');

    const statement = new StatementPage(page);
    const popup = await statement.open();
    await statement.acceptTerms(popup);
    await popup.close();
  });

  // Selenium: StatementTests.marketFilterMultiSelect
  //   The statement has a "Markets" multi-select. Choose BSE (1 holding, "National Infra Bond"),
  //   then NSE and BSE together (3 holdings), then clear it (3 holdings again).
  //   Selenium used the Select class: selectByValue, getAllSelectedOptions, deselectAll.
  test('15 The market filter accepts several selections', async ({ page }) => {
    await page.goto('/dashboard');

    const statement = new StatementPage(page);
    const popup = await statement.open();

    await statement.filterMarkets(popup, ['BSE']);
    await expect(statement.holdings(popup)).toHaveCount(1);
    await expect(popup.getByText('National Infra Bond', { exact: true })).toBeVisible();

    await statement.filterMarkets(popup, ['NSE', 'BSE']);
    await expect(statement.holdings(popup)).toHaveCount(3);

    await statement.filterMarkets(popup, []);
    await expect(statement.holdings(popup)).toHaveCount(3);
    await popup.close();
  });
});
