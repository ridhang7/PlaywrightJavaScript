import {APIRequestContext, test as base, expect, Page } from '@playwright/test';
import path from 'path';

type Fixtures =  {
    authenticatedPage: Page;
    mufgSandBoxAuthenticatedPage: Page;
    apiContext: APIRequestContext;
    seededAccount: SeededAccount;
    hybridPage: {
        page: Page;
        account: SeededAccount;
    };
}

type SeededAccount = {
    accountId: string;
    area: string;
    username: string;
    password: string;
    balance: number;
    holdings: {
        id: string;
        name: string;
        market: string;
        quantity: number;
        avgPrice: number;
    }[]
}

type WorkerFixtures = {
    workerAuthedContext: Awaited<ReturnType<Page['context']>>;
}

export const test = base.extend<Fixtures, WorkerFixtures>({
    workerAuthedContext: [
        async({ browser}, use)=>{
            const authFile = path.join(__dirname, '../playwright/.auth/user.json');
            const context = await browser.newContext({storageState: authFile})                ;
            await use (context);
            await context.close();
        },
        {scope: 'worker'},
    ],

    authenticatedPage: async({workerAuthedContext}, use) =>{
        const page = await workerAuthedContext.newPage();
        await use(page);
        await page.close();
    },
    
    mufgSandBoxAuthenticatedPage: async({workerAuthedContext}, use) =>{
        const page = await workerAuthedContext.newPage();
        await use(page);
        await page.close();
    },

    apiContext: async({ playwright }, use) =>{
        const context = await playwright.request.newContext({
            baseURL: 'http://localhost:4000/api/',
        });
        await use(context);
        await context.dispose();
    },

    seededAccount: async({apiContext}, use) =>{
        const response = await apiContext.post('test/seed-account', {data: {}});
        const account: SeededAccount = await response.json();
        await use(account);
    },

    hybridPage: async({browser, apiContext}, use) =>{
        const response = await apiContext.post('test/seed-account', {data: {holdings: [{name: 'Hybrid Test Fund', market: 'NSE', quantity: 120, avgPrice: 1000}]}});
        const account = await response.json();
        const context = await browser.newContext(
            {storageState: 
                {cookies: [], 
                    origins: [
                        {
                            origin: 'http://localhost:5173',
                            localStorage: [
                                {name: 'holdingsSandbox.accountId', value: account.accountId}
                            ]
                        }
                    ]
                }
            }   
        );
        const page = await context.newPage();
        await use({page, account});
        await context.close();
    }
});

export {expect};