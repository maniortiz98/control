import { Injectable, signal } from '@angular/core';
import { PrivacyCheck } from '../../../onboarding/models/privacy-notice';

@Injectable({
  providedIn: 'root'
})
export class PrivacyNoticeService {
  public readonly defaultPrivacyNoticeData: PrivacyCheck[] = [
    {
      text: 'No consiento que los datos personales se utilicen para mercadeo.',
      controlName: 'marketingConsent',
      required: false,
      checked: false,
      disabled:false,
    },
    {
      text: 'No consiento recibir publicidad de las entidades integrantes de, relacionadas con, subsidiarias, dependientes o afiliadas a Corporación Actinver, S.A.B. de CV, vía correo electrónico, mensajería, teléfono o cualquier otro medio.',
      controlName: 'advertisingConsentActinverGroup',
      required: false,
      checked: false,
      disabled:false,
    },
    {
      text: 'No consiento recibir ofertas u ofrec. de productos o servicios financ. de las entidades integrantes de, relacionadas con, subsidiarias, dependientes o afiliadas a Corporación Actinver, S.A.B. de CV, vía correo, mensajería, teléfono o cualquier medio.',
      controlName: 'rejectFinancialOffersFromActinver',
      required: false,
      checked: false,
      disabled:false,
    },
    {
      text: 'Manifiesto mi consentimiento al tratamiento de los Datos Personales proporcionados a Actinver para llevar a cabo las finalidades primarias o finalidades necesarias previstas en el presente Aviso de Privacidad, reconociendo en este acto no existe oposición alguna de mi parte a que los Datos Personales sean transferidos a los terceros señalados en el mismo.',
      controlName: 'consentToPrimaryDataProcessing',
      required: true,
      checked: true,
      disabled:true,
    },
    {
      text: 'Manifiesto mi consentimiento para que los Datos Personales proporcionados a Actinver sean utilizados para llevar a cabo las finalidades secundarias o finalidades no necesarias previstas en el presente Aviso de Privacidad, reconociendo en este acto no existe oposición alguna de mi parte a que los Datos personales sean transferidos a los terceros señalados en el mismo.',
      controlName: 'consentToSecondaryUse',
      required: true,
      checked: true,
      disabled:true,
    },
    {
      text: 'Manifiesto mi consentimiento para que los Datos Personales proporcionados a Actinver sean utilizados, para ser contactado de manera personal vía telefónica o a través del correo electrónico para fines mercadológicos, publicitarios o de prospección comercial única y exclusivamente por parte de Actinver y/o sus matrices afiliadas y/o subsidiarias, reconociendo en este acto no existe oposición alguna de mi parte a que los Datos personales sean transferidos a los terceros señalados en el mismo.',
      controlName: 'consentToMarketingContactAndDataTransfer',
      required: true,
      checked: true,
      disabled:true,
    },
  ];
  public privacyNoticeData = signal<any>({});
  public initialPrivacyNoticeData: any = {};

  constructor(){
    this.initialPrivacyNoticeData = this.privacyNoticeData();
  }
  
  // Create or update the object
  setItem(value: any): void {
    this.privacyNoticeData.set(value);
  }

  clear(){
    this.privacyNoticeData.set({});
  }
}
