import { Address, AddressCustomer, DataResAddress } from "../../../models/checkpoints/response/address";
import { DataClientAddres } from "../../../models/client-data";
import { convertDateBack, formatDateYYYYMMDD } from '../../../../shared/utils/datetime';

export function mapToSignalAddress(input: DataResAddress): DataClientAddres {
  return {
    addressList: input.addressList?.map((address: Address) => {
      return {
        addressType: address.addressType|| '',
        addressRole: address.addressRole|| '',
        country: address.country|| '',
        postalCode: address.postalCode|| '',
        street: address.street|| '',
        externalNumber: address.externalNumber|| '',
        internalNumber: address.internalNumber|| '',
        federalEntity: address.federalEntity|| '',
        municipality: address.municipality|| '',
        neighborhood: address.neighborhood|| '',
        city: address.city|| '',
        federalEntityID: address.federalEntity|| '',
        municipalityID: address.municipality|| '',
        cityID: address.city|| '',
        geographicalArea: address.geographicalArea|| '',
        deliveryCenter: address.deliveryCenter|| '',
        timeLiveMexico: address.timeLiveMexico|| '',
        proofOfAddressType: address.proofOfAddressType|| '',
        addressProofIssueDate: formatDateYYYYMMDD(address.addressProofIssueDate || ''),
        expirationYear: address.expirationYear?.toString()|| '',
        reasonsOpeningContractMexico: address.reasonsOpeningContractMexico|| '',
        other: address.other|| '',
        taxPostalCode: address.taxPostalCode|| '',
        confirmCp: address.isAddressResidenceSameTax ? 'YES':'NO',
      };
    })
  };
}

export function mapToSignalAddressCustomer(input: AddressCustomer[] | null): DataClientAddres {
  console.log(input);
  return {
    addressList: input?.map((address: AddressCustomer) => {
      return {
        addressType: address.addressType|| '',
        addressRole: address.addressRole|| '',
        country: address.country|| '',
        postalCode: address.postalCode|| '',
        street: address.street|| '',
        externalNumber: address.externalNumber|| '',
        internalNumber: address.internalNumber|| '',
        federalEntity: address.federalEntity|| '',
        municipality: address.municipality|| '',
        neighborhood: address.neighborhood|| '',
        city: address.city|| '',
        federalEntityID: address.federalEntity|| '',
        municipalityID: address.municipality|| '',
        cityID: address.city|| '',
        geographicalArea: address.geographicalArea|| '',
        deliveryCenter: address.deliveryCenter|| '',
        timeLiveMexico: address.timeLiveMexico|| '',
        proofOfAddressType: address.proofOfAddressType|| '',
        addressProofIssueDate: formatDateYYYYMMDD(address.addressProofIssueDate || ''),
        expirationYear: address.expirationYear?.toString()|| '',
        reasonsOpeningContractMexico: address.reasonsOpeningContractMexico|| '',
        other: address.other|| '',
        taxPostalCode: address.taxPostalCode|| '',
        confirmCp: address.isAddressResidenceSameTax ? 'YES':'NO',
      };
    }) ?? []
  };
}
