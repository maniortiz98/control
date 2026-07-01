import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';

import { ModalTokenVerificationComponent } from './modal-token-verification.component';
import { OtcService } from '../../../services/otc.service';
import { NotificationModalService } from '../../../services/notification-modal.service';
import { NotificationsService } from '../../../services/notifications.service';

describe('ModalTokenVerificationComponent', () => {
    let component: ModalTokenVerificationComponent;
    let fixture: ComponentFixture<ModalTokenVerificationComponent>;
    let dialogRef: jasmine.SpyObj<MatDialogRef<ModalTokenVerificationComponent>>;
    let otcService: jasmine.SpyObj<OtcService>;
    let notificationModalService: jasmine.SpyObj<NotificationModalService>;
    let notifications: jasmine.SpyObj<NotificationsService>;
    let dialogData: any;

    function setInputs(values: string[]): void {
        const items = values.map((value) => ({
            nativeElement: {
                value,
                focus: jasmine.createSpy('focus'),
            },
        }));
        component.inputs = {
            length: items.length,
            first: items[0],
            get: (index: number) => items[index],
            map: (cb: any) => items.map(cb),
            forEach: (cb: any) => items.forEach(cb),
        } as any;
    }

    beforeEach(async () => {
        dialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
        otcService = jasmine.createSpyObj('OtcService', ['validateEmail', 'validateSms', 'sendEmail', 'sendSms']);
        notificationModalService = jasmine.createSpyObj('NotificationModalService', ['confirm']);
        notifications = jasmine.createSpyObj('NotificationsService', ['error']);
        dialogData = { notificationType: 'mail', message: 'usuario@test.com', inputLength: 4 };

        notificationModalService.confirm.and.returnValue(Promise.resolve({ value: true } as any));

        await TestBed.configureTestingModule({
            imports: [ModalTokenVerificationComponent],
            providers: [
                { provide: MatDialogRef, useValue: dialogRef },
                { provide: MAT_DIALOG_DATA, useValue: dialogData },
                { provide: OtcService, useValue: otcService },
                { provide: NotificationModalService, useValue: notificationModalService },
                { provide: NotificationsService, useValue: notifications },
            ],
        })
            .overrideComponent(ModalTokenVerificationComponent, {
                set: { template: '' },
            })
            .compileComponents();

        fixture = TestBed.createComponent(ModalTokenVerificationComponent);
        component = fixture.componentInstance;
        component.ngOnInit();
    });

    it('should create and default input length to configured value', () => {
        expect(component).toBeTruthy();
        expect(component.inputsArray.length).toBe(4);
    });

    it('should default input length to six when missing', () => {
        dialogData.inputLength = 0;
        fixture = TestBed.createComponent(ModalTokenVerificationComponent);
        component = fixture.componentInstance;
        component.ngOnInit();

        expect(component.inputsArray.length).toBe(6);
    });

    it('should obscure mail and phone data', () => {
        expect(component.ofuscatedData()).toBe('*****io@test.com');

        dialogData.notificationType = 'phone';
        dialogData.message = '1234567890';
        fixture = TestBed.createComponent(ModalTokenVerificationComponent);
        component = fixture.componentInstance;
        component.ngOnInit();

        expect(component.ofuscatedData()).toBe('********90');
    });

    it('should move focus to next input when one digit is entered', () => {
        setInputs(['1', '']);

        component.onInput({ target: { value: '1' } } as any, 0);

        expect(component.inputs.get(1)!.nativeElement.focus).toHaveBeenCalled();
    });

    it('should move back on backspace when current input is empty', () => {
        setInputs(['7', '']);
        const event = { key: 'Backspace', preventDefault: jasmine.createSpy('preventDefault') } as any;

        component.onKeyDown(event, 1);

        expect(component.inputs.get(0)!.nativeElement.focus).toHaveBeenCalled();
        expect(component.inputs.get(0)!.nativeElement.value).toBe('');
        expect(event.preventDefault).toHaveBeenCalled();
    });

    it('should verify mail tokens successfully', () => {
        setInputs(['1', '2', '3', '4']);
        otcService.validateEmail.and.returnValue(of({ payload: { result: 'SUCCESS' } } as any));

        component.verify();

        expect(otcService.validateEmail).toHaveBeenCalledWith({ otc: '1234', type: '', email: 'usuario@test.com' });
        expect(dialogRef.close).toHaveBeenCalledWith('1234');
    });

    it('should mark error and open modal after too many mail attempts', () => {
        setInputs(['1', '2', '3', '4']);
        otcService.validateEmail.and.returnValue(of({ payload: { result: 'FAIL' }, intents: 4 } as any));

        component.verify();

        expect(component.otcError()).toBeTrue();
        expect(notificationModalService.confirm).toHaveBeenCalled();
        expect(dialogRef.close).toHaveBeenCalled();
    });

    it('should increment retries and notify on mail validation error', () => {
        setInputs(['1', '2', '3', '4']);
        otcService.validateEmail.and.returnValue(throwError(() => new Error('fail')));

        component.verify();

        expect(component.otcError()).toBeFalse();
        expect(component.retryAttemps).toBe(2);
        expect(notifications.error).toHaveBeenCalledWith('Código Incorrecto', 'Ingrese el Código Correcto');
    });

    it('should verify sms tokens successfully', () => {
        dialogData.notificationType = 'phone';
        dialogData.message = '5512345678';
        fixture = TestBed.createComponent(ModalTokenVerificationComponent);
        component = fixture.componentInstance;
        component.ngOnInit();
        setInputs(['9', '8', '7', '6']);
        otcService.validateSms.and.returnValue(of({ payload: { result: 'SUCCESS' } } as any));

        component.verify();

        expect(otcService.validateSms).toHaveBeenCalledWith({ otc: '9876', type: '', phoneNumber: '5512345678' });
        expect(dialogRef.close).toHaveBeenCalledWith('9876');
    });

    it('should resend email and sms codes according to notification type', () => {
        otcService.sendEmail.and.returnValue(of({ message: 'ok', id: 1 }));
        otcService.sendSms.and.returnValue(of({ message: 'ok' }));

        component.reSend();
        expect(otcService.sendEmail).toHaveBeenCalledWith({ email: 'usuario@test.com' });

        dialogData.notificationType = 'phone';
        dialogData.message = '5512345678';
        fixture = TestBed.createComponent(ModalTokenVerificationComponent);
        component = fixture.componentInstance;
        component.ngOnInit();

        component.reSend();
        expect(otcService.sendSms).toHaveBeenCalledWith({ code: '', phoneNumber: '5512345678', onboarding: '' });
    });

    it('should reset inputs and close dialog explicitly', () => {
        setInputs(['1', '2']);
        component.otcError.set(true);

        component.resetInputs();
        component.close();

        expect(component.inputs.get(0)!.nativeElement.value).toBe('');
        expect(component.inputs.get(1)!.nativeElement.value).toBe('');
        expect(component.otcError()).toBeFalse();
        expect(component.inputs.first.nativeElement.focus).toHaveBeenCalled();
        expect(dialogRef.close).toHaveBeenCalled();
    });
});
