import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { TiProfileService } from './ti-profile.service';
import { CatalogsService } from './catalogs.service';

describe('TiProfileService', () => {
  let service: TiProfileService;
  let catalogsServiceSpy: jasmine.SpyObj<CatalogsService>;

  const originResourcesMock = [
    { rangeId: '1', description: 'Recurso 1' },
    { rangeId: '2', description: 'Recurso 2' },
  ] as any;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('CatalogsService', ['getOriginResource']);

    TestBed.configureTestingModule({
      providers: [
        TiProfileService,
        { provide: CatalogsService, useValue: spy }
      ]
    });

    catalogsServiceSpy = TestBed.inject(CatalogsService) as jasmine.SpyObj<CatalogsService>;
    catalogsServiceSpy.getOriginResource.and.returnValue(of(originResourcesMock));

    service = TestBed.inject(TiProfileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(service.serviceName).toBe('PF service');
    expect(service.investmentProfile()).toEqual({});
    expect(service.maintenanceQuiz()).toEqual({});
    expect(service.investmentProfileQuiz()).toEqual({});
    expect(service.transactionalProfile()).toEqual({});
    expect(service.transactionalResources()).toEqual([]);
    expect(service.investmentQuizId()).toBeNull();
    expect(service.profileRating()).toBeNull();
    expect(service.investmentQuizCompleted()).toBeFalse();
    expect(service.onWorkFlow()).toBeFalse();
  });

  it('should call getOriginResource on constructor', () => {
    expect(catalogsServiceSpy.getOriginResource).toHaveBeenCalledWith({
      full: true,
      rangeId: '1'
    });
  });

  it('getAnswer should return a number when string is numeric', () => {
    expect(service.getAnswer('123')).toBe(123);
  });

  it('getAnswer should return a string when value is not numeric', () => {
    expect(service.getAnswer('ABC')).toBe('ABC');
  });

  it('getResourceText should return the matching description', () => {
    expect(service.getResourceText('1')).toBe('Recurso 1');
    expect(service.getResourceText('2')).toBe('Recurso 2');
  });

  it('getResourceText should return empty string when resource is not found', () => {
    expect(service.getResourceText('999')).toBe('');
  });

  it('setItem should set investmentProfile, profileRating, transactionalProfile and transactionalResources', () => {
    const dataMock = {
      customerType: 'PERSONA_FISICA',
      customerSubtype: 'SUBTYPE_1',
      investmentProfile: 3,
      manageInvestmentsVia: 'ONLINE',
      questionnaire: [
        { idQuestion: '100', idAnswer: '200' },
        { idQuestion: '101', idAnswer: 'ABC' }
      ],
      originResource: [
        { idOriginResource: '1', percentage: 60 },
        { idOriginResource: '2', percentage: 40 }
      ]
    } as any;

    service.setItem(dataMock);

    expect(service.investmentProfile()).toEqual({
      service: 'PERSONA_FISICA',
      subtype: 'SUBTYPE_1',
      profileRating: 3
    });

    expect(service.profileRating()).toBe(3);

    expect(service.transactionalProfile()).toEqual({
      100: 200,
      101: 'ABC',
      13032: 'ONLINE'
    });

    expect(service.transactionalResources() as any).toEqual([
      {
        type: '1',
        text: 'Recurso 1',
        percentage: 60
      },
      {
        type: '2',
        text: 'Recurso 2',
        percentage: 40
      }
    ]);
  });

  it('clear should reset all signals to their initial values', () => {
    const dataMock = {
      customerType: 'PERSONA_FISICA',
      customerSubtype: 'SUBTYPE_1',
      investmentProfile: 3,
      manageInvestmentsVia: 'ONLINE',
      questionnaire: [
        { idQuestion: '100', idAnswer: '200' }
      ],
      originResource: [
        { idOriginResource: '1', percentage: 60 }
      ]
    } as any;

    service.setItem(dataMock);
    service.clear();

    expect(service.investmentProfile()).toEqual({});
    expect(service.maintenanceQuiz()).toEqual({});
    expect(service.investmentProfileQuiz()).toEqual({});
    expect(service.transactionalProfile()).toEqual({});
    expect(service.transactionalResources()).toEqual([]);
    expect(service.investmentQuizId()).toBeNull();
    expect(service.profileRating()).toBeNull();
    expect(service.investmentQuizCompleted()).toBeFalse();
  });
});
