import { mapToSignalAddressM } from './address';
import {
  Address,
  DataResAddressM,
} from '../../../../models/checkpoints/response/maintenance/address';

describe('mapToSignalAddressM', () => {
  const mockUUID: `${string}-${string}-${string}-${string}-${string}` =
    '123e4567-e89b-12d3-a456-426614174000';

  beforeEach(() => {
    if (!globalThis.crypto) {
      Object.defineProperty(globalThis, 'crypto', {
        value: {},
        configurable: true,
      });
    }

    if (!globalThis.crypto.randomUUID) {
      Object.defineProperty(globalThis.crypto, 'randomUUID', {
        value: () => mockUUID,
        configurable: true,
      });
    }

    spyOn(globalThis.crypto, 'randomUUID').and.returnValue(mockUUID);
  });

  it('debe mapear correctamente una dirección con todos los campos informados', () => {
    const input: DataResAddressM = {
      addressList: [
        {
          addressId: 1,
          addressAccountId: 1001,
          addressType: 'HOME',
          addressRole: 'PRIMARY',
          country: 'MX',
          postalCode: '01000',
          street: 'Av Siempre Viva',
          externalNumber: '742',
          internalNumber: 'A',
          federalEntity: 'CDMX',
          municipality: 'Álvaro Obregón',
          neighborhood: 'San Ángel',
          city: 'Ciudad de México',
          geographicalArea: 'URBANA',
          deliveryCenter: 'CENTER-1',
          timeLiveMexico: '10',
          proofOfAddressType: 'INE',
          addressProofIssueDate: '2024-01-01',
          expirationYear: 2030,
          reasonsOpeningContractMexico: 'Trabajo',
          other: 'Otro dato',
          taxPostalCode: '01001',
          isAddressResidenceSameTax: true,
          active: false,
        } as Address,
      ],
    };

    const result = mapToSignalAddressM(input);

    expect(globalThis.crypto.randomUUID).toHaveBeenCalledTimes(1);

    expect(result).toEqual({
      addressList: [
        {
          id: mockUUID,
          addressId: 1,
          addressAccountId: 1001,
          addressType: 'HOME',
          addressRole: 'PRIMARY',
          country: 'MX',
          postalCode: '01000',
          street: 'Av Siempre Viva',
          externalNumber: '742',
          internalNumber: 'A',
          federalEntity: 'CDMX',
          municipality: 'Álvaro Obregón',
          neighborhood: 'San Ángel',
          city: 'Ciudad de México',
          federalEntityID: 'CDMX',
          municipalityID: 'Álvaro Obregón',
          cityID: 'Ciudad de México',
          geographicalArea: 'URBANA',
          deliveryCenter: 'CENTER-1',
          timeLiveMexico: '10',
          proofOfAddressType: 'INE',
          addressProofIssueDate: '2024-01-01',
          expirationYear: '2030',
          reasonsOpeningContractMexico: 'Trabajo',
          other: 'Otro dato',
          taxPostalCode: '01001',
          confirmCp: 'YES',
          active: false,
        },
      ],
    });
  });

  it('debe asignar strings vacíos cuando los campos opcionales vienen null', () => {
    const input: DataResAddressM = {
      addressList: [
        {
          addressId: 2,
          addressAccountId: 1002,
          addressType: null,
          addressRole: null,
          country: null,
          postalCode: null,
          street: null,
          externalNumber: null,
          internalNumber: null,
          federalEntity: null,
          municipality: null,
          neighborhood: null,
          city: null,
          geographicalArea: null,
          deliveryCenter: null,
          timeLiveMexico: null,
          proofOfAddressType: null,
          addressProofIssueDate: null,
          expirationYear: null,
          reasonsOpeningContractMexico: null,
          other: null,
          taxPostalCode: null,
          isAddressResidenceSameTax: false,
          active: null,
        } as Address,
      ],
    };

    const result = mapToSignalAddressM(input);

    expect(result).toEqual({
      addressList: [
        {
          id: mockUUID,
          addressId: 2,
          addressAccountId: 1002,
          addressType: '',
          addressRole: '',
          country: '',
          postalCode: '',
          street: '',
          externalNumber: '',
          internalNumber: '',
          federalEntity: '',
          municipality: '',
          neighborhood: '',
          city: '',
          federalEntityID: '',
          municipalityID: '',
          cityID: '',
          geographicalArea: '',
          deliveryCenter: '',
          timeLiveMexico: '',
          proofOfAddressType: '',
          addressProofIssueDate: '',
          expirationYear: '',
          reasonsOpeningContractMexico: '',
          other: '',
          taxPostalCode: '',
          confirmCp: 'NO',
          active: true,
        },
      ],
    });
  });


  it('debe usar strings vacíos cuando los campos vienen como string vacío', () => {
    const input: DataResAddressM = {
      addressList: [
        {
          addressId: 3,
          addressAccountId: 1003,
          addressType: '',
          addressRole: '',
          country: '',
          postalCode: '',
          street: '',
          externalNumber: '',
          internalNumber: '',
          federalEntity: '',
          municipality: '',
          neighborhood: '',
          city: '',
          geographicalArea: '',
          deliveryCenter: '',
          timeLiveMexico: '',
          proofOfAddressType: '',
          addressProofIssueDate: '',
          expirationYear: null,
          reasonsOpeningContractMexico: '',
          other: '',
          taxPostalCode: '',
          isAddressResidenceSameTax: false,
          active: true,
        } as Address,
      ],
    };

    const result = mapToSignalAddressM(input);

    expect(result).toEqual({
      addressList: [
        {
          id: mockUUID,
          addressId: 3,
          addressAccountId: 1003,
          addressType: '',
          addressRole: '',
          country: '',
          postalCode: '',
          street: '',
          externalNumber: '',
          internalNumber: '',
          federalEntity: '',
          municipality: '',
          neighborhood: '',
          city: '',
          federalEntityID: '',
          municipalityID: '',
          cityID: '',
          geographicalArea: '',
          deliveryCenter: '',
          timeLiveMexico: '',
          proofOfAddressType: '',
          addressProofIssueDate: '',
          expirationYear: '',
          reasonsOpeningContractMexico: '',
          other: '',
          taxPostalCode: '',
          confirmCp: 'NO',
          active: true,
        },
      ],
    });
  });

  it('debe retornar addressList undefined cuando input.addressList es undefined', () => {
    const input: DataResAddressM = {
      addressList: [],
    };

    const result = mapToSignalAddressM(input);

    expect(result).toEqual({
      addressList: [],
    });

    expect(globalThis.crypto.randomUUID).not.toHaveBeenCalled();
  });

  it('debe retornar un array vacío cuando input.addressList es un array vacío', () => {
    const input: DataResAddressM = {
      addressList: [],
    };

    const result = mapToSignalAddressM(input);

    expect(result).toEqual({
      addressList: [],
    });

    expect(globalThis.crypto.randomUUID).not.toHaveBeenCalled();
  });

  it('debe asignar confirmCp en YES cuando isAddressResidenceSameTax es true', () => {
    const input: DataResAddressM = {
      addressList: [
        {
          addressId: 4,
          addressAccountId: 1004,
          isAddressResidenceSameTax: true,
          active: true,
        } as Address,
      ],
    };

    const result = mapToSignalAddressM(input);

    expect(result.addressList?.[0].confirmCp).toBe('YES');
  });

  it('debe asignar confirmCp en NO cuando isAddressResidenceSameTax es false', () => {
    const input: DataResAddressM = {
      addressList: [
        {
          addressId: 5,
          addressAccountId: 1005,
          isAddressResidenceSameTax: false,
          active: true,
        } as Address,
      ],
    };

    const result = mapToSignalAddressM(input);

    expect(result.addressList?.[0].confirmCp).toBe('NO');
  });
  const createAddress = (
    overrides: Partial<Address> = {}
  ): Address => {
    return {
      addressId: 1,
      addressAccountId: 1001,
      addressType: null,
      addressRole: null,
      country: null,
      postalCode: null,
      street: null,
      externalNumber: null,
      internalNumber: null,
      federalEntity: null,
      municipality: null,
      neighborhood: null,
      city: null,
      geographicalArea: null,
      deliveryCenter: null,
      timeLiveMexico: null,
      proofOfAddressType: null,
      addressProofIssueDate: null,
      expirationYear: null,
      reasonsOpeningContractMexico: null,
      other: null,
      taxPostalCode: null,
      isAddressResidenceSameTax: false,
      active: true,
      ...overrides,
    } as Address;
  };

  it('debe asignar active en true cuando active viene undefined', () => {
    const address = {
      ...createAddress({
        addressId: 6,
        addressAccountId: 1006,
      }),
      active: undefined,
    } as unknown as Address;

    const input: DataResAddressM = {
      addressList: [address],
    };

    const result = mapToSignalAddressM(input);

    expect(result.addressList?.[0].active).toBeTrue();
  });


  it('debe mantener active en false cuando active viene false', () => {
    const input: DataResAddressM = {
      addressList: [
        {
          addressId: 7,
          addressAccountId: 1007,
          isAddressResidenceSameTax: false,
          active: false,
        } as Address,
      ],
    };

    const result = mapToSignalAddressM(input);

    expect(result.addressList?.[0].active).toBeFalse();
  });

  it('debe mantener active en true cuando active viene true', () => {
    const input: DataResAddressM = {
      addressList: [
        {
          addressId: 8,
          addressAccountId: 1008,
          isAddressResidenceSameTax: false,
          active: true,
        } as Address,
      ],
    };

    const result = mapToSignalAddressM(input);

    expect(result.addressList?.[0].active).toBeTrue();
  });

  it('debe convertir expirationYear a string cuando viene informado', () => {
    const input: DataResAddressM = {
      addressList: [
        {
          addressId: 9,
          addressAccountId: 1009,
          expirationYear: 2028,
          isAddressResidenceSameTax: false,
          active: true,
        } as Address,
      ],
    };

    const result = mapToSignalAddressM(input);

    expect(result.addressList?.[0].expirationYear).toBe('2028');
  });

  it('debe asignar expirationYear vacío cuando viene null', () => {
    const input: DataResAddressM = {
      addressList: [
        {
          addressId: 10,
          addressAccountId: 1010,
          addressType: null,
          addressRole: null,
          country: null,
          postalCode: null,
          street: null,
          externalNumber: null,
          internalNumber: null,
          federalEntity: null,
          municipality: null,
          neighborhood: null,
          city: null,
          geographicalArea: null,
          deliveryCenter: null,
          timeLiveMexico: null,
          proofOfAddressType: null,
          addressProofIssueDate: null,
          expirationYear: null,
          reasonsOpeningContractMexico: null,
          other: null,
          taxPostalCode: null,
          isAddressResidenceSameTax: false,
          active: true,
        } as Address,
      ],
    };

    const result = mapToSignalAddressM(input);

    expect(result.addressList?.[0].expirationYear).toBe('');
  });


  it('debe generar un id por cada dirección usando crypto.randomUUID', () => {
    const input: DataResAddressM = {
      addressList: [
        {
          addressId: 11,
          addressAccountId: 1011,
          isAddressResidenceSameTax: true,
          active: true,
        } as Address,
        {
          addressId: 12,
          addressAccountId: 1012,
          isAddressResidenceSameTax: false,
          active: false,
        } as Address,
      ],
    };

    const result = mapToSignalAddressM(input);

    expect(globalThis.crypto.randomUUID).toHaveBeenCalledTimes(2);
    expect(result.addressList?.length).toBe(2);
    expect(result.addressList?.[0].id).toBe(mockUUID);
    expect(result.addressList?.[1].id).toBe(mockUUID);
    expect(result.addressList?.[0].addressId).toBe(11);
    expect(result.addressList?.[0].addressAccountId).toBe(1011);
    expect(result.addressList?.[1].addressId).toBe(12);
    expect(result.addressList?.[1].addressAccountId).toBe(1012);
  });
});
