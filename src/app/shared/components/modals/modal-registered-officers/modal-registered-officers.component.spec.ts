import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { RegisteredOfficersModalComponent } from './modal-registered-officers.component';
import { NotificationsService } from '../../../services/notifications.service';

describe('RegisteredOfficersModalComponent', () => {
    let component: RegisteredOfficersModalComponent;
    let fixture: ComponentFixture<RegisteredOfficersModalComponent>;
    let dialogRef: jasmine.SpyObj<MatDialogRef<RegisteredOfficersModalComponent>>;
    let notifications: jasmine.SpyObj<NotificationsService>;

    const data = {
        existingData: [
            { tempId: '1', economicActivity: 'ACT', prospectSector: 'Privado', accountType: 'A', operationYears: '2', riskGroup: 'Bajo', dependents: '0', firstName: 'JUAN', middleName: '', firstSurname: 'PEREZ', secondSurname: 'LOPEZ', nationality: 'MX', currentPosition: 'DIR', positionYears: '1', industryYears: '3' },
            { tempId: '2', economicActivity: 'ACT2', prospectSector: 'Público', accountType: 'B', operationYears: '4', riskGroup: 'Alto', dependents: '1', firstName: 'ANA', middleName: 'MARIA', firstSurname: 'RUIZ', secondSurname: 'DIAZ', nationality: 'MX', currentPosition: 'GER', positionYears: '5', industryYears: '7' },
        ],
        tempId: '1',
        economicActivity: 'ACT',
        prospectSector: 'Privado',
        accountType: 'A',
        operationYears: '2',
        riskGroup: 'Bajo',
        dependents: '0',
        firstName: 'JUAN',
        middleName: '',
        firstSurname: 'PEREZ',
        secondSurname: 'LOPEZ',
        nationality: 'MX',
        currentPosition: 'DIR',
        positionYears: '1',
        industryYears: '3',
    };

    beforeEach(async () => {
        dialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
        notifications = jasmine.createSpyObj('NotificationsService', ['error']);

        await TestBed.configureTestingModule({
            declarations: [RegisteredOfficersModalComponent],
            imports: [ReactiveFormsModule],
            providers: [
                { provide: MAT_DIALOG_DATA, useValue: data },
                { provide: MatDialogRef, useValue: dialogRef },
                { provide: NotificationsService, useValue: notifications },
            ],
            schemas: [NO_ERRORS_SCHEMA],
        })
            .overrideComponent(RegisteredOfficersModalComponent, {
                set: { template: '' },
            })
            .compileComponents();

        fixture = TestBed.createComponent(RegisteredOfficersModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create and filter out the current record from existing data', () => {
        expect(component).toBeTruthy();
        expect(component.existingData.length).toBe(1);
        expect(component.existingData[0].tempId).toBe('2');
    });

    it('should initialize form with incoming data', () => {
        expect(component.editForm.get('economicActivity')?.value).toBe('ACT');
        expect(component.editForm.get('firstName')?.value).toBe('JUAN');
    });

    it('should show an error when the form is invalid', () => {
        component.editForm.setErrors({ invalid: true });

        component.save();

        expect(notifications.error).toHaveBeenCalledWith('Por favor completa los campos requeridos.');
        expect(dialogRef.close).not.toHaveBeenCalled();
    });

    it('should close with current data on save when form is valid', () => {
        component.save();

        expect(dialogRef.close).toHaveBeenCalledWith({
            economicActivity: 'ACT',
            prospectSector: 'Privado',
            accountType: 'A',
            operationYears: 'ACT',
            riskGroup: 'Bajo',
            dependents: '0',
            firstName: 'JUAN',
            middleName: '',
            firstSurname: 'PEREZ',
            secondSurname: 'LOPEZ',
            nationality: 'MX',
            currentPosition: 'DIR',
            positionYears: '1',
            industryYears: '3',
        });
    });

    it('should close with null on cancel', () => {
        component.cancel();

        expect(dialogRef.close).toHaveBeenCalledWith(null);
    });
});
