import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClientService } from '../../core/services/http-client.service';
import { Observable } from 'rxjs';
import { AccountDocumentKit, AccountDocumentKitRequest } from '../../onboarding/models/account-document-kit';

@Injectable({
  providedIn: 'root'
})
export class AccountDocumentKitService {

  private readonly httpService = inject(HttpClientService);
  private readonly url: any = environment.api.catalogs.accountDocumentKit;

  constructor() { }

  /**
  *
  */
  getDocuments(body: AccountDocumentKitRequest): Observable<AccountDocumentKit[]> {
     return this.httpService.post<AccountDocumentKit[]>(this.url, body);
  }

}
