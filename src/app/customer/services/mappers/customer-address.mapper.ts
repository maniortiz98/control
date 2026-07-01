import { CustomerAddress } from '../../models/customer-address';
import { CustomerAddresses, CustomerListAddres } from '../../models/checkpoints/customer-address-checkpoint';
import { convertDate } from '../../utils/customer-datetime';
import { DataClientAddres } from '../../models/customer-client-data';

export function mapFormToCheckPointAddress(input: Array<CustomerAddress>, isMaintenance: boolean, original: DataClientAddres | null = {
  addressList: []
}): CustomerAddresses {
  if (isMaintenance) {
    const inputIds = new Set(input.map((data: CustomerAddress) => data.id));

    const filteredOriginal = original?.addressList.filter((data: any) => {
      return !inputIds.has(data.id);
    }).map((data: any) => ({
      ...data,
      active: false,
    }));

    const combinedAddresses = [...input, ...filteredOriginal ?? []];
    console.log(combinedAddresses);
    return {
      addressList: combinedAddresses.map((data: any) => {

        let address: CustomerListAddres = {
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
          proofOfAddressType: data.proofOfAddressType === '' ? null : data.proofOfAddressType ?? null,
          addressProofIssueDate: '' + convertDate(data.addressProofIssueDate ?? ''),
          expirationYear: Number(data.expirationYear),
          reasonsOpeningContractMexico: data.reasonsOpeningContractMexico ?? '',
          other: data.other ?? '',
          taxPostalCode: data.taxPostalCode ?? '',
          isAddressResidenceSameTax: data.confirmCp?.toLowerCase() === 'yes',
          active: data.active ?? true,
        };

        if (data.addressId) {
          address.id = data.addressId;
        }else{
          address.id = null;
        }

        return address;
      }),
    };
  } else {
    return {
      addressList: input.map((data: CustomerAddress) => ({

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
        proofOfAddressType: data.proofOfAddressType === '' ? null : data.proofOfAddressType ?? null,
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









