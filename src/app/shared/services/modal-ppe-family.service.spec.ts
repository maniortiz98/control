import { TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { of } from 'rxjs';

import { ModalPpeFamilyService, Mantent } from './modal-ppe-family.service';
import { ModalPpeFamilyComponent } from '../components/modals/modal-ppe-family/modal-ppe-family.component';

describe('ModalPpeFamilyService', () => {
  let service: ModalPpeFamilyService;
  let matDialogSpy: jasmine.SpyObj<MatDialog>;

  const mantMock: Mantent = {
    isMainten: true,
    allDisabled: false,
    config: {} as any,
    fieldsDisabled: [],
    fieldsEnabled: [],
    butonsDisabled: []
  };

  const dataClientMock = {
    id: 1,
    name: 'Cliente Mock'
  } as any;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('MatDialog', ['open']);

    TestBed.configureTestingModule({
      providers: [
        ModalPpeFamilyService,
        { provide: MatDialog, useValue: spy }
      ]
    });

    service = TestBed.inject(ModalPpeFamilyService);
    matDialogSpy = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should open modal with correct config and return afterClosed()', (done) => {
    const afterClosedSpy = jasmine.createSpyObj('afterClosed', [], {
      subscribe: (fn: any) => fn(null)
    });

    matDialogSpy.open.and.returnValue({
      afterClosed: () => of(null)
    } as any);

    service.formModalDataPPE(mantMock, true, dataClientMock).subscribe(result => {
      expect(result).toBeNull();
      done();
    });

    expect(matDialogSpy.open).toHaveBeenCalledTimes(1);
    expect(matDialogSpy.open).toHaveBeenCalledWith(
      ModalPpeFamilyComponent,
      jasmine.objectContaining({
        autoFocus: false,
        disableClose: true,
        minHeight: 'auto',
        maxHeight: '80vh',
        maxWidth: '80vw',
        minWidth: 'auto',
        panelClass: 'custom-dialog-border',
        data: {
          showCountry: true,
          dataClient: dataClientMock,
          mant: mantMock
        }
      })
    );
  });

  it('should open modal with dataClient as undefined when not provided', (done) => {
    matDialogSpy.open.and.returnValue({
      afterClosed: () => of('closed')
    } as any);

    service.formModalDataPPE(mantMock, false).subscribe(result => {
      expect(result).toBe('closed');
      done();
    });

    expect(matDialogSpy.open).toHaveBeenCalledWith(
      ModalPpeFamilyComponent,
      jasmine.objectContaining({
        data: {
          showCountry: false,
          dataClient: undefined,
          mant: mantMock
        }
      })
    );
  });

  it('should return observable from dialogRef.afterClosed()', (done) => {
    const expectedValue = { ok: true };

    matDialogSpy.open.and.returnValue({
      afterClosed: () => of(expectedValue)
    } as any);

    service.formModalDataPPE(mantMock, true, dataClientMock).subscribe(result => {
      expect(result).toEqual(expectedValue);
      done();
    });
  });
});
