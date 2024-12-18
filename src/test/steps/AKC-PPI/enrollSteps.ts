import { Given, Then, DataTable, Before } from '@cucumber/cucumber';
import { ICustomWorld } from '../../../common/helper/world';
import { EnrollPage } from '../../../common/pages/enrollPage';

// Set timeout for all steps
const DEFAULT_TIMEOUT = 60 * 1000;
const LONG_TIMEOUT = 120 * 1000;

// Types for form data
interface EnrollmentData {
  petName: string;
  zipCode: string;
  petType: 'dog' | 'cat';
  petBreed: string;
  petAge: string;
  email: string;
}

interface CustomerData {
  firstName: string;
  lastName: string;
  address: string;
  apt: string;
  phoneNumber: string;
  cardNumber: string;
  expiresMMYY: string;
  expiresCVC: string;
}

// Declare variable to store EnrollPage instance
let enrollPage: EnrollPage;

// Initialize the page object before scenarios
Before(async function(this: ICustomWorld) {
  enrollPage = await this.getPageObject(EnrollPage);
});

Given('open the AKC Enroll web page', { timeout: DEFAULT_TIMEOUT }, async function() {
  await enrollPage.navigateToEnroll();
});

Given('fill the Get Quote Page - AKC', { timeout: LONG_TIMEOUT }, async function(dataTable: DataTable) {
  const row = dataTable.rows()[0];
  const enrollmentData: EnrollmentData = {
    petName: row[0],
    zipCode: row[1],
    petType: row[2] as 'dog' | 'cat',
    petBreed: row[3],
    petAge: row[4],
    email: row[5]
  };

  await enrollPage.fillEnrollmentForm(enrollmentData);
});

Given('click ADD TO CART button in Coverage Page - AKC', { timeout: LONG_TIMEOUT }, async function() {
  await enrollPage.clickAddToCart();
});

Then('fill the Complete Your Enrollment Page - AKC', { timeout: LONG_TIMEOUT }, async function(dataTable: DataTable) {
  const row = dataTable.rows()[0];
  const customerData: CustomerData = {
    firstName: row[0],
    lastName: row[1],
    address: row[2],
    apt: row[3],
    phoneNumber: row[4],
    cardNumber: row[5],
    expiresMMYY: row[6],
    expiresCVC: row[7]
  };

  await enrollPage.fillCustomerInformation(customerData);
});

Then('verify the {string} is displayed - AKC', { timeout: LONG_TIMEOUT }, async function(message: string) {
  await enrollPage.verifySuccessMessage(message);
  await this.set('successMessage', message);
  await console.log('Success message:', message);
});

Then('print a variable', { timeout: DEFAULT_TIMEOUT }, async function() {
  console.log('Success message:', this.get('successMessage'));
});