import { Component, inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PERSON_TYPE, CustomerREGEX, SEARCH_TYPE, TYPE_IDENTIFICATION } from '../../constants/customer-constants';
import * as DateTimeUtils from '../../utils/customer-datetime';
import { CustomerNotificationsService } from '../../services/customer-notifications.service';
import { ERROR_MESSAGES } from '../../constants/customer-form-messages';
import { CustomerSearchCustomerService } from '../../services/customer-search-customer.service';
import { CustomerSearchCustomer } from '../../models/customer-search-customer';
import { firstValueFrom, Observable } from 'rxjs';
import { CustomerSearchCustomerSubmitForm, CustomerSearchForm } from './customer-search-customer-submit-form';

@Component({
  selector: 'app-customer-search-customer',
  standalone: false,
  templateUrl: './customer-search-customer.component.html',
  styleUrl: './customer-search-customer.component.scss'
})
export class CustomerSearchCustomerComponent implements OnInit {

  @Input('type') type: string = SEARCH_TYPE.CustomerCUSTOMER;

  private readonly formBuilder         = inject(FormBuilder);
  private readonly notificationService = inject(CustomerNotificationsService);
  private searchService                = inject(CustomerSearchCustomerService);

  readonly SEARCH_TYPE = SEARCH_TYPE;

  form: FormGroup = new FormGroup({});

  /**
   * used to change dinamically the max lenght of input 'numId',
   * can be used for rfc/nif/nss
   */
  numIdMaxLen: number = 13;

  /**
   * Sets the max value for Birthday datepicker.
   */
  birthDates = {
    startAt: DateTimeUtils.yearsAgoLegacy(18),
    max: new Date(),
    min: DateTimeUtils.yearsAgoLegacy(150),
  };

  ngOnInit(): void {

    if ( this.SEARCH_TYPE.CustomerCUSTOMER === this.type ) {
      this.form =  this.formBuilder.nonNullable.group({
        customerNumber: ['', [
          Validators.maxLength(10),
          Validators.pattern(CustomerREGEX.FIRST_NAME_VALIDATION)
        ]],
        curp          : ['', [
          Validators.maxLength(18),
          Validators.pattern(CustomerREGEX.CURP_VALIDATION)
        ]],
        typeId        : ['rfc', []],
        numId         : ['', [Validators.maxLength(13)]],
        firstName     : ['', [
          Validators.maxLength(50),
          Validators.pattern(CustomerREGEX.FIRST_NAME_VALIDATION)
        ]],
        middleName    : ['', [
          Validators.maxLength(50),
          Validators.pattern(CustomerREGEX.FIRST_NAME_VALIDATION)
        ]],
        firstLastName      : ['', [
          Validators.maxLength(50),
          Validators.pattern(CustomerREGEX.FIRST_NAME_VALIDATION)
        ]],
        secondLastName: ['', [
          Validators.maxLength(50),
          Validators.pattern(CustomerREGEX.FIRST_NAME_VALIDATION)
        ]],
        birthdate     : ['', []],
      });
    } else if ( this.SEARCH_TYPE.PROSPECT === this.type ) {
      this.form =  this.formBuilder.nonNullable.group({
        idProspect    : ['', [
          Validators.pattern(CustomerREGEX.ALPHANUMERIC),
          Validators.maxLength(15),
        ]],
        // applicationDate: ['', []],
        curp          : ['', [
          Validators.maxLength(18),
          Validators.pattern(CustomerREGEX.CURP_VALIDATION)
        ]],
        typeId        : ['rfc', []],
        numId         : ['', [Validators.maxLength(13)]],
        firstName     : ['', [
          Validators.maxLength(50),
          Validators.pattern(CustomerREGEX.FIRST_NAME_VALIDATION)
        ]],
        middleName    : ['', [
          Validators.maxLength(50),
          Validators.pattern(CustomerREGEX.FIRST_NAME_VALIDATION)
        ]],
        firstLastName      : ['', [
          Validators.maxLength(50),
          Validators.pattern(CustomerREGEX.FIRST_NAME_VALIDATION)
        ]],
        secondLastName: ['', [
          Validators.maxLength(50),
          Validators.pattern(CustomerREGEX.FIRST_NAME_VALIDATION)
        ]],
        birthdate     : ['', []],
      });
    }

    this.onChanges();
  }

  onChanges(): void {
    this.form.controls['typeId'].valueChanges.subscribe((value: string) => {
      if ( value === 'rfc' ) {
        this.numIdMaxLen = 13;
        this.form.get('numId')?.setValidators([
          Validators.maxLength(13),
          Validators.pattern(CustomerREGEX.RFC_VALIDATION)
        ]);
      } else {
        this.numIdMaxLen = 9;
        this.form.get('numId')?.setValidators([
          Validators.maxLength(9),
          Validators.pattern(CustomerREGEX.ALPHANUMERIC)
        ]);
      }
      this.form.get('numId')?.setValue('');
      this.form.get('numId')?.updateValueAndValidity();
    });

    this.form.controls['applicationDate']?.valueChanges.subscribe((value: any) => {
      if ( value == null ) {
        this.form.controls['applicationDate'].setValue("");
      }
    });

    this.form.controls['birthdate'].valueChanges.subscribe((value: any) => {
      if ( value == null ) {
        this.form.controls['birthdate'].setValue("");
      }
    });
  }

