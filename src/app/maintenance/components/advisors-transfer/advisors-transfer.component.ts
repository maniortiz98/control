import { AfterViewInit, Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ColumnsDataTable, ConfigDataTable } from '../../../shared/components/table-results/interfaces';
import { AdvisorsTransferForm, AdvisorTransferContracts, AdvisorTransfersList } from '../../models/advisors-transfer';
import { NotificationsService } from '../../../shared/services/notifications.service';
import { AdvisorsTransferService } from '../../services/advisors-transfer.service';
import { Advisor } from '../../../onboarding/models/catalogs/advisor';
import { ActivatedRoute } from '@angular/router';
import { TableResultsComponent } from '../../../shared/components/table-results/table-results.component';
import { BankingAreaTypeEnum } from '../../../onboarding/models/contract';
import { NotificationModalService } from '../../../shared/services/notification-modal.service';

@Component({
  selector: 'app-advisors-transfer',
  standalone: false,
  templateUrl: './advisors-transfer.component.html',
  styleUrls: ['./advisors-transfer.component.scss']
})
export class AdvisorsTransferComponent implements OnInit, AfterViewInit {

  @ViewChild('inputAdvisor1Number') inputAdvisor1NumberRef!: ElementRef;
  @ViewChild('inputAdvisor2Number') inputAdvisor2NumberRef!: ElementRef;
  @ViewChild('table1Left') table1Left!: TableResultsComponent;
  @ViewChild('table2Right') table2Right!: TableResultsComponent;

  private readonly notificationService = inject(NotificationsService);
  private readonly modalNotifService   = inject(NotificationModalService);
  private readonly advisorTransService = inject(AdvisorsTransferService);
  private readonly route               = inject(ActivatedRoute);

  advisorForm: FormGroup<AdvisorsTransferForm>;
  contractSearchInput: string = '';

  advisorList: Advisor[] = [];

  advisorName1 = '';
  advisorName2 = '';

  // tabsEnabled = false;
  selectedTab = 0;

  // Filtros
  filterBank   = true;
  filterBroker = true;

  // Listas de registros
  leftList : AdvisorTransferContracts[] = [];
  rightList: AdvisorTransferContracts[] = [];

  filteredLeftList : AdvisorTransferContracts[] = [];
  filteredRightList: AdvisorTransferContracts[] = [];

  selectedLeft : AdvisorTransferContracts[] = [];
  selectedRight: AdvisorTransferContracts[] = [];

  tableColumns: ColumnsDataTable[] = [
    { name: 'bankingAreaText', title: 'Tipo de Negocio',                show: true, type: 'string' },
    { name: 'contract',        title: 'Cuenta',                         show: true, type: 'string' },
    { name: 'numClient',       title: 'Cliente',                        show: true, type: 'string' },
    { name: 'fullName',        title: 'Nombre Completo ó Razón Social', show: true, type: 'string' },
  ];

  tableConfig: ConfigDataTable = {
    showPag          : true,
    showViewAction   : false,
    showEditAction   : false,
    showDeleteAction : false,
    multipleSelection: true,
    idName           : 'contract',
    sort             : true,
    pagConfig        : {
      totalRows           : 0,
      currentPage         : 1,
      pageSize            : 50,
      disabled            : false,
      showFirstLastButtons: false,
      pageSizeOptions     : [50],
      hidePageSize        : false,
    }
  };

  /**
   * Constructor
   */
  constructor(private fb: FormBuilder) {
    this.advisorForm = this.fb.nonNullable.group({
      advisorNumber1: ['', Validators.required],
      advisorNumber2: ['', Validators.required]
    });
  }

  /**
   * Ng On Init
   */
  ngOnInit() {
    this.advisorList = this.route.snapshot.data['advisorCatalog'];
  }

  /**
   *
   */
  ngAfterViewInit(): void {
    this.applyFilters();
  }

  /**
   * on search
   * event button
   */
  onSearch() {

    this.resetData();

    if ( this.advisorForm.invalid ) return;

    this.advisorTransService.contractsByCustomer(this.advisorForm.controls.advisorNumber1.value)
    .subscribe((contractsResp: AdvisorTransferContracts[]) => {
      console.log(contractsResp);
      this.leftList = contractsResp.map((item: AdvisorTransferContracts) => {
        item.bankingAreaText = item.bankingArea === BankingAreaTypeEnum.BANCO ? 'BANCO' : 'CASA DE BOLSA';
        return item;
      });
      this.applyFilters();
    });
  }

  /**
   *
   */
  searchAdvisor(event: Event, n: '1'|'2'): void {
    console.log(event, n);
    if ( this.validateEqualAdvisor() ) {
      this.advisorForm.controls[`advisorNumber${n}`].setValue('');
      this[`advisorName${n}`] = '';
      this.notificationService.error('Inválido transferencia al mismo asesor', 'Favor de verificar');
      this[`inputAdvisor${n}NumberRef`].nativeElement.focus();
      return;
    }
    const name = this.getAdvisorName(this.advisorForm.controls[`advisorNumber${n}`].value);
    if ( name ) {
     this[`advisorName${n}`] = `${name}`;
    } else {
      this.notificationService.error('Ejecutivo no localizado', 'Por favor ingresa un número de Asesor válido');
      this.advisorForm.controls[`advisorNumber${n}`].setValue('');
      setTimeout(() => {
        this[`advisorName${n}`] = '';
        this[`inputAdvisor${n}NumberRef`].nativeElement.focus();
      }, 1);
    }
  }

