import { Page, Locator } from 'playwright';
import { ControlBase } from './ControlBase';
import { log } from '../utils/logger';

export class DatePickerGrid extends ControlBase {
    private static readonly DEFAULT_TIMEOUT = 60 * 1000;  // 60 seconds
    private static readonly LONG_TIMEOUT = 120 * 1000;    // 120 seconds
    private static readonly SHORT_TIMEOUT = 30 * 1000;    // 30 seconds

    private readonly monthSelect: Locator;
    private readonly yearSelect: Locator;
    private readonly previousButton: Locator;
    private readonly nextButton: Locator;

    constructor(page: Page, selector: string) {
        super(page, selector);
        
        // Initialize locators
        this.monthSelect = page.locator("select.ui-datepicker-month");
        this.yearSelect = page.locator("select.ui-datepicker-year");
        this.previousButton = page.locator("span:text('Prev')");
        this.nextButton = page.locator("span:text('Next')");
    }

    async selectDate(month: string, year: string, day: string): Promise<void> {
        try {
            log.INFO(`Selecting date: ${month}/${day}/${year} on ${this.selector}`);
            
            // Click the datepicker to open
            await this.click({ timeout: DatePickerGrid.DEFAULT_TIMEOUT });
            
            // Select month and year with longer timeout
            await this.monthSelect.selectOption(month, { timeout: DatePickerGrid.LONG_TIMEOUT });
            await this.yearSelect.selectOption(year, { timeout: DatePickerGrid.LONG_TIMEOUT });
            await this.yearSelect.click({ timeout: DatePickerGrid.SHORT_TIMEOUT });
            
            // Click the day with default timeout
            const dayButton = this.page.locator(`a:text("${day}"), div:text("${day}")`);
            await dayButton.click({ timeout: DatePickerGrid.DEFAULT_TIMEOUT });
            
            log.INFO(`Successfully selected date: ${month}/${day}/${year}`);
        } catch (error) {
            log.ERROR(`Failed to select date: ${month}/${day}/${year}`, { error });
            throw error;
        }
    }

    async clickDayButton(day: string): Promise<void> {
        try {
            const dayButton = this.page.locator(`div:text("${day}")`);
            await dayButton.click({ timeout: DatePickerGrid.DEFAULT_TIMEOUT });
            log.INFO(`Clicked day button: ${day}`);
        } catch (error) {
            log.ERROR(`Failed to click day button: ${day}`, { error });
            throw error;
        }
    }
}