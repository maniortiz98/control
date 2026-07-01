import { of, firstValueFrom } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { ModalHomonymsPmServiceService } from './modal-homonyms-pm-service.service';
import { HomonymsPmComponent } from '../../onboarding/components/homonyms-pm/homonyms-pm.component';

describe('ModalHomonymsPmServiceService', () => {
  let service: ModalHomonymsPmServiceService;
  let matDialogSpy: jasmine.SpyObj<MatDialog>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<HomonymsPmComponent>>;

  beforeEach(() => {
    dialogRefSpy = jasmine.createSpyObj<MatDialogRef<HomonymsPmComponent>>('MatDialogRef', ['afterClosed']);
    matDialogSpy = jasmine.createSpyObj<MatDialog>('MatDialog', ['open']);

    dialogRefSpy.afterClosed.and.returnValue(of('continue'));
    matDialogSpy.open.and.returnValue(dialogRefSpy);

    TestBed.configureTestingModule({
      providers: [
        ModalHomonymsPmServiceService,
        { provide: MatDialog, useValue: matDialogSpy },
      ],
    });

    service = TestBed.inject(ModalHomonymsPmServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('formModalHomonyms should open the modal and resolve afterClosed value', async () => {
    const result = await service.formModalHomonyms();

    expect(matDialogSpy.open).toHaveBeenCalledWith(
      HomonymsPmComponent,
      jasmine.objectContaining({
        autoFocus: false,
        disableClose: true,
        minHeight: 'auto',
        maxHeight: '90vh',
        maxWidth: '90vw',
        minWidth: 'auto',
        panelClass: 'custom-dialog-border',
      })
    );
    expect(result).toBe('continue');
  });
});