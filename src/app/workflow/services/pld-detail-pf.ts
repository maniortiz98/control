import { inject, Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { environment } from "../../../environments/environment";
import { HttpClientService } from "../../core/services/http-client.service";
import { RequestWorkflowAssignmentDetail } from "../models/contractApproval/detail";
import { ApplicationData } from "../models/pldPf/pld-pf-detail";

@Injectable({
  providedIn: 'root'
})

export class DetailServicePldPf {
  private readonly url: any = environment.api.detailPld;
  private readonly httpClientService = inject(HttpClientService);

  getDetailWFPldPf(body: RequestWorkflowAssignmentDetail): Observable<ApplicationData> {
    const data = this.httpClientService.post<ApplicationData>(this.url, JSON.stringify(body)).pipe();
    return data;
  }
}
