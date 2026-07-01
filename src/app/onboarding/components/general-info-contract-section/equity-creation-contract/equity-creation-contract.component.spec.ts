import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { EquityCreationContractComponent } from './equity-creation-contract.component';
import { CoreModule } from '../../../../core/core.module';
import { SharedModule } from '../../../../shared/shared.module';
import { RouterModule } from '@angular/router';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DateAdapter } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { OnboardingService } from '../../../services/onboarding.service';
import { NotificationsService } from '../../../../shared/services/notifications.service';
import { of, throwError } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('EquityCreationContractComponent', () => {
  let component: EquityCreationContractComponent;
  let fixture: ComponentFixture<EquityCreationContractComponent>;
  let mockOnboardingService: jasmine.SpyObj<OnboardingService>;
  let mockNotificationsService: jasmine.SpyObj<NotificationsService>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<EquityCreationContractComponent>>;

  const mockData = {
    strategies: [
      { cveStrategy: 'STRAT1', description: 'Strategy 1', minimumAmount: 1000, active: true },
      { cveStrategy: 'STRAT2', description: 'Strategy 2', minimumAmount: 5000, active: true }
    ],
    contract: '12345',
    advisorId: 'ADV001'
  };

  beforeEach(async () => {
    mockOnboardingService = jasmine.createSpyObj('OnboardingService', ['registerEquity', 'getCurrentInfo']);
    mockOnboardingService.getCurrentInfo.and.returnValue({ businessType: '998' } as any);
    mockNotificationsService = jasmine.createSpyObj('NotificationsService', ['error', 'success']);
    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      declarations: [EquityCreationContractComponent],
      imports: [
        CoreModule,
        SharedModule,
        RouterModule.forRoot([]),
        ReactiveFormsModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: DateAdapter, useClass: MomentDateAdapter },
        { provide: MsalService, useValue: {} },
        { provide: MsalBroadcastService, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: mockData },
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: OnboardingService, useValue: mockOnboardingService },
        { provide: NotificationsService, useValue: mockNotificationsService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EquityCreationContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize catalog from data in ngOnInit', () => {
    expect(component.catalog).toEqual(mockData.strategies);
  });

  describe('onSubmit', () => {
    it('should mark form as touched and show error if invalid', () => {
      component.form.patchValue({ selectedContract: '', investmentAmmount: '' });
      component.onSubmit();
      expect(mockNotificationsService.error).toHaveBeenCalled();
      expect(component.form.touched).toBeTrue();
    });

    it('should show error if investment amount is less than minimum', () => {
      component.form.patchValue({ selectedContract: 'STRAT1', investmentAmmount: '500' });
      component.onSubmit();
      expect(mockNotificationsService.error).toHaveBeenCalledWith('El monto mínimo para esta estrategia es $1,000.00 MXN');
      expect(mockOnboardingService.registerEquity).not.toHaveBeenCalled();
    });

    it('should call registerEquity if form is valid and amount is sufficient', () => {
      mockOnboardingService.registerEquity.and.returnValue(of({ status: 'SUCCESS', data: {}, messages: 'Success' } as any));
      component.form.patchValue({ selectedContract: 'STRAT1', investmentAmmount: '1500' });
      component.onSubmit();
      expect(mockOnboardingService.registerEquity).toHaveBeenCalled();
    });
  });

  describe('registerEquity', () => {
    it('should handle SUCCESS response', () => {
      const response = { status: 'SUCCESS', messages: 'Registered successfully', data: { contracts: [{}] } };
      mockOnboardingService.registerEquity.and.returnValue(of(response as any));
      component.form.patchValue({ selectedContract: 'STRAT1', investmentAmmount: '1500' });

      component.registerEquity();

      expect(mockNotificationsService.success).toHaveBeenCalledWith('Registered successfully');
      expect(mockDialogRef.close).toHaveBeenCalledWith(response);
    });

    it('should handle non-SUCCESS response', () => {
      const response = { status: 'ERROR', messages: 'Failed registration' };
      mockOnboardingService.registerEquity.and.returnValue(of(response as any));
      component.form.patchValue({ selectedContract: 'STRAT1', investmentAmmount: '1500' });

      component.registerEquity();

      expect(mockNotificationsService.error).toHaveBeenCalledWith('Failed registration');
      expect(mockDialogRef.close).not.toHaveBeenCalled();
    });

    it('should handle service error', () => {
      mockOnboardingService.registerEquity.and.returnValue(throwError(() => new Error('API error')));
      component.form.patchValue({ selectedContract: 'STRAT1', investmentAmmount: '1500' });

      component.registerEquity();

      expect(mockNotificationsService.error).toHaveBeenCalledWith('Error al registrar la estrategia Equity');
    });
  });

  it('should close dialog when close() is called', () => {
    component.close();
    expect(mockDialogRef.close).toHaveBeenCalled();
  });

  it('should set selectedContract when onSelectContract is called', () => {
    const item = { cveStrategy: 'STRAT2', description: 'Strategy 2', active: true, minimumAmount: 5000 };
    component.onSelectContract(item);
    expect(component.form.get('selectedContract')?.value).toBe('STRAT2');
  });

  it('should return true if item is selected', () => {
    const item = { cveStrategy: 'STRAT1', description: 'Strategy 1', active: true, minimumAmount: 1000 };
    component.form.get('selectedContract')?.setValue('STRAT1');
    expect(component.isSelected(item)).toBeTrue();
  });
});
