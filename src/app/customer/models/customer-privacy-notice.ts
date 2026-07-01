export interface CustomerPrivacyCheck {
  controlName: string,
  text: string,
  required: boolean,
  checked: boolean,
  disabled: boolean,
}

export interface CustomerPrivacyNoticeData {
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


export type PrivacyCheck = CustomerPrivacyCheck;
export type PrivacyNoticeData = CustomerPrivacyNoticeData;

