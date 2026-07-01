import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';

import { HomonimiasComponent } from './homonimias.component';
import { HomonymsService } from '../../../shared/services/homonyms.service';
import { AuthService } from '../../../core/services/auth.service';
import { CreateWfHomoPfService } from '../../../shared/services/create-wf-homo-pf.service';
import { NotificationModalService } from '../../../shared/services/notification-modal.service';

describe('HomonimiasComponent', () => {
    let fixture: ComponentFixture<HomonimiasComponent>;
    let component: HomonimiasComponent;
    let router: Router;

    let homonymsService: jasmine.SpyObj<HomonymsService>;
    let authService: jasmine.SpyObj<AuthService>;
    let wfService: jasmine.SpyObj<CreateWfHomoPfService>;
    let notificationModalService: jasmine.SpyObj<NotificationModalService>;
    let dialogRef: jasmine.SpyObj<MatDialogRef<HomonimiasComponent>>;
    let dialog: { openDialogs: any[] } & jasmine.SpyObj<MatDialog>;
    let currentData: any[];

    beforeEach(async () => {
        currentData = [
            {
                firstName: 'JUAN',
                secondName: 'CARLOS',
                lastName: 'PEREZ',
                secondLastName: 'LOPEZ',
                rfc: 'PELJ800101AA1',
                curp: 'PELJ800101HDFLRN01',
                percentSimilarity: 1,
                clientNumber: '1001',
            },
            {
                firstName: 'JUAN',
                secondName: '',
                lastName: 'PEREZ',
                secondLastName: '',
                rfc: 'PELJ800101AA2',
                curp: 'PELJ800101HDFLRN02',
                percentSimilarity: 0.8,
                clientNumber: '1002',
            },
        ];

        homonymsService = jasmine.createSpyObj('HomonymsService', ['getData']);
        authService = jasmine.createSpyObj('AuthService', ['getUserInfo']);
        wfService = jasmine.createSpyObj('CreateWfHomoPfService', ['createWfPf']);
        notificationModalService = jasmine.createSpyObj('NotificationModalService', ['success']);
        dialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
        dialog = Object.assign(jasmine.createSpyObj('MatDialog', ['open']), { openDialogs: [] });

        homonymsService.getData.and.callFake(() => currentData as any);
        authService.getUserInfo.and.returnValue(signal({ employeeId: 'EMP-01' } as any));
        wfService.createWfPf.and.returnValue(of({ idWorkflowDetalle: 456 } as any));
        notificationModalService.success.and.returnValue(Promise.resolve({ value: true } as any));

        await TestBed.configureTestingModule({
            declarations: [HomonimiasComponent],
            imports: [RouterTestingModule],
            providers: [
                { provide: HomonymsService, useValue: homonymsService },
                { provide: AuthService, useValue: authService },
                { provide: CreateWfHomoPfService, useValue: wfService },
                { provide: NotificationModalService, useValue: notificationModalService },
                { provide: MatDialogRef, useValue: dialogRef },
                { provide: MatDialog, useValue: dialog },
                { provide: ActivatedRoute, useValue: { parent: {} } },
            ],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();

        router = TestBed.inject(Router);
        spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
    });

    function createComponent(): void {
        fixture = TestBed.createComponent(HomonimiasComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }

    it('should create and map homonyms data on init', () => {
        createComponent();

        expect(component).toBeTruthy();
        expect(homonymsService.getData).toHaveBeenCalled();
        expect(component.dataClient[0].percentSimilarity).toBe('100%');
        expect(component.columnsData.length).toBe(8);
        expect(component.config.idName).toBe('clientNumber');
    });

    it('toggles not-client button based on perfect match existence', () => {
        createComponent();
        expect(component.butonNotClient).toBeFalse();

        currentData = [{ ...currentData[1], clientNumber: '2001' }];
        fixture = TestBed.createComponent(HomonimiasComponent);
        component = fixture.componentInstance;
        component.ngOnInit();
        component.ngAfterViewInit();

        expect(component.butonNotClient).toBeTrue();
    });

    it('updates button state from multi-selection', () => {
        createComponent();

        component.multipleRows([currentData[0]]);
        expect(component.butonContinue).toBeTrue();
        expect(component.butonUnifi).toBeFalse();

        component.multipleRows(currentData);
        expect(component.butonContinue).toBeFalse();
        expect(component.butonUnifi).toBeTrue();

        component.multipleRows([]);
        expect(component.butonContinue).toBeFalse();
        expect(component.butonUnifi).toBeFalse();
    });

    it('closes with continue action when requested', () => {
        createComponent();

        component.onButtonClickContinueDontSelect();

        expect(dialogRef.close).toHaveBeenCalledWith('continue');
    });

    it('closes with selected client number when continuing with a client', () => {
        createComponent();
        spyOn(console, 'log');
        component.dataClientSelected = [currentData[0] as any];

        component.onButtonContinueClient();

        expect(dialogRef.close).toHaveBeenCalledWith('1001');
        expect(console.log).toHaveBeenCalled();
    });

    it('creates unification workflow and closes dialogs on success', async () => {
        createComponent();
        spyOn(console, 'log');
        const keepDialog = {
            componentInstance: { data: { keepOnHttpError: true } },
            close: jasmine.createSpy('closeKeep'),
        };
        const regularDialog = {
            componentInstance: { data: {} },
            close: jasmine.createSpy('closeRegular'),
        };
        (dialog as any).openDialogs = [keepDialog, regularDialog];
        component.dataClientSelected = currentData as any;

        await component.onButtonClickUnifi();

        expect(wfService.createWfPf).toHaveBeenCalledWith(
            jasmine.objectContaining({
                workflowDescription: 'UNIFICACION DE CLIENTES JUAN CARLOS PEREZ LOPEZ 1001, 1002',
                clientList: '1001, 1002',
                advisor: { advisorId: 'EMP-01' },
            }),
        );
        expect(notificationModalService.success).toHaveBeenCalled();
        expect(dialogRef.close).toHaveBeenCalledWith('');
        expect(keepDialog.close).toHaveBeenCalled();
        expect(regularDialog.close).toHaveBeenCalled();
        expect(router.navigate).toHaveBeenCalled();
        expect(console.log).toHaveBeenCalledWith('Unificar');
    });

    it('keeps error dialogs open when closeAllDialogs excludes them', () => {
        createComponent();
        const keepDialog = {
            componentInstance: { data: { keepOnHttpError: true } },
            close: jasmine.createSpy('closeKeep'),
        };
        const regularDialog = {
            componentInstance: { data: {} },
            close: jasmine.createSpy('closeRegular'),
        };
        (dialog as any).openDialogs = [keepDialog, regularDialog];

        (component as any).closeAllDialogs();

        expect(keepDialog.close).not.toHaveBeenCalled();
        expect(regularDialog.close).toHaveBeenCalled();
    });

    it('executes passive table handlers without throwing', () => {
        createComponent();

        expect(() => component.rowSelected({})).not.toThrow();
        expect(() => component.eventRow({})).not.toThrow();
        expect(() => component.eventPage({} as any)).not.toThrow();
    });
});
