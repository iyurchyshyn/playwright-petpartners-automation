import { Page, Frame } from 'playwright';
import { ControlBase } from './ControlBase';
import { log } from '../utils/logger';

export class FrameHandler extends ControlBase {
    constructor(page: Page, selector: string) {
        super(page, selector);
    }
}