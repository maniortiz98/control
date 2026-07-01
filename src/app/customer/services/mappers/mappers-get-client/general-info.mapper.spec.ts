import {
  generalInfoToCheckpoint,
  checkpointToGeneralInfo
} from '../customer-general-info.mapper';
import { existingClientToGeneralInfo } from './general-info.mapper';
import { generalInfoToNonContractCheckpoint } from '../maintenance/customer-general-info-mant-mapper';

describe('General Info Mapper', () => {

  const makeExecutor = (overrides: any = {}) => ({
    active: true,
    dataSection: {
      curp: 'ABCD000101HDFRVN09',
      foreignerWithoutCurp: false,
      typeIden: 'RFC',
      rfc: 'RFC123456789',
      firstName: 'Juan',
      middleName: '',
      firstLastName: 'Perez',
      secondLastName: 'Garcia',
      dateOfBirth: '01/01/1980',
      gender: 'H',
      maritalStatus: '1',
      nationality: 'MEX',
      countryOfBirth: 'MX',
      stateOfBirth: '09'
    },
    taxSection: {
      relationship: '1',
      economicActivity: 'ACT',
      workCompany: 'COMP',
      positionHeld: 'DIR',
      phoneBusiness: '5555',
      fiscalCountry: 'MX',
      signClass: 'A',
      ipabTitularityPercent: '10',
      retentionIsr: '5',
      fiscalRegimeId: 1,
      cfdiUse: 'G01',
      taxPostalCode: '28001',
      fiscalResidences: []
    },
    address: {
      addressRole: '1',
      addressType: '1',
      other: '',
      country: 'MX',
      street: 'Calle 1',
      externalNumber: '10',
      internalNumber: '',
      postalCode: '28001',
      federalEntityID: '09',
      cityID: '01',
      municipalityID: '010',
      federalEntity: 'CDMX',
      city: 'Mexico',
      municipality: 'Cuauhtemoc',
      neighborhood: 'Centro'
    },
    autoSign: {
      mexicoResident: true,
      name: 'JUAN',
      fiscalRegimeId: 1,
      cfdiUse: 'G01',
      taxPostalCode: '28001',
      facta: false,
      crs: false,
      fiscalResidences: []
    },
    ppeInfo: {
      ppe: false,
      tppe: '',
      positionHeld: '',
      expirationDate: '',
      fppe: false,
      dataFamily: []
    },
    identifications: [],
    phones: [],
    mails: [],
    ...overrides
  });

  const makeGeneralInfo = (overrides: any = {}) => ({
    businessName: 'EMPRESA XYZ',
    personClassification: 'PF',
    rfc: 'RFC123456789',
    businessType: 'SOCIEDAD_MERCANTIL',
    economicActivity: 'ACT',
    maritalStatus: '1',
    marriageType: '0',
    sector: 'SEC',
    actinverEmployee: false,
    occupation: 'EMP',
    profession: 'LIC',
    domicilieType: '1',
    countryOfBirth: 'MX',
    country: 'MX',
    street: 'Calle 1',
    externalNumber: '10',
    internalNumber: '',
    postalCode: '28001',
    federalEntity: 'CDMX',
    federalEntityID: '09',
    municipality: 'Cuauhtémoc',
    municipalityID: '010',
    city: 'Mexico',
    cityID: '01',
    colony: 'Centro',
    website: '',
    related: false,
    relationship: '',
    institutionName: '',
    fiel: '',
    fielExpirationDate: '',
    executives: [makeExecutor()],
    ...overrides
  });

  const makeExecutorSection = (overrides: any = {}) => ({
    showExecutors: true,
    executors: [makeExecutor()],
    executorsTable: [],
    ...overrides
  });

  it('should map general info form to checkpoint', () => {
    const request = makeGeneralInfo();
    const data = makeExecutorSection({
      executors: [makeExecutor({ active: true })]
    });
    const result = generalInfoToCheckpoint(request as any);

    expect(result).toEqual(jasmine.objectContaining({
      personClassification: 'PF',
      economicActivity: 'ACT',
      country: 'MX'
    }));
  });

  it('should map Mexican address with federalEntity IDs', () => {
    const request = makeGeneralInfo({
      country: 'MX',
      federalEntityID: '09',
      cityID: '01',
      municipalityID: '010'
    });
    const result = generalInfoToCheckpoint(request as any);

    expect(result).toEqual(jasmine.objectContaining({
      country: 'MX',
      federalEntity: '09',
      city: '01',
      municipality: '010'
    }));
  });

  it('should map international address with string names', () => {
    const request = makeGeneralInfo({
      country: 'USA',
      federalEntity: 'California',
      city: 'Los Angeles',
      municipality: 'Los Angeles'
    });
    const result = generalInfoToCheckpoint(request as any);

    expect(result).toEqual(jasmine.objectContaining({
      country: 'USA',
      federalEntity: 'California',
      city: 'Los Angeles',
      municipality: 'Los Angeles'
    }));
  });

  it('should map checkpoint back to form', () => {
    const checkpoint = {
      personClassification: 'PF',
      economicActivity: 'ACT',
      maritalStatus: '1',
      marriageType: '0',
      sector: 'SEC',
      actinverEmployee: false,
      employeeNumber: '',
      occupation: 'EMP',
      profession: 'LIC',
      companyName: 'EMPRESA XYZ',
      jobTitle: '',
      companyPhone: '',
      addressType: '1',
      country: 'MX',
      postalCode: '28001',
      federalEntity: '09',
      city: '01',
      municipality: '010',
      neighborhood: 'Centro',
      street: 'Calle 1',
      externalNumber: '10',
      internalNumber: '',
      website: '',
      related: false,
      relationship: '',
      institutionName: '',
      fiel: '',
      fielExpirationDate: '',
      domicilieType: '',
    };

    const result = checkpointToGeneralInfo(checkpoint as any);

    expect(result).toEqual(jasmine.objectContaining({
      personClassification: 'PF',
      country: 'MX',
      domicilieType: '1'
    }));
  });



  it('should handle null-like request safely', () => {
    const result = generalInfoToCheckpoint(makeGeneralInfo() as any);

    expect(result).toBeDefined();
  });

  describe('existingClientToGeneralInfo', () => {
    it('should map existing client general info correctly including relationship and otherAddress', () => {
      const clientGI = {
        personClassification: 'PF',
        economicActivity: 'ACT',
        maritalStatus: '1',
        marriageType: '0',
        sector: 'SEC',
        actinverEmployee: false,
        employeeNumber: '',
        occupation: 'EMP',
        profession: 'LIC',
        companyName: 'COMPANY',
        jobTitle: 'TITLE',
        companyPhone: '123456',
        website: 'www.website.com',
        related: true,
        relationship: '1',
        institutionName: 'INSTITUTION',
        fiel: 'FIEL123',
        fielExpirationDate: '2026-06-04T00:00:00.000Z',
        address: {
          addressId: 1,
          addressType: '1',
          country: 'MX',
          street: 'Calle 1',
          externalNumber: '10',
          internalNumber: '',
          postalCode: '28001',
          federalEntity: '09',
          city: '01',
          municipality: '010',
          neighborhood: 'Centro',
          otherAddress: 'OTHER_STREET'
        }
      };

      const result = existingClientToGeneralInfo(clientGI as any);

      expect(result).not.toBeNull();
      expect(result?.relationship).toBe('1');
      expect(result?.otherAddress).toBe('OTHER_STREET');
      expect(result?.institutionName).toBe('INSTITUTION');
      expect(result?.fiel).toBe('FIEL123');
    });

    it('should return null when request is null', () => {
      expect(existingClientToGeneralInfo(null)).toBeNull();
    });
  });

  describe('generalInfoToNonContractCheckpoint', () => {
    it('should map general info to non-contract checkpoint and format fielExpirationDate to DD/MM/YYYY', () => {
      const request = makeGeneralInfo({
        fiel: 'ABC123456789',
        fielExpirationDate: '2030-11-30'
      });
      const result = generalInfoToNonContractCheckpoint(request as any);

      expect(result.fielExpirationDate).toBe('30/11/2030');
    });

    it('should format fielExpirationDate as null if fiel is empty', () => {
      const request = makeGeneralInfo({
        fiel: '',
        fielExpirationDate: '2030-11-30'
      });
      const result = generalInfoToNonContractCheckpoint(request as any);

      expect(result.fielExpirationDate).toBeNull();
    });
  });
});

