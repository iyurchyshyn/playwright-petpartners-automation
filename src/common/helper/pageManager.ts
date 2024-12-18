import { Page } from 'playwright';
import { BasePage } from '../pages/basePage';

// Type for page object constructors
type PageConstructor = new (page: Page) => BasePage;

export class PageManager {
    private pages: Map<string, BasePage>;
    private page: Page;

    constructor(page: Page) {
        this.pages = new Map();
        this.page = page;
    }

    async getPage<T extends BasePage>(
        PageClass: PageConstructor & { new(page: Page): T }
    ): Promise<T> {
        const pageClassName = PageClass.name;

        if (!this.pages.has(pageClassName)) {
            this.pages.set(pageClassName, new PageClass(this.page));
        }

        return this.pages.get(pageClassName) as T;
    }

    clearPages(): void {
        this.pages.clear();
    }
}