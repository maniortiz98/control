import { inject, Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { environment } from "../../../environments/environment";
import { HttpClientService } from "../../core/services/http-client.service";
import { RequestWorkflowAssignmentDetail, WorkflowAssignmentDetail } from "../models/contractApproval/detail";

@Injectable({
  providedIn: 'root'
})

export class DetailService {
  private readonly url: any = environment.api.detail;
  private readonly httpClientService = inject(HttpClientService);

  getDetailWF(body: RequestWorkflowAssignmentDetail): Observable<WorkflowAssignmentDetail> {
    console.log(body)
    const data = this.httpClientService.post<WorkflowAssignmentDetail>(this.url, JSON.stringify(body)).pipe();
    return data;
  }
}