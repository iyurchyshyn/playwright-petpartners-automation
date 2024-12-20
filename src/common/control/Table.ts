import { Page, Locator } from 'playwright';
import { ControlBase } from './ControlBase';
import { TextBox } from './TextBox';
import { Select } from './Select';
import { log } from '../utils/logger';

export class Table extends ControlBase {
    private static readonly DEFAULT_TIMEOUT = 60 * 1000;   // 60 seconds
    private static readonly LONG_TIMEOUT = 120 * 1000;     // 120 seconds
    private static readonly SHORT_TIMEOUT = 30 * 1000;     // 30 seconds

    private static readonly TAGS = {
        TR: 'tr',
        TD: 'td',
        TH: 'th',
        THEAD: 'thead',
        TBODY: 'tbody'
    };

    constructor(page: Page, selector: string) {
        super(page, selector);
    }

    async getPositionColumn(columnName: string): Promise<number> {
        try {
            await this.findControl(Table.DEFAULT_TIMEOUT);
            const headerCells = await this.locator
                .locator(`${Table.TAGS.THEAD} ${Table.TAGS.TR} ${Table.TAGS.TH}`)
                .all();

            for (let i = 0; i < headerCells.length; i++) {
                const cellText = await headerCells[i].textContent();
                if (cellText?.trim() === columnName) {
                    log.INFO(`Found column "${columnName}" at position ${i + 1}`);
                    return i + 1;
                }
            }
            throw new Error(`Column "${columnName}" not found`);
        } catch (error) {
            log.ERROR(`Failed to get position for column: ${columnName}`, { error });
            throw error;
        }
    }

    async getPositionRow(value: string): Promise<number> {
        try {
            await this.findControl(Table.DEFAULT_TIMEOUT);
            const rows = await this.locator
                .locator(`${Table.TAGS.TBODY} ${Table.TAGS.TR}`)
                .all();

            for (let i = 0; i < rows.length; i++) {
                const cellsText = await rows[i]
                    .locator(Table.TAGS.TD)
                    .allTextContents();
                
                if (cellsText.some(text => text.includes(value))) {
                    log.INFO(`Found value "${value}" at row ${i + 1}`);
                    return i + 1;
                }
            }
            throw new Error(`Value "${value}" not found in any row`);
        } catch (error) {
            log.ERROR(`Failed to get position for row with value: ${value}`, { error });
            throw error;
        }
    }

    async setTextInCell(column: number | string, row: number, value: string): Promise<void> {
        try {
            const columnIndex = typeof column === 'string' ? 
                await this.getPositionColumn(column) : column;

            const cellSelector = `${Table.TAGS.TBODY} ${Table.TAGS.TR}:nth-child(${row}) ${Table.TAGS.TD}:nth-child(${columnIndex}) input`;
            const textbox = new TextBox(this.page, cellSelector);
            await textbox.clearAndSetText(value);
            
            log.INFO(`Set text "${value}" in cell at row ${row}, column ${columnIndex}`);
        } catch (error) {
            log.ERROR(`Failed to set text in cell`, { error, column, row, value });
            throw error;
        }
    }

    async selectInCell(column: number, row: number, value: string): Promise<void> {
        try {
            const cellSelector = `${Table.TAGS.TBODY} ${Table.TAGS.TR}:nth-child(${row}) ${Table.TAGS.TD}:nth-child(${column}) select`;
            const select = new Select(this.page, cellSelector);
            await select.selectValue(value);
            
            log.INFO(`Selected "${value}" in cell at row ${row}, column ${column}`);
        } catch (error) {
            log.ERROR(`Failed to select in cell`, { error, column, row, value });
            throw error;
        }
    }

    async getAllHeaderLabels(): Promise<string[]> {
        try {
            await this.findControl(Table.DEFAULT_TIMEOUT);
            const headers = await this.locator
                .locator(`${Table.TAGS.THEAD} ${Table.TAGS.TR} ${Table.TAGS.TH}`)
                .allTextContents();
            
            log.INFO(`Retrieved all header labels: ${headers.join(', ')}`);
            return headers;
        } catch (error) {
            log.ERROR('Failed to get header labels', { error });
            throw error;
        }
    }

