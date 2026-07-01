import { Component, computed, DestroyRef, Inject, inject, signal } from '@angular/core';
import { Question, QuizSection } from '../../../models/transactional-investment-profile';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first, Observable, catchError, of, merge, EMPTY, filter, firstValueFrom, throwError, take } from 'rxjs';
import { NotificationsService } from '../../../../shared/services/notifications.service';
import { ModalNotificationComponent } from '../../../../shared/components/modals/modal-notification/modal-notification.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpClientService } from '../../../../core/services/http-client.service';

import { investmentProfileQuizSectionsFake } from '../../../../shared/services/transactional-profile-quiz-data'; //remove once consume real service
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UnsavedChangesService } from '../../../../core/services/unsaved-changes.service';
import { GeneralInfoStorageService } from '../../../../shared/services/storage-services/general-info-storage.service';
import { FirstDataClientService } from '../../../../shared/services/storage-services/first-data-client.service';
import { MaritalStatus } from '../../../models/marital-status';
import { CatalogsService } from '../../../../shared/services/catalogs.service';
import { ERROR_MESSAGES } from '../../../constants/form-messages';
import { AuthService } from '../../../../core/services/auth.service';
import { OnboardingService } from '../../../services/onboarding.service';
import { CurrentOnboardingInfo } from '../../../models/current-onboarding';
import { formatDate } from '@angular/common';
import { PermissionRolService } from '../../../../core/services/rol.service';
import { convertDateBack, formatDateYYYYMMDD } from '../../../../shared/utils/datetime';
import { NotificationModalService } from '../../../../shared/services/notification-modal.service';
import { environment } from '../../../../../environments/environment';
import { ReprofileWfService } from '../../../../shared/services/wf-reprofile/reprofile-wf.service';
import { RequestWfReprofile } from '../../../models/generate-reprofile';
import moment from 'moment';


@Component({
  selector: 'app-investment-profile-quiz-modal',
  standalone: false,
  templateUrl: './investment-profile-quiz-modal.component.html',
  styleUrl: './investment-profile-quiz-modal.component.scss'
})
export class InvestmentProfileQuizModalComponent {

  private readonly httpService = inject(HttpClientService);
  private readonly dialogRef = inject(MatDialogRef<ModalNotificationComponent>);
  private readonly destroyRef = inject(DestroyRef);
  private readonly auth = inject(AuthService);
  private readonly onboardingService = inject(OnboardingService);
  private readonly permissionRolService = inject(PermissionRolService);
  private readonly generalInfoStorageService = inject(GeneralInfoStorageService);
  private readonly firstDataClientService = inject(FirstDataClientService);
  private readonly notificationModalService = inject(NotificationModalService);

  // private readonly catalogsService = inject(CatalogsService);
  private readonly unsavedChangesService = inject(UnsavedChangesService);
  private readonly notificationService = inject(NotificationsService);
  // private readonly firstDataClientService = inject(FirstDataClientService);
  // private readonly generalInfoService = inject(GeneralInfoStorageService);
  public readonly isMaintenance = computed(() => this.onboardingService.getCurrentInfo().isMaintenance);
  /* public readonly isEditable = computed(() => !this.permissionRolService.getPermissions()['transactional-investment-profile'].allDisabled); */
  public readonly isEditable = computed(() => true);
  private readonly reprofileWfService = inject(ReprofileWfService);

  private readonly fb = inject(FormBuilder);

  private readonly quizUrl: string;
  private readonly quizRateUrl: string;
  // private readonly dataClient: any = {};
  // private readonly generalInfoItem: any = {};
  private readonly investmentProfileValues: any = {};

  // private tiProfileFields: string[] = ['maritalStatus','jobTitle','profession','companyName','companyPhone','companyWebPage'];

  public investmentProfileQuizSections: QuizSection[] = [];
  public investmentProfileSelectOptions: any = {};
  public investmentProfileTextOptions: any = {};
  // public investmentProfileForm: FormGroup = new FormGroup({});
  public investmentProfileQuizForm: FormGroup = new FormGroup({});
  public visible = false;
  maxDate: Date = new Date;
  role: string = '';
  public editMode = signal<boolean>(false);
  profileRate: string = '';
  public confirmUrl: any = environment.api.salesPractices.getQuizRateConfirm;

  // civilStatus = signal<Array<MaritalStatus>>([]);

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    // this.catalogsService.getMaritalStatus({maritalStatusIds: []}).subscribe(i => {
    //   this.civilStatus.set(i);
    // });

    this.quizUrl = this.data.quizUrl;
    this.quizRateUrl = this.data.quizRateUrl;

