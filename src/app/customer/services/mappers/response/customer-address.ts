import { CustomerAddress, DataResAddress } from "../../../models/checkpoints/response/customer-address";
import { DataClientAddres } from '../../../models/customer-client-data';
import { convertDateBack, formatDateYYYYMMDD } from '../../../utils/customer-datetime';

export function mapToSignalAddress(input: DataResAddress): DataClientAddres {
  return {
    addressList: input.addressList?.map((address: CustomerAddress) => {
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





