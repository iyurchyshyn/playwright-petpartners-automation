import { BasePage } from './basePage';
import { expect, Page } from '@playwright/test';

export class EnrollPage extends BasePage {
  // Quote Form Selectors
  private readonly nameInput = '#name';
  private readonly postalCodeInput = '#postalCode';
  private readonly dogRadio = 'span[for="dog"]';
  private readonly catRadio = 'span[for="cat"]';
  private readonly breedSearchInput = '#breedSearch';
  private readonly breedOption = (breed: string) => `p.typeahead__item:text("${breed}")`;
  private readonly ageSelect = '#age';
  private readonly emailInput = '#email';
  private readonly submitButton = '#submit';
  
  // Coverage Page Selectors
  private readonly addToCartButton = 'span:text("Add to Cart")';
  
  // Customer Information Selectors
  private readonly customerFirstName = 'input#customer-firstName';
  private readonly customerLastName = 'input#customer-lastName';
  private readonly customerAddress1 = 'input#customer-address-address1';
  private readonly customerAddress2 = 'input#customer-address-address2';
  private readonly customerPhone = 'input#customer-phoneNumber';
  private readonly paymentIframe = 'iframe[title="Secure payment input frame"]';
  private readonly cardNumberInput = 'input#Field-numberInput';
  private readonly cardExpiryInput = 'input#Field-expiryInput';
  private readonly cardCvcInput = 'input#Field-cvcInput';
  private readonly consentCheckbox = 'input[name="e-consent"]';
  private readonly enrollNowButton = 'span:text("Enroll now")';
  private readonly successMessage = 'h1:text("Congratulations on your enrollment!")';

  constructor(page: Page) {
    super(page);
  }

  async navigateToEnroll(): Promise<void> {
    const baseUrl = process.env.BASE_URL || '';
    console.log('Using Base URL:', baseUrl);
    await this.page.goto(`${baseUrl}/enroll`);
  }

  async fillEnrollmentForm(data: {
    petName: string;
    zipCode: string;
    petType: 'dog' | 'cat';
    petBreed: string;
    petAge: string;
    email: string;
  }): Promise<void> {
    await this.fill(this.nameInput, data.petName);
    await this.fill(this.postalCodeInput, data.zipCode);
    await this.selectPetType(data.petType);
    await this.selectBreed(data.petBreed);
    await this.page.selectOption(this.ageSelect, data.petAge);
    await this.fill(this.emailInput, data.email);
    await this.click(this.submitButton);
    await this.waitForElement(this.addToCartButton);
  }

  private async selectPetType(type: 'dog' | 'cat'): Promise<void> {
    const selector = type === 'dog' ? this.dogRadio : this.catRadio;
    await this.waitForElement(selector);
    await this.click(selector);
  }

  private async selectBreed(breed: string): Promise<void> {
    await this.fill(this.breedSearchInput, breed);
    await this.click(this.breedOption(breed));
  }

  async clickAddToCart(): Promise<void> {
    await this.scrollIntoView(this.addToCartButton);
    await this.click(this.addToCartButton);
  }

  async fillCustomerInformation(data: {
    firstName: string;
    lastName: string;
    address: string;
    apt: string;
    phoneNumber: string;
    cardNumber: string;
    expiresMMYY: string;
    expiresCVC: string;
  }): Promise<void> {
    await this.waitForElement(this.customerFirstName);
    
    // Fill customer details
    await this.fill(this.customerFirstName, data.firstName);
    await this.fill(this.customerLastName, data.lastName);
    await this.fill(this.customerAddress1, data.address);
    await this.fill(this.customerAddress2, data.apt);
    await this.fill(this.customerPhone, data.phoneNumber);

    // Handle payment iframe
    await this.fillPaymentDetails(data);

    // Complete enrollment
    await this.click(this.consentCheckbox);
    await this.click(this.enrollNowButton);
    await this.waitForElement(this.successMessage);
    
  }

  private async fillPaymentDetails(data: {
    cardNumber: string;
    expiresMMYY: string;
    expiresCVC: string;
  }): Promise<void> {
    const paymentFrame = await this.page.frameLocator(this.paymentIframe).first();
    await paymentFrame.locator(this.cardNumberInput).fill(data.cardNumber);
    await paymentFrame.locator(this.cardExpiryInput).fill(data.expiresMMYY);
    await paymentFrame.locator(this.cardCvcInput).fill(data.expiresCVC);
  }

  async verifySuccessMessage(message: string): Promise<void> {
    await this.waitForElement(`h1:text("${message}")`);
    await this.isVisible(this.successMessage);
    expect(await this.getText(this.successMessage)).toEqual(message);
  }
}