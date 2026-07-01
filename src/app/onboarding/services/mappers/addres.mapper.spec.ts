import { mapFormToCheckPointAddress } from './addres.mapper';

describe('Address Mapper (addres.mapper)', () => {

  const makeAddress = (overrides: any = {}) => ({
    id: 'addr-1',
    addressType: 'DOMICILIO',
    country: 'MX',
    postalCode: '28001',
    street: 'Calle Principal',
    externalNumber: '123',
    internalNumber: '456',
    federalEntity: 'CDMX',
    federalEntityID: '09',
    municipality: 'Cuauhtémoc',
    municipalityID: '010',
    city: 'Mexico',
    cityID: '01',
    neighborhood: 'Centro',
    addressProofIssueDate: '01/01/2025',
    confirmCp: 'YES',
    active: true,
    ...overrides
  });

  it('should map single address for onboarding mode', () => {
    const input = [makeAddress()];
    const result = mapFormToCheckPointAddress(input as any, false);

    expect(result.addressList.length).toBe(1);
    expect(result.addressList[0]).toEqual(jasmine.objectContaining({
      addressType: 'DOMICILIO',
      country: 'MX',
      street: 'Calle Principal',
      federalEntity: '09',
      municipality: '010',
      city: '01',
      neighborhood: 'Centro',
      isAddressResidenceSameTax: true
    }));
  });

  it('should map international address with fedEntity/city as strings', () => {
    const input = [makeAddress({
      country: 'USA',
      federalEntity: 'California',
      municipality: 'Los Angeles',
      city: 'Los Angeles'
    })];
    const result = mapFormToCheckPointAddress(input as any, false);

    expect(result.addressList[0].country).toBe('USA');
    expect(result.addressList[0].federalEntity).toBe('California');
  });

  it('should set isAddressResidenceSameTax based on confirmCp field', () => {
    const input1 = [makeAddress({ confirmCp: 'YES' })];
    const input2 = [makeAddress({ confirmCp: 'no' })];

    expect(mapFormToCheckPointAddress(input1 as any, false).addressList[0].isAddressResidenceSameTax).toBe(true);
    expect(mapFormToCheckPointAddress(input2 as any, false).addressList[0].isAddressResidenceSameTax).toBe(false);
  });

  it('should mark deleted addresses as inactive in maintenance mode', () => {
    const newAddresses = [makeAddress({ id: 'addr-1' })];
    const original = {
      addressList: [
        makeAddress({ id: 'addr-1' }),
        makeAddress({ id: 'addr-2' })
      ]
    };

    const result = mapFormToCheckPointAddress(newAddresses as any, true, original as any);

    const activeCount = result.addressList.filter((a: any) => a.active === true).length;
    const inactiveCount = result.addressList.filter((a: any) => a.active === false).length;
    expect(activeCount).toBe(1);
    expect(inactiveCount).toBe(1);
  });
});
