export interface CustomerPrivacyNoticeCheckpoint{
    marketing: {
      marketingConsent: boolean,
      advertisingConsentActinverGroup: boolean,
      rejectFinancialOffersFromActinver: boolean,
      id?: number
    },
    privacyNotice: {
      consentToPrimaryDataProcessing: boolean,
      consentToSecondaryUse: boolean,
      consentToMarketingContactAndDataTransfer: boolean,
      id?: number
    }
    active? : boolean;
}


export type PrivacyNoticeCheckpoint = CustomerPrivacyNoticeCheckpoint;

