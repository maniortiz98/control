
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { NotificationComponent } from './notification.component';

describe('NotificationComponent', () => {
  let component: NotificationComponent;
  let fixture: ComponentFixture<NotificationComponent>;
  let snackBarRefMock: jasmine.SpyObj<MatSnackBarRef<NotificationComponent>>;

  beforeEach(async () => {
    snackBarRefMock = jasmine.createSpyObj('MatSnackBarRef', ['dismiss']);

    await TestBed.configureTestingModule({
      declarations: [NotificationComponent],
      providers: [
        { provide: MatSnackBarRef, useValue: snackBarRefMock },
        { provide: MAT_SNACK_BAR_DATA, useValue: { message: 'Test message' } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationComponent);
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
