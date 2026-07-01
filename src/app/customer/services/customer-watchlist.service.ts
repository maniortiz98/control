import { Injectable, inject, signal } from '@angular/core';
import { map, Observable } from 'rxjs';
import { CustomerWatchListBody, CustomerWatchListResponse, CustomerWatchList } from '../models/customer-watch-list';

import { HttpClientService } from '../../core/services/http-client.service';
import { environment } from '../../../environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { UnsavedChangesService } from '../../core/services/unsaved-changes.service';
import { CustomerNotificationModalService } from './customer-notification-modal.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerWatchlistService {

  private readonly httpClientService = inject(HttpClientService);
  private readonly url: any = environment.api.watchlist;
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly notificationModalService = inject(CustomerNotificationModalService);
  private readonly unsavedChangesService = inject(UnsavedChangesService);

  postData(body: CustomerWatchListBody): Observable<CustomerWatchList> {
    return this.httpClientService.post<CustomerWatchListResponse>(this.url, body).pipe(
      map((response: CustomerWatchListResponse) => {
        return response.payload;
      })
    );
  }

  // /**
  //  *
  //  * @param body
  //  * @returns
  //  */
  // validate(body: CustomerWatchListBody): boolean {
  //   this.httpClientService.post<CustomerWatchListResponse>(this.url, body)
  //     .subscribe((response: CustomerWatchListResponse) => {
  //       console.log(response.payload);

  //       const listData = response.payload;
  //       const watchListData = this.getListValues(listData);

  //       if ( 1 === listData?.step ) {

  //         this.unsavedChangesService.setUnsavedChanges(false);

  //         const title = 'El solicitante se encuentra en la lista ' + (watchListData[0] ?? '');
  //         const before = watchListData ?? [];

  //         this.notificationModalService.error({
  //           title: title,
  //           beforeMessages: before,
  //           afterMessages: ['Consultar con el área de PLD'],
  //           btnAccept: 'Terminar',
  //         }).then(() => {
  //           this.dialog.closeAll();
  //           this.router.navigate(['/'], { relativeTo: this.route.parent });
  //         });


  //       }

  //       else if ( 2 === listData?.step ) {

  //         this.unsavedChangesService.setUnsavedChanges(false);
  //         this.notificationModalService.warning({
  //           title: '¡Atención!',
  //           afterCopyMessages: ['Número de Prospecto'],
  //           infoToCopy: '011230',
  //           afterMessages: ['El Cliente en cuestión ha sido remitido al Área de PLD para su revisión.'],
  //         }).then(() => {
  //           this.dialog.closeAll();
  //           this.router.navigate(['/'], { relativeTo: this.route.parent });
  //         });

  //       }
  //     }
  //   );
  //   return true;
  // }

  // getListValues = (list?: CustomerWatchList) => list?.matchLists?.map(item => item.type) || [];
}


export type WatchlistService = CustomerWatchlistService;

