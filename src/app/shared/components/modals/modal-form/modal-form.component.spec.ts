import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';

import { ModalFormComponent } from './modal-form.component';
import { CatalogsService } from '../../../services/catalogs.service';
import { OnboardingService } from '../../../../onboarding/services/onboarding.service';
import { SearchClientFlowService } from '../../../services/search-client-flow.service';

describe('ModalFormComponent', () => {
    let component: ModalFormComponent;
    let fixture: ComponentFixture<ModalFormComponent>;
    let dialogRef: jasmine.SpyObj<MatDialogRef<ModalFormComponent>>;
    let catalogsService: jasmine.SpyObj<CatalogsService>;
    let onboardingService: jasmine.SpyObj<OnboardingService>;
    let searchClientFlowService: jasmine.SpyObj<SearchClientFlowService>;

    const mockClientData = {
        clientNumber: '12345',
        countryOfBirth: 'MX',
        curp: 'ABCD900101HDFRRL09',
    };

    const mockAddress = {
        country: 'MX',
        city: 'CDMX',
    };

    const mockPositionHeld = {
        relationship: 'PADRE',
        positionHeld: 'DIRECTOR',
    };

    const mockDependents = {
        relationship: 'HIJO',
        occupation: 'ESTUDIANTE',
    };

    const mockAssociation = {
        rfc: 'ABC123456789',
        companyName: 'ASOCIACION',
    };

    const createDialogData = (overrides: Record<string, unknown> = {}) => ({
        dataClient: [mockClientData],
        isMaintenance: { all: false },
        type: 'ppe',
        ...overrides,
    });

    const assignViewChildren = () => {
        const fb = TestBed.inject(FormBuilder);
        component.clientDataComponent = {
            profileForm: fb.group({ field: ['value'] }),
            submitPPE: jasmine.createSpy('submitPPE').and.resolveTo({ firstName: 'JUAN' }),
        } as any;
        component.positionHeldComponent = {
            profileForm: fb.group({ field: ['value'] }),
            sendInformation: jasmine.createSpy('sendInformation').and.resolveTo(mockPositionHeld),
        } as any;
        component.addressSectionComponent = {
            profileForm: fb.group({ field: ['value'] }),
            onSubmit: jasmine.createSpy('onSubmit').and.resolveTo(mockAddress),
        } as any;
        component.societiesAndAssociationsComponent = {
            profileForm: fb.group({ field: ['value'] }),
            sendInformation: jasmine.createSpy('sendInformation').and.resolveTo(mockAssociation),
        } as any;
        component.economicDependentsComponent = {
            profileForm: fb.group({ field: ['value'] }),
            sendInformation: jasmine.createSpy('sendInformation').and.resolveTo(mockDependents),
        } as any;
    };

    const setup = async (
        data = createDialogData(),
        currentInfo = { isMaintenance: false, isCustomer: false },
    ) => {
        dialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
        catalogsService = jasmine.createSpyObj('CatalogsService', ['getCountry', 'getFederalEntity']);
        onboardingService = jasmine.createSpyObj('OnboardingService', ['getCurrentInfo']);
        searchClientFlowService = jasmine.createSpyObj('SearchClientFlowService', ['validInWatchList']);

        catalogsService.getCountry.and.returnValue(of([{ countryId: 'MX', country: 'Mexico' }] as any));
        catalogsService.getFederalEntity.and.returnValue(of([{ bland: 'DF', bezei: 'CIUDAD DE MEXICO' }] as any));
        onboardingService.getCurrentInfo.and.returnValue(currentInfo as any);
        searchClientFlowService.validInWatchList.and.resolveTo();

        await TestBed.configureTestingModule({
            declarations: [ModalFormComponent],
            imports: [ReactiveFormsModule],
            providers: [
                { provide: MatDialogRef, useValue: dialogRef },
                { provide: MAT_DIALOG_DATA, useValue: data },
                { provide: CatalogsService, useValue: catalogsService },
                { provide: OnboardingService, useValue: onboardingService },
                { provide: SearchClientFlowService, useValue: searchClientFlowService },
            ],
            schemas: [NO_ERRORS_SCHEMA],
        })
            .overrideComponent(ModalFormComponent, {
                set: { template: '' },
            })
            .compileComponents();

        fixture = TestBed.createComponent(ModalFormComponent);
        component = fixture.componentInstance;
        component.ngOnInit();
        assignViewChildren();
    };

    afterEach(() => {
        document.body.classList.remove('show-validation');
    });

    it('should create and load countries and states', async () => {
        await setup();

        expect(component).toBeTruthy();
        expect(catalogsService.getCountry).toHaveBeenCalledWith({ land: [] });
        expect(catalogsService.getFederalEntity).toHaveBeenCalledWith({ land1s: ['MX'] });
        expect(component.countries().length).toBe(1);
        expect(component.states().length).toBe(1);
    });

    it('should disable maintenance forms for ppe sections', async () => {
        await setup(createDialogData({ isMaintenance: { all: true }, type: 'ppe' }), {
            isMaintenance: true,
            isCustomer: false,
        });
        const button = document.createElement('button');
        button.id = 'btnAddData';
        document.body.appendChild(button);

        component.ngAfterViewInit();

        expect(component.clientDataComponent.profileForm.get('field')?.disabled).toBeTrue();
        expect(component.positionHeldComponent.profileForm.get('field')?.disabled).toBeTrue();
        expect(button.getAttribute('disabled')).toBe('true');
        button.remove();
    });

    it('should disable customer forms for ppeDep sections', async () => {
        await setup(createDialogData({ isMaintenance: { all: true }, type: 'ppeDep' }), {
            isMaintenance: false,
            isCustomer: true,
        });
        const button = document.createElement('button');
        button.id = 'btnAddData';
        document.body.appendChild(button);

        component.ngAfterViewInit();

        expect(component.clientDataComponent.profileForm.get('field')?.disabled).toBeTrue();
        expect(component.addressSectionComponent.profileForm.get('field')?.disabled).toBeTrue();
        expect(component.economicDependentsComponent.profileForm.get('field')?.disabled).toBeTrue();
        expect(button.getAttribute('disabled')).toBe('true');
        button.remove();
    });

    it('should close with null', async () => {
        await setup();

        component.close();

        expect(dialogRef.close).toHaveBeenCalledWith(null);
    });

    it('should continue with the current client number', async () => {
        await setup();

        component.continue();

        expect(dialogRef.close).toHaveBeenCalledWith('12345');
    });

    it('should search the country and state descriptions', async () => {
        await setup();

        expect(component.searchC()).toBe('Mexico');
        expect(component.searchS()).toBe('CIUDAD DE MEXICO');
    });

    it('should derive gender and birth date from curp', async () => {
        await setup();

        expect(component.searchG()).toBe('MASCULINO');
        expect(component.searchD()).toBe('01/01/1990');
    });

    it('should return null from helper searches when curp is too short', async () => {
        await setup(createDialogData({ dataClient: [{ ...mockClientData, curp: 'SHORT' }] }));

        expect(component.searchG()).toBeNull();
        expect(component.searchD()).toBeNull();
        expect(component.searchS()).toBeNull();
    });

    it('should close with the selected contract', async () => {
        await setup();

        component.onContractSelected({ contractNumber: 'ABC' });

        expect(dialogRef.close).toHaveBeenCalledWith({ contractNumber: 'ABC' });
    });

    it('should save fppe data and validate watch list', async () => {
        await setup();

        await component.saveFppe();

        expect(document.body.classList.contains('show-validation')).toBeTrue();
        expect(searchClientFlowService.validInWatchList).toHaveBeenCalledWith(
            jasmine.objectContaining({ firstName: 'JUAN' }),
        );
        expect(dialogRef.close).toHaveBeenCalledWith(
            jasmine.objectContaining({ firstName: 'JUAN', relationship: 'PADRE', positionHeld: 'DIRECTOR' }),
        );
    });

    it('should not close fppe when any section returns null', async () => {
        await setup();
        (component.clientDataComponent.submitPPE as jasmine.Spy).and.resolveTo(null);

        await component.saveFppe();

        expect(dialogRef.close).not.toHaveBeenCalled();
    });

    it('should save dppe data when all sections are valid', async () => {
        await setup();

        await component.saveDppe();

        expect(searchClientFlowService.validInWatchList).toHaveBeenCalled();
        expect(dialogRef.close).toHaveBeenCalledWith(
            jasmine.objectContaining({ firstName: 'JUAN', relationship: 'HIJO', country: 'MX' }),
        );
    });

    it('should save appe data when association and address are present', async () => {
        await setup();

        await component.saveAppe();

        expect(dialogRef.close).toHaveBeenCalledWith(
            jasmine.objectContaining({ rfc: 'ABC123456789', companyName: 'ASOCIACION', country: 'MX' }),
        );
    });

    it('should not close appe when any source is missing', async () => {
        await setup();
        (component.addressSectionComponent.onSubmit as jasmine.Spy).and.resolveTo(null);

        await component.saveAppe();

        expect(dialogRef.close).not.toHaveBeenCalled();
    });
});

//     await component.saveAppe();

//     expect(document.body.classList.contains('show-validation')).toBeTrue();
//     expect(dialogRefSpy.close).not.toHaveBeenCalled();
//   });
// });
