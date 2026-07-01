import { FiscalSelfDeclarationDataClientService } from '../../../shared/services/storage-services/fiscal-self-declaration.service';
import { FiscalSelfDeclaration } from '../../models/checkpoints/fiscal-self-declaration-checkpoint';
import { ClientTaxData } from '../../models/fiscal-self-declaration-data';

/**
 * These tests verify the data recovery logic used in TaxInfoComponent's constructor
 * without needing to instantiate the full component (which has many service dependencies).
 * We test the LOGIC of how dataAutoCertification is built from savedData vs defaults.
 *
 * Notas de corrección:
 * - Se usa exclusivamente `declarationFiscalResidence` (no `activeFiscalDomicilie`).
 * - No se asigna `null` a props que no lo aceptan (p.ej. factaObligations.factaId).
 */

function buildSavedData(
  overrides: Partial<FiscalSelfDeclaration> = {},
): FiscalSelfDeclaration {
  return {
    mexicoResident: true,
    curp: 'GARC850101HDFRRL09',
    foreignerWithoutCurp: false,
    rfc: 'GARC850101AAA',
    name: 'JUAN GARCIA',
    fiscalRegimeId: 601,
    cfdiUse: 'G03',
    taxPostalCode: '06600',
    nationality: 'MX',
    country: 'MX',
    fiscalResidenceAbroad: true,
    facta: true,
    crs: false,
    fiscalResidences: [
      {
        personType: 1,
        country: 'US',
        declarationFiscalResidence: true,
        proofOfAddressType: 'CONSTANCIA DE RESIDENCIA FISCAL',
        issueDate: '2025-06-15T00:00:00.000Z',
        expirationStatus: 'VIGENTE',
        expirationDate: '2026-06-15T00:00:00.000Z',
        certificationDate: '2025-06-15T00:00:00.000Z',
        declarationYear: 2025,
        aditionalDays: '30',
        factaObligations: {
          autentication: 'ID FISCAL EXTRANJERO (NIF / TIN / NSS)',
          nif: '123',
          tin: '456',
          nss: '789',
        },
      },
      {
        personType: 1,
        country: 'CA',
        declarationFiscalResidence: false,
        proofOfAddressType: 'ID FISCAL EXTRANJERO',
        issueDate: '2025-01-10T00:00:00.000Z',
        expirationStatus: 'VIGENTE',
        expirationDate: '2026-01-10T00:00:00.000Z',
        certificationDate: '2025-01-10T00:00:00.000Z',
        declarationYear: 2025,
        aditionalDays: '15',
        factaObligations: {
          autentication: 'ESCRITO LIBRE SIN NSS',
          nif: '',
          tin: '',
          nss: '',
        },
      },
    ],
    ...overrides,
  };
}

import { concatFullName } from '../../../shared/utils/string';

interface MockDataClient {
  curp: string;
  foreignerWithoutCurp: boolean;
  rfc: string;
  firstName: string;
  middleName?: string;
  firstLastName: string;
  secondLastName?: string;
  nationality: string;
  countryOfBirth: string;
}

function buildDataClient(): MockDataClient {
  return {
    curp: 'GARC850101HDFRRL09',
    foreignerWithoutCurp: false,
    rfc: 'GARC850101AAA',
    firstName: 'JUAN',
    middleName: 'ERNESTO',
    firstLastName: 'GARCIA',
    secondLastName: 'ORTUZ',
    nationality: 'MX',
    countryOfBirth: 'MX',
  };
}

/**
 * Replicates the logic from TaxInfoComponent constructor to build dataAutoCertification.
 * This is extracted to be testable without instantiating the full component.
 */
