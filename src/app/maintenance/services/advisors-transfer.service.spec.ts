import { TestBed } from '@angular/core/testing';
import { firstValueFrom, of } from 'rxjs';

import { AdvisorsTransferService } from './advisors-transfer.service';
import { HttpClientService } from '../../core/services/http-client.service';
import { environment } from '../../../environments/environment';
import { AdvisorTransferContracts, AdvisorTransfersList } from '../models/advisors-transfer';

describe('AdvisorsTransferService', () => {
  let service: AdvisorsTransferService;
  let httpServiceSpy: jasmine.SpyObj<HttpClientService>;

  beforeEach(() => {
    httpServiceSpy = jasmine.createSpyObj<HttpClientService>('HttpClientService', ['post']);

    TestBed.configureTestingModule({
      providers: [
        AdvisorsTransferService,
        { provide: HttpClientService, useValue: httpServiceSpy },
      ],
    });

    service = TestBed.inject(AdvisorsTransferService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('contractsByCustomer should POST advisor id and return contracts', async () => {
    const advisorId = '99102';
    const expectedResponse: AdvisorTransferContracts[] = [
      {
        bankingArea: '999',
        contract: 7893456,
        fullName: 'Juan Perez',
        numClient: 123456,
        status: 'ACTIVE',
      },
    ];

    httpServiceSpy.post.and.returnValue(of(expectedResponse));

    const response = await firstValueFrom(service.contractsByCustomer(advisorId));

    expect(httpServiceSpy.post).toHaveBeenCalledWith(
      environment.api.maintenance.contractsAdvisor,
      { advisor: advisorId }
    );
    expect(response).toEqual(expectedResponse);
  });

  it('transferContracts should POST payload with fixed channel 722 and transfer list', async () => {
    const transferList: AdvisorTransfersList[] = [
      {
        bankingArea: '999',
        contract: '7893456',
        originPromoter: '62329',
        destinationPromoter: '62330',
      },
    ];
    const expectedResponse = { status: 'OK' };

    httpServiceSpy.post.and.returnValue(of(expectedResponse));

    const response = await firstValueFrom(service.transferContracts(transferList));

    expect(httpServiceSpy.post).toHaveBeenCalledWith(
      environment.api.maintenance.transferContracts,
      {
        channel: '722',
        transfer: transferList,
      }
    );
    expect(response).toEqual(expectedResponse);
  });

  it('transferContracts should support empty transfer list', async () => {
    const transferList: AdvisorTransfersList[] = [];
    const expectedResponse = { status: 'EMPTY_OK' };

    httpServiceSpy.post.and.returnValue(of(expectedResponse));

    const response = await firstValueFrom(service.transferContracts(transferList));

    expect(httpServiceSpy.post).toHaveBeenCalledWith(
      environment.api.maintenance.transferContracts,
      {
        channel: '722',
        transfer: [],
      }
    );
    expect(response).toEqual(expectedResponse);
  });
});
