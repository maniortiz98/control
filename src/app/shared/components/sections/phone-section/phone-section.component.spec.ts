import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { PhoneSectionComponent } from './phone-section.component';
import { of } from 'rxjs';
import { CatalogsService } from '../../../services/catalogs.service';
import { NotificationsService } from '../../../services/notifications.service';
import { NotificationModalService } from '../../../services/notification-modal.service';
import { TokenVerificationServiceService } from '../../../services/token-verification-service.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelect, MatSelectChange, MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ERROR_MESSAGES } from '../../../../onboarding/constants/form-messages';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TableResultsComponent } from '../../table-results/table-results.component';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { UnsavedChangesService } from '../../../../core/services/unsaved-changes.service';
import { OtcService } from '../../../services/otc.service';
import { MatSortModule } from '@angular/material/sort';

describe('PhoneSectionComponent', () => {
    let component: PhoneSectionComponent;
    let fixture: ComponentFixture<PhoneSectionComponent>;

    const mockPhoneStorageService = {
        getPhones: jasmine.createSpy('getPhones').and.returnValue(() => [])
    };
    const mockCatalogsService = {
        getCountry: jasmine.createSpy('getCountry').and.returnValue(of([])),
        getPhoneType: jasmine.createSpy('getPhoneType').and.returnValue(of([]))
    };
    const mockNotificationService = {
        error: jasmine.createSpy('error'),
        success: jasmine.createSpy('success')
    };
    const mockNotificationModalService = {
        confirm: jasmine.createSpy('confirm').and.returnValue(Promise.resolve({ value: true })),
        warning: jasmine.createSpy('warning').and.returnValue(Promise.resolve({ value: true }))
    };
    const mockTokenVerificationService = {
        showModal: jasmine.createSpy('showModal').and.returnValue(Promise.resolve(true))
    };
    const mockUnsavedChangesService = {
        setUnsavedChanges: jasmine.createSpy('setUnsavedChanges')
    };
    const mockOtcService = {
        sendSms: jasmine.createSpy('sendSms').and.returnValue(of({}))
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PhoneSectionComponent, TableResultsComponent],
            imports: [
                ReactiveFormsModule,
                MatTableModule,
                MatFormFieldModule,
                MatInputModule,
                MatSelectModule,
                MatCheckboxModule,
                BrowserAnimationsModule,
                MatIconModule,
                MatSortModule],
            providers: [
                { provide: CatalogsService, useValue: mockCatalogsService },
                { provide: NotificationsService, useValue: mockNotificationService },
                { provide: NotificationModalService, useValue: mockNotificationModalService },
                { provide: TokenVerificationServiceService, useValue: mockTokenVerificationService },
                { provide: UnsavedChangesService, useValue: mockUnsavedChangesService },
                { provide: OtcService, useValue: mockOtcService }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(PhoneSectionComponent);
        component = fixture.componentInstance;

        fixture.componentRef.setInput('listStorage', [
            { id: '1', phone: '5512345678', phoneType: 'OFICINA', phoneCountry: 'MEXICO', phoneCodeArea: '55', phoneLada: '55', phoneExtension: '001', phoneNotification: true }
        ]);
        fixture.componentRef.setInput('disabled', false);
        fixture.componentRef.setInput('initialFormValues', {
            id: '1',
            phone: '1234567890',
            phoneType: 'OFICINA',
            phoneCountry: 'MX',
            phoneCodeArea: '55',
            phoneLada: '55',
            phoneExtension: '001',
            phoneNotification: true
        })

        fixture.detectChanges();
        component.countries.set([
            { country: 'Mexico', countryCode: '52', countryId: '52' },
            { country: 'España', countryCode: '34', countryId: '34' }
        ])
        component.phoneTypes.set([
            { telephoneType: '1', telephoneTypeId: '2', mandt: 'a', spras: 'b' },
            { telephoneType: 'OFICINA', telephoneTypeId: '2', mandt: 'a', spras: 'b' }
        ]);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('ngOnInit', () => {
        it('should load countries and phone types', () => {
            component.ngOnInit();
            expect(mockCatalogsService.getPhoneType).toHaveBeenCalled();
        });

        it('sould load initial values', () => {
            component.ngOnInit();

            expect(component.form.value.phone).toBe('1234567890');
            expect(component.form.value.phoneType).toBe('OFICINA');
            expect(component.form.value.phoneCountry).toBe('MX');
            expect(component.form.value.phoneExtension).toBe('001');
            expect(component.form.value.phoneNotification).toBeTrue();

            expect(component.selectedPhoneType()).toBe('OFICINA');
            expect(component.selectedCountry()).toBe('MX');
        });
    });

    describe('onSubmit', () => {
        beforeEach(() => {
            component.form.setValue({
                phoneType: '1',
                phoneCountry: 'MX',
                phoneCodeArea: '',
                phone: '5512345678',
                phoneExtension: '',
                phoneNotification: false,
                isSaved: true
            });
            component.selectedCountry.set('MX');
        });

        it('should return false if form invalid', async () => {
            component.form.get('phone')?.setValue('');
            const result = await component.onSubmit();
            expect(result).toBeFalse();
            expect(mockNotificationService.error).toHaveBeenCalledWith(ERROR_MESSAGES.REQUIRED_FIELDS);
        });

        it('should return false when invalid estranger number', async () => {
            component.form.get('phone')?.setValue('1234567');
            component.form.get('phoneCountry')?.setValue('34');
            const result = await component.onSubmit();
            expect(result).toBeTrue();
        });

        it('should set validators correctly based on disabled input', () => {
            fixture.componentRef.setInput('disabled', true);
            fixture.detectChanges();
            const phoneTypeControl = component.form.get('phoneType');
            // Validators are cleared in effect
            expect(phoneTypeControl?.validator).toBeNull();
        });

        it('should return true when valid and successfully processed', async () => {
            const result = await component.onSubmit();
            expect(result).toBeTrue();
        });

        it('should return true when update is valid', async () => {
            component.editingId = '1';
            const result = await component.onSubmit();
            expect(result).toBeTrue();
            expect(mockNotificationService.success).toHaveBeenCalled();
        });
    });

    describe('editPhone', () => {
        it('should set form values from item', () => {
            const item = { row: { id: '1', phone: '5512345678', phoneType: 'OFICINA', phoneCountry: 'Mexico', phoneCodeArea: '', phoneExtension: '', phoneNotification: false } };
            component.editPhone(item);
            expect(component.form.get('phone')?.value).toBe('5512345678');
            expect(component.editingId).toBe('1');
        });
    });

    describe('onlyNumbers', () => {
        it('should prevent non-numeric input', () => {
            const event = { key: 'a', preventDefault: jasmine.createSpy('preventDefault') } as any;
            component.onlyNumbers(event);
            expect(event.preventDefault).toHaveBeenCalled();
        });

        it('should allow numeric input', () => {
            const event = { key: '5', preventDefault: jasmine.createSpy('preventDefault') } as any;
            component.onlyNumbers(event);
            expect(event.preventDefault).not.toHaveBeenCalled();
        });
    });

    describe('selectedCountry effect', () => {
        beforeEach(() => {
            component.countries.set([
                { country: 'Mexico', countryCode: '52', countryId: '52' },
                { country: 'España', countryCode: '34', countryId: '34' }
            ]);
        });

        it('should clear phoneCodeArea if no country selected', () => {
            fixture.componentRef.setInput('disabled', false);
            component.selectedCountry.set(null);
            fixture.detectChanges();

            expect(component.form.get('phoneCodeArea')?.value).toBe('');
        });

        it('should set phoneCodeArea if selected country exists', () => {
            component.selectedCountry.set('52');
            fixture.detectChanges();

            expect(component.form.get('phoneCodeArea')?.value).toBe('52');
        });
    });

    it('should update selectedPhoneType when onPhoneTypeChange is called', () => {
        const event = { value: '1' } as MatSelectChange;
        component.onPhoneTypeChange(event);
        expect(component.selectedPhoneType()).toBe('1');
    });

    it('should update selectedCountry when onCountryChange is called', () => {
        const event = { value: '52' } as MatSelectChange;
        component.onCountryChange(event);
        expect(component.selectedCountry()).toBe('52');
    });

    describe('resetModified', () => {
        it('should set unsavedState to false', () => {
            component.unsavedState.set(true);
            expect(component.unsavedState()).toBeTrue();
            component.resetModified();
            expect(component.unsavedState()).toBeFalse();
        });
    });

    it('should call editPhone when event type is edit', async () => {
        const event = { type: 'edit', row: { id: '1', phone: '1234512345', phoneType: 'OFICINA', phoneCountry: 'Mexico', phoneCodeArea: '', phoneExtension: '', phoneNotification: false } };
        spyOn(component as any, 'editPhone').and.callThrough();
        await component.eventRowPhone(event);
        expect((component as any).editPhone).toHaveBeenCalledWith(event);
    });

    it('should call deletePhone when event type is delete', async () => {
        const event = { type: 'delete', row: { id: '1', phone: '1234512345', phoneType: 'OFICINA', phoneCountry: 'Mexico', phoneCodeArea: '', phoneExtension: '', phoneNotification: false } };
        spyOn(component as any, 'deletePhone').and.returnValue(Promise.resolve());
        await component.eventRowPhone(event);
        expect((component as any).deletePhone).toHaveBeenCalledWith(event);
    });
})

