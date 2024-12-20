import { Page } from 'playwright';
import { ControlBase } from './ControlBase';
import { log } from '../utils/logger';

export class Checkbox extends ControlBase {
    constructor(page: Page, selector: string) {
        super(page, selector);
    }

    public async check(timeout = this.DEFAULT_TIMEOUT): Promise<void> {
        try {
            await this.findControl(timeout);
            const isChecked = await this.locator.isChecked();
            
            log.INFO(`Checking checkbox: ${this.selector}, currently checked: ${isChecked}`);
            
            if (!isChecked) {
                await this.locator.check({ timeout });
                log.INFO(`Successfully checked checkbox: ${this.selector}`);
            } else {
                log.INFO(`Checkbox already checked: ${this.selector}`);
            }
        } catch (error) {
            log.ERROR(`Failed to check checkbox: ${this.selector}`, { error });
            throw error;
        }
    }

    public async uncheck(timeout = this.DEFAULT_TIMEOUT): Promise<void> {
        try {
            await this.findControl(timeout);
            const isChecked = await this.locator.isChecked();
            
            log.INFO(`Unchecking checkbox: ${this.selector}, currently checked: ${isChecked}`);
            
            if (isChecked) {
                await this.locator.uncheck({ timeout });
                log.INFO(`Successfully unchecked checkbox: ${this.selector}`);
            } else {
                log.INFO(`Checkbox already unchecked: ${this.selector}`);
            }
        } catch (error) {
            log.ERROR(`Failed to uncheck checkbox: ${this.selector}`, { error });
            throw error;
        }
    }

    public async actionCheckBox(action: string, timeout = this.DEFAULT_TIMEOUT): Promise<void> {
        const normalizedAction = action.toLowerCase();
        
        log.INFO(`Performing checkbox action: ${action} on ${this.selector}`);
        
        try {
            switch (normalizedAction) {
                case 'check':
                    await this.check(timeout);
                    break;
                case 'uncheck':
                    await this.uncheck(timeout);
                    break;
                default:
                    const error = `Unsupported checkbox action: ${action}. Please use 'check' or 'uncheck'`;
                    log.ERROR(error);
                    throw new Error(error);
            }
        } catch (error) {
            log.ERROR(`Failed to perform checkbox action: ${action}`, { error });
            throw error;
        }
    }

    public async checkUncheckWithDialog(action: string, timeout = this.DEFAULT_TIMEOUT): Promise<void> {
        const normalizedAction = action.toLowerCase();
        
        log.INFO(`Performing checkbox action with dialog: ${action} on ${this.selector}`);
        
        try {
            const isChecked = await this.locator.isChecked();
            
            switch (normalizedAction) {
                case 'check':
                    if (!isChecked) {
                        // Handle dialog
                        const dialogPromise = this.page.waitForEvent('dialog');
                        await this.click({ timeout });
                        const dialog = await dialogPromise;
                        await dialog.accept();
                        log.INFO(`Accepted dialog and checked checkbox: ${this.selector}`);
                    }
                    break;
                    
                case 'uncheck':
                    if (isChecked) {
                        // Handle dialog
                        const dialogPromise = this.page.waitForEvent('dialog');
                        await this.click({ timeout });
                        const dialog = await dialogPromise;
                        await dialog.accept();
                        log.INFO(`Accepted dialog and unchecked checkbox: ${this.selector}`);
                    }
                    break;
                    
                default:
                    const error = `Unsupported checkbox action: ${action}. Please use 'check' or 'uncheck'`;
                    log.ERROR(error);
                    throw new Error(error);
            }
        } catch (error) {
            log.ERROR(`Failed to perform checkbox action with dialog: ${action}`, { error });
            throw error;
        }
    }

    public async isChecked(timeout = this.DEFAULT_TIMEOUT): Promise<boolean> {
        try {
            await this.findControl(timeout);
            const isChecked = await this.locator.isChecked({ timeout });
            log.INFO(`Checkbox checked state: ${this.selector}, value: ${isChecked}`);
            return isChecked;
        } catch (error) {
            log.ERROR(`Failed to get checkbox state: ${this.selector}`, { error });
            throw error;
        }
    }
}