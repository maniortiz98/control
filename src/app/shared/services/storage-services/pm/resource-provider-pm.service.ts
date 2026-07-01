import { Injectable, signal } from '@angular/core';
import { ResourceProviderPm } from '../../../../onboarding/models/checkpoints/resources-provider-pm';

@Injectable({
  providedIn: 'root'
})
export class ResourceProviderPmService {

  private ResourceProviderPmSignal = signal<ResourceProviderPm | null>(null);

  constructor() {}

  get resourceProviderPm() {
    return this.ResourceProviderPmSignal.asReadonly();
  }

  setResourceProviderPm(item: ResourceProviderPm) {
    this.ResourceProviderPmSignal.set(item);
  }

  getResourceProviderPm(): ResourceProviderPm | null {
    return this.ResourceProviderPmSignal();
  }
}