  /**
   *
   * @param search - If data form is valid, then performs the search
   *        and returns the results appended to the response object.
   * @returns
   */
  async submit(search: boolean): Promise<CustomerSearchCustomerSubmitForm> {
    document.body.classList.add('show-validation');

    const dataform = this.form.getRawValue();
    let form: CustomerSearchCustomerSubmitForm = {
      data: dataform,
      type: this.type,
      valid1: this.validGroup1(dataform),
      valid2: this.validGroup2(dataform),
      valid3: this.validGroup3(dataform),
      valid4: this.validGroup4(dataform),
      empty: false,
      groupError: false,
      valid: false,
    };

    form.groupError = this.someGroupWithError(form);
    form.empty = this.allEmpty(form);
    form.valid = this.form.valid ;

    if (this.form.invalid || form.groupError || form.empty ) {
      form.valid = false;
    }

    this.validate(form);

    if ( form.valid && search ) {
      form.results = await firstValueFrom(this.search(form));
    }

    return form;
  }


  /**
   * If Invalid, show messages.
   */
  validate(validation: CustomerSearchCustomerSubmitForm): void {
    if ( !validation.valid ) {
      if ( validation.empty ) {
        this.notificationService.error(ERROR_MESSAGES.EMPTY_FORM);
      } else if ( validation.groupError ) {
        if ( -1 === validation.valid1 ) {
          this.notificationService.error(ERROR_MESSAGES.PROSPECTIVE_DATE_INCOMPLETE);
        }
        if ( -1 === validation.valid4 ) {
          this.notificationService.error(ERROR_MESSAGES.FULLNAME_BIRTHDAY_INCOMPLETE);
        }
      } else if ( !validation.valid ) {
        this.notificationService.error(ERROR_MESSAGES.INCORRECT_FORMAT);
      }
    }
  }

  search(validation: CustomerSearchCustomerSubmitForm): Observable<any> {
    let dataSearch: any = {
      fullName: `${validation.data.firstName} ${validation.data.middleName} ${validation.data.firstLastName} ${validation.data.secondLastName}`,
      birthDate: DateTimeUtils.convertDateTo(validation.data.birthdate, 'yyyy-mm-dd'),
      curp: validation.data.curp,
      rfc: '',
      nif: '',
      ssn: '',
      clientNumber: '',
      name: validation.data.firstName,
      middleName: validation.data.middleName,
      lastName: validation.data.firstLastName,
      secondLastName: validation.data.secondLastName,
    };

    dataSearch.fullName = dataSearch.fullName.trim();

    if ( TYPE_IDENTIFICATION.NIF === validation.data.typeId ) {
      dataSearch['nif'] = validation.data.numId;
    } else if ( TYPE_IDENTIFICATION.NSS === validation.data.typeId ) {
      dataSearch['ssn'] = validation.data.numId;
    } else if ( TYPE_IDENTIFICATION.RFC === validation.data.typeId ) {
      dataSearch['rfc'] = validation.data.numId;
    }

    if ( this.type == this.SEARCH_TYPE.CustomerCUSTOMER ) {
      dataSearch['clientNumber'] = validation.data.customerNumber;
    } else if ( this.type == this.SEARCH_TYPE.PROSPECT ) {
      // TODO en elbody falta donde agregar fecha solicidut y id prospecto
    }

    return this.searchService.searchCustomer(dataSearch);
  }

  /**
   * Validates the group 4. If all fields are filled to perform a search.
   * @param data - The data form.
   * @returns 1 if all fields filled, 0 if no field filled, -1 if has error.
   */
  validGroup1(data: any): number {
    let valid = 0;
    if ( this.type === this.SEARCH_TYPE.CustomerCUSTOMER ) {
        valid = data.customerNumber != "" ? 1 : 0;
    } else if ( this.type === this.SEARCH_TYPE.PROSPECT ) {
      if ( data.idProspect != "" /* || data.applicationDate != "" */ ) {
        valid = ( data.idProspect != ""/*  && data.applicationDate != "" */ ) ? 1 : -1;
      }
    }
    return valid;
  }

  /**
   * Validates if curp is filled.
   *
   * @para data - The data from form.
   */
  validGroup2(data: any): number {
    let valid = 0;
    if ( "" != data.curp ) {
      valid = 1;
    }
    return valid;
  }

  /**
   * Validates if id is filled.
   *
   * @para data - The data from form.
   */
  validGroup3(data: any): number {
    let valid = 0;
    if ( "" != data.numId ) {
      valid = 1;
    }
    return valid;
  }

  /**
   * Validates the group 4. If all fields are filled to perform a search.
   *
   * Primer Nombre: Requerido
   * Segundo Nombre: Opcional
   * Primer Apellido || Segundo Apellido: Requerido.
   * Fecha Nacimiento: Requerido
   *
   * @param data - The data form.
   * @returns 1 if all fields filled, 0 if no field filled, -1 if has error.
   */
  validGroup4(data: any): number {
    let grp4fields = ['firstName','middleName','lastName','secondLastName','birthdate'];
    let valid = false;

    let grp4touched = grp4fields.some((item: string) => {
      return data[item] != "" && data[item] != null;
    });

    if ( grp4touched ) {
      valid = true;
      if ( "" === data.firstName || "" === data.birthdate ) {
        return -1;
      } else if ( "" === data.lastName && "" === data.secondLastName ) {
        return -1;
      } else {
        return 1;
      }
    } else {
      return 0
    }
  }

  /**
   *
   */
  someGroupWithError(form: any): boolean {
    let valid = false;
    if ( form.valid1 == -1 || form.valid2 == -1 ||
      form.valid3 == -1 || form.valid4 == -1
    ) {
        valid = true;
    }
    return valid;
  }

  /**
   *
   * @param form
   */
  allEmpty(form: any): boolean {
    let valid = false;
    if ( form.valid1 == 0 && form.valid2 == 0 &&
      form.valid3 == 0 && form.valid4 == 0
    ) {
        valid = true;
    }
    return valid;
  }

}