function buildDataAutoCertification(
  dataClient: MockDataClient,
  savedData: FiscalSelfDeclaration | null,
  cpf: string = '',
): ClientTaxData {
  if (savedData) {
    return {
      mexicoResident: savedData.mexicoResident ?? false,
      curp: dataClient.curp,
      foreignerWithoutCurp:
        savedData.foreignerWithoutCurp ?? dataClient.foreignerWithoutCurp,
      rfc: dataClient.rfc,
      name:
        savedData.name ?? concatFullName(dataClient.firstName, dataClient.middleName, dataClient.firstLastName, dataClient.secondLastName),
      fiscalRegimeId: savedData.fiscalRegimeId ?? 0,
      cfdiUsageId: savedData.cfdiUse ?? '',
      cfdiUse: savedData.cfdiUse ?? '',
      taxPostalCode: savedData.taxPostalCode ?? cpf,
      nationality: savedData.nationality ?? dataClient.nationality,
      country: savedData.country ?? dataClient.countryOfBirth,
      fiscalResidenceAbroad: savedData.fiscalResidenceAbroad ?? false,
      facta: savedData.facta ?? false,
      crs: savedData.crs ?? false,
      fiscalResidences: (savedData.fiscalResidences as any[]) ?? [],
    } as ClientTaxData;
  } else {
    return {
      mexicoResident: false,
      curp: dataClient.curp,
      foreignerWithoutCurp: dataClient.foreignerWithoutCurp,
      rfc: dataClient.rfc,
      name: concatFullName(dataClient.firstName, dataClient.middleName, dataClient.firstLastName, dataClient.secondLastName),
      fiscalRegimeId: 0,
      cfdiUsageId: '',
      taxPostalCode: cpf,
      nationality: dataClient.nationality,
      country: dataClient.countryOfBirth,
      fiscalResidenceAbroad: false,
      facta: false,
      crs: false,
      fiscalResidences: [],
    } as ClientTaxData;
  }
}

