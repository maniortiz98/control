import {
  identificationAndContactToCheckpointMant,
  mapCheckpointMant,
  checkpointMantToIdentificationAndContact
} from './customer-identification-and-contract-mant-mapper';

describe('Identification & Contact Mappers', () => {

  const buildRequest = () => ({
    identifications: [
      {
        id: 1,
        identificationCountryId: 'MX',
        identificationTypeId: 'INE',
        identificationNumber: '123',
        identificationExpDate: '2025',
        active: true
      },
      {
        id: 'temp',
        identificationCountryId: 'US',
        identificationTypeId: 'PASS',
        identificationNumber: '456',
        identificationExpDate: '',
        active: false
      }
    ],
    manifestLetter: true,
    phones: [
      {
        id: 1,
        phoneTypeId: 'MOBILE',
        phoneCountryId: 'MX',
        phoneCodeArea: '01',
        phone: '123456',
        phoneExtension: '',
        phoneNotification: true,
        active: true
      }
    ],
    emails: [
      {
        id: 1,
        mail: 'test@mail.com',
        mailNotification: true,
        active: true
      }
    ]
  });

  describe('identificationAndContactToCheckpointMant', () => {

    it('convierte correctamente identificaciones', () => {
      const result = identificationAndContactToCheckpointMant(buildRequest() as any);

      expect(result.identifications.length).toBe(2);

      expect(result.identifications[0].id).toBe('1');
      expect(result.identifications[1].id).toBeNull();

      expect(result.identifications[0].country).toBe('MX');
      expect(result.identifications[0].identificationType).toBe('INE');
    });

    it('convierte teléfonos y emails', () => {
      const result = identificationAndContactToCheckpointMant(buildRequest() as any);

      expect(result.telephones.length).toBe(1);
      expect(result.telephones[0].phone).toBe('123456');

      expect(result.emails.length).toBe(1);
      expect(result.emails[0].emailAddress).toBe('test@mail.com');
    });

  });

  describe('mapCheckpointMant', () => {

    it('filtra registros con id vacío e inactive', () => {
      const input = {
        identifications: [
          { id: null, active: false },
          { id: '1', active: true }
        ],
        telephones: [
          { id: '', active: false },
          { id: '2', active: true }
        ],
        emails: [
          { id: 0, active: false },
          { id: '3', active: true }
        ],
        manifestLetter: true
      };

      const result = mapCheckpointMant(input);

      expect(result.identifications.length).toBe(1);
      expect(result.telephones.length).toBe(1);
      expect(result.emails.length).toBe(1);
    });

    it('mantiene registros activos aunque no tengan id', () => {
      const input = {
        identifications: [
          { id: null, active: true }
        ],
        telephones: [],
        emails: [],
        manifestLetter: true
      };

      const result = mapCheckpointMant(input);

      expect(result.identifications.length).toBe(1);
    });

  });

  describe('checkpointMantToIdentificationAndContact', () => {

    const phoneTypes = [
      { telephoneTypeId: 'MOBILE', telephoneType: 'Mobile' }
    ] as any;

    const countries = [
      { countryId: 'MX', country: 'Mexico' }
    ] as any;

    const identificationTypes = [
      { type: 'INE', text: 'INE Desc' }
    ] as any;

    it('convierte identificaciones', async () => {
      const checkpoint = {
        identifications: [
          {
            id: '1',
            country: 'MX',
            identificationType: 'INE',
            identificationNumber: '123',
            expirationDate: '2025',
            active: true
          }
        ],
        telephones: [],
        emails: [],
        manifestLetter: true
      };

      const result = await checkpointMantToIdentificationAndContact(
        checkpoint as any,
        phoneTypes,
        countries,
        identificationTypes
      );

      expect(result.identifications[0].identificationCountry).toBe('Mexico');
      expect(result.identifications[0].identificationType).toBe('INE Desc');
      expect(result.identifications[0].isSaved).toBeTrue();
    });

    it('convierte teléfonos', async () => {
      const checkpoint = {
        identifications: [],
        telephones: [
          {
            id: '1',
            type: 'MOBILE',
            country: 'MX',
            areaCode: '01',
            phone: '123',
            extension: '',
            notificationPhone: true,
            active: true
          }
        ],
        emails: [],
        manifestLetter: true
      };

      const result = await checkpointMantToIdentificationAndContact(
        checkpoint as any,
        phoneTypes,
        countries,
        identificationTypes
      );

      expect(result.phones[0].CustomerPhoneType).toBe('Mobile');
      expect(result.phones[0].phoneCountry).toBe('Mexico');
    });

    it('convierte emails', async () => {
      const checkpoint = {
        identifications: [],
        telephones: [],
        emails: [
          {
            id: '1',
            emailAddress: 'test@mail.com',
            notificationEmail: true,
            active: true
          }
        ],
        manifestLetter: true
      };

      const result = await checkpointMantToIdentificationAndContact(
        checkpoint as any,
        phoneTypes,
        countries,
        identificationTypes
      );

      expect(result.emails[0].mail).toBe('test@mail.com');
      expect(result.emails[0].isSaved).toBeTrue();
    });

    it('usa fallback vacío si no encuentra catálogos', async () => {
      const checkpoint = {
        identifications: [
          {
            id: '1',
            country: 'XX',
            identificationType: 'X',
            identificationNumber: '123',
            expirationDate: '',
            active: true
          }
        ],
        telephones: [],
        emails: [],
        manifestLetter: true
      };

      const result = await checkpointMantToIdentificationAndContact(
        checkpoint as any,
        [],
        [],
        []
      );

      expect(result.identifications[0].identificationCountry).toBe('');
      expect(result.identifications[0].identificationType).toBe('');
    });

  });

});