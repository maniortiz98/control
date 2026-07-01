import { inject, Injectable } from '@angular/core';
import { from, mergeMap, Observable, retry, throwError, timer } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClientService } from '../../core/services/http-client.service';
import { CheckpointSections, CustomerCheckpointSections, CustomerCheckpointSectionsMant } from '../models/checkpoints/customer-sections.type';
import { Checkpoint, CustomerCheckpoint, CustomerCheckpointMaintenance } from '../models/checkpoints/customer-checkpoint';
import { CustomerSaveCheckpointMantResponse, CustomerSaveCheckpointResponse } from '../models/customer-checkpoint';
import { CustomerCurrentOnboardingInfo } from '../models/customer-current-onboarding';
import { CustomerOnboardingService } from './customer-onboarding.service';
import { AuthService } from '../../core/services/auth.service';
import * as CHECKPOINT_SECTIONS from '../constants/customer-checkpoint-sections';
import { NotificationModalService } from '../../shared/services/notification-modal.service';
import { NotificationsService } from '../../shared/services/notifications.service';

/**
 * Servicio de checkpoint específico para el módulo Customer.
 *
 * Replica la funcionalidad de CustomerCheckpointService (shared) pero agrega
 * el header { business: 'client' } a todas las peticiones HTTP.
 *
 * Se registra en CustomerModule como:
 *   { provide: CustomerCheckpointService, useClass: CustomerCheckpointService }
 *
 * Esto permite que todos los componentes/resolvers del módulo customer
 * reciban esta versión automáticamente via DI, sin cambiar imports.
 */
@Injectable()
export class CustomerCheckpointService {

  private readonly httpService = inject(HttpClientService);
  private readonly onboardingService = inject(CustomerOnboardingService);
  private readonly authService = inject(AuthService);
  private readonly notificationModalService = inject(NotificationModalService);
  private readonly notificationService = inject(NotificationsService);

  private readonly urlSave: string = environment.api.services.saveCheckpoint;
  private readonly urlGet: string = environment.api.services.getCheckpoints;
  private readonly urlGetMant: string = environment.api.services.getCheckpointsMant;
  private readonly urlSaveMant: string = environment.api.services.saveCheckpointMant;
  private readonly urlGetCustomer: any = environment.api.services.getCheckpointsCustomer;

  // Header adicional para identificar peticiones del módulo customer
  // NOTA: Funciona en desarrollo via proxy (/person -> develop-act.amarello.cloud).
  // Para produccion, el backend debe agregar 'business' a Access-Control-Allow-Headers.
  private readonly customerHeaders = { business: 'cliente' };

  /**
   * Saves / performs a checkpoint by section/tab
   */
  saveSection<T>(name: CustomerCheckpointSections, body: T): Observable<CustomerSaveCheckpointResponse> {
    const curr: CustomerCurrentOnboardingInfo = (this.onboardingService as any).getCurrentInfo();
    const data: CustomerCheckpoint<T> = {
      clientId: curr.requestId,
      sectionId: name,
      data: body
    };
    console.log(data);
    return this.httpService.post(this.urlSave, data, { headers: this.customerHeaders });
  }

  /**
   * Saves / performs a checkpoint in CustomerMaintenance mode by section/tab
   */
  saveSectionMant<T>(name: CustomerCheckpointSectionsMant, body: T): Observable<CustomerSaveCheckpointMantResponse> {
    const curr: CustomerCurrentOnboardingInfo = (this.onboardingService as any).getCurrentInfo();
    const data: CustomerCheckpointMaintenance<T> = {
      clientId: curr.clientId,
      sectionId: name,
      accountId: curr.accountId,
      advisorId: this.authService.getUserInfo()().employeeId,
      data: body,
    };
    console.log(data);
    return this.httpService.post(this.urlSaveMant, data, { headers: this.customerHeaders });
  }

  /**
   * Saves / performs a non-contract checkpoint in CustomerMaintenance mode
   */
  saveSectionNonContract<T>(name: string, body: T): Observable<any> {
    const curr: CustomerCurrentOnboardingInfo = (this.onboardingService as any).getCurrentInfo();
    const data = {
      clientId: curr.clientId ? curr.clientId.toString() : (curr.requestId ? curr.requestId.toString() : ''),
      advisorId: this.authService.getUserInfo()().employeeId ? this.authService.getUserInfo()().employeeId.toString() : '0',
      sectionId: name,
      data: body,
    };
    console.log("NonContract checkpoint request data: ", data);
    const url = environment.api.services.saveCheckpointNonContract || (environment.api.services.saveCheckpointMant + '/nonContract');
    return this.httpService.put(url, data, { headers: this.customerHeaders });
  }

  /**
   * Get info from sections given.
   */
  getSection<T = any>(name: CustomerCheckpointSections[], applicationId: string): Observable<any> {
    const data: CustomerCheckpoint<T> = {
      applicationId: applicationId,
      sectionId: name
    };
    return this.httpService.post(this.urlGet, data, { headers: this.customerHeaders });
  }

  /**
   * Retrieves all sections information - Persona Fisica
   */
  getSectionsByPersonaFisica(requestId: number): Observable<any> {
    const data = {
      applicationId: requestId,
      sectionId: CHECKPOINT_SECTIONS.CustomerCheckpointSectionsPF
    };
    return this.httpService.post(this.urlGet, data, { headers: this.customerHeaders });
  }

    getSectionID<T = any>(name: CheckpointSections[], id:string): Observable<any> {
    const data: Checkpoint<T> = {
      applicationId: id,
      sectionId: name
    };

    return this.httpService.post(this.urlGet, data);
  }

  /**
   * Retrieves all sections information - Persona Moral
   */
  getSectionsByPersonaMoral(requestId: number): Observable<any> {
    const data = {
      applicationId: requestId,
      sectionId: CHECKPOINT_SECTIONS.CustomerCheckpointSectionsPM
    };
    return this.httpService.post(this.urlGet, data, { headers: this.customerHeaders });
  }

  /**
   * Gets sections of Finished Onboarding - MAINTENANCE Persona Fisica
   */
  getMaintenanceSectionsByPersonaFisica(clientId: number, accountId: number, bankingAreadId: string): Observable<any> {
    const data = {
      applicationId: '' + clientId,
      accountId: '' + accountId,
      bankingAreaId: bankingAreadId,
      sectionId: CHECKPOINT_SECTIONS.CustomerCheckpointMaintenanceSectionsPF
    };
    return this.httpService.post(this.urlGetMant, data, { headers: this.customerHeaders });
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




export type CheckpointService = CustomerCheckpointService;

