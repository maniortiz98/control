import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { of } from 'rxjs';

import { AdvisorsTransferComponent } from './advisors-transfer.component';
import { NotificationsService } from '../../../shared/services/notifications.service';
import { NotificationModalService } from '../../../shared/services/notification-modal.service';
import { AdvisorsTransferService } from '../../services/advisors-transfer.service';
import { AdvisorTransferContracts } from '../../models/advisors-transfer';
import { BankingAreaTypeEnum } from '../../../onboarding/models/contract';
import { Advisor } from '../../../onboarding/models/catalogs/advisor';
import { DateAdapter } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { CoreModule } from '../../../core/core.module';
import { SharedModule } from '../../../shared/shared.module';

describe('AdvisorsTransferComponent', () => {
    let component: AdvisorsTransferComponent;
    let fixture: ComponentFixture<AdvisorsTransferComponent>;
    let notificationsService: jasmine.SpyObj<NotificationsService>;
    let modalNotifService: jasmine.SpyObj<NotificationModalService>;
    let advisorTransService: jasmine.SpyObj<AdvisorsTransferService>;

    const advisorCatalogMock: Advisor[] = [
        {
            advisorCode: '100',
            financialCenterId: '1',
            stockBrokerAdvisorId: '1',
            bankPromoterId: '1',
            name: 'Asesor Uno',
            email: 'asesor1@mail.com',
            sapUser: 'sap1',
            advisorRfc: 'RFC100',
            bankArea: 'BANCO',
            houseArea: 'BOLSA',
            isAssistant: false,
            isVirtual: false,
            virtualAdvisorPayroll: '',
            segment: 'SEG',
            channels: 'WEB',
            isConsultant: false,
            group: 'G1',
            subgroup: 'SG1',
            registrationDate: '2026-01-01',
            registrationUser: 'tester',
            cancellationDate: '',
            cancellationUser: '',
            active: true,
            created: '2026-01-01',
            modified: '2026-01-02'
        },
        {
            advisorCode: '200',
            financialCenterId: '2',
            stockBrokerAdvisorId: '2',
            bankPromoterId: '2',
            name: 'Asesor Dos',
            email: 'asesor2@mail.com',
            sapUser: 'sap2',
            advisorRfc: 'RFC200',
            bankArea: 'BANCO',
            houseArea: 'BOLSA',
            isAssistant: false,
            isVirtual: false,
            virtualAdvisorPayroll: '',
            segment: 'SEG',
            channels: 'WEB',
            isConsultant: false,
            group: 'G2',
            subgroup: 'SG2',
            registrationDate: '2026-01-01',
            registrationUser: 'tester',
            cancellationDate: '',
            cancellationUser: '',
            active: true,
            created: '2026-01-01',
            modified: '2026-01-02'
        }
    ];

    const contractsMock: AdvisorTransferContracts[] = [
        {
            bankingArea: BankingAreaTypeEnum.BANCO,
            contract: 12345,
            fullName: 'Cliente Banco',
            numClient: 101,
            status: 'A'
        },
        {
            bankingArea: BankingAreaTypeEnum.BOLSA,
            contract: 98765,
            fullName: 'Cliente Bolsa',
            numClient: 202,
            status: 'A'
        }
    ];

    beforeEach(async () => {
        notificationsService = jasmine.createSpyObj('NotificationsService', ['error']);
        modalNotifService = jasmine.createSpyObj('NotificationModalService', ['success', 'error']);
        advisorTransService = jasmine.createSpyObj('AdvisorsTransferService', ['contractsByCustomer', 'transferContracts']);

        await TestBed.configureTestingModule({
            declarations: [AdvisorsTransferComponent],
            imports: [
                CoreModule,
                SharedModule,
                RouterModule.forRoot([]),
            ],
            providers: [
                {
                    provide: ActivatedRoute,
                    useValue: {
                        snapshot: {
                            data: {
                                advisorCatalog: advisorCatalogMock
                            }
                        }
                    }
                },
                { provide: NotificationsService, useValue: notificationsService },
                { provide: NotificationModalService, useValue: modalNotifService },
                { provide: AdvisorsTransferService, useValue: advisorTransService },
                { provide: DateAdapter, useClass: MomentDateAdapter },
                { provide: MsalService, useValue: {} },
                { provide: MsalBroadcastService, useValue: {} }
            ],
            schemas: [NO_ERRORS_SCHEMA]
        })
            .overrideComponent(AdvisorsTransferComponent, {
                set: { template: '' }
            })
            .compileComponents();

        fixture = TestBed.createComponent(AdvisorsTransferComponent);
        component = fixture.componentInstance;

        (component as any).table1Left = { deselectAll: jasmine.createSpy('deselectAllTable1') };
        (component as any).table2Right = { deselectAll: jasmine.createSpy('deselectAllTable2') };
        (component as any).inputAdvisor1NumberRef = { nativeElement: { focus: jasmine.createSpy('focus1') } };
        (component as any).inputAdvisor2NumberRef = { nativeElement: { focus: jasmine.createSpy('focus2') } };

        component.ngOnInit();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should load advisor catalog on init', () => {
        expect(component.advisorList).toEqual(advisorCatalogMock);
    });

    it('should validate equal advisors correctly', () => {
        component.advisorForm.controls.advisorNumber1.setValue('100');
        component.advisorForm.controls.advisorNumber2.setValue('100');

        expect(component.validateEqualAdvisor()).toBeTrue();

        component.advisorForm.controls.advisorNumber2.setValue('200');
        expect(component.validateEqualAdvisor()).toBeFalse();
    });

    it('should set advisor name when advisor exists', () => {
        component.advisorForm.controls.advisorNumber1.setValue('100');

        component.searchAdvisor(new Event('blur'), '1');

        expect(component.advisorName1).toBe('Asesor Uno');
        expect(notificationsService.error).not.toHaveBeenCalled();
    });

    it('should reject transfer to same advisor', () => {
        component.advisorForm.controls.advisorNumber1.setValue('100');
        component.advisorForm.controls.advisorNumber2.setValue('100');
        component.advisorName1 = 'Nombre previo';

        component.searchAdvisor(new Event('blur'), '1');

        expect(component.advisorForm.controls.advisorNumber1.value).toBe('');
        expect(component.advisorName1).toBe('');
        expect(notificationsService.error).toHaveBeenCalledWith(
            'Inválido transferencia al mismo asesor',
            'Favor de verificar'
        );
    });

    it('should notify and clear advisor name when advisor does not exist', fakeAsync(() => {
        component.advisorForm.controls.advisorNumber2.setValue('999');
        component.advisorName2 = 'No válido';

        component.searchAdvisor(new Event('blur'), '2');
        tick(1);

        expect(notificationsService.error).toHaveBeenCalledWith(
            'Ejecutivo no localizado',
            'Por favor ingresa un número de Asesor válido'
        );
        expect(component.advisorForm.controls.advisorNumber2.value).toBe('');
        expect(component.advisorName2).toBe('');
    }));

    it('should not search contracts when form is invalid', () => {
        component.advisorForm.controls.advisorNumber1.setValue('');
        component.advisorForm.controls.advisorNumber2.setValue('');

        component.onSearch();

        expect(advisorTransService.contractsByCustomer).not.toHaveBeenCalled();
    });

    it('should query contracts and map bankingAreaText on search', () => {
        advisorTransService.contractsByCustomer.and.returnValue(of(contractsMock));
        component.advisorForm.controls.advisorNumber1.setValue('100');
        component.advisorForm.controls.advisorNumber2.setValue('200');

        component.onSearch();

        expect(advisorTransService.contractsByCustomer).toHaveBeenCalledWith('100');
        expect(component.leftList.length).toBe(2);
        expect(component.leftList[0].bankingAreaText).toBe('BANCO');
        expect(component.leftList[1].bankingAreaText).toBe('CASA DE BOLSA');
    });

    it('should filter left list by contract term and business type', () => {
        component.leftList = [...contractsMock];
        component.contractSearchInput = '123';
        component.filterBank = true;
        component.filterBroker = false;

        component.applyFilters();

        expect(component.filteredLeftList.length).toBe(1);
        expect(component.filteredLeftList[0].contract).toBe(12345);
    });

    it('should apply contract filter from input event', () => {
        component.leftList = [...contractsMock];
        component.contractSearchInput = '987';
        const event = { target: { value: '987' } } as unknown as Event;

        component.applyContractFilter(event);

        expect(component.contractSearchInput).toBe('987');
        expect(component.filteredLeftList.length).toBe(1);
        expect(component.filteredLeftList[0].contract).toBe(98765);
    });

    it('should move selected contracts to right list', () => {
        component.leftList = [...contractsMock];
        component.selectedLeft = [{ ...contractsMock[0], active: true } as AdvisorTransferContracts & { active: boolean }];

        component.moveToRight();

        expect(component.rightList.length).toBe(1);
        expect(component.rightList[0].contract).toBe(12345);
        expect(component.leftList.length).toBe(1);
        expect(component.selectedLeft.length).toBe(0);
    });

    it('should move selected contracts to left list', () => {
        component.rightList = [...contractsMock];
        component.selectedRight = [{ ...contractsMock[1], active: true } as AdvisorTransferContracts & { active: boolean }];

        component.moveToLeft();

        expect(component.leftList.length).toBe(1);
        expect(component.leftList[0].contract).toBe(98765);
        expect(component.rightList.length).toBe(1);
        expect(component.selectedRight.length).toBe(0);
    });

    it('should call success modal when transfer is successful', () => {
        advisorTransService.transferContracts.and.returnValue(of({ status: '1' }));
        component.advisorForm.controls.advisorNumber1.setValue('100');
        component.advisorForm.controls.advisorNumber2.setValue('200');
        component.rightList = [contractsMock[0]];

        component.onSave();

        expect(advisorTransService.transferContracts).toHaveBeenCalled();
        expect(modalNotifService.success).toHaveBeenCalled();
        expect(modalNotifService.error).not.toHaveBeenCalled();
    });

    it('should call error modal when transfer fails', () => {
        advisorTransService.transferContracts.and.returnValue(of({ status: '0' }));
        component.advisorForm.controls.advisorNumber1.setValue('100');
        component.advisorForm.controls.advisorNumber2.setValue('200');
        component.rightList = [contractsMock[0]];

        component.onSave();

        expect(modalNotifService.error).toHaveBeenCalled();
        expect(modalNotifService.success).not.toHaveBeenCalled();
    });

    it('should clear all data on cancel', () => {
        component.advisorForm.controls.advisorNumber1.setValue('100');
        component.advisorForm.controls.advisorNumber2.setValue('200');
        component.advisorName1 = 'Asesor Uno';
        component.advisorName2 = 'Asesor Dos';
        component.leftList = [...contractsMock];
        component.rightList = [...contractsMock];
        component.selectedLeft = [...contractsMock];
        component.selectedRight = [...contractsMock];
        component.contractSearchInput = '123';

        component.onCancel();

        expect(component.advisorForm.controls.advisorNumber1.value).toBe('');
        expect(component.advisorForm.controls.advisorNumber2.value).toBe('');
        expect(component.advisorName1).toBe('');
        expect(component.advisorName2).toBe('');
        expect(component.leftList.length).toBe(0);
        expect(component.rightList.length).toBe(0);
        expect(component.selectedLeft.length).toBe(0);
        expect(component.selectedRight.length).toBe(0);
        expect(component.contractSearchInput).toBe('');
    });

    it('should return advisor name by advisor code', () => {
        expect(component.getAdvisorName('100')).toBe('Asesor Uno');
        expect(component.getAdvisorName('NOT_FOUND')).toBeUndefined();
    });
});

