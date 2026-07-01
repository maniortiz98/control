import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EquityPreviewContractComponent } from './equity-preview-contract.component';
import { CoreModule } from '../../../../core/core.module';
import { SharedModule } from '../../../../shared/shared.module';
import { RouterModule } from '@angular/router';
import { DateAdapter } from '@angular/material/core';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('EquityPreviewContractComponent', () => {
  let component: EquityPreviewContractComponent;
  let fixture: ComponentFixture<EquityPreviewContractComponent>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<EquityPreviewContractComponent>>;

  const mockData = {
    content: {
      fatherContractNumber: 'F123',
      fatherClientNumber: 'FC123',
      fatherFullName: 'Father Name',
      childrenContractNumber: 'C123',
      childrenClientNumber: 'CC123',
      childrenFullName: 'Children Name',
      childrenStrategyType: 'STRAT'
    }
  };

  beforeEach(async () => {
    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      declarations: [EquityPreviewContractComponent],
      imports: [
        CoreModule,
        SharedModule,
        RouterModule.forRoot([]),
        NoopAnimationsModule
      ],
      providers: [
        { provide: DateAdapter, useClass: MomentDateAdapter },
        { provide: MsalService, useValue: {} },
        { provide: MsalBroadcastService, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: mockData },
        { provide: MatDialogRef, useValue: mockDialogRef }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EquityPreviewContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize properties from data in ngOnInit', () => {
    expect(component.fatherContractNumber).toBe(mockData.content.fatherContractNumber);
    expect(component.fatherClientNumber).toBe(mockData.content.fatherClientNumber);
    expect(component.fatherFullName).toBe(mockData.content.fatherFullName);
    expect(component.childrenContractNumber).toBe(mockData.content.childrenContractNumber);
    expect(component.childrenClientNumber).toBe(mockData.content.childrenClientNumber);
    expect(component.childrenFullName).toBe(mockData.content.childrenFullName);
    expect(component.childrenStrategyType).toBe(mockData.content.childrenStrategyType);
  });

  it('should close dialog when close() is called', () => {
    component.close();
    expect(mockDialogRef.close).toHaveBeenCalled();
  });
});
