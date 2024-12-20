import { Page } from 'playwright';
import { ControlBase } from './ControlBase';
import { log } from '../utils/logger';

export class TextBox extends ControlBase {
    private static readonly DEFAULT_TIMEOUT = 60 * 1000;   // 60 seconds
    private static readonly LONG_TIMEOUT = 120 * 1000;     // 120 seconds
    private static readonly SHORT_TIMEOUT = 30 * 1000;     // 30 seconds

    constructor(page: Page, selector: string) {
        super(page, selector);
    }

    async setText(value: string): Promise<void> {
        try {
            await this.findControl(TextBox.DEFAULT_TIMEOUT);
            log.INFO(`Setting text: ${value} on ${this.selector}`);
            
            if (value !== '') {
                await this.locator.fill(value, { timeout: TextBox.DEFAULT_TIMEOUT });
            }
        } catch (error) {
            log.ERROR(`Failed to set text: ${value}`, { error });
            throw error;
        }
    }

    async setTextAndTab(value: string): Promise<void> {
        try {
            await this.findControl(TextBox.DEFAULT_TIMEOUT);
            log.INFO(`Setting text with tab: ${value} on ${this.selector}`);
            
            await this.locator.fill(value, { timeout: TextBox.DEFAULT_TIMEOUT });
            await this.locator.press('Tab', { timeout: TextBox.SHORT_TIMEOUT });
        } catch (error) {
            log.ERROR(`Failed to set text and tab: ${value}`, { error });
            throw error;
        }
    }

    async setTextAndEnter(value: string): Promise<void> {
        try {
            await this.findControl(TextBox.DEFAULT_TIMEOUT);
            log.INFO(`Setting text with enter: ${value} on ${this.selector}`);
            
            await this.locator.fill(value, { timeout: TextBox.DEFAULT_TIMEOUT });
            await this.locator.press('Enter', { timeout: TextBox.SHORT_TIMEOUT });
        } catch (error) {
            log.ERROR(`Failed to set text and enter: ${value}`, { error });
            throw error;
        }
    }

    async clearAndSetText(value: string): Promise<void> {
        try {
            await this.findControl(TextBox.DEFAULT_TIMEOUT);
            log.INFO(`Clearing and setting text: ${value} on ${this.selector}`);
            
            await this.locator.clear({ timeout: TextBox.SHORT_TIMEOUT });
            await this.locator.fill(value, { timeout: TextBox.DEFAULT_TIMEOUT });
        } catch (error) {
            log.ERROR(`Failed to clear and set text: ${value}`, { error });
            throw error;
        }
    }

    async clear(): Promise<void> {
        try {
            await this.findControl(TextBox.DEFAULT_TIMEOUT);
            log.INFO(`Clearing text on ${this.selector}`);
            
            await this.locator.clear({ timeout: TextBox.SHORT_TIMEOUT });
        } catch (error) {
            log.ERROR('Failed to clear text', { error });
            throw error;
        }
    }

    async selectTextOption(initialValue: string, finalOption: string): Promise<void> {
        try {
            await this.findControl(TextBox.DEFAULT_TIMEOUT);
            log.INFO(`Selecting text option from ${initialValue} to ${finalOption}`);
            
            await this.locator.fill(initialValue, { timeout: TextBox.DEFAULT_TIMEOUT });
            
            // Wait for and click the option
            const optionLocator = this.page.locator(`li a:text("${finalOption}")`);
            await optionLocator.waitFor({ timeout: TextBox.LONG_TIMEOUT });
            await optionLocator.click({ timeout: TextBox.DEFAULT_TIMEOUT });
        } catch (error) {
            log.ERROR(`Failed to select text option: ${finalOption}`, { error });
            throw error;
        }
    }

    async fillWithJavaScript(value: string): Promise<void> {
        try {
            await this.findControl(TextBox.DEFAULT_TIMEOUT);
            log.INFO(`Setting text with JavaScript: ${value} on ${this.selector}`);
            
            await this.page.evaluate(
                ([selector, val]) => {
                    const element = document.querySelector(selector);
                    if (element) {
                        (element as HTMLInputElement).value = val;
                    }
                },
                [this.selector, value]
            );
        } catch (error) {
            log.ERROR(`Failed to set text with JavaScript: ${value}`, { error });
            throw error;
        }
    }
}