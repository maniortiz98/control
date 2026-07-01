import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';

import { ModalAttoneryService } from './modal-attonery.service';
import { ModalAttoneryComponent } from '../components/modals/modal-attonery/modal-attonery.component';

describe('ModalAttoneryService', () => {
  let service: ModalAttoneryService;
  let matDialogSpy: jasmine.SpyObj<MatDialog>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('MatDialog', ['open']);

    TestBed.configureTestingModule({
      providers: [
        ModalAttoneryService,
        { provide: MatDialog, useValue: spy }
      ]
    });

    service = TestBed.inject(ModalAttoneryService);
    matDialogSpy = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('addAttoneryWithClientNumber should open modal with hasClientNumber true', async () => {
    const contentMock = {
      id: 1,
      name: 'Attonery mock'
    } as any;

    const expectedResult = {
      id: 10,
      name: 'Returned attonery'
    } as any;

    matDialogSpy.open.and.returnValue({
      afterClosed: () => of(expectedResult)
    } as any);

    const result = await service.addAttoneryWithClientNumber(
      123,
      'SIGNATURE_TYPE',
      true,
      false,
      contentMock,
      { canEdit: true }
    );

    expect(matDialogSpy.open).toHaveBeenCalledTimes(1);
    expect(matDialogSpy.open).toHaveBeenCalledWith(
      ModalAttoneryComponent,
      jasmine.objectContaining({
        panelClass: ['attonery-modal'],
        disableClose: true,
        data: {
          hasClientNumber: true,
          content: contentMock,
          attoneryNumber: 123,
          readOnly: true,
          signatureType: 'SIGNATURE_TYPE',
          permises: { canEdit: true },
          isMaintenance: false,
          keepOnHttpError: false
        }
      })
    );

    expect(result).toEqual(expectedResult);
  });

  it('addAttoneryWithoutClientNumber should open modal with hasClientNumber false', async () => {
    const contentMock = {
      id: 2,
      name: 'Attonery without client'
    } as any;

    const expectedResult = {
      id: 20,
      name: 'Returned result'
    } as any;

    matDialogSpy.open.and.returnValue({
      afterClosed: () => of(expectedResult)
    } as any);

    const result = await service.addAttoneryWithoutClientNumber(
      456,
      'OTHER_SIGNATURE',
      false,
      true,
      contentMock,
      { canDelete: false }
    );

    expect(matDialogSpy.open).toHaveBeenCalledTimes(1);
    expect(matDialogSpy.open).toHaveBeenCalledWith(
      ModalAttoneryComponent,
      jasmine.objectContaining({
        panelClass: ['attonery-modal'],
        disableClose: true,
        data: {
          hasClientNumber: false,
          content: contentMock,
          attoneryNumber: 456,
          readOnly: false,
          signatureType: 'OTHER_SIGNATURE',
          permises: { canDelete: false },
          isMaintenance: true,
          keepOnHttpError: false
        }
      })
    );

    expect(result).toEqual(expectedResult);
  });

  it('should return undefined when modal closes without value', async () => {
    matDialogSpy.open.and.returnValue({
      afterClosed: () => of(undefined)
    } as any);

    const result = await service.addAttoneryWithClientNumber(
      789,
      'TYPE',
      false,
      false
    );

    expect(result).toBeUndefined();
  });

  it('closeModal should close dialog and reset dialogRef', () => {
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
