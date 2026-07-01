import { TestBed } from '@angular/core/testing';
import { NotificationModalService } from './notification-modal.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';
import { ModalNotificationComponent } from '../components/modals/modal-notification/modal-notification.component';
import { ModalNotification } from '../../onboarding/models/modal-notification';

describe('NotificationModalService', () => {
  let service: NotificationModalService;
  let dialogSpy: jasmine.SpyObj<MatDialog>;

  const mockContent: ModalNotification = {
    title: 'Test title',
    beforeMessages: ['Test message']
  };

  beforeEach(() => {
    const dialogRefSpyObj = jasmine.createSpyObj({
      afterClosed: of({ value: true, message: 'ok' })
    });

    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    dialogSpy.open.and.returnValue(dialogRefSpyObj as MatDialogRef<ModalNotificationComponent>);

    TestBed.configureTestingModule({
      providers: [
        NotificationModalService,
        { provide: MatDialog, useValue: dialogSpy }
      ]
    });

    service = TestBed.inject(NotificationModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('error() should return result when modal is confirmed', async () => {
    const result = await service.error(mockContent);
    expect(result).toEqual({ value: true, message: 'ok' });
    expect(dialogSpy.open).toHaveBeenCalled();
  });

  it('error() should return undefined when modal is closed without confirm', async () => {
    dialogSpy.open.and.returnValue({ afterClosed: () => of(undefined) } as any);
    const result = await service.error(mockContent);
    expect(result).toBeUndefined();
  });

  it('warning() should return result when modal is confirmed', async () => {
    const result = await service.warning(mockContent);
    expect(result).toEqual({ value: true, message: 'ok' });
  });

  it('warning() should return undefined when modal is closed without confirm', async () => {
    dialogSpy.open.and.returnValue({ afterClosed: () => of(undefined) } as any);
    const result = await service.warning(mockContent);
    expect(result).toBeUndefined();
  });

  it('success() should return result when modal is confirmed', async () => {
    const result = await service.success(mockContent);
    expect(result).toEqual({ value: true, message: 'ok' });
  });

  it('success() should return undefined when modal is closed without confirm', async () => {
    dialogSpy.open.and.returnValue({ afterClosed: () => of(undefined) } as any);
    const result = await service.success(mockContent);
    expect(result).toBeUndefined();
  });

  it('fail() should return result when modal is confirmed', async () => {
    const result = await service.fail(mockContent);
    expect(result).toEqual({ value: true, message: 'ok' });
  });

  it('fail() should return undefined when modal is closed without confirm', async () => {
    dialogSpy.open.and.returnValue({ afterClosed: () => of(undefined) } as any);
    const result = await service.fail(mockContent);
    expect(result).toBeUndefined();
  });

  it('info() should return result when modal is confirmed', async () => {
    const result = await service.info(mockContent);
    expect(result).toEqual({ value: true, message: 'ok' });
  });

  it('info() should return undefined when modal is closed without confirm', async () => {
    dialogSpy.open.and.returnValue({ afterClosed: () => of(undefined) } as any);
    const result = await service.info(mockContent);
    expect(result).toBeUndefined();
  });

  it('confirm() should return result when modal is confirmed', async () => {
    const result = await service.confirm(mockContent);
    expect(result).toEqual({ value: true, message: 'ok' });
  });

  it('confirm() should return undefined when modal is closed without confirm', async () => {
    dialogSpy.open.and.returnValue({ afterClosed: () => of(undefined) } as any);
    const result = await service.confirm(mockContent);
    expect(result).toBeUndefined();
  });

  it('review() should return result when modal is confirmed', async () => {
    const result = await service.review(mockContent);
    expect(result).toEqual({ value: true, message: 'ok' });
  });

  it('review() should return undefined when modal is closed without confirm', async () => {
    dialogSpy.open.and.returnValue({ afterClosed: () => of(undefined) } as any);
    const result = await service.review(mockContent);
    expect(result).toBeUndefined();
  });

});
