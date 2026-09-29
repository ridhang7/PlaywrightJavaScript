import { MufgSandboxPage } from '@pages/MufgSandboxPage';
// import {test, expect} from '../../fixtures/base';
import {test} from '@playwright/test';

// import { MufgSandboxPage } from '@pages/MufgSandboxPage';

test.describe('Log in to the MUFG sandox portal and sell holding', ()=>{
    test('Logged in user is provided by playwright before selling', async ({page}) =>{
        // const mufgSandboxPage = new MufgSandboxPage(mufgSandBoxAuthenticatedPage);
        
        const mufgSandboxPage = new MufgSandboxPage(page);
        
        await mufgSandboxPage.goto();
        
        await mufgSandboxPage.login('Retail Banking','demo', 'demo1234');
        
        await mufgSandboxPage.expectPortfolioBalance('₹1,25,000.50');

        // await mufgSandboxPage.performSellAction();
    })

})