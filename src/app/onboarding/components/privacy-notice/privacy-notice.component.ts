
import { Component, computed, DestroyRef, effect, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, PristineChangeEvent, Validators } from '@angular/forms';
import { OnboardingService } from '../../services/onboarding.service';
import { UnsavedChangesService } from '../../../core/services/unsaved-changes.service';
import { filter, first } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PrivacyCheck } from '../../models/privacy-notice';
import { PrivacyNoticeService } from '../../../shared/services/storage-services/privacy-notice.service';
import { NotificationsService } from '../../../shared/services/notifications.service';
import { CheckpointService } from '../../../shared/services/checkpoint.service';
import { PrivacyNoticeCheckpoint } from '../../models/checkpoints/privacy-notice-checkpoint';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../../constants/form-messages';
import { SaveCheckpointResponse } from '../../../shared/models/checkpoint';
import { PermissionRolService } from '../../../core/services/rol.service';
import { AuthService } from '../../../core/services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-privacy-notice',
  standalone: false,
  templateUrl: './privacy-notice.component.html',
  styleUrl: './privacy-notice.component.scss'
})
export class PrivacyNoticeComponent implements OnInit {
  private readonly onboardingService = inject(OnboardingService);
  private readonly permissionRolService = inject(PermissionRolService);
  private readonly authService = inject(AuthService);

  public readonly isMaintenance = computed(() => this.onboardingService.getCurrentInfo().isMaintenance);
  public readonly isEditable = computed(() => this.permissionRolService.getPermissions()['privacy-notice'].allDisabled);
  public readonly hasRolePermissionToEdit = computed(() =>  ['ROL_ANALISTA_DE_CONTRATOS','SPINE_GESTOR_SUP','ROL_ASESOR_FIN','ROL_CAT_VIDEOLLAMADAS'].includes(this.authService.getUserInfo()().rol));

  private readonly unsavedChangesService = inject(UnsavedChangesService);
  private readonly fb = inject(FormBuilder);
  private readonly notificationService = inject(NotificationsService);
  private readonly checkpoint = inject(CheckpointService);

  public readonly privacyNoticeService = inject(PrivacyNoticeService);
  public readonly privacyChecksArr: PrivacyCheck[] = [];
  public readonly form: FormGroup;
  public editMode = signal<boolean>(false);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  constructor() {
    const destroyRef = inject(DestroyRef);

    destroyRef.onDestroy(() => {
      this.onboardingService.btnConfirmData.set(false);
    });

    effect(() => {
      this.onboardingService.btnConfirmData.set(!this.isMaintenance());
    });

    this.privacyChecksArr = this.privacyNoticeService.defaultPrivacyNoticeData;
    const data = this.privacyNoticeService.privacyNoticeData();

    const isMaintenance = this.isMaintenance();

    const formControls: any = {
      marketingConsent: [data.marketing?.marketingConsent ?? false],
      advertisingConsentActinverGroup: [data.marketing?.advertisingConsentActinverGroup ?? false],
      rejectFinancialOffersFromActinver: [data.marketing?.rejectFinancialOffersFromActinver ?? false],
      consentToPrimaryDataProcessing: [{ value: isMaintenance ? (data.privacyNotice?.consentToPrimaryDataProcessing ?? false) : true, disabled: true }, Validators.requiredTrue],
      consentToSecondaryUse: [{ value: isMaintenance ? (data.privacyNotice?.consentToSecondaryUse ?? false) : true, disabled: true }, Validators.requiredTrue],
      consentToMarketingContactAndDataTransfer: [{ value: isMaintenance ? (data.privacyNotice?.consentToMarketingContactAndDataTransfer ?? false) : true, disabled: true }, Validators.requiredTrue],
    };
    this.form = this.fb.group(formControls);

    if (this.isMaintenance()) {
      this.form.disable({ emitEvent: false });
      this.privacyNoticeService.initialPrivacyNoticeData = this.privacyNoticeService.privacyNoticeData();
    }

    this.form.events.pipe(takeUntilDestroyed(), filter((event) => event instanceof PristineChangeEvent))
      .subscribe((event: PristineChangeEvent) => {
        this.unsavedChangesService.setUnsavedChanges(!event.pristine);
        this.onboardingService.btnConfirmDataDisabled.set(!event.pristine || !this.form.valid);
      });
  }

