import { Page, Locator } from 'playwright';
import { log } from '../utils/logger';

export class ControlBase {
    protected readonly DEFAULT_TIMEOUT = 60 * 1000;  // 60 seconds
    protected readonly LONG_TIMEOUT = 120 * 1000;    // 120 seconds
    
    protected locator: Locator;
    protected page: Page;
    protected selector: string;

    constructor(page: Page, selector: string) {
        this.page = page;
        this.selector = selector;
        this.locator = page.locator(selector);
    }

    protected async findControl(timeout = this.DEFAULT_TIMEOUT): Promise<void> {
        try {
            await this.locator.waitFor({ timeout });
            await this.smartScroll();
            log.INFO(`Found control with selector: ${this.selector}`);
        } catch (error) {
            log.ERROR(`Failed to find control with selector: ${this.selector}`, { error });
            throw error;
        }
    }

    protected async smartScroll(): Promise<void> {
        try {
            // New addition: Check if element is in viewport before scrolling
            const isVisible = await this.locator.isVisible();
            if (!isVisible) {
                await this.locator.scrollIntoViewIfNeeded();
                log.INFO(`Scrolled element into view: ${this.selector}`);
            }
        } catch (error) {
            log.ERROR(`Failed to scroll element into view: ${this.selector}`, { error });
        }
    }

    public async click(options = { timeout: this.DEFAULT_TIMEOUT }): Promise<void> {
        try {
            await this.findControl(options.timeout);
            await this.locator.click({ timeout: options.timeout });
            log.INFO(`Clicked element: ${this.selector}`);
        } catch (error) {
            log.ERROR(`Failed to click element: ${this.selector}`, { error });
            throw error;
        }
    }

    // New method: Click using JavaScript
    public async clickWithJS(): Promise<void> {
        try {
            await this.findControl();
            await this.page.evaluate((selector) => {
                const element = document.querySelector(selector);
                if (element) (element as HTMLElement).click();
            }, this.selector);
            log.INFO(`Clicked element with JavaScript: ${this.selector}`);
        } catch (error) {
            log.ERROR(`Failed to click element with JavaScript: ${this.selector}`, { error });
            throw error;
        }
    }

    public async isDisplayed(timeout = this.DEFAULT_TIMEOUT): Promise<boolean> {
        try {
            await this.locator.waitFor({ state: 'visible', timeout });
            log.INFO(`Element is displayed: ${this.selector}`);
            return true;
        } catch {
            log.INFO(`Element is not displayed: ${this.selector}`);
            return false;
        }
    }

    public async isNotDisplayed(timeout = this.DEFAULT_TIMEOUT): Promise<boolean> {
        try {
            await this.locator.waitFor({ state: 'hidden', timeout });
            log.INFO(`Element is not displayed: ${this.selector}`);
            return true;
        } catch {
            log.INFO(`Element is still displayed: ${this.selector}`);
            return false;
        }
    }

    public async getText(timeout = this.DEFAULT_TIMEOUT): Promise<string> {
        try {
            await this.findControl(timeout);
            const text = await this.locator.innerText({ timeout });
            log.INFO(`Got text from element: ${this.selector}, value: [${text}]`);
            return text;
        } catch (error) {
            log.ERROR(`Failed to get text from element: ${this.selector}`, { error });
            throw error;
        }
    }

    public async getAttribute(attributeName: string, timeout = this.DEFAULT_TIMEOUT): Promise<string | null> {
        try {
            await this.findControl(timeout);
            const value = await this.locator.getAttribute(attributeName, { timeout });
            log.INFO(`Got attribute ${attributeName} from element: ${this.selector}, value: [${value}]`);
            return value;
        } catch (error) {
            log.ERROR(`Failed to get attribute ${attributeName} from element: ${this.selector}`, { error });
            throw error;
        }
    }

    public async getCssValue(propertyName: string, timeout = this.DEFAULT_TIMEOUT): Promise<string> {
        try {
            await this.findControl(timeout);
            const value = await this.page.evaluate(
                ([selector, prop]) => {
                    const element = document.querySelector(selector);
                    return element ? window.getComputedStyle(element).getPropertyValue(prop) : '';
                },
                [this.selector, propertyName]
            );
            log.INFO(`Got CSS value ${propertyName} from element: ${this.selector}, value: [${value}]`);
            return value;
        } catch (error) {
            log.ERROR(`Failed to get CSS value ${propertyName} from element: ${this.selector}`, { error });
            throw error;
        }
    }

    
    public async waitForVisible(timeout = this.DEFAULT_TIMEOUT): Promise<void> {
        try {
            await this.locator.waitFor({ state: 'visible', timeout });
            log.INFO(`Element is clickable: ${this.selector}`);
        } catch (error) {
            log.ERROR(`Element is not clickable: ${this.selector}`, { error });
            throw error;
        }
    }

    public async hover(timeout = this.DEFAULT_TIMEOUT): Promise<void> {
        try {
            await this.findControl(timeout);
            await this.locator.hover({ timeout });
            log.INFO(`Hovered over element: ${this.selector}`);
        } catch (error) {
            log.ERROR(`Failed to hover over element: ${this.selector}`, { error });
            throw error;
        }
    }

    public async isEnabled(timeout = this.DEFAULT_TIMEOUT): Promise<boolean> {
        try {
            await this.findControl(timeout);
            const isEnabled = await this.locator.isEnabled({ timeout });
            log.INFO(`Element enabled state: ${this.selector}, value: [${isEnabled}]`);
            return isEnabled;
        } catch (error) {
            log.ERROR(`Failed to check if element is enabled: ${this.selector}`, { error });
            return false;
        }
    }

    public async isDisabled(timeout = this.DEFAULT_TIMEOUT): Promise<boolean> {
        try {
            await this.findControl(timeout);
            const isDisabled = await this.locator.isDisabled({ timeout });
            log.INFO(`Element disabled state: ${this.selector}, value: [${isDisabled}]`);
            return isDisabled;
        } catch (error) {
            log.ERROR(`Failed to check if element is disabled: ${this.selector}`, { error });
            return false;
        }
    }

    public async getElementCount(): Promise<number> {
        try {
            const count = await this.locator.count();
            log.INFO(`Element count for selector: ${this.selector}, count: [${count}]`);
            return count;
        } catch (error) {
            log.ERROR(`Failed to get element count: ${this.selector}`, { error });
            throw error;
        }
    }
}