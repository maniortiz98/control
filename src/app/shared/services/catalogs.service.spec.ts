import { TestBed } from '@angular/core/testing';
import { CatalogsService } from './catalogs.service';
import { LocalStorageService } from '../../core/services/local-storage.service';
import { HttpClientService } from '../../core/services/http-client.service';
import { firstValueFrom, of } from 'rxjs';
import { CatalogsAllowed } from '../types/catalogs.type';

describe('CatalogsService', () => {
  let service: CatalogsService;
  let localStorageService: jasmine.SpyObj<LocalStorageService>;
  let httpClientService: jasmine.SpyObj<HttpClientService>;
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');

  beforeEach(() => {
    localStorageService = jasmine.createSpyObj('LocalStorageService', [
      'getCatalog',
      'setCatalog',
      'getSeparatedByIdCatalog',
      'setSeparatedByIdCatalog',
      'getClassificationPersonByPersonType',
      'setClassificationPersonByPersonType',
      'getSubcontracts',
      'setSubcontracts',
      'getContracts',
      'setContracts',
    ]);
    httpClientService = jasmine.createSpyObj('HttpClientService', ['get', 'post', 'put', 'delete']);

    TestBed.configureTestingModule({
      providers: [
        CatalogsService,
        { provide: LocalStorageService, useValue: localStorageService },
        { provide: HttpClientService, useValue: httpClientService }
      ]
    });

    service = TestBed.inject(CatalogsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getLocal should delegate to LocalStorageService.getCatalog', () => {
    const catalogName = 'accountType' as CatalogsAllowed;
    const stored = { data: [{ id: 1 }], updatedAt: today } as any;
    localStorageService.getCatalog.and.returnValue(stored);

    const result = service.getLocal(catalogName);

    expect(localStorageService.getCatalog).toHaveBeenCalledWith(catalogName);
    expect(result).toEqual(stored);
  });

  describe('getAccountType', () => {
    it('should return fresh cached data without calling HTTP', async () => {
      const cached = [{ accountTypeId: '1' }] as any;
      localStorageService.getCatalog.and.returnValue({
        data: cached,
        updatedAt: today,
      } as any);

      const result = await firstValueFrom(service.getAccountType({ accountTypeIds: [] } as any));

      expect(result).toEqual(cached);
      expect(httpClientService.post).not.toHaveBeenCalled();
    });

    it('should fetch and store data when cache is empty', async () => {
      const response = [{ accountTypeId: '1' }] as any;
      localStorageService.getCatalog.and.returnValue({
        data: [],
        updatedAt: today,
      } as any);
      httpClientService.post.and.returnValue(of(response));

      const body = { accountTypeIds: [] } as any;
      const result = await firstValueFrom(service.getAccountType(body));

      expect(httpClientService.post).toHaveBeenCalled();
      expect(localStorageService.setCatalog).toHaveBeenCalledWith('accountType', response);
      expect(result).toEqual(response);
    });

    it('should return stale cached data and trigger background refresh', async () => {
      const cached = [{ accountTypeId: 'OLD' }] as any;
      const refreshed = [{ accountTypeId: 'NEW' }] as any;
      localStorageService.getCatalog.and.returnValue({
        data: cached,
        updatedAt: '19990101',
      } as any);
      httpClientService.post.and.returnValue(of(refreshed));

      const result = await firstValueFrom(service.getAccountType({ accountTypeIds: [] } as any));

      expect(result).toEqual(cached);
      expect(httpClientService.post).toHaveBeenCalled();
      expect(localStorageService.setCatalog).toHaveBeenCalledWith('accountType', refreshed);
    });
  });

  describe('getAddressType', () => {
    it('should return fresh cache without HTTP call', async () => {
      const cached = [{ addressTypeId: '1', addressType: 'HOME' }] as any;
      localStorageService.getCatalog.and.returnValue({
        data: cached,
        updatedAt: today,
      } as any);

      const result = await firstValueFrom(service.getAddressType({ addressTypeIds: [] } as any));

      expect(result).toEqual(cached);
      expect(httpClientService.post).not.toHaveBeenCalled();
    });

    it('should map payload items and persist when cache is empty', async () => {
      const items = [{ addressTypeId: '1', addressType: 'HOME' }] as any;
      localStorageService.getCatalog.and.returnValue({
        data: [],
        updatedAt: today,
      } as any);
      httpClientService.post.and.returnValue(of({
        payload: {
          addressType: {
            item: items,
          },
        },
      } as any));

      const result = await firstValueFrom(service.getAddressType({ addressTypeIds: [] } as any));

      expect(result).toEqual(items);
      expect(localStorageService.setCatalog).toHaveBeenCalledWith('addressType', items);
    });

    it('should return stale cache and trigger background refresh', async () => {
      const cached = [{ addressTypeId: 'OLD', addressType: 'OLD' }] as any;
      const refreshed = [{ addressTypeId: 'NEW', addressType: 'NEW' }] as any;
      localStorageService.getCatalog.and.returnValue({
        data: cached,
        updatedAt: '19990101',
      } as any);
      httpClientService.post.and.returnValue(of({
        payload: {
          addressType: {
            item: refreshed,
          },
        },
      } as any));

      const result = await firstValueFrom(service.getAddressType({ addressTypeIds: [] } as any));

      expect(result).toEqual(cached);
      expect(httpClientService.post).toHaveBeenCalled();
      expect(localStorageService.setCatalog).toHaveBeenCalledWith('addressType', refreshed);
    });
  });

  describe('getAddressRole', () => {
    it('should return fresh cache without HTTP call', async () => {
      const cached = [{ addressRoleId: '1' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: cached, updatedAt: today } as any);

      const result = await firstValueFrom(service.getAddressRole({ addressRoleIds: [] } as any));

      expect(result).toEqual(cached);
      expect(httpClientService.post).not.toHaveBeenCalled();
    });

    it('should fetch and persist when cache is empty', async () => {
      const response = [{ addressRoleId: '1', addressRole: 'Fiscal' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: [], updatedAt: today } as any);
      httpClientService.post.and.returnValue(of(response));

      const result = await firstValueFrom(service.getAddressRole({ addressRoleIds: [] } as any));

      expect(result).toEqual(response);
      expect(localStorageService.setCatalog).toHaveBeenCalledWith('addressRole', response);
    });

    it('should return stale cache and trigger background refresh', async () => {
      const cached = [{ addressRoleId: 'OLD' }] as any;
      const refreshed = [{ addressRoleId: 'NEW' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: cached, updatedAt: '19990101' } as any);
      httpClientService.post.and.returnValue(of(refreshed));

      const result = await firstValueFrom(service.getAddressRole({ addressRoleIds: [] } as any));

      expect(result).toEqual(cached);
      expect(httpClientService.post).toHaveBeenCalled();
      expect(localStorageService.setCatalog).toHaveBeenCalledWith('addressRole', refreshed);
    });
  });

  describe('getAdvisor', () => {
    it('should return fresh cache without HTTP call', async () => {
      const cached = [{ advisorId: '1' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: cached, updatedAt: today } as any);

      const result = await firstValueFrom(service.getAdvisor());

      expect(result).toEqual(cached);
      expect(httpClientService.post).not.toHaveBeenCalled();
    });

    it('should fetch and persist advisor catalog when cache is empty', async () => {
      const response = [{ advisorId: '1', advisor: 'Test' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: [], updatedAt: today } as any);
      httpClientService.post.and.returnValue(of(response));

      const result = await firstValueFrom(service.getAdvisor());

      expect(result).toEqual(response);
      expect(localStorageService.setCatalog).toHaveBeenCalledWith('advisor', response);
    });

    it('should return stale cache and trigger background refresh', async () => {
      const cached = [{ advisorId: 'OLD' }] as any;
      const refreshed = [{ advisorId: 'NEW' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: cached, updatedAt: '19990101' } as any);
      httpClientService.post.and.returnValue(of(refreshed));

      const result = await firstValueFrom(service.getAdvisor());

      expect(result).toEqual(cached);
      expect(httpClientService.post).toHaveBeenCalled();
      expect(localStorageService.setCatalog).toHaveBeenCalledWith('advisor', refreshed);
    });
  });

  describe('getAmountRetreatsAvg', () => {
    it('should return fresh cache without HTTP call', async () => {
      const cached = [{ id: 1, range: '0-1000' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: cached, updatedAt: today } as any);

      const result = await firstValueFrom(service.getAmountRetreatsAvg({ amountRetreatsAvgIds: [] } as any));

      expect(result).toEqual(cached);
      expect(httpClientService.post).not.toHaveBeenCalled();
    });

    it('should map payload.ranges and persist when cache is empty', async () => {
      const ranges = [{ id: 1, range: '0-1000' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: [], updatedAt: today } as any);
      httpClientService.post.and.returnValue(of({ payload: { ranges } } as any));

      const result = await firstValueFrom(service.getAmountRetreatsAvg({ amountRetreatsAvgIds: [] } as any));

      expect(result).toEqual(ranges);
      expect(localStorageService.setCatalog).toHaveBeenCalledWith('amountRetreatsAvg', ranges);
    });

    it('should return stale cache and trigger background refresh', async () => {
      const cached = [{ id: 'OLD' }] as any;
      const refreshed = [{ id: 'NEW' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: cached, updatedAt: '19990101' } as any);
      httpClientService.post.and.returnValue(of({ payload: { ranges: refreshed } } as any));

      const result = await firstValueFrom(service.getAmountRetreatsAvg({ amountRetreatsAvgIds: [] } as any));

      expect(result).toEqual(cached);
      expect(httpClientService.post).toHaveBeenCalled();
      expect(localStorageService.setCatalog).toHaveBeenCalledWith('amountRetreatsAvg', refreshed);
    });
  });

  describe('getAuthorizedPerson', () => {
    it('should return fresh cache without HTTP call', async () => {
      const cached = [{ key: '1' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: cached, updatedAt: today } as any);

      const result = await firstValueFrom(service.getAuthorizedPerson({ personTypes: [] } as any));

      expect(result).toEqual(cached);
      expect(httpClientService.post).not.toHaveBeenCalled();
    });

    it('should fetch and persist when cache is empty', async () => {
      const response = [{ key: '1', value: 'Tutor' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: [], updatedAt: today } as any);
      httpClientService.post.and.returnValue(of(response));

      const result = await firstValueFrom(service.getAuthorizedPerson({ personTypes: [] } as any));

      expect(result).toEqual(response);
      expect(localStorageService.setCatalog).toHaveBeenCalledWith('authorizedPerson', response);
    });

    it('should return stale cache and trigger background refresh', async () => {
      const cached = [{ key: 'OLD' }] as any;
      const refreshed = [{ key: 'NEW' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: cached, updatedAt: '19990101' } as any);
      httpClientService.post.and.returnValue(of(refreshed));

      const result = await firstValueFrom(service.getAuthorizedPerson({ personTypes: [] } as any));

      expect(result).toEqual(cached);
      expect(httpClientService.post).toHaveBeenCalled();
      expect(localStorageService.setCatalog).toHaveBeenCalledWith('authorizedPerson', refreshed);
    });
  });

  describe('getAccountStatement', () => {
    it('should return fresh cache without HTTP call', async () => {
      const cached = [{ id: 'A' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: cached, updatedAt: today } as any);

      const result = await firstValueFrom(service.getAccountStatement({} as any));

      expect(result).toEqual(cached);
      expect(httpClientService.post).not.toHaveBeenCalled();
    });

    it('should fetch and persist when cache is empty', async () => {
      const response = [{ id: 'B' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: [], updatedAt: today } as any);
      httpClientService.post.and.returnValue(of(response));

      const result = await firstValueFrom(service.getAccountStatement({} as any));

      expect(result).toEqual(response);
      expect(localStorageService.setCatalog).toHaveBeenCalledWith('accountStatement', response);
    });

    it('should return stale cache without background refresh call', async () => {
      const cached = [{ id: 'A' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: cached, updatedAt: '19990101' } as any);

      const result = await firstValueFrom(service.getAccountStatement({} as any));

      expect(result).toEqual(cached);
      expect(httpClientService.post).not.toHaveBeenCalled();
    });
  });

  describe('getAccountRole', () => {
    it('should return fresh cache without HTTP call', async () => {
      const cached = [{ accountRoleId: '1' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: cached, updatedAt: today } as any);

      const result = await firstValueFrom(service.getAccountRole({} as any));

      expect(result).toEqual(cached);
      expect(httpClientService.post).not.toHaveBeenCalled();
    });

    it('should fetch and persist when cache is empty', async () => {
      const response = [{ accountRoleId: 'NEW' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: [], updatedAt: today } as any);
      httpClientService.post.and.returnValue(of(response));

      const result = await firstValueFrom(service.getAccountRole({} as any));

      expect(result).toEqual(response);
      expect(localStorageService.setCatalog).toHaveBeenCalledWith('accountRole', response);
    });

    it('should return stale cache and trigger background refresh', async () => {
      const cached = [{ accountRoleId: 'OLD' }] as any;
      const refreshed = [{ accountRoleId: 'NEW' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: cached, updatedAt: '19990101' } as any);
      httpClientService.post.and.returnValue(of(refreshed));

      const result = await firstValueFrom(service.getAccountRole({} as any));

      expect(result).toEqual(cached);
      expect(httpClientService.post).toHaveBeenCalled();
      expect(localStorageService.setCatalog).toHaveBeenCalledWith('accountRole', refreshed);
    });
  });

  describe('getBank', () => {
    it('should return fresh separated-by-id cache data', async () => {
      const cached = [{ bankId: '1', bank: 'Bank A' }] as any;
      localStorageService.getSeparatedByIdCatalog.and.returnValue({
        MX: {
          data: cached,
          updatedAt: today,
        },
      } as any);

      const result = await firstValueFrom(service.getBank({ country: 'MX' } as any));

      expect(result).toEqual(cached);
      expect(httpClientService.post).not.toHaveBeenCalled();
    });

    it('should fetch and store separated-by-id data when cache for key is empty', async () => {
      const response = [{ bankId: '2', bank: 'Bank B' }] as any;
      localStorageService.getSeparatedByIdCatalog.and.returnValue({} as any);
      httpClientService.post.and.returnValue(of(response));

      const result = await firstValueFrom(service.getBank({ country: 'MX' } as any));

      expect(result).toEqual(response);
      expect(localStorageService.setSeparatedByIdCatalog)
        .toHaveBeenCalledWith('bank', 'MX', response);
    });

    it('should return stale separated-by-id cache and trigger background refresh', async () => {
      const cached = [{ bankId: 'OLD' }] as any;
      const refreshed = [{ bankId: 'NEW' }] as any;
      localStorageService.getSeparatedByIdCatalog.and.returnValue({
        MX: { data: cached, updatedAt: '19990101' },
      } as any);
      httpClientService.post.and.returnValue(of(refreshed));

      const result = await firstValueFrom(service.getBank({ country: 'MX' } as any));

      expect(result).toEqual(cached);
      expect(httpClientService.post).toHaveBeenCalled();
      expect(localStorageService.setSeparatedByIdCatalog)
        .toHaveBeenCalledWith('bank', 'MX', refreshed);
    });
  });

  describe('getCfdi', () => {
    it('should return fresh separated cache without HTTP call', async () => {
      const cached = [{ cfdiId: '1' }] as any;
      localStorageService.getSeparatedByIdCatalog.and.returnValue({
        '1-601': { data: cached, updatedAt: today },
      } as any);

      const result = await firstValueFrom(service.getCfdi({ personType: '1', fiscalRegimeId: '601' } as any));

      expect(result).toEqual(cached);
      expect(httpClientService.post).not.toHaveBeenCalled();
    });

    it('should fetch and store separated data when cache is empty', async () => {
      const response = { payload: { cfdi: { item: [{ cfdiId: 'NEW' }] } } } as any;
      localStorageService.getSeparatedByIdCatalog.and.returnValue({} as any);
      httpClientService.post.and.returnValue(of(response));

      const result = await firstValueFrom(service.getCfdi({ personType: '1', fiscalRegimeId: '601' } as any));

      expect(result).toEqual(response.payload.cfdi.item);
      expect(localStorageService.setSeparatedByIdCatalog)
        .toHaveBeenCalledWith('cfdi', '1-601', response.payload.cfdi.item);
    });

    it('should return stale separated cache and trigger background refresh', async () => {
      const cached = [{ cfdiId: 'OLD' }] as any;
      const refreshed = [{ cfdiId: 'NEW' }] as any;
      localStorageService.getSeparatedByIdCatalog.and.returnValue({
        '1-601': { data: cached, updatedAt: '19990101' },
      } as any);
      httpClientService.post.and.returnValue(of({
        payload: { cfdi: { item: refreshed } },
      } as any));

      const result = await firstValueFrom(service.getCfdi({ personType: '1', fiscalRegimeId: '601' } as any));

      expect(result).toEqual(cached);
      expect(localStorageService.setSeparatedByIdCatalog)
        .toHaveBeenCalledWith('cfdi', '1-601', refreshed);
    });
  });

  describe('getClassificationPerson', () => {
    it('should request catalog, normalize null ids, persist and filter by personType', async () => {
      const responseItems = [
        { text: 'PF A', personTypeId: null },
        { text: 'PM B', personTypeId: '2' },
      ] as any;
      localStorageService.getClassificationPersonByPersonType.and.returnValue([]);
      httpClientService.post.and.returnValue(of({
        payload: { personType: { item: responseItems } },
      } as any));

      const result = await firstValueFrom(service.getClassificationPerson({ personType: '1' } as any));

      expect(localStorageService.setClassificationPersonByPersonType).toHaveBeenCalled();
      expect(result).toEqual([{ text: 'PF A', personTypeId: '1' }] as any);
    });

    it('should return local data when available', async () => {
      const local = [{ text: 'Local PF', personTypeId: '1' }] as any;
      localStorageService.getClassificationPersonByPersonType.and.returnValue(local);

      const result = await firstValueFrom(service.getClassificationPerson({ personType: '1' } as any));

      expect(result).toEqual(local);
      expect(httpClientService.post).not.toHaveBeenCalled();
    });
  });

  describe('getClientKnowledge', () => {
    it('should return fresh cache without HTTP call', async () => {
      const cached = [{ id: '1', description: 'ALTO' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: cached, updatedAt: today } as any);

      const result = await firstValueFrom(service.getClientKnowledge({ clientKnowledgeIds: [] } as any));

      expect(result).toEqual(cached);
      expect(httpClientService.post).not.toHaveBeenCalled();
    });

    it('should fetch and persist when cache is empty', async () => {
      const response = [{ id: '1', description: 'ALTO' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: [], updatedAt: today } as any);
      httpClientService.post.and.returnValue(of(response));

      const result = await firstValueFrom(service.getClientKnowledge({ clientKnowledgeIds: [] } as any));

      expect(result).toEqual(response);
      expect(localStorageService.setCatalog).toHaveBeenCalledWith('clientKnowledge', response);
    });

    it('should return stale cache and trigger background refresh', async () => {
      const cached = [{ id: 'OLD', description: 'BAJO' }] as any;
      const refreshed = [{ id: 'NEW', description: 'ALTO' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: cached, updatedAt: '19990101' } as any);
      httpClientService.post.and.returnValue(of(refreshed));

      const result = await firstValueFrom(service.getClientKnowledge({ clientKnowledgeIds: [] } as any));

      expect(result).toEqual(cached);
      expect(httpClientService.post).toHaveBeenCalled();
      expect(localStorageService.setCatalog).toHaveBeenCalledWith('clientKnowledge', refreshed);
    });
  });

  describe('getClientNoGuaranteedIpab', () => {
    it('should return fresh cache without HTTP call', async () => {
      const cached = [{ id: '1', description: 'NO GARANTIZADO' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: cached, updatedAt: today } as any);

      const result = await firstValueFrom(service.getClientNoGuaranteedIpab({ clientNoGuaranteedIpabIds: [] } as any));

      expect(result).toEqual(cached);
      expect(httpClientService.post).not.toHaveBeenCalled();
    });

    it('should fetch and persist when cache is empty', async () => {
      const response = [{ id: '1', description: 'NO GARANTIZADO' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: [], updatedAt: today } as any);
      httpClientService.post.and.returnValue(of(response));

      const result = await firstValueFrom(service.getClientNoGuaranteedIpab({ clientNoGuaranteedIpabIds: [] } as any));

      expect(result).toEqual(response);
      expect(localStorageService.setCatalog).toHaveBeenCalledWith('clientNoGuaranteedIpab', response);
    });

    it('should return stale cache and trigger background refresh', async () => {
      const cached = [{ id: 'OLD', description: 'GARANTIZADO' }] as any;
      const refreshed = [{ id: 'NEW', description: 'NO GARANTIZADO' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: cached, updatedAt: '19990101' } as any);
      httpClientService.post.and.returnValue(of(refreshed));

      const result = await firstValueFrom(service.getClientNoGuaranteedIpab({ clientNoGuaranteedIpabIds: [] } as any));

      expect(result).toEqual(cached);
      expect(httpClientService.post).toHaveBeenCalled();
      expect(localStorageService.setCatalog).toHaveBeenCalledWith('clientNoGuaranteedIpab', refreshed);
    });
  });

  describe('getContract', () => {
    it('should return local contracts when available', async () => {
      const localContracts = [{ contractTypeId: '01' }] as any;
      localStorageService.getContracts.and.returnValue(localContracts);

      const result = await firstValueFrom(service.getContract({ personTypeId: 1 } as any));

      expect(result).toEqual(localContracts);
      expect(httpClientService.post).not.toHaveBeenCalled();
    });

    it('should fetch and persist contracts when local is empty', async () => {
      const response = [{ contractTypeId: '02' }] as any;
      localStorageService.getContracts.and.returnValue([]);
      httpClientService.post.and.returnValue(of(response));

      const result = await firstValueFrom(service.getContract({ personTypeId: 1 } as any));

      expect(result).toEqual(response);
      expect(localStorageService.setContracts).toHaveBeenCalledWith(1, response);
    });

    it('should call setContracts with correct personTypeId', async () => {
      const response = [{ contractTypeId: '03' }] as any;
      localStorageService.getContracts.and.returnValue([]);
      httpClientService.post.and.returnValue(of(response));

      await firstValueFrom(service.getContract({ personTypeId: 2 } as any));

      expect(localStorageService.setContracts).toHaveBeenCalledWith(2, response);
    });
  });

  describe('getContractTop', () => {
    it('should return fresh cache without HTTP call', async () => {
      const cached = [
        { ranking: 1, key: 'A' },
        { ranking: 2, key: 'B' },
      ] as any;
      localStorageService.getCatalog.and.returnValue({ data: cached, updatedAt: today } as any);

      const result = await firstValueFrom(service.getContractTop({ personTypeId: 1 } as any));

      expect(result).toEqual(cached);
      expect(httpClientService.post).not.toHaveBeenCalled();
    });

    it('should fetch and store only top 3 ranked contracts when cache is empty', async () => {
      const response = [
        { ranking: 5, key: 'X' },
        { ranking: 2, key: 'B' },
        { ranking: 1, key: 'A' },
        { ranking: 3, key: 'C' },
      ] as any;
      localStorageService.getCatalog.and.returnValue({ data: [], updatedAt: today } as any);
      httpClientService.post.and.returnValue(of(response));

      const result = await firstValueFrom(service.getContractTop({ personTypeId: 1 } as any));

      expect(result).toEqual([
        { ranking: 1, key: 'A' },
        { ranking: 2, key: 'B' },
        { ranking: 3, key: 'C' },
      ] as any);
      expect(localStorageService.setCatalog).toHaveBeenCalledWith('contractTopPerson', result);
    });

    it('should return stale cache and trigger background refresh with top3 filter', async () => {
      const cached = [{ ranking: 1, key: 'OLD' }] as any;
      const response = [
        { ranking: 3, key: 'C' },
        { ranking: 1, key: 'A' },
        { ranking: 2, key: 'B' },
      ] as any;
      localStorageService.getCatalog.and.returnValue({ data: cached, updatedAt: '19990101' } as any);
      httpClientService.post.and.returnValue(of(response));

      const result = await firstValueFrom(service.getContractTop({ personTypeId: 1 } as any));

      expect(result).toEqual(cached);
      expect(localStorageService.setCatalog).toHaveBeenCalledWith('contractTopPerson', [
        { ranking: 1, key: 'A' },
        { ranking: 2, key: 'B' },
        { ranking: 3, key: 'C' },
      ]);
    });
  });

  describe('getTransactionLimits', () => {
    it('should return fresh cache without HTTP call', async () => {
      const cached = [{ min: 0, max: 100 }] as any;
      localStorageService.getCatalog.and.returnValue({ data: cached, updatedAt: today } as any);

      const result = await firstValueFrom(service.getTransactionLimits());

      expect(result).toEqual(cached);
      expect(httpClientService.post).not.toHaveBeenCalled();
    });

    it('should fetch and persist when cache is empty', async () => {
      const response = [{ min: 0, max: 100 }] as any;
      localStorageService.getCatalog.and.returnValue({ data: [], updatedAt: today } as any);
      httpClientService.post.and.returnValue(of(response));

      const result = await firstValueFrom(service.getTransactionLimits());

      expect(result).toEqual(response);
      expect(localStorageService.setCatalog).toHaveBeenCalledWith('transactionalLimits', response);
    });

    it('should return stale cache and trigger background refresh', async () => {
      const cached = [{ min: 0, max: 100 }] as any;
      const refreshed = [{ min: 10, max: 200 }] as any;
      localStorageService.getCatalog.and.returnValue({ data: cached, updatedAt: '19990101' } as any);
      httpClientService.post.and.returnValue(of(refreshed));

      const result = await firstValueFrom(service.getTransactionLimits());

      expect(result).toEqual(cached);
      expect(httpClientService.post).toHaveBeenCalled();
      expect(localStorageService.setCatalog).toHaveBeenCalledWith('transactionalLimits', refreshed);
    });
  });

  describe('getCountry', () => {
    it('should push empty string when body.land is empty and map payload countries', async () => {
      const countries = [{ countryId: 'MX', country: 'Mexico' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: [], updatedAt: today } as any);
      httpClientService.post.and.returnValue(of({
        payload: { countries },
      } as any));

      const body = { land: [] as string[] } as any;
      const result = await firstValueFrom(service.getCountry(body));

      expect(body.land).toEqual(['']);
      expect(result).toEqual(countries);
      expect(localStorageService.setCatalog).toHaveBeenCalledWith('country', countries);
    });

    it('should return stale cache and refresh in background', async () => {
      const cached = [{ countryId: 'OLD' }] as any;
      const refreshed = [{ countryId: 'NEW' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: cached, updatedAt: '19990101' } as any);
      httpClientService.post.and.returnValue(of({ payload: { countries: refreshed } } as any));

      const result = await firstValueFrom(service.getCountry({ land: ['MX'] } as any));

      expect(result).toEqual(cached);
      expect(localStorageService.setCatalog).toHaveBeenCalledWith('country', refreshed);
    });
  });

  describe('getCurrencyType', () => {
    it('should return fresh cache without HTTP call', async () => {
      const cached = [{ currencyTypeId: 'MXN', currencyType: 'Peso' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: cached, updatedAt: today } as any);

      const result = await firstValueFrom(service.getCurrencyType({ currencyTypeIds: [] } as any));

      expect(result).toEqual(cached);
      expect(httpClientService.post).not.toHaveBeenCalled();
    });

    it('should fetch and persist when cache is empty', async () => {
      const response = [{ currencyTypeId: 'MXN', currencyType: 'Peso' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: [], updatedAt: today } as any);
      httpClientService.post.and.returnValue(of(response));

      const result = await firstValueFrom(service.getCurrencyType({ currencyTypeIds: [] } as any));

      expect(result).toEqual(response);
      expect(localStorageService.setCatalog).toHaveBeenCalledWith('currencyType', response);
    });

    it('should return stale cache and trigger background refresh', async () => {
      const cached = [{ currencyTypeId: 'OLD' }] as any;
      const refreshed = [{ currencyTypeId: 'MXN' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: cached, updatedAt: '19990101' } as any);
      httpClientService.post.and.returnValue(of(refreshed));

      const result = await firstValueFrom(service.getCurrencyType({ currencyTypeIds: [] } as any));

      expect(result).toEqual(cached);
      expect(httpClientService.post).toHaveBeenCalled();
      expect(localStorageService.setCatalog).toHaveBeenCalledWith('currencyType', refreshed);
    });
  });

  describe('getDistrictMunicipality', () => {
    it('should return fresh cache without HTTP call', async () => {
      const cached = [{ districtId: '1', municipalityId: '001' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: cached, updatedAt: today } as any);

      const result = await firstValueFrom(service.getDistrictMunicipality([{ stateId: '09' }] as any));

      expect(result).toEqual(cached);
      expect(httpClientService.post).not.toHaveBeenCalled();
    });

    it('should fetch and persist when cache is empty', async () => {
      const response = [{ districtId: '1', municipalityId: '001' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: [], updatedAt: today } as any);
      httpClientService.post.and.returnValue(of(response));

      const result = await firstValueFrom(service.getDistrictMunicipality([{ stateId: '09' }] as any));

      expect(result).toEqual(response);
      expect(localStorageService.setCatalog).toHaveBeenCalledWith('documentType', response);
    });

    it('should return stale cache and trigger background refresh', async () => {
      const cached = [{ districtId: 'OLD' }] as any;
      const refreshed = [{ districtId: 'NEW' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: cached, updatedAt: '19990101' } as any);
      httpClientService.post.and.returnValue(of(refreshed));

      const result = await firstValueFrom(service.getDistrictMunicipality([{ stateId: '09' }] as any));

      expect(result).toEqual(cached);
      expect(httpClientService.post).toHaveBeenCalled();
      expect(localStorageService.setCatalog).toHaveBeenCalledWith('documentType', refreshed);
    });
  });
  describe('getDocumentType', () => {
    it('should return fresh cache without HTTP call', async () => {
      const cached = [{ documentTypeId: '1', documentType: 'INE' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: cached, updatedAt: today } as any);

      const result = await firstValueFrom(service.getDocumentType({ documentTypeIds: [] } as any));

      expect(result).toEqual(cached);
      expect(httpClientService.post).not.toHaveBeenCalled();
    });

    it('should fetch and persist when cache is empty', async () => {
      const response = [{ documentTypeId: '1', documentType: 'INE' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: [], updatedAt: today } as any);
      httpClientService.post.and.returnValue(of(response));

      const result = await firstValueFrom(service.getDocumentType({ documentTypeIds: [] } as any));

      expect(result).toEqual(response);
      expect(localStorageService.setCatalog).toHaveBeenCalledWith('documentType', response);
    });

    it('should return stale cache and trigger background refresh', async () => {
      const cached = [{ documentTypeId: 'OLD' }] as any;
      const refreshed = [{ documentTypeId: 'NEW' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: cached, updatedAt: '19990101' } as any);
      httpClientService.post.and.returnValue(of(refreshed));

      const result = await firstValueFrom(service.getDocumentType({ documentTypeIds: [] } as any));

      expect(result).toEqual(cached);
      expect(httpClientService.post).toHaveBeenCalled();
      expect(localStorageService.setCatalog).toHaveBeenCalledWith('documentType', refreshed);
    });
  });

  describe('getEconomicActivity', () => {
    it('should return fresh cache without HTTP call', async () => {
      const cached = [{ activityId: '1', activity: 'Commerce' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: cached, updatedAt: today } as any);

      const result = await firstValueFrom(service.getEconomicActivity({ economicActivityIds: [] } as any));

      expect(result).toEqual(cached);
      expect(httpClientService.post).not.toHaveBeenCalled();
    });

    it('should map payload.economicActivity.item when cache is empty', async () => {
      const items = [{ activityId: '1', activity: 'Commerce' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: [], updatedAt: today } as any);
      httpClientService.post.and.returnValue(of({
        payload: { economicActivity: { item: items } },
      } as any));

      const result = await firstValueFrom(service.getEconomicActivity({ economicActivityIds: [] } as any));

      expect(result).toEqual(items);
      expect(localStorageService.setCatalog).toHaveBeenCalledWith('economicActivity', items);
    });

    it('should return stale cache and trigger background refresh', async () => {
      const cached = [{ activityId: 'OLD', activity: 'Old' }] as any;
      const refreshed = [{ activityId: 'NEW', activity: 'New' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: cached, updatedAt: '19990101' } as any);
      httpClientService.post.and.returnValue(of({
        payload: { economicActivity: { item: refreshed } },
      } as any));

      const result = await firstValueFrom(service.getEconomicActivity({ economicActivityIds: [] } as any));

      expect(result).toEqual(cached);
      expect(httpClientService.post).toHaveBeenCalled();
      expect(localStorageService.setCatalog).toHaveBeenCalledWith('economicActivity', refreshed);
    });
  });

  describe('getEconomicActivityAccredited', () => {
    it('should fetch and persist when cache is empty', async () => {
      const response = [{ activityId: '01', accredited: true }] as any;
      localStorageService.getCatalog.and.returnValue({ data: [], updatedAt: today } as any);
      httpClientService.post.and.returnValue(of(response));

      const result = await firstValueFrom(service.getEconomicActivityAccredited({ personType: '1' } as any));

      expect(result).toEqual(response);
      expect(localStorageService.setCatalog).toHaveBeenCalledWith('economicActivityAccredited', response);
    });
  });

  describe('getRiskGroup', () => {
    it('should return fresh cache without HTTP call', async () => {
      const cached = [{ riskGroupId: '1', riskGroup: 'LOW' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: cached, updatedAt: today } as any);

      const result = await firstValueFrom(service.getRiskGroup({ riskGroupIds: [] } as any));

      expect(result).toEqual(cached);
      expect(httpClientService.post).not.toHaveBeenCalled();
    });

    it('should fetch and persist when cache is empty', async () => {
      const response = [{ riskGroupId: '1', riskGroup: 'LOW' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: [], updatedAt: today } as any);
      httpClientService.post.and.returnValue(of(response));

      const result = await firstValueFrom(service.getRiskGroup({ riskGroupIds: [] } as any));

      expect(result).toEqual(response);
      expect(localStorageService.setCatalog).toHaveBeenCalledWith('riskGroup', response);
    });

    it('should return stale cache and trigger background refresh', async () => {
      const cached = [{ riskGroupId: 'OLD', riskGroup: 'OLD' }] as any;
      const refreshed = [{ riskGroupId: 'NEW', riskGroup: 'NEW' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: cached, updatedAt: '19990101' } as any);
      httpClientService.post.and.returnValue(of({ payload: { riskGroup: refreshed } } as any));

      const result = await firstValueFrom(service.getRiskGroup({ riskGroupIds: [] } as any));

      expect(result).toEqual(cached);
      expect(httpClientService.post).toHaveBeenCalled();
      expect(localStorageService.setCatalog).toHaveBeenCalledWith('riskGroup', refreshed);
    });
  });

  describe('getEconomicSector', () => {
    it('should return fresh cache without HTTP call', async () => {
      const cached = [{ sectorId: '1', sectorName: 'Technology' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: cached, updatedAt: today } as any);

      const result = await firstValueFrom(service.getEconomicSector({ sectorIds: [] } as any));

      expect(result).toEqual(cached);
      expect(httpClientService.post).not.toHaveBeenCalled();
    });

    it('should fetch and persist when cache is empty', async () => {
      const response = [{ sectorId: '1', sectorName: 'Technology' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: [], updatedAt: today } as any);
      httpClientService.post.and.returnValue(of(response));

      const result = await firstValueFrom(service.getEconomicSector({ sectorIds: [] } as any));

      expect(result).toEqual(response);
      expect(localStorageService.setCatalog).toHaveBeenCalledWith('economicSector', response);
    });

    it('should return stale cache and trigger background refresh', async () => {
      const cached = [{ sectorId: 'OLD', sectorName: 'Old' }] as any;
      const refreshed = [{ sectorId: 'NEW', sectorName: 'New' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: cached, updatedAt: '19990101' } as any);
      httpClientService.post.and.returnValue(of({ payload: { economicSector: refreshed } } as any));

      const result = await firstValueFrom(service.getEconomicSector({ sectorIds: [] } as any));

      expect(result).toEqual(cached);
      expect(httpClientService.post).toHaveBeenCalled();
      expect(localStorageService.setCatalog).toHaveBeenCalledWith('economicSector', refreshed);
    });
  });

  describe('getPaymentPeriod', () => {
    it('should return fresh cache without HTTP call', async () => {
      const cached = [{ periodId: '1', period: 'Monthly' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: cached, updatedAt: today } as any);

      const result = await firstValueFrom(service.getPaymentPeriod({ periodIds: [] } as any));

      expect(result).toEqual(cached);
      expect(httpClientService.post).not.toHaveBeenCalled();
    });

    it('should fetch and persist when cache is empty', async () => {
      const response = [{ periodId: '1', period: 'Monthly' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: [], updatedAt: today } as any);
      httpClientService.post.and.returnValue(of(response));

      const result = await firstValueFrom(service.getPaymentPeriod({ periodIds: [] } as any));

      expect(result).toEqual(response);
      expect(localStorageService.setCatalog).toHaveBeenCalledWith('paymentPeriod', response);
    });

    it('should return stale cache and trigger background refresh', async () => {
      const cached = [{ periodId: 'OLD', period: 'Old' }] as any;
      const refreshed = [{ periodId: 'NEW', period: 'New' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: cached, updatedAt: '19990101' } as any);
      httpClientService.post.and.returnValue(of({ payload: { paymentPeriod: refreshed } } as any));

      const result = await firstValueFrom(service.getPaymentPeriod({ periodIds: [] } as any));

      expect(result).toEqual(cached);
      expect(httpClientService.post).toHaveBeenCalled();
      expect(localStorageService.setCatalog).toHaveBeenCalledWith('paymentPeriod', refreshed);
    });
  });

  describe('getEconomicActivityByPersonType', () => {
    it('should return fresh separated-by-id cache data', async () => {
      const cached = [{ activityId: '1' }] as any;
      localStorageService.getSeparatedByIdCatalog.and.returnValue({
        '1': { data: cached, updatedAt: today },
      } as any);

      const result = await firstValueFrom(service.getEconomicActivityByPersonType({ subPersonTypeId: 1 } as any));

      expect(result).toEqual(cached);
      expect(httpClientService.post).not.toHaveBeenCalled();
    });

    it('should fetch and store separated-by-id data when cache is empty', async () => {
      const response = { payload: { economicActivity: { item: [{ activityId: '2' }] } } } as any;
      localStorageService.getSeparatedByIdCatalog.and.returnValue({} as any);
      httpClientService.post.and.returnValue(of(response));

      const result = await firstValueFrom(service.getEconomicActivityByPersonType({ subPersonTypeId: 1 } as any));

      expect(result).toEqual(response.payload.economicActivity.item);
      expect(localStorageService.setSeparatedByIdCatalog)
        .toHaveBeenCalledWith('economicActivityById', '1', response.payload.economicActivity.item);
    });

    it('should return stale separated-by-id cache and trigger background refresh', async () => {
      const cached = [{ activityId: 'OLD' }] as any;
      const refreshed = [{ activityId: 'NEW' }] as any;
      localStorageService.getSeparatedByIdCatalog.and.returnValue({
        '1': { data: cached, updatedAt: '19990101' },
      } as any);
      httpClientService.post.and.returnValue(of({
        payload: { economicActivity: { item: refreshed } },
      } as any));

      const result = await firstValueFrom(service.getEconomicActivityByPersonType({ subPersonTypeId: 1 } as any));

      expect(result).toEqual(cached);
      expect(httpClientService.post).toHaveBeenCalled();
      expect(localStorageService.setSeparatedByIdCatalog)
        .toHaveBeenCalledWith('economicActivityById', '1', refreshed);
    });
  });

  describe('getExperienceTime', () => {
    it('should return fresh separated-by-id cache data', async () => {
      const cached = [{ experienceId: '1', years: 5 }] as any;
      localStorageService.getSeparatedByIdCatalog.and.returnValue({
        '1': { data: cached, updatedAt: today },
      } as any);

      const result = await firstValueFrom(service.getExperienceTime({ idTipoPersona: 1 } as any));

      expect(result).toEqual(cached);
      expect(httpClientService.post).not.toHaveBeenCalled();
    });

    it('should fetch and store separated-by-id data when cache is empty', async () => {
      const response = [{ experienceId: '2', years: 10 }] as any;
      localStorageService.getSeparatedByIdCatalog.and.returnValue({} as any);
      httpClientService.post.and.returnValue(of(response));

      const result = await firstValueFrom(service.getExperienceTime({ idTipoPersona: 1 } as any));

      expect(result).toEqual(response);
      expect(localStorageService.setSeparatedByIdCatalog)
        .toHaveBeenCalledWith('experienceTime', '1', response);
    });

    it('should return stale separated-by-id cache and trigger background refresh', async () => {
      const cached = [{ experienceId: 'OLD', years: 2 }] as any;
      const refreshed = [{ experienceId: 'NEW', years: 8 }] as any;
      localStorageService.getSeparatedByIdCatalog.and.returnValue({
        '1': { data: cached, updatedAt: '19990101' },
      } as any);
      httpClientService.post.and.returnValue(of(refreshed));

      const result = await firstValueFrom(service.getExperienceTime({ idTipoPersona: 1 } as any));

      expect(result).toEqual(cached);
      expect(httpClientService.post).toHaveBeenCalled();
      expect(localStorageService.setSeparatedByIdCatalog)
        .toHaveBeenCalledWith('experienceTime', '1', refreshed);
    });
  });

  describe('getFederalEntity', () => {
    it('should return fresh cache without HTTP call and keep provided body', async () => {
      const cached = [{ stateId: '09', state: 'CDMX' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: cached, updatedAt: today } as any);

      const body = { land1s: ['MX'] } as any;
      const result = await firstValueFrom(service.getFederalEntity(body));

      expect(body.land1s).toEqual(['MX']);
      expect(result).toEqual(cached);
      expect(httpClientService.post).not.toHaveBeenCalled();
    });

    it('should normalize empty land1s and map payload item', async () => {
      const items = [{ stateId: '09', state: 'CDMX' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: [], updatedAt: today } as any);
      httpClientService.post.and.returnValue(of({
        payload: { federalEntity: { item: items } },
      } as any));

      const body = { land1s: [] as string[] } as any;
      const result = await firstValueFrom(service.getFederalEntity(body));

      expect(body.land1s).toEqual(['']);
      expect(result).toEqual(items);
      expect(localStorageService.setCatalog).toHaveBeenCalledWith('federalEntity', items);
    });

    it('should return stale cache and trigger background refresh', async () => {
      const cached = [{ stateId: 'OLD', state: 'Old' }] as any;
      const refreshed = [{ stateId: 'NEW', state: 'New' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: cached, updatedAt: '19990101' } as any);
      httpClientService.post.and.returnValue(of({
        payload: { federalEntity: { item: refreshed } },
      } as any));

      const body = { land1s: [] as string[] } as any;
      const result = await firstValueFrom(service.getFederalEntity(body));

      expect(body.land1s).toEqual(['']);
      expect(result).toEqual(cached);
      expect(httpClientService.post).toHaveBeenCalled();
      expect(localStorageService.setCatalog).toHaveBeenCalledWith('federalEntity', refreshed);
    });
  });

  describe('getFinancialCenter', () => {
    it('should return fresh cache without HTTP call', async () => {
      const cached = [{ centerId: '1', centerName: 'HQ' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: cached, updatedAt: today } as any);

      const result = await firstValueFrom(service.getFinancialCenter());

      expect(result).toEqual(cached);
      expect(httpClientService.post).not.toHaveBeenCalled();
    });

    it('should fetch and persist when cache is empty', async () => {
      const response = [{ centerId: '1', centerName: 'HQ' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: [], updatedAt: today } as any);
      httpClientService.post.and.returnValue(of(response));

      const result = await firstValueFrom(service.getFinancialCenter());

      expect(result).toEqual(response);
      expect(localStorageService.setCatalog).toHaveBeenCalledWith('financialCenter', response);
    });

    it('should return stale cache and trigger background refresh', async () => {
      const cached = [{ centerId: 'OLD', centerName: 'Old' }] as any;
      const refreshed = [{ centerId: 'NEW', centerName: 'New' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: cached, updatedAt: '19990101' } as any);
      httpClientService.post.and.returnValue(of(refreshed));

      const result = await firstValueFrom(service.getFinancialCenter());

      expect(result).toEqual(cached);
      expect(httpClientService.post).toHaveBeenCalled();
      expect(localStorageService.setCatalog).toHaveBeenCalledWith('financialCenter', refreshed);
    });
  });

  describe('getFiscalPersonType', () => {
    it('should return fresh cache without HTTP call and keep provided body', async () => {
      const cached = [{ typeId: '1', type: 'PF' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: cached, updatedAt: today } as any);

      const body = { land: ['MX'] } as any;
      const result = await firstValueFrom(service.getFiscalPersonType(body));

      expect(body.land).toEqual(['MX']);
      expect(result).toEqual(cached);
      expect(httpClientService.post).not.toHaveBeenCalled();
    });

    it('should normalize empty land and fetch when cache is empty', async () => {
      const response = [{ typeId: '1', type: 'PF' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: [], updatedAt: today } as any);
      httpClientService.post.and.returnValue(of(response));

      const body = { land: [] as string[] } as any;
      const result = await firstValueFrom(service.getFiscalPersonType(body));

      expect(body.land).toEqual(['']);
      expect(result).toEqual(response);
      expect(localStorageService.setCatalog).toHaveBeenCalledWith('fiscalPersonType', response);
    });

    it('should return stale cache and trigger background refresh', async () => {
      const cached = [{ typeId: 'OLD', type: 'Old' }] as any;
      const refreshed = [{ typeId: 'NEW', type: 'New' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: cached, updatedAt: '19990101' } as any);
      httpClientService.post.and.returnValue(of(refreshed));

      const body = { land: [] as string[] } as any;
      const result = await firstValueFrom(service.getFiscalPersonType(body));

      expect(body.land).toEqual(['']);
      expect(result).toEqual(cached);
      expect(httpClientService.post).toHaveBeenCalled();
      expect(localStorageService.setCatalog).toHaveBeenCalledWith('fiscalPersonType', refreshed);
    });
  });

  describe('getFiscalPersonSubType', () => {
    it('should return fresh cache without HTTP call and keep provided body', async () => {
      const cached = [{ subtypeId: '01', subtype: 'Sociedad' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: cached, updatedAt: today } as any);

      const body = { land: ['MX'] } as any;
      const result = await firstValueFrom(service.getFiscalPersonSubType(body));

      expect(body.land).toEqual(['MX']);
      expect(result).toEqual(cached);
      expect(httpClientService.post).not.toHaveBeenCalled();
    });

    it('should normalize empty land and fetch when cache is empty', async () => {
      const response = [{ subtypeId: '01', subtype: 'Sociedad' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: [], updatedAt: today } as any);
      httpClientService.post.and.returnValue(of(response));

      const body = { land: [] as string[] } as any;
      const result = await firstValueFrom(service.getFiscalPersonSubType(body));

      expect(body.land).toEqual(['']);
      expect(result).toEqual(response);
      expect(localStorageService.setCatalog).toHaveBeenCalledWith('fiscalPersonSubType', response);
    });

    it('should return stale cache and trigger background refresh', async () => {
      const cached = [{ subtypeId: 'OLD', subtype: 'Old' }] as any;
      const refreshed = [{ subtypeId: 'NEW', subtype: 'New' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: cached, updatedAt: '19990101' } as any);
      httpClientService.post.and.returnValue(of(refreshed));

      const body = { land: [] as string[] } as any;
      const result = await firstValueFrom(service.getFiscalPersonSubType(body));

      expect(body.land).toEqual(['']);
      expect(result).toEqual(cached);
      expect(httpClientService.post).toHaveBeenCalled();
      expect(localStorageService.setCatalog).toHaveBeenCalledWith('fiscalPersonSubType', refreshed);
    });
  });

  describe('getFiscalCertificate', () => {
    it('should return fresh cache without HTTP call', async () => {
      const cached = [{ certId: '1', certType: 'CFD' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: cached, updatedAt: today } as any);

      const result = await firstValueFrom(service.getFiscalCertificate({ certIds: [] } as any));

      expect(result).toEqual(cached);
      expect(httpClientService.post).not.toHaveBeenCalled();
    });

    it('should fetch and persist when cache is empty', async () => {
      const response = [{ certId: '1', certType: 'CFD' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: [], updatedAt: today } as any);
      httpClientService.post.and.returnValue(of(response));

      const result = await firstValueFrom(service.getFiscalCertificate({ certIds: [] } as any));

      expect(result).toEqual(response);
      expect(localStorageService.setCatalog).toHaveBeenCalledWith('fiscalCertificate', response);
    });

    it('should return stale cache and trigger background refresh', async () => {
      const cached = [{ certId: 'OLD', certType: 'OLD' }] as any;
      const refreshed = [{ certId: 'NEW', certType: 'NEW' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: cached, updatedAt: '19990101' } as any);
      httpClientService.post.and.returnValue(of(refreshed));

      const result = await firstValueFrom(service.getFiscalCertificate({ certIds: [] } as any));

      expect(result).toEqual(cached);
      expect(httpClientService.post).toHaveBeenCalled();
      expect(localStorageService.setCatalog).toHaveBeenCalledWith('fiscalCertificate', refreshed);
    });
  });

  describe('getFundsOriginCategory', () => {
    it('should return fresh cache without HTTP call', async () => {
      const cached = [{ categoryId: '1', category: 'Salary' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: cached, updatedAt: today } as any);

      const result = await firstValueFrom(service.getFundsOriginCategory());

      expect(result).toEqual(cached);
      expect(httpClientService.post).not.toHaveBeenCalled();
    });

    it('should fetch and persist when cache is empty', async () => {
      const response = [{ categoryId: '1', category: 'Salary' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: [], updatedAt: today } as any);
      httpClientService.post.and.returnValue(of(response));

      const result = await firstValueFrom(service.getFundsOriginCategory());

      expect(result).toEqual(response);
      expect(localStorageService.setCatalog).toHaveBeenCalledWith('fundsOriginCategory', response);
    });

    it('should return stale cache and trigger background refresh', async () => {
      const cached = [{ categoryId: 'OLD', category: 'Old' }] as any;
      const refreshed = [{ categoryId: 'NEW', category: 'New' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: cached, updatedAt: '19990101' } as any);
      httpClientService.post.and.returnValue(of(refreshed));

      const result = await firstValueFrom(service.getFundsOriginCategory());

      expect(result).toEqual(cached);
      expect(httpClientService.post).toHaveBeenCalled();
      expect(localStorageService.setCatalog).toHaveBeenCalledWith('fundsOriginCategory', refreshed);
    });
  });

  describe('getInvestmentType', () => {
    it('should return fresh cache without HTTP call', async () => {
      const cached = [{ investmentTypeId: '1', investmentType: 'Stocks' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: cached, updatedAt: today } as any);

      const result = await firstValueFrom(service.getInvestmentType({ investmentTypeIds: [] } as any));

      expect(result).toEqual(cached);
      expect(httpClientService.post).not.toHaveBeenCalled();
    });

    it('should fetch and persist when cache is empty', async () => {
      const response = [{ investmentTypeId: '1', investmentType: 'Stocks' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: [], updatedAt: today } as any);
      httpClientService.post.and.returnValue(of(response));

      const result = await firstValueFrom(service.getInvestmentType({ investmentTypeIds: [] } as any));

      expect(result).toEqual(response);
      expect(localStorageService.setCatalog).toHaveBeenCalledWith('investmentType', response);
    });

    it('should return stale cache and trigger background refresh', async () => {
      const cached = [{ investmentTypeId: 'OLD', investmentType: 'Old' }] as any;
      const refreshed = [{ investmentTypeId: 'NEW', investmentType: 'New' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: cached, updatedAt: '19990101' } as any);
      httpClientService.post.and.returnValue(of(refreshed));

      const result = await firstValueFrom(service.getInvestmentType({ investmentTypeIds: [] } as any));

      expect(result).toEqual(cached);
      expect(httpClientService.post).toHaveBeenCalled();
      expect(localStorageService.setCatalog).toHaveBeenCalledWith('investmentType', refreshed);
    });
  });

  describe('getInterviewPlaces', () => {
    it('should return fresh cache without HTTP call', async () => {
      const cached = [{ placeId: '1', place: 'Office' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: cached, updatedAt: today } as any);

      const result = await firstValueFrom(service.getInterviewPlaces({ placeIds: [] } as any));

      expect(result).toEqual(cached);
      expect(httpClientService.post).not.toHaveBeenCalled();
    });

    it('should fetch and persist when cache is empty', async () => {
      const response = [{ placeId: '1', place: 'Office' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: [], updatedAt: today } as any);
      httpClientService.post.and.returnValue(of(response));

      const result = await firstValueFrom(service.getInterviewPlaces({ placeIds: [] } as any));

      expect(result).toEqual(response);
      expect(localStorageService.setCatalog).toHaveBeenCalledWith('interviewPlaces', response);
    });

    it('should return stale cache and trigger background refresh', async () => {
      const cached = [{ placeId: 'OLD', place: 'Old' }] as any;
      const refreshed = [{ placeId: 'NEW', place: 'New' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: cached, updatedAt: '19990101' } as any);
      httpClientService.post.and.returnValue(of(refreshed));

      const result = await firstValueFrom(service.getInterviewPlaces({ placeIds: [] } as any));

      expect(result).toEqual(cached);
      expect(httpClientService.post).toHaveBeenCalled();
      expect(localStorageService.setCatalog).toHaveBeenCalledWith('interviewPlaces', refreshed);
    });
  });

  describe('getMarriageType', () => {
    it('should return fresh cache without HTTP call', async () => {
      const cached = [{ marriageTypeId: '1', marriageType: 'Single' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: cached, updatedAt: today } as any);

      const result = await firstValueFrom(service.getMarriageType({ marriageTypeIds: [] } as any));

      expect(result).toEqual(cached);
      expect(httpClientService.post).not.toHaveBeenCalled();
    });

    it('should map payload.marriageType.item when cache is empty', async () => {
      const items = [{ marriageTypeId: '1', marriageType: 'Single' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: [], updatedAt: today } as any);
      httpClientService.post.and.returnValue(of({
        payload: { marriageType: { item: items } },
      } as any));

      const result = await firstValueFrom(service.getMarriageType({ marriageTypeIds: [] } as any));

      expect(result).toEqual(items);
      expect(localStorageService.setCatalog).toHaveBeenCalledWith('marriageType', items);
    });

    it('should return stale cache and trigger background refresh', async () => {
      const cached = [{ marriageTypeId: 'OLD', marriageType: 'Old' }] as any;
      const refreshed = [{ marriageTypeId: 'NEW', marriageType: 'New' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: cached, updatedAt: '19990101' } as any);
      httpClientService.post.and.returnValue(of({
        payload: { marriageType: { item: refreshed } },
      } as any));

      const result = await firstValueFrom(service.getMarriageType({ marriageTypeIds: [] } as any));

      expect(result).toEqual(cached);
      expect(httpClientService.post).toHaveBeenCalled();
      expect(localStorageService.setCatalog).toHaveBeenCalledWith('marriageType', refreshed);
    });
  });

  describe('getMonthlyDeposit', () => {
    it('should return fresh cache without HTTP call', async () => {
      const cached = [{ depositId: '1', amount: 5000 }] as any;
      localStorageService.getCatalog.and.returnValue({ data: cached, updatedAt: today } as any);

      const result = await firstValueFrom(service.getMonthlyDeposit({ monthlyOperationalsNumberIds: [] } as any));

      expect(result).toEqual(cached);
      expect(httpClientService.post).not.toHaveBeenCalled();
    });

    it('should fetch and persist when cache is empty', async () => {
      const response = [{ depositId: '1', amount: 5000 }] as any;
      localStorageService.getCatalog.and.returnValue({ data: [], updatedAt: today } as any);
      httpClientService.post.and.returnValue(of(response));

      const result = await firstValueFrom(service.getMonthlyDeposit({ monthlyOperationalsNumberIds: [] } as any));

      expect(result).toEqual(response);
      expect(localStorageService.setCatalog).toHaveBeenCalledWith('monthlyDeposit', response);
    });

    it('should return stale cache and trigger background refresh', async () => {
      const cached = [{ depositId: 'OLD', amount: 1000 }] as any;
      const refreshed = [{ depositId: 'NEW', amount: 9000 }] as any;
      localStorageService.getCatalog.and.returnValue({ data: cached, updatedAt: '19990101' } as any);
      httpClientService.post.and.returnValue(of(refreshed));

      const result = await firstValueFrom(service.getMonthlyDeposit({ monthlyOperationalsNumberIds: [] } as any));

      expect(result).toEqual(cached);
      expect(httpClientService.post).toHaveBeenCalled();
      expect(localStorageService.setCatalog).toHaveBeenCalledWith('monthlyDeposit', refreshed);
    });
  });

  describe('getOriginResource', () => {
    it('should return fresh cache without HTTP call', async () => {
      const cached = [{ rangeId: '1', range: '0-1M' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: cached, updatedAt: today } as any);

      const result = await firstValueFrom(service.getOriginResource({ originIds: [] } as any));

      expect(result).toEqual(cached);
      expect(httpClientService.post).not.toHaveBeenCalled();
    });

    it('should map payload.ranges when cache is empty', async () => {
      const ranges = [{ rangeId: '1', range: '0-1M' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: [], updatedAt: today } as any);
      httpClientService.post.and.returnValue(of({
        payload: { ranges },
      } as any));

      const result = await firstValueFrom(service.getOriginResource({ originIds: [] } as any));

      expect(result).toEqual(ranges);
      expect(localStorageService.setCatalog).toHaveBeenCalledWith('origin_resource', ranges);
    });

    it('should return stale cache and trigger background refresh', async () => {
      const cached = [{ rangeId: 'OLD', range: 'Old' }] as any;
      const refreshed = [{ rangeId: 'NEW', range: 'New' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: cached, updatedAt: '19990101' } as any);
      httpClientService.post.and.returnValue(of({ payload: { ranges: refreshed } } as any));

      const result = await firstValueFrom(service.getOriginResource({ originIds: [] } as any));

      expect(result).toEqual(cached);
      expect(httpClientService.post).toHaveBeenCalled();
      expect(localStorageService.setCatalog).toHaveBeenCalledWith('origin_resource', refreshed);
    });
  });

  describe('getPersonRole', () => {
    it('should fetch and persist when cache is empty', async () => {
      const response = [{ roleId: '1', role: 'Admin' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: [], updatedAt: today } as any);
      httpClientService.post.and.returnValue(of(response));

      const result = await firstValueFrom(service.getPersonRole({ personRoleIds: [] } as any));

      expect(result).toEqual(response);
      expect(localStorageService.setCatalog).toHaveBeenCalledWith('personRole', response);
    });

    it('should return cached data when fresh', async () => {
      const cached = [{ roleId: '1', role: 'Admin' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: cached, updatedAt: today } as any);

      const result = await firstValueFrom(service.getPersonRole({ personRoleIds: [] } as any));

      expect(result).toEqual(cached);
      expect(httpClientService.post).not.toHaveBeenCalled();
    });

    it('should return cached data and trigger background refresh when stale', async () => {
      const cached = [{ roleId: '1', role: 'Admin' }] as any;
      const refreshed = [{ roleId: '2', role: 'User' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: cached, updatedAt: 'yesterday' } as any);
      httpClientService.post.and.returnValue(of(refreshed));

      const result = await firstValueFrom(service.getPersonRole({ personRoleIds: [] } as any));

      expect(result).toEqual(cached);
      expect(httpClientService.post).toHaveBeenCalled();
    });
  });

  describe('getProfileInvestment', () => {
    it('should fetch and persist when cache is empty', async () => {
      const response = [{ profileId: '1', profileName: 'Conservative' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: [], updatedAt: today } as any);
      httpClientService.post.and.returnValue(of(response));

      const result = await firstValueFrom(service.getProfileInvestment({ profileInvestmentIds: [] } as any));

      expect(result).toEqual(response);
      expect(localStorageService.setCatalog).toHaveBeenCalledWith('profileInvestment', response);
    });

    it('should return cached data when fresh', async () => {
      const cached = [{ profileId: '1', profileName: 'Conservative' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: cached, updatedAt: today } as any);

      const result = await firstValueFrom(service.getProfileInvestment({ profileInvestmentIds: [] } as any));

      expect(result).toEqual(cached);
      expect(httpClientService.post).not.toHaveBeenCalled();
    });

    it('should return cached data and trigger background refresh when stale', async () => {
      const cached = [{ profileId: '1', profileName: 'Conservative' }] as any;
      const refreshed = [{ profileId: '2', profileName: 'Moderate' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: cached, updatedAt: 'yesterday' } as any);
      httpClientService.post.and.returnValue(of(refreshed));

      const result = await firstValueFrom(service.getProfileInvestment({ profileInvestmentIds: [] } as any));

      expect(result).toEqual(cached);
      expect(httpClientService.post).toHaveBeenCalled();
    });
  });

  describe('getPhoneType', () => {
    it('should return fresh cache without HTTP call', async () => {
      const cached = [{ telephoneTypeId: '1', telephoneType: 'Mobile' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: cached, updatedAt: today } as any);

      const result = await firstValueFrom(service.getPhoneType({ telephoneTypeIds: [] } as any));

      expect(result).toEqual(cached);
      expect(httpClientService.post).not.toHaveBeenCalled();
    });

    it('should map payload telephoneType.item on empty cache', async () => {
      const items = [{ telephoneTypeId: '1', telephoneType: 'Mobile' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: [], updatedAt: today } as any);
      httpClientService.post.and.returnValue(of({
        payload: { telephoneType: { item: items } },
      } as any));

      const result = await firstValueFrom(service.getPhoneType({ telephoneTypeIds: [] } as any));

      expect(result).toEqual(items);
      expect(localStorageService.setCatalog).toHaveBeenCalledWith('phoneType', items);
    });

    it('should return stale cache and trigger background refresh', async () => {
      const cached = [{ telephoneTypeId: 'OLD', telephoneType: 'Old' }] as any;
      const refreshed = [{ telephoneTypeId: 'NEW', telephoneType: 'New' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: cached, updatedAt: '19990101' } as any);
      httpClientService.post.and.returnValue(of({ payload: { telephoneType: { item: refreshed } } } as any));

      const result = await firstValueFrom(service.getPhoneType({ telephoneTypeIds: [] } as any));

      expect(result).toEqual(cached);
      expect(httpClientService.post).toHaveBeenCalled();
      expect(localStorageService.setCatalog).toHaveBeenCalledWith('phoneType', refreshed);
    });
  });

  describe('getRelationships', () => {
    it('should return fresh cache without HTTP call', async () => {
      const cached = [{ relationshipId: '1', relationship: 'Parent' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: cached, updatedAt: today } as any);

      const result = await firstValueFrom(service.getRelationships({ relationshipIds: [] } as any));

      expect(result).toEqual(cached);
      expect(httpClientService.post).not.toHaveBeenCalled();
    });

    it('should map payload relationship.item on empty cache', async () => {
      const items = [{ relationshipId: '1', relationship: 'Parent' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: [], updatedAt: today } as any);
      httpClientService.post.and.returnValue(of({
        payload: { relationship: { item: items } },
      } as any));

      const result = await firstValueFrom(service.getRelationships({ relationshipIds: [] } as any));

      expect(result).toEqual(items);
      expect(localStorageService.setCatalog).toHaveBeenCalledWith('relationships', items);
    });

    it('should return stale cache and trigger background refresh', async () => {
      const cached = [{ relationshipId: 'OLD', relationship: 'Old' }] as any;
      const refreshed = [{ relationshipId: 'NEW', relationship: 'New' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: cached, updatedAt: '19990101' } as any);
      httpClientService.post.and.returnValue(of({ payload: { relationship: { item: refreshed } } } as any));

      const result = await firstValueFrom(service.getRelationships({ relationshipIds: [] } as any));

      expect(result).toEqual(cached);
      expect(httpClientService.post).toHaveBeenCalled();
      expect(localStorageService.setCatalog).toHaveBeenCalledWith('relationships', refreshed);
    });
  });

  describe('getFiscalRegime', () => {
    it('should return fresh cache without HTTP call', async () => {
      const cached = [{ fiscalRegimeId: '601', fiscalRegime: 'General' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: cached, updatedAt: today } as any);

      const result = await firstValueFrom(service.getFiscalRegime({ personType: '1' } as any));

      expect(result).toEqual(cached);
      expect(httpClientService.post).not.toHaveBeenCalled();
    });

    it('should map payload fiscalRegime.item on empty cache', async () => {
      const items = [{ fiscalRegimeId: '601', fiscalRegime: 'General' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: [], updatedAt: today } as any);
      httpClientService.post.and.returnValue(of({
        payload: { fiscalRegime: { item: items } },
      } as any));

      const result = await firstValueFrom(service.getFiscalRegime({ personType: '1' } as any));

      expect(result).toEqual(items);
      expect(localStorageService.setCatalog).toHaveBeenCalledWith('fiscalRegime', items);
    });

    it('should return stale cache and trigger background refresh', async () => {
      const cached = [{ fiscalRegimeId: 'OLD', fiscalRegime: 'Old' }] as any;
      const refreshed = [{ fiscalRegimeId: 'NEW', fiscalRegime: 'New' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: cached, updatedAt: '19990101' } as any);
      httpClientService.post.and.returnValue(of({
        payload: { fiscalRegime: { item: refreshed } },
      } as any));

      const result = await firstValueFrom(service.getFiscalRegime({ personType: '1' } as any));

      expect(result).toEqual(cached);
      expect(httpClientService.post).toHaveBeenCalled();
      expect(localStorageService.setCatalog).toHaveBeenCalledWith('fiscalRegime', refreshed);
    });
  });

  describe('getMonthlyDepositAvg', () => {
    it('should return fresh cache without HTTP call', async () => {
      const cached = [{ rangeId: 1 }] as any;
      localStorageService.getCatalog.and.returnValue({ data: cached, updatedAt: today } as any);

      const result = await firstValueFrom(service.getMonthlyDepositAvg({ monthlyOperationalsAmountIds: [] } as any));

      expect(result).toEqual(cached);
      expect(httpClientService.post).not.toHaveBeenCalled();
    });

    it('should fetch and persist response when cache is empty', async () => {
      const response = { payload: { ranges: [{ rangeId: 1 }] } } as any;
      localStorageService.getCatalog.and.returnValue({ data: [], updatedAt: today } as any);
      httpClientService.post.and.returnValue(of(response));

      const result = await firstValueFrom(service.getMonthlyDepositAvg({ monthlyOperationalsAmountIds: [] } as any));

      expect(result).toEqual(response as any);
      expect(localStorageService.setCatalog).toHaveBeenCalledWith('monthlyDepositAvg', response as any);
    });

    it('should return stale cache and trigger background refresh', async () => {
      const cached = [{ rangeId: 1 }] as any;
      const refreshed = { payload: { ranges: [{ rangeId: 2 }] } } as any;
      localStorageService.getCatalog.and.returnValue({ data: cached, updatedAt: '19990101' } as any);
      httpClientService.post.and.returnValue(of(refreshed));

      const result = await firstValueFrom(service.getMonthlyDepositAvg({ monthlyOperationalsAmountIds: [] } as any));

      expect(result).toEqual(cached);
      expect(httpClientService.post).toHaveBeenCalled();
      expect(localStorageService.setCatalog).toHaveBeenCalledWith('monthlyDepositAvg', refreshed);
    });
  });

  describe('getProofOfAddress', () => {
    it('should return fresh cache without HTTP call and keep provided body', async () => {
      const cached = [{ proofAddressTypeId: '01', proofAddressType: 'INE' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: cached, updatedAt: today } as any);

      const body = { proofAddressIds: ['01'] } as any;
      const result = await firstValueFrom(service.getProofOfAddress(body));

      expect(body.proofAddressIds).toEqual(['01']);
      expect(result).toEqual(cached);
      expect(httpClientService.post).not.toHaveBeenCalled();
    });

    it('should normalize empty proofAddressIds and map payload item', async () => {
      const items = [{ proofAddressTypeId: '01', proofAddressType: 'INE' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: [], updatedAt: today } as any);
      httpClientService.post.and.returnValue(of({
        payload: { proofOfAddressType: { item: items } },
      } as any));

      const body = { proofAddressIds: [] as string[] } as any;
      const result = await firstValueFrom(service.getProofOfAddress(body));

      expect(body.proofAddressIds).toEqual(['']);
      expect(result).toEqual(items);
      expect(localStorageService.setCatalog).toHaveBeenCalledWith('proofOfAddressType', items);
    });

    it('should return stale cache and trigger background refresh', async () => {
      const cached = [{ proofAddressTypeId: 'OLD', proofAddressType: 'Old' }] as any;
      const refreshed = [{ proofAddressTypeId: 'NEW', proofAddressType: 'New' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: cached, updatedAt: '19990101' } as any);
      httpClientService.post.and.returnValue(of({ payload: { proofOfAddressType: { item: refreshed } } } as any));

      const body = { proofAddressIds: [] as string[] } as any;
      const result = await firstValueFrom(service.getProofOfAddress(body));

      expect(body.proofAddressIds).toEqual(['']);
      expect(result).toEqual(cached);
      expect(httpClientService.post).toHaveBeenCalled();
      expect(localStorageService.setCatalog).toHaveBeenCalledWith('proofOfAddressType', refreshed);
    });
  });

  describe('getNationalities', () => {
    it('should return fresh cache without HTTP call', async () => {
      const cached = [{ nationalityId: 'MX', nationality: 'Mexicana' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: cached, updatedAt: today } as any);

      const result = await firstValueFrom(service.getNationalities({ nationalities: [] } as any));

      expect(result).toEqual(cached);
      expect(httpClientService.post).not.toHaveBeenCalled();
    });

    it('should map payload nationalities on empty cache', async () => {
      const items = [{ nationalityId: 'MX', nationality: 'Mexicana' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: [], updatedAt: today } as any);
      httpClientService.post.and.returnValue(of({ payload: { nationalities: items } } as any));

      const result = await firstValueFrom(service.getNationalities({ nationalities: [] } as any));

      expect(result).toEqual(items);
      expect(localStorageService.setCatalog).toHaveBeenCalledWith('nationality', items);
    });

    it('should return stale cache and trigger background refresh', async () => {
      const cached = [{ nationalityId: 'OLD', nationality: 'Old' }] as any;
      const refreshed = [{ nationalityId: 'NEW', nationality: 'New' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: cached, updatedAt: '19990101' } as any);
      httpClientService.post.and.returnValue(of({ payload: { nationalities: refreshed } } as any));

      const result = await firstValueFrom(service.getNationalities({ nationalities: [] } as any));

      expect(result).toEqual(cached);
      expect(httpClientService.post).toHaveBeenCalled();
      expect(localStorageService.setCatalog).toHaveBeenCalledWith('nationality', refreshed);
    });
  });

  describe('getMaritalStatus', () => {
    it('should return fresh cache without HTTP call and keep provided body', async () => {
      const cached = [{ maritalStatusId: '1', maritalStatus: 'Single' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: cached, updatedAt: today } as any);

      const body = { maritalStatusIds: ['1'] } as any;
      const result = await firstValueFrom(service.getMaritalStatus(body));

      expect(body.maritalStatusIds).toEqual(['1']);
      expect(result).toEqual(cached);
      expect(httpClientService.post).not.toHaveBeenCalled();
    });

    it('should normalize empty maritalStatusIds and map payload item', async () => {
      const items = [{ maritalStatusId: '1', maritalStatus: 'Single' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: [], updatedAt: today } as any);
      httpClientService.post.and.returnValue(of({
        payload: { maritalStatus: { item: items } },
      } as any));

      const body = { maritalStatusIds: [] as string[] } as any;
      const result = await firstValueFrom(service.getMaritalStatus(body));

      expect(body.maritalStatusIds).toEqual(['']);
      expect(result).toEqual(items);
      expect(localStorageService.setCatalog).toHaveBeenCalledWith('maritalStatus', items);
    });

    it('should return stale cache and trigger background refresh', async () => {
      const cached = [{ maritalStatusId: 'OLD', maritalStatus: 'Old' }] as any;
      const refreshed = [{ maritalStatusId: 'NEW', maritalStatus: 'New' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: cached, updatedAt: '19990101' } as any);
      httpClientService.post.and.returnValue(of({
        payload: { maritalStatus: { item: refreshed } },
      } as any));

      const body = { maritalStatusIds: [] as string[] } as any;
      const result = await firstValueFrom(service.getMaritalStatus(body));

      expect(body.maritalStatusIds).toEqual(['']);
      expect(result).toEqual(cached);
      expect(httpClientService.post).toHaveBeenCalled();
      expect(localStorageService.setCatalog).toHaveBeenCalledWith('maritalStatus', refreshed);
    });
  });

  describe('getIdentificationType', () => {
    it('should return fresh cache without HTTP call', async () => {
      const cached = [{ type: 'INE', text: 'INE' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: cached, updatedAt: today } as any);

      const result = await firstValueFrom(service.getIdentificationType({ typeIdentificationIds: [] } as any));

      expect(result).toEqual(cached);
      expect(httpClientService.post).not.toHaveBeenCalled();
    });

    it('should map payload identificationType.item on empty cache', async () => {
      const items = [{ type: 'INE', text: 'INE' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: [], updatedAt: today } as any);
      httpClientService.post.and.returnValue(of({
        payload: { identificationType: { item: items } },
      } as any));

      const result = await firstValueFrom(service.getIdentificationType({ typeIdentificationIds: [] } as any));

      expect(result).toEqual(items);
      expect(localStorageService.setCatalog).toHaveBeenCalledWith('identificationType', items);
    });

    it('should return stale cache and trigger background refresh', async () => {
      const cached = [{ type: 'OLD', text: 'Old' }] as any;
      const refreshed = [{ type: 'NEW', text: 'New' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: cached, updatedAt: '19990101' } as any);
      httpClientService.post.and.returnValue(of({
        payload: { identificationType: { item: refreshed } },
      } as any));

      const result = await firstValueFrom(service.getIdentificationType({ typeIdentificationIds: [] } as any));

      expect(result).toEqual(cached);
      expect(httpClientService.post).toHaveBeenCalled();
      expect(localStorageService.setCatalog).toHaveBeenCalledWith('identificationType', refreshed);
    });
  });

  describe('getServiceType and getServiceSubtype', () => {
    it('getServiceType should return cached data when fresh', async () => {
      const cached = [{ serviceTypeId: '1', serviceType: 'A' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: cached, updatedAt: today } as any);

      const result = await firstValueFrom(service.getServiceType({ serviceTypes: [] } as any));

      expect(result).toEqual(cached);
      expect(httpClientService.post).not.toHaveBeenCalled();
    });

    it('getServiceType should fetch and store when cache is empty', async () => {
      const response = [{ serviceTypeId: '1', serviceType: 'A' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: [], updatedAt: today } as any);
      httpClientService.post.and.returnValue(of(response));

      const result = await firstValueFrom(service.getServiceType({ serviceTypes: [] } as any));

      expect(result).toEqual(response);
      expect(localStorageService.setCatalog).toHaveBeenCalledWith('serviceType', response);
    });

    it('getServiceType should return stale cache and trigger background refresh', async () => {
      const cached = [{ serviceTypeId: 'OLD', serviceType: 'Old' }] as any;
      const refreshed = [{ serviceTypeId: 'NEW', serviceType: 'New' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: cached, updatedAt: '19990101' } as any);
      httpClientService.post.and.returnValue(of(refreshed));

      const result = await firstValueFrom(service.getServiceType({ serviceTypes: [] } as any));

      expect(result).toEqual(cached);
      expect(httpClientService.post).toHaveBeenCalled();
      expect(localStorageService.setCatalog).toHaveBeenCalledWith('serviceType', refreshed);
    });

    it('getServiceSubtype should fetch and store when cache is empty', async () => {
      const response = [{ serviceSubtypeId: '1', serviceSubtype: 'A1' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: [], updatedAt: today } as any);
      httpClientService.post.and.returnValue(of(response));

      const result = await firstValueFrom(service.getServiceSubtype({ serviceSubtypes: [] } as any));

      expect(result).toEqual(response);
      expect(localStorageService.setCatalog).toHaveBeenCalledWith('serviceSubtype', response);
    });

    it('getServiceSubtype should return cached data when fresh', async () => {
      const cached = [{ serviceSubtypeId: '1', serviceSubtype: 'A1' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: cached, updatedAt: today } as any);

      const result = await firstValueFrom(service.getServiceSubtype({ serviceSubtypes: [] } as any));

      expect(result).toEqual(cached);
      expect(httpClientService.post).not.toHaveBeenCalled();
    });

    it('getServiceSubtype should return stale cache and trigger background refresh', async () => {
      const cached = [{ serviceSubtypeId: 'OLD', serviceSubtype: 'Old' }] as any;
      const refreshed = [{ serviceSubtypeId: 'NEW', serviceSubtype: 'New' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: cached, updatedAt: '19990101' } as any);
      httpClientService.post.and.returnValue(of(refreshed));

      const result = await firstValueFrom(service.getServiceSubtype({ serviceSubtypes: [] } as any));

      expect(result).toEqual(cached);
      expect(httpClientService.post).toHaveBeenCalled();
      expect(localStorageService.setCatalog).toHaveBeenCalledWith('serviceSubtype', refreshed);
    });
  });

  describe('getPersonType and getOccupations', () => {
    it('getPersonType should return cached data when fresh', async () => {
      const cached = [{ personTypeId: '1', personType: 'PF' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: cached, updatedAt: today } as any);

      const result = await firstValueFrom(service.getPersonType({ subPersonTypeIds: ['1'] } as any));

      expect(result).toEqual(cached);
      expect(httpClientService.post).not.toHaveBeenCalled();
    });

    it('getPersonType should normalize empty subPersonTypeIds and map payload item', async () => {
      const items = [{ personTypeId: '1', personType: 'PF' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: [], updatedAt: today } as any);
      httpClientService.post.and.returnValue(of({
        payload: { personType: { item: items } },
      } as any));

      const body = { subPersonTypeIds: [] as string[] } as any;
      const result = await firstValueFrom(service.getPersonType(body));

      expect(body.subPersonTypeIds).toEqual(['']);
      expect(result).toEqual(items);
      expect(localStorageService.setCatalog).toHaveBeenCalledWith('personType', items);
    });

    it('getPersonType should return stale cache and trigger background refresh', async () => {
      const cached = [{ personTypeId: 'OLD', personType: 'Old' }] as any;
      const refreshed = [{ personTypeId: 'NEW', personType: 'New' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: cached, updatedAt: '19990101' } as any);
      httpClientService.post.and.returnValue(of({
        payload: { personType: { item: refreshed } },
      } as any));

      const body = { subPersonTypeIds: [] as string[] } as any;
      const result = await firstValueFrom(service.getPersonType(body));

      expect(body.subPersonTypeIds).toEqual(['']);
      expect(result).toEqual(cached);
      expect(httpClientService.post).toHaveBeenCalled();
      expect(localStorageService.setCatalog).toHaveBeenCalledWith('personType', refreshed);
    });

    it('getOccupations should normalize empty ocupationIds and map payload occupation.item', async () => {
      const items = [{ occupationId: '1', occupation: 'Engineer' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: [], updatedAt: today } as any);
      httpClientService.post.and.returnValue(of({
        payload: { occupation: { item: items } },
      } as any));

      const body = { ocupationIds: [] as string[] } as any;
      const result = await firstValueFrom(service.getOccupations(body));

      expect(body.ocupationIds).toEqual(['']);
      expect(result).toEqual(items);
      expect(localStorageService.setCatalog).toHaveBeenCalledWith('occupations', items);
    });

    it('getOccupations should return cached data when fresh', async () => {
      const cached = [{ occupationId: '1', occupation: 'Engineer' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: cached, updatedAt: today } as any);

      const result = await firstValueFrom(service.getOccupations({ ocupationIds: ['1'] } as any));

      expect(result).toEqual(cached);
      expect(httpClientService.post).not.toHaveBeenCalled();
    });

    it('getOccupations should return stale cache and trigger background refresh', async () => {
      const cached = [{ occupationId: 'OLD', occupation: 'Old' }] as any;
      const refreshed = [{ occupationId: 'NEW', occupation: 'New' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: cached, updatedAt: '19990101' } as any);
      httpClientService.post.and.returnValue(of({
        payload: { occupation: { item: refreshed } },
      } as any));

      const body = { ocupationIds: [] as string[] } as any;
      const result = await firstValueFrom(service.getOccupations(body));

      expect(body.ocupationIds).toEqual(['']);
      expect(result).toEqual(cached);
      expect(httpClientService.post).toHaveBeenCalled();
      expect(localStorageService.setCatalog).toHaveBeenCalledWith('occupations', refreshed);
    });
  });

  describe('getPropertyType', () => {
    it('should return fresh cache without HTTP call', async () => {
      const cached = [{ propertyTypeId: '1', propertyType: 'House' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: cached, updatedAt: today } as any);

      const result = await firstValueFrom(service.getPropertyType({ propertyTypeIds: [] } as any));

      expect(result).toEqual(cached);
      expect(httpClientService.post).not.toHaveBeenCalled();
    });

    it('should fetch and persist when cache is empty', async () => {
      const response = [{ propertyTypeId: '1', propertyType: 'House' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: [], updatedAt: today } as any);
      httpClientService.post.and.returnValue(of(response));

      const result = await firstValueFrom(service.getPropertyType({ propertyTypeIds: [] } as any));

      expect(result).toEqual(response);
      expect(localStorageService.setCatalog).toHaveBeenCalledWith('propertyType', response);
    });

    it('should return stale cache and trigger background refresh', async () => {
      const cached = [{ propertyTypeId: 'OLD', propertyType: 'Old' }] as any;
      const refreshed = [{ propertyTypeId: 'NEW', propertyType: 'New' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: cached, updatedAt: '19990101' } as any);
      httpClientService.post.and.returnValue(of(refreshed));

      const result = await firstValueFrom(service.getPropertyType({ propertyTypeIds: [] } as any));

      expect(result).toEqual(cached);
      expect(httpClientService.post).toHaveBeenCalled();
      expect(localStorageService.setCatalog).toHaveBeenCalledWith('propertyType', refreshed);
    });
  });

  describe('getTaxId', () => {
    it('should return fresh cache without HTTP call', async () => {
      const cached = [{ taxId: 'RFC', description: 'RFC' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: cached, updatedAt: today } as any);

      const result = await firstValueFrom(service.getTaxId({ taxIds: [] } as any));

      expect(result).toEqual(cached);
      expect(httpClientService.post).not.toHaveBeenCalled();
    });

    it('should fetch and persist when cache is empty', async () => {
      const response = [{ taxId: 'RFC', description: 'RFC' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: [], updatedAt: today } as any);
      httpClientService.post.and.returnValue(of(response));

      const result = await firstValueFrom(service.getTaxId({ taxIds: [] } as any));

      expect(result).toEqual(response);
      expect(localStorageService.setCatalog).toHaveBeenCalledWith('taxId', response);
    });

    it('should return stale cache and trigger background refresh', async () => {
      const cached = [{ taxId: 'OLD', description: 'Old' }] as any;
      const refreshed = [{ taxId: 'NEW', description: 'New' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: cached, updatedAt: '19990101' } as any);
      httpClientService.post.and.returnValue(of(refreshed));

      const result = await firstValueFrom(service.getTaxId({ taxIds: [] } as any));

      expect(result).toEqual(cached);
      expect(httpClientService.post).toHaveBeenCalled();
      expect(localStorageService.setCatalog).toHaveBeenCalledWith('taxId', refreshed);
    });
  });

  describe('getSubContract', () => {
    it('should return local subcontracts when available', async () => {
      const localData = [{ subContractTypeId: '01' }] as any;
      localStorageService.getSubcontracts.and.returnValue(localData);

      const result = await firstValueFrom(service.getSubContract({ personTypeId: 1, contractTypeId: 2 } as any));

      expect(result).toEqual(localData);
      expect(httpClientService.post).not.toHaveBeenCalled();
    });

    it('should fetch and persist subcontracts when local data is empty', async () => {
      const response = [{ subContractTypeId: '02' }] as any;
      localStorageService.getSubcontracts.and.returnValue([]);
      httpClientService.post.and.returnValue(of(response));

      const body = { personTypeId: 1, contractTypeId: 2 } as any;
      const result = await firstValueFrom(service.getSubContract(body));

      expect(result).toEqual(response);
      expect(localStorageService.setSubcontracts).toHaveBeenCalledWith(1, 2, response);
    });
  });

  describe('getStartedWorking', () => {
    it('should return fresh cache without HTTP call', async () => {
      const cached = [{ id: '1', text: '1 year' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: cached, updatedAt: today } as any);

      const result = await firstValueFrom(service.getStartedWorking());

      expect(result).toEqual(cached);
      expect(httpClientService.post).not.toHaveBeenCalled();
    });

    it('should fetch and persist when cache is empty', async () => {
      const response = [{ id: '1', text: '1 year' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: [], updatedAt: today } as any);
      httpClientService.post.and.returnValue(of(response));

      const result = await firstValueFrom(service.getStartedWorking());

      expect(result).toEqual(response);
      expect(localStorageService.setCatalog).toHaveBeenCalledWith('startedWorking', response);
    });

    it('should return stale cache and trigger background refresh', async () => {
      const cached = [{ id: 'OLD', text: 'Old' }] as any;
      const refreshed = [{ id: 'NEW', text: 'New' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: cached, updatedAt: '19990101' } as any);
      httpClientService.post.and.returnValue(of(refreshed));

      const result = await firstValueFrom(service.getStartedWorking());

      expect(result).toEqual(cached);
      expect(httpClientService.post).toHaveBeenCalled();
      expect(localStorageService.setCatalog).toHaveBeenCalledWith('startedWorking', refreshed);
    });
  });

  describe('getSignatureType', () => {
    it('should return fresh cache without HTTP call', async () => {
      const cached = [{ signatureTypeId: '1', signatureType: 'INDIVIDUAL' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: cached, updatedAt: today } as any);

      const result = await firstValueFrom(service.getSignatureType({ signatureTypeIds: [] } as any));

      expect(result).toEqual(cached);
      expect(httpClientService.post).not.toHaveBeenCalled();
    });

    it('should fetch and persist when cache is empty', async () => {
      const response = [{ signatureTypeId: '1', signatureType: 'INDIVIDUAL' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: [], updatedAt: today } as any);
      httpClientService.post.and.returnValue(of(response));

      const result = await firstValueFrom(service.getSignatureType({ signatureTypeIds: [] } as any));

      expect(result).toEqual(response);
      expect(localStorageService.setCatalog).toHaveBeenCalledWith('signatureType', response);
    });

    it('should return stale cache and trigger background refresh', async () => {
      const cached = [{ signatureTypeId: 'OLD', signatureType: 'Old' }] as any;
      const refreshed = [{ signatureTypeId: 'NEW', signatureType: 'New' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: cached, updatedAt: '19990101' } as any);
      httpClientService.post.and.returnValue(of(refreshed));

      const result = await firstValueFrom(service.getSignatureType({ signatureTypeIds: [] } as any));

      expect(result).toEqual(cached);
      expect(httpClientService.post).toHaveBeenCalled();
      expect(localStorageService.setCatalog).toHaveBeenCalledWith('signatureType', refreshed);
    });
  });

  describe('getSector', () => {
    it('should return fresh cache without HTTP call', async () => {
      const cached = [{ sectorId: '1', sector: 'FIN' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: cached, updatedAt: today } as any);

      const result = await firstValueFrom(service.getSector({ sectors: [] } as any));

      expect(result).toEqual(cached);
      expect(httpClientService.post).not.toHaveBeenCalled();
    });

    it('should fetch and persist when cache is empty', async () => {
      const response = [{ sectorId: '1', sector: 'FIN' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: [], updatedAt: today } as any);
      httpClientService.post.and.returnValue(of(response));

      const result = await firstValueFrom(service.getSector({ sectors: [] } as any));

      expect(result).toEqual(response);
      expect(localStorageService.setCatalog).toHaveBeenCalledWith('sector', response);
    });

    it('should return stale cache and trigger background refresh', async () => {
      const cached = [{ sectorId: 'OLD', sector: 'Old' }] as any;
      const refreshed = [{ sectorId: 'NEW', sector: 'New' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: cached, updatedAt: '19990101' } as any);
      httpClientService.post.and.returnValue(of(refreshed));

      const result = await firstValueFrom(service.getSector({ sectors: [] } as any));

      expect(result).toEqual(cached);
      expect(httpClientService.post).toHaveBeenCalled();
      expect(localStorageService.setCatalog).toHaveBeenCalledWith('sector', refreshed);
    });
  });

  describe('getResidentialArea', () => {
    it('should return fresh cache without HTTP call', async () => {
      const cached = [{ residentialAreaId: '1', residentialArea: 'Urban' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: cached, updatedAt: today } as any);

      const result = await firstValueFrom(service.getResidentialArea({ residentialAreaIds: [] } as any));

      expect(result).toEqual(cached);
      expect(httpClientService.post).not.toHaveBeenCalled();
    });

    it('should fetch and persist when cache is empty', async () => {
      const response = [{ residentialAreaId: '1', residentialArea: 'Urban' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: [], updatedAt: today } as any);
      httpClientService.post.and.returnValue(of(response));

      const result = await firstValueFrom(service.getResidentialArea({ residentialAreaIds: [] } as any));

      expect(result).toEqual(response);
      expect(localStorageService.setCatalog).toHaveBeenCalledWith('residentialArea', response);
    });

    it('should return stale cache and trigger background refresh', async () => {
      const cached = [{ residentialAreaId: 'OLD', residentialArea: 'Old' }] as any;
      const refreshed = [{ residentialAreaId: 'NEW', residentialArea: 'New' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: cached, updatedAt: '19990101' } as any);
      httpClientService.post.and.returnValue(of(refreshed));

      const result = await firstValueFrom(service.getResidentialArea({ residentialAreaIds: [] } as any));

      expect(result).toEqual(cached);
      expect(httpClientService.post).toHaveBeenCalled();
      expect(localStorageService.setCatalog).toHaveBeenCalledWith('residentialArea', refreshed);
    });
  });

  describe('getStrategiesEquity and CRUD', () => {
    it('should return fresh cache without HTTP get when forceRefresh is false', async () => {
      const cached = [{ idStrategy: 1, strategyName: 'A' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: cached, updatedAt: today } as any);

      const result = await firstValueFrom(service.getStrategiesEquity());

      expect(result).toEqual(cached);
      expect(httpClientService.get).not.toHaveBeenCalled();
    });

    it('should fetch and persist when cache is empty', async () => {
      const response = [{ idStrategy: 1, strategyName: 'A' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: [], updatedAt: today } as any);
      httpClientService.get.and.returnValue(of(response));

      const result = await firstValueFrom(service.getStrategiesEquity());

      expect(result).toEqual(response);
      expect(localStorageService.setCatalog).toHaveBeenCalledWith('strategiesEquity', response);
    });

    it('should return stale cache and trigger background refresh', async () => {
      const cached = [{ idStrategy: 9, strategyName: 'Old' }] as any;
      const refreshed = [{ idStrategy: 1, strategyName: 'A' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: cached, updatedAt: '19990101' } as any);
      httpClientService.get.and.returnValue(of(refreshed));

      const result = await firstValueFrom(service.getStrategiesEquity());

      expect(result).toEqual(cached);
      expect(httpClientService.get).toHaveBeenCalled();
      expect(localStorageService.setCatalog).toHaveBeenCalledWith('strategiesEquity', refreshed);
    });

    it('should force refresh with HTTP get and persist result', async () => {
      const response = [{ idStrategy: 1, strategyName: 'A' }] as any;
      localStorageService.getCatalog.and.returnValue({ data: [{ idStrategy: 9 }], updatedAt: today } as any);
      httpClientService.get.and.returnValue(of(response));

      const result = await firstValueFrom(service.getStrategiesEquity(true));

      expect(result).toEqual(response);
      expect(localStorageService.setCatalog).toHaveBeenCalledWith('strategiesEquity', response);
    });

    it('createStrategyEquity should post payload', async () => {
      const body = { idStrategy: 0, strategyName: 'New' } as any;
      httpClientService.post.and.returnValue(of(body));

      const result = await firstValueFrom(service.createStrategyEquity(body));

      expect(httpClientService.post).toHaveBeenCalled();
      expect(result).toEqual(body);
    });

    it('updateStrategyEquity should put payload', async () => {
      const body = { idStrategy: 1, strategyName: 'Updated' } as any;
      httpClientService.put.and.returnValue(of(body));

      const result = await firstValueFrom(service.updateStrategyEquity(body));

      expect(httpClientService.put).toHaveBeenCalled();
      expect(result).toEqual(body);
    });

    it('deleteStrategyEquity should call delete with id body', async () => {
      httpClientService.delete.and.returnValue(of({ ok: true }));

      const result = await firstValueFrom(service.deleteStrategyEquity(25));

      expect(httpClientService.delete).toHaveBeenCalledWith(
        jasmine.anything(),
        { body: { idStrategy: 25 } }
      );
      expect(result).toEqual({ ok: true });
    });
  });

  describe('top3Contracts', () => {
    it('should return contracts ranked 1 to 3 in order', () => {
      const input = [
        { ranking: 5, name: 'X' },
        { ranking: 2, name: 'B' },
        { ranking: 1, name: 'A' },
        { ranking: 3, name: 'C' },
      ] as any;

      const result = service.top3Contracts(input);

      expect(result).toEqual([
        { ranking: 1, name: 'A' },
        { ranking: 2, name: 'B' },
        { ranking: 3, name: 'C' },
      ] as any);
    });
  });

});
