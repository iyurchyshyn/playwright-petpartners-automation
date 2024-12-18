import { Page } from 'playwright';
import { log } from '@utils/logger';
import { Label, Button } from '../../control';

export class CongratulationsEnrollmentPage {
    DEFAULT_TIMEOUT = 60 * 1000;
    LONG_TIMEOUT = 120 * 1000;

    // Labels
    congratulationsLabel: Label;
    policyNumberLabel: Label;
    portalLoginLabel: Label;
    monthlyTotalLabel: Label;
    petNameLabel: Label;
    petBreedLabel: Label;
    petCoverageDetailsLabel: Label;
    policyTermLabel: Label;
    deductibleLabel: Label;
    coinsuranceLabel: Label;
    incidentLabel: Label;
    annualLabel: Label;

    // Buttons
    closeButton: Button;

    constructor(page: Page) {
        // Initialize Labels
        this.congratulationsLabel = new Label(page, "h1:text('Congratulations on your enrollment!')");
        this.policyNumberLabel = new Label(page, "h2:has-text('Policy')");
        this.portalLoginLabel = new Label(page, "span:has-text('Portal Login')");
        this.monthlyTotalLabel = new Label(page, "div.pet-overview__premium-price");
        this.petNameLabel = new Label(page, "div.pet-overview__name div");
        this.petBreedLabel = new Label(page, "div.pet-overview__details div:not([class])");
        this.petCoverageDetailsLabel = new Label(page, "div.fw--600");
        this.policyTermLabel = new Label(page, "datetime");
        this.deductibleLabel = new Label(page, "li:has-text('Deductible:') span");
        this.coinsuranceLabel = new Label(page, "li:has-text('Coinsurance:') span");
        this.incidentLabel = new Label(page, "li:has-text('Incident:') span");
        this.annualLabel = new Label(page, "li:has-text('Annual:') span");
        

        // Initialize Buttons
        this.closeButton = new Button(page, "#sa_close");

        log.INFO('Initialized CongratulationsEnrollmentPage');
    }

    async getPetOverviewPriceByName(page: Page, petName: string): Promise<string> {
      try {
          const priceLabel = new Label(page, `div:text("${petName}")/../../..//div[contains(@class,'pet-overview__price')]`);
          const price = await priceLabel.getText();
          log.INFO(`Got pet overview price for ${petName}:`, { price });
          return price;
      } catch (error) {
          log.ERROR(`Failed to get pet overview price for ${petName}`, { error });
          throw error;
      }
  }

    async getLabel(labelName: string): Promise<string> {
        try {
            const labelMap: Record<string, Label> = {
                'Pet Name': this.petNameLabel,
                'Pet Breed': this.petBreedLabel,
                'Pet Coverage Details': this.petCoverageDetailsLabel,
                'Policy Term': this.policyTermLabel,
                'Deductible': this.deductibleLabel,
                'Coinsurance': this.coinsuranceLabel,
                'Incident': this.incidentLabel,
                'Annual': this.annualLabel,
                'Monthly Total': this.monthlyTotalLabel
            };

            const label = labelMap[labelName];
            if (!label) {
                throw new Error(`Label ${labelName} not found in labelMap`);
            }

            const text = await label.getText();
            log.INFO(`Got text for label ${labelName}:`, { text });
            return text;
        } catch (error) {
            log.ERROR(`Failed to get label ${labelName}`, { error });
            throw error;
        }
    }
}