import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';

import { AuthorizedFormModalComponent } from './authorized-form-modal.component';
import { NotificationsService } from '../../../../shared/services/notifications.service';
import { ModalSearchClientService } from '../../../../shared/services/modal-search-client.service';
import { CustomerInformationService } from '../../../../shared/services/customer.service';
import { SearchClientFlowService } from '../../../../shared/services/search-client-flow.service';
import { CatalogsService } from '../../../../shared/services/catalogs.service';
import { UnsavedChangesService } from '../../../../core/services/unsaved-changes.service';

describe('AuthorizedFormModalComponent', () => {
    let component: AuthorizedFormModalComponent;
    let fixture: ComponentFixture<AuthorizedFormModalComponent>;

    let dialogRef: jasmine.SpyObj<MatDialogRef<AuthorizedFormModalComponent>>;
    let notifService: jasmine.SpyObj<NotificationsService>;
    let searchClientService: jasmine.SpyObj<ModalSearchClientService>;
    let customerService: jasmine.SpyObj<CustomerInformationService>;
    let clientFlowService: jasmine.SpyObj<SearchClientFlowService>;
    let catalogsService: jasmine.SpyObj<CatalogsService>;
    let unsavedChangesService: jasmine.SpyObj<UnsavedChangesService>;

    const dataMock = {
        relationshipList: () => [{ relationshipId: '1', relationship: 'Familiar' }],
        economicActivityList: () => [{ id: '1', description: 'Empleado' }],
        occupationList: () => [{ id: '1', description: 'Ingeniero' }],
        authorizedPersonTypeList: () => [{ authorizedPersonId: '1', authorizedPerson: 'Titular' }],
        addressTypeList: () => [{ addressTypeId: '1', addressType: 'Casa' }],
        facultyOption: null,
        edit: false,
        dataToEdit: {
            id: 1,
            personId: 1,
            tempId: 'tmp-1',
            active: true,
            clientData: {},
            addressData: {},
            contactData: {},
            authorizedPerson: {},
        },
        isMaintenance: false,
        permissions: ['add', 'edit', 'read'],
    };

    const buildChildStubs = () => {
        const clientProfileForm = new FormGroup({ name: new FormControl('') });
        const addressProfileForm = new FormGroup({ street: new FormControl('') });
        const phoneForm = new FormGroup({
            phoneType: new FormControl('1'),
            phoneCountry: new FormControl('MX'),
            phoneCodeArea: new FormControl('55'),
            phone: new FormControl('5555555555'),
            phoneExtension: new FormControl(''),
            phoneNotification: new FormControl(false),
        });

        component.clientDataComponent = {
            profileForm: clientProfileForm,
            submitComplet: jasmine.createSpy('submitComplet').and.resolveTo({
                curp: 'CURP123456HDFABC01',
                foreignerWithoutCurp: false,
                typeIden: '1',
                rfc: 'XAXX010101000',
                dateOfBirth: '1990-01-01',
                gender: 'H',
                nationality: 'MX',
                countryOfBirth: 'MX',
                stateOfBirth: '09',
                cityOfBirth: 'CDMX',
                firstName: 'JUAN',
                middleName: 'CARLOS',
                firstLastName: 'PEREZ',
                secondLastName: 'LOPEZ',
                ppe: false,
                bankAreaTypeId: '',
                contraTypeId: '',
                typeContractSubtypeId: '',
            }),
            setClientData: jasmine.createSpy('setClientData'),
            enableForm: jasmine.createSpy('enableForm'),
        } as any;

        component.addressComponent = {
            profileForm: addressProfileForm,
            onSubmit: jasmine.createSpy('onSubmit').and.resolveTo({
                id: '1',
                addressType: '1',
                country: 'MX',
                postalCode: '01234',
                federalEntity: 'CDMX',
                city: 'CDMX',
                municipality: 'BENITO JUAREZ',
                neighborhood: 'DEL VALLE',
                street: 'INSURGENTES',
                externalNumber: '100',
                internalNumber: '1',
            }),
            setAddresData: jasmine.createSpy('setAddresData'),
        } as any;

        component.phoneSectionComponent = {
            form: phoneForm,
            onSubmit: jasmine.createSpy('onSubmit').and.callFake(async () => {
                component.getPhoneSectionValues({
                    id: '1',
                    phone: '5555555555',
                    phoneType: 'CEL',
                    phoneTypeId: '1',
                    phoneCountry: 'MEXICO',
                    phoneCountryId: 'MX',
                    phoneCodeArea: '55',
                    phoneLada: '',
                    phoneExtension: '',
                    phoneNotification: false,
                    active: true,
                });
                return true;
            }),
            selectedPhoneType: { set: jasmine.createSpy('setPhoneType') },
            selectedCountry: { set: jasmine.createSpy('setCountry') },
        } as any;

        component.phoneContactSection = {
            id: '1',
            phone: '5555555555',
            phoneType: 'CEL',
            phoneTypeId: '1',
            phoneCountry: 'MEXICO',
            phoneCountryId: 'MX',
            phoneCodeArea: '55',
            phoneLada: '',
            phoneExtension: '',
            phoneNotification: false,
            active: true,
        };
    };

    beforeEach(async () => {
        dialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
        notifService = jasmine.createSpyObj('NotificationsService', ['error']);
        searchClientService = jasmine.createSpyObj('ModalSearchClientService', ['searchClient']);
        customerService = jasmine.createSpyObj('CustomerInformationService', ['getCustomerInfo']);
        clientFlowService = jasmine.createSpyObj('SearchClientFlowService', ['validInHomonyms', 'validInWatchList']);
        catalogsService = jasmine.createSpyObj('CatalogsService', ['getPhoneType', 'getCountry']);
        unsavedChangesService = jasmine.createSpyObj('UnsavedChangesService', ['setUnsavedChanges']);

        catalogsService.getPhoneType.and.returnValue(of([{ id: '1', description: 'CEL' }] as any));
        catalogsService.getCountry.and.returnValue(of([{ id: 'MX', description: 'MEXICO' }] as any));
        clientFlowService.validInWatchList.and.resolveTo(true);

        await TestBed.configureTestingModule({
            declarations: [AuthorizedFormModalComponent],
            imports: [ReactiveFormsModule],
            providers: [
                FormBuilder,
                { provide: MAT_DIALOG_DATA, useValue: dataMock },
                { provide: MatDialogRef, useValue: dialogRef },
                { provide: NotificationsService, useValue: notifService },
                { provide: ModalSearchClientService, useValue: searchClientService },
                { provide: CustomerInformationService, useValue: customerService },
                { provide: SearchClientFlowService, useValue: clientFlowService },
                { provide: CatalogsService, useValue: catalogsService },
                { provide: UnsavedChangesService, useValue: unsavedChangesService },
            ],
            schemas: [NO_ERRORS_SCHEMA],
        })
            .overrideComponent(AuthorizedFormModalComponent, { set: { template: '' } })
            .compileComponents();

        fixture = TestBed.createComponent(AuthorizedFormModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        buildChildStubs();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should load catalogs on init', () => {
        expect(catalogsService.getPhoneType).toHaveBeenCalled();
        expect(catalogsService.getCountry).toHaveBeenCalled();
        expect(component.phoneTypeList.length).toBe(1);
        expect(component.countryList.length).toBe(1);
    });

    it('should require otherFaculty only when OTHER_RULE_ID is selected', () => {
        component.form.controls.faculty.setValue(component.OTHER_RULE_ID);
        component.form.controls.otherFaculty.setValue('');
        component.form.controls.otherFaculty.markAsTouched();

        expect(component.form.controls.otherFaculty.hasError('required')).toBeTrue();

        component.form.controls.faculty.setValue('1 Firma A');

        expect(component.form.controls.otherFaculty.hasError('required')).toBeFalse();
    });

    it('should validate required fields', () => {
        component.form.controls.relationship.setValue('');

        const invalid = component.validateRequiredFields();

        expect(invalid).toBeTrue();
        expect(component.form.controls.relationship.touched).toBeTrue();
    });

    it('should detect invalid format fields', () => {
        component.form.controls.email.setValue('invalid-email');

        const invalid = component.invalidFormatFields();

        expect(invalid).toBeTrue();
        expect(component.form.controls.email.touched).toBeTrue();
    });

    it('should close modal with cancel payload', () => {
        component.cancel();

        expect(dialogRef.close).toHaveBeenCalledWith({ ok: false, data: null });
    });

    it('should return address name by id', () => {
        const name = component.getAddressName('1');

        expect(name).toBe('Casa');
    });

    it('asdfasdf', async () => {
        component.form.patchValue({});

        await component.onSubmit();


        expect(unsavedChangesService.setUnsavedChanges).not.toHaveBeenCalled();


    });

    it('should submit and close with mapped data when form is valid', async () => {
        component.form.patchValue({
            relationship: '1',
            authorizedPerson: '1',
            economicActivity: '1',
            occupation: '1',
            isPpe: 'no',
            ppeHasFamily: 'no',
            faculty: '1 Firma A',
            email: 'test@mail.com',
        });

        await component.onSubmit();

        expect(unsavedChangesService.setUnsavedChanges).toHaveBeenCalledWith(true);
        expect(dialogRef.close).toHaveBeenCalled();

        const closeArg = dialogRef.close.calls.mostRecent().args[0];
        expect(closeArg.ok).toBeTrue();
        expect(closeArg.data.clientData.rfc).toBe('XAXX010101000');
        expect(closeArg.table.address).toBe('Casa');
        expect(closeArg.table.telephone).toBe('5555555555');
    });

    it('should show missing info error when submit data is incomplete', async () => {
        component.form.patchValue({
            relationship: '1',
            authorizedPerson: '1',
            economicActivity: '1',
            occupation: '1',
            isPpe: 'no',
            ppeHasFamily: 'no',
            faculty: '1 Firma A',
        });
        (component.addressComponent.onSubmit as jasmine.Spy).and.resolveTo(null);

        await component.onSubmit();

        expect(notifService.error).toHaveBeenCalled();
        expect(dialogRef.close).not.toHaveBeenCalledWith(jasmine.objectContaining({ ok: true }));
    });

    it('should initialize maintenance read-only mode', () => {
        component.isMaintenance = true;
        component.permissions = ['read'];
        component.isEditting = false;

        const formDisableSpy = spyOn(component.form, 'disable').and.callThrough();
        const clientDisableSpy = spyOn(component.clientDataComponent.profileForm, 'disable').and.callThrough();
        const addressDisableSpy = spyOn(component.addressComponent.profileForm, 'disable').and.callThrough();
        const phoneDisableSpy = spyOn(component.phoneSectionComponent.form, 'disable').and.callThrough();

        component.initializeMaintenance();

        expect(clientDisableSpy).toHaveBeenCalled();
        expect(addressDisableSpy).toHaveBeenCalled();
        expect(phoneDisableSpy).toHaveBeenCalled();
        expect(formDisableSpy).toHaveBeenCalled();
        expect(component.disButtons.save).toBeTrue();
    });

    it('should enable forms in maintenance when add permission and not editing', () => {
        component.isMaintenance = true;
        component.permissions = ['read', 'add'];
        component.isEditting = false;

        component.initializeMaintenance();

        expect(component.clientDataComponent.profileForm.enabled).toBeTrue();
        expect(component.addressComponent.profileForm.enabled).toBeTrue();
        expect(component.phoneSectionComponent.form.enabled).toBeTrue();
        expect(component.form.enabled).toBeTrue();
        expect(component.disButtons.save).toBeFalse();
    });

    // it('should require some fields if IsPPE', () => {
    //     component.isMaintenance = true;
    //     component.isEditting = true;

    //     component.ngAfterViewInit();

    //     expect(component.disValidateDataBtn).toBeTrue();
    //     expect(component.disCancelValidData).toBeTrue();
    //     expect(component.clientDataComponent.profileForm.disabled).toBeTrue();

    // });

    it('rewrewrwerwerw', () => {
        component.form.controls.isPpe.setValue('yes');
        fixture.detectChanges();
        expect(component.form.get('ppeType')?.hasValidator(Validators.required)).toBeTrue();
        expect(component.form.get('ppeRol')?.hasValidator(Validators.required)).toBeTrue();
        expect(component.form.get('ppeExpires')?.hasValidator(Validators.required)).toBeTrue();
    });

    it('qqwerqewrqwer', () => {
        // component.form.controls.isPpe.setValue('yes');
        const dd = {
            id: '',
            phone: '',
            phoneType: '',
            phoneTypeId: '',
            phoneCountry: '',
            phoneCountryId: '',
            phoneCodeArea: '',
            phoneLada: '',
            phoneExtension: '',
            phoneNotification: false,
            active: false
        };
        component.isEditting = true;
        fixture.detectChanges();
        expect(component.phoneSectionData).toEqual(dd);
        //
    });



    it('should reset all sections on cancelData', () => {
        component.isThird = true;
        component.disValidateDataBtn = true;
        component.form.controls.relationship.setValue('1');

        component.cancelData();

        expect(component.isThird).toBeFalse();
        expect(component.disValidateDataBtn).toBeFalse();
        expect(component.form.enabled).toBeTrue();
        expect(component.clientDataComponent.profileForm.enabled).toBeTrue();
        expect(component.addressComponent.profileForm.enabled).toBeTrue();
        expect(component.phoneSectionComponent.form.enabled).toBeTrue();
        expect(component.clientDataComponent.enableForm).toHaveBeenCalled();
    });

    it('should disable third customer sections', () => {
        component.disableSectionThirdCustomer();

        expect(component.clientDataComponent.profileForm.disabled).toBeTrue();
        expect(component.addressComponent.profileForm.disabled).toBeTrue();
        expect(component.phoneSectionComponent.form.disabled).toBeTrue();
        expect(component.form.controls.management.disabled).toBeTrue();
        expect(component.form.controls.email.disabled).toBeTrue();
    });

    it('should validate customer number and disable sections when customer exists', () => {
        spyOn(component, 'setDataCustomerToForm');
        spyOn(component, 'disableSectionThirdCustomer');

        customerService.getCustomerInfo.and.returnValue(of({
            initialData: {
                curp: 'CURP123456HDFABC01',
                foreignerWithoutCurp: false,
                dateOfBirth: '1990-01-01',
                gender: 'H',
                countryOfBirth: 'MX',
                stateOfBirth: '09',
                cityOfBirth: 'CDMX',
                firstName: 'JUAN',
                middleName: 'CARLOS',
                firstLastName: 'PEREZ',
                secondLastName: 'LOPEZ',
            },
            generalInformation: {},
            ppeInformation: {},
            addresses: [],
            emails: [],
            telephones: [],
        } as any));

        component.customerValidation(123456);

        expect(component.isThird).toBeTrue();
        expect(customerService.getCustomerInfo).toHaveBeenCalledWith(
            123456,
            ['initialData', 'generalInformation', 'ppeInformation', 'addresses', 'emails', 'telephones']
        );

        return Promise.resolve().then(() => {
            expect(component.setDataCustomerToForm).toHaveBeenCalled();
            expect(component.disableSectionThirdCustomer).toHaveBeenCalled();
        });
    });
});