  ngOnInit(): void {
    const onboardingRegister = this.onboardingService.getOnboardingRegister();
    if (onboardingRegister && Object.keys(onboardingRegister).length > 0) {
      this.router.navigate(['../../finalization'], { relativeTo: this.route });
    }
  }

  save() {
    this.unsavedChangesService.setUnsavedChanges(true);
    this.onboardingService.btnConfirmDataDisabled.set(!this.form.valid);
    const saveFn = this.isMaintenance() ? 'saveSectionMant' : 'saveSection';
    this.checkpoint[saveFn]('privacy-notice', this.mapToCheckpointPrivacyNotice())
      .pipe(first())
      .subscribe(
        {
          next: (res: SaveCheckpointResponse) => {
            console.log("res:", res);
            if ("CREATED" === res['status']) {
              const savedData = this.mapToCheckpointPrivacyNotice();
              this.privacyNoticeService.privacyNoticeData.set(savedData);
              this.privacyNoticeService.initialPrivacyNoticeData = savedData;
              this.notificationService.success(SUCCESS_MESSAGES.SAVE_CHECKPOINT_SUCCESS);
              this.unsavedChangesService.setUnsavedChanges(false);
              if (this.isMaintenance()) {
                this.disableForm();
              }
            } else {
              this.notificationService.error(ERROR_MESSAGES.SAVE_CHECKPOINT_ERROR);
            }
          },
          error: (err) => {
            console.log("err:", err);
          },
          complete: () => {
            console.log("completed");
          }
        },
      );
    this.form.markAsPristine();
  }

  edit() {
    this.enableForm();
  }

  cancel() {
    this.form.reset({
      ...this.privacyNoticeService.initialPrivacyNoticeData.marketing,
      ...this.privacyNoticeService.initialPrivacyNoticeData.privacyNotice
    });
    this.disableForm();
    this.unsavedChangesService.setUnsavedChanges(false);
  }

  enableForm() {
    this.form.get('marketingConsent')?.enable({ emitEvent: false });
    this.form.get('advertisingConsentActinverGroup')?.enable({ emitEvent: false });
    this.form.get('rejectFinancialOffersFromActinver')?.enable({ emitEvent: false });
    this.form.get('consentToPrimaryDataProcessing')?.enable({ emitEvent: false });
    this.form.get('consentToSecondaryUse')?.enable({ emitEvent: false });
    this.form.get('consentToMarketingContactAndDataTransfer')?.enable({ emitEvent: false });
    this.editMode.set(true);
  }

  disableForm() {
    this.form.disable({ emitEvent: false });
    this.editMode.set(false);
  }

  mapToCheckpointPrivacyNotice(): PrivacyNoticeCheckpoint {
    const initial = this.privacyNoticeService.initialPrivacyNoticeData;
    return {
      marketing: {
        marketingConsent: this.form.controls['marketingConsent'].value,
        advertisingConsentActinverGroup: this.form.controls['advertisingConsentActinverGroup'].value,
        rejectFinancialOffersFromActinver: this.form.controls['rejectFinancialOffersFromActinver'].value,
        id: initial.marketing?.id
      },
      privacyNotice: {
        consentToPrimaryDataProcessing: this.form.controls['consentToPrimaryDataProcessing'].value,
        consentToSecondaryUse: this.form.controls['consentToSecondaryUse'].value,
        consentToMarketingContactAndDataTransfer: this.form.controls['consentToMarketingContactAndDataTransfer'].value,
        id: initial.privacyNotice?.id
      },
      active: initial?.active
    }
  }
}
