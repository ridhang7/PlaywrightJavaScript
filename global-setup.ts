import { chromium, FullConfig } from '@playwright/test';
import { mkdir } from 'fs/promises';
import path from 'path';
import { LoginPage } from './pages/LoginPage';

async function globalSetup(config: FullConfig) {
    const baseURL = config.projects[0].use.baseURL;
    if (typeof baseURL !== 'string') {
        throw new Error('A baseURL must be configured for global setup.');
    }

    const authFile = path.resolve(__dirname, 'playwright', '.auth', 'user.json');
    await mkdir(path.dirname(authFile), { recursive: true });

    const browser = await chromium.launch({ channel: 'msedge' });
    try {
        const page = await browser.newPage();
        const loginPage = new LoginPage(page);
        await loginPage.open(new URL('/login', baseURL).toString());
        await loginPage.login('Retail Banking', 'demo', 'demo1234');
        await loginPage.expectOnDashboard();
        await page.context().storageState({ path: authFile });

    } finally {
        await browser.close();
    }
}

export default globalSetup