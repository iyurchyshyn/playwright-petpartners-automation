import { setWorldConstructor, World, IWorldOptions } from '@cucumber/cucumber';
import { Page } from 'playwright';
import BrowserManager from '../browser/browserSetup';
import { PageManager } from './pageManager';
import { BasePage } from '../pages/basePage';

export interface ICustomWorld extends World {
    browserManager: BrowserManager;
    pageManager?: PageManager;
    getPage(): Promise<Page>;
    getPageObject<T extends BasePage>(PageClass: new (page: Page) => T): Promise<T>;
    initializePageObjects(): Promise<void>;
    getWorldParameters(): { baseUrl: string; timeout: number; browser: string };
}

export class CustomWorld extends World implements ICustomWorld {
    browserManager: BrowserManager;
    pageManager?: PageManager;

    constructor(options: IWorldOptions) {
        super(options);
        this.browserManager = BrowserManager.getInstance();
        console.log('World parameters:', options.parameters);
    }

    async getPage(): Promise<Page> {
        const page = this.browserManager.page;
        if (!page) {
            throw new Error('Page not initialized. BrowserManager should initialize the page first.');
        }
        return page;
    }

    async getPageObject<T extends BasePage>(PageClass: new (page: Page) => T): Promise<T> {
        if (!this.pageManager) {
            const page = await this.getPage();
            this.pageManager = new PageManager(page);
        }
        return this.pageManager.getPage(PageClass);
    }

    async initializePageObjects(): Promise<void> {
        const page = await this.getPage();
        this.pageManager = new PageManager(page);
    }

    getWorldParameters() {
        return {
            baseUrl: process.env.BASE_URL || 'https://qas.akcpetinsurance.com/',
            timeout: Number(process.env.TIMEOUT) || 120 * 1000,
            browser: process.env.BROWSER || 'chromium'
        };
    }
}

setWorldConstructor(CustomWorld);