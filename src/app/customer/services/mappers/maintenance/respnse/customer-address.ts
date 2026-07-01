import { CustomerAddress, DataResAddressM } from "../../../../models/checkpoints/response/maintenance/customer-address";
import { DataClientAddres } from '../../../../models/customer-client-data';


export function mapToSignalAddressM(input: DataResAddressM): DataClientAddres {
  return {
    addressList: input.addressList?.map((address: CustomerAddress) => {
      return {
        id: crypto.randomUUID(),
        addressId: address.addressId,
        addressAccountId: address.addressAccountId,
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
        addressProofIssueDate: address.addressProofIssueDate|| '',
        expirationYear: address.expirationYear?.toString()|| '',
        reasonsOpeningContractMexico: address.reasonsOpeningContractMexico|| '',
        other: address.other|| '',
        taxPostalCode: address.taxPostalCode|| '',
        isAddressResidenceSameTax: address.isAddressResidenceSameTax,
        active: address.active ?? true, // Puede que la cambien es el borrado logico 
      };
    })
  };
}






