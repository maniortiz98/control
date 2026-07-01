import { Injectable, inject } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable, map } from 'rxjs';
import { HttpClientService } from '../../../core/services/http-client.service';
import { ApisServices } from '../../types/catalogs.type';

export interface NotificationRequest {
    clientId     : string;
    accountId    : string;
    notifications: string[];
}

export interface NotificationResponse {
    status: string;
    message?: string;
}

@Injectable({
    providedIn: 'root'
})
export class NotificationService {

    private readonly urls = environment.api.services;

    private readonly httpClientService = inject(HttpClientService);

    sendNotifications(
        api: ApisServices,
        body: NotificationRequest
    ): Observable<NotificationResponse> {

        return this.httpClientService
            .post(this.urls[api], body)
            .pipe(
                map((response: any) => response as NotificationResponse)
            );
    }
}