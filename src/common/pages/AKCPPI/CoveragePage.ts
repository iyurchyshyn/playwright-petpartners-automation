import { Page } from 'playwright';
import { log } from '../../../common/utils/logger';
import { ChangeCoverageEntity } from '../../../common/entities/AKC&PPI/ChangeCoverageEntity';
import { Button, Select, RadioButton, Label } from '../../control';

export class CoveragePage {
  DEFAULT_TIMEOUT = 60 * 1000;
  LONG_TIMEOUT = 120 * 1000;
    // Labels
    private readonly customizeYourPlanLabel: Label;
    private readonly descriptionLabel: Label;

    // Buttons
    private readonly activateInitial30Day: Button;
    private readonly activateCertAndContinue: Button;
    private readonly activateAnnualPlan: Button;
    private readonly addToCartButton: Button;
    private readonly emailQuoteButton: Button;
    private readonly submitButton: Button;
    private readonly closeButton: Button;
    private readonly editPetButton: Button;
    private readonly planToggleButton: Button;

    // Select Controls
    private readonly deductibleSelect: Select;
    private readonly coinsuranceSelect: Select;
    private readonly annualLimitSelect: Select;
    private readonly incidentLimitSelect: Select;

    // Radio Controls
    private readonly examPlusRadio: RadioButton;
    private readonly breedingCoverageRadio: RadioButton;
    private readonly supportPlusRadio: RadioButton;
    private readonly defenderPlusRadio: RadioButton;
    private readonly defenderRadio: RadioButton;
    private readonly hereditaryPlusRadio: RadioButton;

    private radioButtonMap: { [key: string]: RadioButton };
    private selectMap: { [key: string]: Select };

    constructor(page: Page) {
        // Initialize Labels
        this.customizeYourPlanLabel = new Label(page, "h2:text('Customize Your Plan')");
        this.descriptionLabel = new Label(page, "div.margin-top--1:text-matches('This option has preset limits')");

        // Initialize Buttons
        this.activateInitial30Day = new Button(page, "#activate-30-day");
        this.activateCertAndContinue = new Button(page, "#activate-enroll");
        this.activateAnnualPlan = new Button(page, "#enroll-in-annual-plan");
        this.addToCartButton = new Button(page, "span:text('Add to Cart')");
        this.emailQuoteButton = new Button(page, "#email-quote-modal-button");
        this.submitButton = new Button(page, "span:text('Submit')");
        this.closeButton = new Button(page, "div.modal.modal-small button:text('Close')");
        this.editPetButton = new Button(page, "button[title='Return to previous Step']");
        this.planToggleButton = new Button(page, "label.toggle__label");

        // Initialize Selects
        this.deductibleSelect = new Select(page, "#deductible-amount");
        this.coinsuranceSelect = new Select(page, "#coinsurance-amount");
        this.annualLimitSelect = new Select(page, "#annual-level");
        this.incidentLimitSelect = new Select(page, "#incident-level");

        // Initialize Radio Buttons
        this.examPlusRadio = new RadioButton(page, "input#NP_EXAM + label");
        this.breedingCoverageRadio = new RadioButton(page, "input#BREEDER + label");
        this.supportPlusRadio = new RadioButton(page, "input#FINAL_RESPECTS + label");
        this.defenderPlusRadio = new RadioButton(page, "input#Wellness2 + label");
        this.defenderRadio = new RadioButton(page, "input#Wellness1 + label");
        this.hereditaryPlusRadio = new RadioButton(page, "input#NP_INHERITED + label");

        this.selectMap = {
          'Deductible': this.deductibleSelect,
          'Coinsurance': this.coinsuranceSelect,
          'AnnualLimit': this.annualLimitSelect,
          'IncidentLimit': this.incidentLimitSelect
        }

        this.radioButtonMap = {
          'ExamPlus': this.examPlusRadio,
          'HereditaryPlus': this.hereditaryPlusRadio,
          'BreedingCoverage': this.breedingCoverageRadio,
          'SupportPlus': this.supportPlusRadio,
          'DefenderPlus': this.defenderPlusRadio,
          'Defender': this.defenderRadio
        }
        log.INFO('Initialized CoveragePage');
    }
    
    getPetAgeLabel(page: Page, age: string): Label {
      const selector = `//div[@class='pet-overview__details']/div[contains(text(),'${age}')]`;
      const petAgeLabel = new Label(page, selector);
      return petAgeLabel;
  }
  getBreedLabel(page: Page, breed: string): Label {
      const selector = `//div[@class='pet-overview__details']/div[contains(text(),'${breed}')]`;
      const petBreedLabel = new Label(page, selector);
      return petBreedLabel;
}
  

    async selectPlanDetail(option?: string): Promise<void> {
        if (!option) {
            log.INFO('No plan detail specified, skipping selection');
            return;
        }
        if (await this.descriptionLabel.isDisplayed()) {
            if (option.toLowerCase() === 'custom') {
                await this.planToggleButton.click();
            }
        }else{
            if (option.toLowerCase() === 'basic') {
                await this.planToggleButton.click();
            }
        }
    }

    async fillCoverageOptions(data: ChangeCoverageEntity): Promise<void> {
        log.INFO('Filling coverage options', { data });
        
        try {
            // Handle plan type selection
            await this.selectPlanDetail(data.planDetail);

            if (data.planDetail?.toLowerCase() === 'custom') {
                // Fill custom plan options if they exist
                if (data.deductible) {
                    await this.deductibleSelect.selectValue(data.deductible);
                }
                if (data.coinsurance) {
                    await this.coinsuranceSelect.selectValue(data.coinsurance);
                }
                if (data.annualLimit) {
                    await this.annualLimitSelect.selectValue(data.annualLimit);
                }
            } else{
                if (data.planDetail?.toLowerCase() === 'basic') {
                  await this.planToggleButton.click();
                }
            }
            log.INFO('Successfully filled coverage options');
        } catch (error) {
            log.ERROR('Error filling coverage options', { error, data });
            throw error;
        }
    }
}