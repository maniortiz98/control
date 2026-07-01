import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ControlPersonModalComponent } from './control-person-modal.component';
import { NotificationsService } from '../../../../shared/services/notifications.service';
import { CatalogsService } from '../../../../shared/services/catalogs.service';
import { of } from 'rxjs';
import { ERROR_MESSAGES } from '../../../constants/form-messages';

describe('ControlPersonModalComponent', () => {
    let component: ControlPersonModalComponent;
    let fixture: ComponentFixture<ControlPersonModalComponent>;
    let dialogRef: jasmine.SpyObj<MatDialogRef<ControlPersonModalComponent>>;
    let notificationsService: jasmine.SpyObj<NotificationsService>;
    let catalogsService: jasmine.SpyObj<CatalogsService>;

    let dialogData: { content?: any; isNotEditable?: boolean };

    const countriesMock = [
        { country: 'Mexico', countryId: 'MX', countryCode: '52' },
        { country: 'United States', countryId: 'US', countryCode: '1' },
    ];

    const statesMock = [{ entityId: 'CMX', name: 'Ciudad de Mexico' }];

    const personMock: any = {
        curp: 'CURP123456',
        firstName: 'Juan',
        secondName: 'Carlos',
        firstLastName: 'Perez',
        secondLastName: 'Lopez',
        birthday: new Date(1990, 0, 15),
        birthCountry: 'Mexico',
        birthFederativeEntity: 'Ciudad de Mexico',
        fullName: 'Juan Carlos Perez Lopez',
        email: 'juan@example.com',
        phone: '5555555555',
        country: 'Mexico',
        postalCode: '01000',
        nationalityName: '',
        nationalityId: '',
        dateOfBirth: '1990-01-15',
        countryOfBirth: 'Mexico',
        stateOfBirth: 'Ciudad de Mexico',
        nationality: 'MX',
    };

    beforeEach(async () => {
        dialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
        notificationsService = jasmine.createSpyObj('NotificationsService', ['error']);
        catalogsService = jasmine.createSpyObj('CatalogsService', ['getCountry', 'getFederalEntity']);
        catalogsService.getCountry.and.returnValue(of(countriesMock as any));
        catalogsService.getFederalEntity.and.returnValue(of(statesMock as any));
        dialogData = { content: null, isNotEditable: false };

        await TestBed.configureTestingModule({
            declarations: [ControlPersonModalComponent],
            imports: [ReactiveFormsModule],
            providers: [
                { provide: MAT_DIALOG_DATA, useValue: dialogData },
                { provide: MatDialogRef, useValue: dialogRef },
                { provide: NotificationsService, useValue: notificationsService },
                { provide: CatalogsService, useValue: catalogsService },
            ],
        })
            .overrideComponent(ControlPersonModalComponent, {
                set: { template: '' },
            })
            .compileComponents();
    });

    afterEach(() => {
        document.body.classList.remove('show-validation');
    });

    const createComponent = (): void => {
        fixture = TestBed.createComponent(ControlPersonModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    };

    it('should create and load catalogs on init', () => {
        createComponent();

        expect(component).toBeTruthy();
        expect(catalogsService.getCountry).toHaveBeenCalledWith({ land: [] });
        expect(catalogsService.getFederalEntity).toHaveBeenCalledWith({ land1s: ['MX'] });
        expect(component.personColumns.length).toBe(5);
        expect(component.countries()).toEqual(countriesMock as any);
    });

    it('should initialize person data and disable form when modal is read only', () => {
        dialogData.content = [personMock];
        dialogData.isNotEditable = true;

        createComponent();

        expect(component.personData()).toEqual([personMock]);
        expect(component.form.disabled).toBeTrue();
    });

    it('should patch selected person information on eventSelectPerson', () => {
        createComponent();

        component.eventSelectPerson({ row: personMock });

        expect(component.selectedPerson).toEqual(jasmine.objectContaining({
            curp: 'CURP123456',
            nationalityId: 'MX',
            nationalityName: 'Mexico',
        }));
        expect(component.countryOfBirth).toBe('Mexico');
        expect(component.form.getRawValue()).toEqual(jasmine.objectContaining({
            curp: 'CURP123456',
            firstName: 'Juan',
            firstLastName: 'Perez',
            birthCountry: 'Mexico',
            birthFederativeEntity: 'Ciudad de Mexico',
        }));
    });

    it('should close dialog with selected person payload on valid submit', () => {
        createComponent();
        component.selectedPerson = { ...personMock };
        component.form.patchValue({ personType: 'Administrador que ejerce el control' });

        component.onSubmit();

        expect(dialogRef.close).toHaveBeenCalledWith(jasmine.objectContaining({
            personType: 'Administrador que ejerce el control',
            firstName: 'Juan',
            firstLastName: 'Perez',
        }));
    });

    it('should notify when submit is valid but no person was selected', () => {
        createComponent();
        component.form.patchValue({ personType: 'Otro' });

        component.onSubmit();

        expect(dialogRef.close).not.toHaveBeenCalled();
        expect(notificationsService.error).toHaveBeenCalledWith(ERROR_MESSAGES.AT_LEAST_ONE_OPTION_IS_REQUIRED);
    });

    it('should mark invalid controls and notify on invalid submit', () => {
        createComponent();

        component.onSubmit();

        expect(dialogRef.close).not.toHaveBeenCalled();
        expect(component.form.controls['personType'].touched).toBeTrue();
        expect(document.body.classList.contains('show-validation')).toBeTrue();
        expect(notificationsService.error).toHaveBeenCalledWith(ERROR_MESSAGES.REQUIRED_FIELDS);
    });

    it('should close dialog without payload when close is called', () => {
        createComponent();

        component.close();

        expect(dialogRef.close).toHaveBeenCalledWith();
    });

    it('should parse dates in yyyy-mm-dd format', () => {
        createComponent();

        const result = component.parseDate('2024-12-05');

        expect(result.getFullYear()).toBe(2024);
        expect(result.getMonth()).toBe(11);
        expect(result.getDate()).toBe(5);
    });
});
