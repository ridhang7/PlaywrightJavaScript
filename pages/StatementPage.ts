import { expect, type Locator, type Page } from '@playwright/test';

export class StatementPage {
  constructor(private readonly dashboardPage: Page) {}

  async open(): Promise<Page> {
    const statementPagePromise = this.dashboardPage.context().waitForEvent('page');
    await this.dashboardPage.getByRole('link', { name: 'View statement' }).click();
    const statementPage = await statementPagePromise;
    await expect(statementPage.getByRole('heading', { name: 'Account Statement' })).toBeVisible();
    return statementPage;
  }

  async acceptTerms(statementPage: Page) {
    const termsFrame = statementPage.frameLocator('iframe[title="Statement terms"]');
    await termsFrame.getByRole('button', { name: 'Accept terms' }).click();
    await expect(termsFrame.getByText('Terms accepted')).toBeVisible();
  }

  async filterMarkets(statementPage: Page, markets: string[]) {
    await statementPage.getByLabel('Markets').selectOption(markets);
  }

  holdings(statementPage: Page): Locator {
    return statementPage.locator('.holding-row');
  }
}
