import { mapToSignalPPE, mapToSignalPPECustomer } from './ppe-mapper';

describe('response/ppe-mapper', () => {
  it('should map full PPE response data', () => {
    const result = mapToSignalPPE({
      isPpe: true,
      hasFamilyPpe: true,
      hasEconomicDependents: true,
      hasAssociations: true,
      ppeType: 'TYPE',
      positionHeld: 'ROLE',
      expirationDate: '20/05/2026',
      familyData: [
        {
          curp: 'CURP1',
          foreignerWithoutCurp: false,
          rfc: 'RFC1',
          dateOfBirth: '20/05/2026',
          nationality: 'MX',
          countryOfBirth: 'MX',
          federalEntity: 'CDMX',
          firstName: 'Name',
          middleName: 'Mid',
          firstLastName: 'Last1',
          secondLastName: 'Last2',
          positionHeldEndDate: '21/05/2026',
          relationship: 2,
          positionHeld: 'Role',
          maritalStatus: 1,
        },
      ],
      economicDependents: [
        {
          curp: 'CURP2',
          foreignerWithoutCurp: true,
          nif: 'NIF1',
          dateOfBirth: '1990-01-01',
          nationality: 'US',
          countryOfBirth: 'US',
          federalEntity: 'TX',
          firstName: 'Dep',
          firstLastName: 'One',
          secondLastName: 'Two',
          relationship: 3,
          occupation: 'Lawyer',
          economicActivity: 'Services',
          phone: '55',
          addressType: 'HOME',
          country: 'US',
          postalCode: '12345',
          city: 'Austin',
          municipality: 'Austin',
          neighborhood: 'Downtown',
          street: 'Main',
          externalNumber: '1',
          internalNumber: '2',
          maritalStatus: 2,
        },
      ],
      associations: [
        {
          rfc: 'RFC3',
          companyName: 'Corp',
          commercialLine: 'Line',
          administratorName: 'Admin',
          phone: '999',
          economicActivity: 'Trade',
          nationality: 'MX',
          addressType: 'OFFICE',
          country: 'MX',
          postalCode: '01000',
          federalEntity: 'CDMX',
          city: 'CDMX',
          municipality: 'BJ',
          neighborhood: 'Napoles',
          street: 'Street',
          externalNumber: '10',
          internalNumber: '11',
        },
      ],
    } as any);

    expect(result).toEqual(
      jasmine.objectContaining({
        ppe: true,
        fppe: 'yes',
        dppe: 'yes',
        sappe: 'yes',
        expirationDate: '2026-05-20',
      }),
    );
    expect(result.dataClientFamilyPPE[0]).toEqual(
      jasmine.objectContaining({
        typeIden: '1',
        rfc: 'RFC1',
        dateOfBirth: '2026-05-20',
        chargeDueDate: '2026-05-21',
        relationship: '2',
        maritalStatus: '1',
      }),
    );
    expect(result.dataClientDepPPE[0]).toEqual(
      jasmine.objectContaining({
        typeIden: '2',
        rfc: 'NIF1',
        phone: 55,
        dateOfBirth: '1990-01-01',
      }),
    );
    expect(result.dataClientSocAndAssoPPE[0]).toEqual(
      jasmine.objectContaining({ companyName: 'Corp', administratorManagerAttorney: 'Admin' }),
    );
  });

  it('should map customer PPE data and defaults', () => {
    const result = mapToSignalPPECustomer({
      ppe: true,
      hasFamilyPpe: true,
      ppeType: 'TYPE',
      positionHeld: 'ROLE',
      expirationDate: '20/05/2026',
      familyData: [
        {
          tin: 'TIN1',
          dateOfBirth: '20/05/2026',
          stateOfBirth: '',
          cityOfBirth: 'MTY',
        },
      ],
    } as any);

    expect(result).toEqual(
      jasmine.objectContaining({
        ppe: true,
        fppe: 'yes',
        dppe: 'no',
        sappe: 'no',
        expirationDate: '2026-05-20',
        dataClientDepPPE: [],
        dataClientSocAndAssoPPE: [],
      }),
    );
    expect(result.dataClientFamilyPPE[0]).toEqual(
      jasmine.objectContaining({
        typeIden: '3',
        rfc: 'TIN1',
        stateOfBirth: 'MTY',
        isSaved: true,
        isView: true,
      }),
    );

    expect(mapToSignalPPECustomer(null)).toEqual(
      jasmine.objectContaining({
        ppe: false,
        fppe: 'no',
        dataClientFamilyPPE: [],
      }),
    );
  });
});