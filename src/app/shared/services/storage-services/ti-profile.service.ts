import { inject, Injectable, signal } from '@angular/core';
import { TransactionalResource } from '../../../onboarding/models/general-info-pm';
import { transactionalResourcesQuestion } from '../transactional-profile-quiz-data';
import { CatalogsService } from '../catalogs.service';
import { Ranges } from '../../../onboarding/models/origin-resource';
import { InvestmentProfileData } from '../../../onboarding/models/transactional-investment-profile-section';

@Injectable({
  providedIn: 'root'
})
export class TiProfileService {
  public serviceName: string = "PF service";
  public investmentProfile = signal({});
  public maintenanceQuiz = signal({});
  public investmentProfileQuiz = signal({});
  public transactionalProfile = signal({});
  public transactionalResources = signal<TransactionalResource[]>([]);
  public investmentQuizId = signal<number | null>(null);
  public profileRating = signal<number | string | null>(null);
  public investmentQuizCompleted = signal<boolean>(false);
  public onWorkFlow = signal<boolean>(false);

  //The main signal of complete section
  public fullSectionSignal = signal<InvestmentProfileData | null>(null);

  private readonly catalogsService = inject(CatalogsService);
  private allResources = signal<Array<Ranges>>([]);

  constructor(){
    this.catalogsService.getOriginResource({full: true, rangeId: "1"}).subscribe(i => {
      this.allResources.set(i);
    });
  }

  getAnswer(stringId: string): string | number {
    const numberId = Number(stringId);
    return isNaN(numberId) ? stringId : numberId;
  }

  getResourceText(rscId: string){
    const found = this.allResources().find(rsc => rsc.rangeId === rscId);
    return found?.description || '';
  }

  setItem(data:any){
    console.log('Seteando ')
    console.log({data})
    this.investmentProfile.set(
      {
        service: data.customerType || '',
        subtype: data.customerSubtype || '',
        profileRating: data.investmentProfile || '',
      }
    );

    this.profileRating.set(data.investmentProfile || '');

    this.transactionalProfile.set(
    {
      ...Object.fromEntries(
        data.questionnaire.map((question:any) => (
          [
            [Number(question.idQuestion)],
            this.getAnswer(question.idAnswer)
          ]
        ))
      ),
      13032: data.manageInvestmentsVia
    }
    );

    this.transactionalResources.set(
      data.originResource.map((rsc:any) => ({
        type: rsc.idOriginResource,
        text: this.getResourceText(rsc.idOriginResource),
        percentage: rsc.percentage,
      }))
    )
    if(data.maintenanceDelta){
      this.maintenanceQuiz.set(data.maintenanceDelta);
    }
  }

  clear(){
    this.investmentProfile.set({});
    this.maintenanceQuiz.set({});
    this.investmentProfileQuiz.set({});
    this.transactionalProfile.set({});
    this.transactionalResources.set([]);
    this.investmentQuizId.set(null);
    this.profileRating.set(null);
    this.investmentQuizCompleted.set(false);
  }

  clearFullSectionSignal(){
    this.fullSectionSignal.set(null);
    this.clear();
  }

  get fullSectionTransactionalInvestment(){
    return this.fullSectionSignal.asReadonly();
  }

  setFullSectionSignal(section: InvestmentProfileData){
    if(section.investmentProfile){
      this.investmentProfile.set(section.investmentProfile);
    }
    if(section.maintenanceQuiz){
      this.maintenanceQuiz.set(section.maintenanceQuiz);
    }
    if(section.investmentProfileQuiz){
      this.investmentProfileQuiz.set(section.investmentProfileQuiz);
    }
    if(section.transactionalProfile){
      this.transactionalProfile.set(section.transactionalProfile);
    }
    if(section.transactionalResources){
      this.transactionalResources.set(section.transactionalResources);
    }
    if(section.investmentQuizId){
      this.investmentQuizId.set(section.investmentQuizId);
    }
    if(section.profileRating){
      this.profileRating.set(section.profileRating);
    }
    this.investmentQuizCompleted.set(section.investmentQuizCompleted);
    this.onWorkFlow.set(section.onWorkFlow);
    this.fullSectionSignal.set(section);
  }
}
