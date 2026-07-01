import { TestBed } from '@angular/core/testing';

import { ModalSearchClientService } from './modal-search-client.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';
import { ModalSearchClientComponent } from '../components/modals/modal-search-client/modal-search-client.component';
import { SearchCustomerSubmitForm } from '../components/search-customer/search-customer-submit-form';
import { SearchedClient } from '../../onboarding/models/searched-client';

describe('ModalSearchClientService', () => {
  let service: ModalSearchClientService;
  let dialogSpy: jasmine.SpyObj<MatDialog>;

  const mockContent: SearchedClient = {
      firstName: 'string',
      middleName: 'string',
      firstLastName: 'string',
      secondLastName: 'string',
      clientNumber: 123,
      rfc: '123',
      curp: '132',
      birthDate: '10-10-2026',
  }


  beforeEach(() => {
    const dialogRefSpyObj = jasmine.createSpyObj({
      afterClosed: of({ value: true, message: 'ok' })
    });

    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    dialogSpy.open.and.returnValue(dialogRefSpyObj as MatDialogRef<ModalSearchClientComponent>);

    TestBed.configureTestingModule({
      providers: [
        ModalSearchClientService,
        { provide: MatDialog, useValue: dialogSpy }
      ]
    });
    service = TestBed.inject(ModalSearchClientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('searchClient() should return result when modal is confirmed', async () => {
    dialogSpy.open.and.returnValue({ afterClosed: () => of(mockContent) } as any);
    const result = await service.searchClient();
    expect(result).toEqual(mockContent);
  });

  it('searchClient() should return undefined when modal is closed without confirm', async () => {
    dialogSpy.open.and.returnValue({ afterClosed: () => of(undefined) } as any);
    const result = await service.searchClient();
    expect(result).toBeUndefined();
  });

});
