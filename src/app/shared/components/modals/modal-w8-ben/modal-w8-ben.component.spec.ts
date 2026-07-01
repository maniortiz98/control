import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { W8BENModalComponent } from './modal-w8-ben.component';
import { NotificationsService } from '../../../services/notifications.service';

describe('W8BENModalComponent', () => {
    let component: W8BENModalComponent;
    let fixture: ComponentFixture<W8BENModalComponent>;
    let dialogRef: jasmine.SpyObj<MatDialogRef<W8BENModalComponent>>;
    let notifications: jasmine.SpyObj<NotificationsService>;
    let modalData: typeof baseData;

    const baseData = {
        existingData: [
            { tempId: '1', startDateW8: '01/01/2024', endDateW8: '31/12/2024', active: true },
            { tempId: '2', startDateW8: '01/01/2026', endDateW8: '31/12/2026', active: true },
        ],
        tempId: '1',
        startDateW8: '01/01/2024',
        endDateW8: '31/12/2024',
        enabled: true,
    };

    beforeEach(async () => {
        dialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
        notifications = jasmine.createSpyObj('NotificationsService', ['error']);
        modalData = {
            ...baseData,
            existingData: baseData.existingData.map((item) => ({ ...item })),
        };

        await TestBed.configureTestingModule({
            declarations: [W8BENModalComponent],
            imports: [ReactiveFormsModule],
            providers: [
                { provide: MAT_DIALOG_DATA, useValue: modalData },
                { provide: MatDialogRef, useValue: dialogRef },
                { provide: NotificationsService, useValue: notifications },
            ],
            schemas: [NO_ERRORS_SCHEMA],
        })
            .overrideComponent(W8BENModalComponent, {
                set: { template: '' },
            })
            .compileComponents();

        fixture = TestBed.createComponent(W8BENModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create and initialize enabled form', () => {
        expect(component).toBeTruthy();
        expect(component.editForm.enabled).toBeTrue();
    });

    it('should disable form when modal is read only', () => {
        component.data.enabled = false;

        component.ngOnInit();

        expect(component.editForm.disabled).toBeTrue();
    });

    it('should close with null on cancel', () => {
        component.cancel();

        expect(dialogRef.close).toHaveBeenCalledWith(null);
    });

    it('should show error when form is invalid', () => {
        component.editForm.get('startDateW8')?.setValue(null);

        component.save();

        expect(notifications.error).toHaveBeenCalledWith('Por favor completa los campos requeridos.');
    });

    it('should reject invalid ranges and periods longer than three years', () => {
        expect(component.w8DateValidator(new Date('2025-01-01'), new Date('2024-01-01'))).toBeFalse();
        expect(notifications.error).toHaveBeenCalledWith('La Fecha Inicial debe ser Menor que la Fecha Final');

        notifications.error.calls.reset();
        expect(component.w8DateValidator(new Date('2024-01-01'), new Date('2028-02-01'))).toBeFalse();
        expect(notifications.error).toHaveBeenCalledWith(
            'El Período de Vigencia Seleccionado no Puede Exceder los 3 Años',
        );
    });

    it('should reject overlapping active periods', () => {
        component.editForm.patchValue({
            startDateW8: new Date('2026-01-01'),
            endDateW8: new Date('2026-12-31'),
        });

        component.save();

        expect(notifications.error).toHaveBeenCalledWith('Ya Existe un Registro en el Mismo Período.');
        expect(dialogRef.close).not.toHaveBeenCalled();
    });

    it('should format and close when the period is valid', () => {
        component.editForm.patchValue({
            startDateW8: new Date(2025, 0, 1),
            endDateW8: new Date(2025, 11, 31),
        });

        component.save();

        expect(dialogRef.close).toHaveBeenCalledWith({
            startDateW8: '01/01/2025',
            endDateW8: '31/12/2025',
        });
    });

    it('should parse W8 dates from string and Date instances', () => {
        const fromString = component.parseW8Date('15/08/2024');
        const fromDate = component.parseW8Date(new Date(2024, 7, 15));

        expect(fromString.getFullYear()).toBe(2024);
        expect(fromString.getMonth()).toBe(7);
        expect(fromDate.getDate()).toBe(15);
    });
});
