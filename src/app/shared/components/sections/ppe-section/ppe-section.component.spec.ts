import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';

import { PpeSectionComponent } from './ppe-section.component';
import { UnsavedChangesService } from '../../../../core/services/unsaved-changes.service';
import { CatalogsService } from '../../../services/catalogs.service';
import { NotificationsService } from '../../../services/notifications.service';
import { NotificationModalService } from '../../../services/notification-modal.service';
import { ModalPpeFamilyService } from '../../../services/modal-ppe-family.service';
import { RealOwnerPpeFamilyService } from '../../../services/storage-services/real-owner-ppe-family.service';

describe('PpeSectionComponent', () => {
	let component: PpeSectionComponent;
	let fixture: ComponentFixture<PpeSectionComponent>;
	let familyService: jasmine.SpyObj<RealOwnerPpeFamilyService>;
	let modalService: jasmine.SpyObj<ModalPpeFamilyService>;
	let notificationsService: jasmine.SpyObj<NotificationsService>;
	let notificationModalService: jasmine.SpyObj<NotificationModalService>;
	let catalogsService: jasmine.SpyObj<CatalogsService>;
	let unsavedChangesService: jasmine.SpyObj<UnsavedChangesService>;

	beforeEach(async () => {
		familyService = jasmine.createSpyObj<RealOwnerPpeFamilyService>('RealOwnerPpeFamilyService', ['clear', 'add', 'getAll', 'update', 'delete']);
		modalService = jasmine.createSpyObj<ModalPpeFamilyService>('ModalPpeFamilyService', ['formModalDataPPE']);
		notificationsService = jasmine.createSpyObj<NotificationsService>('NotificationsService', ['error', 'success']);
		notificationModalService = jasmine.createSpyObj<NotificationModalService>('NotificationModalService', ['confirm']);
		catalogsService = jasmine.createSpyObj<CatalogsService>('CatalogsService', ['getRelationships']);
		unsavedChangesService = jasmine.createSpyObj<UnsavedChangesService>('UnsavedChangesService', ['setUnsavedChanges']);

		catalogsService.getRelationships.and.returnValue(of([{ idParent: '1', kinShip: 'PADRE' }] as any));
		familyService.getAll.and.returnValue([] as any);
		familyService.add.and.returnValue(true);
		familyService.update.and.returnValue(true);
		familyService.delete.and.returnValue(true);
		modalService.formModalDataPPE.and.returnValue(of({
			id: '1',
			relationship: '1',
			chargeDueDate: '2028-12-31',
			rfc: 'RFC123',
			curp: 'CURP123',
			firstName: 'JUAN',
			firstLastName: 'PEREZ',
			positionHeld: 'DIRECTOR'
		} as any));
		notificationModalService.confirm.and.returnValue(Promise.resolve({ value: true } as any));

		await TestBed.configureTestingModule({
			imports: [ReactiveFormsModule],
			declarations: [PpeSectionComponent],
			providers: [
				{ provide: UnsavedChangesService, useValue: unsavedChangesService },
				{ provide: CatalogsService, useValue: catalogsService },
				{ provide: NotificationsService, useValue: notificationsService },
				{ provide: NotificationModalService, useValue: notificationModalService },
				{ provide: ModalPpeFamilyService, useValue: modalService },
				{ provide: RealOwnerPpeFamilyService, useValue: familyService },
				{ provide: 'OnboardingService', useValue: {} }
			],
			schemas: [NO_ERRORS_SCHEMA]
		})
			.overrideComponent(PpeSectionComponent, {
				set: { template: '' }
			})
			.compileComponents();

		fixture = TestBed.createComponent(PpeSectionComponent);
		component = fixture.componentInstance;
	});

	it('should create, clear family storage, and load relationships on init', () => {
		component.ngOnInit();

		expect(component).toBeTruthy();
		expect(familyService.clear).toHaveBeenCalled();
		expect(catalogsService.getRelationships).toHaveBeenCalled();
		expect(component.columnsFamily.length).toBe(7);
	});

	it('should patch data and map family rows on init when dataPPE exists', () => {
		component.dataPPE = {
			ppe: true,
			fppe: true,
			tppe: 'ALTA',
			positionHeld: 'DIRECTOR',
			expirationDate: '2028-12-31',
			dataFamily: [{ id: '1', relationship: '1', chargeDueDate: '2028-12-31' }]
		} as any;
		familyService.getAll.and.returnValue([{ id: '1', relationship: '1', chargeDueDate: '2028-12-31' }] as any);

		component.ngOnInit();

		expect(component.ppe()).toBeTrue();
		expect(component.addFppe()).toBeTrue();
		expect(component.profileForm.get('tppe')?.value).toBe('ALTA');
		expect(component.dataFamily.length).toBe(1);
		expect(component.dataFamily[0].relationship).toBe('PADRE');
	});

	it('should toggle PPE and family flags from radio events', () => {
		component.onSelectionChangePpe({ value: true } as any);
		component.onSelectionChangeFppe({ value: true } as any);

		expect(component.ppe()).toBeTrue();
		expect(component.addFppe()).toBeTrue();

		component.onSelectionChangePpe({ value: false } as any);
		component.onSelectionChangeFppe({ value: false } as any);

		expect(component.ppe()).toBeFalse();
		expect(component.addFppe()).toBeFalse();
	});

	it('should add family data from the modal when fppe is captured', () => {
		familyService.getAll.and.returnValue([{ id: '1', relationship: '1', chargeDueDate: '2028-12-31' }] as any);

		component.fppe();

		expect(modalService.formModalDataPPE).toHaveBeenCalled();
		expect(familyService.add).toHaveBeenCalled();
		expect(component.dataFamily.length).toBe(1);
		expect(unsavedChangesService.setUnsavedChanges).toHaveBeenCalledWith(true);
	});

	it('should show an error when adding a duplicated family member', () => {
		familyService.add.and.returnValue(false);

		component.fppe();

		expect(notificationsService.error).toHaveBeenCalledWith('Ya se encuentra una persona registrada con esa información');
	});

	it('should delete a family row after confirmation', async () => {
		component.dataFamily = [{ id: '1' }, { id: '2' }] as any;
		familyService.getAll.and.returnValue([{ id: '2', relationship: '1', chargeDueDate: '2028-12-31' }] as any);

		await component.eventRowFppe({ type: 'delete', row: { id: '1' } });

		expect(notificationModalService.confirm).toHaveBeenCalled();
		expect(familyService.delete).toHaveBeenCalledWith('1');
		expect(notificationsService.success).toHaveBeenCalledWith('Borrado con éxito');
	});

	it('should reject deleting the last family row', async () => {
		component.dataFamily = [{ id: '1' }] as any;

		await component.eventRowFppe({ type: 'delete', row: { id: '1' } });

		expect(notificationsService.error).toHaveBeenCalledWith('Error no se pueden borrar todos los familiares PPE');
	});

	it('should return PPE data without family members when fppe is false', () => {
		component.profileForm.patchValue({
			ppe: true,
			tppe: 'ALTA',
			positionHeld: 'DIRECTOR',
			expirationDate: '2028-12-31',
			fppe: false
		});

		const result = component.onSubmit();

		expect(result).toEqual({
			ppe: true,
			tppe: 'ALTA',
			positionHeld: 'DIRECTOR',
			expirationDate: '2028-12-31',
			fppe: false,
			dataFamily: []
		} as any);
	});

	it('should require family members when fppe is true', () => {
		component.profileForm.patchValue({
			ppe: false,
			tppe: '',
			positionHeld: '',
			expirationDate: '',
			fppe: true
		});
		familyService.getAll.and.returnValue([] as any);

		const result = component.onSubmit();

		expect(result).toBeNull();
		expect(notificationsService.error).toHaveBeenCalledWith('Tiene Algún Familiar que sea Persona Políticamente Expuesta Está Marcado en Si Pero no Tiene Registro.');
	});

	it('should map and expose relationship helpers', () => {
		component.relationships.set([{ idParent: '1', kinShip: 'PADRE' }] as any);
		component.setData([{ id: '1', relationship: '1' }] as any);

		expect(component.searchRelationshipNameById('1')).toBe('PADRE');
		expect(component.searchRelationshipIdByName('PADRE')).toBe('1');
		expect(component.dataFamily[0].relationship).toBe('PADRE');
	});
});
