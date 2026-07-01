import {
  existingClientToAddress,
  existingClientToClient,
  existingClientToDataClient,
  existingClientToIdentifications,
  existingClientToMails,
  existingClientToMisceSection,
  existingClientToPhones,
  existingClientToPpe,
  rfcNifTinSsnValue,
} from './third-person-modal-mapper';

describe('third-person-modal-mapper', () => {
  describe('existingClientToAddress', () => {
    it('should map the first address and apply defaults when missing values', () => {
      const result = existingClientToAddress([
        {
          addressId: 10,
          addressType: 'HOME',
          country: 'MX',
          postalCode: '28001',
          expirationYear: 2026,
        },
      ] as any);

      expect(result).toEqual(jasmine.objectContaining({
        addressId: 10,
        addressType: 'HOME',
        country: 'MX',
        postalCode: '28001',
        expirationYear: '2026',
      }));
    });
  });

  describe('existingClientToClient', () => {
    it('should map client data and use general info marital status when provided', () => {
      const result = existingClientToClient(
        {
          curp: 'ABC',
          rfc: 'RFC123',
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
        } as any,
        { maritalStatus: '2' } as any,
      );

      expect(result).toEqual(jasmine.objectContaining({
        curp: 'ABC',
        rfc: 'RFC123',
        maritalStatus: '2',
        stateOfBirth: 'CDMX',
      }));
    });
  });

  describe('existingClientToDataClient', () => {
    it('should map data client and use default marital status when general info is missing', () => {
      const result = existingClientToDataClient({
        curp: 'ABC',
        rfc: 'RFC123',
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
      } as any);

      expect(result).toEqual(jasmine.objectContaining({
        curp: 'ABC',
        rfc: 'RFC123',
        maritalStatus: '6',
        isSaved: false,
        isView: false,
      }));
    });
  });

  describe('existingClientToIdentifications', () => {
    it('should map identifications using catalog lookups', () => {
      const result = existingClientToIdentifications(
        [
          {
            id: 1,
            country: 'MX',
            identificationType: 'PASS',
            identificationNumber: '12345',
            expirationDate: '2027-01-01',
            active: true,
          },
        ],
        [
          { type: 'PASS', text: 'Passport' },
        ] as any,
        [
          { countryId: 'MX', country: 'Mexico' },
        ] as any,
      );

      expect(result).toEqual([
        {
          id: 1,
          identificationCountry: 'Mexico',
          identificationCountryId: 'MX',
          identificationType: 'Passport',
          identificationTypeId: 'PASS',
          identificationNumber: '12345',
          identificationExpDate: '2027-01-01',
          active: true,
          isSaved: true,
        },
      ]);
    });
  });

  describe('existingClientToPhones', () => {
    it('should map phones using catalogs and keep isSaved true', () => {
      const result = existingClientToPhones(
        [
          {
            id: 1,
            type: 'MOBILE',
            country: 'MX',
            areaCode: '55',
            phone: '12345678',
            extension: '10',
            notificationPhone: true,
            active: true,
          },
        ] as any,
        [
          { telephoneTypeId: 'MOBILE', telephoneType: 'Celular' },
        ] as any,
        [
          { countryId: 'MX', country: 'Mexico' },
        ] as any,
      );

      expect(result).toEqual([
        {
          id: 1,
          phoneType: 'Celular',
          phoneTypeId: 'MOBILE',
          phoneCountry: 'Mexico',
          phoneCountryId: 'MX',
          phoneCodeArea: '55',
          phone: '12345678',
          phoneExtension: '10',
          phoneNotification: true,
          active: true,
          isSaved: true,
        },
      ]);
    });
  });

  describe('existingClientToMails', () => {
    it('should map email list entries', () => {
      const result = existingClientToMails([
        {
          id: 1,
          emailAddress: 'test@example.com',
          notificationEmail: true,
          active: true,
        },
      ] as any);

      expect(result).toEqual([
        {
          id: 1,
          mail: 'test@example.com',
          mailNotification: true,
          active: true,
          isSaved: true,
        },
      ]);
    });
  });

  describe('existingClientToPpe', () => {
    it('should map PPE data and family members', () => {
      const result = existingClientToPpe({
        ppe: true,
        ppeType: 'PEP',
        positionHeld: 'Manager',
        expirationDate: '2026-12-31',
        hasFamilyPpe: true,
        familyData: [
          {
            accountRole: '1',
            curp: 'CURP1',
            foreignerWithoutCurp: false,
            rfc: 'RFC1',
            firstName: 'Ana',
            middleName: 'B',
            dateOfBirth: '01/01/1990',
            firstLastName: 'Lopez',
            secondLastName: 'Diaz',
            nationality: 'MEX',
            countryOfBirth: 'MX',
            positionHeldEndDate: '2026-01-01',
            relationship: 'Sister',
            positionHeld: 'Executive',
          },
        ],
      } as any);

      expect(result).toEqual(jasmine.objectContaining({
        ppe: true,
        tppe: 'PEP',
        fppe: true,
        dataFamily: jasmine.any(Array),
      }));
    });
  });

  describe('existingClientToMisceSection', () => {
    it('should map miscellaneous section values', () => {
      const result = existingClientToMisceSection(
        {
          economicActivity: 'ACT',
          occupation: 'EMP',
          companyName: 'ACME',
          jobTitle: 'Director',
          companyPhone: '5555',
          profession: 'Lic',
        } as any,
        { fiscalResidences: [{ country: 'MX' }] } as any,
      );

      expect(result).toEqual(jasmine.objectContaining({
        economicActivity: 'ACT',
        occupation: 'EMP',
        fiscalCountry: 'MX',
        workCompany: 'ACME',
        positionHeld: 'Director',
        phoneBusiness: '5555',
        profession: 'Lic',
      }));
    });
  });

  describe('rfcNifTinSsnValue', () => {
    it('should return identifiers by priority', () => {
      expect(rfcNifTinSsnValue({ rfc: 'RFC1', nif: 'NIF1', tin: 'TIN1', nss: 'NSS1' } as any)).toBe('RFC1');
      expect(rfcNifTinSsnValue({ nif: 'NIF1', tin: 'TIN1', nss: 'NSS1' } as any)).toBe('NIF1');
      expect(rfcNifTinSsnValue({ tin: 'TIN1', nss: 'NSS1' } as any)).toBe('TIN1');
      expect(rfcNifTinSsnValue({ nss: 'NSS1' } as any)).toBe('NSS1');
      expect(rfcNifTinSsnValue({} as any)).toBe('');
    });
  });
});