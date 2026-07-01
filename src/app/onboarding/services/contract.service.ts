import { effect, inject, Injectable } from '@angular/core';
import { HttpClientService } from '../../core/services/http-client.service';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { OnboardingService } from './onboarding.service';
import { CurrentOnboardingInfo } from '../models/current-onboarding';
import { AuthService } from '../../core/services/auth.service';
import { ContractChangeStatusHistory, UpdateStatusBody, UpdateStatusFormValue, UpdateStatusResponse } from '../models/contract-change-status';
import { NotificationRequest, NotificationService } from '../../shared/services/notifications/notification.service';

@Injectable({
  providedIn: 'root'
})
export class ContractService {

  private readonly http                = inject(HttpClientService);
  private readonly onboardingService   = inject(OnboardingService);
  private readonly authService         = inject(AuthService);
  private readonly notificationService = inject(NotificationService);

  private readonly urls: any = {
    rePrint          : environment.api.rePrintContracts,
    replicateContract: environment.api.maintenance.replicateContract,
    updateStatus     : environment.api.maintenance.updateStatus,
    statusHistory    : environment.api.maintenance.updateStatusHistory,
  };

  private currentInfo: CurrentOnboardingInfo = this.onboardingService.getCurrentInfo();

  /**
   * Constructor
   */
  constructor() {
    effect(() => {
      this.currentInfo = this.onboardingService.getCurrentInfo();
    });
  }

  /**
   * Calls Re Print contacts service.
   *
   */
  callReprintContracts(): Observable<any> {
    const bp: {bankingArea: number; contractNumber: number; } = {
      bankingArea: Number(this.currentInfo.businessType),
      contractNumber: this.currentInfo.accountId
    };
    return this.http.post(this.urls.rePrint, bp);
  }

  /**
   * Replicate Contract
   */
  replicateContract(): Observable<any> {
    const bp: {bankingArea: string; accountNumber: string; } = {
      bankingArea: this.currentInfo.businessType,
      accountNumber: this.currentInfo.accountId.toString()
    };
    return this.http.post(this.urls.replicateContract, bp);
  }

  /**
   * Gets the history of status changes
   */
  changeStatusHistory(): Observable<ContractChangeStatusHistory[]> {
    const body: {
      contractNumber: number;
      clientNumber  : number;
      bankingArea   : string;
    } = {
      contractNumber: this.currentInfo.accountId,
      clientNumber  : this.currentInfo.clientId,
      bankingArea   : this.currentInfo.businessType
    };
    return this.http.post(this.urls.statusHistory, body);
  }

  /**
   * Call service "update-status"
   *
   * repsonse:
   * {
   *   "contract": 18,
   *   "newStatus": "C05"
   * }
   *
   */
  updateStatus(body: UpdateStatusFormValue): Observable<UpdateStatusResponse> {
    const bp: UpdateStatusBody = {
      contract   : this.currentInfo.accountId,
      bankingArea: this.currentInfo.businessType,
      status     : body.newStatus,
      userId     : this.authService.getUserInfo()().employeeId,
      requestId  : body.requestor,
      cause      : body.changeCause,
      comment    : body.observations
    };

    return this.http.post(this.urls.updateStatus, bp);
  }

  /**
   *
   * @returns
   */
  sendContractStatusChangeNotification(): Observable<any> {
    const bb: NotificationRequest = {
      clientId     : this.currentInfo.clientId.toString(),
      accountId    : this.currentInfo.accountId.toString(),
      notifications: ['CANCELED_CONTRACT']
    };

    console.log(bb);
    return this.notificationService.sendNotifications('notifications', bb);
  }

}
