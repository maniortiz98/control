import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrganizationChartModalComponent } from './organization-chart-modal.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NotificationsService } from '../../../../shared/services/notifications.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ERROR_MESSAGES } from '../../../constants/form-messages';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';

describe('OrganizationChartModalComponent', () => {
  let component: OrganizationChartModalComponent;
  let fixture: ComponentFixture<OrganizationChartModalComponent>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<OrganizationChartModalComponent>>;
  let mockNotificationService: jasmine.SpyObj<NotificationsService>;

  beforeEach(async () => {
    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
    mockNotificationService = jasmine.createSpyObj('NotificationsService', ['error']);
  });

  describe('with empty MAT_DIALOG_DATA', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        declarations: [OrganizationChartModalComponent],
        imports: [
          ReactiveFormsModule,
          MatTableModule,
          MatSelectModule,
        ],
        providers: [
          { provide: MatDialogRef, useValue: mockDialogRef },
          { provide: NotificationsService, useValue: mockNotificationService },
          { provide: MAT_DIALOG_DATA, useValue: { content: null } }
        ]
      }).compileComponents();

      fixture = TestBed.createComponent(OrganizationChartModalComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    describe('onSubmit', () => {
      it('should show error if required fields are missing', () => {
        component.form.patchValue({ firstName: '', charge: '' });
        component.onSubmit();
        expect(mockNotificationService.error)
          .toHaveBeenCalledWith(ERROR_MESSAGES.REQUIRED_FIELDS);
        expect(mockDialogRef.close).not.toHaveBeenCalled();
      });

      it('should show error if no last names are provided', () => {
        component.form.patchValue({
          firstName: 'Juan',
          charge: 'Gerente',
          firstLastName: '',
          secondLastName: ''
        });
        component.onSubmit();
        expect(mockNotificationService.error)
          .toHaveBeenCalledWith(ERROR_MESSAGES.AT_LEAST_ONE_LAST_NAME);
        expect(mockDialogRef.close).not.toHaveBeenCalled();
      });

      it('should close dialog with response if form is valid', () => {
        component.form.patchValue({
          firstName: 'Juan',
          charge: 'Gerente',
          firstLastName: 'Pérez'
        });
        component.onSubmit();
        expect(mockDialogRef.close).toHaveBeenCalled();
      });
    });

    describe('close', () => {
      it('should call dialogRef.close()', () => {
        component.close();
        expect(mockDialogRef.close).toHaveBeenCalled();
      });
    });
  });

  describe('with MAT_DIALOG_DATA containing content', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        declarations: [OrganizationChartModalComponent],
        imports: [
          ReactiveFormsModule,
          MatTableModule,
          MatSelectModule,
        ],
        providers: [
          { provide: MatDialogRef, useValue: mockDialogRef },
          { provide: NotificationsService, useValue: mockNotificationService },
          {
            provide: MAT_DIALOG_DATA,
            useValue: {
              content: {
                firstName: 'Juan',
                charge: 'Gerente',
                firstLastName: 'Pérez',
              }
            }
          }
        ]
      }).compileComponents();

      fixture = TestBed.createComponent(OrganizationChartModalComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should patch form when data.content is provided', () => {
      expect(component.form.value.firstName).toBe('Juan');
      expect(component.form.value.charge).toBe('Gerente');
    });
  });
});
