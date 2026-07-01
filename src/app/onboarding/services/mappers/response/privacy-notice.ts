import { DataPrivacyNotice } from "../../../models/checkpoints/response/privacy-notice";
import { PrivacyNoticeData } from "../../../models/privacy-notice";

export function mapToSignalPrivacyNotice(input: DataPrivacyNotice): PrivacyNoticeData{
  return {
    data: {
      marketing: {
        marketingConsent: input.marketing.marketingConsent || false,
        advertisingConsentActinverGroup: input.marketing.advertisingConsentActinverGroup || false,
        rejectFinancialOffersFromActinver: input.marketing.rejectFinancialOffersFromActinver || false
      },
      privacyNotice: {
        consentToPrimaryDataProcessing: input.privacyNotice.consentToPrimaryDataProcessing || true,
        consentToSecondaryUse: input.privacyNotice.consentToSecondaryUse || true,
        consentToMarketingContactAndDataTransfer: input.privacyNotice.consentToMarketingContactAndDataTransfer || true
      }
    }
  };
}
