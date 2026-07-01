import { inject, Injectable } from '@angular/core';
import { NotificationModalService } from './notification-modal.service';
import { NotificationsService } from './notifications.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { UnsavedChangesService } from '../../core/services/unsaved-changes.service';
import { ChangesIdentification, RequestIdentification, ResposeIdentification } from '../../onboarding/models/identification-curp-rfc';
import { AllowedValuesRfcNifTinNss, compareAndReturnRfcNifTinNss } from '../utils/map-rfc-nif-tin-nss';
import { IdentificationCurpRfcService } from './identification-curp-rfc.service';
import { from, lastValueFrom, retry } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { compareAndReturnGender } from '../utils/maper-gender';
import { OnboardingService } from '../../onboarding/services/onboarding.service';

@Injectable({
  providedIn: 'root'
})
export class FlowCurpRfcService {

  private readonly identificationCurpRfcService = inject(IdentificationCurpRfcService);
  private readonly notificationModalService = inject(NotificationModalService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly notificationService = inject(NotificationsService);
  private readonly dialog = inject(MatDialog);
  private readonly unsavedChangesService = inject(UnsavedChangesService);
  private readonly authService = inject(AuthService);
  response: ResposeIdentification | undefined;

  async validChangesInCURPandRFC(data: ChangesIdentification): Promise<boolean> {
    console.log(data);
    const rolName = this.authService.getUserInfo();
      if ((data.new.curp != data.old.curp)
        || (compareAndReturnRfcNifTinNss(data.new.rfc, AllowedValuesRfcNifTinNss.RFC, data.new.typeIden)
          != data.old.rfc)) {
        const dataBody: RequestIdentification = {
          clientNumber: data.new.clientNumber,
          nameOrBusinessName: data.new.firstName,
          lastName: data.new.lastName,
          secondLastName: data.new.secondLastName,
          secondName: data.new.secondName,
          genderId: data.new.gender,
          birthDate: data.new.birthDate,
          birthStateId: data.new.birthState,
          rfc: data.new.rfc,
          curp: data.new.curp,
          user: this.authService.getUserInfo()().employeeId
        }
        try {
          this.response = await lastValueFrom(
            this.identificationCurpRfcService.postDataIdentificationCurpRfcService(dataBody).pipe(
              retry({
                count: 3,
                delay: (error, retryCount) => {
                  if (error?.status === 412) {
                    return from((async () => {
                      this.closeAllDialogs(true);
                      await this.notificationModalService.error({
                        title: '¡Atención!',
                        afterMessages: [this.response?.message ?? 'Work Flow Identificación Pendiente']
                      });
                      this.unsavedChangesService.setUnsavedChanges(false);
                      this.router.navigate(['/'], { relativeTo: this.route.parent });
                      return false;
                    })());
                  }
                  return from(
                    this.notificationModalService.warning({
                      title: `Intento Fallido (${retryCount})`,
                      afterMessages: ['Intenta Nuevamente'],
                      btnAccept: 'OK',
                    })
                  );
                },
              })
            )
          );
          this.closeAllDialogs(true);
          await this.notificationModalService.warning({
            title: '¡Atención!',
            infoToCopy: '' + this.response.idWorkFlowDetalle,
            afterMessages: ['Se ha Generado el Siguiente Work Flow ']
          });
          this.unsavedChangesService.setUnsavedChanges(false);
          this.router.navigate(['/'], { relativeTo: this.route.parent });
          return false;
        } catch (error) {
          this.notificationService.error('Fallo al Crear el WF');
          return false;
        }
      } else {
        return true;
      }
  }

  private closeAllDialogs(includeKeepOnHttpError = false): void {
    this.dialog.openDialogs.forEach((dialogRef) => {
      const keepOpen =
        (dialogRef.componentInstance as any)?.data?.keepOnHttpError === true;
      if (!keepOpen || includeKeepOnHttpError) {
        dialogRef.close();
      }
    });
  }
}
