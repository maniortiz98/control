import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';

import { SocietiesAndAssociationsComponent } from './societies-and-associations.component';
import { CatalogsService } from '../../../services/catalogs.service';
import { NotificationsService } from '../../../services/notifications.service';
import { ModalFormService } from '../../../services/modal-form.service';
import { NotificationModalService } from '../../../services/notification-modal.service';
import { WatchlistService } from '../../../services/watchlist.service';

describe('SocietiesAndAssociationsComponent', () => {
	let component: SocietiesAndAssociationsComponent;
	let fixture: ComponentFixture<SocietiesAndAssociationsComponent>;
	let catalogService: jasmine.SpyObj<CatalogsService>;
	let notificationsService: jasmine.SpyObj<NotificationsService>;

	beforeEach(async () => {
		catalogService = jasmine.createSpyObj<CatalogsService>('CatalogsService', ['getEconomicActivity', 'getNationalities']);
		notificationsService = jasmine.createSpyObj<NotificationsService>('NotificationsService', ['error']);

		catalogService.getEconomicActivity.and.returnValue(of([
			{ id: '1', lineBusiness: 'Comercio' },
			{ id: '2', lineBusiness: 'Servicios' }
		] as any));
		catalogService.getNationalities.and.returnValue(of([{ id: 'MX', nationality: 'Mexicana' }] as any));

		await TestBed.configureTestingModule({
			imports: [ReactiveFormsModule],
			declarations: [SocietiesAndAssociationsComponent],
			providers: [
				{ provide: NotificationsService, useValue: notificationsService },
				{ provide: CatalogsService, useValue: catalogService },
				{ provide: MatDialog, useValue: {} },
				{ provide: ModalFormService, useValue: {} },
				{ provide: NotificationModalService, useValue: {} },
				{ provide: WatchlistService, useValue: {} }
			],
			schemas: [NO_ERRORS_SCHEMA]
		})
			.overrideComponent(SocietiesAndAssociationsComponent, {
				set: { template: '' }
			})
			.compileComponents();

		fixture = TestBed.createComponent(SocietiesAndAssociationsComponent);
		component = fixture.componentInstance;
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should load catalogs and patch input data in uppercase', () => {
		component.data = {
			rfc: 'ABC123',
			companyName: 'empresa',
			commercialBusiness: 'comercio',
			administratorManagerAttorney: 'apoderado',
			phone: '5512345678',
			economicActivity: 'servicios',
			nationality: 'mexicana'
		} as any;

		component.ngOnInit();

		expect(component.profileForm.getRawValue()).toEqual({
			rfc: 'ABC123',
			companyName: 'EMPRESA',
			commercialBusiness: 'COMERCIO',
			administratorManagerAttorney: 'APODERADO',
			phone: '5512345678',
			economicActivity: 'SERVICIOS',
			nationality: 'MEXICANA'
		});
		expect(component.filteredEconomicActivities().length).toBe(2);
	});

	it('should filter economic activity options from the text control', () => {
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
	});

	it('should return the societies payload when the form is valid', async () => {
		component.ngOnInit();
		component.profileForm.setValue({
			rfc: 'ABC123',
			companyName: 'EMPRESA',
			commercialBusiness: 'COMERCIO',
			administratorManagerAttorney: 'APODERADO',
			phone: '5512345678',
			economicActivity: 'SERVICIOS',
			nationality: 'MEXICANA'
		});

		const result = await component.sendInformation();

		expect(result).toEqual(component.profileForm.getRawValue() as any);
	});

	it('should prevent non numeric input in allowNumericOnly', () => {
		const event = {
			key: 'x',
			preventDefault: jasmine.createSpy('preventDefault')
		} as any as KeyboardEvent;

		component.allowNumericOnly(event);

		expect(event.preventDefault).toHaveBeenCalled();
	});
});
