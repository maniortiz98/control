import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';

import { ModalNotificationComponent } from './modal-notification.component';

describe('ModalNotificationComponent', () => {
    let component: ModalNotificationComponent;
    let fixture: ComponentFixture<ModalNotificationComponent>;
    let dialogRef: jasmine.SpyObj<MatDialogRef<ModalNotificationComponent>>;

    beforeEach(async () => {
        dialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);

        await TestBed.configureTestingModule({
            declarations: [ModalNotificationComponent],
            providers: [
                { provide: MatDialogRef, useValue: dialogRef },
                { provide: MAT_DIALOG_DATA, useValue: { type: 'info', title: 'Test', infoToCopy: '12345' } },
                { provide: Router, useValue: jasmine.createSpyObj('Router', ['navigate']) },
                { provide: ActivatedRoute, useValue: { parent: {} } },
            ],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();

        fixture = TestBed.createComponent(ModalNotificationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should detect arrays correctly', () => {
        expect(component.isArray(['a', 'b'])).toBeTrue();
        expect(component.isArray('text')).toBeFalse();
    });

    it('should close the dialog with value and message', () => {
        component.close(true, 'ok');

        expect(dialogRef.close).toHaveBeenCalledWith({ value: true, message: 'ok' });
    });

    it('should close the dialog with empty object on exit', () => {
        component.exit();

        expect(dialogRef.close).toHaveBeenCalledWith({});
    });

    it('should copy prospect number when data is available', async () => {
        const writeTextSpy = jasmine.createSpy().and.returnValue(Promise.resolve());
        Object.defineProperty(navigator, 'clipboard', {
            value: { writeText: writeTextSpy },
            configurable: true,
        });

        component.copyProspectNumber();
        await Promise.resolve();

        expect(writeTextSpy).toHaveBeenCalledWith('12345');
    });

    it('should not copy when there is no info to copy', () => {
        const writeTextSpy = jasmine.createSpy().and.returnValue(Promise.resolve());
        Object.defineProperty(navigator, 'clipboard', {
            value: { writeText: writeTextSpy },
            configurable: true,
        });
        component.data.infoToCopy = undefined;

        component.copyProspectNumber();

        expect(writeTextSpy).not.toHaveBeenCalled();
    });
});
