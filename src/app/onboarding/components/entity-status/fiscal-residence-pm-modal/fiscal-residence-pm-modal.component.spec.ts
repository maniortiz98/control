import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';
import { FiscalResidencePmModalComponent } from './fiscal-residence-pm-modal.component';
import { NotificationsService } from '../../../../shared/services/notifications.service';
import { CatalogsService } from '../../../../shared/services/catalogs.service';
import { ERROR_MESSAGES } from '../../../constants/form-messages';

describe('FiscalResidencePmModalComponent', () => {
    let component: FiscalResidencePmModalComponent;
    let fixture: ComponentFixture<FiscalResidencePmModalComponent>;
    let dialogRef: jasmine.SpyObj<MatDialogRef<FiscalResidencePmModalComponent>>;
    let notificationsService: jasmine.SpyObj<NotificationsService>;
    let catalogsService: jasmine.SpyObj<CatalogsService>;

    let dialogData: { content?: any; registerNumber: number; isNotEditable?: boolean };

    const countriesMock = [
        { country: 'Mexico', countryId: 'MX', countryCode: '52' },
        { country: 'United States', countryId: 'US ', countryCode: '1' },
    ];

    const fiscalResidenceMock = {
        id: 'row-1',
        registerNumber: 1,
        fiscalResidence: 'Mexico',
        fiscalResidenceId: 'MX',
        ein: 'EIN-1',
        tin: 'TIN-1',
        nss: 'NSS-1',
    };

    beforeEach(async () => {
        dialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
        notificationsService = jasmine.createSpyObj('NotificationsService', ['error']);
        catalogsService = jasmine.createSpyObj('CatalogsService', ['getCountry']);
        catalogsService.getCountry.and.returnValue(of(countriesMock as any));
        dialogData = { content: null, registerNumber: 1, isNotEditable: false };

        await TestBed.configureTestingModule({
            declarations: [FiscalResidencePmModalComponent],
            imports: [ReactiveFormsModule],
            providers: [
                { provide: MAT_DIALOG_DATA, useValue: dialogData },
                { provide: MatDialogRef, useValue: dialogRef },
                { provide: NotificationsService, useValue: notificationsService },
                { provide: CatalogsService, useValue: catalogsService },
            ],
        })
            .overrideComponent(FiscalResidencePmModalComponent, {
                set: { template: '' },
            })
            .compileComponents();
    });

    afterEach(() => {
        document.body.classList.remove('show-validation');
    });

    const createComponent = (): void => {
        fixture = TestBed.createComponent(FiscalResidencePmModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    };

    it('should create and load countries on init', () => {
        createComponent();

        expect(component).toBeTruthy();
        expect(catalogsService.getCountry).toHaveBeenCalledWith({ land: [] });
        expect(component.countries()).toEqual(countriesMock as any);
    });

    it('should patch input values and disable form when modal is read only', () => {
        dialogData.content = fiscalResidenceMock;
        dialogData.isNotEditable = true;

        createComponent();

        expect(component.form.getRawValue()).toEqual({
            fiscalResidence: 'MX',
            ein: 'EIN-1',
            tin: 'TIN-1',
            nss: 'NSS-1',
        });
        expect(component.form.disabled).toBeTrue();
    });

    it('should close dialog with normalized fiscal residence payload on valid submit', () => {
        dialogData.content = fiscalResidenceMock;
        dialogData.registerNumber = 3;
        createComponent();
        component.form.patchValue({
            fiscalResidence: 'US ',
            ein: 'US-EIN',
            tin: 'US-TIN',
            nss: 'US-NSS',
        });

        component.onSubmit();

        expect(dialogRef.close).toHaveBeenCalledWith({
            id: 'row-1',
            registerNumber: 3,
            fiscalResidence: 'United States',
            fiscalResidenceId: 'US ',
            ein: 'US-EIN',
            tin: 'US-TIN',
            nss: 'US-NSS',
        });
    });

    it('should mark invalid controls and notify on invalid submit', () => {
        createComponent();

        component.onSubmit();

        expect(dialogRef.close).not.toHaveBeenCalled();
        expect(component.form.controls['fiscalResidence'].touched).toBeTrue();
        expect(document.body.classList.contains('show-validation')).toBeTrue();
        expect(notificationsService.error).toHaveBeenCalledWith(ERROR_MESSAGES.REQUIRED_FIELDS);
    });

    it('should close dialog without payload when close is called', () => {
        createComponent();

        component.close();

        expect(dialogRef.close).toHaveBeenCalledWith();
    });
});
