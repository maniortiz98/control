import { TestBed } from '@angular/core/testing';

import { OrganizationChartService } from './organization-chart.service';
import { OrganizationChartSection } from '../../../../onboarding/models/hieratic-level';

describe('OrganizationChartService', () => {
  let service: OrganizationChartService;

  const mockOrganizationChart: OrganizationChartSection = {
    firstName: 'A',
    secondName: 'B',
    firstLastName: 'AA',
    secondLastName: 'BB',
    hieraticLevelTable: []
  }
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrganizationChartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have initial value null in signal', () => {
    expect(service.organizationChartSection()).toBeNull();
  });

  it('should store a SingSection with signal readonly', () => {
    service.setOrganizationChartSection(mockOrganizationChart);
    expect(service.organizationChartSection()).toEqual(mockOrganizationChart);
  });

  it('should store a SingSection with signal', () => {
    service.setOrganizationChartSection(mockOrganizationChart);
    expect(service.getOrganizationChartSection()).toEqual(mockOrganizationChart);
  });
});
