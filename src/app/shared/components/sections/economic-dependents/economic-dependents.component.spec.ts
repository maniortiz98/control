import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';

import { EconomicDependentsComponent } from './economic-dependents.component';
import { CatalogsService } from '../../../services/catalogs.service';
import { NotificationsService } from '../../../services/notifications.service';
import { ModalFormService } from '../../../services/modal-form.service';
import { NotificationModalService } from '../../../services/notification-modal.service';
import { WatchlistService } from '../../../services/watchlist.service';

describe('EconomicDependentsComponent', () => {
	let component: EconomicDependentsComponent;
	let fixture: ComponentFixture<EconomicDependentsComponent>;
	let catalogService: jasmine.SpyObj<CatalogsService>;
	let notificationsService: jasmine.SpyObj<NotificationsService>;

	beforeEach(async () => {
		catalogService = jasmine.createSpyObj<CatalogsService>('CatalogsService', [
			'getRelationships',
			'getOccupations',
			'getEconomicActivity'
		]);
		notificationsService = jasmine.createSpyObj<NotificationsService>('NotificationsService', ['error']);

		catalogService.getRelationships.and.returnValue(of([{ id: '1', description: 'Padre' }] as any));
		catalogService.getOccupations.and.returnValue(of([{ id: '1', description: 'Empleado' }] as any));
		catalogService.getEconomicActivity.and.returnValue(of([
			{ id: '1', lineBusiness: 'Comercio' },
			{ id: '2', lineBusiness: 'Servicios' }
		] as any));

		await TestBed.configureTestingModule({
			imports: [ReactiveFormsModule],
			declarations: [EconomicDependentsComponent],
			providers: [
				{ provide: CatalogsService, useValue: catalogService },
				{ provide: NotificationsService, useValue: notificationsService },
				{ provide: MatDialog, useValue: {} },
				{ provide: WatchlistService, useValue: {} },
				{ provide: ModalFormService, useValue: {} },
				{ provide: NotificationModalService, useValue: {} }
			],
			schemas: [NO_ERRORS_SCHEMA]
		})
			.overrideComponent(EconomicDependentsComponent, {
				set: { template: '' }
			})
			.compileComponents();

		fixture = TestBed.createComponent(EconomicDependentsComponent);
		component = fixture.componentInstance;
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should load catalogs and patch initial data on init', () => {
		component.data = {
			relationship: 'Padre',
			occupation: 'Empleado',
			businessTurnaround: 'Comercio',
			phone: '5512345678'
		} as any;

		component.ngOnInit();

		expect(catalogService.getRelationships).toHaveBeenCalled();
		expect(catalogService.getOccupations).toHaveBeenCalledWith({ ocupationIds: [] });
		expect(catalogService.getEconomicActivity).toHaveBeenCalledWith({ lineBusinessId: [] });
		expect(component.profileForm.getRawValue()).toEqual({
			relationship: 'Padre',
			occupation: 'Empleado',
			businessTurnaround: 'Comercio',
			phone: '5512345678'
		});
		expect(component.filteredEconomicActivities().length).toBe(2);
	});

	it('should filter economic activities from the control value', () => {
		component.ngOnInit();

		component.economicActivityFilter.setValue('serv');

		expect(component.filteredEconomicActivities()).toEqual([
			{ id: '2', lineBusiness: 'Servicios' } as any
		]);
	});

	it('should return null and notify when the form is invalid', async () => {
		component.ngOnInit();

		const result = await component.sendInformation();

		expect(result).toBeNull();
		expect(notificationsService.error).toHaveBeenCalledWith('Faltan campos obligatorios por capturar');
		Object.values(component.profileForm.controls).forEach(control => {
			expect(control.touched).toBeTrue();
		});
	});

	it('should return the mapped economic dependents payload when the form is valid', async () => {
		component.ngOnInit();
		component.profileForm.setValue({
			relationship: 'Padre',
			occupation: 'Empleado',
			businessTurnaround: 'Comercio',
			phone: '5512345678'
		});

		const result = await component.sendInformation();

		expect(result).toEqual({
			relationship: 'Padre',
			occupation: 'Empleado',
			businessTurnaround: 'Comercio',
			phone: '5512345678'
		} as any);
	});

	it('should prevent non numeric keyboard input', () => {
		const event = {
			key: 'A',
			preventDefault: jasmine.createSpy('preventDefault')
		} as any as KeyboardEvent;

		component.allowNumericOnly(event);

		expect(event.preventDefault).toHaveBeenCalled();
	});
});
