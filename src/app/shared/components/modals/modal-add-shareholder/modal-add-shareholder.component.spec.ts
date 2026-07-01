import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { ModalAddShareholderComponent } from './modal-add-shareholder.component';

describe('ModalAddShareholderComponent', () => {
    let component: ModalAddShareholderComponent;
    let fixture: ComponentFixture<ModalAddShareholderComponent>;
    let dialogRef: jasmine.SpyObj<MatDialogRef<ModalAddShareholderComponent>>;

    beforeEach(async () => {
        dialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);

        await TestBed.configureTestingModule({
            declarations: [ModalAddShareholderComponent],
            imports: [ReactiveFormsModule],
            providers: [
                { provide: MatDialogRef, useValue: dialogRef },
                { provide: MAT_DIALOG_DATA, useValue: { remaining: 40 } },
            ],
            schemas: [NO_ERRORS_SCHEMA],
        })
            .overrideComponent(ModalAddShareholderComponent, {
                set: { template: '' },
            })
            .compileComponents();

        fixture = TestBed.createComponent(ModalAddShareholderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create with remaining percentage as default', () => {
        expect(component).toBeTruthy();
        expect(component.form.getRawValue().percentage).toBe(40);
    });

    it('should not close the dialog when the form is invalid', () => {
        component.form.controls.percentage.setValue(0);

        component.save();

        expect(dialogRef.close).not.toHaveBeenCalled();
    });

    it('should trim values and close with normalized payload on save', () => {
        component.form.patchValue({
            personType: 'PM',
            percentage: 25,
            nombre: '  EMPRESA TEST  ',
            fideicomiso: true,
            cotizaBmv: true,
        });

        component.save();

        expect(dialogRef.close).toHaveBeenCalledWith({
            personType: 'PM',
            percentage: 25,
            nombre: 'EMPRESA TEST',
            fideicomiso: true,
            cotizaBmv: true,
        });
    });

    it('should close the dialog without payload on cancel', () => {
        component.cancel();

        expect(dialogRef.close).toHaveBeenCalledWith();
    });
});
