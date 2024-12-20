import { Page, Locator } from 'playwright';
import { ControlBase } from './ControlBase';
import { log } from '../utils/logger';

export class CustomSelectSpan extends ControlBase {
    private static readonly DEFAULT_TIMEOUT = 60 * 1000;  // 60 seconds
    private static readonly LONG_TIMEOUT = 120 * 1000;    // 120 seconds
    private static readonly SHORT_TIMEOUT = 30 * 1000;    // 30 seconds

    private readonly optionLabel: string;
    private readonly searchBox: Locator;

    constructor(page: Page, selector: string, optionLabel: string, searchSelector: string) {
        super(page, selector);
        this.optionLabel = optionLabel;
        this.searchBox = page.locator(searchSelector);
    }

    async setAndSelectValue(value: string): Promise<void> {
        try {
            log.INFO(`Setting and selecting value: ${value} on ${this.selector}`);
            
            // Click to open dropdown with default timeout
            await this.findControl(CustomSelectSpan.DEFAULT_TIMEOUT);
            await this.click({ timeout: CustomSelectSpan.DEFAULT_TIMEOUT });
            
            // Fill search box with default timeout
            await this.searchBox.fill(value, { timeout: CustomSelectSpan.DEFAULT_TIMEOUT });
            
            // Wait for options to appear and click with long timeout
            const optionSelector = `//${this.optionLabel}[text()='${value}']`;
            await this.page.click(optionSelector, { timeout: CustomSelectSpan.LONG_TIMEOUT });
            
            log.INFO(`Successfully set and selected value: ${value}`);
        } catch (error) {
            log.ERROR(`Failed to set and select value: ${value}`, { error });
            throw error;
        }
    }

    async setAndSelectContainsValue(value: string): Promise<void> {
        try {
            log.INFO(`Setting and selecting containing value: ${value} on ${this.selector}`);
            
            await this.findControl(CustomSelectSpan.DEFAULT_TIMEOUT);
            await this.click({ timeout: CustomSelectSpan.DEFAULT_TIMEOUT });
            
            await this.searchBox.fill(value, { timeout: CustomSelectSpan.DEFAULT_TIMEOUT });
            
            const optionSelector = `//${this.optionLabel}[contains(text(),'${value}')]`;
            await this.page.click(optionSelector, { timeout: CustomSelectSpan.LONG_TIMEOUT });
            
            log.INFO(`Successfully set and selected containing value: ${value}`);
        } catch (error) {
            log.ERROR(`Failed to set and select containing value: ${value}`, { error });
            throw error;
        }
    }

    async selectFirstValue(): Promise<void> {
        try {
            log.INFO(`Selecting first value on ${this.selector}`);
            
            await this.findControl(CustomSelectSpan.DEFAULT_TIMEOUT);
            await this.click({ timeout: CustomSelectSpan.DEFAULT_TIMEOUT });
            
            // Get all options and click the second one (skipping the placeholder)
            const optionLocator = this.page.locator(`//${this.optionLabel}`);
            await optionLocator.nth(2).click({ timeout: CustomSelectSpan.DEFAULT_TIMEOUT });
            
            log.INFO('Successfully selected first value');
        } catch (error) {
            log.ERROR('Failed to select first value', { error });
            throw error;
        }
    }

    async getSelectedText(): Promise<string> {
        try {
            await this.findControl(CustomSelectSpan.DEFAULT_TIMEOUT);
            const text = await this.locator.innerText({ timeout: CustomSelectSpan.SHORT_TIMEOUT });
            log.INFO(`Got selected text: ${text}`);
            return text;
        } catch (error) {
            log.ERROR('Failed to get selected text', { error });
            throw error;
        }
    }

    // New helper method to wait for options to load
    private async waitForOptions(timeout = CustomSelectSpan.LONG_TIMEOUT): Promise<void> {
        try {
            const optionsLocator = this.page.locator(`//${this.optionLabel}`);
            await optionsLocator.first().waitFor({ timeout });
            log.INFO('Options loaded successfully');
        } catch (error) {
            log.ERROR('Failed waiting for options to load', { error });
            throw error;
        }
    }
}