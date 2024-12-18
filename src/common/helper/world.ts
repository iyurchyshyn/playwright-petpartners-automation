import { setWorldConstructor, World, IWorldOptions } from '@cucumber/cucumber';
import { Page } from 'playwright';
import BrowserManager from '../browser/browserSetup';
import { PageManager } from './pageManager';
import { BasePage } from '../pages/basePage';
import { log } from '../utils/logger';

export interface ICustomWorld extends World {
    browserManager: BrowserManager;
    pageManager?: PageManager;
    variables: Map<string, any>;
    getPage(): Promise<Page>;
    getPageObject<T extends BasePage>(PageClass: new (page: Page) => T): Promise<T>;
    set(key: string, value: any): void;
    get(key: string): any;
    initializePageObjects(): Promise<void>;
    getWorldParameters(): { baseUrl: string; timeout: number; browser: string };
}

export class CustomWorld extends World implements ICustomWorld {
    browserManager: BrowserManager;
    pageManager?: PageManager;
    variables: Map<string, any>;

    constructor(options: IWorldOptions) {
        super(options);
        this.browserManager = BrowserManager.getInstance();
        this.variables = new Map();
        log.INFO('World parameters:', options.parameters);
    }

    set(key: string, value: any): void {
        this.variables.set(key, value);
        this.attach(`> save the value: [${value}] in [${key}]`, 'text/plain');
        log.INFO('Set variable:', { key, value });
    }

    get(key: string): any {
        const value = this.variables.get(key);
        log.INFO('Get variable:', { key, value });
        return value;
    }

    async getPage(): Promise<Page> {
        const page = this.browserManager.page;
        if (!page) {
            const error = 'Page not initialized. BrowserManager should initialize the page first.';
            log.ERROR(error);
            throw new Error(error);
        }
        return page;
    }

    async getPageObject<T extends BasePage>(PageClass: new (page: Page) => T): Promise<T> {
        if (!this.pageManager) {
            const page = await this.getPage();
            this.pageManager = new PageManager(page);
        }
        log.INFO('Getting page object:', { pageClass: PageClass.name });
        return this.pageManager.getPage(PageClass);
    }

    async initializePageObjects(): Promise<void> {
        const page = await this.getPage();
        this.pageManager = new PageManager(page);
        log.INFO('Page objects initialized');
    }

    getWorldParameters() {
        const params = {
            baseUrl: process.env.BASE_URL || 'https://qas.akcpetinsurance.com/',
            timeout: Number(process.env.TIMEOUT) || 120 * 1000,
            browser: process.env.BROWSER || 'chromium'
        };
        log.INFO('World parameters:', params);
        return params;
    }
}

setWorldConstructor(CustomWorld);