    // this.dataClient = this.firstDataClientService.getItem() ?? {};
    // this.generalInfoItem = this.generalInfoService.generalInfoItem() ?? {};
    this.investmentProfileValues = this.data.service.investmentProfileQuiz() ?? {};

    // if(data.personType === 'pf'){
    //   this.investmentProfileForm = this.fb.group({
    //     dateOfBirth: [this.investmentProfileValues['dateOfBirth'] || this.dataClient['dateOfBirth'] || '', Validators.required],
    //     maritalStatus: [this.investmentProfileValues['maritalStatus'] || this.generalInfoItem['maritalStatus'] || '', Validators.required],
    //     profession: [this.investmentProfileValues['profession'] || this.generalInfoItem['profession'] || '', Validators.required],
    //     companyName: [this.investmentProfileValues['companyName'] || this.generalInfoItem['companyName'] || '', Validators.required],
    //     jobTitle: [this.investmentProfileValues['jobTitle'] || this.generalInfoItem['jobTitle'] || '', Validators.required],
    //     companyPhone: [this.investmentProfileValues['companyPhone'] || this.generalInfoItem['companyPhone'] || '', Validators.required],
    //     companyWebPage: [this.investmentProfileValues['companyWebPage'] || this.generalInfoItem['companyWebPage'] || '', Validators.required],
    //   });
    // }
    // else{
    //   this.investmentProfileForm = this.fb.group({});
    // }

    // #region investment profile quiz form initialization (dynamic form)
    //const quizUrl = data.personType === 'pf' ? this.quizUrl : this.quizUrl; //TODO add real url for pm

