import { Component, effect, inject, OnInit, Signal } from '@angular/core';
import { Tabs } from '../../models/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { OnboardingService } from '../../services/onboarding.service';
import { CurrentOnboardingInfo } from '../../models/current-onboarding';
import { NotificationModalService } from '../../../shared/services/notification-modal.service';
import { UnsavedChangesService } from '../../../core/services/unsaved-changes.service';
import { Client } from '../../models/client-data';
import { MatDialog } from '@angular/material/dialog';
import { SendEmailComponent } from './modals/send-email/send-email.component';
import { ContractChangeStatusComponent } from './modals/contract-change-status/contract-change-status.component';
import { ExpandDateComponent } from './modals/expand-date/expand-date.component';
import { environment } from '../../../../environments/environment';
import { CheckpointService } from '../../../shared/services/checkpoint.service';
import { NotificationsService } from '../../../shared/services/notifications.service';
import { FirstDataClientService } from '../../../shared/services/storage-services/first-data-client.service';
import { AuthService } from '../../../core/services/auth.service';
import { UserInfo } from '../../../core/models/user-info';
import { ContractService } from '../../services/contract.service';
import { concatFullName } from '../../../shared/utils/string';
import { PermissionRolService } from '../../../core/services/rol.service';
import { AvailableMaintenanceActions, MaintenanceActions } from '../../../core/services/maintenance-actions-role';

interface DataModal {
    ok: boolean;
    data: any,
    table: any,
    edit: boolean,
    error: any
};
@Component({
  selector: 'app-new-customer',
  standalone: false,
  templateUrl: './new-customer.component.html',
  styleUrl: './new-customer.component.scss'
})
export class NewCustomerComponent implements OnInit {

  private readonly notificationModalService = inject(NotificationModalService);
  private readonly onboardingService        = inject(OnboardingService);
  private readonly router                   = inject(Router);
  private readonly route                    = inject(ActivatedRoute);
  private readonly unsavedChangesService    = inject(UnsavedChangesService);
  private readonly dialog                   = inject(MatDialog);
  private readonly checkpointService        = inject(CheckpointService);
  private readonly notificationService      = inject(NotificationsService);
  private readonly firstDataClientService   = inject(FirstDataClientService);
  private readonly authService              = inject(AuthService);
  private readonly contractService          = inject(ContractService);
  private readonly roleService              = inject(PermissionRolService);

  readonly userInfo: Signal<UserInfo> = this.authService.getUserInfo();

  currentOnboarding: CurrentOnboardingInfo = this.onboardingService.getCurrentInfo();
  currentInitialData: Client = this.onboardingService.getCustomerInitialData();
  tabs: Tabs[] = [];
  btnConfirmData = this.onboardingService.btnConfirmData;
  btnConfirmDataDisabled = this.onboardingService.btnConfirmDataDisabled;
  actionsPermission: MaintenanceActions;

  currentTab = this.onboardingService.currentTab;

  envName = environment.name;

  constructor() {
    const info = this.onboardingService.getCurrentInfo();
    this.actionsPermission = this.roleService.getActionButtonsPermission();

    if ( '' === info.contractSubtype && '' === info.contractType ) {
      // if ( this.envName != 'local' ) { // TODO Temp for Local Env
      // this.onboardingService.clearOnboardingInfo();
      // this.router.navigate(['/']);
      // }
    }
    this.onboardingService.setTabs();
    effect(() => {
      this.tabs = this.onboardingService.tabs();
      this.currentOnboarding = this.onboardingService.getCurrentInfo();
    });
  }

