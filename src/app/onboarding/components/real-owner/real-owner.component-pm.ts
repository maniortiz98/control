import {
  ChangeDetectorRef,
  Component,
  effect,
  Inject,
  inject,
  Input,
  signal,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { UnsavedChangesService } from '../../../core/services/unsaved-changes.service';
import { NotificationsService } from '../../../shared/services/notifications.service';
import { ModalFormService } from '../../../shared/services/modal-form.service';
import { NotificationModalService } from '../../../shared/services/notification-modal.service';
import { OnboardingService } from '../../services/onboarding.service';
import { CatalogsService } from '../../../shared/services/catalogs.service';
import { CheckpointService } from '../../../shared/services/checkpoint.service';
import {
  ACCIONARIA_ESTRUCTURAS,
  FINANCIAL_ENTITIES,
  REAL_OWNER_PERSON_TYPES,
  ShareholderFormData,
} from '../../models/real-owner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomerIdentificationPmService } from '../../../shared/services/storage-services/pm/customer-identification-pm.service';
import { CustomerIdentificationPm } from '../../models/pm/customer-identification-pm';
import { ModalShareholderComponent } from '../../../shared/components/modals/modal-shareholder/modal-shareholder.component';
import { STRINGS } from '../../constants/constants';
import {
  NOTIFICATION_MESSAGES,
  SUCCESS_MESSAGES,
} from '../../constants/form-messages';
import {
  ModalAddShareholderComponent,
  ModalAddShareholderResult,
} from '../../../shared/components/modals/modal-add-shareholder/modal-add-shareholder.component';
import { TableResultsTreeComponent } from '../../../shared/components/table-results-tree/table-results-tree.component';
import { RealOwnerPmService } from '../../../shared/services/storage-services/pm/real-owner-pm.service';
import { RealOwnerPM } from '../../models/pm/real-owner-pm';

@Component({
  selector: 'app-real-owner-pm',
  standalone: false,
  templateUrl: './real-owner.component-pm.html',
  styleUrl: './real-owner.component-pm.scss',
})
export class RealOwnerComponentPM {
  //Inject
  private readonly catalogService = inject(CatalogsService);
  private readonly fb = inject(FormBuilder);
  readonly dialog = inject(MatDialog);
  private readonly notificationService = inject(NotificationsService);
  private readonly unsavedChangesService = inject(UnsavedChangesService);
  private readonly notificationModalService = inject(NotificationModalService);
  private readonly modalService = inject(ModalFormService);
  private readonly checkpointService = inject(CheckpointService);
  private readonly customerIdentificationPmService = inject(
    CustomerIdentificationPmService
  );
  private readonly storageService = inject(RealOwnerPmService);

  data: CustomerIdentificationPm | null = null;
  // variables
  form: FormGroup = this.fb.nonNullable.group({
    businessName: [{ value: '', disabled: true }, [Validators.required]],
    exchange: [false],
    chalkKey: [''],
    stationName: ['', Validators.required],
    personType: ['normal', Validators.required],
    typeOfCompany: ['', Validators.required],
    tesofe: [false, Validators.required],
    keyTesofe: [{ value: '', disabled: true }, Validators.required],
    typeOfRegimen: ['', Validators.required],
  });
  @ViewChild(TableResultsTreeComponent) tableComp?: TableResultsTreeComponent;
  //Signals
  errors = signal<string[]>([]);
  typeOfCompany = signal<any[]>([]);
  typeOfRegimen = signal<any[]>([]);
  tableDataPFSignal = signal<any[]>([]);
  exchange = signal(false);
  personType = signal<string>('especial');
  typeOfCompanySelected = signal<number>(0);

  config = {
    // childColumns: [...],       // opcional
    // grandChildColumns: [...],  // opcional
  };

  tableDataPFYPMSignal = signal<any[]>([
    /* {
      id: '1',
      tipoPersona: 'PERSONA FÍSICA',
      nombre: 'RAFAEL DAVILA',
      porcentaje: 25,
      fideicomiso: false,
      cotizaBmv: true,
      estructura: 24,
    },
    {
      id: '2',
      tipoPersona: 'PERSONA MORAL',
      nombre: 'COMPANYACT SA DE CV',
      porcentaje: 25,
      fideicomiso: true,
      cotizaBmv: true,
      estructura: 25,
    },
    {
      id: '3',
      tipoPersona: 'PERSONA MORAL',
      nombre: 'YOUTUBE',
      porcentaje: 26,
      fideicomiso: false,
      cotizaBmv: true,
      estructura: 26,
    }, */
  ]);
  tableDataPMSignal = signal<any[]>([
    /* {
      id: '1',
      tipoPersona: 'PERSONA FÍSICA',
      nombre: 'RAFAEL DAVILA',
      porcentaje: 25,
      fideicomiso: false,
      cotizaBmv: true,
      estructura: 24,
    },
    {
      id: '2',
      tipoPersona: 'PERSONA MORAL',
      nombre: 'COMPANYACT SA DE CV',
      porcentaje: 25,
      fideicomiso: true,
      cotizaBmv: true,
      estructura: 25,
    },
    {
      id: '3',
      tipoPersona: 'PERSONA MORAL',
      nombre: 'YOUTUBE',
      porcentaje: 26,
      fideicomiso: false,
      cotizaBmv: true,
      estructura: 26,
    }, */
  ]);

  // variables
  showAlert = false;
  isEditting = false;
  alertMessage = '';
  tableDataPF: Array<any> = [];
  tableDataPM: Array<any> = [];
  columnsStructureShareHoldersPF: Array<any> = [
    {
      name: 'fullName',
      title: 'Nombre Completo',
      show: true,
      type: 'string',
    },
    {
      name: 'email',
      title: 'Correo Electrónico',
      show: true,
      type: 'string',
    },
    {
      name: 'phone',
      title: 'Teléfono',
      show: true,
      type: 'string',
    },
    {
      name: 'country',
      title: 'País',
      show: true,
      type: 'string',
    },
    {
      name: 'participation',
      title: 'Porcentaje',
      show: true,
      type: 'string',
    },
  ];
  columnsStructureShareHoldersPM: Array<any> = [
    {
      field: 'typeOfCompany',
      header: 'Denominación o Razón Social',
      width: '160px',
    },
    {
      field: 'rfc',
      header: 'RFC',
      width: '160px',
    },
    {
      field: 'porcentage',
      header: 'Porcentaje',
      width: '120px',
    },
    {
      field: 'trust',
      header: 'Fideicomiso',
      width: '120px',
    },
    {
      field: 'bmv',
      header: 'Cotiza BMV',
      width: '120px',
    },
    {
      name: 'structure',
      header: 'Estructura',
      width: '200px',
    },
  ];
  columnsStructureShareHoldersPFYPM: Array<any> = [
    { field: 'tipoPersona', header: 'Tipo de Persona', width: '160px' },
    {
      field: 'nombre',
      header: 'Nombre completo / Denominación o Razón Social',
    },
    { field: 'porcentaje', header: 'Porcentaje', width: '120px' },
    { field: 'fideicomiso', header: 'Fideicomiso', width: '120px' },
    { field: 'cotizaBmv', header: 'Cotiza BMV', width: '120px' },
    { field: 'estructura', header: 'Estructura', width: '200px' },
  ];
  //Constructor
  constructor() {
    document.body.classList.remove('show-validation');
    effect(() => {
      this.form.patchValue({
        exchange: false,
        personType: 'especial',
        businessName: this.data?.businessName,
      });
    });
  }

  ngOnInit() {
    this.data = this.customerIdentificationPmService.getItem();
    this.form.get('exchange')?.valueChanges.subscribe((value: boolean) => {
      if (value) {
        this.exchange.set(true);
      } else {
        this.exchange.set(false);
      }
    });
    this.form.get('personType')?.valueChanges.subscribe((value: string) => {
      if (value === 'normal') {
        this.personType.set('normal');
        this.typeOfCompany.set(ACCIONARIA_ESTRUCTURAS);
        this.showAlert = false;
      } else {
        this.personType.set('especial');
        this.typeOfCompany.set(REAL_OWNER_PERSON_TYPES);
      }
    });
    this.form.get('typeOfCompany')?.valueChanges.subscribe((value: number) => {
      this.typeOfCompanySelected.set(value);
      if (this.personType() === 'normal') {
      }
      if (value == 9) {
        this.showInfo(
          'No es necesario que llenes la pestaña Administrador que Ejerce el Control al seleccionar el valor "Entidades del régimen Simplificado" dentro del campo Tipo de Sociedad'
        );
        this.typeOfRegimen.set(FINANCIAL_ENTITIES);
      }
      if (value == 10) {
        this.showInfo(
          'No es necesario que llenes la pestaña Administrador que Ejerce el Control al seleccionar el valor "Gubernamentales Sujetas a la Cuenta Única" dentro del campo Tipo de Sociedad'
        );
      }
    });
    this.form.get('tesofe')?.valueChanges.subscribe((value: boolean) => {
      if (value) {
        this.form.get('keyTesofe')?.enable();
      } else {
        this.form.get('keyTesofe')?.disable();
      }
    });
  }

  showInfo(value: string) {
    this.alertMessage = value;
    this.showAlert = true;
  }

  closeAlert(): void {
    this.showAlert = false;
  }

  handleRowAction(event: any) {
    console.log('Acción en fila:', event);
  }

  loadChildren = (parent: any) => [
    /* {
      id: parent.id + '-a',
      tipoPersona: 'PERSONA MORAL',
      nombre: `SUB de ${parent.nombre}`,
      porcentaje: 10,
      fideicomiso: false,
      cotizaBmv: false,
      estructura: 10,
    },
    {
      id: parent.id + '-b',
      tipoPersona: 'PERSONA FÍSICA',
      nombre: `SOCIO de ${parent.nombre}`,
      porcentaje: 10,
      fideicomiso: true,
      cotizaBmv: false,
      estructura: 10,
    }, */
  ];

  loadGrandchildren = (child: any) => [
    /* {
      id: child.id + '-x',
      tipoPersona: 'PERSONA MORAL',
      nombre: `SubSub de ${child.nombre}`,
      porcentaje: 10,
      fideicomiso: false,
      cotizaBmv: false,
      estructura: 10,
    },
    {
      id: child.id + '-y',
      tipoPersona: 'PERSONA FÍSICA',
      nombre: `Asociado de ${child.nombre}`,
      porcentaje: 10,
      fideicomiso: true,
      cotizaBmv: false,
      estructura: 10,
    }, */
  ];

  get remainingPercentage(): number {
    const used = this.tableDataPFYPMSignal().reduce(
      (acc, r) => acc + (r.porcentaje || 0),
      0
    );
    return Math.max(0, 100 - used);
  }

  private mapModalToRow(v: any): any {
    const tipoPersona =
      v.personType === 'PF' ? 'PERSONA FÍSICA' : 'PERSONA MORAL';
    const nombre =
      v.personType === 'PM' && v.businessName?.trim()
        ? v.businessName.trim()
        : [v.firstName, v.middleName, v.lastName, v.secondLastName]
            .filter(Boolean)
            .join(' ')
            .replace(/\s+/g, ' ')
            .trim() || '—';

    return {
      id: crypto.randomUUID(),
      tipoPersona,
      nombre,
      porcentaje: Number(v.participation),
      fideicomiso: !!v.fideicomiso,
      cotizaBmv: !!v.cotizaBmv,
      estructura: Number(v.participation),
    };
  }

  onAdd() {
    const remaining = this.remainingForAddWithin(this.tableDataPFYPMSignal());
    if (remaining <= 0) {
      this.notificationService?.error?.('El porcentaje total ya es 100%.');
      return;
    }

    const ref = this.dialog.open(ModalShareholderComponent, {
      width: '80vw',
      maxHeight: '80vh',
      disableClose: true,
      data: { remaining, level: 'parent' },
    });

    ref.afterClosed().subscribe((result) => {
      if (!result?.ok) return;
      const row = this.mapModalToRow(result.data.shareholderData);
      this.tableDataPFYPMSignal.update((arr) => [...arr, row]);
      this.notificationService?.success?.('Accionista agregado');
    });
  }

  eventRow($event: any) {}

  private remainingForAddWithin(array: any[]): number {
    const used = array.reduce((acc, x) => acc + (x?.porcentaje || 0), 0);
    return Math.max(0, 100 - used);
  }

  private openAddGrandchildForChild(childId: string) {
    const list = this.tableComp?.getGrandchildren(childId) ?? [];
    const remaining = this.remainingForAddWithin(list);

    const ref = this.dialog.open(ModalShareholderComponent, {
      width: '80vw',
      maxHeight: '80vh',
      disableClose: true,
      data: { remaining, level: 'grandchild' },
    });

    ref.afterClosed().subscribe((result) => {
      if (!result?.ok) return;
      const grandchild = this.mapModalToRow(result.data.shareholderData);

      this.tableComp?.grandchildrenByChild.set({
        ...this.tableComp?.grandchildrenByChild(),
        [childId]: [...list, grandchild],
      });
      this.notificationService?.success?.('Nieto agregado');
    });
  }

  private openAddChildForParent(parentId: string) {
    const list = this.tableComp?.getChildren(parentId) ?? [];
    const remaining = this.remainingForAddWithin(list);

    const ref = this.dialog.open(ModalShareholderComponent, {
      width: '80vw',
      maxHeight: '80vh',
      disableClose: true,
      data: { remaining, level: 'child' },
    });

    ref.afterClosed().subscribe((result) => {
      if (!result?.ok) return;
      const child = this.mapModalToRow(result.data.shareholderData);
      const newList = [...list, child];

      this.tableComp?.childrenByParent.set({
        ...this.tableComp?.childrenByParent(),
        [parentId]: newList,
      });
      this.notificationService?.success?.('Hijo agregado');
    });
  }

  onEventRow(e: any) {
    const { action, level, row, context, field, checked } = e;

    if (action === 'toggle') {
      if (level === 'parent') {
        this.tableDataPFYPMSignal.update((arr) =>
          arr.map((r) => (r.id === row.id ? { ...r, [field]: checked } : r))
        );
      }
      return;
    }

    if (action === 'add-child' && level === 'parent') {
      const parentId = context?.parentId ?? row?.id;
      if (parentId) this.openAddChildForParent(parentId);
      return;
    }

    if (action === 'add-grandchild' && level === 'child') {
      const childId = context?.childId ?? row?.id;
      if (childId) this.openAddGrandchildForChild(childId);
      return;
    }

    if (action === 'edit') {
      if (level === 'parent') return this.openEditShareholder(row);
      if (level === 'child') return this.openEditChild(row, context?.parentId);
      if (level === 'grandchild')
        return this.openEditGrandchild(row, context?.childId);
    }

    if (action === 'delete') {
      if (level === 'parent') return this.confirmDeleteShareholder(row);
      if (level === 'child') {
        const pId = context?.parentId ?? this.tableComp?.getSelectedParentId();
        if (!pId) return;
        this.notificationModalService
          .confirm({
            title: '¿Eliminar hijo?',
            btnAccept: 'Sí, eliminar',
            btnDeny: 'Cancelar',
          })
          .then((res) => {
            if (!res?.value) return;
            this.tableComp?.deleteChildInCache(pId, row.id);
            this.notificationService?.success?.('Hijo eliminado');
          });
        return;
      }
      if (level === 'grandchild') {
        const cId = context?.childId ?? this.tableComp?.getSelectedChildId();
        if (!cId) return;
        this.notificationModalService
          .confirm({
            title: '¿Eliminar nieto?',
            btnAccept: 'Sí, eliminar',
            btnDeny: 'Cancelar',
          })
          .then((res) => {
            if (!res?.value) return;
            this.tableComp?.deleteGrandchildInCache(cId, row.id);
            this.notificationService?.success?.('Nieto eliminado');
          });
        return;
      }
    }
  }

  private remainingForEditWithin(array: any[], currentId: string): number {
    const othersSum = array
      .filter((x) => x?.id !== currentId)
      .reduce((acc, x) => acc + (x?.porcentaje || 0), 0);
    return Math.max(0, 100 - othersSum);
  }

  private remainingForEdit(currentId: string): number {
    const arr = this.tableDataPFYPMSignal();
    const curr = arr.find((r) => r.id === currentId);
    const othersSum = arr
      .filter((r) => r.id !== currentId)
      .reduce((sum, r) => sum + (r.porcentaje || 0), 0);
    return Math.max(0, 100 - othersSum);
  }

  openEditShareholder(row: any) {
    const remaining = this.remainingForEditWithin(
      this.tableDataPFYPMSignal(),
      row.id
    );

    const initial = {
      personType: row.tipoPersona === 'PERSONA FÍSICA' ? 'PF' : 'PM',
      participation: row.porcentaje,
      firstName: '',
      middleName: '',
      lastName: '',
      secondLastName: '',
      businessName: row.tipoPersona === 'PERSONA MORAL' ? row.nombre : '',
      fideicomiso: row.fideicomiso ?? false,
      cotizaBmv: row.cotizaBmv ?? false,
      countryResidence: '',
      email: '',
      phone: '',
    };

    const ref = this.dialog.open(ModalShareholderComponent, {
      width: '80vw',
      maxHeight: '80vh',
      disableClose: true,
      data: { remaining, initial, level: 'parent' },
    });

    ref.afterClosed().subscribe((res) => {
      if (!res?.ok) return;
      const v = res.data.shareholderData;
      const updated = this.mapModalToRow(v);
      updated.id = row.id;
      this.tableDataPFYPMSignal.update((arr) =>
        arr.map((r) => (r.id === row.id ? updated : r))
      );
      this.notificationService?.success?.('Accionista actualizado');
    });
  }

  openEditChild(row: any, parentId: string) {
    const list = this.tableComp?.getChildren(parentId) ?? [];
    const remaining = this.remainingForEditWithin(list, row.id);

    const initial = {
      personType: row.tipoPersona === 'PERSONA FÍSICA' ? 'PF' : 'PM',
      participation: row.porcentaje,
      businessName: row.tipoPersona === 'PERSONA MORAL' ? row.nombre : '',
      fideicomiso: row.fideicomiso ?? false,
      cotizaBmv: row.cotizaBmv ?? false,
    };

    const ref = this.dialog.open(ModalShareholderComponent, {
      width: '80vw',
      maxHeight: '80vh',
      disableClose: true,
      data: { remaining, initial, level: 'child' },
    });

    ref.afterClosed().subscribe((res) => {
      if (!res?.ok) return;
      const v = res.data.shareholderData;
      const updated = this.mapModalToRow(v);
      updated.id = row.id;

      this.tableComp?.updateChildInCache(parentId, updated);
      this.notificationService?.success?.('Hijo actualizado');
    });
  }

  openEditGrandchild(row: any, childId: string) {
    const list = this.tableComp?.getGrandchildren(childId) ?? [];
    const remaining = this.remainingForEditWithin(list, row.id);

    const initial = {
      personType: row.tipoPersona === 'PERSONA FÍSICA' ? 'PF' : 'PM',
      participation: row.porcentaje,
      businessName: row.tipoPersona === 'PERSONA MORAL' ? row.nombre : '',
      fideicomiso: row.fideicomiso ?? false,
      cotizaBmv: row.cotizaBmv ?? false,
    };

    const ref = this.dialog.open(ModalShareholderComponent, {
      width: '80vw',
      maxHeight: '80vh',
      disableClose: true,
      data: { remaining, initial, level: 'grandchild' },
    });

    ref.afterClosed().subscribe((res) => {
      if (!res?.ok) return;
      const v = res.data.shareholderData;
      const updated = this.mapModalToRow(v);
      updated.id = row.id;

      this.tableComp?.updateGrandchildInCache(childId, updated);
      this.notificationService?.success?.('Nieto actualizado');
    });
  }

  addShareholder() {
    const dialogRef = this.dialog.open(ModalShareholderComponent, {
      width: '80vw',
      maxHeight: '80vh',
      minWidth: 'auto',
      minHeight: 'auto',
      disableClose: true,
      panelClass: 'custom-dialog-border',
      data: {
        personType: this.personType(),
        value: this.typeOfCompanySelected(),
      },
    });

    dialogRef.afterClosed().subscribe((result: ShareholderFormData) => {
      if (result?.table) {
        console.log(result);
        const table = result.table;
        this.tableDataPF.push({
          fullName: `${table.firstName} ${table.middleName || ''} ${
            table.lastName
          } ${table.secondLastName || ''}`,
          email: table.email ?? '',
          phone: table.phone ?? '',
          country: table.country ?? '',
          participation: table.participation ?? 0,
        });
        this.tableDataPFSignal.set(this.tableDataPF);
      }
    });
  }

  private confirmDeleteShareholder(row: any) {
    this.notificationModalService
      .confirm({
        title: '¿Eliminar accionista?',
        inputMessage: `Se eliminará "${
          row?.nombre ?? 'Sin nombre'
        }" y sus relacionados.`,
        btnAccept: 'Sí, eliminar',
        btnDeny: 'Cancelar',
      })
      .then((res: { value: boolean } | undefined) => {
        if (!res?.value) return;

        this.tableDataPFYPMSignal.update((arr) =>
          arr.filter((r) => r.id !== row.id)
        );

        this.tableComp?.selectedParent.set(null);
        this.tableComp?.selectedChild.set(null);
        this.tableComp?.clearForParent?.(row.id);

        this.notificationService?.success?.(
          'Accionista y relacionados eliminados'
        );
      });
  }

  editItem(modalData: any): void {
    const data = modalData;
    const dialogRef = this.dialog.open(ModalShareholderComponent, {
      maxWidth: '99%',
      height: '90%',
      data,
      disableClose: true,
      panelClass: 'panel-class',
    });

    dialogRef.afterClosed().subscribe((modalData: any) => {
      if (!modalData || !Array.isArray(modalData.fiscalResidences)) return;
      console.log('new DATA: ', modalData);
      this.tableDataPF = modalData;
      this.notificationService.success(SUCCESS_MESSAGES.SUCCESSFUL_UPDATE);
    });
  }

  ngAfterViewInit() {}

  async onSubmit() {
    //TODO crear el resto de las validaciones y casos de uso
    const dataToSave: RealOwnerPM = {
      businessName: this.form.value.businessName,
      exchange: this.form.value.exchange,
      chalkKey: this.form.value.chalkKey,
      stationName: this.form.value.stationName,
      personType: this.form.value.personType,
      typeOfCompany: this.form.value.typeOfCompany,
      tesofe: this.form.value.tesofe,
      keyTesofe: this.form.value.keyTesofe,
      typeOfRegimen: this.form.value.typeOfRegimen,
    }

    this.storageService.setRealOwnerPm(dataToSave);
  }

  //function to detonate error
  error(): void {
    Object.values(this.form.controls).forEach((control) => {
      if (control.invalid) {
        control.markAsTouched();
      }
    });
  }

  validador(): boolean {
    return true;
  }

  async submit(): Promise<any | null> {}
}
