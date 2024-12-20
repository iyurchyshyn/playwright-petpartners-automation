import { Page } from 'playwright';
import { ControlBase } from './ControlBase';

export class Button extends ControlBase {
    constructor(page: Page, selector: string) {
        super(page, selector);  // Calls the ControlBase constructor
    }
}