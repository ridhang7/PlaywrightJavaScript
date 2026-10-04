import {APIRequestContext, test as base, expect, Page } from '@playwright/test';
import path from 'path';

export interface SeededAccount {
  accountId: string;
  username: string;
  password: string;
}

interface SeedOptions {
  holdings?: { name: string; market: string; quantity: number; avgPrice: number }[];
}

type Fixtures =  {
    api: APIRequestContext;
    createAccount: (options?: SeedOptions) => Promise<SeededAccount>;
    mufgSandBoxAuthenticatedPage: Page;
    hybridPage: {
        page: Page;
        account: SeededAccount;
    };
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

    createAccount: async ({ api }, use) => {
    await use(async (options = {}) => {
      const res = await api.post('test/seed-account', { data: options });
      expect(res.ok()).toBeTruthy();
      return res.json();
    });
  },
    
    mufgSandBoxAuthenticatedPage: async({workerAuthedContext, createAccount}, use) =>{
        const account = await createAccount();
        await workerAuthedContext.addInitScript((accountId) => {
            localStorage.setItem('holdingsSandbox.accountId', accountId);
        }, account.accountId);
        const page = await workerAuthedContext.newPage();
        await use(page);
        await page.close();
    },

    hybridPage: async({ browser, baseURL, createAccount }, use) => {
        const account = await createAccount();
        const context = await browser.newContext({ baseURL });
        await context.addInitScript((accountId) => {
            localStorage.setItem('holdingsSandbox.accountId', accountId);
        }, account.accountId);

        const page = await context.newPage();
        try {
            await page.goto('/dashboard');
            await expect(page.getByRole('heading', { level: 1 })).toContainText(account.username);
            await use({ page, account });
        } finally {
            await context.close();
        }
    },

    api: async({ playwright }, use) =>{
        const context = await playwright.request.newContext({
            baseURL: 'http://localhost:4000/api/',
        });
        await use(context);
        await context.dispose();
    },
});

export {expect};