  /**
   *
   */
  ngOnInit(): void {
    const onboardingRegister = this.onboardingService.getOnboardingRegister();
    if (onboardingRegister && Object.keys(onboardingRegister).length > 0) {
      this.router.navigate(['../finalization'], { relativeTo: this.route });
      return;
    }

    this.validationsBefore();

    // const firstTab = this.onboardingService.getFirstTab();

    // redirects to PM or PF first tab
    // if ( 'PF' === this.currentOnboarding.personType ) {
    //   this.router.navigate(['customer-info'], {relativeTo: this.route});
    // } else if ( 'PM' === this.currentOnboarding.personType ) {
    //   this.router.navigate(['customer-info-pm'], {relativeTo: this.route});
    // }

    if ( this.currentOnboarding.isMaintenance ) {
      console.log("ESTOY EN MANTENIMIENTO, ONBOARDING CONCLUIDO");

      /* al llegar a "onboarding", habilita todas las tabs si llegas desde Maintenance */
      this.checkpointService.getMaintenanceSectionsByPersonaFisica().subscribe({
        next: (response: any) => {
          console.log(response);
          this.onboardingService.setCheckpointSectionsMant(response.checkpoints);
          if ( 'PF' === this.currentOnboarding.personType ) {
            this.router.navigate(['customer-info'], {relativeTo: this.route});
          } else if ( 'PM' === this.currentOnboarding.personType ) {
            this.router.navigate(['customer-info-pm'], {relativeTo: this.route});
          }
          this.onboardingService.enableTabs();
        },
        error: (err) => {
          console.error('Error:', err);
          this.onboardingService.clearOnboardingInfo();
          this.router.navigate(['/maintenance/search']);
        },
        complete: () => {
        }
      });

    } else if ( this.currentOnboarding.isCustomer ) {
      console.log("SOY CLIENTE EXISTENTE, NUEVO CONTRATO, ONBARDING NUEVO");

      // code flow
      this.checkpointService.getSectionsByCustomer()
      .subscribe({
        next: async (response: any) => {
          console.log(response);
          console.log(this.currentOnboarding.personType)
          this.onboardingService.updateCurrentOnboardingInfo({
            isOnboardingWL   : true,
          });
          await this.onboardingService.getCustomerInfo(response);
          if ( 'PF' === this.currentOnboarding.personType ) {
            this.router.navigate(['customer-info'], {relativeTo: this.route});
          } else if ( 'PM' === this.currentOnboarding.personType ) {
            this.router.navigate(['customer-info-pm'], {relativeTo: this.route});
          }
        },
        error: (err) => {
          console.error('Error:', err);
          this.router.navigate(['/']);
          this.onboardingService.restoreInitialTabs();
        },
        complete: () => {
        }
      });

    } else if ( this.currentOnboarding.isOnboarding ) {
      console.log("VENGO A CONTINUAR UN ONBOARDING INCOMPLETO");

      this.checkpointService.getSectionsByPersonaFisica()
      .subscribe({
        next: async (response: any) => {
          console.log(response);
          const initData = response.checkpoints.find((item: any) => item.sectionId === 'initial-data') ?? '';
          console.log(this.currentOnboarding.personType);
          if ( response.onboardingId?.trim() ) {
            this.onboardingService.updateCurrentOnboardingInfo({
            isOnboarding   : true,
            isCustomer     : false,
            requestId      : response.onboardingId,
            clientId       : response.customerNumber,
            isOnboardingWL   : true,
            contractType   : ''+(initData['data']['contraTypeId'] ?? ''),
            contractSubtype: ''+initData['data']['typeContractSubtypeId'],
            businessType   : ''+initData['data']['bankAreaTypeId'],
            name           : concatFullName(
                                initData['data']['firstName'],
                                initData['data']['nmiddleName'],
                                initData['data']['firstLastName'],
                                initData['data']['secondLastName']
                              )
          });
          }
          await this.onboardingService.setCheckpointSections(response.checkpoints);
          if ( 'PF' === this.currentOnboarding.personType ) {
            this.router.navigate(['customer-info'], {relativeTo: this.route});
          } else if ( 'PM' === this.currentOnboarding.personType ) {
            this.router.navigate(['customer-info-pm'], {relativeTo: this.route});
          }
        },
        error: (err) => {
          console.error('Error:', err);
          this.router.navigate(['/']);
          this.onboardingService.restoreInitialTabs();
        },
        complete: () => {
        }
      });

    } else {
      console.log("SOY CLIENTE NUEVO, CONTRATO NUEVO, ONBARDING NUEVO");
      this.onboardingService.updateCurrentOnboardingInfo({
            isOnboardingWL   : true,
          });
      if ( 'PF' === this.currentOnboarding.personType ) {
        this.router.navigate(['customer-info'], {relativeTo: this.route});
      } else if ( 'PM' === this.currentOnboarding.personType ) {
        this.router.navigate(['customer-info-pm'], {relativeTo: this.route});
      }

    }

    // if ( this.envName === 'local' ) { // TODO Temp for Local Env
    //   this.onboardingService.enableTabs();
    // }
  }

