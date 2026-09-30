import { chromium, FullConfig } from '@playwright/test';
import { mkdir } from 'fs/promises';
import path from 'path';
import { MufgSandboxPage } from './pages/MufgSandboxPage';

async function globalSetup(config: FullConfig) {
    const baseURL = config.projects[0].use.baseURL;
    if (typeof baseURL !== 'string') {
        throw new Error('A baseURL must be configured for global setup.');
    }

    const authFile = path.resolve(__dirname, 'playwright', '.auth', 'user.json');
    await mkdir(path.dirname(authFile), { recursive: true });

    const browser = await chromium.launch();
    try {
        const page = await browser.newPage();
        const mufgSandboxPage = new MufgSandboxPage(page);

        await mufgSandboxPage.goto(new URL('/login', baseURL).toString());
        await mufgSandboxPage.login('Retail Banking', 'demo', 'demo1234');
        await mufgSandboxPage.portfolioBalance.waitFor({ state: 'visible' });

        await page.context().storageState({ path: authFile });
    } finally {
        await browser.close();
    }
}

export default globalSetup