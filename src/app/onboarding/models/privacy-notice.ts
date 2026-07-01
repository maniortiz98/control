export interface PrivacyCheck {
  controlName: string,
  text: string,
  required: boolean,
  checked: boolean,
  disabled: boolean,
}

export interface PrivacyNoticeData {
  data: {
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
}

