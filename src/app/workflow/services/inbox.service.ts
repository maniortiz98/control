import { inject, Injectable } from "@angular/core";
import { map, Observable, of } from "rxjs";
import { AssignmentDetail, RequestWF } from '../models/inbox/inboxData';
import { environment } from "../../../environments/environment";
import { HttpClientService } from "../../core/services/http-client.service";

@Injectable({
  providedIn: 'root'
})

export class InboxService {
  private readonly url: any = environment.api.assignmentDetail;
  private readonly httpClientService = inject(HttpClientService);

  getTask(body: RequestWF): Observable<AssignmentDetail[]> {
    //TODO habilitar cuando este arriba
    const data = this.httpClientService.post<AssignmentDetail[]>(this.url, JSON.stringify(body)).pipe();
    return data;
  }
}