    this.getQuiz(this.quizUrl)
      .pipe(
        catchError(() => of({ quiz: [] })),
        take(1)
      )
      .subscribe(data => {

        this.investmentProfileQuizSections = data.quiz;
        console.log(this.investmentProfileQuizSections);

        if (!this.investmentProfileQuizSections?.length) {
          this.notificationService.error(
            'Error en el servicio de consulta del cuestionario',
            'No fue posible obtener las preguntas del cuestionario'
          );
          this.dialogRef.close();
          return;
        }

        for (const section of this.investmentProfileQuizSections) {
          for (const question of section.questions ?? []) {


            if (question.responseType === 1 || question.responseType === 2) {
              const optionWithValue = question.options
                ?.find(o => o.answerText !== null && o.answerText !== undefined);

              if (optionWithValue) {
                if (question.responseType === 2) {
                  this.investmentProfileTextOptions[question.questionId] =
                    optionWithValue.answerText
                } else {
                  this.investmentProfileTextOptions[question.questionId] =
                    optionWithValue.answerText;
                }
              }
            }

            if (question.responseType === 3) {
              const checkedOption = question.options?.find(o => o.checked);
              if (checkedOption) {
                this.investmentProfileSelectOptions[question.questionId] =
                  checkedOption.optionId;
              }
            }
          }
        }

        const section = this.investmentProfileQuizSections
          .find(s => s.sectionId === 'Conocimiento del cliente');

        const question = section?.questions
          .find(q => q.questionId === 13000);

        const maxDate = question?.attributes?.max;

        console.log({ section });
        console.log({ question });
        console.log({ maxDate });

        this.convertMaxDate(String(maxDate ?? ''));

        this.data.service.investmentQuizId.set(data.quizId);
        this.initializeForm();
      });
    // #region investment profile quiz form initialization (dynamic form)
  }

  private initializeForm(): void {
    const investmentQuizFormControls: any = {};

    console.log('inizializando');
    console.log(this.investmentProfileQuizSections);

    for (const section of this.investmentProfileQuizSections) {
      for (const question of section.questions) {

        const quizTextValue = this.investmentProfileTextOptions[question.questionId];
        const quizSelectValue = this.investmentProfileSelectOptions[question.questionId];

        investmentQuizFormControls[question.questionId] = [
          quizTextValue
          ?? quizSelectValue
          ?? this.investmentProfileValues[question.questionId]
          ?? this.data.service.transactionalProfile()[question.questionId]
          ?? "",
          question?.attributes?.required ? Validators.required : null
        ];
      }
    }

    this.investmentProfileQuizForm = this.fb.group(investmentQuizFormControls);

    if (this.isMaintenance()) {
      this.disableForm()
    }

    this.visible = true;

    merge(
      this.investmentProfileQuizForm.valueChanges,
    ).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(value => {
      this.unsavedChangesService.setUnsavedChanges(true);
      this.data.service.investmentProfileQuiz.set({
        ...this.investmentProfileQuizForm.value,
        // ...this.investmentProfileForm.value
      });
    });

    const initialData = this.firstDataClientService.getItem()
    const generalInfoData = this.generalInfoStorageService.generalInfoItem()


    console.log(this.investmentProfileValues);

    if (!Object.values(this.investmentProfileValues).some(v => v !== "")) {

      if (initialData) {
        console.log(initialData);
        this.investmentProfileQuizForm.patchValue({
          "13000": convertDateBack(initialData.dateOfBirth)
        });
      }

      if (generalInfoData) {
        this.investmentProfileQuizForm.patchValue({
          "13003": generalInfoData.profession, //profession
          "13006": generalInfoData.companyName, //Nombre de la empresa
          "13007": generalInfoData.jobTitle, //Puesto
          "13009": generalInfoData.companyPhone //Telefono de la empresa
        })
      }
    }
  }

  public convertMaxDate(date: string){
    if(date && date !== ''){
      const [y, m, d] = date.split('-').map(Number);
      this.maxDate = new Date(y, m - 1, d);
      this.maxDate.setHours(23, 59, 59, 999);
    }
  }

  private getQuiz(quizUrl: string): Observable<any> {
    const data = this.auth.getUserInfo();
    const curr: CurrentOnboardingInfo = this.onboardingService.getCurrentInfo();
    const customerData = this.onboardingService.customerInitialData();

    const body: any = {
      clientId: 1,
      personType: curr.personType === 'PF' ? 1 : 2,
      user: data().username.split('@')[0],
      origin: customerData.bankAreaTypeId === 999 ? 1 : 2,
    }

    this.isMaintenance() ? body['contract'] = +curr.accountId : body['applicationId'] = +curr.requestId;

    return this.httpService.post(quizUrl, body);
  }

  private normalizeDate(value: any): string {

    if (!value) return '';

    if (moment.isMoment(value)) {
      return value.format('YYYY-MM-DD');
    }

    if (typeof value === 'string' && value.includes('/')) {
      return formatDateYYYYMMDD(value);
    }

    if (typeof value === 'string' && value.includes('T')) {
      return value.split('T')[0];
    }

    return value;
  }

  private getQuizRate(): Observable<any> {
    const answers = Object.entries(this.investmentProfileQuizForm.value)
      .map(([key, rawValue]) => {
        const questionId = Number(key);

        const question = this.investmentProfileQuizSections
          .flatMap((s) => s.questions)
          .find((q) => q.questionId === questionId);

        if (!question) return null;

        let answer: any = null;
        let answerId: number | null = null;

        if (question.responseType === 3) {
          const selectedOption = question.options?.find(
            (o) => String(o.optionId) === String(rawValue)
          );
          if (!selectedOption) return null;

          answer = selectedOption.answerText;
          answerId = Number(selectedOption.optionId);
        } else if (question.responseType === 2) {
          answer = this.normalizeDate(rawValue);

          const option = question.options?.[0];
          answerId = option?.optionId != null ? Number(option.optionId) : null;
        } else if (question.responseType === 1) {
          answer = rawValue ?? '';

          const option = question.options?.[0];
          answerId = option?.optionId != null ? Number(option.optionId) : null;
        }

        return {
          questionId,
          answer,
          ...(answerId !== null ? { answerId } : {}),
        };
      })
      .filter((a) => a !== null);

    const curr = this.onboardingService.getCurrentInfo();
    const customerData = this.onboardingService.customerInitialData();
    const user = this.auth.getUserInfo()().username.split('@')[0];

    return this.httpService.post(this.quizRateUrl, {
      applicationId: this.isMaintenance() ? curr.accountId.toString() : curr.requestId,
      clientId: 1,
      quizId: this.data.service.investmentQuizId(),
      origin: customerData.bankAreaTypeId === 999 ? 1 : 2,
      personType: curr.personType === 'PF' ? 1 : 2,
      user,
      answers,
    });
  }

  submitInvestmentQuiz(profile: boolean) {
    if (this.investmentProfileQuizForm.invalid) {
      this.notificationService.error(ERROR_MESSAGES.REQUIRED_FIELDS);
      document.body.classList.add('show-validation');
      for (const [, control] of Object.entries(this.investmentProfileQuizForm.controls)) {
        if (control.invalid) {
          control.markAsTouched();
        }
      }
      return;
    }
    if (this.data.service.onWorkFlow()) {
      this.notificationService.error('El cuestionario se encuentra actualmente en evaluación');
      return;
    }
    profile ? this.profile() : this.reprofile();
  }

  closeModal() {
    this.dialogRef.close();
  }

  cancel() {
    if (!this.isMaintenance()) {
      this.dialogRef.close();
      return;
    }
    this.investmentProfileQuizForm.reset(this.data.service.initialInvestmentProfileQuiz);
    this.disableForm();
    this.unsavedChangesService.setUnsavedChanges(false);
  }

  edit() {
    this.enableForm();
  }

  enableForm() {
    this.investmentProfileQuizForm.enable({ emitEvent: false });
    this.editMode.set(true);
  }

  disableForm() {
    this.investmentProfileQuizForm.disable({ emitEvent: false });
    this.editMode.set(false);
  }

  profile() {
    this.getQuizRate().pipe(
      first(),
      catchError(error => {
        this.notificationService.error('Error al obtener la calificación del cuestionario');
        return EMPTY;
      })
    ).subscribe({
      next: (data: any) => {
        this.notificationService.success('Cuestionario Completado con Éxito');
        this.data.service.profileRating.set(data['profileRating'] || 75);
        this.data.service.investmentQuizCompleted.set(true);
      },
      error: err => {
        this.notificationService.error('Error al completar el cuestionario');
      },
      complete: () => this.dialogRef.close()
    });
  }

  async reprofile(){
    const response = await this.completarCuestionario();

    console.log(response)
    const confirmRespose = await this.notificationModalService.confirm(
      {
        title: 'Según la evualación de su cuestionario el perfil es:',
        infoToCopy: response.profileRating ?? '',
        beforeMessages: ['Está seguro que desea continuar con el reperfilamiento.'],
        btnAccept: 'Aceptar',
        btnDeny: 'Cancelar'
      }
    )
    if (confirmRespose?.value) {
      const data = this.auth.getUserInfo();
      if(data().rol === 'ROL_ASESOR_FIN'){
        const curr: CurrentOnboardingInfo = this.onboardingService.getCurrentInfo();
        const customerData = this.onboardingService.customerInitialData();
        const wfTriggerBody: RequestWfReprofile = {
          contractNumber: +curr.accountId,
          clientNumber: +curr.clientId,
          bankingArea: customerData.bankAreaTypeId?.toString() ?? "999",
          workflowId: "6",
          workflowStatusId: 1,
          workflowRequestNum: response.applicationId,
          itemList: response.quizId+','+response.profileRating,
          applicationId: response.applicationId,
          origin: customerData.bankAreaTypeId === 999 ? "1" : "2",
          user: data().username.split('@')[0],
          contract: curr.accountId.toString()
        }

        await firstValueFrom(this.reprofileWfService.postData(wfTriggerBody));

        await this.notificationModalService.success(
          {
            title: 'El flujo para asignar el nuevo perfil se ha creado',
            btnAccept: 'Aceptar',
          }
        )
        this.dialogRef.close();
      }else {

        await firstValueFrom(
          this.confirm(this.confirmUrl, response).pipe(
            catchError(error => {
              this.notificationService.error(
                'Error al confirmar la calificación del cuestionario'
              );
              throw error;
            })
          )
        );

        await this.notificationModalService.success(
          {
            title: 'Su nuevo perfil ha sido asignado',
            btnAccept: 'Aceptar',
          }
        )
        this.profileRate = response.profileRating ?? 75;
        this.data.service.profileRating.set(this.profileRate);
        this.dialogRef.close(true); //flag for maintenance automatic checkpoint request in main component
      }
    }
  }

  private confirm(quizUrl: string, response: any): Observable<any> {
    const data = this.auth.getUserInfo();
    const curr: CurrentOnboardingInfo = this.onboardingService.getCurrentInfo();
    const customerData = this.onboardingService.customerInitialData();

    const body: any = {
        clientId: 1,
        quizId: response.quizId,
        applicationId: response.applicationId,
        origin: customerData.bankAreaTypeId === 999 ? 1 : 2,
        personType: curr.personType === 'PF' ? 1 : 2,
        user: data().username.split('@')[0],
        profileRating: response.profileRating,
        contract: +curr.accountId
    }

    return this.httpService.post(quizUrl, body);
  }

  async completarCuestionario() {
    try {
      const data: any = await firstValueFrom(
        this.getQuizRate().pipe(
          first(),
          catchError(err => {
            this.notificationService.error('Error al obtener la calificación del cuestionario');
            return throwError(() => err);
          })
        )
      );

      this.notificationService.success('Cuestionario Completado con Éxito');
      this.data.service.investmentQuizCompleted.set(true);

      return data;

    } catch (err) {
      this.notificationService.error('Error al completar el cuestionario');
      return null;
    }
  }
}
