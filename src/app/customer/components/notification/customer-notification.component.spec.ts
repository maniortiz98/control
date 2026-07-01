
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { CustomerNotificationComponent } from './customer-notification.component';

describe('CustomerNotificationComponent', () => {
  let component: CustomerNotificationComponent;
  let fixture: ComponentFixture<CustomerNotificationComponent>;
  let snackBarRefMock: jasmine.SpyObj<MatSnackBarRef<CustomerNotificationComponent>>;

  beforeEach(async () => {
    snackBarRefMock = jasmine.createSpyObj('MatSnackBarRef', ['dismiss']);

    await TestBed.configureTestingModule({
      declarations: [CustomerNotificationComponent],
      providers: [
        { provide: MatSnackBarRef, useValue: snackBarRefMock },
        { provide: MAT_SNACK_BAR_DATA, useValue: { message: 'Test message' } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CustomerNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should inject data correctly', () => {
    expect(component.data).toEqual({ message: 'Test message' });
  });

  it('should call snackBarRef.dismiss() when close() is executed', () => {
    component.close();
    expect(snackBarRefMock.dismiss).toHaveBeenCalled();
  });
});
