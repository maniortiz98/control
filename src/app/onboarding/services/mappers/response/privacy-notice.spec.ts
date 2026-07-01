import { mapToSignalPrivacyNotice } from './privacy-notice';

describe('response/privacy-notice mapper', () => {
  it('should map truthy consent values', () => {
    const result = mapToSignalPrivacyNotice({
      marketing: {
        marketingConsent: true,
        advertisingConsentActinverGroup: true,
        rejectFinancialOffersFromActinver: true,
      },
      privacyNotice: {
        consentToPrimaryDataProcessing: true,
        consentToSecondaryUse: true,
        consentToMarketingContactAndDataTransfer: true,
      },
    } as any);

    expect(result).toEqual({
      data: {
        marketing: {
          marketingConsent: true,
          advertisingConsentActinverGroup: true,
          rejectFinancialOffersFromActinver: true,
        },
        privacyNotice: {
          consentToPrimaryDataProcessing: true,
          consentToSecondaryUse: true,
          consentToMarketingContactAndDataTransfer: true,
        },
      },
    });
  });

  it('should keep current fallback behavior for false and missing values', () => {
    const result = mapToSignalPrivacyNotice({
      marketing: {
        marketingConsent: false,
        advertisingConsentActinverGroup: false,
        rejectFinancialOffersFromActinver: false,
      },
      privacyNotice: {
        consentToPrimaryDataProcessing: false,
        consentToSecondaryUse: false,
        consentToMarketingContactAndDataTransfer: false,
      },
    } as any);

    expect(result.data.marketing).toEqual({
      marketingConsent: false,
      advertisingConsentActinverGroup: false,
      rejectFinancialOffersFromActinver: false,
    });
    expect(result.data.privacyNotice).toEqual({
      consentToPrimaryDataProcessing: true,
      consentToSecondaryUse: true,
      consentToMarketingContactAndDataTransfer: true,
    });
  });
});