import { Page } from 'playwright';
import { ControlBase } from './ControlBase';
import { log } from '../utils/logger';

export class CustomSelect extends ControlBase {
    // Class-level timeout constants
    private static readonly DEFAULT_TIMEOUT = 60 * 1000;  // 60 seconds
    private static readonly LONG_TIMEOUT = 120 * 1000;    // 120 seconds
    private static readonly SHORT_TIMEOUT = 30 * 1000;    // 30 seconds
    
    private readonly optionLabel: string;
    
    constructor(page: Page, selector: string, optionLabel: string) {
        super(page, selector);
        this.optionLabel = optionLabel;
    }

    async setAndSelectValue(value: string): Promise<void> {
        try {
            log.INFO(`Setting and selecting value: ${value} on ${this.selector}`);
            await this.findControl(CustomSelect.DEFAULT_TIMEOUT);
            
            // Fill the input with default timeout
            await this.locator.fill(value, { timeout: CustomSelect.DEFAULT_TIMEOUT });
            
            // Click the option with long timeout since it might take time to appear
            const optionSelector = `//${this.optionLabel}[text()='${value}']`;
            await this.page.click(optionSelector, { timeout: CustomSelect.LONG_TIMEOUT });
            
            // Press Tab with short timeout since it's a simple action
            await this.locator.press('Tab', { timeout: CustomSelect.SHORT_TIMEOUT });
            
            log.INFO(`Successfully set and selected value: ${value}`);
        } catch (error) {
            log.ERROR(`Failed to set and select value: ${value}`, { error });
            throw error;
        }
    }

    async setAndSelectContainsValue(value: string): Promise<void> {
        try {
            log.INFO(`Setting and selecting containing value: ${value} on ${this.selector}`);
            await this.findControl(CustomSelect.DEFAULT_TIMEOUT);
            
            await this.locator.clear({ timeout: CustomSelect.SHORT_TIMEOUT });
            await this.locator.fill(value, { timeout: CustomSelect.DEFAULT_TIMEOUT });
            
            const optionSelector = `//${this.optionLabel}[contains(text(),'${value}')]`;
            await this.page.click(optionSelector, { timeout: CustomSelect.LONG_TIMEOUT });
            
            await this.locator.press('Tab', { timeout: CustomSelect.SHORT_TIMEOUT });
            
            log.INFO(`Successfully set and selected containing value: ${value}`);
        } catch (error) {
            log.ERROR(`Failed to set and select containing value: ${value}`, { error });
            throw error;
        }
    }

    async clickAndSelectValue(value: string): Promise<void> {
        try {
            log.INFO(`Clicking and selecting value: ${value} on ${this.selector}`);
            await this.findControl(CustomSelect.DEFAULT_TIMEOUT);
            
            await this.click({ timeout: CustomSelect.DEFAULT_TIMEOUT });
            
            const optionSelector = `//${this.optionLabel}[text()='${value}']`;
            await this.page.click(optionSelector, { timeout: CustomSelect.LONG_TIMEOUT });
            
            log.INFO(`Successfully clicked and selected value: ${value}`);
        } catch (error) {
            log.ERROR(`Failed to click and select value: ${value}`, { error });
            throw error;
        }
    }

    async clear(): Promise<void> {
        try {
            await this.findControl(CustomSelect.SHORT_TIMEOUT);
            await this.locator.clear({ timeout: CustomSelect.SHORT_TIMEOUT });
            log.INFO(`Cleared select input: ${this.selector}`);
        } catch (error) {
            log.ERROR(`Failed to clear select input: ${this.selector}`, { error });
            throw error;
        }
    }
}