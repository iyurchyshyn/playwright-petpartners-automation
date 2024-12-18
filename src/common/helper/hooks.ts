import { Before, After, Status } from '@cucumber/cucumber';
import { ICustomWorld } from '../../common/helper/world';

// Before each scenario
Before(async function(this: ICustomWorld) {
  // Initialize browser and page if not already initialized
  if (!this.browserManager.browser) {
    console.log('Initializing browser in Before hook...');
    await this.browserManager.initializeBrowser();
  }
  // Initialize page objects
  await this.initializePageObjects();
});

// After each scenario
After(async function(this: ICustomWorld, scenario) {
  // Take screenshot if scenario fails
  if (scenario.result?.status === Status.FAILED) {
    const page = await this.getPage();
    const screenshot = await page.screenshot({
      path: `reports/screenshots/${scenario.pickle.name.replace(/\s+/g, '_')}.png`,
      fullPage: true
    });
    await this.attach(screenshot, 'image/png');
 
  }
  await this.browserManager.closePage();
  await this.browserManager.closeContext();
  await this.browserManager.closeBrowser();
  
});