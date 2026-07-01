import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';

import { CustomerIdentificationPmComponent } from './customer-identification-pm.component';
import { UnsavedChangesService } from '../../../../core/services/unsaved-changes.service';
import { CatalogsService } from '../../../services/catalogs.service';
import { NotificationsService } from '../../../services/notifications.service';
import { WatchlistService } from '../../../services/watchlist.service';
import { HomonymsService } from '../../../services/homonyms.service';
import { NotificationModalService } from '../../../services/notification-modal.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalHomonymsPmServiceService } from '../../../services/modal-homonyms-pm-service.service';
import { HomonymsPmService } from '../../../services/homonyms-pm.service';
import { STRINGS } from '../../../../onboarding/constants/constants';

describe('CustomerIdentificationPmComponent', () => {
	let component: CustomerIdentificationPmComponent;
	let fixture: ComponentFixture<CustomerIdentificationPmComponent>;
	let catalogsService: jasmine.SpyObj<CatalogsService>;
	let notificationsService: jasmine.SpyObj<NotificationsService>;
	let watchlistService: jasmine.SpyObj<WatchlistService>;
	let homonymsService: jasmine.SpyObj<HomonymsService>;

	beforeEach(async () => {
		catalogsService = jasmine.createSpyObj<CatalogsService>('CatalogsService', ['getNationalities']);
		notificationsService = jasmine.createSpyObj<NotificationsService>('NotificationsService', ['error']);
		watchlistService = jasmine.createSpyObj<WatchlistService>('WatchlistService', ['postData']);
		homonymsService = jasmine.createSpyObj<HomonymsService>('HomonymsService', ['postHomonyms', 'setData']);

		catalogsService.getNationalities.and.returnValue(of([{ land: 'MX', nationality: STRINGS.MEXICAN }] as any));
		watchlistService.postData.and.returnValue(of({ step: 3, matchLists: [] } as any));
		homonymsService.postHomonyms.and.returnValue(of([] as any));

		await TestBed.configureTestingModule({
			imports: [ReactiveFormsModule],
			declarations: [CustomerIdentificationPmComponent],
			providers: [
				{ provide: UnsavedChangesService, useValue: { setUnsavedChanges: jasmine.createSpy('setUnsavedChanges') } },
				{ provide: CatalogsService, useValue: catalogsService },
				{ provide: NotificationsService, useValue: notificationsService },
				{ provide: WatchlistService, useValue: watchlistService },
				{ provide: HomonymsService, useValue: homonymsService },
				{ provide: NotificationModalService, useValue: { error: jasmine.createSpy('error'), warning: jasmine.createSpy('warning'), success: jasmine.createSpy('success') } },
				{ provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } },
				{ provide: ActivatedRoute, useValue: { parent: {} } },
				{ provide: ModalHomonymsPmServiceService, useValue: { formModalHomonyms: jasmine.createSpy('formModalHomonyms').and.returnValue(Promise.resolve('continue')) } },
				{ provide: HomonymsPmService, useValue: { homonimiaModal: jasmine.createSpy('homonimiaModal').and.returnValue(of(true)) } }
			],
			schemas: [NO_ERRORS_SCHEMA]
		})
			.overrideComponent(CustomerIdentificationPmComponent, {
				set: { template: '' }
			})
			.compileComponents();

		fixture = TestBed.createComponent(CustomerIdentificationPmComponent);
		component = fixture.componentInstance;
	});

	it('should create and load nationalities on init', () => {
		component.ngOnInit();

		expect(component).toBeTruthy();
		expect(catalogsService.getNationalities).toHaveBeenCalledWith({ land: [] });
		expect(component.nationalities().length).toBe(1);
	});

	it('should patch initial data on init', () => {
		component.data = {
			nationality: STRINGS.USA,
			typeIden: '5',
			rfc: 'ABCD123456EFG',
			date: '2026-01-01',
			businessName: 'Empresa'
		} as any;

		component.ngOnInit();

		expect(component.profileForm.getRawValue()).toEqual({
			nationality: STRINGS.USA,
			typeIden: '5',
			rfc: 'ABCD123456EFG',
			date: '2026-01-01',
			businessName: 'Empresa'
		});
		expect(component.date()).toBeTrue();
	});

	it('should configure date and type identification by nationality', () => {
		component.onItemSelectNationType(STRINGS.MEXICAN);
		expect(component.profileForm.get('typeIden')?.value).toBe('1');
		expect(component.date()).toBeFalse();

		component.onItemSelectNationType(STRINGS.USA);
		expect(component.profileForm.get('typeIden')?.value).toBe('5');
		expect(component.date()).toBeTrue();
	});

	it('should prevent non alphanumeric characters', () => {
		const event = { key: '#', preventDefault: jasmine.createSpy('preventDefault') } as any as KeyboardEvent;

		component.allowAlphanumericOnly(event);

		expect(event.preventDefault).toHaveBeenCalled();
	});

	it('should mark RFC invalid when fiscal id does not match the selected type', () => {
		const result = component.validFiscalId('1', 'BAD');

		expect(result).toBeFalse();
		expect(component.profileForm.get('rfc')?.hasError('invalidFormat')).toBeTrue();
	});

	it('should return null from onSubmit when the form is invalid', () => {
		const result = component.onSubmit();

		expect(result).toBeNull();
		expect(notificationsService.error).toHaveBeenCalledWith('Se Detectó Información sin Capturar');
	});

	it('should return null from onSubmit when fiscal id is invalid', () => {
		component.profileForm.patchValue({
			nationality: STRINGS.MEXICAN,
			typeIden: '1',
			rfc: 'BAD',
			date: '',
			businessName: 'Empresa'
		});

		const result = component.onSubmit();

		expect(result).toBeNull();
		expect(notificationsService.error).toHaveBeenCalledWith('Tienes Campos Capturados con Formato Incorrecto');
	});

	it('should resolve validWlAndHomo returning the current client when watchlist and homonyms allow it', async () => {
		const client = {
			nationality: STRINGS.MEXICAN,
			typeIden: '1',
			rfc: 'ABC010203DEF',
			date: '',
			businessName: 'EMPRESA SA'
		} as any;
		component.profileForm.patchValue(client);

		const result = await component.validWlAndHomo(client);

		expect(watchlistService.postData).toHaveBeenCalled();
		expect(homonymsService.postHomonyms).toHaveBeenCalled();
		expect(result).toEqual(client);
	});

	it('should expose client form values and watchlist match types', () => {
		component.profileForm.patchValue({
			nationality: STRINGS.MEXICAN,
			typeIden: '1',
			rfc: 'ABC010203DEF',
			date: '',
			businessName: 'EMPRESA SA'
		});

		expect(component.client()).toEqual(component.profileForm.getRawValue() as any);
		expect(component.getListValues({ matchLists: [{ type: 'WATCH' }, { type: 'PEP' }] } as any)).toEqual(['WATCH', 'PEP']);
	});
});
