import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { LegalPowerSectionComponent } from './legal-power-section.component';
import { NotificationsService } from '../../../services/notifications.service';
import { ERROR_MESSAGES } from '../../../../onboarding/constants/form-messages';

describe('LegalPowerSectionComponent', () => {
	let component: LegalPowerSectionComponent;
	let fixture: ComponentFixture<LegalPowerSectionComponent>;
	let notificationsService: jasmine.SpyObj<NotificationsService>;

	const mockLegalPower = {
		id: 9,
		adminitration: true,
		domain: false,
		powerToDelegate: false,
		creditTitles: false,
		powerToOpenAccount: false,
		writingNumber: '123',
		writingDate: '2026-05-28',
		writingNotaryName: 'Notario',
		notaryNumber: '456',
		protocalizationPlace: 'Ciudad',
		powerLimitations: 'Ninguna'
	};

	beforeEach(async () => {
		notificationsService = jasmine.createSpyObj<NotificationsService>('NotificationsService', ['error']);

		await TestBed.configureTestingModule({
			imports: [ReactiveFormsModule],
			declarations: [LegalPowerSectionComponent],
			providers: [
				{ provide: NotificationsService, useValue: notificationsService }
			],
			schemas: [NO_ERRORS_SCHEMA]
		})
			.overrideComponent(LegalPowerSectionComponent, {
				set: { template: '' }
			})
			.compileComponents();

		fixture = TestBed.createComponent(LegalPowerSectionComponent);
		component = fixture.componentInstance;
		component.legalPowerSaved = (() => mockLegalPower) as any;
		component.ngAfterViewInit();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should load initial data after view init', () => {
		expect(component.form.getRawValue()).toEqual({
			adminitration: true,
			domain: false,
			powerToDelegate: false,
			creditTitles: false,
			powerToOpenAccount: false,
			writingNumber: '123',
			writingDate: '2026-05-28',
			writingNotaryName: 'Notario',
			notaryNumber: '456',
			protocalizationPlace: 'Ciudad',
			powerLimitations: 'Ninguna'
		});
	});

	it('should return the legal power payload when form is valid and one power is selected', () => {
		const result = component.onSubmit();

		expect(result).toEqual(mockLegalPower as any);
		expect(notificationsService.error).not.toHaveBeenCalled();
	});

	it('should reject submission when no legal power option is selected', () => {
		component.form.patchValue({
			adminitration: false,
			domain: false,
			powerToDelegate: false,
			creditTitles: false,
			powerToOpenAccount: false
		});

		const result = component.onSubmit();

		expect(result).toBeNull();
		expect(notificationsService.error).toHaveBeenCalledWith(ERROR_MESSAGES.AT_LEAST_ONE_POWER_REQUIRED);
	});

	it('should reject invalid form submissions and mark invalid controls as touched', () => {
		component.form.get('writingNumber')?.setValue('');

		const result = component.onSubmit();

		expect(result).toBeNull();
		expect(component.form.get('writingNumber')?.touched).toBeTrue();
		expect(notificationsService.error).toHaveBeenCalledWith(ERROR_MESSAGES.REQUIRED_FIELDS);
	});

	it('should patch data when chargeInitialData receives content', () => {
		component.form.reset();

		component.chargeInitialData(mockLegalPower as any);

		expect(component.form.get('writingNotaryName')?.value).toBe('Notario');
		expect(component.form.get('protocalizationPlace')?.value).toBe('Ciudad');
	});

	it('should select the date in the picker on valid date input', () => {
		const selectSpy = jasmine.createSpy('select');
		component.pickerBirthdate = { select: selectSpy } as any;
		const date = new Date('2026-05-28');

		component.onDateInput({ value: date } as any);

		expect(selectSpy).toHaveBeenCalledWith(date);
	});
});
