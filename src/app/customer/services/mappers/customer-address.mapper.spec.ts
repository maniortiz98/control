import { mapFormToCheckPointAddress } from './customer-address.mapper';
import * as dateUtils from '../../utils/customer-datetime';

describe('mapFormToCheckPointAddress', () => {

  const baseAddress = (overrides?: any) => ({
    id: '1',
    addressType: 'HOME',
    addressRole: 'ROLE',
    country: 'MX',
    postalCode: '20000',
    street: 'Street',
    externalNumber: '1',
    internalNumber: '1',
    federalEntityID: 'AGS',
    municipalityID: 'AGS',
    cityID: 'AGS',
    federalEntity: 'AGS',
    municipality: 'AGS',
    city: 'AGS',
    neighborhood: 'COL',
    proofOfAddressType: 'TYPE',
    addressProofIssueDate: '2024-01-01',
    expirationYear: '2025',
    confirmCp: 'YES',
    taxPostalCode: '20000',
    active: true,
    ...overrides
  });



  it('convierte fecha correctamente', () => {
    const input = [
      baseAddress({ addressProofIssueDate: '2024-01-01' })
    ];

    const result = mapFormToCheckPointAddress(input, false);

    expect(result.addressList[0].addressProofIssueDate).toBeTruthy();
  });



  describe('sin mantenimiento', () => {

    it('mapea correctamente lista', () => {
      const input = [baseAddress()];

      const result = mapFormToCheckPointAddress(input, false);

      expect(result.addressList.length).toBe(1);

      const item = result.addressList[0];

      expect(item.addressType).toBe('HOME');
      expect(item.federalEntity).toBe('AGS');
      expect(item.addressProofIssueDate).toBe('01/01/2024');
      expect(item.expirationYear).toBe(2025);
      expect(item.isAddressResidenceSameTax).toBeTrue();
    });

    it('maneja país distinto de MX', () => {
      const input = [
        baseAddress({
          country: 'US',
          federalEntity: 'TX',
          municipality: 'T',
          city: 'C'
        })
      ];

      const result = mapFormToCheckPointAddress(input, false);

      const item = result.addressList[0];

      expect(item.federalEntity).toBe('TX');
      expect(item.city).toBe('C');
    });

    it('proofOfAddressType vacío se vuelve null', () => {
      const input = [
        baseAddress({ proofOfAddressType: '' })
      ];

      const result = mapFormToCheckPointAddress(input, false);

      expect(result.addressList[0].proofOfAddressType).toBeNull();
    });

  });

  describe('con mantenimiento', () => {

    it('agrega active false a registros eliminados', () => {
      const input = [baseAddress({ id: '1' })];

      const original = {
        addressList: [
          { id: '2', addressType: 'OLD' }
        ]
      } as any;

      const result = mapFormToCheckPointAddress(input, true, original);

      expect(result.addressList.length).toBe(2);

      const removed = result.addressList.find((x: any) => x.addressType === 'OLD');

      expect(removed).toBeDefined();
      expect(removed?.active).toBeFalse();
    });

    it('conserva active true si no se define', () => {
      const input = [baseAddress()];

      const result = mapFormToCheckPointAddress(input, true, { addressList: [] });

      expect(result.addressList[0].active).toBeTrue();
    });

    it('mapea id correctamente', () => {
      const input = [
        baseAddress({ addressId: '123' })
      ];

      const result = mapFormToCheckPointAddress(input, true, { addressList: [] });

      expect(result.addressList[0].id).toBe('123');
    });

    it('pone id null si no existe addressId', () => {
      const input = [baseAddress({ addressId: null })];

      const result = mapFormToCheckPointAddress(input, true, { addressList: [] });

      expect(result.addressList[0].id).toBeNull();
    });

    it('mergea input + original correctamente', () => {
      const input = [baseAddress({ id: '1' })];

      const original = {
        addressList: [
          baseAddress({ id: '2' })
        ]
      } as any;

      const result = mapFormToCheckPointAddress(input, true, original);

      expect(result.addressList.length).toBe(2);
    });

  });

});