import { Page } from 'playwright';
import { log } from '@utils/logger';
import { CompleteEnrollmentEntity } from '@entities/AKC&PPI/CompleteEnrollmentEntity';
import { Button, TextBox, Select, RadioButton, Label, Link } from '../../control';
import { iFrame } from '../../control/iFrame';

export class CompleteYourEnrollmentPage {
    DEFAULT_TIMEOUT = 60 * 1000;  // 60 seconds
    LONG_TIMEOUT = 120 * 1000;    // 120 seconds
    SHORT_TIMEOUT = 30 * 1000;    // 30 seconds

    // Labels
    completeYourEnrollmentLabel: Label;
    policyOverviewCostLabel: Label;
    cartIsEmptyLabel: Label;

    // Inputs - Customer Info
    firstNameInput: TextBox;
    lastNameInput: TextBox;
    addressInput: TextBox;
    aptSuiteEtcInput: TextBox;
    cityInput: TextBox;
    stateSelect: Select;
    zipCodeInput: TextBox;
    phoneNumberInput: TextBox;
    emailAddressInput: TextBox;
    groupCodeInput: TextBox;

    // Inputs - Card Info
    cardNumberInput: TextBox;
    expiresMMYYInput: TextBox;
    cvcInput: TextBox;
    countrySelect: Select;
    zipCodeSelect: TextBox;
    stripeiFrame: iFrame;

    // Buttons
    applyButton: Button;
    enrollNowButton: Button;
    addAnotherPetSaveButton: Button;
    removePlanYesButton: Button;
    removePlanNoButton: Button;
    showTermDeductibleButton: Button;
    showTermCoinsuranceButton: Button;
    showTermIncidentButton: Button;
    showTermAnnualButton: Button;

    // Radio Buttons
    iAgreeToGoPaperlessOption: RadioButton;
    iAgreeThatByCheckingOption: RadioButton;
    byCheckingBoxOption: RadioButton;

    // Links
    useDifferentBillingAddressLink: Link;
    editPlanDetailsLink: Link;
    removePlanLink: Link;
    showTermDetailsLink: Link;

    // Different Billing Inputs
    differentAddressInput: TextBox;
    differentFirstNameInput: TextBox;
    differentLastNameInput: TextBox;
    differentCityInput: TextBox;

    constructor(private readonly page: Page) {
        // Initialize Labels
        this.completeYourEnrollmentLabel = new Label(page, "h1:text('Complete your enrollment')");
        this.policyOverviewCostLabel = new Label(page, "div.pet-overview >> span");
        this.cartIsEmptyLabel = new Label(page, ".heading:text('Your cart is empty!')");

        // Initialize Customer Info Inputs
        this.firstNameInput = new TextBox(page, "#customer-firstName");
        this.lastNameInput = new TextBox(page, "#customer-lastName");
        this.addressInput = new TextBox(page, "#customer-address-address1");
        this.aptSuiteEtcInput = new TextBox(page, "#customer-address-address2");
        this.cityInput = new TextBox(page, "#customer-address-city");
        this.stateSelect = new Select(page, "#customer-address-stateProvId");
        this.zipCodeInput = new TextBox(page, "#customer-address-zipCode");
        this.phoneNumberInput = new TextBox(page, "#customer-phoneNumber");
        this.emailAddressInput = new TextBox(page, "#customer-emailAddress");
        this.groupCodeInput = new TextBox(page, "#affinity-group-code");
        this.stripeiFrame = new iFrame(page, '#payment-element iframe >> nth=0');

        // Initialize Card Info Inputs
        this.cardNumberInput = new TextBox(page, "#Field-numberInput");
        this.expiresMMYYInput = new TextBox(page, "#Field-expiryInput");
        this.cvcInput = new TextBox(page, "#Field-cvcInput");
        this.countrySelect = new Select(page, "#Field-countryInput");
        this.zipCodeSelect = new TextBox(page, "#Field-postalCodeInput");

        // Initialize Buttons
        this.applyButton = new Button(page, "span:text('Apply')");
        this.enrollNowButton = new Button(page, "#enroll");
        this.addAnotherPetSaveButton = new Button(page, "button:text('Add Another Pet')");
        this.removePlanYesButton = new Button(page, "button:text('Yes')");
        this.removePlanNoButton = new Button(page, "button:text('No')");
        this.showTermDeductibleButton = new Button(page, "li:has-text('Deductible')");
        this.showTermCoinsuranceButton = new Button(page, "li:has-text('Coinsurance')");
        this.showTermIncidentButton = new Button(page, "li:has-text('Incident')");
        this.showTermAnnualButton = new Button(page, "li:has-text('Annual')");

        // Initialize Radio Buttons
        this.iAgreeToGoPaperlessOption = new RadioButton(page, "input[name='electronic-delivery']");
        this.iAgreeThatByCheckingOption = new RadioButton(page, "input[name='e-consent']");
        this.byCheckingBoxOption = new RadioButton(page, "input[name='fee-disclosure']");

        // Initialize Links
        this.useDifferentBillingAddressLink = new Link(page, "label:has-text('Use a different billing Address')");
        this.editPlanDetailsLink = new Link(page, "button:has-text('Edit plan details')");
        this.removePlanLink = new Link(page, "button:has-text('Remove Plan')");
        this.showTermDetailsLink = new Link(page, "button:has-text('Term Details')");

        // Initialize Different Billing Inputs
        this.differentAddressInput = new TextBox(page, "#Field-addressLine1Input");
        this.differentFirstNameInput = new TextBox(page, "#Field-firstNameInput");
        this.differentLastNameInput = new TextBox(page, "#Field-lastNameInput");
        this.differentCityInput = new TextBox(page, "#Field-localityInput");

        log.INFO('Initialized CompleteYourEnrollmentPage');
    }