  /**
   *
   */
  onTabChange(event: number): void {
    const visibleTabs = this.tabs.filter(t => !t.hide);
    const selectedTab = visibleTabs[event];
    if (selectedTab) {
      this.onboardingService.setCurrentTab(event);
      this.router.navigate([selectedTab.path], { relativeTo: this.route });
    }
  }

  /**
   *
   */
  goback(): void {
    this.router.navigate(['/onboarding'], {relativeTo: this.route.parent});
  }

  /**
   *
   */
  async onConfirmData(){
    const registerData = this.onboardingService.getOnboardingRegister();
    if (registerData && Object.keys(registerData).length > 0) {
      this.router.navigate(['../finalization'], { relativeTo: this.route });
      return;
    }

    const result = await this.notificationModalService.review({
      title: 'Último Paso: Revisa, Corrige O Confirma La Información',
      btnAccept: 'Confirmar',
      btnDeny: 'Editar',
    });

    if (result?.value === true) {

      this.unsavedChangesService.setUnsavedChanges(false);

      this.onboardingService.finishOnboarding().subscribe(async (response: any) => {
        console.log(response);

        if ( 'SUCCESS' === response.status ) {
          this.onboardingService.setOnboardingRegister(response.data);
          this.router.navigate(['../finalization'], { relativeTo: this.route });
        } else if ( 'SUCCESS_WITH_WARNINGS' === response.status ) {
          this.onboardingService.setOnboardingRegister(response.data);
          this.notificationService.warning(response.messages);
          this.router.navigate(['../finalization'], { relativeTo: this.route });
        } else if ( 'PLD_CHECK_REQUIRED' === response.status ) {
          await this.notificationModalService.warning({
            title: '¡Atención!',
            afterCopyMessages: [response.messages],
            btnAccept: 'Aceptar',
          });
          this.onboardingService.showTabs('pld-quiz');
          this.onboardingService.setCurrentTab(17);
          // this.router.navigate(['pld-quiz'], {relativeTo: this.route});
        } else if ( 'HOMONYM_FOUND' === response.status ) {
          await this.notificationModalService.error({
            title: '¡Atención!',
            afterCopyMessages: [response.messages],
            btnAccept: 'Aceptar',
          });
          this.router.navigate(['/'], { relativeTo: this.route.parent });
        } else if ( 'BLACKLIST_PPE_FOUND' === response.status ) {
          await this.notificationModalService.warning({
            title: '¡Atención!',
            afterCopyMessages: [response.messages],
            btnAccept: 'Aceptar',
          });
          this.firstDataClientService.updatePpeItem();
          this.router.navigate(['ppe-info'], {relativeTo: this.route});
        } else if ( 'BLACKLIST_FOUND' === response.status ) {
          if(response.data.step === 1){
            const list = this.getListValues(response.data.blackLists);
            await this.notificationModalService.error({
              title: response.messages,
              beforeMessages: [list],
              afterMessages: ['Consultar con el área de PLD'],
              btnAccept: 'Terminar',
            });
            this.router.navigate(['/'], { relativeTo: this.route.parent });
          }else if(response.data.step === 2){
            await this.notificationModalService.warning({
              title: '¡Atención!',
              afterCopyMessages: [response.messages],
              afterMessages: ['El Cliente en cuestión ha sido remitido al Área de PLD para su revisión.'],
            });
            this.router.navigate(['/'], { relativeTo: this.route.parent });
          }
        } else if ( 'MEMBERS_IN_BLACKLIST' === response.status ) {
          let typeData = this.findStep(response.data);
          if(typeData === 1){
            await this.notificationModalService.error({
              title: response.messages,
              beforeMessages: [],
              afterMessages: ['Consultar con el área de PLD'],
              btnAccept: 'Terminar',
            });
            this.router.navigate(['/'], { relativeTo: this.route.parent });
          }else if(typeData === 2){
            await this.notificationModalService.warning({
              title: '¡Atención!',
              afterCopyMessages: [response.messages],
              afterMessages: ['El Cliente en cuestión ha sido remitido al Área de PLD para su revisión.'],
            });
            this.router.navigate(['/'], { relativeTo: this.route.parent });
          }
        }else if ( 'MISSING_SECTIONS' === response.status ) {
          await this.notificationModalService.error({
            title: response.messages,
            beforeMessagesNotIcon:response.data.missingSections,
            btnAccept: 'Aceptar',
          });
        }
      });
    }

    else {
      console.log("keep editing");
    }
  }

