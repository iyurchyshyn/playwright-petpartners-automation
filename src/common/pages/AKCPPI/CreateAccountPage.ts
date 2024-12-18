import { Page } from 'playwright';
import { log } from '@utils/logger';
import { Button, TextBox, Label } from '../../control';

export class CreateAccountPage {
    DEFAULT_TIMEOUT = 60 * 1000;
    LONG_TIMEOUT = 120 * 1000;

    // Labels
    createAccountLabel: Label;

    // Inputs
    emailInput: TextBox;
    passwordInput: TextBox;
    confirmPasswordInput: TextBox;

    // Buttons
    createAccountButton: Button;

    constructor(page: Page) {
        // Initialize Labels
        this.createAccountLabel = new Label(page, "h2:text('Create Account')");

        // Initialize Inputs
        this.emailInput = new TextBox(page, "input[name='emailInputControl']");
        this.passwordInput = new TextBox(page, "input[placeholder='Password']");
        this.confirmPasswordInput = new TextBox(page, "#confirmRegisterPassword");

        // Initialize Buttons
        this.createAccountButton = new Button(page, "button:has-text('Create Account')");

        log.INFO('Initialized CreateAccountPage');
    }

    async createNewAccount(user: string, password: string, confirmPassword: string): Promise<void> {
        log.INFO('Creating new account', { user });

        try {
            await this.emailInput.setText(user);
            await this.passwordInput.setText(password);
            await this.confirmPasswordInput.setText(confirmPassword);

            await this.createAccountButton.click();
            await this.createAccountButton.isNotDisplayed(this.LONG_TIMEOUT);

            log.INFO('Successfully created account');
        } catch (error) {
            log.ERROR('Error creating account', { error });
            throw error;
        }
    }
}