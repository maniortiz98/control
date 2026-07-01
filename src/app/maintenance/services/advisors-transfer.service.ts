import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClientService } from '../../core/services/http-client.service';
import { environment } from '../../../environments/environment';
import { AdvisorTransferContracts, AdvisorTransfersList } from '../models/advisors-transfer';

@Injectable({
  providedIn: 'root'
})
export class AdvisorsTransferService {

  private readonly httpService = inject(HttpClientService);
  private readonly urls: any = {
    contractsAdvisor : environment.api.maintenance.contractsAdvisor,
    transferContracts: environment.api.maintenance.transferContracts,
  };

  constructor() { }

  /**
   *curl --location 'https://develop-act.amarello.cloud/customers/advisor/contracts' \
    --header 'Content-Type: application/json' \
    --header 'Authorization: Bearer TgGcBlyhEhnEGDknuaPHuPY2ra5h' \
    --data '{
      "advisor": "99102"
    }'
   */
  contractsByCustomer(advisorId: string): Observable<AdvisorTransferContracts[]> {
    return this.httpService.post(this.urls.contractsAdvisor, {advisor: advisorId});
  }

  /**
   * curl --location 'https://develop-act.amarello.cloud/customers/transferContracts' \
    --header 'Content-Type: application/json' \
    --header 'Authorization: Bearer 8LtB3kEJkBSkP62r0XJGtlKgWvuo' \
    --data '
    {
      "channel": "722",
      "transfer":[
    {
      "bankingArea": "999",
      "contract": "7893456",
      "originPromoter": "62329",
      "destinationPromoter": "62329"
    }
      ]
    }
    '
   */
  transferContracts(transfer: Array<AdvisorTransfersList>): Observable<any> {
    // {
    //   "channel": "722",
    //   "transfer":[
    //     {
    //       "bankingArea": "999",
    //       "contract": "7893456",
    //       "originPromoter": "62329",
    //       "destinationPromoter": "62329"
    //     }
    //   ]
    // }
    const bodyp: {
      channel: string;
      transfer: AdvisorTransfersList[]
    } = {
      channel: '722',
      transfer
    };
    return this.httpService.post(this.urls.transferContracts, bodyp);
  }
}
