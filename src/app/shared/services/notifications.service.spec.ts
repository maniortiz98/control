import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationsService } from './notifications.service';
import { NotificationComponent } from '../components/notification/notification.component';

describe('NotificationsService', () => {
  let service: NotificationsService;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('MatSnackBar', ['openFromComponent']);

    TestBed.configureTestingModule({
      providers: [
        NotificationsService,
        { provide: MatSnackBar, useValue: spy }
      ]
    });

    service = TestBed.inject(NotificationsService);
    snackBarSpy = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call callNotification with error type', () => {
    const message = 'An error occurred';
    const secondaryText = 'Please try again later';

    service.error(message, secondaryText);

    expect(snackBarSpy.openFromComponent).toHaveBeenCalledWith(NotificationComponent, {
      data: {
        type: 'error',
        message: message,
        secondaryText: secondaryText
      },
      duration: service['DURATION'],
      horizontalPosition: service['HORIZONTAL_POSITION'],
      verticalPosition: service['VERTICAL_POSITION']
    });
  });

  it('should call callNotification with success type', () => {
    const message = 'Operation successful';
    const secondaryText = 'Your changes have been saved';

    service.success(message, secondaryText);

    expect(snackBarSpy.openFromComponent).toHaveBeenCalledWith(NotificationComponent, {
      data: {
        type: 'success',
        message: message,
        secondaryText: secondaryText
      },
      duration: service['DURATION'],
      horizontalPosition: service['HORIZONTAL_POSITION'],
      verticalPosition: service['VERTICAL_POSITION']
    });
  });

  it('should call callNotification with info type', () => {
    const message = 'This is an information message';
    const secondaryText = 'More details here';

    service.info(message, secondaryText);

    expect(snackBarSpy.openFromComponent).toHaveBeenCalledWith(NotificationComponent, {
      data: {
        type: 'info',
        message: message,
        secondaryText: secondaryText
      },
      duration: service['DURATION'],
      horizontalPosition: service['HORIZONTAL_POSITION'],
      verticalPosition: service['VERTICAL_POSITION']
    });
  });

  it('should call callNotification without secondary text', () => {
    const message = 'An error occurred';

    service.error(message);

    expect(snackBarSpy.openFromComponent).toHaveBeenCalledWith(NotificationComponent, {
      data: {
        type: 'error',
        message: message,
        secondaryText: undefined // secondaryText should be undefined
      },
      duration: service['DURATION'],
      horizontalPosition: service['HORIZONTAL_POSITION'],
      verticalPosition: service['VERTICAL_POSITION']
    });
  });
});