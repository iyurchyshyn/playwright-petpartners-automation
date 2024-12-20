import { Page } from 'playwright';
import { BasePage } from '../basePage';
import { log } from '../../utils/logger';

export class CreateAccountPage extends BasePage {
  private readonly DEFAULT_TIMEOUT = 60 * 1000;
  private readonly LONG_TIMEOUT = 120 * 1000;

  private readonly selectors = {
    email: "input[name='emailInputControl']",
    password: "input[placeholder='Password']",
    confirmPassword: "#confirmRegisterPassword",
    createAccount: "button:has-text('Create Account')",
    createAccountHeader: "h2:has-text('Create Account')"
  };

  constructor(page: Page) {
    super(page);
    log.INFO('Initializing CreateAccountPage');
  }

  async createNewAccount(user: string, password: string, confirmPassword: string): Promise<void> {
    log.INFO('Creating new account', { user });
    
    try {
      await this.fill(this.selectors.email, user);
      await this.fill(this.selectors.password, password);
      await this.fill(this.selectors.confirmPassword, confirmPassword);
      
      await this.click(this.selectors.createAccount);
      
      // Wait for navigation/completion
      await this.page.waitForSelector(this.selectors.createAccount, { 
        state: 'hidden',
        timeout: this.DEFAULT_TIMEOUT 
      });
      
      log.INFO('Successfully created account');
    } catch (error) {
      log.ERROR('Error creating account', { error });
      throw error;
    }
  }
}