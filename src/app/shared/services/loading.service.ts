import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  private _loading = signal(false);
  readonly loading = this._loading.asReadonly();

  private requestCount = 0;

  show(): void {
    this.requestCount++;
    this._loading.set(true);
  }

  hide(): void {
    this.requestCount = Math.max(0, this.requestCount - 1);
    if ( 0 === this.requestCount ) {
      this._loading.set(false);
    }
  }
}
