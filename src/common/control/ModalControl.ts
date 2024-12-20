import { Page, Locator } from 'playwright';
import { ControlBase } from './ControlBase';
import { log } from '../utils/logger';

export class Modal extends ControlBase {
    private static readonly DEFAULT_TIMEOUT = 60 * 1000;
    private static readonly LONG_TIMEOUT = 120 * 1000;
    private static readonly SHORT_TIMEOUT = 30 * 1000;

    private titleLabel?: Locator;
    private bodyMessage?: Locator;
    private saveButton?: Locator;
    private closeButton?: Locator;
    private deleteButton?: Locator;
    private cancelButton?: Locator;
    private okButton?: Locator;

    constructor(page: Page, selector: string) {
        super(page, selector);
        log.INFO(`Initializing Modal: ${this.selector}`);
    }
        // Actions
        async getTitle(): Promise<string> {
            try {
                if (!this.titleLabel) throw new Error('Title label not initialized');
                return await this.titleLabel.innerText({ timeout: Modal.DEFAULT_TIMEOUT });
            } catch (error) {
                log.ERROR('Failed to get modal title', { error });
                throw error;
            }
        }
    
        async getBodyText(): Promise<string> {
            try {
                if (!this.bodyMessage) throw new Error('Body message not initialized');
                return await this.bodyMessage.innerText({ timeout: Modal.DEFAULT_TIMEOUT });
            } catch (error) {
                log.ERROR('Failed to get modal body text', { error });
                throw error;
            }
        }
    
        async clickSave(): Promise<void> {
            try {
                if (!this.saveButton) throw new Error('Save button not initialized');
                await this.saveButton.click({ timeout: Modal.DEFAULT_TIMEOUT });
                log.INFO('Clicked save button');
            } catch (error) {
                log.ERROR('Failed to click save button', { error });
                throw error;
            }
        }
    
        async clickClose(): Promise<void> {
            try {
                if (!this.closeButton) throw new Error('Close button not initialized');
                await this.closeButton.click({ timeout: Modal.DEFAULT_TIMEOUT });
                log.INFO('Clicked close button');
            } catch (error) {
                log.ERROR('Failed to click close button', { error });
                throw error;
            }
        }
    
        async clickDelete(): Promise<void> {
            try {
                if (!this.deleteButton) throw new Error('Delete button not initialized');
                await this.deleteButton.click({ timeout: Modal.DEFAULT_TIMEOUT });
                log.INFO('Clicked delete button');
            } catch (error) {
                log.ERROR('Failed to click delete button', { error });
                throw error;
            }
        }
    
        async clickCancel(): Promise<void> {
            try {
                if (!this.cancelButton) throw new Error('Cancel button not initialized');
                await this.cancelButton.click({ timeout: Modal.DEFAULT_TIMEOUT });
                log.INFO('Clicked cancel button');
            } catch (error) {
                log.ERROR('Failed to click cancel button', { error });
                throw error;
            }
        }
    
        async clickOK(): Promise<void> {
            try {
                if (!this.okButton) throw new Error('OK button not initialized');
                await this.okButton.click({ timeout: Modal.DEFAULT_TIMEOUT });
                log.INFO('Clicked OK button');
            } catch (error) {
                log.ERROR('Failed to click OK button', { error });
                throw error;
            }
        }
    
        async waitForModalToClose(): Promise<void> {
            try {
                await this.locator.waitFor({ 
                    state: 'hidden', 
                    timeout: Modal.LONG_TIMEOUT 
                });
                log.INFO('Modal closed successfully');
            } catch (error) {
                log.ERROR('Modal did not close', { error });
                throw error;
            }
        }

    // Fluent setters
    setTitleLabel(selector: string): Modal {
        this.titleLabel = this.page.locator(selector);
        return this;
    }

    setBodyMessage(selector: string): Modal {
        this.bodyMessage = this.page.locator(selector);
        return this;
    }

    setSaveButton(selector: string): Modal {
        this.saveButton = this.page.locator(selector);
        return this;
    }

    setCloseButton(selector: string): Modal {
        this.closeButton = this.page.locator(selector);
        return this;
    }

    setDeleteButton(selector: string): Modal {
        this.deleteButton = this.page.locator(selector);
        return this;
    }

    setCancelButton(selector: string): Modal {
        this.cancelButton = this.page.locator(selector);
        return this;
    }

    setOKButton(selector: string): Modal {
        this.okButton = this.page.locator(selector);
        return this;
    }
}