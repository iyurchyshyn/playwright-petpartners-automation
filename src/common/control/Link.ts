import { Page } from 'playwright';
import { ControlBase } from './ControlBase';
import { log } from '../utils/logger';

export class Link extends ControlBase {
    private static readonly DEFAULT_TIMEOUT = 60 * 1000;
    private static readonly LONG_TIMEOUT = 120 * 1000;

    constructor(page: Page, selector: string) {
        super(page, selector);
    }
}