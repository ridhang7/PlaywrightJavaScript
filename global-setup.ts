// import { chromium, FullConfig } from "@playwright/test";
// // import { LoginPage } from "@pages/LoginPage";
// import { MufgSandboxPage } from "@pages/MufgSandboxPage";
// import path from 'path';

// async function globalSetup(config: FullConfig){
//     const  {baseURL} = config.projects[0].use;
//     const browser = await chromium.launch();
//     const page = await browser.newPage();
//     // page.goto(`${baseURL}/login`);
//     // const loginPage = await new LoginPage(page);
//     // loginPage.goto();
//     // loginPage.login('standard_user', 'secret_sauce');

//     const mufgSandboxPage = new MufgSandboxPage(page);
    
//     mufgSandboxPage.goto(`${baseURL}/login`);
//     mufgSandboxPage.login('Retail Banking','demo', 'demo1234');
//     const authFile = path.join(__dirname, 'playwright/.auth/user.json')
//     await page.context().storageState({path: authFile})
// }

// export default globalSetup