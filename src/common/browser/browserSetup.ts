import { Browser, BrowserContext, Page, chromium, firefox, webkit } from 'playwright';
import { log } from '../utils/logger';

class BrowserManager {
    private static instance: BrowserManager;
    public browser: Browser | null = null;
    public context: BrowserContext | null = null;
    public page: Page | null = null;

    public static getInstance(): BrowserManager {
        if (!BrowserManager.instance) {
            BrowserManager.instance = new BrowserManager();
        }
        return BrowserManager.instance;
    }

    public async initializeBrowser(worldParameters?: any): Promise<void> {
        const browserType = process.env.BROWSER || 'chromium';
        log.INFO(`Initializing browser with type: ${browserType}`);
        await this.launch(browserType as 'chrome' | 'firefox' | 'webkit');
        await this.createContext(worldParameters);
        await this.createPage();
    }

    public async launch(browserType: 'chrome' | 'firefox' | 'webkit', options: Record<string, unknown> = {}): Promise<Browser> {
        const defaultOptions = {
            headless: process.env.HEADLESS === 'true',
            args: ['--start-maximized', '--window-size=2120,1400']
        };

        try {
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
            log.INFO(`Successfully launched ${browserType} browser`);
            return this.browser;
        } catch (error) {
            log.ERROR(`Failed to launch ${browserType} browser`, {error});
            throw error;
        }
    }

    public async createContext(worldParameters?: any): Promise<BrowserContext> {
        if (!this.browser) {
            const error = 'Browser not launched. Call launch() first.';
            log.ERROR(error);
            throw new Error(error);
        }

        try {
            log.INFO('Creating browser context...', { parameters: worldParameters });
            this.context = await this.browser.newContext({ 
                extraHTTPHeaders: worldParameters ? {
                    'world-parameters': JSON.stringify(worldParameters)
                } : {},
                viewport: null
            });
            
            log.INFO('Browser context created successfully');
            return this.context;
        } catch (error) {
            log.ERROR('Failed to create browser context', { error });
            throw error;
        }
    }

    public async createPage(): Promise<Page> {
        if (!this.context) {
            const error = 'Browser context not created. Call createContext() first.';
            log.ERROR(error);
            throw new Error(error);
        }

        try {
            if (!this.page) {
                this.page = await this.context.newPage();
                log.INFO('New page created successfully');
            } else {
                log.INFO('Reusing existing page');
            }
            return this.page;
        } catch (error) {
            log.ERROR('Failed to create/reuse page', { error });
            throw error;
        }
    }

    public async closePage(): Promise<void> {
        if (this.page) {
            try {
                await this.page.close();
                this.page = null;
                log.INFO('Page closed successfully');
            } catch (error) {
                log.ERROR('Failed to close page', { error });
                throw error;
            }
        }
    }

    public async closeContext(): Promise<void> {
        if (this.context) {
            try {
                await this.context.close();
                this.context = null;
                log.INFO('Context closed successfully');
            } catch (error) {
                log.ERROR('Failed to close context', { error });
                throw error;
            }
        }
    }

    public async closeBrowser(): Promise<void> {
        if (this.browser) {
            try {
                await this.browser.close();
                this.browser = null;
                log.INFO('Browser closed successfully');
            } catch (error) {
                log.ERROR('Failed to close browser', { error });
                throw error;
            }
        }
    }
}

export default BrowserManager;