import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';

import { ModalAttoneryComponent } from './modal-attonery.component';
import { NotificationsService } from '../../../services/notifications.service';
import { ModalSearchClientService } from '../../../services/modal-search-client.service';
import { AddressesService } from '../../../services/storage-services/addresses.service';
import { CatalogsService } from '../../../services/catalogs.service';
import { SearchClientFlowService } from '../../../services/search-client-flow.service';
import { CustomerInformationService } from '../../../services/customer.service';
import { ERROR_MESSAGES, NOTIFICATION_MESSAGES } from '../../../../onboarding/constants/form-messages';

describe('ModalAttoneryComponent', () => {
    let component: ModalAttoneryComponent;
    let fixture: ComponentFixture<ModalAttoneryComponent>;
    let dialogRef: jasmine.SpyObj<MatDialogRef<ModalAttoneryComponent>>;
    let notifications: jasmine.SpyObj<NotificationsService>;
    let modalSearchClientService: jasmine.SpyObj<ModalSearchClientService>;
    let addressesService: jasmine.SpyObj<AddressesService>;
    let catalogsService: jasmine.SpyObj<CatalogsService>;
    let searchClientFlowService: jasmine.SpyObj<SearchClientFlowService>;
    let customerInformationService: jasmine.SpyObj<CustomerInformationService>;
    let identificationListSpy: jasmine.Spy;
    let phoneListSpy: jasmine.Spy;
    let mailListSpy: jasmine.Spy;

    const capturedAddress = {
        addressRole: '5',
        country: 'MX',
        city: 'CDMX',
    } as any;

    const baseData = {
        attoneryNumber: 1,
        signatureType: 'MANCOMUNADA',
        isMaintenance: false,
        readOnly: false,
        permises: null,
        content: {
            clientNumber: '123',
            customerNumber: 456,
            address: { country: 'MX', city: 'CDMX' },
            dataSection: { firstName: 'LUIS' },
            taxSection: { relationship: 'PADRE' },
            ppeInfo: { active: true },
            identifications: [],
            phones: [],
            mails: [],
            legalPowerSection: { deed: 'A1' },
            attoneryId: 'abc-123',
            legalProxyId: 'legal-1',
            personId: 'person-1',
            active: true,
            manifestLetter: false,
            preFillAddress: false,
        },
    };

    const createDialogData = (overrides: Record<string, any> = {}) => ({
        ...baseData,
        ...overrides,
        content: {
            ...baseData.content,
            ...(overrides['content'] ?? {}),
        },
    });

    const assignChildren = () => {
        const fb = TestBed.inject(FormBuilder);
        identificationListSpy = jasmine.createSpy('identificationList').and.returnValue([]);
        mailListSpy = jasmine.createSpy('mailList').and.returnValue([]);
        phoneListSpy = jasmine.createSpy('phoneList').and.returnValue([]);
        component.clientDataSection = {
            profileForm: fb.group({ field: ['value'] }),
            submitComplet: jasmine.createSpy('submitComplet').and.resolveTo({ firstName: 'LUIS' }),
            validadorFormComplet: jasmine.createSpy('validadorFormComplet').and.returnValue(false),
            ngOnInit: jasmine.createSpy('ngOnInit'),
            enableForm: jasmine.createSpy('enableForm'),
            data: null,
        } as any;
        component.miscellaneousSection = {
            form: fb.group({ field: ['value'] }),
            onSubmit: jasmine.createSpy('onSubmit').and.returnValue({ relationship: 'PADRE' }),
            chargeInitialData: jasmine.createSpy('chargeInitialData'),
        } as any;
        component.addressSection = {
            profileForm: fb.group({ country: ['MX'] }),
            onSubmit: jasmine.createSpy('onSubmit').and.resolveTo({ country: 'MX', city: 'CDMX' }),
            enableDisableFECityMun: jasmine.createSpy('enableDisableFECityMun'),
            setAddresData: jasmine.createSpy('setAddresData'),
            ngOnInit: jasmine.createSpy('ngOnInit'),
            dataAddress: null,
        } as any;
        component.ppeSection = {
            profileForm: fb.group({ field: ['value'] }),
            onSubmit: jasmine.createSpy('onSubmit').and.returnValue({ active: true }),
            ngOnInit: jasmine.createSpy('ngOnInit'),
            dataPPE: null,
        } as any;
        component.identificationSection = {
            form: fb.group({ field: ['value'] }),
            cantSave: false,
            identificationList: identificationListSpy,
        } as any;
        component.mailSection = {
            form: fb.group({ field: ['value'] }),
            cantSave: false,
            mailList: mailListSpy,
        } as any;
        component.phoneSection = {
            form: fb.group({ field: ['value'] }),
            cantSave: false,
            phoneList: phoneListSpy,
        } as any;
        component.legalPowerSection = {
            form: fb.group({ field: ['value'] }),
            onSubmit: jasmine.createSpy('onSubmit').and.returnValue({ deed: 'A1' }),
        } as any;
    };

    const setup = async (data = createDialogData()) => {
        dialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
        notifications = jasmine.createSpyObj('NotificationsService', ['success', 'error']);
        modalSearchClientService = jasmine.createSpyObj('ModalSearchClientService', ['searchClient']);
        addressesService = jasmine.createSpyObj('AddressesService', ['get']);
        catalogsService = jasmine.createSpyObj('CatalogsService', ['getCountry', 'getPhoneType', 'getIdentificationType']);
        searchClientFlowService = jasmine.createSpyObj('SearchClientFlowService', ['validInHomonyms', 'validInWatchList']);
        customerInformationService = jasmine.createSpyObj('CustomerInformationService', ['getCustomerInfo']);

        addressesService.get.and.returnValue({ addressList: [capturedAddress] } as any);
        catalogsService.getCountry.and.returnValue(of([{ countryId: 'MX', country: 'Mexico' }] as any));
        catalogsService.getPhoneType.and.returnValue(of([{ phoneTypeId: '1', phoneType: 'CELULAR' }] as any));
        catalogsService.getIdentificationType.and.returnValue(of([{ identificationTypeId: '1', identificationType: 'INE' }] as any));
        modalSearchClientService.searchClient.and.resolveTo(null);
        searchClientFlowService.validInHomonyms.and.resolveTo({ numberClient: null } as any);
        searchClientFlowService.validInWatchList.and.resolveTo(true);
        customerInformationService.getCustomerInfo.and.returnValue(of({ initialData: { clientNumber: '456' } } as any));

        await TestBed.configureTestingModule({
            declarations: [ModalAttoneryComponent],
            imports: [ReactiveFormsModule],
            providers: [
                { provide: MAT_DIALOG_DATA, useValue: data },
                { provide: MatDialogRef, useValue: dialogRef },
                { provide: NotificationsService, useValue: notifications },
                { provide: ModalSearchClientService, useValue: modalSearchClientService },
                { provide: AddressesService, useValue: addressesService },
                { provide: CatalogsService, useValue: catalogsService },
                { provide: SearchClientFlowService, useValue: searchClientFlowService },
                { provide: CustomerInformationService, useValue: customerInformationService },
            ],
            schemas: [NO_ERRORS_SCHEMA],
        })
            .overrideComponent(ModalAttoneryComponent, {
                set: { template: '' },
            })
            .compileComponents();

        fixture = TestBed.createComponent(ModalAttoneryComponent);
        component = fixture.componentInstance;
        component.ngOnInit();
        assignChildren();
    };

    afterEach(() => {
        document.body.classList.remove('show-validation');
    });

    it('should create and initialize catalog and content data', async () => {
        await setup();

        expect(component).toBeTruthy();
        expect(component.attoneryNumber).toBe(1);
        expect(component.form.get('clientNumber')?.value).toBe('123');
        expect(component.clientNumber).toBe(456);
        expect(component.signatureClass()).toBeTrue();
        expect(component.countries().length).toBe(1);
        expect(component.phoneTypes().length).toBe(1);
        expect(component.identifications().length).toBe(1);
        expect(component.capturedAddress).toEqual(capturedAddress);
    });

    it('should toggle manifest letter and notify when enabled', async () => {
        await setup();

        component.checkManifestLetter({ target: { checked: true } } as any);

        expect(component.manifestLetter()).toBeTrue();
        expect(notifications.success).toHaveBeenCalledWith(
            NOTIFICATION_MESSAGES.MANIFEST_LETTER_NOTIFICATION,
        );
    });

    it('should disable manifest when there are no active identifications or only ine or fewer than two', async () => {
        await setup();
        identificationListSpy.and.returnValue([]);
        expect(component.checkDisableManifest()).toBeTrue();

        identificationListSpy.and.returnValue([
            { identificationType: 'CREDENCIAL PARA VOTAR', active: true },
        ]);
        expect(component.checkDisableManifest()).toBeTrue();

        identificationListSpy.and.returnValue([
            { identificationType: 'PASAPORTE', active: true },
        ]);
        expect(component.checkDisableManifest()).toBeTrue();
    });

    it('should allow manifest when there are at least two active identifications without ine', async () => {
        await setup();
        identificationListSpy.and.returnValue([
            { identificationType: 'PASAPORTE', active: true },
            { identificationType: 'CEDULA', active: true },
        ]);

        expect(component.checkDisableManifest()).toBeFalse();
    });

    it('should close with assembled payload when saveAttonery is valid for a new client', async () => {
        await setup();
        component.form.patchValue({ clientNumber: '555' });
        identificationListSpy.and.returnValue([
            { identificationType: 'PASAPORTE', active: true },
        ]);
        phoneListSpy.and.returnValue([
            { phoneTypeId: '1', active: true, phoneNotification: true },
        ]);
        mailListSpy.and.returnValue([
            { active: true, mailNotification: true, mail: 'test@example.com' },
        ]);

        await component.saveAttonery();

        expect(component.clientDataSection.submitComplet).toHaveBeenCalled();
        expect(dialogRef.close).toHaveBeenCalledWith(
            jasmine.objectContaining({
                clientNumber: '555',
                attoneryNumber: 1,
                legalProxyId: 'legal-1',
                personId: 'person-1',
            }),
        );
    });

    it('should close with existing client data when saveAttonery uses a searched customer', async () => {
        await setup();
        component.isExistingClient.set(true);
        component.clientNumber = 999;
        identificationListSpy.and.returnValue([
            { identificationType: 'PASAPORTE', active: true },
        ]);
        phoneListSpy.and.returnValue([
            { phoneTypeId: '1', active: true, phoneNotification: true },
        ]);
        mailListSpy.and.returnValue([
            { active: true, mailNotification: true, mail: 'test@example.com' },
        ]);

        await component.saveAttonery();

        expect(dialogRef.close).toHaveBeenCalledWith(
            jasmine.objectContaining({
                customerNumber: 999,
                clientNumber: '999',
            }),
        );
    });

    it('should show identification error when saveAttonery has no active identification', async () => {
        await setup();

        await component.saveAttonery();

        expect(notifications.error).toHaveBeenCalledWith(ERROR_MESSAGES.MISSING_IDENTIFICATION);
        expect(dialogRef.close).not.toHaveBeenCalled();
    });

    it('should show contact info error when saveAttonery lacks valid notifications', async () => {
        await setup();
        identificationListSpy.and.returnValue([
            { identificationType: 'PASAPORTE', active: true },
        ]);
        phoneListSpy.and.returnValue([
            { phoneTypeId: '1', active: true, phoneNotification: false },
        ]);
        mailListSpy.and.returnValue([
            { active: true, mailNotification: false, mail: 'test@example.com' },
        ]);

        await component.saveAttonery();

        expect(notifications.error).toHaveBeenCalledWith(ERROR_MESSAGES.MISSING_CONTACT_INFO_SECTION);
        expect(dialogRef.close).not.toHaveBeenCalled();
    });

    it('should close dialog on cancel', async () => {
        await setup();

        component.cancel();

        expect(dialogRef.close).toHaveBeenCalled();
    });

    it('should return early on searchClientByNumber when input is empty', async () => {
        await setup();
        const searchSpy = spyOn(component, 'searchNewClient').and.resolveTo(true);

        await component.searchClientByNumber({ target: { value: '' } });

        expect(searchSpy).not.toHaveBeenCalled();
    });

    it('should search by number and apply permissions when watch list passes', async () => {
        await setup();
        const searchSpy = spyOn(component, 'searchNewClient').and.resolveTo(true);
        const permSpy = spyOn(component, 'applyPermisesSections');

        await component.searchClientByNumber({ target: { value: 123 } });

        expect(searchSpy).toHaveBeenCalledWith(123);
        expect(permSpy).toHaveBeenCalledWith(true, true);
        expect(component.isExistingClient()).toBeTrue();
    });

    it('should search client from modal selection and enable existing-client flow', async () => {
        await setup();
        modalSearchClientService.searchClient.and.resolveTo({ clientNumber: 321 } as any);
        const searchSpy = spyOn(component, 'searchNewClient').and.resolveTo(true);
        const permSpy = spyOn(component, 'applyPermisesSections');

        await component.searchClient();

        expect(searchSpy).toHaveBeenCalledWith(321);
        expect(permSpy).toHaveBeenCalledWith(true, true);
        expect(component.isExistingClient()).toBeTrue();
    });

    it('should validate homonyms and search an existing client when numberClient is returned', async () => {
        await setup();
        searchClientFlowService.validInHomonyms.and.resolveTo({ numberClient: 777 } as any);
        const searchSpy = spyOn(component, 'searchNewClient').and.resolveTo(true);
        const permSpy = spyOn(component, 'applyPermisesSections');

        await component.valid();

        expect(searchClientFlowService.validInHomonyms).toHaveBeenCalled();
        expect(searchSpy).toHaveBeenCalledWith(777);
        expect(permSpy).toHaveBeenCalledWith(true, true);
    });

    it('should validate watch list directly when homonyms do not return a numberClient', async () => {
        await setup();
        searchClientFlowService.validInHomonyms.and.resolveTo({ numberClient: null } as any);
        const permSpy = spyOn(component, 'applyPermisesSections');

        await component.valid();

        expect(searchClientFlowService.validInWatchList).toHaveBeenCalled();
        expect(component.isExistingClient()).toBeFalse();
        expect(permSpy).toHaveBeenCalledWith(false, true);
    });

    it('should search a client, map info and store the client number', async () => {
        await setup();
        const mapSpy = spyOn(component, 'mapInfoToForm');
        const searchedClient = { initialData: { clientNumber: '456' } } as any;
        customerInformationService.getCustomerInfo.and.returnValue(of(searchedClient));
        searchClientFlowService.validInWatchList.and.resolveTo(true);

        const result = await component.searchNewClient(456);

        expect(result).toBeTrue();
        expect(searchClientFlowService.validInWatchList).toHaveBeenCalled();
        expect(mapSpy).toHaveBeenCalledWith(searchedClient);
        expect(component.clientNumber).toBe(456);
    });

    it('should reset validation mode on cancelValid', async () => {
        await setup();
        component.clientNumber = 100;

        component.cancelValid();

        expect(component.form.enabled).toBeTrue();
        expect(component.clientDataSection.profileForm.enabled).toBeFalse();
        expect(component.clientNumber).toBe(0);
    });

    it('should enable prefill address and push the stored address to the section', async () => {
        await setup();
        const event = {
            preventDefault: jasmine.createSpy('preventDefault'),
            stopPropagation: jasmine.createSpy('stopPropagation'),
        } as any;

        component.onTogglePreFill(event);

        expect(component.preFillAddress()).toBeTrue();
        expect(component.addressSection.setAddresData).toHaveBeenCalledWith(capturedAddress);
        expect(component.dataAddress).toEqual(capturedAddress);
    });

    it('should reject prefill address when there is no stored address', async () => {
        await setup();
        component.capturedAddress = null;
        const event = {
            preventDefault: jasmine.createSpy('preventDefault'),
            stopPropagation: jasmine.createSpy('stopPropagation'),
        } as any;

        component.onTogglePreFill(event);

        expect(event.preventDefault).toHaveBeenCalled();
        expect(event.stopPropagation).toHaveBeenCalled();
        expect(notifications.error).toHaveBeenCalledWith(ERROR_MESSAGES.NO_ADDRESS_REGISTERED);
        expect(component.preFillAddress()).toBeFalse();
    });
});
