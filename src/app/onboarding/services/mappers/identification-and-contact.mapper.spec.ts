import {
  identificationAndContactToCheckpoint,
  checkpointToIdentificationAndContact,
  exitentedClientToIdentificationAndContact,
  exitentedToIdentificationAndContact
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

  it('should map identification and contact to checkpoint', () => {
    const input = {
      identifications: [makeIdentification()],
      manifestLetter: true,
      phones: [makePhone()],
      emails: [makeEmail()]
    };

    const result = identificationAndContactToCheckpoint(input as any);

    expect(result.identifications.length).toBe(1);
    expect(result.identifications[0]).toEqual(jasmine.objectContaining({
      country: 'MX',
      identificationNumber: 'ABCD000101HDFRVN09',
      identificationType: 'CURP'
    }));
    expect(result.telephones.length).toBe(1);
    expect(result.emails.length).toBe(1);
  });

  it('should filter and map active phones and emails', () => {
    const input = {
      identifications: [makeIdentification()],
      manifestLetter: false,
      phones: [
        makePhone({ phone: '11111111', active: true }),
        makePhone({ phone: '22222222', active: false })
      ],
      emails: [
        makeEmail({ mail: 'active@test.com', active: true }),
        makeEmail({ mail: 'inactive@test.com', active: false })
      ]
    };

    const result = identificationAndContactToCheckpoint(input as any);

    expect(result.telephones.length).toBe(1);
    expect(result.telephones[0].phone).toBe('11111111');
    expect(result.emails.length).toBe(1);
    expect(result.emails[0].emailAddress).toBe('active@test.com');
  });

  it('should handle empty phones and emails in checkpoint mapper', () => {
    const input = {
      identifications: [makeIdentification()],
      manifestLetter: false,
      phones: [],
      emails: []
    };

    const result = identificationAndContactToCheckpoint(input as any);

    expect(result.telephones.length).toBe(0);
    expect(result.emails.length).toBe(0);
  });

  it('should map checkpoint back to form structure', async () => {
    const checkpoint = {
      manifestLetter: true,
      identifications: [
        {
          country: 'MX',
          identificationType: 'CURP',
          identificationNumber: 'ABCD000101HDFRVN09',
          expirationDate: '2026-12-01'
        }
      ],
      telephones: [
        {
          type: 'CEL',
          country: 'MX',
          areaCode: '55',
          phone: '12345678',
          extension: '',
          notificationPhone: true
        }
      ],
      emails: [
        {
          emailAddress: 'test@example.com',
          notificationEmail: true
        }
      ]
    };

    const result = await checkpointToIdentificationAndContact(
      checkpoint as any,
      phoneTypes as any,
      countries as any,
      identificationTypes as any
    );

    expect(result.identifications.length).toBe(1);
    expect(result.phones.length).toBe(1);
    expect(result.emails.length).toBe(1);
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
      expect(result.identifications[0].isSaved).toBe(true);
      expect(result.phones.length).toBe(1);
      expect(result.emails.length).toBe(1);
    });
  });

  it('should map existent customer response for telephones and emails', async () => {
    const response = {
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

    const result = await exitentedToIdentificationAndContact(
      response as any,
      phoneTypes as any,
      countries as any,
      identificationTypes as any
    );

    expect(result.identifications.length).toBe(1);
    expect(result.phones.length).toBe(1);
    expect(result.emails.length).toBe(1);
  });
});
