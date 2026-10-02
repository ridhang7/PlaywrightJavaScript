import { expect, test } from "../../fixtures/base";


test('Login from API Sell Holding from UI Verify transaction from API and UI', async ({hybridPage}) =>{
    const {page, account} = hybridPage;
    const holding = account.holdings[0];

    await page.goto('/dashboard');
    await expect(page.locator('h1')).toContainText('Welcome,');
    await expect(page.locator('.holding-name')).toBeVisible();
    // const targetItem = page.locator('.holding-name').filter({hasText: holding.name});

    // await targetItem.getByRole('button',{name: 'Sell / Redeem'}).click();

    // await page.getByRole('radio', {name: 'NSE'}).check();

    // await page.locator('input[name="quantity"]').fill('10');

    // await page.getByLabel('I confirm the above details are correct').check();

    // await page.getByRole('button', {name: 'Submit for Redemption'}).click();
})