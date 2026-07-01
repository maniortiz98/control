import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';

import { ModalHomonymsServiceService } from './modal-homonyms-service.service';
import { HomonimiasComponent } from '../../onboarding/components/homonimias/homonimias.component';

describe('ModalHomonymsServiceService', () => {
  let service: ModalHomonymsServiceService;
  let matDialogSpy: jasmine.SpyObj<MatDialog>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('MatDialog', ['open']);

    TestBed.configureTestingModule({
      providers: [
        ModalHomonymsServiceService,
        { provide: MatDialog, useValue: spy }
      ]
    });

    service = TestBed.inject(ModalHomonymsServiceService);
    matDialogSpy = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should open modal with correct config and return afterClosed result', async () => {
    const expectedResult = { success: true };

    matDialogSpy.open.and.returnValue({
      afterClosed: () => of(expectedResult)
    } as any);

    const result = await service.formModalHomonyms();

    expect(matDialogSpy.open).toHaveBeenCalledTimes(1);
    expect(matDialogSpy.open).toHaveBeenCalledWith(
      HomonimiasComponent,
      jasmine.objectContaining({
        autoFocus: false,
        disableClose: true,
        minHeight: 'auto',
        maxHeight: '90vh',
        maxWidth: '90vw',
        minWidth: 'auto',
        panelClass: 'custom-dialog-border'
      })
    );
    expect(result).toEqual(expectedResult);
  });

  it('should return undefined when modal closes without value', async () => {
    matDialogSpy.open.and.returnValue({
      afterClosed: () => of(undefined)
    } as any);

    const result = await service.formModalHomonyms();

    expect(matDialogSpy.open).toHaveBeenCalledWith(
      HomonimiasComponent,
      jasmine.objectContaining({
        autoFocus: false,
        disableClose: true,
        minHeight: 'auto',
        maxHeight: '90vh',
        maxWidth: '90vw',
        minWidth: 'auto',
        panelClass: 'custom-dialog-border'
      })
    );
    expect(result).toBeUndefined();
  });
});
