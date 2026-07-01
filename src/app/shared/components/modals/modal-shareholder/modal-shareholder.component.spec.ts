import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

import { ModalShareholderComponent } from './modal-shareholder.component';
import { CatalogsService } from '../../../services/catalogs.service';
import { NotificationsService } from '../../../services/notifications.service';
import { ERROR_MESSAGES } from '../../../../onboarding/constants/form-messages';

describe('ModalShareholderComponent', () => {
    let component: ModalShareholderComponent;
    let fixture: ComponentFixture<ModalShareholderComponent>;
    let dialogRef: jasmine.SpyObj<MatDialogRef<ModalShareholderComponent>>;
    let catalogsService: jasmine.SpyObj<CatalogsService>;
    let notificationsService: jasmine.SpyObj<NotificationsService>;

    const createDialogData = (overrides: Record<string, unknown> = {}) => ({
        remaining: 75,
        ...overrides,
    });

    const fillValidForm = () => {
        component.shareholderForm.patchValue({
            personType: 'PF',
            participation: 25,
            curp: 'ABCD890123HDFLRS09',
            rfc: 'ABCD890123XYZ',
            nif: 'ABC123',
            tin: 'TIN123',
            nss: 'NSS123',
            keyFiscalCountry: 'MX',
            nationality: 'MX',
            birthCountry: 'MX',
            birthEntity: 'CMX',
            firstName: 'JUAN',
            middleName: 'CARLOS',
            lastName: 'PEREZ',
            secondLastName: 'LOPEZ',
            birthDate: '1990-01-01',
            gender: 'M',
            politicallyExposed: 'NO',
            countryResidence: 'MX',
            neighborhood: 'CENTRO',
            postalCode: '01000',
            state: 'CMX',
            entity: 'CMX',
            city: 'CDMX',
            street: 'REFORMA',
            exteriorNumber: '10',
            interiorNumber: '2',
            phone: '5512345678',
            email: 'juan@example.com',
        });
    };

    const setup = async (data = createDialogData()) => {
        dialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
        catalogsService = jasmine.createSpyObj('CatalogsService', ['getCountry', 'getNationalities']);
        notificationsService = jasmine.createSpyObj('NotificationsService', ['error']);

        catalogsService.getCountry.and.returnValue(of([{ code: 'MX', name: 'Mexico' }] as any));
        catalogsService.getNationalities.and.returnValue(of([{ nationalityId: 'MX', nationality: 'Mexicana' }] as any));

        await TestBed.configureTestingModule({
            declarations: [ModalShareholderComponent],
            imports: [ReactiveFormsModule],
            providers: [
                { provide: MAT_DIALOG_DATA, useValue: data },
                { provide: MatDialogRef, useValue: dialogRef },
                { provide: MatDialog, useValue: jasmine.createSpyObj('MatDialog', ['open']) },
                { provide: CatalogsService, useValue: catalogsService },
                { provide: NotificationsService, useValue: notificationsService },
            ],
            schemas: [NO_ERRORS_SCHEMA],
        })
            .overrideComponent(ModalShareholderComponent, {
                set: { template: '' },
            })
            .compileComponents();

        fixture = TestBed.createComponent(ModalShareholderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    };

    it('should create, load catalogs and keep the current reset form state', async () => {
        await setup();

        expect(component).toBeTruthy();
        expect(catalogsService.getCountry).toHaveBeenCalled();
        expect(catalogsService.getNationalities).toHaveBeenCalled();
        expect(component.countries().length).toBe(1);
        expect(component.nationalities().length).toBe(1);
        expect(component.shareholderForm.get('participation')?.value).toBe(0);
    });

    it('should initialize edit mode and disable person type when locked', async () => {
        await setup(
            createDialogData({
                initial: { firstName: 'ANA', participation: 35 },
                lockPersonType: true,
            }),
        );

        expect(component.isEditing).toBeTrue();
        expect(component.shareholderForm.get('personType')?.disabled).toBeTrue();
    });

    it('should patch incoming data on init and normalize typeOfCompanySelected', async () => {
        await setup(
            createDialogData({
                personType: 'PM',
                typeOfCompanySelected: '0',
                firstName: 'EMPRESA',
            }),
        );

        expect(component.personType()).toBe('PM');
        expect(component.typeOfCompanySelected()).toBe('1' as any);
    });

    it('should switch validators when person type changes', async () => {
        await setup();

        const personTypeControl = component.shareholderForm.get('personType');
        const curpControl = component.shareholderForm.get('curp');
        const rfcControl = component.shareholderForm.get('rfc');

        personTypeControl?.setValue('PM');
        curpControl?.setValue('');
        rfcControl?.setValue('');
        curpControl?.updateValueAndValidity();
        rfcControl?.updateValueAndValidity();

        expect(curpControl?.hasError('required')).toBeFalse();
        expect(rfcControl?.hasError('required')).toBeTrue();
    });

    it('should uppercase the selected neighborhood', async () => {
        await setup();

        component.onItemSelectNeighborhood('del valle');

        expect(component.shareholderForm.get('neighborhood')?.value).toBe('DEL VALLE');
    });

    it('should prevent non alphanumeric keys', async () => {
        await setup();
        const event = {
            key: '#',
            preventDefault: jasmine.createSpy('preventDefault'),
        } as unknown as KeyboardEvent;

        component.allowAlphanumericOnly(event);

        expect(event.preventDefault).toHaveBeenCalled();
    });

    it('should allow alphanumeric keys', async () => {
        await setup();
        const event = {
            key: 'A',
            preventDefault: jasmine.createSpy('preventDefault'),
        } as unknown as KeyboardEvent;

        component.allowAlphanumericOnly(event);

        expect(event.preventDefault).not.toHaveBeenCalled();
    });

    it('should mark required controls when validateRequiredFields finds missing data', async () => {
        await setup();

        const result = component.validateRequiredFields();

        expect(result).toBeTrue();
        expect(component.shareholderForm.get('firstName')?.touched).toBeTrue();
    });

    it('should mark controls with invalid format', async () => {
        await setup();
        fillValidForm();
        component.shareholderForm.get('email')?.setValue('correo-invalido');

        const result = component.invalidFormatFields();

        expect(result).toBeTrue();
        expect(component.shareholderForm.get('email')?.touched).toBeTrue();
    });

    it('should detect missing dropdown selections', async () => {
        await setup();
        fillValidForm();
        component.shareholderForm.get('gender')?.setValue('');

        expect(component.invalidDropdowns()).toBeTrue();
    });

    it('should close with null on cancel', async () => {
        await setup();

        component.cancel();

        expect(dialogRef.close).toHaveBeenCalledWith(null);
    });

    it('should show missing info error when required fields are absent', async () => {
        await setup();

        await component.onSubmit();

        expect(notificationsService.error).toHaveBeenCalledWith(ERROR_MESSAGES.MISSING_INFO);
        expect(dialogRef.close).not.toHaveBeenCalled();
    });

    it('should show incorrect format error when a field format is invalid', async () => {
        await setup();
        fillValidForm();
        component.shareholderForm.get('email')?.setValue('correo-invalido');

        await component.onSubmit();

        expect(notificationsService.error).toHaveBeenCalledWith(ERROR_MESSAGES.INCORRECT_FORMAT);
        expect(dialogRef.close).not.toHaveBeenCalled();
    });

    it('should show dropdown error when submit reaches the select validation branch', async () => {
        await setup();
        spyOn(component, 'validateRequiredFields').and.returnValue(false);
        spyOn(component, 'invalidFormatFields').and.returnValue(false);
        spyOn(component, 'invalidDropdowns').and.returnValue(true);

        await component.onSubmit();

        expect(notificationsService.error).toHaveBeenCalledWith(
            'Debe seleccionar todas las opciones requeridas.',
        );
        expect(dialogRef.close).not.toHaveBeenCalled();
    });

    it('should close with assembled result when the form is valid', async () => {
        await setup();
        fillValidForm();

        await component.onSubmit();

        expect(dialogRef.close).toHaveBeenCalledWith(
            jasmine.objectContaining({
                ok: true,
                edit: false,
                data: jasmine.objectContaining({
                    shareholderData: jasmine.objectContaining({
                        firstName: 'JUAN',
                        participation: 25,
                    }),
                }),
                table: jasmine.objectContaining({
                    firstName: 'JUAN',
                    email: 'juan@example.com',
                    participation: 25,
                }),
            }),
        );
    });
});
