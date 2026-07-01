import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalSearchClientComponent } from '../components/modals/modal-search-client/modal-search-client.component';
import { firstValueFrom, Observable } from 'rxjs';
import { SearchCustomerSubmitForm } from '../components/search-customer/search-customer-submit-form';
import { SearchedClient } from '../../onboarding/models/searched-client';

@Injectable({
  providedIn: 'root'
})
export class ModalSearchClientService {

  constructor(private readonly dialog: MatDialog) {
  }

  async searchClient(): Promise<SearchedClient | null> {
    return firstValueFrom(this.callSearchClientModal())
  }

  private callSearchClientModal(): Observable<SearchedClient | null> {
    const message = 'test';
    const dialogRef = this.dialog.open(ModalSearchClientComponent, {
      disableClose: true,
      maxWidth: '100vw',
      minWidth: '950px',
      width: '60vw',
      height: '80vh',
      data: {
        message,
      }
    });
    return dialogRef.afterClosed();
  }

}
