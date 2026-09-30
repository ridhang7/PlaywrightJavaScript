import {test} from '../../fixtures/base';
// import {test} from '@playwright/test';
import { MufgSandboxPage } from '../../pages/MufgSandboxPage';

test.describe('Log in to the MUFG sandox portal and sell holding', ()=>{
    test('Logged in user is provided by playwright before selling', async ({mufgSandBoxAuthenticatedPage}) =>{
        const mufgSandboxPage = new MufgSandboxPage(mufgSandBoxAuthenticatedPage);

        await mufgSandboxPage.goto('/dashboard');

        await mufgSandboxPage.expectPortfolioBalance('₹1,25,000.50');

        // await mufgSandboxPage.performSellAction();
    })

})