  /**
   * Event triggered when user clicks on "Enviar Correo" button
   * on Maintenance
   */
  sendEmailEvent(): void {
    const data = {};
    const dialogRef = this.dialog.open(SendEmailComponent, {
      maxWidth: '99%',
      width: '50%',
      // height: '90%',
      data,
      disableClose: false,
      panelClass: 'panel-class'
    });

    dialogRef.afterClosed().subscribe((modalData: DataModal) => {
      console.log(modalData);
      if ( modalData.ok ) {
      }
    });
  }

  /**
   * Event triggered when click on "Cambiar Status" button
   * on Maintenance
   */
  contractApprovalEvent(): void {
    const dialogRef = this.dialog.open(ContractChangeStatusComponent, {
      width: '900px',
      maxWidth: '99vw',
      height: '85%',
      maxHeight: '90%',
      panelClass: 'panel-class',
      data: this.currentOnboarding.accountData,
    });

    dialogRef.afterClosed().subscribe(async (modalData: DataModal) => {
      if ( modalData !== undefined ) {
        if ( modalData.ok ) {
          this.notificationService.success('Cambio de Estatus Exitoso.');
        } //else {
        //   if(modalData?.error?.error?.status === 412){
        //   //   const mensaje = modalData.error.error.messages[0].replace(/"/g, "").split(":").slice(1).join(":");
        //   //   await this.notificationModalService.warning({
        //   //   title: '¡Atención!',
        //   //   afterCopyMessages: [mensaje],
        //   //   btnAccept: 'Aceptar',
        //   // });
        //   }else{
        //     this.notificationService.error('Hubo un Error', 'Intente de Nuevo');
        //   }
        // }
      }
    });
  }

  /**
   *
   */
  expandDateEvent(): void {
    const data = {};
    const dialogRef = this.dialog.open(ExpandDateComponent, {
      width: '30%',
      maxWidth: '99vw',
      panelClass: 'panel-class',
      data
    });

    dialogRef.afterClosed().subscribe((modalData: DataModal) => {
      console.log(modalData);
      if ( modalData.ok ) {
      }
    });
  }

  /**
   *
   */
  onExit(){
    console.log("exit clicked");
    this.unsavedChangesService.setUnsavedChanges(false);
    this.router.navigate(['/'], { relativeTo: this.route.parent });
  }

  /**
   * Validations at the begining of OnInit method
   *
   * set here any validation you need.
   */
  validationsBefore(): void {

    // dont show "bank-account" tab if specific contract.
    if (
        ('5' === this.currentOnboarding.contractType && '45' === this.currentOnboarding.contractSubtype ) ||
        ('6' === this.currentOnboarding.contractType && '46' === this.currentOnboarding.contractSubtype )
    ) {
      this.onboardingService.hideTabs('bank-account');
    }

  }

  /**
   *
   */
  getListValues = (list?: any) => list?.map((item: { type: any; }) => item.type) || [];

  /**
   *
   */
  findStep: any = (data: any[]): number => {
    const step1 = data.find(item => item.step === 1);
    if (step1) {
        return 1;
    }
    const step2 = data.find(item => item.step === 2);
    if (step2) {
        return 2;
    }
    return -1;
  };

  /**
   *
   */
  additionalValidationPrintKit(): boolean {

    if ( 'ROL_ASESOR_FIN' !== this.userInfo().rol ) return true;

    /*
      TEMPORAL REMOVE VALIDATION:
      && 'NUEVO' === this.currentOnboarding.accountData?.accountStatus
    */
    if ( 'ROL_ASESOR_FIN' === this.userInfo().rol ) {
      return true;
    }

    return false;
  }

  /**
   * Re Print Kit Event
   *
   */
  rePrintKit(): void {
    this.contractService.callReprintContracts().subscribe((response: {filePdf: string;}) => {
      if ( 'OK' === response.filePdf ) {
        this.notificationService.success('Documentos Generados.');
      } else {
        this.notificationService.error(response.filePdf);
      }

    });
  }

  /**
   * Replicate Contract
   *
   * button event
   */
  replicateContract(): void {
    this.contractService.replicateContract().subscribe((response: any) => {
      console.log(response);
      if ( true ) {
        this.notificationService.success('Réplica Exitosa.');
      } else {
        this.notificationService.error('error');
      }
    });
  }
}
