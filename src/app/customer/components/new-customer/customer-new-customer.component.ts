import { Component, effect, inject, OnInit } from '@angular/core';
import { CustomerTabs } from '../../models/customer-tabs';
import { ActivatedRoute, Data, Router } from '@angular/router';
import { CustomerOnboardingService } from '../../services/customer-onboarding.service';
import { CustomerCurrentOnboardingInfo } from '../../models/customer-current-onboarding';
import { CustomerNotificationModalService } from '../../services/customer-notification-modal.service';
import { UnsavedChangesService } from '../../../core/services/unsaved-changes.service';
import { CustomerClient } from '../../models/customer-client-data';
import { environment } from '../../../../environments/environment';
import { CustomerCheckpointService } from '../../services/customer-customer-checkpoint-core.service';
import { CustomerNotificationsService } from '../../services/customer-notifications.service';
import { CustomerFirstDataClientService } from '../../services/storage-services/customer-first-data-client.service';
import { CustomerContractService } from '../../services/contract.service';

@Component({
  selector: 'app-customer-new-customer',
  standalone: false,
  templateUrl: './customer-new-customer.component.html',
  styleUrl: './customer-new-customer.component.scss'
})
export class CustomerNewCustomerComponent implements OnInit {

  private readonly notificationModalService = inject(CustomerNotificationModalService);
  private readonly onboardingService = inject(CustomerOnboardingService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly unsavedChangesService = inject(UnsavedChangesService);
  private readonly checkpointService = inject(CustomerCheckpointService);
  private readonly notificationService = inject(CustomerNotificationsService);
  private readonly firstDataClientService = inject(CustomerFirstDataClientService);
  private readonly contractService = inject(CustomerContractService);

  currentOnboarding: CustomerCurrentOnboardingInfo = (this.onboardingService as any).getCurrentInfo();
  currentInitialData: CustomerClient = (this.onboardingService as any).getCustomerInitialData();

  disabled = this.onboardingService.getCurrentInfo().isMaintenance;

  personTypeSelected = ''; // legal - person
  contractSelected: any = { // el objeto
    personType: '1',           // Persona Fisica / Persona Moral
    bankAreaTypeId: 0,         // Tipo de Negocio => Casa de Bolsa / Banco
    contractTypeId: 0,         // Contrato id
    contractType: '',          // Contrato Name
    typeContractSubtypeId: 0,  // Sub Contrato
    typeContractSubtype: ''    // Sub Contrato Name
  };

  tabs: CustomerTabs[] = [];
  btnConfirmData = (this.onboardingService as any).btnConfirmData;
  btnConfirmDataDisabled = (this.onboardingService as any).btnConfirmDataDisabled;

  currentTab = (this.onboardingService as any).currentTab;

  envName = environment.name;

  constructor() {
    const info = (this.onboardingService as any).getCurrentInfo();
    if ('' === info.contractSubtype && '' === info.contractType) {
      // if ( this.envName != 'local' ) { // TODO Temp for Local Env
      // (this.onboardingService as any).clearOnboardingInfo();
      // this.router.navigate(['/']);
      // }
    }
    (this.onboardingService as any).setTabs();
    effect(() => {
      this.tabs = (this.onboardingService as any).tabs();
      this.currentOnboarding = (this.onboardingService as any).getCurrentInfo();
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

    // const firstTab = (this.onboardingService as any).getFirstTab();

    // redirects to PM or PF first tab
    // if ( 'PF' === this.currentOnboarding.personType ) {
    //   this.router.navigate(['customer-info'], {relativeTo: this.route});
    // } else if ( 'PM' === this.currentOnboarding.personType ) {
    //   this.router.navigate(['customer-info-pm'], {relativeTo: this.route});
    // }

    // (this.onboardingService as any).updateCurrentOnboardingInfo({isMaintenance: true}); // TODO Temp for Local Env

    if (this.currentOnboarding.isCustomer) { // vengo de alta de contrato a cliente existente

      console.log("SOY CLIENTE EXISTENTE, NUEVO CONTRATO, ONBARDING NUEVO");
      (this.onboardingService as any).getCustomerInfo();
      // code flow

    } else if (this.currentOnboarding.isOnboarding) { // vengo de buscar un onboarding no concluido
      this.checkpointService.getSectionID(['initial-data'
        ,'general-information', 'identification-contact'
        , 'ppe-information', 'address', 'fiscal-self-declaration'], this.currentOnboarding.requestId?.toString())
        .subscribe({
          next: async (response: any) => {
            console.log(response);
            console.log(this.currentOnboarding.personType)
            await this.onboardingService.setCheckpointSections(response.checkpoints);
            console.log(this.currentOnboarding.personType)
            if ('PF' === this.currentOnboarding.personType) {
              // this.router.navigate(['customer-info'], { relativeTo: this.route });
              this.navigate('next');
            } else if ('PM' === this.currentOnboarding.personType) {
              this.router.navigate(['customer-info-pm'], { relativeTo: this.route });
            }
          },
          error: (err: any) => {
            console.error('Error:', err);
            this.router.navigate(['/']);
          },
          complete: () => {
          }
        });

    } else { // vengo de "alta de cliente", cliente nuevo - contrato nuevo
      if ('PF' === this.currentOnboarding.personType && !this.currentOnboarding.isMaintenance) {
        console.log("SOY CLIENTE NUEVO 1, CONTRATO NUEVO, ONBARDING NUEVO");
        this.router.navigate(['customer-info'], { relativeTo: this.route });
      } else if ('PM' === this.currentOnboarding.personType) {
        console.log("SOY CLIENTE NUEVO 2, CONTRATO NUEVO, ONBARDING NUEVO");
        this.router.navigate(['customer-info-pm'], { relativeTo: this.route });
      }
      console.log("SOY CLIENTE NUEVO, CONTRATO NUEVO, ONBARDING NUEVO");

      if (this.currentOnboarding.isMaintenance) {
        console.log("SOY CLIENTE QUE EXISTE, Y VOY A MANTENIMIENTO");
        this.checkpointService.getSectionsByCustomer()
        .subscribe({
        next: async (response: any) => {
          console.log(response);
          console.log(this.currentOnboarding.personType)
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
        this.navigateMant('next')
      }

    }

    // if ( this.envName === 'local' ) { // TODO Temp for Local Env
    //   (this.onboardingService as any).enableTabs();
    // }
  }

  /**
   *
   */
  onTabChange(event: number): void {
    const visibleTabs = this.tabs.filter(t => !t.hide);
    const selectedTab = visibleTabs[event];
    if (selectedTab) {
      (this.onboardingService as any).setCurrentTab(event);
      this.router.navigate([selectedTab.path], { relativeTo: this.route });
    }
  }

  /**
   *
   */
  goback(): void {
    (this.onboardingService as any).clearOnboardingInfo();
    this.router.navigate(['/onboarding'], { relativeTo: this.route.parent });
  }

  /**
   *
   */
  async onConfirmData() {
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

      (this.onboardingService as any).finishOnboarding().subscribe(async (response: any) => {
        console.log(response);

        if ('SUCCESS' === response.status) {
          (this.onboardingService as any).setOnboardingRegister(response.data);
          this.router.navigate(['../finalization'], { relativeTo: this.route });
        } else if ('SUCCESS_WITH_WARNINGS' === response.status) {
          (this.onboardingService as any).setOnboardingRegister(response.data);
          this.notificationService.warning(response.messages);
          this.router.navigate(['../finalization'], { relativeTo: this.route });
        } else if ('PLD_CHECK_REQUIRED' === response.status) {
          await this.notificationModalService.warning({
            title: '¡Atención!',
            afterCopyMessages: [response.messages],
            btnAccept: 'Aceptar',
          });
          (this.onboardingService as any).showTabs('pld-quiz');
          this.router.navigate(['pld-quiz'], { relativeTo: this.route });
        } else if ('HOMONYM_FOUND' === response.status) {
          await this.notificationModalService.error({
            title: '¡Atención!',
            afterCopyMessages: [response.messages],
            btnAccept: 'Aceptar',
          });
          this.router.navigate(['/'], { relativeTo: this.route.parent });
        } else if ('BLACKLIST_PPE_FOUND' === response.status) {
          await this.notificationModalService.warning({
            title: '¡Atención!',
            afterCopyMessages: [response.messages],
            btnAccept: 'Aceptar',
          });
          this.firstDataClientService.updatePpeItem();
          this.router.navigate(['ppe-info'], { relativeTo: this.route });
        } else if ('BLACKLIST_FOUND' === response.status) {
          if (response.data.step === 1) {
            const list = this.getListValues(response.data.blackLists);
            await this.notificationModalService.error({
              title: response.messages,
              beforeMessages: [list],
              afterMessages: ['Consultar con el área de PLD'],
              btnAccept: 'Terminar',
            });
            this.router.navigate(['/'], { relativeTo: this.route.parent });
          } else if (response.data.step === 2) {
            await this.notificationModalService.warning({
              title: '¡Atención!',
              afterCopyMessages: [response.messages],
              afterMessages: ['El Cliente en cuestión ha sido remitido al Área de PLD para su revisión.'],
            });
            this.router.navigate(['/'], { relativeTo: this.route.parent });
          }
        } else if ('MEMBERS_IN_BLACKLIST' === response.status) {
          let typeData = this.findStep(response.data);
          if (typeData === 1) {
            await this.notificationModalService.error({
              title: response.messages,
              beforeMessages: [],
              afterMessages: ['Consultar con el área de PLD'],
              btnAccept: 'Terminar',
            });
            this.router.navigate(['/'], { relativeTo: this.route.parent });
          } else if (typeData === 2) {
            await this.notificationModalService.warning({
              title: '¡Atención!',
              afterCopyMessages: [response.messages],
              afterMessages: ['El Cliente en cuestión ha sido remitido al Área de PLD para su revisión.'],
            });
            this.router.navigate(['/'], { relativeTo: this.route.parent });
          }
        } else if ('MISSING_SECTIONS' === response.status) {
          await this.notificationModalService.error({
            title: response.messages,
            beforeMessagesNotIcon: response.data.missingSections,
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
   *
   */
  onExit() {
    console.log("exit clicked");
    // TODO: check what else should do
  }

  /**
   * Validations at the begining of OnInit method
   *
   * set here any validation you need.
   */
  validationsBefore(): void {

    // dont show "customer-bank-account" tab if specific contract.
    if (
      ('5' === this.currentOnboarding.contractType && '45' === this.currentOnboarding.contractSubtype) ||
      ('6' === this.currentOnboarding.contractType && '46' === this.currentOnboarding.contractSubtype)
    ) {
      (this.onboardingService as any).hideTabs('customer-bank-account');
    }

    // BEAT Strategy: Hide tabs that do not apply for "Alta de Personas"
    (this.onboardingService as any).hideTabs('customer-transactional-investment-profile');
    (this.onboardingService as any).hideTabs('customer-real-owner');
  }

  /**
   * if user selects PM or PF
   */
  selectTypePerson(type: 'legal' | 'person'): void {
    if (this.personTypeSelected == type) {
      this.personTypeSelected = '';
    } else {
      this.personTypeSelected = type;
    }

    this.contractSelected = {
      personType: (this.personTypeSelected === 'person' ? '1' : '2'),
      bankAreaTypeId: 0,
      contractTypeId: 0,
      contractType: '',
      typeContractSubtypeId: 0,
      typeContractSubtype: '',
    };
  }

  /**
   *
   */
  navigate(where: 'next' | 'back'): void {
    if ('next' === where) {
      this.currentInitialData.personType = this.personTypeSelected === 'person' ? '1' : '2';

      (this.onboardingService as any).updateCurrentOnboardingInfo({
        personType: this.personTypeSelected === 'person' ? 'PF' : 'PM',
        contractType: 'BEAT', // Indicativo para flujo BEAT
      });

      (this.onboardingService as any).setCustomerInitalData(this.currentInitialData);
      this.router.navigate(['customer-info'], { relativeTo: this.route });
    }
  }

  navigateMant(where: 'next' | 'back'): void {
   if ('next' === where) {
      this.currentInitialData.personType = '1';

      (this.onboardingService as any).updateCurrentOnboardingInfo({
        personType: 'PF',
        contractType: 'BEAT', // Indicativo para flujo BEAT
      });

      (this.onboardingService as any).setCustomerInitalData(this.currentInitialData);
      this.router.navigate(['customer-info'], { relativeTo: this.route });
    }
  }

    /**
   * Replicate Contract
   *
   * button event
   */
  replicateContract(): void {
    this.contractService.callReprintCustomer().subscribe((response: any) => {
      console.log(response);
      if ( true ) {
        this.notificationService.success('Réplica Exitosa.');
      } else {
        this.notificationService.error('error');
      }
    });
  }

  /**
   *
   */
  close(): void {
    this.personTypeSelected = '';
  }
  getListValues = (list?: any) => list?.map((item: { type: any; }) => item.type) || [];

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
}








