import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClientService } from '../../core/services/http-client.service';

import { from, mergeMap, Observable, retry, throwError, timer } from 'rxjs';
import { CustomerCheckpointSections, CustomerCheckpointSectionsMant } from '../models/checkpoints/customer-sections.type';
import { CustomerCheckpoint, CustomerCheckpointMaintenance } from '../models/checkpoints/customer-checkpoint';
import { CustomerOnboardingService } from './customer-onboarding.service';
import { CustomerSaveCheckpointMantResponse, CustomerSaveCheckpointResponse } from '../models/customer-checkpoint';
import * as CHECKPOINT_SECTIONS from '../constants/customer-checkpoint-sections';

import { AuthService } from '../../core/services/auth.service';
import { CustomerNotificationModalService } from './customer-notification-modal.service';
import { CustomerNotificationsService } from './customer-notifications.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerCheckpointService {

  private readonly httpService = inject(HttpClientService);
  private readonly onboardingService = inject(CustomerOnboardingService);
  private readonly authService = inject(AuthService);
  private readonly notificationModalService = inject(CustomerNotificationModalService);
  private readonly notificationService = inject(CustomerNotificationsService);

  private readonly urlSave: any = environment.api.services.saveCheckpoint;
  private readonly urlGet: any = environment.api.services.getCheckpoints;
  private readonly urlGetMant: any = environment.api.services.getCheckpointsMant;
  private readonly urlGetCustomer: any = environment.api.services.getCheckpointsCustomer;
  private readonly urlSaveMant: any = environment.api.services.saveCheckpointMant;

  constructor() { }


  /**
   * Saves / performs a checpoint by section/tab
   */
  saveSection<T>(name: CustomerCheckpointSections, body: T): Observable<CustomerSaveCheckpointResponse> {
    const data: CustomerCheckpoint<T> = {
      clientId: (this.onboardingService as any).getCurrentInfo().requestId,
      sectionId: name,
      data: body,
      ...((this.onboardingService as any).getCurrentInfo().isCustomer ? { customerNumber: (this.onboardingService as any).getCurrentInfo().clientId } : {})
    };
    console.log(data);
    return this.httpService.post(this.urlSave, data);
  }

    /**
   * Saves / performs a checpoint in CustomerMaintenance mode by section/tab in mant
   */
  saveSectionMant<T>(name: CustomerCheckpointSectionsMant, body: T): Observable<CustomerSaveCheckpointMantResponse> {
    const data: CustomerCheckpointMaintenance<T> = {
      clientId: (this.onboardingService as any).getCurrentInfo().clientId,
      sectionId: name,
      accountId: (this.onboardingService as any).getCurrentInfo().accountId,
      advisorId: this.authService.getUserInfo()().employeeId,
      data: body,
    };
    console.log(data);
    return this.httpService.post(this.urlSaveMant, data);
  }


  /**
   * Get info from sections given.
   */
  getSection<T = any>(name: CustomerCheckpointSections[]): Observable<any> {
    const data: CustomerCheckpoint<T> = {
      applicationId: (this.onboardingService as any).getCurrentInfo().requestId,
      sectionId: name
    };

    return this.httpService.post(this.urlGet, data);
  }

  /**
   * Retrieves all sections information - Person Fisica
   */
  getSectionsByPersonaFisica(): Observable<any> {
    const data = {
        applicationId: (this.onboardingService as any).getCurrentInfo().requestId,
        sectionId: CHECKPOINT_SECTIONS.CustomerCheckpointSectionsPF
    };

    return this.httpService.post(this.urlGet, data);
  }

  /**
   * Retrieves all sections information - Person Moral
   */
  getSectionsByPersonaMoral(): Observable<any> {
    const data = {
        applicationId: (this.onboardingService as any).getCurrentInfo().requestId,
        sectionId: CHECKPOINT_SECTIONS.CustomerCheckpointSectionsPM
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
      applicationId: (this.onboardingService as any).getCurrentInfo().clientId,
        accountId: (this.onboardingService as any).getCurrentInfo().accountId,
        bankingAreaId: (this.onboardingService as any).getCurrentInfo().businessType,
        sectionId: CHECKPOINT_SECTIONS.CustomerCheckpointMaintenanceSectionsPF
    };

    return this.httpService.post(this.urlGetMant, data);
  }

  /**
   * Get section of Finished Onboarding
   *
   * MAINTENANCE from PERSONA FISICA
   */
  getMaintenanceSectionByPersonaFisica(name: CustomerCheckpointSectionsMant[], {} as any): Observable<any> {
    const data = {
        applicationId: (this.onboardingService as any).getCurrentInfo().clientId,
        accountId    : (this.onboardingService as any).getCurrentInfo().accountId,
        bankingAreaId: (this.onboardingService as any).getCurrentInfo().businessType,
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
        customerNumber: (this.onboardingService as any).getCurrentInfo().clientId
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





export type CheckpointServiceCore = CustomerCheckpointService;

