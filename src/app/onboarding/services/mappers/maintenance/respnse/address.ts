import { Address, DataResAddressM } from "../../../../models/checkpoints/response/maintenance/address";
import { DataClientAddres } from "../../../../models/client-data";


export function mapToSignalAddressM(input: DataResAddressM): DataClientAddres {
  return {
    addressList: input.addressList?.map((address: Address) => {
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
        federalEntityID: address.federalEntity|| '',
        municipalityID: address.municipality|| '',
        cityID: address.city|| '',
        geographicalArea: address.geographicalArea|| '',
        deliveryCenter: address.deliveryCenter|| '',
        timeLiveMexico: address.timeLiveMexico|| '',
        proofOfAddressType: address.proofOfAddressType|| '',
        addressProofIssueDate: address.addressProofIssueDate|| '',
        expirationYear: address.expirationYear?.toString()|| '',
        reasonsOpeningContractMexico: address.reasonsOpeningContractMexico|| '',
        other: address.other|| '',
        taxPostalCode: address.taxPostalCode|| '',
        confirmCp: address.isAddressResidenceSameTax ? 'YES':'NO',
        active: address.active ?? true, // Puede que la cambien es el borrado logico 
      };
    })
  };
}