    async fillCompleteYourEnrollment(data: CompleteEnrollmentEntity, waitEnrollButtonDisappears = true): Promise<void> {
        try {
            log.INFO('Filling enrollment form', { data });

            // Fill main form fields
            if (data.firstName) await this.firstNameInput.clearAndSetText(data.firstName);
            if (data.lastName) await this.lastNameInput.clearAndSetText(data.lastName);
            if (data.address) await this.addressInput.clearAndSetText(data.address);
            if (data.aptSuiteEtc) await this.aptSuiteEtcInput.clearAndSetText(data.aptSuiteEtc);
            if (data.city) await this.cityInput.setText(data.city);
            if (data.state) await this.stateSelect.selectValue(data.state);
            if (data.zipCode) await this.zipCodeInput.setText(data.zipCode);
            if (data.phoneNumber) await this.phoneNumberInput.clearAndSetText(data.phoneNumber);
            if (data.emailAddress) await this.emailAddressInput.setText(data.emailAddress);

            // Handle Stripe iframe fields
            if (data.cardNumber && data.expiresMMYY && data.expiresCVC) {
                try {
                    await this.stripeiFrame.fillInFrame(this.cardNumberInput, data.cardNumber);
                    await this.stripeiFrame.fillInFrame(this.expiresMMYYInput, data.expiresMMYY);
                    await this.stripeiFrame.fillInFrame(this.cvcInput, data.expiresCVC);
                    log.INFO('Successfully filled Stripe card information');
                } catch (error) {
                    log.ERROR('Failed to fill Stripe card information', { error });
                    throw error;
                }
            }
            // Handle different billing if needed
            if (data.isUsingDifferentBilling) {
                await this.useDifferentBillingAddress(data);
            }

            // Fill group code if provided
            if (data.groupCode) {
                await this.groupCodeInput.setText(data.groupCode);
            }

            // Handle agreements
            await this.iAgreeThatByCheckingOption.select();
            if (await this.iAgreeToGoPaperlessOption.isSelected()){
                
            }else{
                await this.iAgreeToGoPaperlessOption.select();
            }
            
           if (await this.byCheckingBoxOption.isDisplayed(1)) {
                await this.byCheckingBoxOption.select();
           }

            // Submit enrollment
            await this.enrollNowButton.wait(1);
            await this.enrollNowButton.click();
            
            if (waitEnrollButtonDisappears) {
                await this.enrollNowButton.isNotDisplayed(this.LONG_TIMEOUT);
            }

            log.INFO('Successfully completed enrollment form');
        } catch (error) {
            log.ERROR('Error filling enrollment form', { error });
            throw error;
        }
    }

    private async useDifferentBillingAddress(data: CompleteEnrollmentEntity): Promise<void> {
        try {
            await this.useDifferentBillingAddressLink.click();
            
            const billingFrame = this.page.frameLocator('#address-element div iframe:not([tabindex])');
            
            if (data.differentFirstName) {
                await this.stripeiFrame.fillInFrame(this.differentFirstNameInput, data.differentFirstName);
            }
            
            if (data.differentLastName) {
                await this.stripeiFrame.fillInFrame(this.differentLastNameInput, data.differentLastName);
            }
            
            if (data.differentAddress) {
                await this.stripeiFrame.fillInFrame(this.differentAddressInput, data.differentAddress);
            }
            
            const cityField = this.differentCityInput;
            const isCityVisible = await cityField.isDisplayed(this.SHORT_TIMEOUT);
            if (isCityVisible) {
                await this.stripeiFrame.fillInFrame(cityField, 'testing');
            }
            
            log.INFO('Successfully filled different billing address');
        } catch (error) {
            log.ERROR('Error filling different billing address', { error });
            throw error;
        }
    }
}