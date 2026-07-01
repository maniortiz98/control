import { inject, Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { RequestWfUpdate, ResponceWfUpdate } from "../models/inbox/inboxData";
import { environment } from "../../../environments/environment";
import { HttpClientService } from "../../core/services/http-client.service";

@Injectable({
  providedIn: 'root'
})

export class UpdateService {
  private readonly url: any = environment.api.updateStatus;
  private readonly httpClientService = inject(HttpClientService);

  update(body: RequestWfUpdate): Observable<ResponceWfUpdate> {
    const data = this.httpClientService.post<ResponceWfUpdate>(this.url, JSON.stringify(body)).pipe();
    return data;
  }
}
