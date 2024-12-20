// import { Page } from 'playwright';
// import { log } from '../../utils/logger';
// import { CompleteEnrollmentEntity } from '../../entities/AKC&PPI/CompleteEnrollmentEntity';

 export class CompleteYourEnrollmentPage {
//   // Selectors
//   private readonly selectors = {
//     completeEnrollmentLabel: "h1:text('Complete your enrollment')",
//     policyOverviewCost: "div.pet-overview >> span",
//     firstName: "#customer-firstName",
//     lastName: "#customer-lastName",
//     address: "#customer-address-address1",
//     aptSuiteEtc: "#customer-address-address2",
//     city: "#customer-address-city",
//     state: "#customer-address-stateProvId",
//     zipCode: "#customer-address-zipCode",
//     phoneNumber: "#customer-phoneNumber",
//     emailAddress: "#customer-emailAddress",
//     groupCode: "#affinity-group-code",
//     // Stripe iframes
//     stripeFrame: "#payment-element iframe",
//     cardNumber: "#Field-numberInput",
//     expiryDate: "#Field-expiryInput",
//     cvc: "#Field-cvcInput",
//     country: "#Field-countryInput",
//     // Agreement checkboxes
//     eConsent: "input[name='e-consent']",
//     electronicDelivery: "input[name='electronic-delivery']",
//     feeDisclosure: "input[name='fee-disclosure']",
//     // Buttons
//     enrollNow: "button[title='Submit my enrollment']",
//     // Different billing
//     useDifferentBilling: "label:has-text('Use a different billing Address')",
//     billingAddressFrame: "#address-element div iframe:not([tabindex])",
//     differentFirstName: "#Field-firstNameInput",
//     differentLastName: "#Field-lastNameInput",
//     differentAddress: "#Field-addressLine1Input",
//     differentCity: "#Field-localityInput"
//   };

//   constructor(page: Page) {
//     super(page);
//     log.INFO('Initializing CompleteYourEnrollmentPage');
//   }

//   async fillCompleteYourEnrollment(data: CompleteEnrollmentEntity, waitEnrollButtonDisappears = true): Promise<void> {
//     log.INFO('Filling enrollment form', { data });

//     try {
//       // Fill main form fields
//       if (data.firstName) await this.fill(this.selectors.firstName, data.firstName);
//       if (data.lastName) await this.fill(this.selectors.lastName, data.lastName);
//       if (data.address) await this.fill(this.selectors.address, data.address);
//       if (data.aptSuiteEtc) await this.fill(this.selectors.aptSuiteEtc, data.aptSuiteEtc);
//       if (data.city) await this.fill(this.selectors.city, data.city);
//       if (data.state) await this.fill(this.selectors.state, data.state);
//       if (data.zipCode) await this.fill(this.selectors.zipCode, data.zipCode);
//       if (data.phoneNumber) await this.fill(this.selectors.phoneNumber, data.phoneNumber);
//       if (data.emailAddress) await this.fill(this.selectors.emailAddress, data.emailAddress);

//       // Handle Stripe iframe
//       const stripeFrame = await this.page.frameLocator(this.selectors.stripeFrame);
//       await stripeFrame.locator(this.selectors.cardNumber).fill(data.cardNumber);
//       await stripeFrame.locator(this.selectors.expiryDate).fill(data.expiresMMYY);
//       await stripeFrame.locator(this.selectors.cvc).fill(data.expiresCVC);

//       // Handle different billing if needed
//       if (data.isUsingDifferentBilling) {
//         await this.click(this.selectors.useDifferentBilling);

//         const billingFrame = await this.page.frameLocator(this.selectors.billingAddressFrame);
//         await billingFrame.locator(this.selectors.differentFirstName).fill(data.differentFirstName);
//         await billingFrame.locator(this.selectors.differentLastName).fill(data.differentLastName);
//         await billingFrame.locator(this.selectors.differentAddress).fill(data.differentAddress);
        
//         const cityElement = billingFrame.locator(this.selectors.differentCity);
//         if (await cityElement.isVisible()) {
//           await cityElement.fill('testing');
//         }
//       }

//       // Fill group code if provided
//       if (data.groupCode) {
//         await this.fill(this.selectors.groupCode, data.groupCode);
//       }

//       // Handle agreements
//       await this.click(this.selectors.eConsent);
//       await this.click(this.selectors.electronicDelivery);
      
//       const feeDisclosure = this.page.locator(this.selectors.feeDisclosure);
//       if (await feeDisclosure.isVisible({ timeout: this.DEFAULT_TIMEOUT })) {
//         await this.click(this.selectors.feeDisclosure);
//       }

//       // Submit enrollment
//       await this.click(this.selectors.enrollNow);
      
//       if (waitEnrollButtonDisappears) {
//         await this.page.waitForSelector(this.selectors.enrollNow, { state: 'hidden', timeout: this.LONG_TIMEOUT });
//       }

//       log.INFO('Successfully completed enrollment form');
//     } catch (error) {
//       log.ERROR('Error filling enrollment form', { error });
//       throw error;
//     }
//   }
 }