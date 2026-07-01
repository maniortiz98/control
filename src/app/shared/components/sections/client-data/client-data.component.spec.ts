import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';

import { ClientDataComponent } from './client-data.component';
import { CatalogsService } from '../../../services/catalogs.service';
import { NotificationsService } from '../../../services/notifications.service';
import { NotificationModalService } from '../../../services/notification-modal.service';
import { UnsavedChangesService } from '../../../../core/services/unsaved-changes.service';
import { ValidCurpService } from '../../../services/curp-valid/valid-curp.service';
import { AllowedValuesRfcNifTinNss } from '../../../utils/map-rfc-nif-tin-nss';
import { STRINGS } from '../../../../onboarding/constants/constants';
import { DataClient } from '../../../../onboarding/models/client-data';

describe('ClientDataComponent', () => {
    let component: ClientDataComponent;
    let fixture: ComponentFixture<ClientDataComponent>;

    const buildDataClient = (overrides: Partial<DataClient> = {}): DataClient => ({
        ppe: false,
        bankAreaTypeId: '',
        contraTypeId: '',
        typeContractSubtypeId: '',
        curp: 'GARC850101HDFRRL09',
        foreignerWithoutCurp: false,
        typeIden: AllowedValuesRfcNifTinNss.RFC,
        rfc: 'GARC850101AAA',
        dateOfBirth: '1985-01-01',
        gender: 'H',
        maritalStatus: '1',
        nationality: STRINGS.MEXICAN,
        countryOfBirth: STRINGS.MEXICO,
        stateOfBirth: 'DF',
        cityOfBirth: '',
        firstName: 'JUAN',
        middleName: 'CARLOS',
        firstLastName: 'GARCIA',
        secondLastName: 'LOPEZ',
        ...overrides,
    });

    beforeEach(async () => {
        const catalogsService = jasmine.createSpyObj<CatalogsService>('CatalogsService', [
            'getCountry',
            'getNationalities',
            'getFederalEntity',
            'getMaritalStatus',
        ]);
        const notificationsService = jasmine.createSpyObj<NotificationsService>('NotificationsService', [
            'error',
        ]);
        const notificationModalService = jasmine.createSpyObj<NotificationModalService>(
            'NotificationModalService',
            ['warning'],
        );
        const validCurpService = jasmine.createSpyObj<ValidCurpService>('ValidCurpService', ['postData']);

        catalogsService.getCountry.and.returnValue(of([{ land: 'MX', country: 'Mexico' }] as any));
        catalogsService.getNationalities.and.returnValue(
            of([{ land: 'MX', nationality: 'Mexicana' }] as any),
        );
        catalogsService.getFederalEntity.and.returnValue(
            of([{ federalEntityId: 'DF', federalEntity: 'CIUDAD DE MEXICO' }] as any),
        );
        catalogsService.getMaritalStatus.and.returnValue(
            of([{ maritalStatusId: '1', maritalStatus: 'SOLTERO' }] as any),
        );
        notificationModalService.warning.and.returnValue(Promise.resolve(undefined));
        validCurpService.postData.and.returnValue(
            of({
                status: 200,
                messages: [],
                payload: {
                    result: false,
                    renapoResponse: false,
                    intents: 0,
                    curp: null,
                    names: null,
                    lastName: null,
                    secondLastName: null,
                    gender: null,
                    birthDate: null,
                    birthStateCode: null,
                    birthState: null,
                },
            } as any),
        );

        await TestBed.configureTestingModule({
            imports: [ReactiveFormsModule],
            declarations: [ClientDataComponent],
            providers: [
                { provide: CatalogsService, useValue: catalogsService },
                { provide: NotificationsService, useValue: notificationsService },
                { provide: NotificationModalService, useValue: notificationModalService },
                { provide: UnsavedChangesService, useValue: { setUnsavedChanges: jasmine.createSpy('setUnsavedChanges') } },
                { provide: MatDialog, useValue: { open: jasmine.createSpy('open') } },
                { provide: ValidCurpService, useValue: validCurpService },
            ],
            schemas: [NO_ERRORS_SCHEMA],
        })
            .overrideComponent(ClientDataComponent, {
                set: { template: '' },
            })
            .compileComponents();

        fixture = TestBed.createComponent(ClientDataComponent);
        component = fixture.componentInstance;
    });

    it('should initialize default nationality, country and identifier type', () => {
        fixture.detectChanges();

        expect(component.profileForm.get('nationality')?.value).toBe(STRINGS.MEXICAN);
        expect(component.profileForm.get('countryOfBirth')?.value).toBe(STRINGS.MEXICO);
        expect(component.profileForm.get('typeIden')?.value).toBe(AllowedValuesRfcNifTinNss.RFC);
    });

    it('should toggle foreigner mode by clearing fields and disabling curp', () => {
        fixture.detectChanges();
        component.profileForm.patchValue({
            curp: 'GARC850101HDFRRL09',
            nationality: STRINGS.MEXICAN,
            countryOfBirth: STRINGS.MEXICO,
            stateOfBirth: 'DF',
        });

        component.onForeignerClick({ target: { checked: true } } as any);

        expect(component.profileForm.get('curp')?.disabled).toBeTrue();
        expect(component.profileForm.get('nationality')?.value).toBe('');
        expect(component.profileForm.get('countryOfBirth')?.value).toBe('');

        component.onForeignerClick({ target: { checked: false } } as any);

        expect(component.profileForm.get('curp')?.enabled).toBeTrue();
        expect(component.profileForm.get('nationality')?.value).toBe(STRINGS.MEXICAN);
        expect(component.profileForm.get('countryOfBirth')?.value).toBe(STRINGS.MEXICO);
    });

    it('should patch and lock curp when setClientData receives foreignerWithoutCurp', () => {
        fixture.detectChanges();

        component.setClientData(
            buildDataClient({
                curp: '',
                foreignerWithoutCurp: true,
                nationality: 'US',
                countryOfBirth: 'US',
                stateOfBirth: 'WDC',
                typeIden: '2',
            }),
        );

        expect(component.foreignerCURP()).toBeTrue();
        expect(component.profileForm.get('curp')?.disabled).toBeTrue();
        expect(component.profileForm.get('typeIden')?.value).toBe('2');
        expect(component.profileForm.get('countryOfBirth')?.value).toBe('US');
    });

    it('should return raw form data from submitComplet when validation passes', async () => {
        fixture.detectChanges();
        const expected = buildDataClient({
            dateOfBirth: '2000-01-01',
            middleName: '',
        });
        component.profileForm.patchValue(expected as any);
        spyOn(component, 'validadorFormComplet').and.returnValue(false);

        const result = await component.submitComplet();

        expect(result).not.toBeNull();
        expect(result?.rfc).toBe(expected.rfc);
        expect(result?.firstName).toBe(expected.firstName);
        expect(result?.countryOfBirth).toBe(expected.countryOfBirth);
    });

    it('should uppercase and normalize curp and text helpers', () => {
        fixture.detectChanges();
        component.profileForm.patchValue({
            curp: 'abcñ010101hdfrrl09',
            firstName: 'José Ángel',
        });

        component.toUppercaseCURP('curp');
        component.toUppercase('firstName');

        expect(component.profileForm.get('curp')?.value).toBe('ABCX010101HDFRRL09');
        expect(component.profileForm.get('firstName')?.value).toBe('JOSE ANGEL');
    });

    it('should derive birth date and birthplace from a valid mexican curp', () => {
        fixture.detectChanges();
        component.states.set([{ bland: 'DF' }] as any);
        component.profileForm.patchValue({
            curp: 'GARC850101HDFRRL09',
            rfc: '',
        });

        component.loadCurpData();

        expect(component.profileForm.get('gender')?.value).toBe('H');
        expect(component.profileForm.get('stateOfBirth')?.value).toBe('DF');
        expect(component.profileForm.get('nationality')?.value).toBe(STRINGS.MEXICAN);
        expect(component.profileForm.get('countryOfBirth')?.value).toBe(STRINGS.MEXICO);
        expect(component.profileForm.get('rfc')?.value).toBe('GARC850101');
    });

    it('should mark curp as foreign when birthplace code is NE', () => {
        fixture.detectChanges();
        component.profileForm.patchValue({
            curp: 'GARC850101HNERLL09',
            rfc: 'GARC850101AAA',
        });

        component.loadCurpData();

        expect(component.foreign()).toBeTrue();
        expect(component.profileForm.get('nationality')?.value).toBe('');
        expect(component.profileForm.get('countryOfBirth')?.value).toBe('');
    });

    it('should reset form defaults and re-enable curp', () => {
        fixture.detectChanges();
        component.profileForm.patchValue({
            curp: 'GARC850101HDFRRL09',
            nationality: 'US',
            countryOfBirth: 'US',
            typeIden: '2',
        });
        component.profileForm.get('curp')?.disable();
        component.foreignerCURP.set(true);
        component.foreign.set(true);

        component.resetDefaults();

        expect(component.foreignerCURP()).toBeFalse();
        expect(component.foreign()).toBeFalse();
        expect(component.profileForm.get('curp')?.enabled).toBeTrue();
        expect(component.profileForm.get('nationality')?.value).toBe(STRINGS.MEXICAN);
        expect(component.profileForm.get('countryOfBirth')?.value).toBe(STRINGS.MEXICO);
        expect(component.profileForm.get('typeIden')?.value).toBe(AllowedValuesRfcNifTinNss.RFC);
    });

    it('should validate mismatched curp date against form data', () => {
        fixture.detectChanges();
        component.profileForm.patchValue({
            curp: 'GARC850101HDFRRL09',
            dateOfBirth: new Date('2000-01-01'),
            gender: 'H',
            stateOfBirth: 'DF',
        });

        const result = component.validationDataFormDataCURP();

        expect(result).toBeTrue();
    });
});
