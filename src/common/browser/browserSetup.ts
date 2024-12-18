import { Browser, BrowserContext, Page, chromium, firefox, webkit } from 'playwright';

class BrowserManager {
  private static instance: BrowserManager;
  public browser: Browser | null = null;
  public context: BrowserContext | null = null;
  public page: Page | null = null;

  private constructor() {}

  public static getInstance(): BrowserManager {
    if (!BrowserManager.instance) {
      BrowserManager.instance = new BrowserManager();
    }
    return BrowserManager.instance;
  }

  public async initializeBrowser(worldParameters?: any): Promise<void> {
    console.log('Initializing browser...');
    const browserType = process.env.BROWSER || 'chromium';
    console.log('Browser type:', browserType);
    await this.launch(browserType as 'chrome' | 'firefox' | 'webkit');
    await this.createContext(worldParameters);
    await this.createPage();
  }

  public async launch(browserType: 'chrome' | 'firefox' | 'webkit', options: Record<string, unknown> = {}): Promise<Browser> {
    const defaultOptions = {
      headless: process.env.HEADLESS === 'true',
      args: ['--start-maximized', '--window-size=2120,1400']
    };

    switch (browserType) {
      case 'firefox':
        this.browser = await firefox.launch({ ...defaultOptions, ...options });
        break;
      case 'webkit':
        this.browser = await webkit.launch({ ...defaultOptions, ...options });
        break;
      case 'chrome':
      default:
        this.browser = await chromium.launch({ ...defaultOptions, ...options });
        break;
    }
    console.log(`Launching ${browserType} browser...`);
    return this.browser;
  }


  public async createContext(worldParameters?: any): Promise<BrowserContext> {
    if (!this.browser) {
      throw new Error('Browser not launched. Call launch() first.');
    }

    console.log('Creating browser context...');
    this.context = await this.browser.newContext({ 
      extraHTTPHeaders: worldParameters ? {
        'world-parameters': JSON.stringify(worldParameters)
      } : {},
      viewport: null
    });

    return this.context;
  }

  public async createPage(): Promise<Page> {
    if (!this.context) {
      throw new Error('Browser context not created. Call createContext() first.');
    }

    if (!this.page) {
      console.log('Creating new page...');
      this.page = await this.context.newPage();
    } else {
      console.log('Reusing existing page...');
    }

    return this.page;
  }

  public async closePage(): Promise<void> {
    if (this.page) {
      await this.page.close();
      this.page = null;
    }
  }

  public async closeContext(): Promise<void> {
    if (this.context) {
      await this.context.close();
      this.context = null;
    }
  }

  public async closeBrowser(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
}

export default BrowserManager;