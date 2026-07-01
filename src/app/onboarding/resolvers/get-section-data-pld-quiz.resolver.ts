import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { catchError, map, Observable, of } from 'rxjs';
import { PldQuizService } from '../../shared/services/pld-quiz.service';
import { CheckpointService } from '../../shared/services/checkpoint.service';
import { OnboardingService } from '../services/onboarding.service';
import { CurrentOnboardingInfo } from '../models/current-onboarding';
import { checkpointToPldQuiz } from '../services/mappers/pld-quiz-mapper';

@Injectable({
  providedIn: 'root'
})
export class getSectionDataPldQuizResolver implements Resolve<any> {
  private readonly onboardingService = inject(OnboardingService);
  private readonly checkpointService = inject(CheckpointService);
  private readonly pldQuizService = inject(PldQuizService);

  constructor() { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    const currentOnboarding: CurrentOnboardingInfo = this.onboardingService.getCurrentInfo();
    if (currentOnboarding.isOnboarding && !this.pldQuizService.isRequested()) {
      return this.checkpointService.getSection(['questionnairePld']).pipe(
        map((response: any) => {
          this.pldQuizService.set(response['checkpoints'][0]['data']);
          return true;
        }),
        catchError((err: any) => {
          console.log('Error retrieving \"questionnaire-pld\" data section.');
          console.log(err);
          return of(null);
        })
      );
    } else if (currentOnboarding.isMaintenance && !this.pldQuizService.isRequested()) {
      return this.checkpointService.getMaintenanceSectionByPersonaFisica(['questionnairePld']).pipe(
        map((response: any) => {
          this.pldQuizService.set(response['checkpoints'][0]['data']);
          return true;
        }),
        catchError((err: any) => {
          console.log('Error retrieving \"questionnaire-pld\" data section (Mantto.).');
          console.log(err);
          return of(null);
        })
      );
    } else {
      return of(null);
    }
  }
};
