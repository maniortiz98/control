import { inject, Injectable } from "@angular/core";
import { delay, Observable, of } from "rxjs";
import { ResponceWfUpdate } from "../models/inbox/inboxData";
import { environment } from "../../../environments/environment";
import { HttpClientService } from "../../core/services/http-client.service";
import { WorkFlowAssignmentHomo } from "../models/homoPf/appproval-homo-pf";

@Injectable({
  providedIn: 'root'
})

export class ApprovalHomoPfService {
  private readonly url: any = environment.api.approvalHomoPf;
  private readonly httpClientService = inject(HttpClientService);

  update(body: WorkFlowAssignmentHomo): Observable<ResponceWfUpdate> {
    const data = this.httpClientService.post<ResponceWfUpdate>(this.url, JSON.stringify(body)).pipe();
    return data;
  }
}
