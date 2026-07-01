import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { CustomerCatalogsService } from './customer-catalogs.service';
import { LocalStorageService } from '../../core/services/local-storage.service';
import { HttpClientService } from '../../core/services/http-client.service';

describe('CustomerCatalogsService', () => {
  let service: CustomerCatalogsService;
  let mockStorage: jasmine.SpyObj<LocalStorageService>;
  let mockHttp: jasmine.SpyObj<HttpClientService>;

  const TODAY = new Date().toISOString().slice(0, 10).replace(/-/g, '');

  beforeEach(() => {
    mockStorage = jasmine.createSpyObj('LocalStorageService', [
      'getCatalog',
      'setCatalog',
      'getSeparatedByIdCatalog',
      'setSeparatedByIdCatalog',
      'getContracts',
      'setContracts',
      'getSubcontracts',
      'setSubcontracts',
      'getClassificationPersonByPersonType',
      'setClassificationPersonByPersonType'
    ]);

    mockHttp = jasmine.createSpyObj('HttpClientService', [
      'post',
      'get',
      'put',
      'delete'
    ]);

    TestBed.configureTestingModule({
      providers: [
        CustomerCatalogsService,
        { provide: LocalStorageService, useValue: mockStorage },
        { provide: HttpClientService, useValue: mockHttp }
      ]
    });

    service = TestBed.inject(CustomerCatalogsService);
  });

  // ========================
  // HELPERS
  // ========================
  const mockLS = (data: any[], updatedAt: string = TODAY) => ({
    data,
    updatedAt
  });

  const testStandardFlow = (methodFn: () => any, catalogName: string) => {

    it(`${catalogName} -> API cuando no hay cache`, (done) => {
      mockStorage.getCatalog.and.returnValue(mockLS([]));
      mockHttp.post.and.returnValue(of([{ id: 1 }]));

      methodFn().subscribe((res: any) => {
        expect(mockHttp.post).toHaveBeenCalled();
        expect(mockStorage.setCatalog).toHaveBeenCalled();
        expect(res.length).toBe(1);
        done();
      });
    });

    it(`${catalogName} -> usa cache del día`, (done) => {
      mockStorage.getCatalog.and.returnValue(mockLS([{ id: 1 }]));

      methodFn().subscribe((res: any) => {
        expect(mockHttp.post).not.toHaveBeenCalled();
        expect(res.length).toBe(1);
        done();
      });
    });

    it(`${catalogName} -> refresh en background`, (done) => {
      mockStorage.getCatalog.and.returnValue(mockLS([{ id: 1 }], '20200101'));
      mockHttp.post.and.returnValue(of([{ id: 2 }]));

      methodFn().subscribe((res: any) => {
        expect(res.length).toBe(1);
        expect(mockHttp.post).toHaveBeenCalled();
        done();
      });
    });
  };

  // ========================
  // TESTS GENERICOS (FIXED)
  // ========================
  describe('Catálogos estándar', () => {

    testStandardFlow(() => service.getAccountRole({} as any), 'accountRole');
    testStandardFlow(() => service.getAccountType({} as any), 'accountType');
    testStandardFlow(() => service.getAddressRole({} as any), 'addressRole');
    testStandardFlow(() => service.getAuthorizedPerson({} as any), 'authorizedPerson');
    testStandardFlow(() => service.getClientKnowledge({} as any), 'clientKnowledge');
    testStandardFlow(() => service.getClientNoGuaranteedIpab({} as any), 'clientNoGuaranteedIpab');
    testStandardFlow(() => service.getCurrencyType({} as any), 'currencyType');
    testStandardFlow(() => service.getDocumentType({} as any), 'documentType');
    testStandardFlow(() => service.getFiscalCertificate({} as any), 'fiscalCertificate');
    testStandardFlow(() => service.getInvestmentType({} as any), 'investmentType');
    testStandardFlow(() => service.getPersonRole({} as any), 'personRole');
    testStandardFlow(() => service.getProfileInvestment({} as any), 'profileInvestment');
    testStandardFlow(() => service.getPropertyType({} as any), 'propertyType');
    testStandardFlow(() => service.getResidentialArea({} as any), 'residentialArea');
    testStandardFlow(() => service.getSector({} as any), 'sector');
    testStandardFlow(() => service.getServiceType({} as any), 'serviceType');
    testStandardFlow(() => service.getServiceSubtype({} as any), 'serviceSubtype');
    testStandardFlow(() => service.getSignatureType({} as any), 'signatureType');

  });

  // ========================
  // CASOS ESPECIALES
  // ========================

  describe('getBank', () => {

    it('usa cache por id', (done) => {
      mockStorage.getSeparatedByIdCatalog.and.returnValue({
        'mx': { data: [{ id: 1 }], updatedAt: TODAY }
      });

      service.getBank({ country: 'mx' } as any).subscribe(res => {
        expect(res.length).toBe(1);
        done();
      });
    });

    it('llama API si no hay cache', (done) => {
      mockStorage.getSeparatedByIdCatalog.and.returnValue({});
      mockHttp.post.and.returnValue(of([{ id: 2 }]));

      service.getBank({ country: 'mx' } as any).subscribe(() => {
        expect(mockHttp.post).toHaveBeenCalled();
        done();
      });
    });

  });

  describe('getCfdi', () => {
    it('llama API correctamente', (done) => {
      mockStorage.getSeparatedByIdCatalog.and.returnValue({});
      mockHttp.post.and.returnValue(of({
        payload: { cfdi: { item: [{ id: 1 }] } }
      }));

      service.getCfdi({ personType: 1, fiscalRegimeId: 2 } as any)
        .subscribe(res => {
          expect(res.length).toBe(1);
          done();
        });
    });
  });

  describe('getClassificationPerson', () => {

    it('usa local', (done) => {
      mockStorage.getClassificationPersonByPersonType.and.returnValue([{ id: 1 }]);

      service.getClassificationPerson({ personType: '1' } as any)
        .subscribe(res => {
          expect(res.length).toBe(1);
          done();
        });
    });

    it('llama API', (done) => {
      mockStorage.getClassificationPersonByPersonType.and.returnValue([]);
      mockHttp.post.and.returnValue(of({
        payload: {
          personType: {
            item: [{ personTypeId: '1' }]
          }
        }
      }));

      service.getClassificationPerson({ personType: '1' } as any)
        .subscribe(res => {
          expect(mockStorage.setClassificationPersonByPersonType).toHaveBeenCalled();
          done();
        });
    });

  });

  describe('CRUD equity', () => {

    it('create', () => {
      mockHttp.post.and.returnValue(of({}));
      service.createStrategyEquity({} as any).subscribe();
      expect(mockHttp.post).toHaveBeenCalled();
    });

    it('update', () => {
      mockHttp.put.and.returnValue(of({}));
      service.updateStrategyEquity({} as any).subscribe();
      expect(mockHttp.put).toHaveBeenCalled();
    });

    it('delete', () => {
      mockHttp.delete.and.returnValue(of({}));
      service.deleteStrategyEquity(1).subscribe();
      expect(mockHttp.delete).toHaveBeenCalled();
    });

  });

  describe('top3Contracts', () => {
    it('ordena top 3', () => {
      const input = [
        { ranking: 3 },
        { ranking: 1 },
        { ranking: 2 },
        { ranking: 5 }
      ] as any;

      const result = service.top3Contracts(input);

      expect(result.map(r => r.ranking)).toEqual([1, 2, 3]);
    });
  });

  describe('getStrategiesEquity', () => {

    const catalogName = 'strategiesEquity';

    it('FORCE REFRESH -> debe llamar API y sobreescribir cache', (done) => {
      const apiResponse = [{
        idStrategy: 1,
        cveStrategy: '1',
        description: '1',
        active: true,
        minimumAmount: 1,
      }];

      mockStorage.getCatalog.and.returnValue({ data: [], updatedAt: '' });
      mockHttp.get.and.returnValue(of(apiResponse));

      service.getStrategiesEquity(true).subscribe((res) => {
        expect(mockHttp.get).toHaveBeenCalledWith(jasmine.anything());
        expect(mockStorage.setCatalog).toHaveBeenCalledWith(catalogName, apiResponse);
        expect(res).toEqual(apiResponse);
        done();
      });
    });

    it('SIN CACHE -> debe llamar API y guardar', (done) => {
      const apiResponse = [{
        idStrategy: 1,
        cveStrategy: '1',
        description: '1',
        active: true,
        minimumAmount: 1,
      }];

      mockStorage.getCatalog.and.returnValue({ data: [], updatedAt: '' });
      mockHttp.get.and.returnValue(of(apiResponse));

      service.getStrategiesEquity().subscribe((res) => {
        expect(mockHttp.get).toHaveBeenCalled();
        expect(mockStorage.setCatalog).toHaveBeenCalledWith(catalogName, apiResponse);
        expect(res).toEqual(apiResponse);
        done();
      });
    });

    it('CACHE DEL MISMO DIA -> NO debe llamar API', (done) => {
      const cached = [{
        idStrategy: 1,
        cveStrategy: '1',
        description: '1',
        active: true,
        minimumAmount: 1,
      }];

      mockStorage.getCatalog.and.returnValue({
        data: cached,
        updatedAt: new Date().toISOString().slice(0, 10).replace(/-/g, '')
      });

      service.getStrategiesEquity().subscribe((res) => {
        expect(mockHttp.get).not.toHaveBeenCalled();
        expect(res).toEqual(cached);
        done();
      });
    });

    it('CACHE VIEJO -> debe regresar cache pero refrescar en background', (done) => {
      const cached = [{
        idStrategy: 1,
        cveStrategy: '1',
        description: '1',
        active: true,
        minimumAmount: 1,
      }];
      const fresh = [{
        idStrategy: 2,
        cveStrategy: '2',
        description: '2',
        active: true,
        minimumAmount: 2,
      }];

      mockStorage.getCatalog.and.returnValue({
        data: cached,
        updatedAt: '20200101'
      });

      mockHttp.get.and.returnValue(of(fresh));

      service.getStrategiesEquity().subscribe((res) => {
        expect(res).toEqual(cached);
        expect(mockHttp.get).toHaveBeenCalled();
        expect(mockStorage.setCatalog).toHaveBeenCalledWith(catalogName, fresh);

        done();
      });
    });

  });

  describe('getTransactionLimits', () => {

    const catalogName = 'transactionalLimits';

    it('SIN CACHE -> debe llamar API y guardar en localStorage', (done) => {
      const apiResponse = [
        {
          transactionalLimitId: 1,
          transactionalLimitCode: 'A',
          transactionalLimit: 'LIMIT A',
          active: 'Y',
          created: '2024-01-01',
          modified: null
        }
      ];

      mockStorage.getCatalog.and.returnValue({ data: [], updatedAt: '' });
      mockHttp.post.and.returnValue(of(apiResponse));

      service.getTransactionLimits().subscribe((res) => {
        expect(mockHttp.post).toHaveBeenCalledWith(jasmine.anything(), {});
        expect(mockStorage.setCatalog).toHaveBeenCalledWith(catalogName, apiResponse);
        expect(res).toEqual(apiResponse);
        done();
      });
    });

    it('CACHE DEL MISMO DIA -> NO debe llamar API', (done) => {
      const cached = [
        {
          transactionalLimitId: 1,
          transactionalLimitCode: 'A',
          transactionalLimit: 'LIMIT A',
          active: 'Y',
          created: '2024-01-01',
          modified: null
        }
      ];

      mockStorage.getCatalog.and.returnValue({
        data: cached,
        updatedAt: new Date().toISOString().slice(0, 10).replace(/-/g, '')
      });

      service.getTransactionLimits().subscribe((res) => {
        expect(mockHttp.post).not.toHaveBeenCalled();
        expect(res).toEqual(cached);
        done();
      });
    });

    it('CACHE VIEJO -> debe regresar cache y refrescar en background', (done) => {
      const cached = [
        {
          transactionalLimitId: 1,
          transactionalLimitCode: 'A',
          transactionalLimit: 'OLD',
          active: 'Y',
          created: '2024-01-01',
          modified: null
        }
      ];

      const fresh = [
        {
          transactionalLimitId: 2,
          transactionalLimitCode: 'B',
          transactionalLimit: 'NEW',
          active: 'Y',
          created: '2024-02-01',
          modified: null
        }
      ];

      mockStorage.getCatalog.and.returnValue({
        data: cached,
        updatedAt: '20200101'
      });

      mockHttp.post.and.returnValue(of(fresh));

      service.getTransactionLimits().subscribe((res) => {
        expect(res).toEqual(cached);
        expect(mockHttp.post).toHaveBeenCalled();
        expect(mockStorage.setCatalog).toHaveBeenCalledWith(catalogName, fresh);
        done();
      });
    });

    it('CACHE VIEJO -> debe enviar context NO_LOADING en background', (done) => {
      const cached = [{ transactionalLimitId: 1 }] as any[];
      const fresh = [{ transactionalLimitId: 2 }] as any[];

      mockStorage.getCatalog.and.returnValue({
        data: cached,
        updatedAt: '20200101'
      });

      mockHttp.post.and.returnValue(of(fresh));

      service.getTransactionLimits().subscribe(() => {
        expect(mockHttp.post).toHaveBeenCalledWith(
          jasmine.anything(),
          {},
          jasmine.objectContaining({
            context: jasmine.anything()
          })
        );
        done();
      });
    });

  });

  describe('getTaxId', () => {

    const catalogName = 'taxId';

    const mockBody = {
      idIdentificacionfiscalCve: ['A']
    };

    const buildItem = (id = 'A'): any => ({
      idIdentificacionfiscalCve: id,
      identificacionFiscal: `RFC-${id}`
    });

    it('SIN CACHE -> debe llamar API y guardar en localStorage', (done) => {
      const apiResponse = [buildItem('A')];

      mockStorage.getCatalog.and.returnValue({
        data: [],
        updatedAt: ''
      });

      mockHttp.post.and.returnValue(of(apiResponse));

      service.getTaxId(mockBody).subscribe((res) => {
        expect(mockHttp.post).toHaveBeenCalledWith(
          jasmine.anything(),
          mockBody
        );
        expect(mockStorage.setCatalog).toHaveBeenCalledWith(catalogName, apiResponse);
        expect(res).toEqual(apiResponse);
        done();
      });
    });

    it('CACHE DEL MISMO DIA -> NO debe llamar API y regresa cache', (done) => {
      const cached = [buildItem('A')];

      mockStorage.getCatalog.and.returnValue({
        data: cached,
        updatedAt: new Date().toISOString().slice(0, 10).replace(/-/g, '')
      });

      service.getTaxId(mockBody).subscribe((res) => {
        expect(mockHttp.post).not.toHaveBeenCalled();
        expect(res).toEqual(cached);
        done();
      });
    });

    it('CACHE VIEJO -> regresa cache pero refresca en background', (done) => {
      const cached = [buildItem('A')];
      const fresh = [buildItem('B')];

      mockStorage.getCatalog.and.returnValue({
        data: cached,
        updatedAt: '20200101'
      });

      mockHttp.post.and.returnValue(of(fresh));

      service.getTaxId(mockBody).subscribe((res) => {
        expect(res).toEqual(cached);
        expect(mockHttp.post).toHaveBeenCalled();
        expect(mockStorage.setCatalog).toHaveBeenCalledWith(catalogName, fresh);
        done();
      });
    });

    it('CACHE VIEJO -> debe llamar API con context NO_LOADING', (done) => {
      const cached = [buildItem('A')];
      const fresh = [buildItem('B')];

      mockStorage.getCatalog.and.returnValue({
        data: cached,
        updatedAt: '20200101'
      });

      mockHttp.post.and.returnValue(of(fresh));

      service.getTaxId(mockBody).subscribe(() => {
        expect(mockHttp.post).toHaveBeenCalledWith(
          jasmine.anything(),
          mockBody,
          jasmine.objectContaining({
            context: jasmine.anything()
          })
        );
        done();
      });
    });

  });

  describe('getSubContract', () => {

    const body = {
      personTypeId: 1,
      contractTypeId: 10
    };

    const buildItem = (id: number): any => ({
      contractTypeId: 10,
      contractSubtypeId: id,
      contractSubtype: `SUB-${id}`,
      ranking: id
    });

    it('SIN CACHE -> debe llamar API y guardar en localStorage', (done) => {
      const apiResponse = [buildItem(1), buildItem(2)];
      (service as any).urls = {
        'customer-subcontract': '/mock-url'
      };

      mockStorage.getSubcontracts.and.returnValue([]);
      mockHttp.post.and.returnValue(of(apiResponse));

      service.getSubContract(body).subscribe((res) => {

        expect(mockStorage.getSubcontracts).toHaveBeenCalledWith(
          body.personTypeId,
          body.contractTypeId
        );

        expect(mockHttp.post).toHaveBeenCalledWith(
          '/mock-url',
          body
        );

        expect(mockStorage.setSubcontracts).toHaveBeenCalledWith(
          body.personTypeId,
          body.contractTypeId,
          apiResponse
        );

        expect(res).toEqual(apiResponse);

        done();
      });
    });

    it('CON CACHE -> debe regresar data sin llamar API', (done) => {
      const cached = [buildItem(1)];

      mockStorage.getSubcontracts.and.returnValue(cached);

      service.getSubContract(body).subscribe((res) => {
        expect(mockHttp.post).not.toHaveBeenCalled();

        expect(res).toEqual(cached);

        done();
      });
    });

  });

  describe('getStartedWorking', () => {

    const catalogName = 'startedWorking';

    const buildItem = (id: number): any => ({
      id,
      description: `WORK-${id}`
    });

    beforeEach(() => {
      (service as any).urls = {
        startedWorking: '/mock-url'
      };
    });

    it('SIN CACHE -> debe llamar API y guardar en localStorage', (done) => {
      const apiResponse = [buildItem(1), buildItem(2)];

      mockStorage.getCatalog.and.returnValue({
        data: [],
        updatedAt: ''
      });

      mockHttp.post.and.returnValue(of(apiResponse));

      service.getStartedWorking().subscribe((res) => {

        expect(mockHttp.post).toHaveBeenCalledWith('/mock-url');
        expect(mockStorage.setCatalog).toHaveBeenCalledWith(catalogName, apiResponse);
        expect(res).toEqual(apiResponse);

        done();
      });
    });

    it('CACHE DEL MISMO DIA -> NO debe llamar API', (done) => {
      const cached = [buildItem(1)];

      mockStorage.getCatalog.and.returnValue({
        data: cached,
        updatedAt: new Date().toISOString().slice(0, 10).replace(/-/g, '')
      });

      service.getStartedWorking().subscribe((res) => {

        expect(mockHttp.post).not.toHaveBeenCalled();
        expect(res).toEqual(cached);

        done();
      });
    });

    it('CACHE VIEJO -> debe regresar cache y refrescar en background', (done) => {
      const cached = [buildItem(1)];
      const fresh = [buildItem(2)];

      mockStorage.getCatalog.and.returnValue({
        data: cached,
        updatedAt: '20200101'
      });

      mockHttp.post.and.returnValue(of(fresh));

      service.getStartedWorking().subscribe((res) => {
        expect(res).toEqual(cached);
        expect(mockHttp.post).toHaveBeenCalledWith(
          '/mock-url',
          undefined,
          jasmine.objectContaining({
            context: jasmine.anything()
          })
        );
        expect(mockStorage.setCatalog).toHaveBeenCalledWith(catalogName, fresh);
        done();
      });
    });
  });

  describe('getRelationships', () => {

    const catalogName = 'relationships';

    const body = {
      bool: 'true',
      clientId: '123',
      language: 'ES'
    };

    const buildItem = (id: string): any => ({
      mandt: '100',
      idParent: id,
      spras: 'ES',
      kinShip: `REL-${id}`
    });

    const buildResponse = (items: any[]) => ({
      status: 200,
      payload: {
        errorMsg: { items: [] },
        status: 200,
        relationship: {
          item: items
        }
      },
      messages: []
    });

    beforeEach(() => {
      (service as any).urls = {
        relationships: '/mock-url'
      };
    });
    it('SIN CACHE -> debe llamar API, mapear payload y guardar', (done) => {
      const apiItems = [buildItem('1'), buildItem('2')];
      const apiResponse = buildResponse(apiItems);

      mockStorage.getCatalog.and.returnValue({
        data: [],
        updatedAt: ''
      });

      mockHttp.post.and.returnValue(of(apiResponse));

      service.getRelationships(body).subscribe((res) => {

        expect(mockHttp.post).toHaveBeenCalledWith('/mock-url', body);

        expect(mockStorage.setCatalog).toHaveBeenCalledWith(
          catalogName,
          apiItems
        );

        expect(res).toEqual(apiItems);

        done();
      });
    });
    it('CACHE DEL MISMO DIA -> NO debe llamar API', (done) => {
      const cached = [buildItem('1')];

      mockStorage.getCatalog.and.returnValue({
        data: cached,
        updatedAt: new Date().toISOString().slice(0, 10).replace(/-/g, '')
      });

      service.getRelationships(body).subscribe((res) => {

        expect(mockHttp.post).not.toHaveBeenCalled();
        expect(res).toEqual(cached);

        done();
      });
    });

    it('CACHE VIEJO -> devuelve cache y refresca en background', (done) => {

      const cached = [buildItem('1')];
      const fresh = [buildItem('2')];
      const apiResponse = buildResponse(fresh);

      mockStorage.getCatalog.and.returnValue({
        data: cached,
        updatedAt: '20200101'
      });

      mockHttp.post.and.returnValue(of(apiResponse));

      service.getRelationships(body).subscribe((res) => {

        expect(res).toEqual(cached);
        expect(mockHttp.post).toHaveBeenCalledWith(
          '/mock-url',
          body,
          jasmine.objectContaining({
            context: jasmine.anything()
          })
        );
        expect(mockStorage.setCatalog).toHaveBeenCalledWith(
          catalogName,
          fresh
        );

        done();
      });
    });

  });

  describe('getProofOfAddress', () => {

    const catalogName = 'proofOfAddressType';

    const bodyBase = {
      proofAddressIds: []
    };

    const buildItem = (id: string): any => ({
      id,
      description: `ADDR-${id}`
    });

    const buildResponse = (items: any[]) => ({
      status: 200,
      payload: {
        errorMsg: { items: [] },
        status: 200,
        proofOfAddressType: {
          item: items
        }
      },
      messages: []
    });

    beforeEach(() => {
      (service as any).urls = {
        proofOfAddressType: '/mock-url'
      };
    });

    it('sin cache', (done) => {
      const body = { ...bodyBase, proofAddressIds: [] };
      const items = [buildItem('1'), buildItem('2')];
      const response = buildResponse(items);

      mockStorage.getCatalog.and.returnValue({ data: [], updatedAt: '' });
      mockHttp.post.and.returnValue(of(response));

      service.getProofOfAddress(body as any).subscribe(res => {
        expect(body.proofAddressIds.length).toBe(1);
        expect(mockHttp.post).toHaveBeenCalledWith('/mock-url', body);
        expect(mockStorage.setCatalog).toHaveBeenCalledWith(catalogName, items);
        expect(res).toEqual(items);
        done();
      });
    });

    it('cache actual', (done) => {
      const body = { ...bodyBase, proofAddressIds: ['A'] };
      const cached = [buildItem('1')];

      mockStorage.getCatalog.and.returnValue({
        data: cached,
        updatedAt: new Date().toISOString().slice(0, 10).replace(/-/g, '')
      });

      service.getProofOfAddress(body as any).subscribe(res => {
        expect(mockHttp.post).not.toHaveBeenCalled();
        expect(res).toEqual(cached);
        done();
      });
    });

    it('cache viejo', (done) => {
      const body = { ...bodyBase, proofAddressIds: ['A'] };
      const cached = [buildItem('1')];
      const fresh = [buildItem('2')];
      const response = buildResponse(fresh);

      mockStorage.getCatalog.and.returnValue({
        data: cached,
        updatedAt: '20200101'
      });

      mockHttp.post.and.returnValue(of(response));

      service.getProofOfAddress(body as any).subscribe(res => {
        expect(res).toEqual(cached);
        expect(mockHttp.post).toHaveBeenCalledWith(
          '/mock-url',
          body,
          jasmine.objectContaining({ context: jasmine.anything() })
        );
        expect(mockStorage.setCatalog).toHaveBeenCalledWith(catalogName, fresh);
        done();
      });
    });

  });

  describe('getPhoneType', () => {

    const catalogName = 'phoneType';

    const body = {
      telephoneTypeIds: ['A']
    };

    const buildItem = (id: string): any => ({
      mandt: '100',
      spras: 'ES',
      telephoneTypeId: id,
      telephoneType: `PHONE-${id}`
    });

    const buildResponse = (items: any[]) => ({
      status: 200,
      payload: {
        errorMsg: { items: [] },
        status: 200,
        telephoneType: {
          item: items
        }
      },
      messages: []
    });

    beforeEach(() => {
      (service as any).urls = {
        phoneType: '/mock-url'
      };
    });

    it('sin cache', (done) => {
      const items = [buildItem('1'), buildItem('2')];
      const response = buildResponse(items);

      mockStorage.getCatalog.and.returnValue({ data: [], updatedAt: '' });
      mockHttp.post.and.returnValue(of(response));

      service.getPhoneType(body as any).subscribe(res => {
        expect(mockHttp.post).toHaveBeenCalledWith('/mock-url', body);
        expect(mockStorage.setCatalog).toHaveBeenCalledWith(catalogName, items);
        expect(res).toEqual(items);
        done();
      });
    });

    it('cache actual', (done) => {
      const cached = [buildItem('1')];

      mockStorage.getCatalog.and.returnValue({
        data: cached,
        updatedAt: new Date().toISOString().slice(0, 10).replace(/-/g, '')
      });

      service.getPhoneType(body as any).subscribe(res => {
        expect(mockHttp.post).not.toHaveBeenCalled();
        expect(res).toEqual(cached);
        done();
      });
    });

    it('cache viejo', (done) => {
      const cached = [buildItem('1')];
      const fresh = [buildItem('2')];
      const response = buildResponse(fresh);

      mockStorage.getCatalog.and.returnValue({
        data: cached,
        updatedAt: '20200101'
      });

      mockHttp.post.and.returnValue(of(response));

      service.getPhoneType(body as any).subscribe(res => {
        expect(res).toEqual(cached);
        expect(mockHttp.post).toHaveBeenCalledWith(
          '/mock-url',
          body,
          jasmine.objectContaining({ context: jasmine.anything() })
        );
        expect(mockStorage.setCatalog).toHaveBeenCalledWith(catalogName, fresh);
        done();
      });
    });

  });

  describe('getPersonType', () => {

    const catalogName = 'personType';

    const bodyBase = {
      subPersonTypeIds: [],
      personType: '1'
    } as any;

    const buildItem = (id: string): any => ({
      mandt: '100',
      spras: 'ES',
      subPersonTypeId: id,
      subPersonType: `TYPE-${id}`,
      personTypeId: '1'
    });

    const buildResponse = (items: any[]) => ({
      status: 200,
      payload: {
        errorMsg: { items: [] },
        status: 200,
        personType: {
          item: items
        }
      },
      messages: []
    });

    beforeEach(() => {
      (service as any).urls = {
        personType: '/mock-url'
      };
    });

    it('sin cache', (done) => {
      const body = { ...bodyBase, subPersonTypeIds: [] };
      const items = [buildItem('1'), buildItem('2')];
      const response = buildResponse(items);

      mockStorage.getCatalog.and.returnValue({ data: [], updatedAt: '' });
      mockHttp.post.and.returnValue(of(response));

      service.getPersonType(body).subscribe(res => {
        expect(body.subPersonTypeIds.length).toBe(1);
        expect(mockHttp.post).toHaveBeenCalledWith('/mock-url', body);
        expect(mockStorage.setCatalog).toHaveBeenCalledWith(catalogName, items);
        expect(res).toEqual(items);
        done();
      });
    });

    it('cache actual', (done) => {
      const cached = [buildItem('1')];

      mockStorage.getCatalog.and.returnValue({
        data: cached,
        updatedAt: new Date().toISOString().slice(0, 10).replace(/-/g, '')
      });

      service.getPersonType({ ...bodyBase, subPersonTypeIds: ['A'] }).subscribe(res => {
        expect(mockHttp.post).not.toHaveBeenCalled();
        expect(res).toEqual(cached);
        done();
      });
    });

    it('cache viejo', (done) => {
      const cached = [buildItem('1')];
      const fresh = [buildItem('2')];
      const response = buildResponse(fresh);

      const body = { ...bodyBase, subPersonTypeIds: ['A'] };

      mockStorage.getCatalog.and.returnValue({
        data: cached,
        updatedAt: '20200101'
      });

      mockHttp.post.and.returnValue(of(response));

      service.getPersonType(body).subscribe(res => {
        expect(res).toEqual(cached);
        expect(mockHttp.post).toHaveBeenCalledWith(
          '/mock-url',
          body,
          jasmine.objectContaining({ context: jasmine.anything() })
        );
        expect(mockStorage.setCatalog).toHaveBeenCalledWith(catalogName, fresh);
        done();
      });
    });

  });

  describe('getOriginResource', () => {

    const catalogName = 'origin_resource';

    const body = {
      full: true,
      rangeId: 'A'
    };

    const buildItem = (id: string): any => ({
      rangeId: id,
      description: `RANGE-${id}`
    });

    const buildResponse = (items: any[]) => ({
      status: 200,
      messages: [],
      payload: {
        ranges: items
      }
    });

    beforeEach(() => {
      (service as any).urls = {
        origin_resource: '/mock-url'
      };
    });

    it('sin cache', (done) => {
      const items = [buildItem('1'), buildItem('2')];
      const response = buildResponse(items);

      mockStorage.getCatalog.and.returnValue({ data: [], updatedAt: '' });
      mockHttp.post.and.returnValue(of(response));

      service.getOriginResource(body as any).subscribe(res => {
        expect(mockHttp.post).toHaveBeenCalledWith('/mock-url', body);
        expect(mockStorage.setCatalog).toHaveBeenCalledWith(catalogName, items);
        expect(res).toEqual(items);
        done();
      });
    });

    it('cache actual', (done) => {
      const cached = [buildItem('1')];

      mockStorage.getCatalog.and.returnValue({
        data: cached,
        updatedAt: new Date().toISOString().slice(0, 10).replace(/-/g, '')
      });

      service.getOriginResource(body as any).subscribe(res => {
        expect(mockHttp.post).not.toHaveBeenCalled();
        expect(res).toEqual(cached);
        done();
      });
    });

    it('cache viejo', (done) => {
      const cached = [buildItem('1')];
      const fresh = [buildItem('2')];
      const response = buildResponse(fresh);

      mockStorage.getCatalog.and.returnValue({
        data: cached,
        updatedAt: '20200101'
      });

      mockHttp.post.and.returnValue(of(response));

      service.getOriginResource(body as any).subscribe(res => {
        expect(res).toEqual(cached);
        expect(mockHttp.post).toHaveBeenCalledWith(
          '/mock-url',
          body,
          jasmine.objectContaining({ context: jasmine.anything() })
        );
        expect(mockStorage.setCatalog).toHaveBeenCalledWith(catalogName, fresh);
        done();
      });
    });

  });

  describe('getOccupations', () => {

    const catalogName = 'occupations';

    const bodyBase = {
      ocupationIds: []
    };

    const buildItem = (id: string): any => ({
      occupationId: id,
      occupation: `OCC-${id}`,
      shortDescription: `DESC-${id}`,
      mandt: '100'
    });

    const buildResponse = (items: any[]) => ({
      status: 200,
      payload: {
        errorMsg: { items: [] },
        status: 200,
        occupation: {
          item: items
        }
      },
      messages: []
    });

    beforeEach(() => {
      (service as any).urls = {
        occupations: '/mock-url'
      };
    });

    it('sin cache', (done) => {
      const body = { ...bodyBase, ocupationIds: [] };
      const items = [buildItem('1'), buildItem('2')];
      const response = buildResponse(items);

      mockStorage.getCatalog.and.returnValue({ data: [], updatedAt: '' });
      mockHttp.post.and.returnValue(of(response));

      service.getOccupations(body as any).subscribe(res => {
        expect(body.ocupationIds.length).toBe(1);
        expect(mockHttp.post).toHaveBeenCalledWith('/mock-url', body);
        expect(mockStorage.setCatalog).toHaveBeenCalledWith(catalogName, items);
        expect(res).toEqual(items);
        done();
      });
    });

    it('cache actual', (done) => {
      const cached = [buildItem('1')];

      mockStorage.getCatalog.and.returnValue({
        data: cached,
        updatedAt: new Date().toISOString().slice(0, 10).replace(/-/g, '')
      });

      service.getOccupations({ ...bodyBase, ocupationIds: ['A'] } as any).subscribe(res => {
        expect(mockHttp.post).not.toHaveBeenCalled();
        expect(res).toEqual(cached);
        done();
      });
    });

    it('cache viejo', (done) => {
      const cached = [buildItem('1')];
      const fresh = [buildItem('2')];
      const response = buildResponse(fresh);

      const body = { ...bodyBase, ocupationIds: ['A'] };

      mockStorage.getCatalog.and.returnValue({
        data: cached,
        updatedAt: '20200101'
      });

      mockHttp.post.and.returnValue(of(response));

      service.getOccupations(body as any).subscribe(res => {
        expect(res).toEqual(cached);
        expect(mockHttp.post).toHaveBeenCalledWith(
          '/mock-url',
          body,
          jasmine.objectContaining({ context: jasmine.anything() })
        );
        expect(mockStorage.setCatalog).toHaveBeenCalledWith(catalogName, fresh);
        done();
      });
    });

  });

  describe('getNationalities', () => {

    const catalogName = 'nationality';

    const body = {
      land: ['MX']
    };

    const buildItem = (id: string): any => ({
      nationalityId: id,
      nationality: `NAT-${id}`
    });

    const buildResponse = (items: any[]) => ({
      status: 200,
      payload: {
        nationalities: items
      },
      messages: []
    });

    beforeEach(() => {
      (service as any).urls = {
        nationality: '/mock-url'
      };
    });

    it('sin cache', (done) => {
      const items = [buildItem('1'), buildItem('2')];
      const response = buildResponse(items);

      mockStorage.getCatalog.and.returnValue({ data: [], updatedAt: '' });
      mockHttp.post.and.returnValue(of(response));

      service.getNationalities(body as any).subscribe(res => {
        expect(mockHttp.post).toHaveBeenCalledWith('/mock-url', body);
        expect(mockStorage.setCatalog).toHaveBeenCalledWith(catalogName, items);
        expect(res).toEqual(items);
        done();
      });
    });

    it('cache actual', (done) => {
      const cached = [buildItem('1')];

      mockStorage.getCatalog.and.returnValue({
        data: cached,
        updatedAt: new Date().toISOString().slice(0, 10).replace(/-/g, '')
      });

      service.getNationalities(body as any).subscribe(res => {
        expect(mockHttp.post).not.toHaveBeenCalled();
        expect(res).toEqual(cached);
        done();
      });
    });

    it('cache viejo', (done) => {
      const cached = [buildItem('1')];
      const fresh = [buildItem('2')];
      const response = buildResponse(fresh);

      mockStorage.getCatalog.and.returnValue({
        data: cached,
        updatedAt: '20200101'
      });

      mockHttp.post.and.returnValue(of(response));

      service.getNationalities(body as any).subscribe(res => {
        expect(res).toEqual(cached);
        expect(mockHttp.post).toHaveBeenCalledWith(
          '/mock-url',
          body,
          jasmine.objectContaining({ context: jasmine.anything() })
        );
        expect(mockStorage.setCatalog).toHaveBeenCalledWith(catalogName, fresh);
        done();
      });
    });

  });

  describe('getMonthlyDepositAvg', () => {

    const catalogName = 'monthlyDepositAvg';

    const body = {} as any;

    const buildItem = (id: string): any => ({
      code: id,
      amountRange: `RANGE-${id}`,
      active: true,
      created: '2024-01-01',
      modified: null
    });

    beforeEach(() => {
      (service as any).urls = {
        monthlyDepositAvg: '/mock-url'
      };
    });

    it('sin cache', (done) => {
      const response = [buildItem('1'), buildItem('2')];

      mockStorage.getCatalog.and.returnValue({ data: [], updatedAt: '' });
      mockHttp.post.and.returnValue(of(response));

      service.getMonthlyDepositAvg(body).subscribe(res => {
        expect(mockHttp.post).toHaveBeenCalledWith('/mock-url', body);
        expect(mockStorage.setCatalog).toHaveBeenCalledWith(catalogName, response);
        expect(res).toEqual(response);
        done();
      });
    });

    it('cache actual', (done) => {
      const cached = [buildItem('1')];

      mockStorage.getCatalog.and.returnValue({
        data: cached,
        updatedAt: new Date().toISOString().slice(0, 10).replace(/-/g, '')
      });

      service.getMonthlyDepositAvg(body).subscribe(res => {
        expect(mockHttp.post).not.toHaveBeenCalled();
        expect(res).toEqual(cached);
        done();
      });
    });

    it('cache viejo', (done) => {
      const cached = [buildItem('1')];
      const fresh = [buildItem('2')];

      mockStorage.getCatalog.and.returnValue({
        data: cached,
        updatedAt: '20200101'
      });

      mockHttp.post.and.returnValue(of(fresh));

      service.getMonthlyDepositAvg(body).subscribe(res => {
        expect(res).toEqual(cached);
        expect(mockHttp.post).toHaveBeenCalledWith(
          '/mock-url',
          body,
          jasmine.objectContaining({ context: jasmine.anything() })
        );
        expect(mockStorage.setCatalog).toHaveBeenCalledWith(catalogName, fresh);
        done();
      });
    });

  });

  describe('getMonthlyDeposit', () => {

    const catalogName = 'monthlyDeposit';

    const body = {} as any;

    const buildItem = (id: string): any => ({
      code: id,
      operationsRange: `OPS-${id}`,
      active: true,
      created: '2024-01-01',
      modified: null
    });

    beforeEach(() => {
      (service as any).urls = {
        monthlyDeposit: '/mock-url'
      };
    });

    it('sin cache', (done) => {
      const response = [buildItem('1'), buildItem('2')];

      mockStorage.getCatalog.and.returnValue({ data: [], updatedAt: '' });
      mockHttp.post.and.returnValue(of(response));

      service.getMonthlyDeposit(body).subscribe(res => {
        expect(mockHttp.post).toHaveBeenCalledWith('/mock-url', body);
        expect(mockStorage.setCatalog).toHaveBeenCalledWith(catalogName, response);
        expect(res).toEqual(response);
        done();
      });
    });

    it('cache actual', (done) => {
      const cached = [buildItem('1')];

      mockStorage.getCatalog.and.returnValue({
        data: cached,
        updatedAt: new Date().toISOString().slice(0, 10).replace(/-/g, '')
      });

      service.getMonthlyDeposit(body).subscribe(res => {
        expect(mockHttp.post).not.toHaveBeenCalled();
        expect(res).toEqual(cached);
        done();
      });
    });

    it('cache viejo', (done) => {
      const cached = [buildItem('1')];
      const fresh = [buildItem('2')];

      mockStorage.getCatalog.and.returnValue({
        data: cached,
        updatedAt: '20200101'
      });

      mockHttp.post.and.returnValue(of(fresh));

      service.getMonthlyDeposit(body).subscribe(res => {
        expect(res).toEqual(cached);
        expect(mockHttp.post).toHaveBeenCalledWith(
          '/mock-url',
          body,
          jasmine.objectContaining({ context: jasmine.anything() })
        );
        expect(mockStorage.setCatalog).toHaveBeenCalledWith(catalogName, fresh);
        done();
      });
    });

  });

  describe('getMarriageType', () => {

    const catalogName = 'marriageType';

    const body = {
      marriageTypeIds: ['A']
    };

    const buildItem = (id: string): any => ({
      mandt: '100',
      marriageTypeId: id,
      marriageType: `MARR-${id}`
    });

    const buildResponse = (items: any[]) => ({
      status: 200,
      payload: {
        errorMsg: { items: [] },
        status: 200,
        marriageType: {
          item: items
        }
      },
      messages: []
    });

    beforeEach(() => {
      (service as any).urls = {
        marriageType: '/mock-url'
      };
    });

    it('sin cache', (done) => {
      const items = [buildItem('1'), buildItem('2')];
      const response = buildResponse(items);

      mockStorage.getCatalog.and.returnValue({ data: [], updatedAt: '' });
      mockHttp.post.and.returnValue(of(response));

      service.getMarriageType(body as any).subscribe(res => {
        expect(mockHttp.post).toHaveBeenCalledWith('/mock-url', body);
        expect(mockStorage.setCatalog).toHaveBeenCalledWith(catalogName, items);
        expect(res).toEqual(items);
        done();
      });
    });

    it('cache actual', (done) => {
      const cached = [buildItem('1')];

      mockStorage.getCatalog.and.returnValue({
        data: cached,
        updatedAt: new Date().toISOString().slice(0, 10).replace(/-/g, '')
      });

      service.getMarriageType(body as any).subscribe(res => {
        expect(mockHttp.post).not.toHaveBeenCalled();
        expect(res).toEqual(cached);
        done();
      });
    });

    it('cache viejo', (done) => {
      const cached = [buildItem('1')];
      const fresh = [buildItem('2')];
      const response = buildResponse(fresh);

      mockStorage.getCatalog.and.returnValue({
        data: cached,
        updatedAt: '20200101'
      });

      mockHttp.post.and.returnValue(of(response));

      service.getMarriageType(body as any).subscribe(res => {
        expect(res).toEqual(cached);
        expect(mockHttp.post).toHaveBeenCalledWith(
          '/mock-url',
          body,
          jasmine.objectContaining({ context: jasmine.anything() })
        );
        expect(mockStorage.setCatalog).toHaveBeenCalledWith(catalogName, fresh);
        done();
      });
    });

  });

  describe('getMaritalStatus', () => {

    const catalogName = 'maritalStatus';

    const bodyBase = {
      maritalStatusIds: []
    };

    const buildItem = (id: string): any => ({
      maritalStatusId: id,
      maritalStatus: `STATUS-${id}`,
      client: 'X'
    });

    const buildResponse = (items: any[]) => ({
      status: 200,
      payload: {
        errorMsg: { items: [] },
        status: 200,
        maritalStatus: {
          item: items
        }
      },
      messages: []
    });

    beforeEach(() => {
      (service as any).urls = {
        maritalStatus: '/mock-url'
      };
    });

    it('sin cache', (done) => {
      const body = { ...bodyBase, maritalStatusIds: [] };
      const items = [buildItem('1'), buildItem('2')];
      const response = buildResponse(items);

      mockStorage.getCatalog.and.returnValue({ data: [], updatedAt: '' });
      mockHttp.post.and.returnValue(of(response));

      service.getMaritalStatus(body as any).subscribe(res => {
        expect(body.maritalStatusIds.length).toBe(1);
        expect(mockHttp.post).toHaveBeenCalledWith('/mock-url', body);
        expect(mockStorage.setCatalog).toHaveBeenCalledWith(catalogName, items);
        expect(res).toEqual(items);
        done();
      });
    });

    it('cache actual', (done) => {
      const cached = [buildItem('1')];

      mockStorage.getCatalog.and.returnValue({
        data: cached,
        updatedAt: new Date().toISOString().slice(0, 10).replace(/-/g, '')
      });

      service.getMaritalStatus({ ...bodyBase, maritalStatusIds: ['A'] } as any).subscribe(res => {
        expect(mockHttp.post).not.toHaveBeenCalled();
        expect(res).toEqual(cached);
        done();
      });
    });

    it('cache viejo', (done) => {
      const cached = [buildItem('1')];
      const fresh = [buildItem('2')];
      const response = buildResponse(fresh);

      const body = { ...bodyBase, maritalStatusIds: ['A'] };

      mockStorage.getCatalog.and.returnValue({
        data: cached,
        updatedAt: '20200101'
      });

      mockHttp.post.and.returnValue(of(response));

      service.getMaritalStatus(body as any).subscribe(res => {
        expect(res).toEqual(cached);
        expect(mockHttp.post).toHaveBeenCalledWith(
          '/mock-url',
          body,
          jasmine.objectContaining({ context: jasmine.anything() })
        );
        expect(mockStorage.setCatalog).toHaveBeenCalledWith(catalogName, fresh);
        done();
      });
    });

  });

  describe('getInterviewPlaces', () => {

    const catalogName = 'interviewPlaces';

    const body = {
      interviewPlaceIds: ['A']
    };

    const buildItem = (id: string): any => ({
      interviewPlaceId: id,
      interviewPlace: `PLACE-${id}`
    });

    beforeEach(() => {
      (service as any).urls = {
        interviewPlaces: '/mock-url'
      };
    });

    it('sin cache', (done) => {
      const items = [buildItem('1'), buildItem('2')];

      mockStorage.getCatalog.and.returnValue({ data: [], updatedAt: '' });
      mockHttp.post.and.returnValue(of(items));

      service.getInterviewPlaces(body as any).subscribe(res => {
        expect(mockHttp.post).toHaveBeenCalledWith('/mock-url', body);
        expect(mockStorage.setCatalog).toHaveBeenCalledWith(catalogName, items);
        expect(res).toEqual(items);
        done();
      });
    });

    it('cache actual', (done) => {
      const cached = [buildItem('1')];

      mockStorage.getCatalog.and.returnValue({
        data: cached,
        updatedAt: new Date().toISOString().slice(0, 10).replace(/-/g, '')
      });

      service.getInterviewPlaces(body as any).subscribe(res => {
        expect(mockHttp.post).not.toHaveBeenCalled();
        expect(res).toEqual(cached);
        done();
      });
    });

    it('cache viejo', (done) => {
      const cached = [buildItem('1')];
      const fresh = [buildItem('2')];

      mockStorage.getCatalog.and.returnValue({
        data: cached,
        updatedAt: '20200101'
      });

      mockHttp.post.and.returnValue(of(fresh));

      service.getInterviewPlaces(body as any).subscribe(res => {
        expect(res).toEqual(cached);
        expect(mockHttp.post).toHaveBeenCalledWith(
          '/mock-url',
          body,
          jasmine.objectContaining({ context: jasmine.anything() })
        );
        expect(mockStorage.setCatalog).toHaveBeenCalledWith(catalogName, fresh);
        done();
      });
    });

  });

  describe('getIdentificationType', () => {

    const catalogName = 'identificationType';

    const body = {
      types: ['A']
    };

    const buildItem = (id: string): any => ({
      client: '100',
      spras: 'ES',
      type: id,
      text: `ID-${id}`
    });

    const buildResponse = (items: any[]) => ({
      status: 200,
      payload: {
        errorMsg: { items: [] },
        status: 200,
        identificationType: {
          item: items
        }
      },
      messages: []
    });

    beforeEach(() => {
      (service as any).urls = {
        identificationType: '/mock-url'
      };
    });

    it('sin cache', (done) => {
      const items = [buildItem('1'), buildItem('2')];
      const response = buildResponse(items);

      mockStorage.getCatalog.and.returnValue({ data: [], updatedAt: '' });
      mockHttp.post.and.returnValue(of(response));

      service.getIdentificationType(body as any).subscribe(res => {
        expect(mockHttp.post).toHaveBeenCalledWith('/mock-url', body);
        expect(mockStorage.setCatalog).toHaveBeenCalledWith(catalogName, items);
        expect(res).toEqual(items);
        done();
      });
    });

    it('cache actual', (done) => {
      const cached = [buildItem('1')];

      mockStorage.getCatalog.and.returnValue({
        data: cached,
        updatedAt: new Date().toISOString().slice(0, 10).replace(/-/g, '')
      });

      service.getIdentificationType(body as any).subscribe(res => {
        expect(mockHttp.post).not.toHaveBeenCalled();
        expect(res).toEqual(cached);
        done();
      });
    });

    it('cache viejo', (done) => {
      const cached = [buildItem('1')];
      const fresh = [buildItem('2')];
      const response = buildResponse(fresh);

      mockStorage.getCatalog.and.returnValue({
        data: cached,
        updatedAt: '20200101'
      });

      mockHttp.post.and.returnValue(of(response));

      service.getIdentificationType(body as any).subscribe(res => {
        expect(res).toEqual(cached);
        expect(mockHttp.post).toHaveBeenCalledWith(
          '/mock-url',
          body,
          jasmine.objectContaining({ context: jasmine.anything() })
        );
        expect(mockStorage.setCatalog).toHaveBeenCalledWith(catalogName, fresh);
        done();
      });
    });

  });

  describe('getFundsOriginCategory', () => {

    const catalogName = 'fundsOriginCategory';

    const buildItem = (id: string): any => ({
      id,
      description: `FUND-${id}`
    });

    beforeEach(() => {
      (service as any).urls = {
        fundsOriginCategory: '/mock-url'
      };
    });

    it('sin cache', (done) => {
      const response = [buildItem('1'), buildItem('2')];

      mockStorage.getCatalog.and.returnValue({ data: [], updatedAt: '' });
      mockHttp.post.and.returnValue(of(response));

      service.getFundsOriginCategory().subscribe(res => {
        expect(mockHttp.post).toHaveBeenCalledWith('/mock-url');
        expect(mockStorage.setCatalog).toHaveBeenCalledWith(catalogName, response);
        expect(res).toEqual(response);
        done();
      });
    });

    it('cache actual', (done) => {
      const cached = [buildItem('1')];

      mockStorage.getCatalog.and.returnValue({
        data: cached,
        updatedAt: new Date().toISOString().slice(0, 10).replace(/-/g, '')
      });

      service.getFundsOriginCategory().subscribe(res => {
        expect(mockHttp.post).not.toHaveBeenCalled();
        expect(res).toEqual(cached);
        done();
      });
    });

    it('cache viejo', (done) => {
      const cached = [buildItem('1')];
      const fresh = [buildItem('2')];

      mockStorage.getCatalog.and.returnValue({
        data: cached,
        updatedAt: '20200101'
      });

      mockHttp.post.and.returnValue(of(fresh));

      service.getFundsOriginCategory().subscribe(res => {
        expect(res).toEqual(cached);
        expect(mockHttp.post).toHaveBeenCalledWith(
          '/mock-url',
          jasmine.objectContaining({ context: jasmine.anything() })
        );
        expect(mockStorage.setCatalog).toHaveBeenCalledWith(catalogName, fresh);
        done();
      });
    });

  });

  describe('getFundsOriginCategory', () => {

    const catalogName = 'fundsOriginCategory';

    const buildItem = (id: string): any => ({
      id,
      description: `FUND-${id}`
    });

    beforeEach(() => {
      (service as any).urls = {
        fundsOriginCategory: '/mock-url'
      };
    });

    it('sin cache', (done) => {
      const response = [buildItem('1'), buildItem('2')];

      mockStorage.getCatalog.and.returnValue({ data: [], updatedAt: '' });
      mockHttp.post.and.returnValue(of(response));

      service.getFundsOriginCategory().subscribe(res => {
        expect(mockHttp.post).toHaveBeenCalledWith('/mock-url');
        expect(mockStorage.setCatalog).toHaveBeenCalledWith(catalogName, response);
        expect(res).toEqual(response);
        done();
      });
    });

    it('cache actual', (done) => {
      const cached = [buildItem('1')];

      mockStorage.getCatalog.and.returnValue({
        data: cached,
        updatedAt: new Date().toISOString().slice(0, 10).replace(/-/g, '')
      });

      service.getFundsOriginCategory().subscribe(res => {
        expect(mockHttp.post).not.toHaveBeenCalled();
        expect(res).toEqual(cached);
        done();
      });
    });

    it('cache viejo', (done) => {
      const cached = [buildItem('1')];
      const fresh = [buildItem('2')];

      mockStorage.getCatalog.and.returnValue({
        data: cached,
        updatedAt: '20200101'
      });

      mockHttp.post.and.returnValue(of(fresh));

      service.getFundsOriginCategory().subscribe(res => {
        expect(res).toEqual(cached);
        expect(mockHttp.post).toHaveBeenCalledWith(
          '/mock-url',
          jasmine.objectContaining({ context: jasmine.anything() })
        );
        expect(mockStorage.setCatalog).toHaveBeenCalledWith(catalogName, fresh);
        done();
      });
    });

  });

  describe('getFiscalRegime', () => {

    const catalogName = 'fiscalRegime';

    const body = {
      personType: '1'
    };

    const buildItem = (id: string): any => ({
      fiscalRegimeId: id,
      description: `REG-${id}`,
      pfApply: true,
      pmApply: false
    });

    const buildResponse = (items: any[]) => ({
      status: 200,
      payload: {
        errorMsg: { items: [] },
        status: 200,
        fiscalRegime: {
          item: items
        }
      },
      messages: []
    });

    beforeEach(() => {
      (service as any).urls = {
        fiscalRegime: '/mock-url'
      };
    });

    it('sin cache', (done) => {
      const items = [buildItem('1'), buildItem('2')];
      const response = buildResponse(items);

      mockStorage.getCatalog.and.returnValue({ data: [], updatedAt: '' });
      mockHttp.post.and.returnValue(of(response));

      service.getFiscalRegime(body as any).subscribe(res => {
        expect(mockHttp.post).toHaveBeenCalledWith('/mock-url', body);
        expect(mockStorage.setCatalog).toHaveBeenCalledWith(catalogName, items);
        expect(res).toEqual(items);
        done();
      });
    });

    it('cache actual', (done) => {
      const cached = [buildItem('1')];

      mockStorage.getCatalog.and.returnValue({
        data: cached,
        updatedAt: new Date().toISOString().slice(0, 10).replace(/-/g, '')
      });

      service.getFiscalRegime(body as any).subscribe(res => {
        expect(mockHttp.post).not.toHaveBeenCalled();
        expect(res).toEqual(cached);
        done();
      });
    });

    it('cache viejo', (done) => {
      const cached = [buildItem('1')];
      const fresh = [buildItem('2')];
      const response = buildResponse(fresh);

      mockStorage.getCatalog.and.returnValue({
        data: cached,
        updatedAt: '20200101'
      });

      mockHttp.post.and.returnValue(of(response));

      service.getFiscalRegime(body as any).subscribe(res => {
        expect(res).toEqual(cached);
        expect(mockHttp.post).toHaveBeenCalledWith(
          '/mock-url',
          body,
          jasmine.objectContaining({ context: jasmine.anything() })
        );
        expect(mockStorage.setCatalog).toHaveBeenCalledWith(catalogName, fresh);
        done();
      });
    });

  });

  describe('getFiscalPersonSubType', () => {

    const catalogName = 'fiscalPersonSubType';

    const bodyBase = {
      land: []
    };

    const buildItem = (id: number): any => ({
      fiscalSubPersonTypeId: id,
      fiscalSubPersonTypeCode: `CODE-${id}`,
      fiscalSubPersonType: `TYPE-${id}`,
      active: true,
      created: '2024-01-01',
      modified: null
    });

    beforeEach(() => {
      (service as any).urls = {
        fiscalPersonSubType: '/mock-url'
      };
    });

    it('sin cache', (done) => {
      const body = { ...bodyBase, land: [] };
      const items = [buildItem(1), buildItem(2)];

      mockStorage.getCatalog.and.returnValue({ data: [], updatedAt: '' });
      mockHttp.post.and.returnValue(of(items));

      service.getFiscalPersonSubType(body as any).subscribe(res => {
        expect(body.land.length).toBe(1);
        expect(mockHttp.post).toHaveBeenCalledWith('/mock-url', body);
        expect(mockStorage.setCatalog).toHaveBeenCalledWith(catalogName, items);
        expect(res).toEqual(items);
        done();
      });
    });

    it('cache actual', (done) => {
      const cached = [buildItem(1)];

      mockStorage.getCatalog.and.returnValue({
        data: cached,
        updatedAt: new Date().toISOString().slice(0, 10).replace(/-/g, '')
      });

      service.getFiscalPersonSubType({ ...bodyBase, land: ['MX'] } as any)
        .subscribe(res => {
          expect(mockHttp.post).not.toHaveBeenCalled();
          expect(res).toEqual(cached);
          done();
        });
    });

    it('cache viejo', (done) => {
      const cached = [buildItem(1)];
      const fresh = [buildItem(2)];

      const body = { ...bodyBase, land: ['MX'] };

      mockStorage.getCatalog.and.returnValue({
        data: cached,
        updatedAt: '20200101'
      });

      mockHttp.post.and.returnValue(of(fresh));

      service.getFiscalPersonSubType(body as any).subscribe(res => {
        expect(res).toEqual(cached);
        expect(mockHttp.post).toHaveBeenCalledWith(
          '/mock-url',
          body,
          jasmine.objectContaining({ context: jasmine.anything() })
        );
        expect(mockStorage.setCatalog).toHaveBeenCalledWith(catalogName, fresh);
        done();
      });
    });

  });

  describe('getFiscalPersonType', () => {

    const catalogName = 'fiscalPersonType';

    const bodyBase = {
      land: []
    };

    const buildItem = (id: number): any => ({
      fiscalPersonTypeId: id,
      fiscalPersonTypeCode: `CODE-${id}`,
      fiscalPersonType: `TYPE-${id}`,
      active: true,
      created: '2024-01-01',
      modified: null
    });

    beforeEach(() => {
      (service as any).urls = {
        fiscalPersonType: '/mock-url'
      };
    });

    it('sin cache', (done) => {
      const body = { ...bodyBase, land: [] };
      const items = [buildItem(1), buildItem(2)];

      mockStorage.getCatalog.and.returnValue({ data: [], updatedAt: '' });
      mockHttp.post.and.returnValue(of(items));

      service.getFiscalPersonType(body as any).subscribe(res => {
        expect(body.land.length).toBe(1);
        expect(mockHttp.post).toHaveBeenCalledWith('/mock-url', body);
        expect(mockStorage.setCatalog).toHaveBeenCalledWith(catalogName, items);
        expect(res).toEqual(items);
        done();
      });
    });

    it('cache actual', (done) => {
      const cached = [buildItem(1)];

      mockStorage.getCatalog.and.returnValue({
        data: cached,
        updatedAt: new Date().toISOString().slice(0, 10).replace(/-/g, '')
      });

      service.getFiscalPersonType({ ...bodyBase, land: ['MX'] } as any)
        .subscribe(res => {
          expect(mockHttp.post).not.toHaveBeenCalled();
          expect(res).toEqual(cached);
          done();
        });
    });

    it('cache viejo', (done) => {
      const cached = [buildItem(1)];
      const fresh = [buildItem(2)];

      const body = { ...bodyBase, land: ['MX'] };

      mockStorage.getCatalog.and.returnValue({
        data: cached,
        updatedAt: '20200101'
      });

      mockHttp.post.and.returnValue(of(fresh));

      service.getFiscalPersonType(body as any).subscribe(res => {
        expect(res).toEqual(cached);
        expect(mockHttp.post).toHaveBeenCalledWith(
          '/mock-url',
          body,
          jasmine.objectContaining({ context: jasmine.anything() })
        );
        expect(mockStorage.setCatalog).toHaveBeenCalledWith(catalogName, fresh);
        done();
      });
    });

  });

  describe('getFinancialCenter', () => {

    const catalogName = 'financialCenter';

    const buildItem = (id: string): any => ({
      id,
      description: `CENTER-${id}`
    });

    beforeEach(() => {
      (service as any).urls = {
        financialCenter: '/mock-url'
      };
    });

    it('sin cache', (done) => {
      const response = [buildItem('1'), buildItem('2')];

      mockStorage.getCatalog.and.returnValue({ data: [], updatedAt: '' });
      mockHttp.post.and.returnValue(of(response));

      service.getFinancialCenter().subscribe(res => {
        expect(mockHttp.post).toHaveBeenCalledWith('/mock-url');
        expect(mockStorage.setCatalog).toHaveBeenCalledWith(catalogName, response);
        expect(res).toEqual(response);
        done();
      });
    });

    it('cache actual', (done) => {
      const cached = [buildItem('1')];

      mockStorage.getCatalog.and.returnValue({
        data: cached,
        updatedAt: new Date().toISOString().slice(0, 10).replace(/-/g, '')
      });

      service.getFinancialCenter().subscribe(res => {
        expect(mockHttp.post).not.toHaveBeenCalled();
        expect(res).toEqual(cached);
        done();
      });
    });

    it('cache viejo', (done) => {
      const cached = [buildItem('1')];
      const fresh = [buildItem('2')];

      mockStorage.getCatalog.and.returnValue({
        data: cached,
        updatedAt: '20200101'
      });

      mockHttp.post.and.returnValue(of(fresh));

      service.getFinancialCenter().subscribe(res => {
        expect(res).toEqual(cached);
        expect(mockHttp.post).toHaveBeenCalledWith(
          '/mock-url',
          jasmine.objectContaining({ context: jasmine.anything() })
        );
        expect(mockStorage.setCatalog).toHaveBeenCalledWith(catalogName, fresh);
        done();
      });
    });

  });

  describe('getFederalEntity', () => {

    const catalogName = 'federalEntity';

    const bodyBase = {
      land1s: []
    };

    const buildItem = (id: string): any => ({
      mandt: '100',
      land1: 'MX',
      bland: id,
      bezei: `ENTITY-${id}`,
      fprcd: 'X',
      herbl: 'Y'
    });

    const buildResponse = (items: any[]) => ({
      status: 200,
      payload: {
        errorMsg: { items: [] },
        status: 200,
        federalEntity: {
          item: items
        }
      },
      messages: []
    });

    beforeEach(() => {
      (service as any).urls = {
        federalEntity: '/mock-url'
      };
    });

    it('sin cache', (done) => {
      const body = { ...bodyBase, land1s: [] };
      const items = [buildItem('1'), buildItem('2')];
      const response = buildResponse(items);

      mockStorage.getCatalog.and.returnValue({ data: [], updatedAt: '' });
      mockHttp.post.and.returnValue(of(response));

      service.getFederalEntity(body as any).subscribe(res => {
        expect(body.land1s.length).toBe(1);
        expect(mockHttp.post).toHaveBeenCalledWith('/mock-url', body);
        expect(mockStorage.setCatalog).toHaveBeenCalledWith(catalogName, items);
        expect(res).toEqual(items);
        done();
      });
    });

    it('cache actual', (done) => {
      const cached = [buildItem('1')];

      mockStorage.getCatalog.and.returnValue({
        data: cached,
        updatedAt: new Date().toISOString().slice(0, 10).replace(/-/g, '')
      });

      service.getFederalEntity({ ...bodyBase, land1s: ['MX'] } as any)
        .subscribe(res => {
          expect(mockHttp.post).not.toHaveBeenCalled();
          expect(res).toEqual(cached);
          done();
        });
    });

    it('cache viejo', (done) => {
      const cached = [buildItem('1')];
      const fresh = [buildItem('2')];
      const response = buildResponse(fresh);

      const body = { ...bodyBase, land1s: ['MX'] };

      mockStorage.getCatalog.and.returnValue({
        data: cached,
        updatedAt: '20200101'
      });

      mockHttp.post.and.returnValue(of(response));

      service.getFederalEntity(body as any).subscribe(res => {
        expect(res).toEqual(cached);
        expect(mockHttp.post).toHaveBeenCalledWith(
          '/mock-url',
          body,
          jasmine.objectContaining({ context: jasmine.anything() })
        );
        expect(mockStorage.setCatalog).toHaveBeenCalledWith(catalogName, fresh);
        done();
      });
    });

  });

  describe('getExperienceTime', () => {

    const catalogName = 'experienceTime';

    const buildItem = (id: string): any => ({
      idTipoTiempoExperienciaCve: id,
      idTipoPersona: 1,
      tiempoExperiencia: `EXP-${id}`
    });

    beforeEach(() => {
      (service as any).urls = {
        experienceTime: '/mock-url'
      };
    });

    it('cache actual por id', (done) => {
      const body = { idTipoPersona: '1' };
      const cached = [buildItem('1')];

      mockStorage.getSeparatedByIdCatalog.and.returnValue({
        '1': {
          data: cached,
          updatedAt: new Date().toISOString().slice(0, 10).replace(/-/g, '')
        }
      });

      service.getExperienceTime(body as any).subscribe(res => {
        expect(mockHttp.post).not.toHaveBeenCalled();
        expect(res).toEqual(cached);
        done();
      });
    });

    it('cache viejo por id', (done) => {
      const body = { idTipoPersona: '1' };
      const cached = [buildItem('1')];
      const fresh = [buildItem('2')];

      mockStorage.getSeparatedByIdCatalog.and.returnValue({
        '1': {
          data: cached,
          updatedAt: '20200101'
        }
      });

      mockHttp.post.and.returnValue(of(fresh));

      service.getExperienceTime(body as any).subscribe(res => {
        expect(res).toEqual(cached);
        expect(mockHttp.post).toHaveBeenCalledWith(
          '/mock-url',
          body,
          jasmine.objectContaining({ context: jasmine.anything() })
        );
        expect(mockStorage.setSeparatedByIdCatalog).toHaveBeenCalledWith(
          catalogName,
          '1',
          fresh
        );
        done();
      });
    });

    it('sin cache por id', (done) => {
      const body = { idTipoPersona: '1' };
      const fresh = [buildItem('1')];

      mockStorage.getSeparatedByIdCatalog.and.returnValue({});
      mockHttp.post.and.returnValue(of(fresh));

      service.getExperienceTime(body as any).subscribe(res => {
        expect(mockHttp.post).toHaveBeenCalledWith('/mock-url', body);
        expect(mockStorage.setSeparatedByIdCatalog).toHaveBeenCalledWith(
          catalogName,
          '1',
          fresh
        );
        expect(res).toEqual(fresh);
        done();
      });
    });

  });

  describe('getEconomicActivityByPersonType', () => {

    const catalogName = 'economicActivityById';

    const body = {
      subPersonTypeId: '1'
    };

    const buildItem = (id: string): any => ({
      mandt: '100',
      spras: 'ES',
      lineBusinessId: id,
      lineBusiness: `BUS-${id}`,
      personType1: '',
      personType2: '',
      personType3: '',
      personType4: '',
      personType5: '',
      personType6: '',
      personType7: '',
      risk: 'LOW',
      terminationDate: '',
      isPublic: 'N',
      level: '1'
    });

    const buildResponse = (items: any[]) => ({
      status: 200,
      payload: {
        errorMsg: { items: [] },
        status: 200,
        economicActivity: {
          item: items
        }
      },
      messages: []
    });

    beforeEach(() => {
      (service as any).urls = {
        economicActivity: '/mock-url'
      };
    });

    it('cache actual por id', (done) => {
      const cached = [buildItem('1')];

      mockStorage.getSeparatedByIdCatalog.and.returnValue({
        '1': {
          data: cached,
          updatedAt: new Date().toISOString().slice(0, 10).replace(/-/g, '')
        }
      });

      service.getEconomicActivityByPersonType(body as any).subscribe(res => {
        expect(mockHttp.post).not.toHaveBeenCalled();
        expect(res).toEqual(cached);
        done();
      });
    });

    it('cache viejo por id', (done) => {
      const cached = [buildItem('1')];
      const fresh = [buildItem('2')];
      const response = buildResponse(fresh);

      mockStorage.getSeparatedByIdCatalog.and.returnValue({
        '1': {
          data: cached,
          updatedAt: '20200101'
        }
      });

      mockHttp.post.and.returnValue(of(response));

      service.getEconomicActivityByPersonType(body as any).subscribe(res => {
        expect(res).toEqual(cached);
        expect(mockHttp.post).toHaveBeenCalledWith(
          '/mock-url',
          body,
          jasmine.objectContaining({ context: jasmine.anything() })
        );
        expect(mockStorage.setSeparatedByIdCatalog).toHaveBeenCalledWith(
          catalogName,
          '1',
          fresh
        );
        done();
      });
    });

    it('sin cache por id', (done) => {
      const fresh = [buildItem('1')];
      const response = buildResponse(fresh);

      mockStorage.getSeparatedByIdCatalog.and.returnValue({});
      mockHttp.post.and.returnValue(of(response));

      service.getEconomicActivityByPersonType(body as any).subscribe(res => {
        expect(mockHttp.post).toHaveBeenCalledWith('/mock-url', body);
        expect(mockStorage.setSeparatedByIdCatalog).toHaveBeenCalledWith(
          catalogName,
          '1',
          fresh
        );
        expect(res).toEqual(fresh);
        done();
      });
    });

  });

  describe('getPaymentPeriod', () => {

    const catalogName = 'paymentPeriod';

    const body = {} as any;

    const buildItem = (id: string): any => ({
      paymentPeriodCve: id,
      paymentPeriod: `PERIOD-${id}`
    });

    const buildResponse = (items: any[]) => ({
      payload: {
        paymentPeriod: items
      }
    });

    beforeEach(() => {
      (service as any).urls = {
        paymentPeriod: '/mock-url'
      };
    });

    it('sin cache', (done) => {
      const response = [buildItem('1'), buildItem('2')];

      mockStorage.getCatalog.and.returnValue({ data: [], updatedAt: '' });
      mockHttp.post.and.returnValue(of(response));

      service.getPaymentPeriod(body).subscribe(res => {
        expect(mockHttp.post).toHaveBeenCalledWith('/mock-url', body);
        expect(mockStorage.setCatalog).toHaveBeenCalledWith(catalogName, response);
        expect(res).toEqual(response);
        done();
      });
    });

    it('cache actual', (done) => {
      const cached = [buildItem('1')];

      mockStorage.getCatalog.and.returnValue({
        data: cached,
        updatedAt: new Date().toISOString().slice(0, 10).replace(/-/g, '')
      });

      service.getPaymentPeriod(body).subscribe(res => {
        expect(mockHttp.post).not.toHaveBeenCalled();
        expect(res).toEqual(cached);
        done();
      });
    });

    it('cache viejo', (done) => {
      const cached = [buildItem('1')];
      const freshItems = [buildItem('2')];
      const response = buildResponse(freshItems);

      mockStorage.getCatalog.and.returnValue({
        data: cached,
        updatedAt: '20200101'
      });

      mockHttp.post.and.returnValue(of(response));

      service.getPaymentPeriod(body).subscribe(res => {
        expect(res).toEqual(cached);
        expect(mockHttp.post).toHaveBeenCalledWith(
          '/mock-url',
          body,
          jasmine.objectContaining({ context: jasmine.anything() })
        );
        expect(mockStorage.setCatalog).toHaveBeenCalledWith(catalogName, freshItems);
        done();
      });
    });

  });

  describe('getEconomicSector', () => {

    const catalogName = 'economicSector';

    const body = {} as any;

    const buildItem = (id: string): any => ({
      economicSectorCve: id,
      economicSector: `SECTOR-${id}`
    });

    const buildResponse = (items: any[]) => ({
      payload: {
        economicSector: items
      }
    });

    beforeEach(() => {
      (service as any).urls = {
        economicSector: '/mock-url'
      };
    });

    it('sin cache', (done) => {
      const response = [buildItem('1'), buildItem('2')];

      mockStorage.getCatalog.and.returnValue({ data: [], updatedAt: '' });
      mockHttp.post.and.returnValue(of(response));

      service.getEconomicSector(body).subscribe(res => {
        expect(mockHttp.post).toHaveBeenCalledWith('/mock-url', body);
        expect(mockStorage.setCatalog).toHaveBeenCalledWith(catalogName, response);
        expect(res).toEqual(response);
        done();
      });
    });

    it('cache actual', (done) => {
      const cached = [buildItem('1')];

      mockStorage.getCatalog.and.returnValue({
        data: cached,
        updatedAt: new Date().toISOString().slice(0, 10).replace(/-/g, '')
      });

      service.getEconomicSector(body).subscribe(res => {
        expect(mockHttp.post).not.toHaveBeenCalled();
        expect(res).toEqual(cached);
        done();
      });
    });

    it('cache viejo', (done) => {
      const cached = [buildItem('1')];
      const freshItems = [buildItem('2')];
      const response = buildResponse(freshItems);

      mockStorage.getCatalog.and.returnValue({
        data: cached,
        updatedAt: '20200101'
      });

      mockHttp.post.and.returnValue(of(response));

      service.getEconomicSector(body).subscribe(res => {
        expect(res).toEqual(cached);
        expect(mockHttp.post).toHaveBeenCalledWith(
          '/mock-url',
          body,
          jasmine.objectContaining({ context: jasmine.anything() })
        );
        expect(mockStorage.setCatalog).toHaveBeenCalledWith(catalogName, freshItems);
        done();
      });
    });

  });

  describe('getRiskGroup', () => {

    const catalogName = 'riskGroup';

    const body = {} as any;

    const buildItem = (id: string): any => ({
      riskGroupCve: id,
      riskGroup: `RISK-${id}`
    });

    const buildResponse = (items: any[]) => ({
      payload: {
        riskGroup: items
      }
    });

    beforeEach(() => {
      (service as any).urls = {
        riskGroup: '/mock-url'
      };
    });

    it('sin cache', (done) => {
      const response = [buildItem('1'), buildItem('2')];

      mockStorage.getCatalog.and.returnValue({ data: [], updatedAt: '' });
      mockHttp.post.and.returnValue(of(response));

      service.getRiskGroup(body).subscribe(res => {
        expect(mockHttp.post).toHaveBeenCalledWith('/mock-url', body);
        expect(mockStorage.setCatalog).toHaveBeenCalledWith(catalogName, response);
        expect(res).toEqual(response);
        done();
      });
    });

    it('cache actual', (done) => {
      const cached = [buildItem('1')];

      mockStorage.getCatalog.and.returnValue({
        data: cached,
        updatedAt: new Date().toISOString().slice(0, 10).replace(/-/g, '')
      });

      service.getRiskGroup(body).subscribe(res => {
        expect(mockHttp.post).not.toHaveBeenCalled();
        expect(res).toEqual(cached);
        done();
      });
    });

    it('cache viejo', (done) => {
      const cached = [buildItem('1')];
      const freshItems = [buildItem('2')];
      const response = buildResponse(freshItems);

      mockStorage.getCatalog.and.returnValue({
        data: cached,
        updatedAt: '20200101'
      });

      mockHttp.post.and.returnValue(of(response));

      service.getRiskGroup(body).subscribe(res => {
        expect(res).toEqual(cached);
        expect(mockHttp.post).toHaveBeenCalledWith(
          '/mock-url',
          body,
          jasmine.objectContaining({ context: jasmine.anything() })
        );
        expect(mockStorage.setCatalog).toHaveBeenCalledWith(catalogName, freshItems);
        done();
      });
    });

  });

  describe('getEconomicActivityAccredited', () => {

    const catalogName = 'economicActivityAccredited';

    const body = {} as any;

    const buildItem = (id: number): any => ({
      lineBusinessId: id,
      lineBussiness: `BUS-${id}`
    });

    const buildResponse = (items: any[]) => ({
      payload: {
        economicActivityAccredited: items
      }
    });

    beforeEach(() => {
      (service as any).urls = {
        economicActivityAccredited: '/mock-url'
      };
    });

    it('sin cache', (done) => {
      const response = [buildItem(1), buildItem(2)];

      mockStorage.getCatalog.and.returnValue({ data: [], updatedAt: '' });
      mockHttp.post.and.returnValue(of(response));

      service.getEconomicActivityAccredited(body).subscribe(res => {
        expect(mockHttp.post).toHaveBeenCalledWith('/mock-url', body);
        expect(mockStorage.setCatalog).toHaveBeenCalledWith(catalogName, response);
        expect(res).toEqual(response);
        done();
      });
    });

    it('cache actual', (done) => {
      const cached = [buildItem(1)];

      mockStorage.getCatalog.and.returnValue({
        data: cached,
        updatedAt: new Date().toISOString().slice(0, 10).replace(/-/g, '')
      });

      service.getEconomicActivityAccredited(body).subscribe(res => {
        expect(mockHttp.post).not.toHaveBeenCalled();
        expect(res).toEqual(cached);
        done();
      });
    });

    it('cache viejo', (done) => {
      const cached = [buildItem(1)];
      const freshItems = [buildItem(2)];
      const response = buildResponse(freshItems);

      mockStorage.getCatalog.and.returnValue({
        data: cached,
        updatedAt: '20200101'
      });

      mockHttp.post.and.returnValue(of(response));

      service.getEconomicActivityAccredited(body).subscribe(res => {
        expect(res).toEqual(cached);
        expect(mockHttp.post).toHaveBeenCalledWith(
          '/mock-url',
          body,
          jasmine.objectContaining({ context: jasmine.anything() })
        );
        expect(mockStorage.setCatalog).toHaveBeenCalledWith(catalogName, freshItems);
        done();
      });
    });

  });

  describe('getEconomicActivity', () => {

    const catalogName = 'economicActivity';

    const body = {} as any;

    const buildItem = (id: string): any => ({
      mandt: '100',
      spras: 'ES',
      lineBusinessId: id,
      lineBusiness: `BUS-${id}`,
      personType1: '',
      personType2: '',
      personType3: '',
      personType4: '',
      personType5: '',
      personType6: '',
      personType7: '',
      risk: 'LOW',
      terminationDate: '',
      isPublic: 'N',
      level: '1'
    });

    const buildResponse = (items: any[]) => ({
      status: 200,
      payload: {
        errorMsg: { items: [] },
        status: 200,
        economicActivity: {
          item: items
        }
      },
      messages: []
    });

    beforeEach(() => {
      (service as any).urls = {
        economicActivity: '/mock-url'
      };
    });

    it('sin cache', (done) => {
      const items = [buildItem('1'), buildItem('2')];
      const response = buildResponse(items);

      mockStorage.getCatalog.and.returnValue({ data: [], updatedAt: '' });
      mockHttp.post.and.returnValue(of(response));

      service.getEconomicActivity(body).subscribe(res => {
        expect(mockHttp.post).toHaveBeenCalledWith('/mock-url', body);
        expect(mockStorage.setCatalog).toHaveBeenCalledWith(catalogName, items);
        expect(res).toEqual(items);
        done();
      });
    });

    it('cache actual', (done) => {
      const cached = [buildItem('1')];

      mockStorage.getCatalog.and.returnValue({
        data: cached,
        updatedAt: new Date().toISOString().slice(0, 10).replace(/-/g, '')
      });

      service.getEconomicActivity(body).subscribe(res => {
        expect(mockHttp.post).not.toHaveBeenCalled();
        expect(res).toEqual(cached);
        done();
      });
    });

    it('cache viejo', (done) => {
      const cached = [buildItem('1')];
      const fresh = [buildItem('2')];
      const response = buildResponse(fresh);

      mockStorage.getCatalog.and.returnValue({
        data: cached,
        updatedAt: '20200101'
      });

      mockHttp.post.and.returnValue(of(response));

      service.getEconomicActivity(body).subscribe(res => {
        expect(res).toEqual(cached);
        expect(mockHttp.post).toHaveBeenCalledWith(
          '/mock-url',
          body,
          jasmine.objectContaining({ context: jasmine.anything() })
        );
        expect(mockStorage.setCatalog).toHaveBeenCalledWith(catalogName, fresh);
        done();
      });
    });

  });

  describe('getDistrictMunicipality', () => {

    const catalogName = 'documentType';

    const body = [{
      idMunicipalityCve: '1',
      idState: 10
    }];

    const buildItem = (id: string): any => ({
      districtMunicipalityId: id,
      districtMunicipality: `DIST-${id}`
    });

    beforeEach(() => {
      (service as any).urls = {
        documentType: '/mock-url'
      };
    });

    it('sin cache', (done) => {
      const response = [buildItem('1'), buildItem('2')];

      mockStorage.getCatalog.and.returnValue({ data: [], updatedAt: '' });
      mockHttp.post.and.returnValue(of(response));

      service.getDistrictMunicipality(body as any).subscribe(res => {
        expect(mockHttp.post).toHaveBeenCalledWith('/mock-url', body);
        expect(mockStorage.setCatalog).toHaveBeenCalledWith(catalogName, response);
        expect(res).toEqual(response);
        done();
      });
    });

    it('cache actual', (done) => {
      const cached = [buildItem('1')];

      mockStorage.getCatalog.and.returnValue({
        data: cached,
        updatedAt: new Date().toISOString().slice(0, 10).replace(/-/g, '')
      });

      service.getDistrictMunicipality(body as any).subscribe(res => {
        expect(mockHttp.post).not.toHaveBeenCalled();
        expect(res).toEqual(cached);
        done();
      });
    });

    it('cache viejo', (done) => {
      const cached = [buildItem('1')];
      const fresh = [buildItem('2')];

      mockStorage.getCatalog.and.returnValue({
        data: cached,
        updatedAt: '20200101'
      });

      mockHttp.post.and.returnValue(of(fresh));

      service.getDistrictMunicipality(body as any).subscribe(res => {
        expect(res).toEqual(cached);
        expect(mockHttp.post).toHaveBeenCalledWith(
          '/mock-url',
          body,
          jasmine.objectContaining({ context: jasmine.anything() })
        );
        expect(mockStorage.setCatalog).toHaveBeenCalledWith(catalogName, fresh);
        done();
      });
    });

  });

  describe('getCountry', () => {

    const catalogName = 'country';

    const bodyBase = {
      land: []
    };

    const buildItem = (id: string): any => ({
      countryId: id,
      country: `COUNTRY-${id}`
    });

    const buildResponse = (items: any[]) => ({
      status: 200,
      payload: {
        countries: items
      },
      messages: []
    });

    beforeEach(() => {
      (service as any).urls = {
        country: '/mock-url'
      };
    });

    it('sin cache', (done) => {
      const body = { ...bodyBase, land: [] };
      const items = [buildItem('1'), buildItem('2')];
      const response = buildResponse(items);

      mockStorage.getCatalog.and.returnValue({ data: [], updatedAt: '' });
      mockHttp.post.and.returnValue(of(response));

      service.getCountry(body as any).subscribe(res => {
        expect(body.land.length).toBe(1);
        expect(mockHttp.post).toHaveBeenCalledWith('/mock-url', body);
        expect(mockStorage.setCatalog).toHaveBeenCalledWith(catalogName, items);
        expect(res).toEqual(items);
        done();
      });
    });

    it('cache actual', (done) => {
      const cached = [buildItem('1')];

      mockStorage.getCatalog.and.returnValue({
        data: cached,
        updatedAt: new Date().toISOString().slice(0, 10).replace(/-/g, '')
      });

      service.getCountry({ ...bodyBase, land: ['MX'] } as any).subscribe(res => {
        expect(mockHttp.post).not.toHaveBeenCalled();
        expect(res).toEqual(cached);
        done();
      });
    });

    it('cache viejo', (done) => {
      const cached = [buildItem('1')];
      const fresh = [buildItem('2')];
      const response = buildResponse(fresh);

      const body = { ...bodyBase, land: ['MX'] };

      mockStorage.getCatalog.and.returnValue({
        data: cached,
        updatedAt: '20200101'
      });

      mockHttp.post.and.returnValue(of(response));

      service.getCountry(body as any).subscribe(res => {
        expect(res).toEqual(cached);
        expect(mockHttp.post).toHaveBeenCalledWith(
          '/mock-url',
          body,
          jasmine.objectContaining({ context: jasmine.anything() })
        );
        expect(mockStorage.setCatalog).toHaveBeenCalledWith(catalogName, fresh);
        done();
      });
    });

  });

  describe('getContractTop', () => {

    const buildItem = (ranking: number): any => ({
      typeContractSubtypeId: ranking,
      contractSubtype: `SUB-${ranking}`,
      ranking
    });

    beforeEach(() => {
      (service as any).urls = {
        contractTop: '/mock-url'
      };

      spyOn(service, 'top3Contracts').and.callFake((arr: any[]) =>
        arr.sort((a, b) => a.ranking - b.ranking).slice(0, 3)
      );
    });

    it('sin cache persona', (done) => {
      const body = { personTypeId: 1 };
      const response = [buildItem(3), buildItem(1), buildItem(2), buildItem(5)];
      const expected = [...response].sort((a, b) => a.ranking - b.ranking).slice(0, 3);

      mockStorage.getCatalog.and.returnValue({ data: [], updatedAt: '' });
      mockHttp.post.and.returnValue(of(response));

      service.getContractTop(body as any).subscribe(res => {
        expect(mockHttp.post).toHaveBeenCalledWith('/mock-url', body);
        expect(service.top3Contracts).toHaveBeenCalledWith(response);
        expect(mockStorage.setCatalog).toHaveBeenCalledWith('contractTopPerson', expected);
        expect(res).toEqual(expected);
        done();
      });
    });

    it('sin cache legal', (done) => {
      const body = { personTypeId: 2 };
      const response = [buildItem(2), buildItem(1), buildItem(3)];
      const expected = [...response].sort((a, b) => a.ranking - b.ranking).slice(0, 3);

      mockStorage.getCatalog.and.returnValue({ data: [], updatedAt: '' });
      mockHttp.post.and.returnValue(of(response));

      service.getContractTop(body as any).subscribe(res => {
        expect(mockStorage.setCatalog).toHaveBeenCalledWith('contractTopLegal', expected);
        expect(res).toEqual(expected);
        done();
      });
    });

    it('cache actual', (done) => {
      const body = { personTypeId: 1 };
      const cached = [buildItem(1), buildItem(2), buildItem(3)];

      mockStorage.getCatalog.and.returnValue({
        data: cached,
        updatedAt: new Date().toISOString().slice(0, 10).replace(/-/g, '')
      });

      service.getContractTop(body as any).subscribe(res => {
        expect(mockHttp.post).not.toHaveBeenCalled();
        expect(res).toEqual(cached);
        done();
      });
    });

    it('cache viejo', (done) => {
      const body = { personTypeId: 1 };
      const cached = [buildItem(1)];
      const response = [buildItem(3), buildItem(2), buildItem(1)];
      const expected = [...response].sort((a, b) => a.ranking - b.ranking).slice(0, 3);

      mockStorage.getCatalog.and.returnValue({
        data: cached,
        updatedAt: '20200101'
      });

      mockHttp.post.and.returnValue(of(response));

      service.getContractTop(body as any).subscribe(res => {
        expect(res).toEqual(cached);
        expect(mockHttp.post).toHaveBeenCalledWith(
          '/mock-url',
          body,
          jasmine.objectContaining({ context: jasmine.anything() })
        );
        expect(mockStorage.setCatalog).toHaveBeenCalledWith('contractTopPerson', expected);
        done();
      });
    });

  });

  describe('getContract', () => {

    const body = {
      personTypeId: 1
    };

    const buildItem = (id: number): any => ({
      bankAreaTypeId: id,
      contractTypeId: id,
      contractType: `TYPE-${id}`
    });

    beforeEach(() => {
      (service as any).urls = {
        'customer-contract': '/mock-url'
      };
    });

    it('sin cache', (done) => {
      const response = [buildItem(1), buildItem(2)];

      mockStorage.getContracts.and.returnValue([]);
      mockHttp.post.and.returnValue(of(response));

      service.getContract(body as any).subscribe(res => {
        expect(mockStorage.getContracts).toHaveBeenCalledWith(body.personTypeId);
        expect(mockHttp.post).toHaveBeenCalledWith('/mock-url', body);
        expect(mockStorage.setContracts).toHaveBeenCalledWith(body.personTypeId, response);
        expect(res).toEqual(response);
        done();
      });
    });

    it('con cache', (done) => {
      const cached = [buildItem(1)];

      mockStorage.getContracts.and.returnValue(cached);

      service.getContract(body as any).subscribe(res => {
        expect(mockHttp.post).not.toHaveBeenCalled();
        expect(res).toEqual(cached);
        done();
      });
    });

  });

  describe('getAmountRetreatsAvg', () => {

    const catalogName = 'amountRetreatsAvg';

    const body = {} as any;

    const buildItem = (id: string): any => ({
      code: id,
      description: `RANGE-${id}`
    });

    const buildResponse = (items: any[]) => ({
      status: '200',
      messages: [],
      payload: {
        ranges: items
      }
    });

    beforeEach(() => {
      (service as any).urls = {
        amountRetreatsAvg: '/mock-url'
      };
    });

    it('sin cache', (done) => {
      const items = [buildItem('1'), buildItem('2')];
      const response = buildResponse(items);

      mockStorage.getCatalog.and.returnValue({ data: [], updatedAt: '' });
      mockHttp.post.and.returnValue(of(response));

      service.getAmountRetreatsAvg(body).subscribe(res => {
        expect(mockHttp.post).toHaveBeenCalledWith('/mock-url', body);
        expect(mockStorage.setCatalog).toHaveBeenCalledWith(catalogName, items);
        expect(res).toEqual(items);
        done();
      });
    });

    it('cache actual', (done) => {
      const cached = [buildItem('1')];

      mockStorage.getCatalog.and.returnValue({
        data: cached,
        updatedAt: new Date().toISOString().slice(0, 10).replace(/-/g, '')
      });

      service.getAmountRetreatsAvg(body).subscribe(res => {
        expect(mockHttp.post).not.toHaveBeenCalled();
        expect(res).toEqual(cached);
        done();
      });
    });

    it('cache viejo', (done) => {
      const cached = [buildItem('1')];
      const fresh = [buildItem('2')];
      const response = buildResponse(fresh);

      mockStorage.getCatalog.and.returnValue({
        data: cached,
        updatedAt: '20200101'
      });

      mockHttp.post.and.returnValue(of(response));

      service.getAmountRetreatsAvg(body).subscribe(res => {
        expect(res).toEqual(cached);
        expect(mockHttp.post).toHaveBeenCalledWith(
          '/mock-url',
          body,
          jasmine.objectContaining({ context: jasmine.anything() })
        );
        expect(mockStorage.setCatalog).toHaveBeenCalledWith(catalogName, fresh);
        done();
      });
    });

  });

  describe('getAdvisor', () => {

    const catalogName = 'advisor';

    const buildItem = (id: string): any => ({
      id,
      name: `ADV-${id}`
    });

    beforeEach(() => {
      (service as any).urls = {
        advisor: '/mock-url'
      };
    });

    it('sin cache', (done) => {
      const response = [buildItem('1'), buildItem('2')];

      mockStorage.getCatalog.and.returnValue({ data: [], updatedAt: '' });
      mockHttp.post.and.returnValue(of(response));

      service.getAdvisor().subscribe(res => {
        expect(mockHttp.post).toHaveBeenCalledWith('/mock-url');
        expect(mockStorage.setCatalog).toHaveBeenCalledWith(catalogName, response);
        expect(res).toEqual(response);
        done();
      });
    });

    it('cache actual', (done) => {
      const cached = [buildItem('1')];

      mockStorage.getCatalog.and.returnValue({
        data: cached,
        updatedAt: new Date().toISOString().slice(0, 10).replace(/-/g, '')
      });

      service.getAdvisor().subscribe(res => {
        expect(mockHttp.post).not.toHaveBeenCalled();
        expect(res).toEqual(cached);
        done();
      });
    });

    it('cache viejo', (done) => {
      const cached = [buildItem('1')];
      const fresh = [buildItem('2')];

      mockStorage.getCatalog.and.returnValue({
        data: cached,
        updatedAt: '20200101'
      });

      mockHttp.post.and.returnValue(of(fresh));

      service.getAdvisor().subscribe(res => {
        expect(res).toEqual(cached);
        expect(mockHttp.post).toHaveBeenCalledWith(
          '/mock-url',
          undefined,
          jasmine.objectContaining({ context: jasmine.anything() })
        );
        expect(mockStorage.setCatalog).toHaveBeenCalledWith(catalogName, fresh);
        done();
      });
    });

  });

  describe('getAddressType', () => {

    const catalogName = 'addressType';

    const body = {
      types: ['A']
    } as any;

    const buildItem = (id: string): any => ({
      addressTypeId: id,
      addressType: `ADDR-${id}`
    });

    const buildResponse = (items: any[]) => ({
      payload: {
        addressType: {
          item: items
        }
      }
    });

    beforeEach(() => {
      (service as any).urls = {
        addressType: '/mock-url'
      };
    });

    it('sin cache', (done) => {
      const items = [buildItem('1'), buildItem('2')];
      const response = buildResponse(items);

      mockStorage.getCatalog.and.returnValue({ data: [], updatedAt: '' });
      mockHttp.post.and.returnValue(of(response));

      service.getAddressType(body).subscribe(res => {
        expect(mockHttp.post).toHaveBeenCalledWith('/mock-url', body);
        expect(mockStorage.setCatalog).toHaveBeenCalledWith(catalogName, items);
        expect(res).toEqual(items);
        done();
      });
    });

    it('cache actual', (done) => {
      const cached = [buildItem('1')];

      mockStorage.getCatalog.and.returnValue({
        data: cached,
        updatedAt: new Date().toISOString().slice(0, 10).replace(/-/g, '')
      });

      service.getAddressType(body).subscribe(res => {
        expect(mockHttp.post).not.toHaveBeenCalled();
        expect(res).toEqual(cached);
        done();
      });
    });

    it('cache viejo', (done) => {
      const cached = [buildItem('1')];
      const fresh = [buildItem('2')];
      const response = buildResponse(fresh);

      mockStorage.getCatalog.and.returnValue({
        data: cached,
        updatedAt: '20200101'
      });

      mockHttp.post.and.returnValue(of(response));

      service.getAddressType(body).subscribe(res => {
        expect(res).toEqual(cached);
        expect(mockHttp.post).toHaveBeenCalledWith(
          '/mock-url',
          body,
          jasmine.objectContaining({ context: jasmine.anything() })
        );
        expect(mockStorage.setCatalog).toHaveBeenCalledWith(catalogName, fresh);
        done();
      });
    });

  });

  describe('getAccountStatement', () => {

    const catalogName = 'accountStatement';

    const body = {} as any;

    const buildItem = (id: string): any => ({
      accountStatementId: id,
      accountStatement: `STATEMENT-${id}`
    });

    beforeEach(() => {
      (service as any).urls = {
        accountStatement: '/mock-url'
      };
    });

    it('sin cache', (done) => {
      const response = [buildItem('1'), buildItem('2')];

      mockStorage.getCatalog.and.returnValue({ data: [], updatedAt: '' });
      mockHttp.post.and.returnValue(of(response));

      service.getAccountStatement(body).subscribe(res => {
        expect(mockHttp.post).toHaveBeenCalledWith('/mock-url', body);
        expect(mockStorage.setCatalog).toHaveBeenCalledWith(catalogName, response);
        expect(res).toEqual(response);
        done();
      });
    });

    it('cache actual', (done) => {
      const cached = [buildItem('1')];

      mockStorage.getCatalog.and.returnValue({
        data: cached,
        updatedAt: new Date().toISOString().slice(0, 10).replace(/-/g, '')
      });

      service.getAccountStatement(body).subscribe(res => {
        expect(mockHttp.post).not.toHaveBeenCalled();
        expect(res).toEqual(cached);
        done();
      });
    });

    it('cache viejo', (done) => {
      const cached = [buildItem('1')];

      mockStorage.getCatalog.and.returnValue({
        data: cached,
        updatedAt: '20200101'
      });

      service.getAccountStatement(body).subscribe(res => {
        expect(mockHttp.post).not.toHaveBeenCalled();
        expect(res).toEqual(cached);
        done();
      });
    });

  });
});