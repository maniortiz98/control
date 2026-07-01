import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { NotificationsService } from '../../../shared/services/notifications.service';
import { ERROR_MESSAGES } from '../../constants/form-messages';
import { ActivatedRoute, Router, Data } from '@angular/router';
import { SEARCH_TYPE } from '../../constants/constants';
import { OnboardingService } from '../../services/onboarding.service';
import { Client } from '../../models/client-data';
import { SearchCustomerService } from '../../../shared/services/search-customer.service';
import { ColumnsDataTable, ConfigDataTable } from '../../../shared/components/table-results/interfaces';
import { convertDate } from '../../../shared/utils/datetime';
import { SearchCustomerV2Component } from '../../../shared/components/search-customer-v2/search-customer-v2.component';
import { compareAndReturnIdRfcNifTinNss, compareAndReturnValueRfcNifTinNss } from '../../../shared/utils/map-rfc-nif-tin-nss';
import { CustomerOnboardingService } from '../../../customer/services/customer-onboarding.service';

@Component({
  selector: 'app-search',
  standalone: false,
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent implements OnInit {

  @ViewChild(SearchCustomerV2Component) searchCustomerComponent!: SearchCustomerV2Component;

  private readonly notificationService = inject(NotificationsService);
  private readonly router              = inject(Router);
  private readonly route               = inject(ActivatedRoute);
  private readonly onboardingService   = inject(OnboardingService);
  private readonly onboardingServiceClient  = inject(CustomerOnboardingService);
  private readonly searchService       = inject(SearchCustomerService);

  readonly SEARCH_TYPE = SEARCH_TYPE;

  searchProspectCols: ColumnsDataTable[] = [
    { name: 'curp',            title: 'CURP',                show: true, type: 'string' },
    { name: 'rfc',             title: 'RFC',                 show: true, type: 'string' },
    { name: 'applicationId',   title: 'ID Solicitud',        show: true, type: 'string' },
    { name: 'firstName',       title: 'Primer Nombre',       show: true, type: 'string' },
    { name: 'middleName',      title: 'Segundo Nombre',      show: true, type: 'string' },
    { name: 'lastName',        title: 'Primer Apellido',     show: true, type: 'string' },
    { name: 'secondLastName',  title: 'Segundo Apellido',    show: true, type: 'string' },
    { name: 'birthday',        title: 'Fecha de Nacimiento', show: true, type: 'string' },
    { name: 'applicationDate', title: 'Fecha de solicitud',  show: true, type: 'string' },
    { name: 'contract',        title: 'Tipo',                show: true, type: 'string' },
    { name: 'subcontract',     title: 'Subtipo',             show: true, type: 'string' },
  ];

  searchCustomerCols: ColumnsDataTable[] = [
    { name: 'customerNumber', title: 'Número de Cliente',   show: true, type: 'string' },
    { name: 'curp',           title: 'CURP',                show: true, type: 'string' },
    { name: 'numId',          title: 'RFC / NIF / NSS',     show: true, type: 'string' },
    { name: 'firstName',      title: 'Primer Nombre',       show: true, type: 'string' },
    { name: 'middleName',     title: 'Segundo Nombre',      show: true, type: 'string' },
    { name: 'lastName',       title: 'Primer Apellido',     show: true, type: 'string' },
    { name: 'secondLastName', title: 'Segundo Apellido',    show: true, type: 'string' },
    { name: 'birthday',       title: 'Fecha de nacimiento', show: true, type: 'string' },
  ];
  resultTableCols: any = [];
  configDataTable: ConfigDataTable = {
    showPag: true,
    showEditAction: false,
    showDeleteAction: false,
    showViewAction: false,
    multipleSelection: false,
  };

  resultTableData: any = [];

  hide = {
    search: false,
    results: true,
    onboardingButton: true,
  }

  typeSearch: string = '';

  selectedPersonType: 'PM'|'PF'|'' = '';

  selectedRowData: any;
  onboardingButtonText = 'Alta Contracto';
  disableSubmitBtn = true;
  showMantClient = false;

  /**
   * On Init
   */
  ngOnInit(): void {
    this.onboardingService.clearOnboardingInfo();
    this.onboardingServiceClient.clearOnboardingInfo();
    this.route.data.subscribe((data: Data) => {
      this.typeSearch = data['typeSearch'];
      if ( this.typeSearch === SEARCH_TYPE.CUSTOMER ) {
        this.showMantClient = true;
        this.onboardingButtonText = 'Alta de Contrato';
        this.configDataTable = {
          showPag: true,
          showEditAction: false,
          showDeleteAction: false,
          showViewAction: false,
          multipleSelection: false,
          idName: "numId"
        };
        this.resultTableCols = this.searchCustomerCols;
      } else {
        this.onboardingButtonText = 'Consultar';
        this.configDataTable = {
          showPag: true,
          showEditAction: false,
          showDeleteAction: false,
          showViewAction: false,
          multipleSelection: false,
        };
        this.resultTableCols = this.searchProspectCols;
      }
    });
    console.log(this.selectedRowData);
  }

  /**
   *
   */
  eventSearch(): void {
    this.selectedRowData = null;
    if ( this.typeSearch === SEARCH_TYPE.CUSTOMER ) {
      this.searchByCustomer();
    } else if ( this.typeSearch === SEARCH_TYPE.PROSPECT ) {
      this.searchByProspect();
    }

  }


  /**
   *
   */
  searchByProspect(): void {
    this.searchCustomerComponent.submit(false).then((validation: any) => {
      console.log(validation);

      if ( validation.valid ) {
        const payload = {
          applicationNumber: validation.data.idProspect,
          client: {
            firstName: validation.data.firstName,
            middleName: validation.data.middleName,
            lastName: validation.data.firstLastName,
            secondLastName: validation.data.secondLastName,
            rfc: validation.data.typeId === 'rfc' ? validation.data.numId : '',
            nif: validation.data.typeId === 'nif' ? validation.data.numId : '',
            tin: validation.data.typeId === 'tin' ? validation.data.numId : '',
            nss: validation.data.typeId === 'nss' ? validation.data.numId : '',
            curp: validation.data.curp,
            birthdate: convertDate(validation.data.birthdate),
          }
        };

        this.searchService.searchProspect(payload).subscribe((response: any) => {
          console.log(response);
          if ( response.length === 0 ) {
            this.notificationService.error(ERROR_MESSAGES.NO_RESULTS, ERROR_MESSAGES.NO_RESULTS_SUGG);
            this.hide.onboardingButton = false;
          } else {
            this.hide.results = false;
            this.hide.search = true;

            this.resultTableData = response.map((item: any) => {
              let temp: any = {
                curp           : item.client.curp,
                rfc            : item.client.rfc,
                applicationId  : item.applicationNumber,
                firstName      : item.client.firstName,
                middleName     : item.client.middleName,
                lastName       : item.client.lastName,
                secondLastName : item.client.secondLastName,
                birthday       : item.client.birthdate,
                applicationDate: item.createdDate ?? '',
                contract       : item.contract.contractType,
                subcontract    : item.contract.subContractType,
                theData        : item,
              }

              // if ( 'undefined' != typeof item.rfc ) {
              //   temp['numId'] = item.rfc;
              // } else if ( 'undefined' != typeof item.nif ) {
              //   temp['numId'] = item.nif
              // } else if ( 'undefined' != typeof item.nss ) {
              //   temp['numId'] = item.nss
              // }
              return temp;
            });
          }
        });
      }

    });
  }

  /**
   *
   */
  searchByCustomer(): void {
    console.log("searchByCustomer(): void {");
    this.searchCustomerComponent.submit(true).then((validation: any) => {

      if ( 0 === validation.results.length ) {
        this.notificationService.error(ERROR_MESSAGES.NO_RESULTS, ERROR_MESSAGES.NO_RESULTS_SUGG);
        this.hide.onboardingButton = false;
      } else {
        // this.unsavedChangesService.setUnsavedChanges(false);
        this.hide.results = false;
        this.hide.search = true;

        this.resultTableData = validation.results.map((item: any) => {
          let temp: any = {
            customerNumber: item.clientNumber,
            curp          : item.curp,
            firstName     : item.firstName,
            middleName    : item.middleName,
            lastName      : item.lastName,
            secondLastName: item.secondLastName,
            birthday      : item.birthDate,
            theData       : item
          }

          if ( 'undefined' != typeof item.rfc ) {
            temp['numId'] = item.rfc;
          } else if ( 'undefined' != typeof item.nif ) {
            temp['numId'] = item.nif
          } else if ( 'undefined' != typeof item.nss ) {
            temp['numId'] = item.nss
          }
          console.log(temp)
          return temp;
        });
      }


    });
  }

  /**
   * Event when click 'onboarding' button.
   * Redirects to "onboarding".
   */
  onboarding(): void {
    if ( !this.hide.results ) {
      if ( this.selectedRowData ) {
        console.log(this.selectedRowData.row);
        if ( this.typeSearch === SEARCH_TYPE.CUSTOMER ) {
          this.saveData(this.selectedRowData.row);
          this.onboardingService.updateCurrentOnboardingInfo({
            isCustomer: true,
            clientId: this.selectedRowData.row.customerNumber
            // requestId: '11181'
          });
          this.router.navigate(['new-contract'], {relativeTo: this.route.parent});
        } else if ( this.typeSearch === SEARCH_TYPE.PROSPECT ) {
          if(this.selectedRowData.row.contract){
            this.saveData(this.selectedRowData.row);
            this.onboardingService.updateCurrentOnboardingInfo({
            isOnboarding: true,
            requestId: this.selectedRowData.row.applicationId
            // requestId: '11181'
            });
            this.router.navigate(['new-customer'], {relativeTo: this.route.parent});
          } else if(this.selectedRowData.row.contract === null || this.selectedRowData.row.contract === 0){
            this.router.navigate(['/customer/new-contract'], {relativeTo: this.route});
            this.onboardingServiceClient.updateCurrentOnboardingInfo({
            isOnboarding: true,
            requestId: this.selectedRowData.row.applicationId,
            personType: 'PF',
            // requestId: '11181'
            });
          }
        }
      } else {
        this.notificationService.error(ERROR_MESSAGES.NO_DATA_SELECTED);
      }
    } else {
      this.searchCustomerComponent.submit(false).then((dd: any) => {
        this.saveData(dd.data);
        this.router.navigate(['new-contract'], {relativeTo: this.route.parent});
      });

    }
  }

    /**
   * Event when click 'Mantenimiento Cliente' button.
   * Redirects to "onboarding".
   */
  mantClient(): void {
    if ( !this.hide.results ) {
      if ( this.selectedRowData ) {
        this.saveData(this.selectedRowData.row);
        console.log(this.selectedRowData.row);
        if ( this.typeSearch === SEARCH_TYPE.CUSTOMER ) {
          this.onboardingServiceClient.updateCurrentOnboardingInfo({
            isMaintenance: true,
            clientId: this.selectedRowData.row.customerNumber,
            personType: 'PF'
            // requestId: '11181'
          });
          this.router.navigate(['/customer/new-contract/customer-info']);
        }
      }
    }
  }

  /**
   * Event that returns to searchv form.
   */
  cancelEvent(): void {
    this.resultTableData = [];
    this.hide.results = true;
    this.hide.search = false;
    this.selectedRowData = null;
    this.disableSubmitBtn = true;
  }

  /**
   *
   * @param event
   */
  selectedRow(event: any): void {
    this.selectedRowData = event;
    console.log(this.selectedRowData.row);
    this.disableSubmitBtn = false;
  }

  /**
   *
   * @param data
   */
  saveData(data: any): void {
    console.log(data);
    console.log(this.typeSearch);
    //     {
    //     "idProspect": "",
    //     "curp": "",
    //     "typeId": "rfc",
    //     "numId": "",
    //     "firstName": "HECTOR",
    //     "middleName": "JONATHAN",
    //     "firstLastName": "LEON",
    //     "secondLastName": "LOPEZ",
    //     "birthdate": "1987-11-10T06:00:00.000Z"
    // }
    let dd: Client = {};

    if ( this.typeSearch === SEARCH_TYPE.CUSTOMER ) {
      console.log('Iniciando data customer')
      console.log(data.theData);
      //TODO Aqui el servicio de busqueda qeu es completo por seccion

      // DATOS DE RESPUESTA
      // {
      //     "firstName": "DIEGO",
      //     "middleName": "",
      //     "lastName": "BARRERA",
      //     "secondLastName": "GIL",
      //     "birthDate": "1989-04-23",
      //     "rfc": "BAGD890423",
      //     "curp": "BAGD890423HDFRLG00",
      //     "clientNumber": 10000545,
      //     "gender": "1",
      //     "birthCountry": "MX"
      // }
      dd = {
        curp          : data.theData?.curp           ?? data.curp,
        personType: this.selectedPersonType === 'PF' ? '1' : '2',
        dateOfBirth   : data.theData?.birthDate      ?? data.birthDate,
        customerNumber: data.theData?.clientNumber   ?? data.clientNumber,
        firstName     : data.theData?.firstName      ?? data.firstName,
        middleName    : data.theData?.middleName     ?? data.middleName,
        firstLastName : data.theData?.lastName       ?? data.lastName,
        secondLastName: data.theData?.secondLastName ?? data.secondLastName,

        typeIden      : data.theData?.rfc          ?? '',
        rfc           : data.theData?.rfc          ?? '',
        gender        : data.theData?.gender       ?? '',
        countryOfBirth: data.theData?.birthCountry ?? '',
      };


    } else if ( this.typeSearch === SEARCH_TYPE.PROSPECT ) {

      // DATOS DE RESPUESTA (encontrado)
      // {
      //     "applicationNumber": "10183",
      //     "client": {
      //         "firstName": "HECTOR",
      //         "middleName": "JONATHAN",
      //         "lastName": "LEON",
      //         "secondLastName": "LOPEZ",
      //         "rfc": "LELH871110",
      //         "nif": "",
      //         "tin": "",
      //         "nss": "",
      //         "curp": "LELH871110HMSNPC00",
      //         "birthdate": "10/11/1987",
      //     },
      //     "contract": {
      //         "contractType": "CONTRATO MARCO DE PRODUCTOS Y SERVICIOS BANCARIOS MULTIPLES",
      //         "subContractType": "NORMAL",
      //     },
      //     "createdDate": null
      // }

      // DATOS NO ENCONTRADOS:
      // {
      //     "idProspect": "",
      //     "curp": "",
      //     "typeId": "rfc",
      //     "numId": "",
      //     "firstName": "HECTOR",
      //     "middleName": "JONATHAN",
      //     "firstLastName": "LEON",
      //     "secondLastName": "LOPEZ",
      //     "birthdate": "1987-11-10T06:00:00.000Z"
      // }
      dd = {
        curp          : data.theData?.client?.curp          ?? data.curp,
        personType    : this.selectedPersonType === 'PF' ? '1' : '2',
        dateOfBirth   : data.theData?.client.birthdate      ?? data.birthdate,
        firstName     : data.theData?.client.firstName      ?? data.firstName,
        middleName    : data.theData?.client.middleName     ?? data.firstLastName,
        firstLastName : data.theData?.client.lastName       ?? data.firstLastName,
        secondLastName: data.theData?.client.secondLastName ?? data.secondLastName,

        idProspect         : data.theData?.applicationNumber        ?? '',
        applicationDate    : data.theData?.createdDate              ?? '',
        contractType       : data.theData?.contract.contractType    ?? '',
        typeContractSubtype: data.theData?.contract.subContractType ?? '',
      };

      if ( data.theData ) {
        dd.typeIden = compareAndReturnValueRfcNifTinNss(
          data.theData.client.rfc,
          data.theData.client.nif,
          data.theData.client.tin,
          data.theData.client.nss,
        );
        dd.typeId = data.numId;
        dd.typeId = compareAndReturnIdRfcNifTinNss(
          data.theData.client.rfc,
          data.theData.client.nif,
          data.theData.client.tin,
          data.theData.client.nss,
        );
      } else {
        dd.typeIden = data.typeId;
        dd.typeId   = data.numId;
      }

    }

    console.log(dd);
    this.onboardingService.setCustomerInitalData(dd);
  }
}
