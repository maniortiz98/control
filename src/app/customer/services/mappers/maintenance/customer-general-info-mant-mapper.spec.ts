import {
  generalInfoToCheckpointMant,
  checkpointMantToGeneralInfo,
  generalInfoToNonContractCheckpoint
} from './customer-general-info-mant-mapper';

describe('General Info Maintenance Mappers', () => {

  const baseGeneralInfo = (overrides?: any) => ({
    personClassification: 'PF',
    economicActivity: 'ACT',
    maritalStatus: 'S',
    marriageType: '',
    sector: 'FIN',
    actinverEmployee: true,
    employeeNumber: '123',
    occupation: 'DEV',
    profession: 'ENG',
    companyName: 'COMP',
    jobTitle: 'DEV',
    companyPhone: '123',
    country: 'MX',
    street: 'Street',
    externalNumber: '1',
    internalNumber: '1',
    postalCode: '20000',
    federalEntityID: 'AGS',
    cityID: 'AGS',
    municipalityID: 'AGS',
    federalEntity: 'AGS',
    city: 'AGS',
    municipality: 'AGS',
    website: 'web',
    related: true,
    relationship: 'REL',
    institutionName: 'INST',
    fiel: 'YES',
    fielExpirationDate: '2024-01-01',
    domicilieType: 'HOME',
    colony: 'COL',
    otherAddress: 'OTHER',
    ...overrides
  });

  const baseContract = (overrides?: any) => ({
    personId: 1,
    addressId: 2,
    workDataId: 3,
    clientId: 4,
    accountRoleId: 5,
    id: 10,
    clientStatus: 'ACTIVE',
    contractStatus: 'OK',
    openDate: '2020',
    initialRiskId: 1,
    initialRiskDescription: 'LOW',
    modifyRiskId: 2,
    modifyRiskDespcription: 'HIGH',
    origin: 'APP',
    n4UpdateDate: '2021',
    isNumbered: true,
    checkProtected: true,
    isOwnPosition: true,
    isSocialPrevision: false,
    biometricsAccount: true,
    facialBiometrics: false,
    enrollmentStatus: 'DONE',
    asociatedDirector: 'DIR',
    directPromote: 'PROMO',
    financailCenter: 'CENTER',
    isrPercentage: 10,
    isrMonthlyCommision: 5,
    comissionPercentage: 1,
    isPMSorety: false,
    isBrokerageHouse: false,
    authorizationConsultCreditReports: true,

    accountManagementId: 100,
    externalCustody: true,
    custody: true,
    custodyIndeval: true,
    financialCenterDelivery: 'DEL',
    contractManagement: 'MNG',
    gestionType: 'TYPE',
    vip: true,

    generalInformationId: 200,
    operationReason: 'TEST',
    otherReasons: 'OTHER',
    operationConfiramtionMedia: 'EMAIL',
    documents: true,
    transfers: false,
    accountDeposit: true,
    other: false,
    otherPreferedProduct: 'PROD',

    associateDirectorId: 300,
    asociatedDirectorStatus: 'OK',
    asociatedDirectorFolio: 'FOL',
    asociatedDirectorNumber: 'NUM',
    asociatedDirectorName: 'NAME',

    geolocationId: 400,
    consentGeolocalization: true,
    date: '2024-01-01',
    time: '10:00',
    latitude: '1',
    longitude: '2',

    incapacity: false,
    incapacityLetter: '',
    dateOfDefunction: '',
    ...overrides
  });

  describe('generalInfoToCheckpointMant', () => {

    it('mapea correctamente datos base y contract', () => {
      const result = generalInfoToCheckpointMant(
        baseGeneralInfo(),
        baseContract()
      );

      expect(result.personClassification).toBe('PF');
      expect(result.personId).toBe(1);
      expect(result.contractData.id).toBe(10);
      expect(result.accountManagement.id).toBe(100);
    });

    it('usa default marriageType', () => {
      const result = generalInfoToCheckpointMant(
        baseGeneralInfo({ marriageType: '' }),
        baseContract()
      );

      expect(result.marriageType).toBe('0');
    });

    it('usa ids para MX', () => {
      const result = generalInfoToCheckpointMant(
        baseGeneralInfo(),
        baseContract()
      );

      expect(result.federalEntity).toBe('AGS');
    });

    it('usa texto si no es MX', () => {
      const result = generalInfoToCheckpointMant(
        baseGeneralInfo({ country: 'US', federalEntity: 'TX' }),
        baseContract()
      );

      expect(result.federalEntity).toBe('TX');
    });

    it('relationship vacío si no related', () => {
      const result = generalInfoToCheckpointMant(
        baseGeneralInfo({ related: false }),
        baseContract()
      );

      expect(result.relationship).toBe('');
      expect(result.institutionName).toBe('');
    });

  });

  describe('checkpointMantToGeneralInfo', () => {

    it('convierte correctamente a estructura completa', () => {
      const checkpoint = generalInfoToCheckpointMant(
        baseGeneralInfo(),
        baseContract()
      );

      const result = checkpointMantToGeneralInfo(checkpoint);

      expect(result?.contractSection?.id).toBe(10);
      expect(result?.contractSection?.isrPercentage).toBe(10);
      expect(result?.contractSection?.authorizationConsultCreditReports).toBeTrue();
    });

    it('convierte strings a number', () => {
      const checkpoint = generalInfoToCheckpointMant(
        baseGeneralInfo(),
        baseContract()
      );

      checkpoint.contractData.withholdingTax = '10';

      const result = checkpointMantToGeneralInfo(checkpoint);

      expect(result?.contractSection?.isrPercentage).toBe(10);
    });

    it('clientSection no es null', () => {
      const checkpoint = generalInfoToCheckpointMant(
        baseGeneralInfo(),
        baseContract()
      );

      const result = checkpointMantToGeneralInfo(checkpoint);

      expect(result.clientSection).toBeTruthy();
    });

  });

  describe('generalInfoToNonContractCheckpoint', () => {

    it('mapea correctamente datos', () => {
      const result = generalInfoToNonContractCheckpoint(baseGeneralInfo(), '1');

      expect(result.personClassification).toBe('PF');
      expect(result.address.id).toBe('1');
    });

    it('active true si hay address data', () => {
      const result = generalInfoToNonContractCheckpoint(baseGeneralInfo(), '1');

      expect(result.address.active).toBeTrue();
    });

    it('active null si no hay addressId', () => {
      const result = generalInfoToNonContractCheckpoint(baseGeneralInfo(), undefined);

      expect(result.address.active).toBeNull();
    });

    it('convierte MX con IDs', () => {
      const result = generalInfoToNonContractCheckpoint(baseGeneralInfo());

      expect(result.address.federalEntity).toBe('AGS');
    });

    it('usa texto cuando no es MX', () => {
      const result = generalInfoToNonContractCheckpoint(
        baseGeneralInfo({ country: 'US', federalEntity: 'TX' })
      );

      expect(result.address.federalEntity).toBe('TX');
    });

    it('relationship null si related false', () => {
      const result = generalInfoToNonContractCheckpoint(
        baseGeneralInfo({ related: false })
      );

      expect(result.relationship).toBeNull();
      expect(result.institutionName).toBeNull();
    });

  });

});