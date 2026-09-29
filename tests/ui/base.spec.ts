import {test, expect} from '@playwright/test';

test.describe("Heroku login flow", ()=>{
    // test('Successfully landing on the secure area', async({page})=>{
    //     await page.goto('/')
    //     await expect(page.locator('.login_logo')).toHaveText("Swag Labs")

    //     await page.getByLabel('username').fill('standard_user')
    //     await page.getByLabel('password').fill('secret_sauce')

    //     await page.getByRole("button",{name:"Login"}).click()

    //     await expect(page).toHaveURL(/inventory/)
    //     await expect(page.locator('.title')).toHaveText("Products")
    // })

    test('Check product details and add to cart', async({page})=>{
        await page.goto('/')
        await expect(page.locator('.login_logo')).toHaveText("Swag Labs")

        await page.getByLabel('username').fill('standard_user')
        await page.getByLabel('password').fill('secret_sauce')

        await page.getByRole("button",{name:"Login"}).click()

        await expect(page.locator('.title')).toHaveText("Products")

        const targetItem = page.locator('.inventory_item').filter({hasText:'Sauce Labs Backpack'})

        await expect(targetItem).toBeVisible()
        await expect(targetItem.locator('.inventory_item_price')).toHaveText('$29.99')

        targetItem.getByRole('button', {name: 'Add to cart'}).click()

        await page.locator(".shopping_cart_link").click()

        await expect(page.locator('.title')).toHaveText("Your Cart")
        const inventoryItem = page.locator('.cart_item').filter({hasText:'Sauce Labs Backpack'})

        await expect(inventoryItem).toBeVisible()

    })
    

    
})