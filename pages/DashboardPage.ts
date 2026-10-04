import { Page } from '@playwright/test';

export class DashboardPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  get holdings() {
    return this.page.locator('.holding-row');
  }

  get firstHoldingName() {
    return this.page.locator('.holding-name').first();
  }

  get firstHoldingDetails() {
    return this.page.locator('.holding-meta').first();
  }
}
