import { Page } from 'playwright';

export abstract class BasePage {
  constructor(protected page: Page) {}

  protected async click(selector: string, timeout = 60 * 1000): Promise<void> {
    await this.page.click(selector, { timeout });
  }

  protected async fill(selector: string, value: string, timeout = 60 * 1000): Promise<void> {
    await this.page.fill(selector, value, { timeout });
  }

  protected async waitForElement(selector: string, timeout = 60 * 1000): Promise<void> {
    await this.page.waitForSelector(selector, { timeout });
  }

  protected async getText(selector: string, timeout = 60 * 1000): Promise<string> {
    return await this.page.innerText(selector, { timeout });
  }

  protected async isVisible(selector: string, timeout = 60 * 1000): Promise<boolean> {
    return await this.page.isVisible(selector, { timeout });
  }
  async scrollIntoView(selector: string, timeout = 60 * 1000): Promise<void> {

    await this.page.locator(selector).scrollIntoViewIfNeeded({ timeout });

  }
}