  /**
   * verifies if user input same advisor on source and target advisor
   * returns true if same advisor.
   */
  validateEqualAdvisor(): boolean {
    let ad1 = this.advisorForm.controls[`advisorNumber1`].value;
    let ad2 = this.advisorForm.controls[`advisorNumber2`].value;
    if ( !ad1 || !ad2 ) return false;
    return ad1 === ad2;
  }

  /**
   *
   */
  applyFilters() {

    this.table2Right.deselectAll();
    this.selectedRight = [];

    const contractTerm = this.contractSearchInput.trim().toLowerCase();
    console.log(contractTerm);

    this.filteredLeftList = this.leftList.filter((item: AdvisorTransferContracts) => {
      const byBusinessType =
        (this.filterBank && item.bankingArea === BankingAreaTypeEnum.BANCO) ||
        (this.filterBroker && item.bankingArea === BankingAreaTypeEnum.BOLSA);

      if (!byBusinessType) return false;

      if (!contractTerm) return true;
      return item.contract.toString().toLowerCase().includes(contractTerm);
    });
    console.log(this.filteredLeftList);

    this.filteredRightList = this.rightList.filter((item: AdvisorTransferContracts) => {
      if (this.filterBank && item.bankingArea === BankingAreaTypeEnum.BANCO) return true;
      if (this.filterBroker && item.bankingArea === BankingAreaTypeEnum.BOLSA) return true;
      if (this.filterBank && this.filterBroker) return true;
      return false;
    });
  }

  /**
   *
   */
  applyContractFilter(event: Event): void {

    if ( isNaN(Number(this.contractSearchInput)) ) return;

    if ( this.selectedLeft.length > 0 ) {
      this.selectedLeft = [];
      this.table1Left.deselectAll();
    }

    this.applyFilters();
  }

  /**
   *
   */
  onSelectLeft(selected: any[]) {
    console.log(selected);
    this.selectedLeft = selected;
  }

  /**
   *
   */
  onSelectRight(selected: any[]) {
    console.log(selected);
    this.selectedRight = selected;
  }

  /**
   *
   */
  moveToRight() {
    console.log(this.selectedLeft);
    this.contractSearchInput = '';
    this.selectedLeft.forEach((item: AdvisorTransferContracts & { active?: boolean }) => {
      delete item.active;
    });
    console.log(this.selectedLeft);

    this.rightList = [...this.rightList, ...this.selectedLeft];
    console.log(this.rightList);

    this.leftList = this.leftList.filter((item: AdvisorTransferContracts) => {
      const found = this.selectedLeft.find((element: AdvisorTransferContracts) => element.contract === item.contract);
      if ( found ) {
        return false;
      }
      return true;
    });

    this.table1Left.deselectAll();
    console.log(this.leftList);
    this.selectedLeft = [];
    this.applyFilters();
  }

  /**
   *
   */
  moveToLeft() {
    this.contractSearchInput = '';
    this.selectedRight.forEach((item: AdvisorTransferContracts & { active?: boolean }) => {
      delete item.active;
    });
    this.leftList = [...this.leftList, ...this.selectedRight];

    this.rightList = this.rightList.filter((item: AdvisorTransferContracts) => {
      const found = this.selectedRight.find((element: AdvisorTransferContracts) => element.contract === item.contract);
      if ( found ) {
        return false;
      }
      return true;
    });

    this.table2Right.deselectAll();
    this.selectedRight = [];
    this.applyFilters();
  }

  /**
   *
   */
  onSave() {
    console.log(this.rightList);
    const bb: AdvisorTransfersList[] = this.rightList.map((item: AdvisorTransferContracts) => {
      return {
        bankingArea        : item.bankingArea,
        contract           : item.contract.toString(),
        originPromoter     : this.advisorForm.controls.advisorNumber1.value,
        destinationPromoter: this.advisorForm.controls.advisorNumber2.value,
      }
    });
    this.advisorTransService.transferContracts(bb).subscribe((resp: any) => {
      console.log(resp);
      if ( resp['status'] && '1' === resp['status'] ) {
        this.modalNotifService.success({
          title: 'Traspaso Exitoso',
          afterMessages: ['Los movimientos solicitados entre carteras han sido ejecutados exitosamente'],
          btnAccept: 'Aceptar'
        });
      } else {
        this.modalNotifService.error({
          title: 'Error',
          afterMessages: ['Hubo un error en el transpaso.'],
          btnAccept: 'Aceptar'
        });
      }
    });
  }

  /**
   * clear whole interface
   */
  onCancel(): void {
    this.advisorForm.reset();
    this.advisorName1     = '';
    this.advisorName2     = '';

    this.resetData();
  }

  /**
   * groups only reset values and store data.
   */
  resetData(): void {
    this.leftList         = [];
    this.rightList        = [];
    this.selectedLeft     = [];
    this.selectedRight    = [];
    this.filteredRightList= [];
    this.filteredLeftList = [];
    this.table1Left.deselectAll();
    this.table2Right.deselectAll();
    this.contractSearchInput = '';
  }

  /**
   * retrieves the Advisor name of advisor id given.
   */
  getAdvisorName(id: string): string|undefined {
    console.log(this.advisorList);
    const dd = this.advisorList.find((advisor: Advisor) => advisor.advisorCode === id);
    return dd?.name;
  }
}
