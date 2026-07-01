import {
  mapFormToCheckPointPpeData,
  mapFormToCheckPointPpeDataMant
} from './customer-ppe.mapper';

describe('PPE Mapper Full Coverage', () => {

  const baseDependent = (overrides?: any) => ({
    idS: '1',
    idDep: 1,
    personId: 1,
    phoneId: 1,
    accountRoleId: 1,
    addressId: 1,
    clientIdNum: 1,
    isActive: true,

    curp: 'ABCDEFGHIJKLAA01',
    foreignerWithoutCurp: false,
    firstName: 'Name',
    middleName: 'Mid',
    firstLastName: 'Last',
    secondLastName: 'Last2',
    rfc: 'RFC',
    typeIden: 'RFC',
    dateOfBirth: '2020-01-01',
    maritalStatus: '1',
    countryOfBirth: 'MX',
    stateOfBirth: 'AGS',
    occupation: 'DEV',
    businessTurnaround: 'IT',
    addressType: 'HOME',
    country: 'MX',
    street: 'Street',
    externalNumber: '1',
    internalNumber: '',
    postalCode: '20000',
    federalEntityID: 'AGS',
    cityID: 'AGS',
    municipalityID: 'AGS',
    neighborhood: 'COL',
    relationship: '1',
    nationality: 'MX',
    phone: '123',
    ...overrides
  });

  const baseAssociation = (overrides?: any) => ({
    idAso: 10,
    personId: 1,
    phoneId: 1,
    addressId: 1,
    clientIdNum: 1,
    isActive: true,
    companyName: 'COMP',
    rfc: 'RFC',
    commercialBusiness: 'BUS',
    economicActivity: 'ACT',
    administratorManagerAttorney: 'ADMIN',
    nationality: 'MX',
    addressType: 'HOME',
    country: 'MX',
    street: 'Street',
    externalNumber: '1',
    internalNumber: '',
    postalCode: '20000',
    federalEntityID: 'AGS',
    cityID: 'AGS',
    municipalityID: 'AGS',
    neighborhood: 'COL',
    phone: '123',
    ...overrides
  });

  const baseFamily = (overrides?: any) => ({
    id: 1,
    personId: 1,
    accountRole: 1,
    addressId: 1,
    isActive: true,

    curp: 'ABCDEFGHIJKLAA01',
    foreignerWithoutCurp: false,
    firstName: 'Name',
    middleName: '',
    firstLastName: '',
    secondLastName: '',
    rfc: 'RFC',
    typeIden: 'RFC',
    chargeDueDate: '2024-01-01',
    relationship: '1',
    nationality: 'MX',
    dateOfBirth: '2020-01-01',
    maritalStatus: '1',
    countryOfBirth: 'MX',
    stateOfBirth: 'AGS',
    positionHeld: 'POS',
    ...overrides
  });

  const buildPpe = (overrides?: any) => ({
    id: 1,
    typePPE: 'TYPE',
    positionHeld: 'POS',
    expirationDate: '2024-01-01',
    ppe: true,
    dppe: 'YES',
    sappe: 'YES',
    fppe: 'YES',
    dataClientDepPPE: [baseDependent()],
    dataClientSocAndAssoPPE: [baseAssociation()],
    dataClientFamilyPPE: [baseFamily()],
    ...overrides
  });

  // ---------------------------
  // ✅ BASE
  // ---------------------------
  it('mapea estructura básica', () => {
    const result = mapFormToCheckPointPpeData(buildPpe());

    expect(result.isPpe).toBeTrue();
    expect(result.economicDependents.length).toBe(1);
    expect(result.associations.length).toBe(1);
    expect(result.familyData.length).toBe(1);
  });

  // ---------------------------
  // ✅ FLAGS
  // ---------------------------
  it('flags true', () => {
    const res = mapFormToCheckPointPpeData(buildPpe());
    expect(res.hasEconomicDependents).toBeTrue();
  });

  it('flags false', () => {
    const res = mapFormToCheckPointPpeData(
      buildPpe({ dppe: 'NO', sappe: 'NO', fppe: 'NO' })
    );
    expect(res.hasEconomicDependents).toBeFalse();
    expect(res.hasAssociations).toBeFalse();
    expect(res.hasFamilyPpe).toBeFalse();
  });

  // ---------------------------
  // ✅ ARRAYS VACÍOS
  // ---------------------------
  it('maneja arrays vacíos', () => {
    const res = mapFormToCheckPointPpeData(
      buildPpe({
        dataClientDepPPE: [],
        dataClientFamilyPPE: [],
        dataClientSocAndAssoPPE: []
      })
    );

    expect(res.economicDependents.length).toBe(0);
    expect(res.familyData.length).toBe(0);
    expect(res.associations.length).toBe(0);
  });

  // ---------------------------
  // ✅ FOREIGN / LOCAL
  // ---------------------------
  it('dependent extranjero', () => {
    const res = mapFormToCheckPointPpeData(
      buildPpe({
        dataClientDepPPE: [
          baseDependent({
            foreignerWithoutCurp: true,
            curp: 'ABCDEFGHIJKLNE01'
          })
        ]
      })
    );

    expect(res.economicDependents[0].stateOfBirth).toBe('');
  });

  it('dependent nacional', () => {
    const res = mapFormToCheckPointPpeData(buildPpe());

    expect(res.economicDependents[0].stateOfBirth).toBe('AGS');
    expect(res.economicDependents[0].cityOfBirth).toBe('1');
  });

  // ---------------------------
  // ✅ MX / NO MX
  // ---------------------------
  it('usa ID MX', () => {
    const res = mapFormToCheckPointPpeData(buildPpe());
    expect(res.economicDependents[0].federalEntity).toBe('AGS');
  });

  it('usa texto en no MX', () => {
    const res = mapFormToCheckPointPpeData(
      buildPpe({
        dataClientDepPPE: [
          baseDependent({
            country: 'US',
            federalEntity: 'TX',
            city: 'Dallas'
          })
        ]
      })
    );

    expect(res.economicDependents[0].federalEntity).toBe('TX');
  });

  // ---------------------------
  // ✅ OPCIONALES
  // ---------------------------
  it('maneja undefined', () => {
    const res = mapFormToCheckPointPpeData(
      buildPpe({
        dataClientDepPPE: [
          baseDependent({ internalNumber: undefined })
        ]
      })
    );

    expect(res.economicDependents[0].internalNumber).toBe('');
  });

  // ---------------------------
  // ✅ MANT MERGE
  // ---------------------------
  it('merge input + removed', () => {
    const input = buildPpe({
      dataClientDepPPE: [baseDependent({ idS: '1' })]
    });

    const original = buildPpe({
      dataClientDepPPE: [baseDependent({ idS: '2' })]
    });

    const res = mapFormToCheckPointPpeDataMant(input, original);

    expect(res.economicDependents.length).toBe(2);
  });

  it('marca eliminados como inactive', () => {
    const input = buildPpe({
      dataClientDepPPE: [baseDependent({ idS: '1' })]
    });

    const original = buildPpe({
      dataClientDepPPE: [baseDependent({ idS: '2' })]
    });

    const res = mapFormToCheckPointPpeDataMant(input, original);

    expect(res.economicDependents.some(x => x.active === false)).toBeTrue();
  });

  it('mant con original null', () => {
    const res = mapFormToCheckPointPpeDataMant(buildPpe(), null);
    expect(res.economicDependents.length).toBe(1);
  });

  it('mant sin eliminados', () => {
    const input = buildPpe();

    const original = buildPpe();

    const res = mapFormToCheckPointPpeDataMant(input, original);

    expect(res.economicDependents.length).toBe(1);
  });

  // ---------------------------
  // ✅ FAMILY BRANCH
  // ---------------------------
  it('family extranjero', () => {
    const res = mapFormToCheckPointPpeDataMant(
      buildPpe({
        dataClientFamilyPPE: [
          baseFamily({
            foreignerWithoutCurp: true,
            curp: 'ABCDEFGHIJKLNE01'
          })
        ]
      }),
      null
    );

    expect(res.familyData[0].federalEntity).toBe('');
  });

  it('family nacional', () => {
    const res = mapFormToCheckPointPpeDataMant(buildPpe(), null);

    expect(res.familyData[0].federalEntity).toBe('AGS');
  });

});