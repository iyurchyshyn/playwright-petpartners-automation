import { Page } from 'playwright';
import { log } from '../../utils/logger';

export class CongratulationsEnrollmentPage {
  private readonly selectors = {
    congratulationLabel: "h1:text('Congratulations on your enrollment!')",
    policyNumber: "h2:has-text('Policy')",
    portalLogin: "span:has-text('Portal Login')",
    monthlyTotal: "div.pet-overview__premium-price",
    petName: "div.pet-overview__name div",
    petBreed: "div.pet-overview__details div:not([class])",
    petCoverageDetails: "div.fw--600",
    policyTerm: "datetime",
    deductible: "li:has-text('Deductible:') span",
    coinsurance: "li:has-text('Coinsurance:') span",
    incident: "li:has-text('Incident:') span",
    annual: "li:has-text('Annual:') span",
    closeButton: "#sa_close"
  };

  private readonly labelMap: Record<string, string> = {
    'Pet Name': this.selectors.petName,
    'Pet Breed': this.selectors.petBreed,
    'Pet Coverage Details': this.selectors.petCoverageDetails,
    'Policy Term': this.selectors.policyTerm,
    'Deductible': this.selectors.deductible,
    'Coinsurance': this.selectors.coinsurance,
    'Incident': this.selectors.incident,
    'Annual': this.selectors.annual,
    'Monthly Total': this.selectors.monthlyTotal
  };

  constructor(page: Page) {
    log.INFO('Initializing CongratulationsEnrollmentPage');
  }

  // async getPetOverviewPriceByName(petName: string): Promise<string> {
  //   const selector = `div:text("${petName}")/../../..//div[contains(@class,'pet-overview__price')]`;
  //   return await this.getText(selector);
  // }

  // async getLabel(labelName: string): Promise<string> {
  //   const selector = this.labelMap[labelName];
  //   if (!selector) {
  //     throw new Error(`Label ${labelName} not found in labelMap`);
  //   }
  //   return await this.getText(selector);
  // }
}