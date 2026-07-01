import { Injectable, signal } from '@angular/core';
import { OrganizationChartSection } from '../../../../onboarding/models/hieratic-level';

@Injectable({
  providedIn: 'root'
})
export class OrganizationChartService {

  private organizationChartSectionSignal = signal<OrganizationChartSection | null>(null);

  constructor() {}

  get organizationChartSection() {
    return this.organizationChartSectionSignal.asReadonly();
  }

  setOrganizationChartSection(item: OrganizationChartSection) {
    this.organizationChartSectionSignal.set(item);
  }

  getOrganizationChartSection(): OrganizationChartSection | null {
    return this.organizationChartSectionSignal();
  }

  clearOrganizationChartSection(){
    this.organizationChartSectionSignal.set(null);
  }
}
