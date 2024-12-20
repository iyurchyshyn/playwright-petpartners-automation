import { Page } from 'playwright';

// Type for page object constructors
type PageConstructor<T> = new (page: Page) => T;

export class PageManager {
    private pages: Map<string, any>;
    private page: Page;

    constructor(page: Page) {
        this.pages = new Map();
        this.page = page;
    }

    async getPage<T>(PageClass: PageConstructor<T>): Promise<T> {
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