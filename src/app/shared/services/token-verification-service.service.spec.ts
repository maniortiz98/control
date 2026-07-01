import { TestBed } from '@angular/core/testing';

import { TokenVerificationServiceService } from './token-verification-service.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';
import { ModalTokenVerificationComponent } from '../components/modals/modal-token-verification/modal-token-verification.component';

describe('TokenVerificationServiceService', () => {
  let service: TokenVerificationServiceService;
  let dialogSpy: jasmine.SpyObj<MatDialog>;

  beforeEach(() => {
    const dialogRefSpyObj = jasmine.createSpyObj({
      afterClosed: of({ value: true, message: 'ok' })
    });

    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    dialogSpy.open.and.returnValue(dialogRefSpyObj as MatDialogRef<ModalTokenVerificationComponent>);

    TestBed.configureTestingModule({
      providers: [
        TokenVerificationServiceService,
        { provide: MatDialog, useValue: dialogSpy }
      ]
    });

    service = TestBed.inject(TokenVerificationServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('showModal() should return result when modal is confirmed', async () => {
    dialogSpy.open.and.returnValue({ afterClosed: () => of({message: 'ok'}) } as any);
    const result = await service.showModal('SMS', '1234', 6);
    expect(result).toEqual({message: 'ok'});
  });

  it('showModal() should return undefined when modal is closed without confirm', async () => {
    dialogSpy.open.and.returnValue({ afterClosed: () => of(undefined) } as any);
    const result = await service.showModal('SMS', '1234', 6);
    expect(result).toBeUndefined();
  });
});
