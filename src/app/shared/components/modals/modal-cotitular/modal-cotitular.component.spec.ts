import { NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';

import { ModalCotitularComponent } from './modal-cotitular.component';
import { NotificationsService } from '../../../services/notifications.service';
import { ModalSearchClientService } from '../../../services/modal-search-client.service';
import { SearchClientFlowService } from '../../../services/search-client-flow.service';
import { CustomerInformationService } from '../../../services/customer.service';
import { CatalogsService } from '../../../services/catalogs.service';
import { ERROR_MESSAGES, NOTIFICATION_MESSAGES } from '../../../../onboarding/constants/form-messages';

describe('ModalCotitularComponent', () => {
    let component: ModalCotitularComponent;
    let fixture: ComponentFixture<ModalCotitularComponent>;
    let dialogRef: jasmine.SpyObj<MatDialogRef<ModalCotitularComponent>>;
    let notifications: jasmine.SpyObj<NotificationsService>;
    let modalSearchClientService: jasmine.SpyObj<ModalSearchClientService>;
    let searchClientFlowService: jasmine.SpyObj<SearchClientFlowService>;
    let customerInformationService: jasmine.SpyObj<CustomerInformationService>;
    let catalogsService: jasmine.SpyObj<CatalogsService>;
    let identificationListSpy: jasmine.Spy;
    let phoneListSpy: jasmine.Spy;
    let mailListSpy: jasmine.Spy;
    let identificationSetSpy: jasmine.Spy;
    let phoneSetSpy: jasmine.Spy;
    let mailSetSpy: jasmine.Spy;

    const baseData = {
        cotitularNumber: 1,
        hasClientNumber: false,
        signatureType: 'MANCOMUNADA',
        cotitularAmount: 2,
        isMaintenance: false,
        readOnly: false,
        permises: null,
        content: {
            clientNumber: '123',
            customerNumber: 456,
            address: { country: 'MX', city: 'CDMX' },
            dataSection: { firstName: 'LUIS' },
            taxSection: { relationship: 'PADRE' },
            identifications: [],
            autoSign: { rfc: '' },
            phones: [],
            mails: [],
            ppeInfo: { active: true },
            cotitularId: 'abc-123',
            coHolderId: 'co-1',
            personId: 'person-1',
            active: true,
            isExistingClient: false,
            manifestLetter: false,
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
        identificationSetSpy = jasmine.createSpy('identificationSet');
        phoneListSpy = jasmine.createSpy('phoneList').and.returnValue([]);
        phoneSetSpy = jasmine.createSpy('phoneSet');
        mailListSpy = jasmine.createSpy('mailList').and.returnValue([]);
        mailSetSpy = jasmine.createSpy('mailSet');

        component.clientDataSection = {
            profileForm: fb.group({
                curp: [''],
                foreignerWithoutCurp: [false],
                countryOfBirth: ['MX'],
                nationality: ['MX'],
                rfc: [''],
                typeIden: ['1'],
            }),
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
            ngOnInit: jasmine.createSpy('ngOnInit'),
            dataAddress: null,
        } as any;

        component.autoCertSection = {
            form: fb.group({
                curp: [''],
                foreignerWithoutCurp: [false],
                country: [{ value: 'MX', disabled: true }],
                nationality: [{ value: 'MX', disabled: true }],
                rfc: [''],
            }),
            foreignerCURP: signal(false),
            onSubmit: jasmine.createSpy('onSubmit').and.resolveTo({ rfc: 'ABCD123456' }),
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
            identificationList: Object.assign(identificationListSpy, { set: identificationSetSpy }),
        } as any;

        component.phoneSection = {
            form: fb.group({ field: ['value'] }),
            cantSave: false,
            phoneList: Object.assign(phoneListSpy, { set: phoneSetSpy }),
        } as any;

        component.mailSection = {
            form: fb.group({ field: ['value'] }),
            cantSave: false,
            mailList: Object.assign(mailListSpy, { set: mailSetSpy }),
        } as any;
    };

    const setup = async (data = createDialogData()) => {
        dialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
        notifications = jasmine.createSpyObj('NotificationsService', ['success', 'error']);
        modalSearchClientService = jasmine.createSpyObj('ModalSearchClientService', ['searchClient']);
        searchClientFlowService = jasmine.createSpyObj('SearchClientFlowService', ['validInHomonyms', 'validInWatchList']);
        customerInformationService = jasmine.createSpyObj('CustomerInformationService', ['getCustomerInfo']);
        catalogsService = jasmine.createSpyObj('CatalogsService', ['getCountry', 'getPhoneType', 'getIdentificationType']);

        modalSearchClientService.searchClient.and.resolveTo(null);
        searchClientFlowService.validInHomonyms.and.resolveTo({ numberClient: null } as any);
        searchClientFlowService.validInWatchList.and.resolveTo(true);
        customerInformationService.getCustomerInfo.and.returnValue(of({ initialData: { clientNumber: '456' } } as any));
        catalogsService.getCountry.and.returnValue(of([{ countryId: 'MX', country: 'Mexico' }] as any));
        catalogsService.getPhoneType.and.returnValue(of([{ phoneTypeId: '1', phoneType: 'CELULAR' }] as any));
        catalogsService.getIdentificationType.and.returnValue(of([{ identificationTypeId: '1', identificationType: 'INE' }] as any));

        await TestBed.configureTestingModule({
            declarations: [ModalCotitularComponent],
            imports: [ReactiveFormsModule],
            providers: [
                { provide: MAT_DIALOG_DATA, useValue: data },
                { provide: MatDialogRef, useValue: dialogRef },
                { provide: NotificationsService, useValue: notifications },
                { provide: ModalSearchClientService, useValue: modalSearchClientService },
                { provide: SearchClientFlowService, useValue: searchClientFlowService },
                { provide: CustomerInformationService, useValue: customerInformationService },
                { provide: CatalogsService, useValue: catalogsService },
            ],
            schemas: [NO_ERRORS_SCHEMA],
        })
            .overrideComponent(ModalCotitularComponent, {
                set: { template: '' },
            })
            .compileComponents();

        fixture = TestBed.createComponent(ModalCotitularComponent);
        component = fixture.componentInstance;
        component.ngOnInit();
        assignChildren();
    };

    afterEach(() => {
        document.body.classList.remove('show-validation');
    });

    it('should create and initialize content and catalog data', async () => {
        await setup();

        expect(component).toBeTruthy();
        expect(component.cotitularNumber).toBe(1);
        expect(component.signatureClass()).toBeTrue();
        expect(component.form.get('clientNumber')?.value).toBe('123');
        expect(component.clientNumber).toBe(456);
        expect(component.countries().length).toBe(1);
        expect(component.phoneTypes().length).toBe(1);
        expect(component.identifications().length).toBe(1);
    });

    it('should synchronize client profile values into auto certification on ngAfterViewInit', async () => {
        await setup();

        component.ngAfterViewInit();
        component.clientDataSection.profileForm.patchValue({
            curp: 'CURP123',
            foreignerWithoutCurp: true,
            countryOfBirth: 'US',
            nationality: 'US',
            rfc: 'ABCD123456',
            typeIden: '1',
        });

        expect(component.autoCertSection.form.get('curp')?.value).toBe('CURP123');
        expect(component.autoCertSection.form.get('country')?.value).toBe('US');
        expect(component.autoCertSection.form.get('nationality')?.value).toBe('US');
        expect(component.autoCertSection.form.get('rfc')?.value).toBe('ABCD123456');
        expect(component.autoCertSection.form.get('country')?.disabled).toBeTrue();
    });

    it('should set manifest letter and notify when enabled', async () => {
        await setup();

        component.checkManifestLetter({ target: { checked: true } } as any);

        expect(component.manifestLetter()).toBeTrue();
        expect(notifications.success).toHaveBeenCalledWith(
            NOTIFICATION_MESSAGES.MANIFEST_LETTER_NOTIFICATION,
        );
    });

    it('should disable manifest when identifications are insufficient', async () => {
        await setup();
        identificationListSpy.and.returnValue([]);
        expect(component.checkDisableManifest()).toBeTrue();
        expect(component.disabledML).toBeTrue();

        identificationListSpy.and.returnValue([{ identificationType: 'CREDENCIAL PARA VOTAR', active: true }]);
        expect(component.checkDisableManifest()).toBeTrue();
    });

    it('should enable manifest when there are two active non-ine identifications', async () => {
        await setup();
        identificationListSpy.and.returnValue([
            { identificationType: 'PASAPORTE', active: true },
            { identificationType: 'CEDULA', active: true },
        ]);

        expect(component.checkDisableManifest()).toBeFalse();
        expect(component.disabledML).toBeFalse();
    });

    it('should close dialog on cancel', async () => {
        await setup();

        component.cancel();

        expect(dialogRef.close).toHaveBeenCalled();
    });

    it('should close with assembled payload when saveCotitular is valid for a new client', async () => {
        await setup();
        component.form.patchValue({ clientNumber: '555' });
        identificationListSpy.and.returnValue([{ identificationType: 'PASAPORTE', active: true }]);
        phoneListSpy.and.returnValue([{ phoneTypeId: '1', active: true, phoneNotification: true }]);
        mailListSpy.and.returnValue([{ active: true, mailNotification: true, mail: 'test@example.com' }]);

        await component.saveCotitular();

        expect(component.clientDataSection.submitComplet).toHaveBeenCalled();
        expect(dialogRef.close).toHaveBeenCalledWith(
            jasmine.objectContaining({
                clientNumber: '555',
                cotitularNumber: 1,
                isExistingClient: false,
            }),
        );
    });

    it('should close with existing client data when saveCotitular uses searched customer', async () => {
        await setup();
        component.isExistingClient.set(true);
        component.clientNumber = 999;
        identificationListSpy.and.returnValue([{ identificationType: 'PASAPORTE', active: true }]);
        phoneListSpy.and.returnValue([{ phoneTypeId: '1', active: true, phoneNotification: true }]);
        mailListSpy.and.returnValue([{ active: true, mailNotification: true, mail: 'test@example.com' }]);

        await component.saveCotitular();

        expect(dialogRef.close).toHaveBeenCalledWith(
            jasmine.objectContaining({
                customerNumber: 999,
                clientNumber: '999',
                isExistingClient: true,
            }),
        );
    });

    it('should show identification error when saveCotitular has no active identification', async () => {
        await setup();

        await component.saveCotitular();

        expect(notifications.error).toHaveBeenCalledWith(ERROR_MESSAGES.MISSING_IDENTIFICATION);
        expect(dialogRef.close).not.toHaveBeenCalled();
    });

    it('should show contact info error when notifications are missing and manifest letter is false', async () => {
        await setup();
        identificationListSpy.and.returnValue([{ identificationType: 'PASAPORTE', active: true }]);
        phoneListSpy.and.returnValue([{ phoneTypeId: '1', active: true, phoneNotification: false }]);
        mailListSpy.and.returnValue([{ active: true, mailNotification: false, mail: 'test@example.com' }]);

        await component.saveCotitular();

        expect(notifications.error).toHaveBeenCalledWith(ERROR_MESSAGES.MISSING_CONTACT_INFO_SECTION);
        expect(dialogRef.close).not.toHaveBeenCalled();
    });

    it('should allow saveCotitular with manifest letter even without notification flags', async () => {
        await setup();
        component.manifestLetter.set(true);
        identificationListSpy.and.returnValue([{ identificationType: 'PASAPORTE', active: true }]);
        phoneListSpy.and.returnValue([{ phoneTypeId: '1', active: true, phoneNotification: false }]);
        mailListSpy.and.returnValue([{ active: true, mailNotification: false, mail: 'test@example.com' }]);

        await component.saveCotitular();

        expect(dialogRef.close).toHaveBeenCalled();
    });

    it('should return early on empty searchClientByNumber input', async () => {
        await setup();
        const searchSpy = spyOn(component, 'searchNewClient').and.resolveTo(true);

        await component.searchClientByNumber({ target: { value: '' } });

        expect(searchSpy).not.toHaveBeenCalled();
    });

    it('should search client by number and switch to existing client flow', async () => {
        await setup();
        const searchSpy = spyOn(component, 'searchNewClient').and.resolveTo(true);
        const permSpy = spyOn(component, 'applyPermisesSections');

        await component.searchClientByNumber({ target: { value: 123 } });

        expect(searchSpy).toHaveBeenCalledWith(123);
        expect(permSpy).toHaveBeenCalledWith(true, true);
        expect(component.isExistingClient()).toBeTrue();
    });

    it('should search client from modal selector and apply existing permissions', async () => {
        await setup();
        modalSearchClientService.searchClient.and.resolveTo({ clientNumber: 321 } as any);
        const searchSpy = spyOn(component, 'searchNewClient').and.resolveTo(true);
        const permSpy = spyOn(component, 'applyPermisesSections');

        await component.searchClient();

        expect(searchSpy).toHaveBeenCalledWith(321);
        expect(permSpy).toHaveBeenCalledWith(true, true);
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
        expect(component.isExistingClient()).toBeTrue();
    });

    it('should validate watch list directly when homonyms return no numberClient', async () => {
        await setup();
        searchClientFlowService.validInHomonyms.and.resolveTo({ numberClient: null } as any);
        const permSpy = spyOn(component, 'applyPermisesSections');

        await component.valid();

        expect(searchClientFlowService.validInWatchList).toHaveBeenCalled();
        expect(component.isExistingClient()).toBeFalse();
        expect(permSpy).toHaveBeenCalledWith(false, true);
    });

    it('should search a client, map info and keep the client number', async () => {
        await setup();
        const searchedClient = { initialData: { clientNumber: '456' } } as any;
        const mapSpy = spyOn(component, 'mapInfoToForm');
        customerInformationService.getCustomerInfo.and.returnValue(of(searchedClient));

        const result = await component.searchNewClient(456);

        expect(result).toBeTrue();
        expect(mapSpy).toHaveBeenCalledWith(searchedClient);
        expect(component.clientNumber).toBe(456);
    });

    it('should reset validation mode on cancelValid', async () => {
        await setup();
        component.clientNumber = 88;

        component.cancelValid();

        expect(component.form.enabled).toBeTrue();
        expect(component.clientDataSection.profileForm.enabled).toBeFalse();
        expect(component.clientNumber).toBe(0);
    });

    it('should map searched client info into the child sections', async () => {
        await setup();
        const searchedClient = {
            initialData: { clientNumber: '456' },
            generalInformation: { firstName: 'EXISTENTE' },
            addresses: [{ country: 'MX' }],
            identifications: [{ identificationType: 'PASAPORTE' }],
            ppeInformation: { active: true },
            emails: [{ mail: 'mail@test.com' }],
            telephones: [{ phone: '5512345678' }],
            fiscalResidences: [],
        } as any;

        component.mapInfoToForm(searchedClient);

        expect(component.clientDataSection.ngOnInit).toHaveBeenCalled();
        expect(component.miscellaneousSection.chargeInitialData).toHaveBeenCalled();
        expect(component.addressSection.ngOnInit).toHaveBeenCalled();
        expect(identificationSetSpy).toHaveBeenCalled();
        expect(phoneSetSpy).toHaveBeenCalled();
        expect(mailSetSpy).toHaveBeenCalled();
        expect(component.ppeSection.ngOnInit).toHaveBeenCalled();
    });

    it('should return auto certification permissions when available', async () => {
        await setup(
            createDialogData({
                permises: {
                    sign: {
                        sections: {
                            'cotitular-modal': {
                                sections: {
                                    autoCertSection: { allDisabled: false },
                                },
                            },
                        },
                    },
                },
                readOnlyif: false,
            } as any),
        );

        expect(component.getAutoCertPermissions()).toEqual({ allDisabled: false });
    });
});
