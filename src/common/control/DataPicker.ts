import { Page, Locator } from 'playwright';
import { ControlBase } from './ControlBase';
import { log } from '../utils/logger';

export class DatePicker extends ControlBase {
    // Class-level timeout constants
    private static readonly DEFAULT_TIMEOUT = 60 * 1000;  // 60 seconds
    private static readonly LONG_TIMEOUT = 120 * 1000;    // 120 seconds
    private static readonly SHORT_TIMEOUT = 30 * 1000;    // 30 seconds
    
    private readonly monthSelect: Locator;
    private readonly yearSelect: Locator;
    private readonly prevButton: Locator;
    private readonly nextButton: Locator;
    private readonly dateLocator?: string;

    constructor(page: Page, selector: string, options?: {
        monthSelector?: string;
        yearSelector?: string;
        dateLocator?: string;
    }) {
        super(page, selector);
        
        this.monthSelect = page.locator(options?.monthSelector || 'select.ui-datepicker-month');
        this.yearSelect = page.locator(options?.yearSelector || 'select.ui-datepicker-year');
        this.prevButton = page.locator("span:text('Prev')");
        this.nextButton = page.locator("span:text('Next')");
        this.dateLocator = options?.dateLocator;
    }

    async selectDate(month: string, year: string, day: string): Promise<void> {
        try {
            log.INFO(`Selecting date: ${month}/${day}/${year} on ${this.selector}`);
            
            // Initial click with default timeout
            await this.click({ timeout: DatePicker.DEFAULT_TIMEOUT });
            
            // Select month and year with long timeout as they might need loading
            await this.monthSelect.selectOption(month, { timeout: DatePicker.LONG_TIMEOUT });
            await this.yearSelect.selectOption(year, { timeout: DatePicker.LONG_TIMEOUT });
            
            // Click the day with default timeout
            const daySelector = this.dateLocator ? 
                this.page.locator(this.dateLocator.replace('{0}', day)) :
                this.page.locator(`a.ui-state-default:text("${day}")`);
                
            await daySelector.click({ timeout: DatePicker.DEFAULT_TIMEOUT });
            
            log.INFO(`Successfully selected date: ${month}/${day}/${year}`);
        } catch (error) {
            log.ERROR(`Failed to select date: ${month}/${day}/${year}`, { error });
            throw error;
        }
    }

    async navigateMonth(direction: 'next' | 'previous'): Promise<void> {
        try {
            const button = direction === 'next' ? this.nextButton : this.prevButton;
            // Use short timeout for navigation as it should be immediate
            await button.click({ timeout: DatePicker.SHORT_TIMEOUT });
            log.INFO(`Navigated ${direction} in calendar`);
        } catch (error) {
            log.ERROR(`Failed to navigate ${direction} in calendar`, { error });
            throw error;
        }
    }

    async selectToday(): Promise<void> {
        try {
            const today = new Date();
            await this.selectDate(
                String(today.getMonth()),
                String(today.getFullYear()),
                String(today.getDate())
            );
            log.INFO('Selected today\'s date');
        } catch (error) {
            log.ERROR('Failed to select today\'s date', { error });
            throw error;
        }
    }
}