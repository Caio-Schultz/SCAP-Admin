import { Builder, until } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';

async function runTest() {
  const targetUrl = process.env.APP_URL || 'http://localhost';
  console.log(`Starting Selenium test pointing to: ${targetUrl}`);

  const options = new chrome.Options();
  options.addArguments('--headless=new');
  options.addArguments('--no-sandbox');
  options.addArguments('--disable-dev-shm-usage');
  options.addArguments('--window-size=1280,800');

  const driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();

  let exitCode = 0;
  try {
    await driver.get(targetUrl);

    try {
      await driver.wait(until.titleContains('SCAP Admin'), 15000);
    } catch (e) {
      console.log('URL atual:', await driver.getCurrentUrl());
      console.log('Titulo atual:', JSON.stringify(await driver.getTitle()));
      console.log((await driver.getPageSource()).slice(0, 800));
      throw new Error('Titulo nao contem "SCAP Admin"');
    }

    console.log(`Test PASSED: "${await driver.getTitle()}"`);
  } catch (error) {
    console.error('Test FAILED:', error);
    exitCode = 1;
  } finally {
    await driver.quit();
  }
  process.exit(exitCode);
}

runTest();