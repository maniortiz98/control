import { Address } from '../../../onboarding/models/address';
import { Addresses, ListAddres } from '../../../onboarding/models/checkpoints/address-checkpoint';
import { convertDate } from '../../../shared/utils/datetime';
import { DataClientAddres } from '../../models/client-data';
export function mapFormToCheckPointAddress(input: Array<Address>, isMaintenance: boolean, original: DataClientAddres | null = {
  addressList: []
}): Addresses {
  if (isMaintenance) {
    const inputIds = new Set(input.map((data) => data.id));

    const filteredOriginal = original?.addressList.filter((data) => {
      return !inputIds.has(data.id);
    }).map((data) => ({
      ...data,
      active: false,
    }));

    const combinedAddresses = [...input, ...filteredOriginal ?? []];
    console.log(combinedAddresses);
    return {
      addressList: combinedAddresses.map((data) => {
        let address: ListAddres = {
          addressType: data.addressType,
          addressRole: data.addressRole ?? '',
          country: data.country,
          postalCode: data.postalCode,
          street: data.street,
          externalNumber: data.externalNumber,
          internalNumber: data.internalNumber ?? '',
          federalEntity:
            data.country === 'MX' ? (data.federalEntityID || '') : data.federalEntity,
          municipality:
            data.country === 'MX' ? (data.municipalityID || '') : data.municipality,
          neighborhood: data.neighborhood,
          city: data.country === 'MX' ? (data.cityID || '') : data.city,
          geographicalArea: data.geographicalArea ?? '',
          deliveryCenter: data.deliveryCenter ?? '',
          timeLiveMexico: data.timeLiveMexico ?? '',
          proofOfAddressType: data.proofOfAddressType ?? '',
          addressProofIssueDate: '' + convertDate(data.addressProofIssueDate ?? ''),
          expirationYear: Number(data.expirationYear),
          reasonsOpeningContractMexico: data.reasonsOpeningContractMexico ?? '',
          other: data.other ?? '',
          taxPostalCode: data.taxPostalCode ?? '',
          isAddressResidenceSameTax: data.confirmCp?.toLowerCase() === 'yes',
          active: data.active ?? true,
        };

        if (data.addressId) {
          address.addressId = data.addressId;
        }

        if (data.addressAccountId) {
          address.addressAccountId = data.addressAccountId;
        }

        return address;
      }),
    };
  } else {
    return {
      addressList: input.map((data) => ({
        addressType: data.addressType,
        addressRole: data.addressRole ?? '',
        country: data.country,
        postalCode: data.postalCode,
        street: data.street,
        externalNumber: data.externalNumber,
        internalNumber: data.internalNumber ?? '',
        federalEntity:
          data.country === 'MX' ? data.federalEntityID || '' : data.federalEntity,
        municipality:
          data.country === 'MX' ? data.municipalityID || '' : data.municipality,
        neighborhood: data.neighborhood,
        city: data.country === 'MX' ? data.cityID || '' : data.city,
        geographicalArea: data.geographicalArea ?? '',
        deliveryCenter: data.deliveryCenter ?? '',
        timeLiveMexico: data.timeLiveMexico ?? '',
        proofOfAddressType: data.proofOfAddressType ?? '',
        addressProofIssueDate: '' + convertDate(data.addressProofIssueDate ?? ''),
        expirationYear: Number(data.expirationYear),
        reasonsOpeningContractMexico: data.reasonsOpeningContractMexico ?? '',
        other: data.other ?? '',
        taxPostalCode: data.taxPostalCode ?? '',
        isAddressResidenceSameTax: data.confirmCp?.toLowerCase() === 'yes',
      })),
    };
  }
}
