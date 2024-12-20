import { Page } from 'playwright';
import { log } from '../../../common/utils/logger';
import { GetQuoteEntity } from '../../../common/entities/AKC&PPI/GetQuoteEntity';
import { Button, Select, TextBox, Label } from '../../control';

export class GetQuotePage {
    DEFAULT_TIMEOUT = 60 * 1000;
    LONG_TIMEOUT = 120 * 1000;

    // Labels
    private readonly yourPetQuoteLabel: Label;

    // Inputs
    private readonly petNameInput: TextBox;
    private readonly zipCodeInput: TextBox;
    private readonly petBreedInput: TextBox;
    private readonly emailAddressInput: TextBox;
    private readonly registrationNumberInput: TextBox;
    private readonly zipCodeRegistrationInput: TextBox;
    private readonly customerSourceInput: TextBox;

    // Buttons
    private readonly dogPetTypeButton: Button;
    private readonly catPetTypeButton: Button;
    private readonly resetBreedButton: Button;
    private readonly yesPetOptionButton: Button;
    private readonly noPetOptionButton: Button;
    private readonly chooseCoverageButton: Button;
    private readonly editZipCodeButton: Button;
    private readonly yesZipCodeModalButton: Button;
    private readonly lookUpPetMainButton: Button;
    private readonly lookUpPetButton: Button;
    private readonly cancelButton: Button;

    // Select Controls
    private readonly petAgeSelect: Select;

    // Label Map
    private readonly labelMap: Record<string, Label>;

    constructor(page: Page) {
        // Initialize Labels
        this.yourPetQuoteLabel = new Label(page, "h1.margin-top--1");

        // Initialize Inputs
        this.petNameInput = new TextBox(page, "#name");
        this.zipCodeInput = new TextBox(page, "#postalCode");
        this.petBreedInput = new TextBox(page, "#breedSearch");
        this.emailAddressInput = new TextBox(page, "#email");
        this.registrationNumberInput = new TextBox(page, "#reg_no");
        this.zipCodeRegistrationInput = new TextBox(page, "#zipcode");
        this.customerSourceInput = new TextBox(page, "#customer-source");

        // Initialize Buttons
        this.dogPetTypeButton = new Button(page, "span[for='dog']");
        this.catPetTypeButton = new Button(page, "span[for='cat']");
        this.resetBreedButton = new Button(page, "#resetBreedButton");
        this.yesPetOptionButton = new Button(page, "span[for='yes']");
        this.noPetOptionButton = new Button(page, "span[for='no']");
        this.chooseCoverageButton = new Button(page, "#submit");
        this.editZipCodeButton = new Button(page, "#change-postal-code");
        this.yesZipCodeModalButton = new Button(page, "button:text('Yes')");
        this.lookUpPetMainButton = new Button(page, "#look-up-pet-btn");
        this.lookUpPetButton = new Button(page, "#find-registration");
        this.cancelButton = new Button(page, "#look-up-cancel");

        // Initialize Selects
        this.petAgeSelect = new Select(page, "#age");

        // Initialize Label Map
        this.labelMap = {
            'AKC Icon': new Label(page, "[alt='AKC Pet Insurance']"),
            'Privacy Policy': new Label(page, ":text('PRIVACY POLICY')"),
            'PetPartners': new Label(page, "a:text('PetPartners, Inc.')"),
            'Policy terms and conditions': new Label(page, ":text('policy terms and conditions')"),
            'our policies': new Label(page, ":text('our policies')"),
            'ACCREDITED BUISSNES': new Label(page, "[alt='Better Business Bureau - PetPartners, Inc.']"),
            'Naphia': new Label(page, "[alt='North American Pet Health Insurance Association']"),
            'Consumer Rating': new Label(page, ".consumer-affairs-link"),
            'Shooper Rating': new Label(page, ".shopperlink")
        };

        log.INFO('Initialized GetQuotePage');
    }

    async fillGetQuote(data: GetQuoteEntity): Promise<void> {
        log.INFO('Filling quote form', { data });

        try {
            await this.petNameInput.setText(data.petName ?? '');

            if (data.zipCode) {
                await this.zipCodeInput.setText(data.zipCode);
            }

            // Handle pet type selection
            if (data.dogOrCatOption?.toLowerCase() === 'dog') {
                await this.dogPetTypeButton.click();
            } else if (data.dogOrCatOption?.toLowerCase() === 'cat') {
                await this.catPetTypeButton.click();
            }

            if (data.petBreed) {
                await this.petBreedInput.setTextAndEnter(data.petBreed);
            }

            await this.petAgeSelect.selectValue(data.petAge ?? '');
            await this.emailAddressInput.setText(data.emailAdress ?? '');

            await this.chooseCoverageButton.click();
            await this.chooseCoverageButton.isNotDisplayed(this.LONG_TIMEOUT);

            log.INFO('Successfully filled quote form');
        } catch (error) {
            log.ERROR('Error filling quote form', { error });
            throw error;
        }
    }

    async updateGetQuote(data: GetQuoteEntity): Promise<void> {
        log.INFO('Updating quote form', { data });

        try {

            if (data.petName) {
                await this.petNameInput.isDisplayed(this.LONG_TIMEOUT);
                await this.petNameInput.setText(data.petName);
            }

            if (data.zipCode) {
                await this.editZipCodeButton.click();
                await this.yesZipCodeModalButton.click();
                await this.zipCodeInput.setText(data.zipCode);
            }

            // Continue with pet type selection
            if (data.dogOrCatOption?.toLowerCase() === 'dog') {
                await this.dogPetTypeButton.click();
            } else if (data.dogOrCatOption?.toLowerCase() === 'cat') {
                await this.catPetTypeButton.click();
            }

            // Update breed if provided
            if (data.petBreed) {
                await this.petBreedInput.setTextAndEnter(data.petBreed);
            }

            // Update age if provided
            if (data.petAge) {
                await this.petAgeSelect.selectValue(data.petAge);
            }

            // Update email if provided
            if (data.emailAdress) {
                await this.emailAddressInput.setText(data.emailAdress);
            }

            await this.chooseCoverageButton.click();
            await this.chooseCoverageButton.isNotDisplayed(this.LONG_TIMEOUT);

            log.INFO('Successfully updated quote form');
        } catch (error) {
            log.ERROR('Error updating quote form', { error });
            throw error;
        }
    }
}