import {
  toCheckpoint,
  mapAuthorizedPersonsToData,
  authorizedPersonMapperSaveMaint,
  authorizedPersonMapperQueryMaint
} from './authorized-person.mapper';

describe('Authorized Person Mapper', () => {

  const makeAuthorizedPerson = (overrides: any = {}) => ({
    id: 'ap-1',
    personId: 1,
    active: true,
    clientData: {
      curp: 'ABCD000101HDFRVN09',
      firstName: 'Juan',
      firstLastName: 'Perez',
      dateOfBirth: '01/01/1980',
      gender: 'H',
      maritalStatus: '1'
    },
    addressData: {
      country: 'MX',
      federalEntity: 'CDMX',
      federalEntityID: '09',
      city: 'Mexico',
      cityID: '01',
      municipality: 'Cuauhtémoc',
      municipalityID: '010'
    },
    authorizedPerson: {
      management: 'yes',
      isPpe: 'no',
      faculty: 'FIRMA_AUTORIZADA'
    },
    ...overrides
  });

  const makeMaintQueryAuthorizedPerson = (overrides: any = {}) => ({
    id: 10,
    personId: 20,
    active: true,
    curp: 'ABCD000101HDFRVN09',
    foreignWithoutCURP: false,
    rfc: 'ABCD000101AAA',
    nif: '',
    tin: '',
    nss: '',
    firstName: 'Juan',
    middleName: 'Carlos',
    lastName: 'Perez',
    secondLastName: 'Lopez',
    birthDate: '1980-01-01',
    gender: '2',
    maritalStatus: '1',
    nationality: 'MX',
    birthCountry: 'MX',
    federalEntity: '09',
    clientData: {
      federalEntity: '09'
    },
    residenceAddress: {
      id: 30,
      addressType: '1',
      otherAddressType: '',
      country: 'MX',
      postalCode: '01000',
      federalEntity: '09',
      city: '001',
      municipality: '010',
      neighborhood: 'Centro',
      street: 'Reforma',
      externalNumber: '123',
      internalNumber: '4B'
    },
    contact: {
      id: 40,
      type: 'mobile',
      country: '52',
      areaCode: '55',
      phone: '5555555555',
      extension: '101',
      notification: true,
      emailAddress: 'juan@example.com'
    },
    signatureClass: 'A',
    checkbookManagementAccess: true,
    relationship: 'Titular',
    authorizedPersonType: 'Legal',
    economicActivity: 'Empleado',
    occupation: 'Analista',
    profession: 'Contador',
    companyName: 'Actinver',
    jobTitle: 'Gerente',
    personPpe: {
      id: 50,
      isPpe: true,
      ppeType: 'Nacional',
      positionHeld: 'Director',
      positionEndDate: '2024-01-01',
      hasppeRelatives: true
    },
    faculties: {
      id: 60,
      singnatureInstruction: 'FIRMA_AUTORIZADA',
      otherSignatureInstruction: 'Texto libre'
    },
    ...overrides
  });

  it('should map authorized person form to checkpoint', () => {
    const input = [makeAuthorizedPerson()];
    const result = toCheckpoint(input as any);

    expect(result.length).toBe(1);
    expect(result[0]).toEqual(jasmine.objectContaining({
      curp: 'ABCD000101HDFRVN09',
      firstName: 'Juan',
      lastName: 'Perez'
    }));
  });

  it('should convert gender from H/M to numeric', () => {
    const base = makeAuthorizedPerson();
    const inputM = [makeAuthorizedPerson({ clientData: { ...base.clientData, gender: 'M' } })];
    const inputH = [makeAuthorizedPerson({ clientData: { ...base.clientData, gender: 'H' } })];

    const resultM = toCheckpoint(inputM as any);
    const resultH = toCheckpoint(inputH as any);

    expect(resultM[0].gender).toBe(1);
    expect(resultH[0].gender).toBe(2);
  });

  it('should convert management to boolean', () => {
    const base = makeAuthorizedPerson();
    const inputYes = [makeAuthorizedPerson({
      clientData: { ...base.clientData },
      authorizedPerson: { ...base.authorizedPerson, management: 'yes' }
    })];
    const inputNo = [makeAuthorizedPerson({
      clientData: { ...base.clientData },
      authorizedPerson: { ...base.authorizedPerson, management: '' }
    })];

    expect(toCheckpoint(inputYes as any)[0].checkbookManagementAccess).toBe(true);
    expect(toCheckpoint(inputNo as any)[0].checkbookManagementAccess).toBe(false);
  });

  it('should map checkpoint to form data with tempId', () => {
    const checkpoint = [{
      curp: 'ABCD000101HDFRVN09',
      firstName: 'Juan',
      lastName: 'Perez',
      residenceAddress: { country: 'MX' },
      contact: { emailAddress: 'test@example.com' },
      personPpe: {
        isPpe: false,
        positionEndDate: '2024-01-01',
        hasppeRelatives: false
      },
      faculties: {
        signatureInstruction: 'FIRMA_AUTORIZADA',
        otherSignatureInstruction: ''
      }
    }];

    const result = mapAuthorizedPersonsToData(checkpoint as any);

    expect(result.data.length).toBe(1);
    expect(result.data[0].tempId).toBeDefined();
  });

  it('should handle null checkpoint input', () => {
    const result = mapAuthorizedPersonsToData(null as any);
    expect(result.data.length).toBe(0);
  });

  it('should handle international address in maintenance mode', () => {
    const input = [makeAuthorizedPerson({
      addressData: { country: 'USA', federalEntity: 'California', city: 'Los Angeles' }
    })];

    const result = authorizedPersonMapperSaveMaint(input as any);

    expect(result[0].residenceAddress.country).toBe('USA');
  });

  it('should map maintenance query response to page data', () => {
    const input = [makeMaintQueryAuthorizedPerson()];

    const result = authorizedPersonMapperQueryMaint(input as any);

    expect(result.data.length).toBe(1);
    expect(result.table).toEqual([]);
    expect(result.data[0]).toEqual(jasmine.objectContaining({
      id: 10,
      personId: 20,
      active: true,
      tempId: jasmine.any(String),
      clientData: jasmine.objectContaining({
        curp: 'ABCD000101HDFRVN09',
        firstName: 'Juan',
        stateOfBirth: '09',
        isSaved: true
      }),
      addressData: jasmine.objectContaining({
        id: 30,
        country: 'MX',
        active: true
      }),
      contactData: jasmine.objectContaining({
        id: 40,
        phone: '5555555555',
        phoneNotification: true,
        active: true
      }),
      authorizedPerson: jasmine.objectContaining({
        signClass: 'A',
        management: true,
        isPpe: 'si',
        ppeHasFamily: 'si',
        faculty: 'FIRMA_AUTORIZADA',
        otherFaculty: 'Texto libre'
      })
    }));
  });

  it('should default maintenance PPE flags to no when personPpe is missing', () => {
    const input = [makeMaintQueryAuthorizedPerson({ personPpe: undefined })];

    const result = authorizedPersonMapperQueryMaint(input as any);

    expect(result.data[0].authorizedPerson.isPpe).toBe('no');
    expect(result.data[0].authorizedPerson.ppeHasFamily).toBe('no');
  });
});
