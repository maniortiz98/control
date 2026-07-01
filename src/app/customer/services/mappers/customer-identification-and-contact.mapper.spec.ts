import {
  checkpointToIdentificationAndContact,
  exitentedToIdentificationAndContactEdit,
  identificationAndContactToCheckpoint
} from './customer-identification-and-contact.mapper';

describe('Identification & Contact Mappers (Non-Maintenance)', () => {

  const buildRequest = () => ({
    identifications: [
      {
        identificationCountryId: 'MX',
        identificationTypeId: 'INE',
        identificationNumber: '123',
        identificationExpDate: '2025',
        active: true
      },
      {
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
        phoneTypeId: 'MOBILE',
        phoneCountryId: 'MX',
        phoneCodeArea: '01',
        phone: '123456',
        phoneExtension: '',
        phoneNotification: true,
        active: true
      },
      {
        phoneTypeId: 'HOME',
        phoneCountryId: 'MX',
        phoneCodeArea: '02',
        phone: '999',
        phoneNotification: false,
        active: false
      }
    ],
    emails: [
      {
        mail: 'test@mail.com',
        mailNotification: true,
        active: true
      },
      {
        mail: 'inactive@mail.com',
        mailNotification: false,
        active: false
      }
    ]
  });

  describe('identificationAndContactToCheckpoint', () => {

    it('filtra solo elementos activos', () => {
      const result = identificationAndContactToCheckpoint(buildRequest() as any);

      expect(result.identifications.length).toBe(1);
      expect(result.telephones.length).toBe(1);
      expect(result.emails.length).toBe(1);
    });

    it('mapea identificaciones correctamente', () => {
      const result = identificationAndContactToCheckpoint(buildRequest() as any);

      const item = result.identifications[0];

      expect(item.country).toBe('MX');
      expect(item.identificationType).toBe('INE');
      expect(item.identificationNumber).toBe('123');
      expect(item.expirationDate).toBe('2025');
    });

    it('mapea phones y emails', () => {
      const result = identificationAndContactToCheckpoint(buildRequest() as any);

      expect(result.telephones[0].phone).toBe('123456');
      expect(result.emails[0].emailAddress).toBe('test@mail.com');
    });

  });

  describe('checkpointToIdentificationAndContact', () => {

    const phoneTypes = [
      { telephoneTypeId: 'MOBILE', telephoneType: 'Mobile' }
    ] as any;

    const countries = [
      { countryId: 'MX', country: 'Mexico' }
    ] as any;

    const identificationTypes = [
      { type: 'INE', text: 'INE Desc' }
    ] as any;

    it('convierte identificaciones y genera id', async () => {
      const checkpoint = {
        identifications: [
          {
            country: 'MX',
            identificationType: 'INE',
            identificationNumber: '123',
            expirationDate: '2025'
          }
        ],
        telephones: [],
        emails: [],
        manifestLetter: true
      };

      const result = await checkpointToIdentificationAndContact(
        checkpoint as any,
        phoneTypes,
        countries,
        identificationTypes
      );

      expect(result.identifications[0].identificationCountry).toBe('Mexico');
      expect(result.identifications[0].identificationType).toBe('INE Desc');
      expect(result.identifications[0].active).toBeTrue();
      expect(typeof result.identifications[0].id).toBe('string');
    });

    it('convierte teléfonos', async () => {
      const checkpoint = {
        identifications: [],
        telephones: [
          {
            type: 'MOBILE',
            country: 'MX',
            areaCode: '01',
            phone: '123',
            extension: '',
            notificationPhone: true
          }
        ],
        emails: [],
        manifestLetter: true
      };

      const result = await checkpointToIdentificationAndContact(
        checkpoint as any,
        phoneTypes,
        countries,
        identificationTypes
      );

      expect(result.phones[0].CustomerPhoneType).toBe('Mobile');
      expect(result.phones[0].phoneCountry).toBe('Mexico');
      expect(result.phones[0].active).toBeTrue();
    });

    it('convierte emails', async () => {
      const checkpoint = {
        identifications: [],
        telephones: [],
        emails: [
          {
            emailAddress: 'test@mail.com',
            notificationEmail: true
          }
        ],
        manifestLetter: true
      };

      const result = await checkpointToIdentificationAndContact(
        checkpoint as any,
        phoneTypes,
        countries,
        identificationTypes
      );

      expect(result.emails[0].mail).toBe('test@mail.com');
      expect(result.emails[0].active).toBeTrue();
    });

    it('usa fallback vacío si no encuentra catálogo', async () => {
      const checkpoint = {
        identifications: [
          {
            country: 'XX',
            identificationType: 'X',
            identificationNumber: '123',
            expirationDate: ''
          }
        ],
        telephones: [],
        emails: [],
        manifestLetter: true
      };

      const result = await checkpointToIdentificationAndContact(
        checkpoint as any,
        [],
        [],
        []
      );

      expect(result.identifications[0].identificationCountry).toBe('');
      expect(result.identifications[0].identificationType).toBe('');
    });

  });

  describe('exitentedToIdentificationAndContactEdit', () => {

    const phoneTypes = [
      { telephoneTypeId: 'MOBILE', telephoneType: 'Mobile' }
    ] as any;

    const countries = [
      { countryId: 'MX', country: 'Mexico' }
    ] as any;

    const identificationTypes = [
      { type: 'INE', text: 'INE Desc' }
    ] as any;

    it('mapea response completo', async () => {
      const response = {
        identifications: [
          {
            id: 1,
            country: 'MX',
            identificationType: 'INE',
            identificationNumber: '123',
            expirationDate: '2025',
            active: true
          }
        ],
        telephones: [
          {
            id: 1,
            type: 'MOBILE',
            country: 'MX',
            areaCode: '01',
            phone: '123',
            extension: '',
            notificationPhone: true,
            active: true
          }
        ],
        emails: [
          {
            id: 1,
            type: null,
            emailAddress: 'test@mail.com',
            notificationEmail: true,
            active: true
          }
        ]
      };

      const result = await exitentedToIdentificationAndContactEdit(
        response,
        phoneTypes,
        countries,
        identificationTypes
      );

      expect(result.identifications[0].identificationCountry).toBe('Mexico');
      expect(result.phones[0].phoneType).toBe('Mobile');
      expect(result.emails[0].mail).toBe('test@mail.com');
      expect(result.manifestLetter).toBeFalse();
    });

  });

});

