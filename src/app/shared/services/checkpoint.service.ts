import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClientService } from '../../core/services/http-client.service';

import { from, mergeMap, Observable, retry, throwError, timer } from 'rxjs';
import { CheckpointSections, CheckpointSectionsMant } from '../../onboarding/models/checkpoints/sections.type';
import { Checkpoint, CheckpointMaintenance } from '../../onboarding/models/checkpoints/checkpoint';
import { OnboardingService } from '../../onboarding/services/onboarding.service';
import { SaveCheckpointMantResponse, SaveCheckpointResponse } from '../models/checkpoint';
import * as CHECKPOINT_SECTIONS from '../../onboarding/constants/checkpoint-sections';
import { AuthService } from '../../core/services/auth.service';
import { NotificationModalService } from './notification-modal.service';
import { NotificationsService } from './notifications.service';

@Injectable({
  providedIn: 'root'
})
export class CheckpointService {

  private readonly httpService = inject(HttpClientService);
  private readonly onboardingService = inject(OnboardingService);
  private readonly authService = inject(AuthService);
  private readonly notificationModalService = inject(NotificationModalService);
  private readonly notificationService = inject(NotificationsService);

  private readonly urlSave: any = environment.api.services.saveCheckpoint;
  private readonly urlGet: any = environment.api.services.getCheckpoints;
  private readonly urlGetMant: any = environment.api.services.getCheckpointsMant;
  private readonly urlGetCustomer: any = environment.api.services.getCheckpointsCustomer;
  private readonly urlSaveMant: any = environment.api.services.saveCheckpointMant;

  constructor() { }


  /**
   * Saves / performs a checpoint by section/tab
   */
  saveSection<T>(name: CheckpointSections, body: T): Observable<SaveCheckpointResponse> {
    const data: Checkpoint<T> = {
      clientId: this.onboardingService.getCurrentInfo().requestId,
      sectionId: name,
      data: body,
      ...(this.onboardingService.getCurrentInfo().isCustomer ? { customerNumber: this.onboardingService.getCurrentInfo().clientId } : {})
    };
    console.log(data);
    return this.httpService.post(this.urlSave, data);
  }

    /**
   * Saves / performs a checpoint in Maintenance mode by section/tab in mant
   */
  saveSectionMant<T>(name: CheckpointSectionsMant, body: T): Observable<SaveCheckpointMantResponse> {
    const data: CheckpointMaintenance<T> = {
      clientId: this.onboardingService.getCurrentInfo().clientId,
      sectionId: name,
      accountId: this.onboardingService.getCurrentInfo().accountId,
      advisorId: this.authService.getUserInfo()().employeeId,
      data: body,
    };
    console.log(data);
    return this.httpService.post(this.urlSaveMant, data);
  }


  /**
   * Get info from sections given.
   */
  getSection<T = any>(name: CheckpointSections[]): Observable<any> {
    const data: Checkpoint<T> = {
      applicationId: this.onboardingService.getCurrentInfo().requestId,
      sectionId: name
    };

    return this.httpService.post(this.urlGet, data);
  }

    /**
   * Get info from sections given.
   */
  getSectionID<T = any>(name: CheckpointSections[], id:string): Observable<any> {
    const data: Checkpoint<T> = {
      applicationId: id,
      sectionId: name
    };

    return this.httpService.post(this.urlGet, data);
  }

  /**
   * Retrieves all sections information - Person Fisica
   */
  getSectionsByPersonaFisica(): Observable<any> {
    const data = {
        applicationId: this.onboardingService.getCurrentInfo().requestId,
        sectionId: CHECKPOINT_SECTIONS.CheckpointSectionsPF
    };

    return this.httpService.post(this.urlGet, data);
  }

  /**
   * Retrieves all sections information - Person Moral
   */
  getSectionsByPersonaMoral(): Observable<any> {
    const data = {
        applicationId: this.onboardingService.getCurrentInfo().requestId,
        sectionId: CHECKPOINT_SECTIONS.CheckpointSectionsPM
    };

    return this.httpService.post(this.urlGet, data);
  }

  /**
   * Gets sections of Finished Onboarding
   *
   * MAINTENANCE from PERSONA FISICA
   */
  getMaintenanceSectionsByPersonaFisica(): Observable<any> {
    const data = {
      applicationId: this.onboardingService.getCurrentInfo().clientId,
        accountId: this.onboardingService.getCurrentInfo().accountId,
        bankingAreaId: this.onboardingService.getCurrentInfo().businessType,
        sectionId: CHECKPOINT_SECTIONS.CheckpointMaintenanceSectionsPF
    };

    return this.httpService.post(this.urlGetMant, data);
  }

  /**
   * Get section of Finished Onboarding
   *
   * MAINTENANCE from PERSONA FISICA
   */
  getMaintenanceSectionByPersonaFisica(name: CheckpointSectionsMant[]): Observable<any> {
    const data = {
        applicationId: this.onboardingService.getCurrentInfo().clientId,
        accountId    : this.onboardingService.getCurrentInfo().accountId,
        bankingAreaId: this.onboardingService.getCurrentInfo().businessType,
        sectionId    : name
    };

    return this.httpService.post(this.urlGetMant, data);
  }

  /**
   * Get the sections for existing customers.
   *
   */
  getSectionsByCustomer(): Observable<any> {
    const data = {
        customerNumber: this.onboardingService.getCurrentInfo().clientId
      };

    return this.httpService.post(this.urlGetCustomer, data).pipe(
      retry({
        count: 3,
        delay: (error, retryCount) => {
          if (error?.status === 412) {
            this.notificationService.error('Dato no Encontrado');
            return throwError(() => error);
          }
          return from(
            this.notificationModalService.error({
              title: `Intento Fallido (${retryCount})`,
              afterMessages: ['Intenta Nuevamente'],
              btnAccept: 'OK',
            })
          ).pipe(
            mergeMap(() => timer(0))
          );
        },
      }
    ));
  }
}