    async getEntireColumn(columnName: string): Promise<string[]> {
        try {
            const columnIndex = await this.getPositionColumn(columnName);
            const cells = await this.locator
                .locator(`${Table.TAGS.TBODY} ${Table.TAGS.TR} ${Table.TAGS.TD}:nth-child(${columnIndex})`)
                .allTextContents();
            
            log.INFO(`Retrieved entire column "${columnName}": ${cells.length} cells`);
            return cells;
        } catch (error) {
            log.ERROR(`Failed to get entire column: ${columnName}`, { error });
            throw error;
        }
    }

    async clickLinkInCell(column: number, row: number): Promise<void> {
        try {
            const linkLocator = this.locator
                .locator(`${Table.TAGS.TBODY} ${Table.TAGS.TR}:nth-child(${row}) ${Table.TAGS.TD}:nth-child(${column}) a`);
            
            await linkLocator.scrollIntoViewIfNeeded();
            await linkLocator.click({ timeout: Table.DEFAULT_TIMEOUT });
            
            log.INFO(`Clicked link in cell at row ${row}, column ${column}`);
        } catch (error) {
            log.ERROR(`Failed to click link in cell`, { error, column, row });
            throw error;
        }
    }

    async clickButtonInCell(column: number, row: number): Promise<void> {
        try {
            const buttonLocator = this.locator
                .locator(`${Table.TAGS.TBODY} ${Table.TAGS.TR}:nth-child(${row}) ${Table.TAGS.TD}:nth-child(${column}) button`);
            
            await buttonLocator.click({ timeout: Table.DEFAULT_TIMEOUT });
            
            log.INFO(`Clicked button in cell at row ${row}, column ${column}`);
        } catch (error) {
            log.ERROR(`Failed to click button in cell`, { error, column, row });
            throw error;
        }
    }

    async getTableData(): Promise<string[][]> {
        try {
            await this.findControl(Table.DEFAULT_TIMEOUT);
            const rows = await this.locator
                .locator(`${Table.TAGS.TBODY} ${Table.TAGS.TR}`)
                .all();

            const tableData: string[][] = [];
            for (const row of rows) {
                const cellsText = await row
                    .locator(Table.TAGS.TD)
                    .allTextContents();
                tableData.push(cellsText);
            }

            log.INFO(`Retrieved table data: ${tableData.length} rows`);
            return tableData;
        } catch (error) {
            log.ERROR('Failed to get table data', { error });
            throw error;
        }
    }

    async verifyValueInTable(value: string): Promise<boolean> {
        try {
            const tableData = await this.getTableData();
            const found = tableData.some(row => 
                row.some(cell => cell.includes(value))
            );
            
            log.INFO(`Value "${value}" ${found ? 'found' : 'not found'} in table`);
            return found;
        } catch (error) {
            log.ERROR(`Failed to verify value in table: ${value}`, { error });
            throw error;
        }
    }

    async getRowCount(): Promise<number> {
        try {
            const rows = await this.locator
                .locator(`${Table.TAGS.TBODY} ${Table.TAGS.TR}`)
                .all();
            
            log.INFO(`Table row count: ${rows.length}`);
            return rows.length;
        } catch (error) {
            log.ERROR('Failed to get row count', { error });
            throw error;
        }
    }

    async getCellValue(column: number, row: number): Promise<string> {
        try {
            const cellLocator = this.locator
                .locator(`${Table.TAGS.TBODY} ${Table.TAGS.TR}:nth-child(${row}) ${Table.TAGS.TD}:nth-child(${column})`);
            
            const text = await cellLocator.textContent();
            log.INFO(`Got cell value at row ${row}, column ${column}: ${text}`);
            return text || '';
        } catch (error) {
            log.ERROR(`Failed to get cell value`, { error, column, row });
            throw error;
        }
    }

    async clickCellWithText(text: string): Promise<void> {
        try {
            const cellLocator = this.locator
                .locator(`${Table.TAGS.TBODY} ${Table.TAGS.TD}`)
                .filter({ hasText: text });

            await cellLocator.click({ timeout: Table.DEFAULT_TIMEOUT });
            log.INFO(`Clicked cell with text: ${text}`);
        } catch (error) {
            log.ERROR(`Failed to click cell with text: ${text}`, { error });
            throw error;
        }
    }
}