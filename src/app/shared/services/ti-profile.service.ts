import { inject, Injectable, signal } from '@angular/core';
import { TransactionalResource } from '../../onboarding/models/general-info-pm';
import { transactionalResourcesQuestion } from './transactional-profile-quiz-data';
import { CatalogsService } from './catalogs.service';
import { Ranges } from '../../onboarding/models/origin-resource';

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
  public profileRating = signal<number | null>(null);
  public investmentQuizCompleted = signal<boolean>(false);

  public initialInvestmentProfile = {};
  public initialTransactionalProfile = {};
  public initialtransactionalResources = {};
  public initialMaintenanceQuiz = {};

  public initialInvestmentProfileQuiz = {};
  public initialProfileRating: null | number = null;

  public onWorkFlow = signal<boolean>(false);

  private readonly catalogsService = inject(CatalogsService);
  private allResources = signal<Array<Ranges>>([]);

  constructor(){
    this.catalogsService.getOriginResource({full: true, rangeId: "1"}).subscribe(i => {
      this.allResources.set(i);
    });

    this.initialInvestmentProfile = this.investmentProfile(); //header  form    
    this.initialTransactionalProfile = this.transactionalProfile(); //header  form    
    this.initialtransactionalResources = this.transactionalResources();
    this.initialMaintenanceQuiz = this.maintenanceQuiz();

    this.initialProfileRating = this.profileRating();
    this.initialInvestmentProfileQuiz = this.transactionalProfile(); // dinamyc form
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
}
