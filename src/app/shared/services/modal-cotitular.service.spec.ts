import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';

import { ModalCotitularService } from './modal-cotitular.service';
import { ModalCotitularComponent } from '../components/modals/modal-cotitular/modal-cotitular.component';

describe('ModalCotitularService', () => {
  let service: ModalCotitularService;
  let matDialogSpy: jasmine.SpyObj<MatDialog>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('MatDialog', ['open']);

    TestBed.configureTestingModule({
      providers: [
        ModalCotitularService,
        { provide: MatDialog, useValue: spy }
      ]
    });

    service = TestBed.inject(ModalCotitularService);
    matDialogSpy = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('cotitularWithoutClientNumber should open modal with hasClientNumber false', async () => {
    const contentMock = {
      id: 1,
      name: 'Cotitular mock'
    } as any;

    const expectedResult = {
      id: 10,
      name: 'Result mock'
    } as any;

    matDialogSpy.open.and.returnValue({
      afterClosed: () => of(expectedResult)
    } as any);

    const result = await service.cotitularWithoutClientNumber(
      123,
      'SIGNATURE_TYPE',
      true,
      false,
      contentMock,
      { canEdit: true }
    );

    expect(matDialogSpy.open).toHaveBeenCalledTimes(1);
    expect(matDialogSpy.open).toHaveBeenCalledWith(
      ModalCotitularComponent,
      jasmine.objectContaining({
        panelClass: ['cotitular-modal'],
        disableClose: true,
        data: {
          hasClientNumber: false,
          content: contentMock,
          cotitularNumber: 123,
          signatureType: 'SIGNATURE_TYPE',
          readOnly: true,
          permises: { canEdit: true },
          isMaintenance: false,
          keepOnHttpError: false
        }
      })
    );

    expect(result).toEqual(expectedResult);
  });

  it('cotitularWithClientNumber should open modal with hasClientNumber true', async () => {
    const contentMock = {
      id: 2,
      name: 'Cotitular with client'
    } as any;

    const expectedResult = {
      id: 20,
      name: 'Returned result'
    } as any;

    matDialogSpy.open.and.returnValue({
      afterClosed: () => of(expectedResult)
    } as any);

    const result = await service.cotitularWithClientNumber(
      456,
      'ANOTHER_SIGNATURE',
      false,
      true,
      contentMock,
      { canDelete: false }
    );

    expect(matDialogSpy.open).toHaveBeenCalledTimes(1);
    expect(matDialogSpy.open).toHaveBeenCalledWith(
      ModalCotitularComponent,
      jasmine.objectContaining({
        panelClass: ['cotitular-modal'],
        disableClose: true,
        data: {
          hasClientNumber: true,
          content: contentMock,
          cotitularNumber: 456,
          signatureType: 'ANOTHER_SIGNATURE',
          readOnly: false,
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

    const result = await service.cotitularWithoutClientNumber(
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
