import path from 'path';
import { expect, test } from '../fixtures/base';
import { SellPage } from '../pages/SellPage';

// All five tests open the sell form for the first holding, "Bluechip Growth Fund".
// The sell form has two groups of radio buttons (Market and Settlement type), a quantity,
// a confirmation checkbox and a "Submit for Redemption" button.

test.describe('shared authenticated account', () => {
  test.use({ storageState: path.resolve(__dirname, '../playwright/.auth/user.json') });

  // Selenium: SellTests.sellCashOnNse
  //   Choose market NSE, settlement Cash, quantity 1, confirm, submit.
  //   Expect the confirmation heading "Transaction submitted and under process",
  //   the status "processing" and the settlement "cash".
  test('07 Selling on NSE with cash settlement is confirmed', async ({ page }) => {
    await page.goto('/dashboard');

    const sellPage = new SellPage(page);
    await sellPage.performSellAction('NSE', '1', 'cash');

    await expect(sellPage.successMessage).toBeVisible();
    await expect(sellPage.statusMssage).toBeVisible();
    await expect(page.getByText('cash', { exact: true })).toBeVisible();
  });

  // Selenium: SellTests.chequeNeedsBranch
  //   Choose Cheque, quantity 1, confirm, submit, without filling in a branch.
  //   Expect the alert "Cheque settlement requires a branch" and to stay on the sell page.
  test('08 Cheque settlement without a branch is rejected', async ({ page }) => {
    await page.goto('/dashboard');

    const sellPage = new SellPage(page);
    await sellPage.performSellAction('NSE', '1', 'cheque');

    await expect(sellPage.errorMessage).toHaveText('Cheque settlement requires a branch');
    await expect(page).toHaveURL(/\/sell/);
  });

  // Selenium: SellTests.chequeWithBranchConfirms
  //   Choose NSE and Cheque, branch "Fort, Mumbai", quantity 1, confirm, submit.
  //   Expect the settlement "cheque" and the status "processing".
  test('09 Cheque settlement with a branch is confirmed', async ({ page }) => {
    await page.goto('/dashboard');

    const sellPage = new SellPage(page);
    await sellPage.performSellAction('NSE', '1', 'cheque', 'Fort, Mumbai');

    await expect(sellPage.successMessage).toBeVisible();
    await expect(sellPage.statusMssage).toBeVisible();
    await expect(page.getByText('cheque', { exact: true })).toBeVisible();
  });

  // Selenium: SellTests.oversellIsRejected
  //   Quantity 9999, confirm, submit. Expect an alert like "Only 120 units available to sell".
  //   The number depends on the account, so match the shape of the sentence.
  test('10 Selling more than is held is rejected', async ({ page }) => {
    await page.goto('/dashboard');

    const sellPage = new SellPage(page);
    await sellPage.performSellAction('NSE', '999', 'cash');

    await expect(sellPage.errorMessage).toHaveText(/Only \d+ units available to sell/);
    await expect(page).toHaveURL(/\/sell/);
  });

});

// Selenium: SellTests.saleReducesQuantityOnServer
//   Ask the API for the holding's quantity, sell 2 through the UI, ask the API again,
//   expect the quantity to be 2 lower. Playwright's request fixture replaces the Java HttpClient.
test('11 A sale reduces the quantity held on the server', async ({ hybridPage, api }) => {
  const { page, account } = hybridPage;
  const beforeResponse = await api.get(`account/${account.accountId}`);
  expect(beforeResponse.ok()).toBeTruthy();
  const before = await beforeResponse.json();
  const initialHolding = before.account.holdings.find(
    (holding: { name: string; market: string; quantity: number }) =>
      holding.name === 'Bluechip Growth Fund' && holding.market === 'NSE',
  );
  expect(initialHolding).toBeDefined();

  const sellPage = new SellPage(page);
  await sellPage.performSellAction('NSE', '2', 'cash');
  await expect(sellPage.successMessage).toBeVisible();

  const afterResponse = await api.get(`account/${account.accountId}`);
  expect(afterResponse.ok()).toBeTruthy();
  const after = await afterResponse.json();
  const updatedHolding = after.account.holdings.find(
    (holding: { name: string; market: string; quantity: number }) =>
      holding.name === 'Bluechip Growth Fund' && holding.market === 'NSE',
  );
  expect(updatedHolding).toBeDefined();
  expect(updatedHolding.quantity).toBe(initialHolding.quantity - 2);
});



