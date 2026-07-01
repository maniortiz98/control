import { Injectable, signal } from '@angular/core';
import { CompleteGeneralInfoSection, GeneralInfoExecutorSection, GeneralInfoSection } from '../../../onboarding/models/checkpoints/general-info-checkpoint';
import { GeneralInfoContract } from '../../../onboarding/models/general-info';

@Injectable({
  providedIn: 'root'
})
export class GeneralInfoStorageService {
  private readonly fullSectionSingal = signal<CompleteGeneralInfoSection | null>(null);
  private readonly generalInfoItemSignal = signal<GeneralInfoSection | null>(null);
  private readonly testamentarySectionSignal = signal<GeneralInfoExecutorSection | null>(null);
  private readonly generalInfoContractSignal = signal<GeneralInfoContract | null>(null);
  private readonly isSavedInfo = signal<boolean>(false);


  constructor() { }

  get fullSection() {
    return this.fullSectionSingal.asReadonly();
  }

  setFullSectionSingal(item: CompleteGeneralInfoSection) {
    this.fullSectionSingal.set(item);
    this.setGeneralInfoItem(item.clientSection);
    if(item.executorSection){
      this.setTestamentarySection(item.executorSection);
    }
    if(item.contractSection){
      this.setGeneralInfoContract(item.contractSection);
    }
  }

  clearFullSectionSingal() {
    this.fullSectionSingal.set(null);
    this.clearGeneralInfoItem();
    this.clearTestamentarySection();
    this.clearGeneralInfoContract();
  }

  /**
   * Section for general information in onboarding
   */
  get generalInfoItem() {
    return this.generalInfoItemSignal.asReadonly();
  }

  setGeneralInfoItem(item: GeneralInfoSection) {
    this.generalInfoItemSignal.set(item);
  }

  clearGeneralInfoItem() {
    this.generalInfoItemSignal.set(null);
  }

  /**
   * Section for flag that indicate if the is a current or saved in final DB info
   */
  get isSavedInfoFlag() {
    return this.isSavedInfo.asReadonly();
  }

  setisSavedInfoFlag(item: boolean) {
    this.isSavedInfo.set(item);
  }

  clearSavedInfoFlag() {
    this.isSavedInfo.set(false);
  }

  /**
   * Section for testamentaty succession (albaceas)
   */
  get testamentarySection() {
    return this.testamentarySectionSignal.asReadonly();
  }

  setTestamentarySection(item: GeneralInfoExecutorSection) {
    this.testamentarySectionSignal.set(item);
  }

  clearTestamentarySection() {
    this.testamentarySectionSignal.set(null);
  }


  /**
   * Section for contract information in maintenance
   */
  get generalInfoContract() {
    return this.generalInfoContractSignal.asReadonly();
  }

  setGeneralInfoContract(item: GeneralInfoContract) {
    this.generalInfoContractSignal.set(item);
  }

  clearGeneralInfoContract() {
    this.generalInfoContractSignal.set(null);
  }
}
