import {
  exitentedClientToIdentificationAndContact
} from './identification-and-contact.mapper';

describe('Identification and Contact Mapper', () => {

  const phoneTypes = [
    { mandt: '100', spras: 'S', telephoneTypeId: 'CEL', telephoneType: 'Celular' }
  ];

  const countries = [
    { country: 'Mexico', countryId: 'MX', countryCode: '+52' }
  ];

  const identificationTypes = [
    { type: 'CURP', text: 'CURP', client: '100', spras: 'S' }
  ];

  const makePhone = (overrides: any = {}) => ({
    id: '1',
    phoneTypeId: 'CEL',
    phoneCountryId: 'MX',
    phoneCodeArea: '55',
    phone: '12345678',
    phoneExtension: '',
    phoneNotification: true,
    active: true,
    ...overrides
  });

  const makeEmail = (overrides: any = {}) => ({
    id: '1',
    mail: 'test@example.com',
    mailNotification: true,
    active: true,
    ...overrides
  });

  const makeIdentification = (overrides: any = {}) => ({
    id: 'id-1',
    identificationCountryId: 'MX',
    identificationTypeId: 'CURP',
    identificationNumber: 'ABCD000101HDFRVN09',
    identificationExpDate: '2026-12-01',
    active: true,
    ...overrides
  });

  it('should map existent client identification', () => {
    const checkpoint = {
      identifications: [
        {
          id: 'i1',
          country: 'MX',
          identificationType: 'CURP',
          identificationNumber: 'ABCD000101HDFRVN09',
          expirationDate: '2026-12-01',
          active: true
        }
      ],
      telephones: [
        {
          id: 't1',
          type: 'CEL',
          country: 'MX',
          areaCode: '55',
          phone: '12345678',
          extension: '',
          notificationPhone: true,
          active: true
        }
      ],
      emails: [
        {
          id: 'e1',
          emailAddress: 'test@example.com',
          notificationEmail: true,
          active: true
        }
      ]
    };

    return exitentedClientToIdentificationAndContact(
      checkpoint as any,
      phoneTypes as any,
      countries as any,
      identificationTypes as any
    ).then((result: any) => {
      expect(result.identifications.length).toBe(1);
      expect(result.phones.length).toBe(1);
      expect(result.emails.length).toBe(1);
    });
  });
});
