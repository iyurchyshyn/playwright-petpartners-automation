import { Page, Locator } from 'playwright';
import { ControlBase } from './ControlBase';
import { log } from '../utils/logger';

export class Select extends ControlBase {
    private static readonly DEFAULT_TIMEOUT = 60 * 1000;   // 60 seconds
    private static readonly LONG_TIMEOUT = 120 * 1000;     // 120 seconds
    private static readonly SHORT_TIMEOUT = 30 * 1000;     // 30 seconds

    constructor(page: Page, selector: string) {
        super(page, selector);
    }

    async selectValue(value: string): Promise<void> {
        try {
            await this.findControl(Select.DEFAULT_TIMEOUT);
            await this.click({ timeout: Select.SHORT_TIMEOUT });
            
            log.INFO(`Selecting value: ${value} on ${this.selector}`);
            await this.locator.selectOption(value, { timeout: Select.DEFAULT_TIMEOUT });
        } catch (error) {
            log.ERROR(`Failed to select value: ${value}`, { error });
            throw error;
        }
    }

    async selectValueContainsOption(value: string): Promise<void> {
        try {
            await this.findControl(Select.DEFAULT_TIMEOUT);
            log.INFO(`Selecting value containing: ${value} on ${this.selector}`);
            
            // Get all options and find the one containing our value
            const options = await this.locator.locator('option').all();
            for (const option of options) {
                const text = await option.textContent();
                if (text?.includes(value)) {
                    const optionValue = await option.getAttribute('value');
                    await this.locator.selectOption(optionValue!, { timeout: Select.DEFAULT_TIMEOUT });
                    return;
                }
            }
            throw new Error(`No option containing ${value} found`);
        } catch (error) {
            log.ERROR(`Failed to select value containing: ${value}`, { error });
            throw error;
        }
    }

    async selectFirstValue(): Promise<void> {
        try {
            await this.findControl(Select.DEFAULT_TIMEOUT);
            log.INFO(`Selecting first value on ${this.selector}`);
            
            const options = await this.locator.locator('option').all();
            if (options.length > 1) {
                const value = await options[1].getAttribute('value');
                await this.locator.selectOption(value!, { timeout: Select.DEFAULT_TIMEOUT });
            } else {
                throw new Error('Not enough options to select first value');
            }
        } catch (error) {
            log.ERROR('Failed to select first value', { error });
            throw error;
        }
    }

    async getSelectedText(): Promise<string> {
        try {
            await this.findControl(Select.DEFAULT_TIMEOUT);
            const selectedOption = await this.locator.locator('option:checked');
            const text = await selectedOption.textContent();
            log.INFO(`Got selected text: ${text}`);
            return text || '';
        } catch (error) {
            log.ERROR('Failed to get selected text', { error });
            throw error;
        }
    }

    async getDisabledOptionText(): Promise<string> {
        try {
            await this.findControl(Select.DEFAULT_TIMEOUT);
            const selectedOption = await this.locator.locator('option[disabled]:checked');
            const text = await selectedOption.textContent();
            log.INFO(`Got disabled option text: ${text}`);
            return text || '';
        } catch (error) {
            log.ERROR('Failed to get disabled option text', { error });
            throw error;
        }
    }

    async getAllValuesCommaSeparated(): Promise<string> {
        try {
            await this.findControl(Select.DEFAULT_TIMEOUT);
            const options = await this.locator.locator('option').all();
            const values = await Promise.all(options.map(option => option.textContent()));
            const result = values.filter(v => v).join(',');
            log.INFO(`Got all values: ${result}`);
            return result;
        } catch (error) {
            log.ERROR('Failed to get all values', { error });
            throw error;
        }
    }
}