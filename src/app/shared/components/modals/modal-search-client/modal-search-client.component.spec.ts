import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { ModalSearchClientComponent } from './modal-search-client.component';
import { NotificationsService } from '../../../services/notifications.service';
import { SearchClientFlowService } from '../../../services/search-client-flow.service';

describe('ModalSearchClientComponent', () => {
    let component: ModalSearchClientComponent;
    let fixture: ComponentFixture<ModalSearchClientComponent>;
    let dialogRef: jasmine.SpyObj<MatDialogRef<ModalSearchClientComponent>>;
    let notifications: jasmine.SpyObj<NotificationsService>;

    beforeEach(async () => {
        dialogRef = jasmine.createSpyObj('MatDialogRef', ['close', 'updateSize']);
        notifications = jasmine.createSpyObj('NotificationsService', ['error']);

        await TestBed.configureTestingModule({
            declarations: [ModalSearchClientComponent],
            providers: [
                { provide: MAT_DIALOG_DATA, useValue: {} },
                { provide: MatDialogRef, useValue: dialogRef },
                { provide: NotificationsService, useValue: notifications },
                { provide: SearchClientFlowService, useValue: jasmine.createSpyObj('SearchClientFlowService', ['searchClientWithValidations']) },
            ],
            schemas: [NO_ERRORS_SCHEMA],
        })
            .overrideComponent(ModalSearchClientComponent, {
                set: { template: '' },
            })
            .compileComponents();

        fixture = TestBed.createComponent(ModalSearchClientComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create and initialize columns', () => {
        expect(component).toBeTruthy();
        expect(component.tableColumns.length).toBe(8);
        expect(dialogRef.updateSize).toHaveBeenCalledWith('38vw');
    });

    it('should close dialog on cancel', () => {
        component.cancel();

        expect(dialogRef.close).toHaveBeenCalledWith(null);
    });

    it('should move to page two and map ids when there are search results', () => {
        component.nextPage({ results: [{ clientNumber: '123' }] });

        expect(component.page()).toBe(2);
        expect(component.tableData().length).toBe(1);
        expect(component.tableData()[0].clientNumber).toBe('123');
        expect(component.tableData()[0].id).toBeTruthy();
    });

    it('should show error when there are no search results', () => {
        component.nextPage({ results: [] });

        expect(notifications.error).toHaveBeenCalledWith('No se encontraron datos en la búsqueda');
    });

    it('should search and forward results to nextPage', async () => {
        component.searchComponent = {
            submit: jasmine.createSpy().and.resolveTo({ results: [{ clientNumber: '456' }] }),
        } as any;
        spyOn(component, 'nextPage');

        await component.search();

        expect(component.searchComponent.submit).toHaveBeenCalledWith(true);
        expect(component.nextPage).toHaveBeenCalledWith({ results: [{ clientNumber: '456' }] });
    });

    it('should require a selected row before adding', async () => {
        component.response = null;

        await component.add();

        expect(notifications.error).toHaveBeenCalledWith('Debes Seleccionar un Cliente para Poder Agregarlo');
        expect(dialogRef.close).not.toHaveBeenCalled();
    });

    it('should map and close with selected client when adding', async () => {
        component.response = {
            row: {
                clientNumber: '001',
                curp: 'CURP123',
                rfc: 'RFC123',
                birthDate: '1990-01-01',
                firstName: 'JOHN',
                middleName: 'M',
                lastName: 'DOE',
                secondLastName: 'SMITH',
            },
        };

        await component.add();

        expect(dialogRef.close).toHaveBeenCalledWith({
            clientNumber: '001',
            curp: 'CURP123',
            rfc: 'RFC123',
            birthDate: '1990-01-01',
            firstName: 'JOHN',
            middleName: 'M',
            firstLastName: 'DOE',
            secondLastName: 'SMITH',
        });
    });

    it('should store the selected item and resize when page changes', () => {
        const event = { row: { clientNumber: '789' } };

        component.selectItem(event);
        dialogRef.updateSize.calls.reset();
        component.page.set(2);
        fixture.detectChanges();

        expect(component.response).toEqual(event);
        expect(dialogRef.updateSize).toHaveBeenCalledWith('80vw');
    });
});
