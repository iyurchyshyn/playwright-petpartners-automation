import { Page, FrameLocator } from 'playwright';
import { ControlBase } from './ControlBase';
import { log } from '../utils/logger';

export class iFrame extends ControlBase {
    constructor(page: Page, selector: string) {
        super(page, selector);
    }

    public async getFrame(): Promise<FrameLocator> {
        try {
            await this.findControl(this.DEFAULT_TIMEOUT);
            const frameLocator = this.page.frameLocator(this.selector);
            log.INFO(`Successfully located iframe with selector: ${this.selector}`);
            return frameLocator;
        } catch (error) {
            log.ERROR(`Failed to get iframe with selector: ${this.selector}`, { error });
            throw error;
        }
    }

    public async fillInFrame(control: ControlBase, value: string, timeout = this.DEFAULT_TIMEOUT): Promise<void> {
        try {
            const frame = await this.getFrame();
            await frame.locator(control.getLocator()).fill(value, { timeout });
            log.INFO(`Successfully filled value in element within iframe`);
        } catch (error) {
            log.ERROR(`Failed to fill value in element within iframe`, { error });
            throw error;
        }
    }

    public async isElementVisibleInFrame(control: ControlBase, timeout = this.SHORT_TIMEOUT): Promise<boolean> {
        try {
            const frame = await this.getFrame();
            return await frame.locator(control.getLocator()).isVisible({ timeout });
        } catch (error) {
            log.ERROR(`Failed to check element visibility in iframe`, { error });
            return false;
        }
    }

    public async clickInFrame(control: ControlBase, timeout = this.DEFAULT_TIMEOUT): Promise<void> {
        try {
            const frame = await this.getFrame();
            await frame.locator(control.getLocator()).click({ timeout });
            log.INFO(`Successfully clicked element in iframe`);
        } catch (error) {
            log.ERROR(`Failed to click element in iframe`, { error });
            throw error;
        }
    }
}