import { Page, Locator, expect } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  readonly pageTitle: Locator;
  readonly addToCartButton: Locator;
  readonly inventoryItem: Locator;
  readonly inventoryItemPrice: string;
  readonly addToCart: string;
  readonly cartLink: Locator;
  readonly cartItem: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = this.page.locator('.title');
    this.inventoryItem = this.page.locator('.inventory_item');
    this.addToCartButton = this.page.getByRole('button', {name: 'Add to cart'});
    this.cartLink = this.page.locator('.shopping_cart_link')
    this.cartItem = this.page.locator('.cart_item')
    this.inventoryItemPrice = '.inventory_item_price';
    this.addToCart = 'Add to cart';
  }

  async validatePageTitle(title: string) {
    await expect(this.pageTitle).toHaveText(title)
  }

  async addToCartAndValidate(itemName: string, itemPrice: string, title: string) {
    const targetItem = this.inventoryItem.filter({hasText: itemName})
    await expect(targetItem).toBeVisible()
    await expect(targetItem.locator(this.inventoryItemPrice)).toHaveText(itemPrice)
    await targetItem.getByRole('button', {name: this.addToCart}).click()

    await this.cartLink.click()

    await expect(this.pageTitle).toHaveText(title)

    const inventoryItem = this.cartItem.filter({hasText:itemName})
    await expect(inventoryItem).toBeVisible()
  }
}
