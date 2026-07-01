import { mapToSignalAddressCustomer } from './address';
import { mapToSignalAddress } from '../response/customer-address';

describe('response/address mapper', () => {
  it('should map checkpoint addresses to signal shape', () => {
    const result = mapToSignalAddress({
      addressList: [
        {
          id: 1,
          addressType: 'HOME',
          addressRole: 'FISCAL',
          country: 'MX',
          postalCode: '01000',
          street: 'Insurgentes',
          externalNumber: '10',
          internalNumber: '2',
          federalEntity: 'CDMX',
          municipality: 'Benito Juarez',
          neighborhood: 'Del Valle',
          city: 'CDMX',
          geographicalArea: 'U',
          deliveryCenter: 'CENTER',
          timeLiveMexico: '5',
          proofOfAddressType: 'XX03',
          addressProofIssueDate: '20/05/2026',
          expirationYear: 2030,
          reasonsOpeningContractMexico: 'INVEST',
          other: 'OTHER',
          taxPostalCode: '01001',
          isAddressResidenceSameTax: true,
        },
      ],
    } as any);

    expect(result).toEqual({
      addressList: [
        jasmine.objectContaining({
          addressType: 'HOME',
          addressRole: 'FISCAL',
          federalEntity: 'CDMX',
          municipality: 'Benito Juarez',
          city: 'CDMX',
          addressProofIssueDate: '2026-05-20',
          expirationYear: '2030',
          confirmCp: 'YES',
        }),
      ],
    });
  });

  it('should map customer addresses with defaults and saved flags', () => {
    const result = mapToSignalAddressCustomer([
      {
        addressType: null,
        country: 'US',
        addressProofIssueDate: '',
        confirmCp: 'NO',
      },
    ] as any);

    expect(result.addressList).toEqual([
      jasmine.objectContaining({
        addressType: '',
        country: 'US',
        addressProofIssueDate: 'undefined-undefined-',
        confirmCp: 'NO'
      }),
    ]);
  });

  it('should return an empty address list for null customer input', () => {
    expect(mapToSignalAddressCustomer(null as any)).toEqual({ addressList: [] });
  });
});