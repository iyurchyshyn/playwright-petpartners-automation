import {Given, Then, setDefaultTimeout } from '@cucumber/cucumber';
import { ICustomWorld } from '@common/helper/world';
import { GetQuotePage } from '@pages/AKCPPI/GetQuotePage';
import { CoveragePage } from '@pages/AKCPPI/CoveragePage';
import { CompleteYourEnrollmentPage } from '@pages/AKCPPI/CompleteYourEnrollmentPage';
import { CongratulationsEnrollmentPage } from '@pages/AKCPPI/CongratulationsEnrollmentPage';
import { GetQuoteEntity } from '@entities/AKC&PPI/GetQuoteEntity';
import { CompleteEnrollmentEntity } from '@entities/AKC&PPI/CompleteEnrollmentEntity';
import { log } from '@utils/logger';
import { expect } from 'playwright/test';

const DEFAULT_TIMEOUT = 60 * 1000;
const LONG_TIMEOUT = 120 * 1000;

Given('open the {string} Enroll web page', { timeout: DEFAULT_TIMEOUT }, async function(brand: string) {
  try {
    const page = await this.getPage();
    const baseUrl = brand.toUpperCase() === 'AKC' ? process.env.BASE_URL : process.env.PPI_URL;
    await page.goto(`${baseUrl}/enroll`);
    log.INFO(`Successfully opened ${brand} Enroll web page`);
} catch (error) {
    log.ERROR('Failed to open Enroll web page', { error });
    throw error;
}
});

Given('fill the Get Quote Page - AKC', async function(this: ICustomWorld, dataTable: any) {
    try {
        const getQuotePage = await this.getPageObject(GetQuotePage);
        const data = dataTable.hashes()[0];

        const quoteData: GetQuoteEntity = {
            petName: data['PET NAME'],
            zipCode: data['ZIP CODE'].toString(),
            dogOrCatOption: data['PET TYPE'],
            petBreed: data['PET BREED'],
            petAge: data['PET AGE'].toString(),
            emailAdress: data['EMAIL ADDRESS'],
        };
        await getQuotePage.fillGetQuote(quoteData);
        
        log.INFO('Successfully filled Get Quote Page');
    } catch (error) {
        log.ERROR('Failed to fill Get Quote Page', { error });
        throw error;
    }
});

Given('click ADD TO CART button in Coverage Page - AKC', async function(this: ICustomWorld) {
    try {
        const coveragePage = await this.getPageObject(CoveragePage);
        await coveragePage.addToCartButton.click();
        log.INFO('Successfully clicked Add to Cart button');
    } catch (error) {
        log.ERROR('Failed to click Add to Cart button', { error });
        throw error;
    }
});

Given('fill the Complete Your Enrollment Page - AKC', async function(this: ICustomWorld, dataTable: any) {
    try {
        const page = await this.getPage();
        const completeEnrollmentPage = await this.getPageObject(CompleteYourEnrollmentPage);
        const data = dataTable.hashes()[0];

        const enrollmentData: CompleteEnrollmentEntity = {
            firstName: data['FIRST NAME'],
            lastName: data['LAST NAME'],
            address: data['ADDRESS'],
            aptSuiteEtc: data['APT, SUITE, ETC.'],
            phoneNumber: data['PHONE NUMBER'].toString(),
            emailAddress: 'akcRANDOM@yopmail.com',
            nameOnCard: `${data['FIRST NAME']} ${data['LAST NAME']}`,
            cardNumber: data['CARD NUMBER'],
            expiresMMYY: data['EXPIRES'],
            expiresCVC: data['CVC'],
            iAggreToGoPaperless: 'yes',
            iAgreeThatByChecking: 'yes',
        };

        // Wait for page to be ready
        await page.waitForLoadState('networkidle');

        await completeEnrollmentPage.fillCompleteYourEnrollment(enrollmentData);
        log.INFO('Successfully filled Complete Your Enrollment Page');
    } catch (error) {
        log.ERROR('Failed to fill Complete Your Enrollment Page', { error });
        throw error;
    }
});

Then('verify the {string} is displayed - AKC', async function(this: ICustomWorld, expectedText: string) {
    try {
        const page = await this.getPage();
        const congratulationsPage = await this.getPageObject(CongratulationsEnrollmentPage);
        
        // Create label control for verification
        const congratulationLabel = congratulationsPage.congratulationsLabel;
        await congratulationLabel.waitForVisible(LONG_TIMEOUT);
        // Wait for label to be visible
        expect(await congratulationLabel.getText()).toBe(expectedText);

        this.set('varibale', expectedText);
        
        log.INFO(`Successfully verified message: ${expectedText}`);
    } catch (error) {
        log.ERROR(`Failed to verify message: ${expectedText}`, { error });
        throw error;
    }
});

Then('print a variable', async function(this: ICustomWorld) {
    try {
        const variable = this.get('varibale');
        
        log.INFO('Vairable:', { variable });
    } catch (error) {
        log.ERROR('Failed to print policy details', { error });
        throw error;
    }
});