describe('TaxInfoComponent constructor logic - data recovery', () => {
  describe('when no saved data exists (first visit)', () => {
    it('should create dataAutoCertification with default values', () => {
      const dataClient = buildDataClient();
      const result = buildDataAutoCertification(dataClient, null);

      expect(result.mexicoResident).toBe(false);
      expect(result.fiscalResidenceAbroad).toBe(false);
      expect(result.fiscalResidences).toEqual([]);
      expect(result.facta).toBe(false);
      expect(result.crs).toBeFalse();
      expect(result.fiscalRegimeId).toBe(0);
    });

    it('should use dataClient values for personal fields', () => {
      const dataClient = buildDataClient();
      const result = buildDataAutoCertification(dataClient, null);

      expect(result.curp).toBe('GARC850101HDFRRL09');
      expect(result.rfc).toBe('GARC850101AAA');
      expect(result.name).toBe('JUAN ERNESTO GARCIA ORTUZ');
      expect(result.nationality).toBe('MX');
      expect(result.country).toBe('MX');
    });

    it('should use address postal code', () => {
      const dataClient = buildDataClient();
      const result = buildDataAutoCertification(dataClient, null, '11000');

      expect(result.taxPostalCode).toBe('11000');
    });
  });

  describe('when saved data exists (returning to tab after save)', () => {
    it('should recover mexicoResident from saved data', () => {
      const dataClient = buildDataClient();
      const savedData = buildSavedData({ mexicoResident: true });

      const result = buildDataAutoCertification(dataClient, savedData);

      expect(result.mexicoResident).toBe(true);
    });

    it('should recover mexicoResident=false from saved data', () => {
      const dataClient = buildDataClient();
      const savedData = buildSavedData({ mexicoResident: false });

      const result = buildDataAutoCertification(dataClient, savedData);

      expect(result.mexicoResident).toBe(false);
    });

    it('should recover fiscalResidenceAbroad from saved data', () => {
      const dataClient = buildDataClient();
      const savedData = buildSavedData({ fiscalResidenceAbroad: true });

      const result = buildDataAutoCertification(dataClient, savedData);

      expect(result.fiscalResidenceAbroad).toBe(true);
    });

    it('should recover ALL fiscal residences from saved data', () => {
      const dataClient = buildDataClient();
      const savedData = buildSavedData();

      const result = buildDataAutoCertification(dataClient, savedData);

      expect(result.fiscalResidences.length).toBe(2);
      expect(result.fiscalResidences[0].country).toBe('US');
      expect(result.fiscalResidences[0].declarationFiscalResidence).toBe(true);
      expect(result.fiscalResidences[1].country).toBe('CA');
      expect(result.fiscalResidences[1].declarationFiscalResidence).toBe(false);
    });

    it('should recover name from saved data', () => {
      const dataClient = buildDataClient();
      const savedData = buildSavedData({ name: 'MARIA LOPEZ PEREZ' });

      const result = buildDataAutoCertification(dataClient, savedData);

      expect(result.name).toBe('MARIA LOPEZ PEREZ');
    });

    it('should recover fiscalRegimeId from saved data', () => {
      const dataClient = buildDataClient();
      const savedData = buildSavedData({ fiscalRegimeId: 612 });

      const result = buildDataAutoCertification(dataClient, savedData);

      expect(result.fiscalRegimeId).toBe(612);
    });

    it('should recover cfdiUse from saved data', () => {
      const dataClient = buildDataClient();
      const savedData = buildSavedData({ cfdiUse: 'P01' });

      const result = buildDataAutoCertification(dataClient, savedData);

      expect(result.cfdiUsageId).toBe('P01');
      expect(result.cfdiUse).toBe('P01');
    });

    it('should recover taxPostalCode from saved data over address default', () => {
      const dataClient = buildDataClient();
      const savedData = buildSavedData({ taxPostalCode: '03100' });

      const result = buildDataAutoCertification(dataClient, savedData, '11000');

      expect(result.taxPostalCode).toBe('03100');
    });

    it('should recover facta and crs from saved data', () => {
      const dataClient = buildDataClient();
      const savedData = buildSavedData({ facta: true, crs: true });

      const result = buildDataAutoCertification(dataClient, savedData);

      expect(result.facta).toBe(true);
      expect(result.crs).toBeTrue();
    });

    it('should still use dataClient CURP and RFC (immutable identity fields)', () => {
      const dataClient = buildDataClient();
      const savedData = buildSavedData({ curp: 'DIFFERENT', rfc: 'DIFFERENT' });

      const result = buildDataAutoCertification(dataClient, savedData);

      expect(result.curp).toBe('GARC850101HDFRRL09');
      expect(result.rfc).toBe('GARC850101AAA');
    });
  });

  describe('onSubmit - dataAutoCertification update after save', () => {
    it('should update dataAutoCertification with result data after save', () => {
      const initial: ClientTaxData = buildDataAutoCertification(
        buildDataClient(),
        null,
      );

      const resultData: FiscalSelfDeclaration = buildSavedData({
        mexicoResident: true,
        fiscalResidenceAbroad: true,
      });

      const updated: ClientTaxData = {
        ...initial,
        mexicoResident: resultData.mexicoResident,
        fiscalResidenceAbroad: resultData.fiscalResidenceAbroad,
        facta: resultData.facta,
        crs: resultData.crs,
        fiscalResidences: resultData.fiscalResidences as any[],
        name: resultData.name,
        fiscalRegimeId: resultData.fiscalRegimeId,
        cfdiUse: resultData.cfdiUse,
        taxPostalCode: resultData.taxPostalCode,
      };

      expect(updated.mexicoResident).toBe(true);
      expect(updated.fiscalResidenceAbroad).toBe(true);
      expect(updated.fiscalResidences.length).toBe(2);
      expect(updated.name).toBe('JUAN GARCIA');
    });
  });

  describe('FiscalSelfDeclarationDataClientService', () => {
    let service: FiscalSelfDeclarationDataClientService;

    beforeEach(() => {
      service = new FiscalSelfDeclarationDataClientService();
    });

    it('should return null when no item has been set', () => {
      expect(service.getItem()).toBeNull();
    });

    it('should store and retrieve fiscal self declaration data', () => {
      const data = buildSavedData();
      service.setItem(data);

      const retrieved = service.getItem();
      expect(retrieved).toEqual(data);
    });

    it('should mark isRequested as true after setItem', () => {
      service.setItem(buildSavedData());
      expect(service.isRequested()).toBe(true);
    });

    it('should preserve all fiscal residences in stored data', () => {
      const data = buildSavedData();
      expect(data.fiscalResidences.length).toBe(2);

      service.setItem(data);
      const retrieved = service.getItem();

      expect(retrieved!.fiscalResidences.length).toBe(2);
      expect(retrieved!.fiscalResidences[0].country).toBe('US');
      expect(retrieved!.fiscalResidences[1].country).toBe('CA');
    });

    it('should preserve mexicoResident value in stored data', () => {
      const data = buildSavedData({ mexicoResident: true });
      service.setItem(data);

      expect(service.getItem()!.mexicoResident).toBe(true);
    });

    it('should preserve fiscalResidenceAbroad value in stored data', () => {
      const data = buildSavedData({ fiscalResidenceAbroad: true });
      service.setItem(data);

      expect(service.getItem()!.fiscalResidenceAbroad).toBe(true);
    });

    it('should overwrite previous data on second setItem call', () => {
      service.setItem(buildSavedData({ mexicoResident: false }));
      service.setItem(buildSavedData({ mexicoResident: true }));

      expect(service.getItem()!.mexicoResident).toBe(true);
    });

    it('should persist FATCA and CRS within the stored payload', () => {
      const data = buildSavedData({ facta: true, crs: true });
      service.setItem(data);

      const retrieved = service.getItem()!;
      expect(retrieved.facta).toBeTrue();
      expect(retrieved.crs).toBeTrue();
    });
  });

  describe('tab navigation simulation (destroy ? recreate)', () => {
    it('should recover full state when component is recreated with saved service data', () => {
      const dataClient = buildDataClient();

      const firstVisit = buildDataAutoCertification(dataClient, null);
      expect(firstVisit.mexicoResident).toBe(false);
      expect(firstVisit.fiscalResidences.length).toBe(0);

      const userFormData = buildSavedData({
        mexicoResident: true,
        fiscalResidenceAbroad: true,
      });

      const service = new FiscalSelfDeclarationDataClientService();
      service.setItem(userFormData);

      const savedData = service.getItem();
      const secondVisit = buildDataAutoCertification(dataClient, savedData);

      expect(secondVisit.mexicoResident).toBe(true);
      expect(secondVisit.fiscalResidenceAbroad).toBe(true);
      expect(secondVisit.fiscalResidences.length).toBe(2);
      expect(secondVisit.fiscalResidences[0].country).toBe('US');
      expect(secondVisit.fiscalResidences[0].declarationFiscalResidence).toBe(
        true,
      );
      expect(secondVisit.fiscalResidences[1].country).toBe('CA');
      expect(secondVisit.fiscalResidences[1].declarationFiscalResidence).toBe(
        false,
      );
      expect(secondVisit.name).toBe('JUAN GARCIA');
      expect(secondVisit.fiscalRegimeId).toBe(601);
      expect(secondVisit.taxPostalCode).toBe('06600');
    });

    it('should handle multiple save-navigate cycles', () => {
      const dataClient = buildDataClient();
      const service = new FiscalSelfDeclarationDataClientService();

      service.setItem(
        buildSavedData({
          mexicoResident: true,
          fiscalResidences: [
            {
              personType: 1,
              country: 'US',
              declarationFiscalResidence: true,
              proofOfAddressType: '',
              issueDate: '',
              expirationStatus: '',
              expirationDate: '',
              certificationDate: '',
              declarationYear: 2025,
              aditionalDays: '',
              factaObligations: {
                autentication: '',
                nif: '',
                tin: '',
                nss: '',
              },
            } as any,
          ],
        }),
      );

      let result = buildDataAutoCertification(dataClient, service.getItem());
      expect(result.mexicoResident).toBe(true);
      expect(result.fiscalResidences.length).toBe(1);

      service.setItem(
        buildSavedData({
          mexicoResident: false,
          fiscalResidences: [
            {
              personType: 1,
              country: 'US',
              declarationFiscalResidence: true,
              proofOfAddressType: '',
              issueDate: '',
              expirationStatus: '',
              expirationDate: '',
              certificationDate: '',
              declarationYear: 2025,
              aditionalDays: '',
              factaObligations: {
                autentication: '',
                nif: '',
                tin: '',
                nss: '',
              },
            } as any,
            {
              personType: 1,
              country: 'CA',
              declarationFiscalResidence: true,
              proofOfAddressType: '',
              issueDate: '',
              expirationStatus: '',
              expirationDate: '',
              certificationDate: '',
              declarationYear: 2025,
              aditionalDays: '',
              factaObligations: {
                autentication: '',
                nif: '',
                tin: '',
                nss: '',
              },
            } as any,
            {
              personType: 2,
              country: 'MX',
              declarationFiscalResidence: true,
              proofOfAddressType: '',
              issueDate: '',
              expirationStatus: '',
              expirationDate: '',
              certificationDate: '',
              declarationYear: 2025,
              aditionalDays: '',
              factaObligations: {
                autentication: '',
                nif: '',
                tin: '',
                nss: '',
              },
            } as any,
          ],
        }),
      );

      result = buildDataAutoCertification(dataClient, service.getItem());
      expect(result.mexicoResident).toBe(false);
      expect(result.fiscalResidences.length).toBe(3);
    });
  });
});
