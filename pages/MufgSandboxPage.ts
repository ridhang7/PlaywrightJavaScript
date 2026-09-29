import { Page, Locator, expect } from '@playwright/test';

export class MufgSandboxPage {
  readonly page: Page;
  readonly businessAreaInput: Locator;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly portfolioBalance: Locator;

  constructor(page: Page) {
    this.page = page;
    this.businessAreaInput = page.locator('#area');
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.getByRole('button', { name: /Log In/i });
    this.portfolioBalance = this.page.locator('.balance-value');
  }

  async goto() {
    await this.page.goto("/");
  }

  async login(businessarea: string, username: string, password: string) {
    await this.businessAreaInput.selectOption(businessarea)
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async expectPortfolioBalance(balance: string){
    await expect(this.portfolioBalance).toHaveText(balance);
  }
}
