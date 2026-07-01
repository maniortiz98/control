import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';

import { ModalExecutorService } from './modal-executor.service';
import { ExecutorModalComponent } from '../components/modals/executor-modal/executor-modal.component';

describe('ModalExecutorService', () => {
  let service: ModalExecutorService;
  let matDialogSpy: jasmine.SpyObj<MatDialog>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('MatDialog', ['open']);

    TestBed.configureTestingModule({
      providers: [
        ModalExecutorService,
        { provide: MatDialog, useValue: spy }
      ]
    });

    service = TestBed.inject(ModalExecutorService);
    matDialogSpy = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('callExecutor should open modal with correct data and return afterClosed result', async () => {
    const contentMock = {
      id: 1,
      name: 'Executor mock'
    } as any;

    const expectedResult = {
      id: 99,
      name: 'Returned executor'
    } as any;

    matDialogSpy.open.and.returnValue({
      afterClosed: () => of(expectedResult)
    } as any);

    const result = await service.callExecutor(true, 123, contentMock);

    expect(matDialogSpy.open).toHaveBeenCalledTimes(1);
    expect(matDialogSpy.open).toHaveBeenCalledWith(
      ExecutorModalComponent,
      jasmine.objectContaining({
        panelClass: ['executor-modal'],
        disableClose: true,
        data: {
          hasclientNumber: true,
          executorNumber: 123,
          content: contentMock,
          keepOnHttpError: false
        }
      })
    );

    expect(result).toEqual(expectedResult);
  });

  it('callExecutor should open modal without content when not provided', async () => {
    const expectedResult = undefined;

    matDialogSpy.open.and.returnValue({
      afterClosed: () => of(expectedResult)
    } as any);

    const result = await service.callExecutor(false, 456);

    expect(matDialogSpy.open).toHaveBeenCalledWith(
      ExecutorModalComponent,
      jasmine.objectContaining({
        panelClass: ['executor-modal'],
        disableClose: true,
        data: {
          hasclientNumber: false,
          executorNumber: 456,
          content: undefined,
          keepOnHttpError: false
        }
      })
    );

    expect(result).toBeUndefined();
  });

  it('closeModal should close the dialog and reset dialogRef', () => {
    const closeSpy = jasmine.createSpy('close');

    (service as any).dialogRef = {
      close: closeSpy
    };

    service.closeModal();

    expect(closeSpy).toHaveBeenCalled();
    expect((service as any).dialogRef).toBeNull();
  });

  it('closeModal should do nothing if dialogRef is null', () => {
    (service as any).dialogRef = null;

    expect(() => service.closeModal()).not.toThrow();
    expect((service as any).dialogRef).toBeNull();
  });
});
