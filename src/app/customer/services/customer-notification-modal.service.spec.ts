import { TestBed } from "@angular/core/testing";
import { MatDialog } from "@angular/material/dialog";
import { of } from "rxjs";
import { CustomerModalNotificationComponent } from "../components/modals/modal-notification/customer-modal-notification.component";
import { CustomerNotificationModalService } from "./customer-notification-modal.service";

describe('CustomerNotificationModalService', () => {

  let service: CustomerNotificationModalService;
  let mockDialog: jasmine.SpyObj<MatDialog>;

  const mockAfterClosed = (value: any) => ({
    afterClosed: () => of(value)
  });

  beforeEach(() => {
    mockDialog = jasmine.createSpyObj('MatDialog', ['open']);

    TestBed.configureTestingModule({
      providers: [
        CustomerNotificationModalService,
        { provide: MatDialog, useValue: mockDialog }
      ]
    });

    service = TestBed.inject(CustomerNotificationModalService);
  });

  const baseContent = {
    title: 'Test',
    message: 'Message'
  } as any;

  it('error', async () => {
    const result = { value: true };

    mockDialog.open.and.returnValue(mockAfterClosed(result) as any);

    const res = await service.error(baseContent);

    expect(mockDialog.open).toHaveBeenCalledWith(
      CustomerModalNotificationComponent,
      jasmine.objectContaining({
        width: '530px',
        disableClose: false,
        panelClass: 'custom-dialog',
        backdropClass: 'custom-dialog-backdrop',
        data: jasmine.objectContaining({
          type: 'error',
          title: 'Test',
          message: 'Message'
        })
      })
    );

    expect(res).toEqual(result);
  });

  it('success', async () => {
    const result = { value: true };

    mockDialog.open.and.returnValue(mockAfterClosed(result) as any);

    const res = await service.success(baseContent);

    expect(res).toEqual(result);
  });

  it('warning', async () => {
    const result = { value: false };

    mockDialog.open.and.returnValue(mockAfterClosed(result) as any);

    const res = await service.warning(baseContent);

    expect(res).toEqual(result);
  });

  it('fail', async () => {
    const result = { value: false };

    mockDialog.open.and.returnValue(mockAfterClosed(result) as any);

    const res = await service.fail(baseContent);

    expect(res).toEqual(result);
  });

  it('info', async () => {
    const result = { value: true };

    mockDialog.open.and.returnValue(mockAfterClosed(result) as any);

    const res = await service.info(baseContent);

    expect(res).toEqual(result);
  });

  it('confirm', async () => {
    const result = { value: true };

    mockDialog.open.and.returnValue(mockAfterClosed(result) as any);

    const res = await service.confirm(baseContent);

    expect(res).toEqual(result);
  });

  it('retry', async () => {
    const result = { value: true };

    mockDialog.open.and.returnValue(mockAfterClosed(result) as any);

    const res = await service.retry(baseContent);

    expect(res).toEqual(result);
  });

  it('review', async () => {
    const result = { value: true };

    mockDialog.open.and.returnValue(mockAfterClosed(result) as any);

    const res = await service.review(baseContent);

    expect(res).toEqual(result);
  });

  it('cuando no hay resultado retorna undefined', async () => {
    spyOn(console, 'log');

    mockDialog.open.and.returnValue(mockAfterClosed(undefined) as any);

    const res = await service.info(baseContent);

    expect(console.log).toHaveBeenCalledWith('Modal closed without action.');
    expect(res).toBeUndefined();
  });

  it('disableClose true cuando forceDisableClose = true', async () => {
    const content = {
      ...baseContent,
      forceDisableClose: true
    };

    mockDialog.open.and.returnValue(mockAfterClosed({ value: true }) as any);

    await service.error(content);

    expect(mockDialog.open).toHaveBeenCalledWith(
      CustomerModalNotificationComponent,
      jasmine.objectContaining({
        disableClose: true
      })
    );
  });

  it('no incluye props undefined en data', async () => {
    const content = {
      title: 'Test',
      message: 'Message',
      optional: undefined
    };

    mockDialog.open.and.returnValue(mockAfterClosed({ value: true }) as any);

    await service.error(content as any);

    const callConfig = mockDialog.open.calls.mostRecent().args[1] as {
      data: Record<string, any>;
    };

    expect(callConfig.data).toEqual(
      jasmine.objectContaining({
        type: 'error',
        title: 'Test',
        message: 'Message'
      })
    );

    expect('optional' in callConfig.data).toBeFalse();
  });

});