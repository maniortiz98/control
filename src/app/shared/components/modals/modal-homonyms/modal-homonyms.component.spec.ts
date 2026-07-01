import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { ModalHomonymsComponent } from './modal-homonyms.component';

describe('ModalHomonymsComponent', () => {
    let component: ModalHomonymsComponent;
    let fixture: ComponentFixture<ModalHomonymsComponent>;
    let dialogRef: jasmine.SpyObj<MatDialogRef<ModalHomonymsComponent>>;

    beforeEach(async () => {
        dialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);

        await TestBed.configureTestingModule({
            declarations: [ModalHomonymsComponent],
            providers: [
                { provide: MatDialogRef, useValue: dialogRef },
                { provide: MAT_DIALOG_DATA, useValue: { any: 'value' } },
            ],
            schemas: [NO_ERRORS_SCHEMA],
        })
            .overrideComponent(ModalHomonymsComponent, {
                set: { template: '' },
            })
            .compileComponents();

        fixture = TestBed.createComponent(ModalHomonymsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create and remove validation class from body', () => {
        document.body.classList.add('show-validation');

        fixture = TestBed.createComponent(ModalHomonymsComponent);
        component = fixture.componentInstance;

        expect(component).toBeTruthy();
        expect(document.body.classList.contains('show-validation')).toBeFalse();
    });

    it('should close dialog with null payload', () => {
        component.close();

        expect(dialogRef.close).toHaveBeenCalledWith(null);
    });
});
