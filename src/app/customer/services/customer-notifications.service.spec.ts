import { TestBed } from "@angular/core/testing";
import { MatSnackBar } from "@angular/material/snack-bar";
import { CustomerNotificationComponent } from "../components/notification/customer-notification.component";
import { CustomerNotificationsService } from "./customer-notifications.service";

describe('CustomerNotificationsService', () => {

  let service: CustomerNotificationsService;
  let mockSnackBar: jasmine.SpyObj<MatSnackBar>;

  beforeEach(() => {
    mockSnackBar = jasmine.createSpyObj('MatSnackBar', ['openFromComponent']);

    TestBed.configureTestingModule({
      providers: [
        CustomerNotificationsService,
        { provide: MatSnackBar, useValue: mockSnackBar }
      ]
    });

    service = TestBed.inject(CustomerNotificationsService);
  });

  it('error', () => {
    service.error('msg', 'secondary');

    expect(mockSnackBar.openFromComponent).toHaveBeenCalledWith(
      CustomerNotificationComponent,
      jasmine.objectContaining({
        data: {
          type: 'error',
          message: 'msg',
          secondaryText: 'secondary'
        },
        duration: 5000,
        horizontalPosition: 'right',
        verticalPosition: 'top'
      })
    );
  });

  it('success', () => {
    service.success('ok', 'secondary');

    expect(mockSnackBar.openFromComponent).toHaveBeenCalledWith(
      CustomerNotificationComponent,
      jasmine.objectContaining({
        data: {
          type: 'success',
          message: 'ok',
          secondaryText: 'secondary'
        },
        duration: 5000,
        horizontalPosition: 'right',
        verticalPosition: 'top'
      })
    );
  });

  it('info', () => {
    service.info('info-msg', 'secondary');

    expect(mockSnackBar.openFromComponent).toHaveBeenCalledWith(
      CustomerNotificationComponent,
      jasmine.objectContaining({
        data: {
          type: 'info',
          message: 'info-msg',
          secondaryText: 'secondary'
        },
        duration: 5000,
        horizontalPosition: 'right',
        verticalPosition: 'top'
      })
    );
  });

  it('warning', () => {
    service.warning('warn', 'secondary');

    expect(mockSnackBar.openFromComponent).toHaveBeenCalledWith(
      CustomerNotificationComponent,
      jasmine.objectContaining({
        data: {
          type: 'warning',
          message: 'warn',
          secondaryText: 'secondary'
        },
        duration: 5000,
        horizontalPosition: 'right',
        verticalPosition: 'top'
      })
    );
  });

});