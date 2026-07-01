import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';

import { AddressSectionComponent } from './address-section.component';
import { CatalogsService } from '../../../services/catalogs.service';
import { ZipCodeService } from '../../../services/zip-code.service';
import { NotificationsService } from '../../../services/notifications.service';
import { UnsavedChangesService } from '../../../../core/services/unsaved-changes.service';
import { NotificationFormRegistry } from '../../../services/notifications/notification-form-registry.service';
import { ADDRESS, STRINGS } from '../../../../onboarding/constants/constants';

describe('AddressSectionComponent', () => {
    let component: AddressSectionComponent;
    let fixture: ComponentFixture<AddressSectionComponent>;
    let catalogsService: jasmine.SpyObj<CatalogsService>;
    let zipCodeService: jasmine.SpyObj<ZipCodeService>;
    let notificationsService: jasmine.SpyObj<NotificationsService>;
    let notificationRegistry: jasmine.SpyObj<NotificationFormRegistry>;

    beforeEach(async () => {
        catalogsService = jasmine.createSpyObj<CatalogsService>('CatalogsService', [
            'getAddressRole',
            'getCountry',
            'getFederalEntity',
            'getAddressType',
            'getProofOfAddress'
        ]);
        zipCodeService = jasmine.createSpyObj<ZipCodeService>('ZipCodeService', ['postData']);
        notificationsService = jasmine.createSpyObj<NotificationsService>('NotificationsService', ['error']);
        notificationRegistry = jasmine.createSpyObj<NotificationFormRegistry>('NotificationFormRegistry', ['registerForm']);

        catalogsService.getAddressRole.and.returnValue(of([{ idRolDomicilioCve: '5', roleAddress: 'DOM' }] as any));
        catalogsService.getCountry.and.returnValue(of([{ land: 'MX', country: 'Mexico' }, { land: 'US', country: 'USA' }] as any));
        catalogsService.getFederalEntity.and.returnValue(of([{ id: '1', desc: 'CDMX' }] as any));
        catalogsService.getAddressType.and.returnValue(of([{ addressTypeId: '1', addressType: 'CASA' }, { addressTypeId: '4', addressType: 'OTRO' }] as any));
        catalogsService.getProofOfAddress.and.returnValue(of([{ personTypeId: '1', proofOfAddressTypeId: '01', proofOfAddressType: 'RECIBO' }] as any));
        zipCodeService.postData.and.returnValue(of({
            federalEntity: 'Ciudad de Mexico',
            cityDesc: 'Benito Juarez',
            townDesc: 'Benito Juarez',
            zoneGeo: 'URBANA',
            federalEntityId: '09',
            city: '010',
            town: '014',
            listSuburb: { item: [{ id: '1', suburb: 'Del Valle' }] }
        } as any));

        await TestBed.configureTestingModule({
            imports: [ReactiveFormsModule],
            declarations: [AddressSectionComponent],
            providers: [
                { provide: CatalogsService, useValue: catalogsService },
                { provide: ZipCodeService, useValue: zipCodeService },
                { provide: NotificationsService, useValue: notificationsService },
                { provide: UnsavedChangesService, useValue: { setUnsavedChanges: jasmine.createSpy('setUnsavedChanges') } },
                { provide: NotificationFormRegistry, useValue: notificationRegistry }
            ],
            schemas: [NO_ERRORS_SCHEMA]
        })
            .overrideComponent(AddressSectionComponent, {
                set: { template: '' }
            })
            .compileComponents();

        fixture = TestBed.createComponent(AddressSectionComponent);
        component = fixture.componentInstance;
    });

    it('should create, load catalogs, and register the form on init', () => {
        component.ngOnInit();

        expect(component).toBeTruthy();
        expect(catalogsService.getAddressRole).toHaveBeenCalled();
        expect(component.profileForm.get('country')?.value).toBe(STRINGS.MEXICO);
        expect(notificationRegistry.registerForm).toHaveBeenCalledWith(component.profileForm);
    });

    it('should set read only mode by disabling form controls on init', () => {
        component.setReadonly = true;

        component.ngOnInit();

        expect(component.profileForm.disabled).toBeTrue();
    });

    it('should toggle tax postal code validation based on confirmCp selection', () => {
        component.onSelectionChangeConfirmCp({ value: 'NO' } as any);
        component.profileForm.get('taxPostalCode')?.updateValueAndValidity();

        expect(component.taxDomicile()).toBeTrue();
        expect(component.profileForm.get('taxPostalCode')?.hasError('required')).toBeTrue();

        component.profileForm.get('taxPostalCode')?.setValue('01010');
        component.onSelectionChangeConfirmCp({ value: 'YES' } as any);
        component.profileForm.get('taxPostalCode')?.setValue('');
        component.profileForm.get('taxPostalCode')?.updateValueAndValidity();

        expect(component.taxDomicile()).toBeFalse();
        expect(component.profileForm.get('taxPostalCode')?.hasError('required')).toBeFalse();
    });

    it('should reset location fields and enable controls for foreign countries', () => {
        component.profileForm.patchValue({ federalEntity: 'X', city: 'Y', municipality: 'Z' });

        component.onItemSelectCountry('US');

        expect(component.countryType()).toBeTrue();
        expect(component.profileForm.get('federalEntity')?.enabled).toBeTrue();
        expect(component.profileForm.get('federalEntity')?.value).toBe('');
    });

    it('should fetch and patch zip code information on blur for Mexico', () => {
        component.ngOnInit();
        component.profileForm.patchValue({ country: STRINGS.MEXICO, postalCode: '01010' });

        component.onBlur();

        expect(zipCodeService.postData).toHaveBeenCalledWith({ zipCode: '01010' });
        expect(component.profileForm.get('federalEntity')?.value).toBe('CIUDAD DE MEXICO');
        expect(component.colony().length).toBe(1);
    });

    it('should show an error on blur when country is missing', () => {
        component.profileForm.get('country')?.setErrors({ required: true });
        component.profileForm.patchValue({ postalCode: '01010' });

        component.onBlur();

        expect(notificationsService.error).toHaveBeenCalledWith('Ingresa un País.');
    });

    it('should return address data when hidden sections clear validators', async () => {
        component.hideProofOfAddressSection = true;
        component.hideRoleSection = true;
        component.hideAddresstype = true;
        component.profileForm.patchValue({
            addressRole: '',
            addressType: '',
            country: STRINGS.MEXICO,
            postalCode: '01010',
            federalEntity: 'CDMX',
            city: 'CDMX',
            municipality: 'BJ',
            neighborhood: 'DEL VALLE',
            street: 'INSURGENTES',
            externalNumber: '10',
            confirmCp: '',
            timeLiveMexico: '',
            reasonsOpeningContractMexico: '',
            proofOfAddressType: '',
            addressProofIssueDate: ''
        });

        const result = await component.onSubmit();

        expect(result).not.toBeNull();
        expect(result?.country).toBe(STRINGS.MEXICO);
    });

    it('should preserve existing address id when submitting hidden sections flow', async () => {
        component.dataAddress = { id: 116017 } as any;
        component.hideProofOfAddressSection = true;
        component.hideRoleSection = true;
        component.hideAddresstype = true;
        component.profileForm.patchValue({
            addressRole: '',
            addressType: '',
            country: STRINGS.MEXICO,
            postalCode: '52400',
            federalEntity: 'ESTADO DE MEXICO',
            city: 'TENANCINGO, MEX',
            municipality: 'TENANCINGO',
            neighborhood: '1930',
            street: 'CALLE',
            externalNumber: 'NUMERO',
            internalNumber: 'NUMERO',
            confirmCp: '',
            timeLiveMexico: '',
            reasonsOpeningContractMexico: '',
            proofOfAddressType: '',
            addressProofIssueDate: ''
        });

        const result = await component.onSubmit();

        expect(result?.id).toBe(116017);
        expect(result?.city).toBe('TENANCINGO, MEX');
    });

    it('should prevent non alphanumeric characters and limit expiration year length', () => {
        const keyEvent = { key: '#', preventDefault: jasmine.createSpy('preventDefault') } as any;
        const input = { target: { value: '20245' } } as any;

        component.allowAlphanumericOnly(keyEvent);
        component.onInput(input);

        expect(keyEvent.preventDefault).toHaveBeenCalled();
        expect(component.profileForm.get('expirationYear')?.value).toBe('2024');
    });

    it('should clear domicile specific fields when role is not domicile', () => {
        component.profileForm.patchValue({
            confirmCp: 'YES',
            taxPostalCode: '01010',
            addressType: '1'
        });

        component.onItemSelectDomicileRoles('OFICINA');

        expect(component.domicileRole()).toBeFalse();
        expect(component.taxDomicile()).toBeFalse();
        expect(component.profileForm.get('confirmCp')?.value).toBe('');
        expect(component.profileForm.get('taxPostalCode')?.value).toBe('');
        expect(component.profileForm.get('addressType')?.value).toBe('');
    });

    it('should patch foreign address data without zipcode lookup in setAddresData', () => {
        component.setAddresData({
            country: 'US',
            postalCode: '10001',
            federalEntity: 'NEW YORK',
            city: 'NEW YORK',
            municipality: 'MANHATTAN',
            neighborhood: 'MIDTOWN',
            street: '5TH AVENUE',
            externalNumber: '1',
            internalNumber: '2',
            addressType: '1',
            addressRole: 'DOM',
            other: '',
            confirmCp: 'NO',
            timeLiveMexico: '',
            reasonsOpeningContractMexico: '',
            proofOfAddressType: 'RECIBO',
            addressProofIssueDate: '2026-01-01',
            expirationYear: '',
            taxPostalCode: '10001',
            geographicalArea: '',
            deliveryCenter: '',
        } as any);

        expect(zipCodeService.postData).not.toHaveBeenCalled();
        expect(component.profileForm.get('country')?.value).toBe('US');
        expect(component.profileForm.get('federalEntity')?.value).toBe('NEW YORK');
        expect(component.profileForm.get('city')?.value).toBe('NEW YORK');
        expect(component.profileForm.get('municipality')?.value).toBe('MANHATTAN');
    });

    it('should reject expired proof of address in validComplet', () => {
        component.profileForm.patchValue({
            addressRole: ADDRESS.DOMICILE_ROLE,
            addressType: '1',
            country: STRINGS.MEXICO,
            postalCode: '01010',
            federalEntity: 'CDMX',
            city: 'CDMX',
            municipality: 'BJ',
            neighborhood: 'DEL VALLE',
            street: 'INSURGENTES',
            externalNumber: '10',
            confirmCp: 'YES',
            timeLiveMexico: '',
            reasonsOpeningContractMexico: '',
            proofOfAddressType: 'RECIBO',
            addressProofIssueDate: '2000-01-01',
        });
        component['domicileRole'].set(true);

        const result = component.validComplet();

        expect(result).toBeNull();
        expect(notificationsService.error).toHaveBeenCalledWith('Comprobante de Domicilio no Válido por Vencimiento de Vigencia');
    });

    it('should enable domicile type custom field when selecting OTRO', () => {
        component.onItemSelectDomiciledType(ADDRESS.DOMICILE_TYPE);

        expect(component.domicileType()).toBeTrue();

        component.onItemSelectDomiciledType('CASA');

        expect(component.domicileType()).toBeFalse();
        expect(component.profileForm.get('other')?.value).toBe('');
    });
});
