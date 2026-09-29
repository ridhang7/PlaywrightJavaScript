import {test} from '@playwright/test';
import { LoginPage } from '@pages/LoginPage';
import { InventoryPage} from '@pages/InventoryPage';

test.describe("Sauce demo login and add to cart flow", ()=>{
    test('Login and add to cart', async({page})=>{
        const loginPage = new LoginPage(page)
        const inventoryPage = new InventoryPage(page)
        
        loginPage.goto()
        loginPage.login('standard_user', 'secret_sauce')
        await page.pause()
        inventoryPage.validatePageTitle('Products')
        inventoryPage.addToCartAndValidate('Sauce Labs Backpack', '$29.99', 'Your Cart')
    })
    

    
})