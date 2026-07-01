export interface DataPrivacyNotice {
    marketing: {
      marketingConsent: boolean,
      advertisingConsentActinverGroup: boolean,
      rejectFinancialOffersFromActinver: boolean
    },
    privacyNotice: {
      consentToPrimaryDataProcessing: boolean,
      consentToSecondaryUse: boolean,
      consentToMarketingContactAndDataTransfer: boolean
    }
}