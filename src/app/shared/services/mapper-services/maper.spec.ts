import {
  mapFormToInitialData,
  mapToClient,
  mapToCheckPointFiscalSelfDeclarationData,
  mapFormToAdditionalInfo,
} from './maper';

describe('maper', () => {
  describe('mapFormToInitialData', () => {
    it('should map foreign CURP forms to the foreign branch', () => {
      const form = {
        curp: 'ABCD000101HNEABC12',
        typeIden: 'RFC',
        rfc: 'RFC123',
        firstName: 'Juan',
        middleName: 'P',
        firstLastName: 'Perez',
        secondLastName: 'Lopez',
        dateOfBirth: '01/01/1980',
        gender: 'H',
        nationality: 'MEX',
        countryOfBirth: 'MX',
        stateOfBirth: 'CDMX',
        foreignerWithoutCurp: false,
      };

      const result = mapFormToInitialData(form as any, true, '1', '2', '3');

      expect(result).toEqual(jasmine.objectContaining({
        curp: 'ABCD000101HNEABC12',
        stateOfBirth: '',
        cityOfBirth: 'CDMX',
        ppe: true,
        bankAreaTypeId: '1',
        contraTypeId: '2',
        typeContractSubtypeId: '3',
      }));
    });

    it('should map non foreign CURP forms to the domestic branch', () => {
      const form = {
        curp: 'ABCD000101HDFRVN09',
        typeIden: 'RFC',
        rfc: 'RFC123',
        firstName: 'Juan',
        middleName: 'P',
        firstLastName: 'Perez',
        secondLastName: 'Lopez',
        dateOfBirth: '01/01/1980',
        gender: 'M',
        nationality: 'MEX',
        countryOfBirth: 'MX',
        stateOfBirth: 'CDMX',
        foreignerWithoutCurp: false,
      };

      const result = mapFormToInitialData(form as any, false, '1', '2', '3');

      expect(result).toEqual(jasmine.objectContaining({
        curp: 'ABCD000101HDFRVN09',
        stateOfBirth: 'CDMX',
        cityOfBirth: '',
        ppe: false,
        bankAreaTypeId: '1',
        contraTypeId: '2',
        typeContractSubtypeId: '3',
      }));
    });
  });

  describe('mapToClient', () => {
    it('should map checkpoint data back to a client object', () => {
      const result = mapToClient({
        curp: 'ABCD000101HDFRVN09',
        rfc: 'RFC123',
        nif: '',
        tin: '',
        nss: '',
        firstName: 'Juan',
        middleName: 'P',
        firstLastName: 'Perez',
        secondLastName: 'Lopez',
        dateOfBirth: '01/01/1980',
        gender: '1',
        nationality: 'MEX',
        countryOfBirth: 'MX',
        stateOfBirth: 'CDMX',
        cityOfBirth: '01',
        ppe: false,
        foreignerWithoutCurp: false,
        bankAreaTypeId: '2',
        contraTypeId: '4',
        typeContractSubtypeId: '6',
      } as any);

      expect(result).toEqual(jasmine.objectContaining({
        curp: 'ABCD000101HDFRVN09',
        rfc: 'RFC123',
        stateOfBirth: 'CDMX',
        personType: '1',
      }));
    });
  });

  describe('mapToCheckPointFiscalSelfDeclarationData', () => {
    it('should map fiscal self declaration when there is an active residence', () => {
      const result = mapToCheckPointFiscalSelfDeclarationData({
        id: 0,
        mexicoResident: true,
        curp: 'CURP123',
        foreignerWithoutCurp: false,
        rfc: 'RFC123',
        name: 'Juan Perez',
        fiscalRegimeId: 1,
        cfdiUse: 'G01',
        taxPostalCode: '28001',
        nationality: 'MEX',
        country: 'MX',
        fiscalResidenceAbroad: false,
        facta: false,
        crs: true,
        fiscalResidences: [
          {
            personType: '1',
            country: 'MX',
            declarationFiscalResidence: true,
            proofOfAddressType: '1',
            issueDate: '2026-05-19',
            expirationStatus: 'ACTIVE',
            expirationDate: '2026-06-19',
            certificationDate: '2026-05-20',
            declarationYear: '2026',
            aditionalDays: '0',
            factaObligations: {
              autentication: '1',
              nif: 'NIF',
              tin: 'TIN',
              nss: 'NSS',
            },
          },
        ],
      } as any);

      expect(result).toEqual(jasmine.objectContaining({
        curp: 'CURP123',
        mexicoResident: true,
        fiscalResidences: jasmine.any(Array),
      }));
    });

    it('should throw when no active fiscal residence exists', () => {
      expect(() => mapToCheckPointFiscalSelfDeclarationData({
        id: 0,
        mexicoResident: true,
        curp: 'CURP123',
        foreignerWithoutCurp: false,
        rfc: 'RFC123',
        name: 'Juan Perez',
        fiscalRegimeId: 1,
        cfdiUse: 'G01',
        taxPostalCode: '28001',
        nationality: 'MEX',
        country: 'MX',
        fiscalResidenceAbroad: false,
        facta: false,
        crs: true,
        fiscalResidences: [
          {
            personType: '1',
            country: 'MX',
            declarationFiscalResidence: false,
          },
        ],
      } as any)).toThrowError('No active fiscal residence found.');
    });
  });

  describe('mapFormToAdditionalInfo', () => {
    it('should map page data and default table to empty array', () => {
      const result = mapFormToAdditionalInfo({
        addressKey: 'A1',
        sendDocuments: 'yes',
        isrExempt: 'no',
        expirationDate: '2026-12-31',
        startDate: '2026-01-01',
        endDate: '2026-12-31',
        w8benForm: 'yes',
        locations: 'MX',
        currencyOperations: 'USD',
        thirdPartyCompanies: 'no',
        ownCompanies: 'yes',
        sicShares: '0',
        derivativeInstruments: '0',
        debtInstruments: '0',
        savingsPlans: '0',
      } as any);

      expect(result).toEqual({
        data: jasmine.objectContaining({
          addressKey: 'A1',
          sendDocuments: 'yes',
          expirationDate: '2026-12-31',
        }),
        table: [],
      });
    });
  });
});