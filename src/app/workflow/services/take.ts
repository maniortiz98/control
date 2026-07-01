import { inject, Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { RequestWfTake, ResponceWfTake } from "../models/inbox/inboxData";
import { environment } from "../../../environments/environment";
import { HttpClientService } from "../../core/services/http-client.service";

@Injectable({
  providedIn: 'root'
})

export class TakeService {
  private readonly url: any = environment.api.take;
  private readonly httpClientService = inject(HttpClientService);

  take(body: RequestWfTake): Observable<ResponceWfTake> {
    const data = this.httpClientService.post<ResponceWfTake>(this.url, JSON.stringify(body)).pipe();
    return data;
  }
}
