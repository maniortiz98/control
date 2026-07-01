import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';

import { IdentificationSectionComponent } from './identification-section.component';
import { NotificationsService } from '../../../services/notifications.service';
import { NotificationModalService } from '../../../services/notification-modal.service';
import { CatalogsService } from '../../../services/catalogs.service';
import { UnsavedChangesService } from '../../../../core/services/unsaved-changes.service';
import { ERROR_MESSAGES } from '../../../../onboarding/constants/form-messages';

describe('IdentificationSectionComponent', () => {
	let component: IdentificationSectionComponent;
	let fixture: ComponentFixture<IdentificationSectionComponent>;
	let notificationsService: jasmine.SpyObj<NotificationsService>;
	let notificationModalService: jasmine.SpyObj<NotificationModalService>;
	let catalogsService: jasmine.SpyObj<CatalogsService>;

	beforeEach(async () => {
		notificationsService = jasmine.createSpyObj<NotificationsService>('NotificationsService', ['error', 'success']);
		notificationModalService = jasmine.createSpyObj<NotificationModalService>('NotificationModalService', ['confirm']);
		catalogsService = jasmine.createSpyObj<CatalogsService>('CatalogsService', ['getCountry', 'getIdentificationType']);

		notificationModalService.confirm.and.returnValue(Promise.resolve({ value: true } as any));
		catalogsService.getCountry.and.returnValue(of([{ countryId: 'MEX', country: 'Mexico' }, { countryId: 'USA', country: 'USA' }] as any));
		catalogsService.getIdentificationType.and.returnValue(of([
			{ text: 'INE', type: '000003' },
			{ text: 'PASAPORTE', type: '000001' }
		] as any));

		await TestBed.configureTestingModule({
			imports: [ReactiveFormsModule],
			declarations: [IdentificationSectionComponent],
			providers: [
				{ provide: NotificationsService, useValue: notificationsService },
				{ provide: NotificationModalService, useValue: notificationModalService },
				{ provide: CatalogsService, useValue: catalogsService },
				{ provide: UnsavedChangesService, useValue: { setUnsavedChanges: jasmine.createSpy('setUnsavedChanges') } }
			],
			schemas: [NO_ERRORS_SCHEMA]
		})
			.overrideComponent(IdentificationSectionComponent, {
				set: { template: '' }
			})
			.compileComponents();

		fixture = TestBed.createComponent(IdentificationSectionComponent);
		component = fixture.componentInstance;
		fixture.componentRef.setInput('identificationSaved', []);
		fixture.componentRef.setInput('showInput', true);
		fixture.componentRef.setInput('showTable', true);
		fixture.detectChanges();
	});

	it('should create and initialize today, catalogs, and columns', () => {
		expect(component).toBeTruthy();
		expect(component.today).toMatch(/^\d{4}-\d{2}-\d{2}$/);
		expect(catalogsService.getCountry).toHaveBeenCalled();
		expect(component.identificationColumns.length).toBe(4);
	});

	it('should update configs and cantSave based on permissions', () => {
		fixture.componentRef.setInput('rolePermises', {
			hide: false,
			allDisabled: false,
			fieldsDisabled: [],
			buttonsDisabled: ['edit', 'save']
		});

		component.ngOnChanges();

		expect(component.identificationConfigs.showEditAction).toBeFalse();
		expect(component.identificationConfigs.showDeleteAction).toBeTrue();
		expect(component.cantSave).toBeTrue();
	});

	it('should show missing-info error when the form is invalid', () => {
		component.form.patchValue({ identificationCountry: '', identificationType: '', identificationNumber: '', identificationExpDate: '' });

		component.onSubmit();

		expect(notificationsService.error).toHaveBeenCalledWith(ERROR_MESSAGES.MISSING_INFO);
	});

	it('should reject invalid INE expiration dates', () => {
		component.form.patchValue({
			identificationCountry: 'MEX',
			identificationType: '000003',
			identificationNumber: '12345',
			identificationExpDate: '30/11/2026'
		});

		component.onSubmit();

		expect(notificationsService.error).toHaveBeenCalled();
	});

	it('should add a new identification when the form is valid', () => {
		spyOn(crypto, 'randomUUID').and.returnValue('22222222-2222-4222-8222-222222222222');
		component.form.patchValue({
			identificationCountry: 'MEX',
			identificationType: '000001',
			identificationNumber: '12345',
			identificationExpDate: '31/12/2026'
		});

		component.onSubmit();

		expect(component.identificationList().length).toBe(1);
		expect(notificationsService.success).toHaveBeenCalledWith('¡Identificación Capturada con Éxito!', jasmine.any(String));
	});

	it('should detect duplicated identification while editing', () => {
		component.identificationList.set([
			{ id: '1', identificationCountryId: 'MEX', identificationTypeId: '000001', identificationNumber: '12345', identificationExpDate: '31/12/2026', active: true } as any,
			{ id: '2', identificationCountryId: 'MEX', identificationTypeId: '000001', identificationNumber: '99999', identificationExpDate: '31/12/2026', active: true } as any
		]);
		component.editingId = '2';
		component.form.patchValue({
			identificationCountry: 'MEX',
			identificationType: '000001',
			identificationNumber: '12345',
			identificationExpDate: '31/12/2026'
		});

		expect(component.isEditingIndentificationDuplicated()).toBeTrue();
	});

	it('should patch the form when editIdentification is called', () => {
		const event = {
			row: {
				id: '5',
				identificationCountry: 'USA',
				identificationType: 'PASAPORTE',
				identificationNumber: '987',
				identificationExpDate: '31/12/2026'
			}
		};

		component.editIdentification(event);

		expect(component.editingId).toBe('5');
		expect(component.form.get('identificationNumber')?.value).toBe('987');
	});

	it('should dispatch row events to edit and delete handlers', async () => {
		const editSpy = spyOn(component, 'editIdentification');
		const deleteSpy = spyOn(component, 'deleteIdent').and.returnValue(Promise.resolve());
		const row = { id: '1' };

		await component.eventRowidentification({ type: 'edit', row });
		await component.eventRowidentification({ type: 'delete', row });

		expect(editSpy).toHaveBeenCalledWith({ type: 'edit', row });
		expect(deleteSpy).toHaveBeenCalledWith({ type: 'delete', row });
	});

	it('should deactivate an identification on delete confirmation', async () => {
		component.identificationList.set([{ id: '1', active: true } as any]);

		await component.deleteIdent({ row: { id: '1' } });

		expect(component.identificationList()[0].active).toBeFalse();
		expect(notificationsService.success).toHaveBeenCalled();
	});

	it('should disable expiration date when the selected type does not require validation', () => {
		component.onIdentificationTypeChange({ value: '000001' } as any);

		expect(component.form.get('identificationExpDate')?.disabled).toBeTrue();
	});

	it('should clean invalid characters and reset modification state', () => {
		const input = { value: 'abc%123' } as HTMLInputElement;
		component.unsavedState.set(true);

		component.onlyAlfanumerics({ target: input } as any);
		component.resetModified();

		expect(input.value).toBe('abc123');
		expect(component.unsavedState()).toBeFalse();
	});
});
