import { Component } from '@angular/core';
import { transactionalProfileSections } from '../../../shared/services/transactional-profile-quiz-data';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-ti-profile-pm',
  standalone: false,
  templateUrl: './ti-profile-pm.component.html',
  styleUrl: './ti-profile-pm.component.scss',
})
export class TiProfilePmComponent {
  public readonly transactionalProfilePMSections = transactionalProfileSections;
  public getQuizUrl: any = environment.api.salesPractices.getQuiz;
  public getQuizReprofilingUrl: any = environment.api.salesPractices.getQuizReprofilingUrl;
  public getQuizRateUrl: any = environment.api.salesPractices.getQuizRate;
  public getQuizRateReprofilingUrl: any = environment.api.salesPractices.getQuizRateReprofilingUrl;
}
