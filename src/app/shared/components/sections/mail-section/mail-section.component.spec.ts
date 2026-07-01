import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';

import { MailSectionComponent } from './mail-section.component';
import { NotificationsService } from '../../../services/notifications.service';
import { NotificationModalService } from '../../../services/notification-modal.service';
import { OtcService } from '../../../services/otc.service';
import { TokenVerificationServiceService } from '../../../services/token-verification-service.service';
import { UnsavedChangesService } from '../../../../core/services/unsaved-changes.service';
import { NotificationFormRegistry } from '../../../services/notifications/notification-form-registry.service';
import { ERROR_MESSAGES } from '../../../../onboarding/constants/form-messages';

describe('MailSectionComponent', () => {
	let component: MailSectionComponent;
	let fixture: ComponentFixture<MailSectionComponent>;
	let notificationsService: jasmine.SpyObj<NotificationsService>;
	let notificationModalService: jasmine.SpyObj<NotificationModalService>;
	let otcService: jasmine.SpyObj<OtcService>;
	let tokenVerificationService: jasmine.SpyObj<TokenVerificationServiceService>;
	let unsavedChangesService: jasmine.SpyObj<UnsavedChangesService>;
	let notificationRegistry: jasmine.SpyObj<NotificationFormRegistry>;

	beforeEach(async () => {
		notificationsService = jasmine.createSpyObj<NotificationsService>('NotificationsService', ['error', 'success']);
		notificationModalService = jasmine.createSpyObj<NotificationModalService>('NotificationModalService', ['confirm','warning']);
		otcService = jasmine.createSpyObj<OtcService>('OtcService', ['sendEmail']);
		tokenVerificationService = jasmine.createSpyObj<TokenVerificationServiceService>('TokenVerificationServiceService', ['showModal']);
		unsavedChangesService = jasmine.createSpyObj<UnsavedChangesService>('UnsavedChangesService', ['setUnsavedChanges']);
		notificationRegistry = jasmine.createSpyObj<NotificationFormRegistry>('NotificationFormRegistry', ['registerForm']);

		notificationModalService.confirm.and.returnValue(Promise.resolve({ value: true } as any));
    notificationModalService.warning.and.returnValue(Promise.resolve({ value: true } as any));
		otcService.sendEmail.and.returnValue(of({ message: 'OK' } as any));
		tokenVerificationService.showModal.and.returnValue(Promise.resolve({ message: 'OK' }));

		await TestBed.configureTestingModule({
			imports: [ReactiveFormsModule],
			declarations: [MailSectionComponent],
			providers: [
				{ provide: NotificationsService, useValue: notificationsService },
				{ provide: NotificationModalService, useValue: notificationModalService },
				{ provide: OtcService, useValue: otcService },
				{ provide: TokenVerificationServiceService, useValue: tokenVerificationService },
				{ provide: UnsavedChangesService, useValue: unsavedChangesService },
				{ provide: NotificationFormRegistry, useValue: notificationRegistry }
			],
			schemas: [NO_ERRORS_SCHEMA]
		})
			.overrideComponent(MailSectionComponent, {
				set: { template: '' }
			})
			.compileComponents();

		fixture = TestBed.createComponent(MailSectionComponent);
		component = fixture.componentInstance;
		fixture.componentRef.setInput('mailSaved', []);
		fixture.componentRef.setInput('disabled', false);
		fixture.componentRef.setInput('disableOTC', true);
		fixture.detectChanges();
	});

	it('should create and register the form on init', () => {
		expect(component).toBeTruthy();
		expect(component.mailColumns.length).toBe(2);
		expect(notificationRegistry.registerForm).toHaveBeenCalledWith(component.form);
	});

	it('should load saved mails and block save when permissions disable it', () => {
		const saved = [{ id: '1', mail: 'saved@mail.com', mailNotification: false, active: true }];

		fixture.componentRef.setInput('mailSaved', saved);
		fixture.componentRef.setInput('rolePermises', {
			hide: false,
			allDisabled: true,
			fieldsDisabled: [],
			buttonsDisabled: ['save']
		});
		component.ngOnChanges();
		component.setData(saved as any);

		expect(component.mailList()).toEqual(saved as any);
		expect(component.mailConfigs.showEditAction).toBeFalse();
		expect(component.mailConfigs.showDeleteAction).toBeFalse();
		expect(component.cantSave).toBeTrue();
	});

	it('should show required-fields error when the form is empty', async () => {
		component.form.patchValue({ mail: '', mailNotification: false });

		await component.onSubmit();

		expect(notificationsService.error).toHaveBeenCalledWith(ERROR_MESSAGES.REQUIRED_FIELDS);
	});

	it('should show invalid-mail error when the format is incorrect', async () => {
		component.form.patchValue({ mail: 'abc@abc', mailNotification: false });

		await component.onSubmit();

		expect(notificationsService.error).toHaveBeenCalledWith(ERROR_MESSAGES.MAIL_INVALID);
	});

	it('should reject duplicated active mails', async () => {
		component.mailList.set([{ id: '1', mail: 'example@gmail.com', mailNotification: false, active: true } as any]);
		component.form.patchValue({ mail: 'example@gmail.com', mailNotification: false });

		await component.onSubmit();

		expect(notificationsService.error).toHaveBeenCalledWith(ERROR_MESSAGES.MAIL_ALREADY_EXIST);
	});

	it('should reject a second notification mail', async () => {
		component.mailList.set([{ id: '1', mail: 'other@gmail.com', mailNotification: true, active: true } as any]);
		component.form.patchValue({ mail: 'new@gmail.com', mailNotification: true });

		await component.onSubmit();

		expect(notificationsService.error).toHaveBeenCalledWith(ERROR_MESSAGES.MAIL_NOTIFICATION_ALREADY_EXIST);
	});

	it('should add a new mail and mark the form as modified when submission succeeds', async () => {
		spyOn(crypto, 'randomUUID').and.returnValue('11111111-1111-4111-8111-111111111111');
		component.form.patchValue({ mail: 'example@gmail.com', mailNotification: false });

		await component.onSubmit();

		expect(component.mailList()).toEqual([
			{ id: '11111111-1111-4111-8111-111111111111', mail: 'example@gmail.com', mailNotification: false, isSaved: false, active: true } as any
		]);
		expect(notificationsService.success).toHaveBeenCalled();
		expect(component.unsavedState()).toBeTrue();
	});

	it('should update an existing mail during edit mode', async () => {
		component.mailList.set([{ id: '1', mail: 'old@gmail.com', mailNotification: false, active: true } as any]);
		component.editingId = '1';
		component.form.patchValue({ mail: 'new@gmail.com', mailNotification: true, isSaved: false });

		await component.onSubmit();

		expect(component.mailList()[0]).toEqual(jasmine.objectContaining({
			id: '1',
			mail: 'new@gmail.com',
			mailNotification: true
		}));
	});

	it('should edit and delete rows through eventRowMail', async () => {
		const editSpy = spyOn(component, 'editMail');
		const deleteSpy = spyOn(component, 'deleteMail').and.returnValue(Promise.resolve());
		const row = { id: '1', mail: 'example@gmail.com', mailNotification: false, active: true };

		await component.eventRowMail({ type: 'edit', row });
		await component.eventRowMail({ type: 'delete', row });

		expect(editSpy).toHaveBeenCalledWith({ type: 'edit', row });
		expect(deleteSpy).toHaveBeenCalledWith({ type: 'delete', row });
	});

	it('should deactivate a mail when delete is confirmed', async () => {
		component.mailList.set([{ id: '1', mail: 'example@gmail.com', mailNotification: false, active: true } as any]);

		await component.deleteMail({ row: { id: '1', mail: 'example@gmail.com' } });

		expect(component.mailList()[0].active).toBeFalse();
		expect(notificationsService.success).toHaveBeenCalled();
	});

	it('should patch the form in editMail and restore the original list in clear', () => {
		fixture.componentRef.setInput('mailSaved', [{ id: '2', mail: 'saved@gmail.com', mailNotification: false, active: true }]);
		component.editMail({ row: { id: '1', mail: 'edit@gmail.com', mailNotification: true, isSaved: true } });
		component.clear();

		expect(component.form.get('mail')?.value).toBe('edit@gmail.com');
		expect(component.editingId).toBe('1');
		expect(component.mailList()).toEqual([{ id: '2', mail: 'saved@gmail.com', mailNotification: false, active: true }] as any);
	});

	it('should reset unsavedState in resetModified', () => {
		component.unsavedState.set(true);

		component.resetModified();

		expect(component.unsavedState()).toBeFalse();
	});
});
