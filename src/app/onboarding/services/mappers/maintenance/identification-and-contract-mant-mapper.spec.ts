import {
  checkpointMantToIdentificationAndContact,
  identificationAndContactToCheckpointMant,
} from './identification-and-contract-mant-mapper';
import { IndentificationAndContactInformation } from '../../../models/identification-and-contact';
import { IdentificationAndContactInfoCheckpointMant } from '../../../models/checkpoints/maintenance/identification-and-contact-mant-checkpoint';
import { Countries } from '../../../models/country';
import { PhoneType } from '../../../models/phone-type';
import { IdentificationType } from '../../../models/identification-type';

describe('identification-and-contract-mant-mapper', () => {
  describe('identificationAndContactToCheckpointMant', () => {
    it('debe mapear identifications, phones y emails al checkpoint', () => {
      const request: IndentificationAndContactInformation = {
        manifestLetter: true,
        identifications: [
          {
            id: 15,
            identificationCountryId: 'MX',
            identificationTypeId: 'IFE',
            identificationNumber: 'ABC123',
            identificationExpDate: '2030-12-31',
            active: true,
          } as any,
          {
            id: 'tmp-1',
            identificationCountryId: 'US',
            identificationTypeId: 'PASS',
            identificationNumber: 'XYZ987',
            identificationExpDate: '',
            active: false,
          } as any,
        ],
        phones: [
          {
            id: 8,
            phoneTypeId: '1',
            phoneCountryId: 'MX',
            phoneCodeArea: '55',
            phone: '5555555555',
            phoneExtension: '123',
            phoneNotification: true,
            active: true,
          } as any,
          {
            id: 'tmp-phone',
            phoneTypeId: '2',
            phoneCountryId: 'US',
            phoneCodeArea: '01',
            phone: '9999999999',
            phoneExtension: undefined,
            phoneNotification: false,
            active: false,
          } as any,
        ],
        emails: [
          {
            id: 4,
            mail: 'demo@test.com',
            mailNotification: true,
            active: true,
          } as any,
          {
            id: 'tmp-mail',
            mail: 'otro@test.com',
            mailNotification: false,
            active: false,
          } as any,
        ],
      };

      const result = identificationAndContactToCheckpointMant(request);

      expect(result).toEqual({
        manifestLetter: true,
        identifications: [
          {
            id: 15,
            country: 'MX',
            identificationType: 'IFE',
            identificationNumber: 'ABC123',
            expirationDate: '2030-12-31',
            active: true,
          },
          {
            id: null,
            country: 'US',
            identificationType: 'PASS',
            identificationNumber: 'XYZ987',
            expirationDate: '',
            active: false,
          },
        ],
        telephones: [
          {
            id: 8,
            type: '1',
            country: 'MX',
            areaCode: '55',
            phone: '5555555555',
            extension: '123',
            notificationPhone: true,
            active: true,
          },
          {
            id: null,
            type: '2',
            country: 'US',
            areaCode: '01',
            phone: '9999999999',
            extension: '',
            notificationPhone: false,
            active: false,
          },
        ],
        emails: [
          {
            id: 4,
            emailAddress: 'demo@test.com',
            notificationEmail: true,
            active: true,
          },
          {
            id: null,
            emailAddress: 'otro@test.com',
            notificationEmail: false,
            active: false,
          },
        ],
      });
    });
  });

  describe('checkpointMantToIdentificationAndContact', () => {
    it('debe reconstruir la seccion resolviendo nombres desde catalogos', async () => {
      const checkpoint: IdentificationAndContactInfoCheckpointMant = {
        manifestLetter: false,
        identifications: [
          {
            id: 1,
            country: 'MX',
            identificationType: 'IFE',
            identificationNumber: 'ABC123',
            expirationDate: '2030-12-31',
            active: true,
          },
        ],
        telephones: [
          {
            id: 2,
            type: '1',
            country: 'US',
            areaCode: '01',
            phone: '9999999999',
            extension: '321',
            notificationPhone: true,
            active: true,
          },
        ],
        emails: [
          {
            id: 3,
            emailAddress: 'demo@test.com',
            notificationEmail: false,
            active: true,
          },
        ],
      };

      const countries: Countries[] = [
        { countryId: 'MX', country: 'Mexico', countryCode: '+52' },
        { countryId: 'US', country: 'United States', countryCode: '+1' },
      ];
      const phoneTypes: PhoneType[] = [
        { telephoneTypeId: '1', telephoneType: 'Celular', mandt: '', spras: '' },
      ];
      const identifications: IdentificationType[] = [
        { type: 'IFE', text: 'INE/IFE', client: '', spras: '' },
      ];

      const result = await checkpointMantToIdentificationAndContact(
        checkpoint,
        phoneTypes,
        countries,
        identifications,
      );

      expect(result).toEqual({
        manifestLetter: false,
        identifications: [
          {
            id: 1,
            identificationCountry: 'Mexico',
            identificationCountryId: 'MX',
            identificationType: 'INE/IFE',
            identificationTypeId: 'IFE',
            identificationNumber: 'ABC123',
            identificationExpDate: '2030-12-31',
            active: true,
          },
        ],
        phones: [
          {
            id: 2,
            phoneType: 'Celular',
            phoneTypeId: '1',
            phoneCountry: 'United States',
            phoneCountryId: 'US',
            phoneCodeArea: '01',
            phone: '9999999999',
            phoneExtension: '321',
            phoneNotification: true,
            active: true,
          },
        ],
        emails: [
          {
            id: 3,
            mail: 'demo@test.com',
            mailNotification: false,
            active: true,
          },
        ],
      });
    });

    it('debe usar strings vacios cuando no encuentra coincidencias en catalogos', async () => {
      const checkpoint: IdentificationAndContactInfoCheckpointMant = {
        manifestLetter: true,
        identifications: [
          {
            id: null,
            country: 'ZZ',
            identificationType: 'UNKNOWN',
            identificationNumber: '000',
            expirationDate: '',
            active: false,
          },
        ],
        telephones: [
          {
            id: null,
            type: '9',
            country: 'YY',
            areaCode: '',
            phone: '123',
            extension: '',
            notificationPhone: false,
            active: false,
          },
        ],
        emails: [],
      };

      const result = await checkpointMantToIdentificationAndContact(checkpoint, [], [], []);

      expect(result.identifications[0].identificationCountry).toBe('');
      expect(result.identifications[0].identificationType).toBe('');
      expect(result.phones[0].phoneType).toBe('');
      expect(result.phones[0].phoneCountry).toBe('');
      expect(result.emails).toEqual([]);
    });
  });
});
