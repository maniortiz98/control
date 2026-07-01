import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { GeneralInfoContractSectionComponent } from './general-info-contract-section.component';
import { NotificationsService } from '../../../shared/services/notifications.service';
import { OnboardingService } from '../../services/onboarding.service';
import { CatalogsService } from '../../../shared/services/catalogs.service';
import { TiProfileService } from '../../../shared/services/storage-services/ti-profile.service';
import { ActiwebService } from '../../../shared/services/actiweb.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('GeneralInfoContractSectionComponent', () => {
  let component: GeneralInfoContractSectionComponent;
  let fixture: ComponentFixture<GeneralInfoContractSectionComponent>;

  let mockNotificationsService: jasmine.SpyObj<NotificationsService>;
  let mockOnboardingService: jasmine.SpyObj<OnboardingService>;
  let mockCatalogsService: jasmine.SpyObj<CatalogsService>;
  let mockTiProfileService: jasmine.SpyObj<TiProfileService>;
  let mockActiwebService: jasmine.SpyObj<ActiwebService>;
  let mockMatDialog: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    mockNotificationsService = jasmine.createSpyObj('NotificationsService', ['error', 'success']);
    mockOnboardingService = jasmine.createSpyObj('OnboardingService', ['getCustomerInitialData', 'currentInfo']);
    mockCatalogsService = jasmine.createSpyObj('CatalogsService', ['getAdvisor', 'getFinancialCenter', 'getFundsOriginCategory', 'getStrategiesEquity']);
    mockTiProfileService = jasmine.createSpyObj('TiProfileService', ['maintenanceQuiz']);
    mockActiwebService = jasmine.createSpyObj('ActiwebService', ['actiwebData']);
    mockMatDialog = jasmine.createSpyObj('MatDialog', ['open']);

    mockOnboardingService.getCustomerInitialData.and.returnValue({} as any);
    mockOnboardingService.currentInfo.and.returnValue({ accountId: 123 } as any);
    mockCatalogsService.getAdvisor.and.returnValue(of([]));
    mockCatalogsService.getFinancialCenter.and.returnValue(of([]));
    mockCatalogsService.getFundsOriginCategory.and.returnValue(of([]));
    mockCatalogsService.getStrategiesEquity.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      declarations: [GeneralInfoContractSectionComponent],
      imports: [
        ReactiveFormsModule,
        MatDialogModule,
        SharedModule,
        HttpClientTestingModule,
        NoopAnimationsModule
      ],
      providers: [
        FormBuilder,
        { provide: NotificationsService, useValue: mockNotificationsService },
        { provide: OnboardingService, useValue: mockOnboardingService },
        { provide: CatalogsService, useValue: mockCatalogsService },
        { provide: TiProfileService, useValue: mockTiProfileService },
        { provide: ActiwebService, useValue: mockActiwebService },
        { provide: MatDialog, useValue: mockMatDialog },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneralInfoContractSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load catalogs on ngOnInit', () => {
    expect(mockCatalogsService.getAdvisor).toHaveBeenCalled();
    expect(mockCatalogsService.getFinancialCenter).toHaveBeenCalled();
    expect(mockCatalogsService.getFundsOriginCategory).toHaveBeenCalled();
  });

  it('should show equity section when gestionType is 05 and strategies are selected', () => {
    component.contractForm.patchValue({ gestionType: '05', strategyTypes: ['STRAT1'] });
    component.checkEquityVisibility();
    expect(component.isEquityVisible).toBeTrue();
  });

  it('should hide equity section when gestionType is not 05', () => {
    component.contractForm.patchValue({ gestionType: '01', strategyTypes: ['STRAT1'] });
    component.checkEquityVisibility();
    expect(component.isEquityVisible).toBeFalse();
  });

  describe('onSubmit', () => {
    it('should return undefined and show error if form is invalid', () => {
      component.contractForm.patchValue({ isrPercentage: '' }); // Required field
      const result = component.onSubmit();
      expect(result).toBeUndefined();
      expect(mockNotificationsService.error).toHaveBeenCalled();
    });

    it('should show error if ISR percentage is invalid', () => {
      component.contractForm.patchValue({ 
        isrPercentage: 150, 
        clientStatus: '1', 
        contractStatus: '1', 
        contractManagement: '1', 
        gestionType: '01' 
      });
      component.onSubmit();
      expect(mockNotificationsService.error).toHaveBeenCalledWith('El porcentaje debe estar entre 0 y 100%: % ISR');
    });
  });
});
