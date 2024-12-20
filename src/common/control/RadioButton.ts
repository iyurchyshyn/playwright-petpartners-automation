import { Page } from 'playwright';
import { ControlBase } from './ControlBase';
import { log } from '../utils/logger';

export class RadioButton extends ControlBase {
    private static readonly DEFAULT_TIMEOUT = 60 * 1000;
    private static readonly LONG_TIMEOUT = 120 * 1000;
    private static readonly SHORT_TIMEOUT = 30 * 1000;

    constructor(page: Page, selector: string) {
        super(page, selector);
    }

    async select(): Promise<void> {
        try {
            await this.findControl(RadioButton.DEFAULT_TIMEOUT);
            const isChecked = await this.locator.isChecked();
            
            if (!isChecked) {
                await this.click({ timeout: RadioButton.DEFAULT_TIMEOUT });
                log.INFO(`Selected radio button: ${this.selector}`);
            } else {
                log.INFO(`Radio button already selected: ${this.selector}`);
            }
        } catch (error) {
            log.ERROR(`Failed to select radio button: ${this.selector}`, { error });
            throw error;
        }
    }

    async unselect(): Promise<void> {
        try {
            await this.findControl(RadioButton.DEFAULT_TIMEOUT);
            const isChecked = await this.locator.isChecked();
            
            if (isChecked) {
                await this.click({ timeout: RadioButton.DEFAULT_TIMEOUT });
                log.INFO(`Unselected radio button: ${this.selector}`);
            } else {
                log.INFO(`Radio button already unselected: ${this.selector}`);
            }
        } catch (error) {
            log.ERROR(`Failed to unselect radio button: ${this.selector}`, { error });
            throw error;
        }
    }

    async isSelected(): Promise<boolean> {
        try {
            await this.findControl(RadioButton.DEFAULT_TIMEOUT);
            const isChecked = await this.locator.isChecked();
            log.INFO(`Radio button selected state: ${isChecked}`);
            return isChecked;
        } catch (error) {
            log.ERROR('Failed to get radio button state', { error });
            throw error;
        }
    }
}