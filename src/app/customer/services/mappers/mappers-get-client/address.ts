import { AddressCustomer } from "../../../models/checkpoints/response/customer-address";
import { DataClientAddres } from "../../../models/customer-client-data";
import { formatDateYYYYMMDD } from "../../../utils/customer-datetime";

export function mapToSignalAddressCustomer(input: AddressCustomer[] | null): DataClientAddres {
  console.log(input);
  return {
    addressList: input?.map((address: AddressCustomer) => {
      return {
        id: crypto.randomUUID(),
        addressId: address.addressId ?? undefined,
        addressAccountId: address.addressAccountId ?? undefined,
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
        active: address.active ?? true,
      };
    }) ?? []
  };
}
