import { Page } from 'playwright';
import { ControlBase } from './ControlBase';
import { log } from '../utils/logger';

export class MultipleSelect extends ControlBase {
    private static readonly DEFAULT_TIMEOUT = 60 * 1000;
    private static readonly LONG_TIMEOUT = 120 * 1000;
    private static readonly SHORT_TIMEOUT = 30 * 1000;

    constructor(page: Page, selector: string) {
        super(page, selector);
    }

    async selectOptions(values: string[]): Promise<void> {
        try {
            await this.findControl(MultipleSelect.DEFAULT_TIMEOUT);
            for (const value of values) {
                const optionLocator = this.page
                    .locator(`ng-dropdown-panel[role="listbox"] div[role="option"] span`)
                    .filter({ hasText: value });
                
                await optionLocator.click({ timeout: MultipleSelect.DEFAULT_TIMEOUT });
                log.INFO(`Selected option: ${value}`);
            }
        } catch (error) {
            log.ERROR('Failed to select options', { error, values });
            throw error;
        }
    }

    async getAllValues(): Promise<string[]> {
        try {
            await this.findControl(MultipleSelect.DEFAULT_TIMEOUT);
            const values = await this.locator.evaluateAll(
                (elements) => elements.map((el) => el.textContent?.trim() || '')
            );
            log.INFO(`Retrieved all values: ${values.join(', ')}`);
            return values;
        } catch (error) {
            log.ERROR('Failed to get all values', { error });
            throw error;
        }
    }
}