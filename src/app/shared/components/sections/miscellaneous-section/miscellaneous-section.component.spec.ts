import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';

import { MiscellaneousSectionComponent } from './miscellaneous-section.component';
import { NotificationsService } from '../../../services/notifications.service';
import { CatalogsService } from '../../../services/catalogs.service';
import { ERROR_MESSAGES } from '../../../../onboarding/constants/form-messages';

describe('MiscellaneousSectionComponent', () => {
	let component: MiscellaneousSectionComponent;
	let fixture: ComponentFixture<MiscellaneousSectionComponent>;
	let notificationsService: jasmine.SpyObj<NotificationsService>;
	let catalogsService: jasmine.SpyObj<CatalogsService>;

	beforeEach(async () => {
		notificationsService = jasmine.createSpyObj<NotificationsService>('NotificationsService', ['error']);
		catalogsService = jasmine.createSpyObj<CatalogsService>('CatalogsService', [
			'getEconomicActivity',
			'getOccupations',
			'getCountry',
			'getIdentificationType',
			'getRelationships'
		]);

		catalogsService.getEconomicActivity.and.returnValue(of([{ id: '1', lineBusiness: 'Comercio' }] as any));
		catalogsService.getOccupations.and.returnValue(of([{ id: '1', description: 'Empleado' }] as any));
		catalogsService.getCountry.and.returnValue(of([{ countryId: 'MX', country: 'Mexico' }] as any));
		catalogsService.getIdentificationType.and.returnValue(of([{ id: '1', description: 'INE' }] as any));
		catalogsService.getRelationships.and.returnValue(of([{ id: '1', description: 'Titular' }] as any));

		await TestBed.configureTestingModule({
			imports: [ReactiveFormsModule],
			declarations: [MiscellaneousSectionComponent],
			providers: [
				{ provide: NotificationsService, useValue: notificationsService },
				{ provide: CatalogsService, useValue: catalogsService }
			],
			schemas: [NO_ERRORS_SCHEMA]
		})
			.overrideComponent(MiscellaneousSectionComponent, {
				set: { template: '' }
			})
			.compileComponents();

		fixture = TestBed.createComponent(MiscellaneousSectionComponent);
		component = fixture.componentInstance;
		component.initialData = (() => null) as any;
		component.hasTaxSection = (() => true) as any;
		component.hasFiscalCountry = (() => false) as any;
		component.hasRelacionship = (() => true) as any;
		component.signatureClass = (() => true) as any;
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should load catalogs and keep economic activities filtered on init', () => {
		component.ngOnInit();

		expect(catalogsService.getEconomicActivity).toHaveBeenCalled();
		expect(catalogsService.getOccupations).toHaveBeenCalledWith({ ocupationIds: [] });
		expect(component.filteredEconomicActivities()).toEqual([{ id: '1', lineBusiness: 'Comercio' }] as any);
	});

	it('should clear tax validators when hasTaxSection is false and require fiscalCountry when enabled', () => {
		component.hasTaxSection = (() => false) as any;
		component.hasFiscalCountry = (() => true) as any;

		component.ngOnInit();

		expect(component.form.get('ipabTitularityPercent')?.validator).toBeNull();
		expect(component.form.get('retentionIsr')?.validator).toBeNull();
		expect(component.form.get('fiscalCountry')?.hasError('required')).toBeTrue();
	});

	it('should patch initial data and disable signClass when signatureClass is false', () => {
		component.signatureClass = (() => false) as any;
		component.hasRelacionship = (() => false) as any;

		component.chargeInitialData({
			relationship: 'REL',
			economicActivity: 'EA',
			occupation: 'OCC',
			profession: 'PROF',
			workCompany: 'COMP',
			positionHeld: 'POS',
			phoneBusiness: '123',
			fiscalCountry: 'MX',
			ipabTitularityPercent: 10,
			retentionIsr: 5,
			signClass: 'B'
		} as any);

		expect(component.form.get('relationship')?.value).toBe('');
		expect(component.form.get('signClass')?.value).toBe('A');
		expect(component.form.get('signClass')?.disabled).toBeTrue();
	});

	it('should return payload when the form is valid', () => {
		component.form.patchValue({
			relationship: 'REL1',
			economicActivity: 'EA1',
			occupation: 'OCC1',
			profession: 'PROF',
			workCompany: 'COMP',
			positionHeld: 'POS',
			phoneBusiness: '123',
			fiscalCountry: 'MX',
			ipabTitularityPercent: 50,
			retentionIsr: 30,
			signClass: 'A'
		});

		const result = component.onSubmit();

		expect(result).toEqual(jasmine.objectContaining({
			relationship: 'REL1',
			economicActivity: 'EA1',
			occupation: 'OCC1'
		}));
	});

	it('should return null and notify when the form is invalid', () => {
		const result = component.onSubmit();

		expect(result).toBeNull();
		expect(notificationsService.error).toHaveBeenCalledWith(ERROR_MESSAGES.MISSING_INFO);
	});

	it('should reject invalid IPAB percentages when tax section is enabled', () => {
		component.form.patchValue({
			relationship: 'REL1',
			economicActivity: 'EA1',
			occupation: 'OCC1',
			fiscalCountry: 'MX',
			ipabTitularityPercent: 101,
			retentionIsr: 30,
			signClass: 'A'
		});

		const result = component.onSubmit();

		expect(result).toBeNull();
		expect(notificationsService.error).toHaveBeenCalledWith('El porcentaje del Cotitular en IPAB debe ser menor al 100%');
	});

	it('should filter economic activities from the text control', () => {
		component.ngOnInit();

		component.economicActivityFilter.setValue('come');

		expect(component.filteredEconomicActivities()).toEqual([{ id: '1', lineBusiness: 'Comercio' }] as any);
	});

	it('should strip non numeric characters in onlyNumbers', () => {
		const input = { value: 'abc123' } as HTMLInputElement;

		component.onlyNumbers({ target: input } as any);

		expect(input.value).toBe('123');
	});

	it('should block non alphanumeric characters', () => {
		const event = {
			key: '#',
			preventDefault: jasmine.createSpy('preventDefault')
		} as any as KeyboardEvent;

		component.allowAlphanumericOnly(event);

		expect(event.preventDefault).toHaveBeenCalled();
	});
});
