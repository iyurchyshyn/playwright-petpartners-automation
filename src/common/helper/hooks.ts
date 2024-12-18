import { Before, After, Status } from '@cucumber/cucumber';
import { ICustomWorld } from '../../common/helper/world';
import { log } from '../utils/logger';

// Before each scenario
Before(async function(this: ICustomWorld, scenario) {
    log.INFO('Starting scenario:', { name: scenario.pickle.name });
    
    if (!this.browserManager.browser) {
      log.INFO('Initializing browser in Before hook...');
        await this.browserManager.initializeBrowser();
    }
    await this.initializePageObjects();
});

// After each scenario
After(async function(this: ICustomWorld, scenario) {
    if (scenario.result?.status === Status.FAILED) {
        log.ERROR('Scenario failed:', { 
            name: scenario.pickle.name,
            error: scenario.result?.message 
        });
        
        try {
            const page = await this.getPage();
            const screenshot = await page.screenshot({
                path: `reports/screenshots/${scenario.pickle.name.replace(/\s+/g, '_')}.png`,
                fullPage: true
            });
            await this.attach(screenshot, 'image/png');
            log.INFO('Screenshot captured for failed scenario');
        } catch (error) {
            log.ERROR('Failed to capture screenshot', { error });
        }
    } else {
        log.INFO('Scenario completed successfully:', { 
            name: scenario.pickle.name,
            status: scenario.result?.status 
        });
    }

    await this.browserManager.closePage();
    await this.browserManager.closeContext();
    await this.browserManager.closeBrowser();
});