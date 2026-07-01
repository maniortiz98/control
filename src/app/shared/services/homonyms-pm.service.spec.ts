import { of } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { HomonymsPmService } from './homonyms-pm.service';
import { ModalHomonymsComponent } from '../components/modals/modal-homonyms/modal-homonyms.component';

describe('HomonymsPmService', () => {
  let service: HomonymsPmService;
  let matDialogSpy: jasmine.SpyObj<MatDialog>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<ModalHomonymsComponent>>;

  beforeEach(() => {
    dialogRefSpy = jasmine.createSpyObj<MatDialogRef<ModalHomonymsComponent>>('MatDialogRef', ['afterClosed', 'close']);
    matDialogSpy = jasmine.createSpyObj<MatDialog>('MatDialog', ['open']);

    dialogRefSpy.afterClosed.and.returnValue(of(null));
    matDialogSpy.open.and.returnValue(dialogRefSpy);

    TestBed.configureTestingModule({
      providers: [
        HomonymsPmService,
        { provide: MatDialog, useValue: matDialogSpy },
      ],
    });

    service = TestBed.inject(HomonymsPmService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('homonimiaModal should open the modal with the received dataClient', async () => {
    const dataClient = [{ clientNumber: '12345' }] as any;

    const result = await service.homonimiaModal(dataClient).toPromise();

    expect(matDialogSpy.open).toHaveBeenCalledWith(
      ModalHomonymsComponent,
      jasmine.objectContaining({
        disableClose: true,
        minHeight: 'auto',
        maxHeight: '80vh',
        maxWidth: '80vw',
        minWidth: 'auto',
        panelClass: 'custom-dialog-border',
        data: { dataClient },
      })
    );
    expect(result).toBeNull();
    expect(service.getDialogRef()).toBe(dialogRefSpy);
  });

  it('closeModal should close the dialog and clear the stored reference', async () => {
    dialogRefSpy.afterClosed.and.returnValue(of('continue'));
    await service.homonimiaModal([{ clientNumber: '12345' }] as any).toPromise();

    service.closeModal();

    expect(dialogRefSpy.close).toHaveBeenCalled();
    expect(service.getDialogRef()).toBeNull();
  });

  it('closeModal should do nothing when there is no dialog ref', () => {
    service.closeModal();

    expect(dialogRefSpy.close).not.toHaveBeenCalled();
    expect(service.getDialogRef()).toBeNull();
  });
});

describe('HomonymsPmService', () => {
  let service: HomonymsPmService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HomonymsPmService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
