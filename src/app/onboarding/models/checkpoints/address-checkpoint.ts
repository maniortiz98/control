export interface Addresses {
  addressList: Array<ListAddres>;
}

export interface ListAddres extends BasicCheckpointAddress{
  addressId?: number,
  addressAccountId?: number,
  addressType: string,
  addressRole: string,
  postalCode: string,
  city: string,
  timeLiveMexico: string,
  proofOfAddressType: string,
  addressProofIssueDate: string,
  expirationYear: number,
  reasonsOpeningContractMexico: string,
  other: string,
  taxPostalCode: string,
  isAddressResidenceSameTax: boolean
  active?: boolean;
}

export interface BasicCheckpointAddress {
  country: string,
  street: string,
  externalNumber: string,
  internalNumber: string,
  federalEntity: string,
  municipality: string,
  neighborhood: string,
  geographicalArea: string,
  deliveryCenter: string,
}
