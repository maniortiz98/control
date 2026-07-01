export interface CustomerAddresses {
  addressList: Array<CustomerListAddres>;
}

export interface CustomerListAddres extends CustomerBasicCheckpointAddress{
  id?: string | null,
  addressAccountId?: number,
  addressType: string,
  addressRole: string,
  postalCode: string,
  city: string,
  timeLiveMexico: string,
  proofOfAddressType: string | null,
  addressProofIssueDate: string,
  expirationYear: number,
  reasonsOpeningContractMexico: string,
  other: string,
  taxPostalCode: string,
  isAddressResidenceSameTax: boolean
  active?: boolean;
}

export interface CustomerBasicCheckpointAddress {
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

export type Addresses = CustomerAddresses;
export type ListAddres = CustomerListAddres;
export type BasicCheckpointAddress = CustomerBasicCheckpointAddress;

