import {
  toCheckpoint,
  mapToSignalBeneficiaries,
  beneficiariesMapperSaveMaint,
  beneficiariesMapperQueryMaint
} from './beneficiaries.mapper';

describe('Beneficiaries Mapper (beneficiaries.mapper)', () => {

  const makeBeneficiary = (overrides: any = {}) => ({
    beneficiaryId: 1,
    personId: 10,
    accountRoleId: 100,
    active: true,
    clientData: {
      curp: 'ABCD000101HDFRVN09',
      foreignerWithoutCurp: false,
      typeIden: 'RFC',
      rfc: 'RFC123456789',
      firstName: 'Juan',
      middleName: '',
      firstLastName: 'Perez',
      secondLastName: 'Garcia',
      dateOfBirth: '01/01/1990',
      gender: 'H',
      maritalStatus: '1',
      nationality: 'MEX',
      countryOfBirth: 'MX',
      stateOfBirth: '09'
    },
    addressData: {
      addressType: '1',
      country: 'MX',
      street: 'Calle 1',
      externalNumber: '10',
      internalNumber: '',
      postalCode: '28001',
      federalEntityID: '09',
      municipalityID: '010',
      neighborhood: 'Centro',
      cityID: '01',
      federalEntity: 'CDMX',
      municipality: 'Cuauhtemoc',
      city: 'Mexico'
    },
    relationShip: '1',
    percentage: '50',
    tempId: 'tmp-1',
    ...overrides
  });

  it('should map beneficiary form to checkpoint', () => {
    const input = [makeBeneficiary()];
    const result = toCheckpoint(input as any);

    expect(result.length).toBe(1);
    expect(result[0]).toEqual(jasmine.objectContaining({
      relationship: 1,
      firstName: 'Juan',
      firstLastName: 'Perez',
      beneficiaryPercentage: '50'
    }));
  });

  it('should keep percentage in beneficiaryPercentage for save maintenance', () => {
    const input = [makeBeneficiary({ percentage: '25.5' })];
    const result = beneficiariesMapperSaveMaint(input as any);

    expect(result[0].beneficiaryPercentage).toBe('25.5');
  });

  it('should handle foreign beneficiary without CURP', () => {
    const input = [makeBeneficiary({
      clientData: {
        curp: 'ABCDEFGHIJKFORXX',
        foreignerWithoutCurp: true,
        typeIden: 'RFC',
        rfc: 'RFC123456789',
        firstName: 'John',
        middleName: '',
        firstLastName: 'Doe',
        secondLastName: '',
        dateOfBirth: '01/01/1990',
        gender: 'H',
        maritalStatus: '1',
        nationality: 'USA',
        countryOfBirth: 'USA',
        stateOfBirth: 'California',
        federalEntity: 'California'
      },
      addressData: {
        addressType: '1',
        country: 'USA',
        street: 'Main St',
        externalNumber: '1',
        internalNumber: '',
        postalCode: '90001',
        federalEntity: 'California',
        municipality: 'Los Angeles',
        neighborhood: 'Downtown',
        city: 'Los Angeles'
      }
    })];
    const result = toCheckpoint(input as any);

    expect((result[0] as any).address.country).toBe('USA');
  });

  it('should map checkpoint to signal with tempId generation', () => {
    const checkpoint = [{
      beneficiaryId: 1,
      personId: 10,
      accountRoleId: 100,
      active: true,
      curp: 'ABCD000101HDFRVN09',
      foreignWithoutCURP: false,
      rfc: 'RFC123456789',
      nif: '',
      tin: '',
      nss: '',
      country: 'MX',
      firstName: 'Juan',
      middleName: '',
      firstLastName: 'Perez',
      secondLastName: 'Garcia',
      dateOfBirth: '1990-01-01',
      gender: 1,
      maritalStatus: '1',
      nationality: 'MEX',
      federalEntity: '09',
      relationship: 1,
      beneficiaryPercentage: '50',
      address: {
        addressType: '1',
        country: 'MX',
        street: 'Calle 1',
        externalNumber: '10',
        internalNumber: '',
        postalCode: '28001',
        federalEntity: '09',
        municipality: '010',
        neighborhood: 'Centro',
        city: '01'
      }
    }];
    const result = mapToSignalBeneficiaries(checkpoint as any);

    expect(result.length).toBe(1);
    expect(result[0].tempId).toBeDefined();
  });

  it('should map query maintenance response and convert percentage', () => {
    const input = [{
      beneficiaryId: 1,
      personId: 10,
      accountRoleId: 100,
      active: true,
      curp: 'ABCD000101HDFRVN09',
      foreignWithoutCURP: false,
      rfc: 'RFC123456789',
      nif: '',
      tin: '',
      nss: '',
      firstName: 'Juan',
      middleName: '',
      firstLastName: 'Perez',
      secondLastName: 'Garcia',
      dateOfBirth: '1990-01-01',
      gender: 1,
      nationality: 'MEX',
      country: 'MX',
      federalEntity: '09',
      relationship: 1,
      beneficiaryPercentage: '25',
      address: {
        addressId: null,
        addressType: '1',
        country: 'MX',
        postalCode: '28001',
        city: '01',
        municipality: '010',
        neighborhood: 'Centro',
        street: 'Calle 1',
        externalNumber: '10',
        internalNumber: '',
        federalEntity: '09'
      }
    }];

    const result = beneficiariesMapperQueryMaint(input as any);
    expect(result.length).toBe(1);
    expect(result[0].percentage).toBe('25');
  });

  it('should handle empty beneficiary array', () => {
    const result = toCheckpoint([]);
    expect(result.length).toBe(0);
  });
});
