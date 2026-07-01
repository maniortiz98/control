import { Injectable, signal } from '@angular/core';
import { EntityStatusSection } from '../../../../onboarding/models/entity-status';

@Injectable({
  providedIn: 'root'
})
export class EntityStatusService {

  constructor() { }

  private readonly entityStatus = signal<EntityStatusSection | null>(null);

  get entityStatusPm() {
    return this.entityStatus.asReadonly();
  }

  setEntityStatusPm(item: EntityStatusSection) {
    this.entityStatus.set(item);
  }

  getEntityStatusPm(): EntityStatusSection | null {
    return this.entityStatus();
  }

  clearEntityStatusPm() {
    this.entityStatus.set(null);
  }
}
