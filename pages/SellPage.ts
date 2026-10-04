import { expect, Page } from '@playwright/test';

export class SellPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async performSellAction(market: string, qtyToSell: string, settlementType: string, chequeBranch?: string) {
    await this.page.getByRole('button', { name: 'Sell / Redeem' }).first().click();

    await expect(this.page.locator('h1')).toContainText('Sell / Redeem');
    
    await this.page.getByLabel(market).click();
    await this.page.getByLabel('Quantity to sell').fill(qtyToSell);
    await this.page.getByLabel(settlementType).click();
    if (settlementType === 'cheque' && chequeBranch) {
      await this.page.getByRole('textbox', { name: 'Cheque branch' }).fill(chequeBranch);
    }
    await this.page.getByLabel('I confirm the above details are correct').click();
    await this.page.getByRole('button', { name: 'Submit for Redemption' }).click();
  }

  get successMessage() {
    return this.page.getByRole('heading', { name: 'Transaction submitted and under process' });
  }

  get statusMssage() {
    return this.page.getByText('processing', { exact: true })
  }

  get errorMessage() {
    return this.page.getByRole('alert');
  }

}
