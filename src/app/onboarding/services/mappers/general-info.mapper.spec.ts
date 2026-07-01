import {
  generalInfoToCheckpoint,
  checkpointToGeneralInfo,
  checkpointToGeneralInfoExecutors
} from './general-info.mapper';

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
    banxicoAuthorization: 'N',
    nonGuaranteedByIPAB: 'N',
    operatesChanges: false,
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
    const result = generalInfoToCheckpoint(request as any, data as any);

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
    const result = generalInfoToCheckpoint(request as any, makeExecutorSection() as any);

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
    const result = generalInfoToCheckpoint(request as any, makeExecutorSection() as any);

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
      operatesChanges: false,
      banxicoAuthorization: 'N',
      nonGuaranteedByIPAB: 'N',
      acting: false,
      hasSupplier: false
    };

    const result = checkpointToGeneralInfo(checkpoint as any);

    expect(result).toEqual(jasmine.objectContaining({
      personClassification: 'PF',
      country: 'MX',
      domicilieType: '1'
    }));
  });

  it('should map executors query from checkpoint', async () => {
    const checkpoint = {
      executors: [
        {
          curp: 'ABCD000101HDFRVN09',
          foreignerWithoutCurp: false,
          rfc: 'RFC123456789',
          nif: '',
          tin: '',
          nss: '',
          firstName: 'Juan',
          middleName: '',
          firstLastName: 'Perez',
          secondLastName: 'Garcia',
          dateOfBirth: '1980-01-01',
          gender: 1,
          maritalStatus: 1,
          nacionality: 'MEX',
          countryOfBirth: 'MX',
          federalEntity: '09',
          relationship: 1,
          economicActivity: 'ACT',
          companyName: 'COMP',
          positionHeld: 'DIR',
          phoneBussiness: '5555',
          fiscalCountry: 'MX',
          fiscalIdentificationNumber: '',
          signatureType: 'A',
          IPABCoverage: '10',
          incomeTaxWithholding: '5',
          personPpe: {
            isPpe: false,
            ppeType: '',
            positionHeld: '',
            positionEndDate: '',
            hasppeRelatives: false,
            ppeRelatives: []
          },
          identification: [],
          residentialAddress: {
            addressRol: '1',
            addressType: '1',
            other: '',
            country: 'MX',
            street: 'Calle 1',
            externalNumber: '10',
            internalNumber: '',
            postalCode: '28001',
            federalEntity: '09',
            city: '01',
            municipality: '010',
            neighborhood: 'Centro'
          },
          fiscalSelfDeclaration: {
            residesInMexico: true,
            SATRegisteredName: 'JUAN',
            fiscalRegime: '1',
            useCFDI: 'G01',
            taxPostalCode: '28001',
            expirationStatus: '',
            facta: false,
            foreignTaxResident: false,
            taxAddress: []
          },
          contactData: {
            DataNonDisclosureLetter: false,
            registeredPhones: [],
            registeredEmails: []
          }
        }
      ]
    };

    const phoneTypes = [{ mandt: '100', spras: 'S', telephoneTypeId: '1', telephoneType: 'Celular' }];
    const countries = [{ country: 'Mexico', countryId: 'MX', countryCode: '+52' }];
    const identifications = [{ type: 'CURP', text: 'CURP', client: '100', spras: 'S' }];

    const result = await checkpointToGeneralInfoExecutors(
      checkpoint as any,
      phoneTypes as any,
      countries as any,
      identifications as any
    );

    expect(result.executors.length).toBe(1);
    expect(result.showExecutors).toBe(true);
  });

  it('should handle null-like request safely', () => {
    const result = generalInfoToCheckpoint(makeGeneralInfo() as any, makeExecutorSection({ executors: [] }) as any);

    expect(result).toBeDefined();
  });
});
