import { TestBed } from '@angular/core/testing';
import { CustomerGeneralInfoStorageService } from './customer-general-info-storage.service';

describe('CustomerGeneralInfoStorageService', () => {

  let service: CustomerGeneralInfoStorageService;

  const buildClient = (overrides?: any) => ({
    name: 'Test',
    ...overrides
  });

  const buildContract = () => ({
    id: 1
  } as any);

  const buildExecutor = () => ({
    executor: true
  } as any);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CustomerGeneralInfoStorageService]
    });

    service = TestBed.inject(CustomerGeneralInfoStorageService);
  });

  it('estado inicial', () => {
    expect(service.generalInfoItem()).toBeNull();
    expect(service.generalInfoContract()).toBeNull();
    expect(service.testamentarySection()).toBeNull();
  });

  describe('saveGeneralInfo', () => {

    it('guarda con defaults BEAT', () => {
      const data = buildClient();

      service.saveGeneralInfo(data);

      const result = service.generalInfoItem() as any;

      expect(result.changeOperation).toBeFalse();
      expect(result.showTestamentaries).toBeFalse();
      expect(result.isOwnAccountAct).toBeFalse();
      expect(result.haveResourceProvider).toBeFalse();
      expect(result.operatesChanges).toBeFalse();
      expect(result.acting).toBeFalse();
      expect(result.hasSupplier).toBeFalse();
      expect(result.name).toBe('Test');
    });

  });

  describe('setGeneralInfoItem', () => {

    it('delegates a saveGeneralInfo', () => {
      const data = buildClient();

      service.setGeneralInfoItem(data);

      const result = service.generalInfoItem() as any;

      expect(result.name).toBe('Test');
      expect(result.changeOperation).toBeFalse();
    });

  });

  describe('clearGeneralInfoItem', () => {

    it('limpia información', () => {
      service.setGeneralInfoItem(buildClient());

      service.clearGeneralInfoItem();

      expect(service.generalInfoItem()).toBeNull();
    });

  });

  describe('setFullSectionSingal', () => {

    it('setea todas las secciones correctamente', () => {
      const client = buildClient();
      const contract = buildContract();
      const executor = buildExecutor();

      service.setFullSectionSingal({
        clientSection: client,
        contractSection: contract,
        executorSection: executor
      });

      expect(service.generalInfoContract()).toEqual(contract);
      expect(service.testamentarySection()).toEqual(executor);

      const clientResult = service.generalInfoItem() as any;

      expect(clientResult.name).toBe('Test');
      expect(clientResult.changeOperation).toBeFalse();
      expect(clientResult.showTestamentaries).toBeFalse();
    });

  });

  describe('isSavedInfoFlag', () => {

    it('false cuando no hay datos', () => {
      expect(service.isSavedInfoFlag()).toBeFalse();
    });

    it('true cuando hay datos', () => {
      service.setGeneralInfoItem(buildClient());

      expect(service.isSavedInfoFlag()).toBeTrue();
    });

  });

});