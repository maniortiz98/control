export interface Address {
  id?: string | number,
  idFront?: string,
  addressId?: number,
  addressAccountId?: number,
  addressRole?: string,
  addressType: string,
  other?: string,
  country: string,
  postalCode: string,
  federalEntity: string,
  city: string,
  municipality: string,
  neighborhood: string,
  street: string,
  externalNumber: string,
  internalNumber?: string,
  confirmCp?: string,
  timeLiveMexico?: string,
  reasonsOpeningContractMexico?: string,
  proofOfAddressType?: string,
  addressProofIssueDate?: string,
  expirationYear?: string,
  taxPostalCode?: string,
  geographicalArea?: string,
  deliveryCenter?: string,
  neighborhoodName?: string,
  addressConcatenation?: string,
  federalEntityID?: string,
  cityID?: string,
  municipalityID?: string,
  isSaved?: boolean,
  isView?: boolean,
  active?: boolean,
  isAddressResidenceSameTax?: boolean | null;
}

export interface AddressType {
  addressTypeId: string,
  addressType: string
}

export interface ProofOfAddressType {
  mandt: string;
  spras: string;
  proofAddressId: string;
  personTypeId: string;
  proofAddress: string;
}

export interface AddressTypeRequest {
  addressTypeIds: string[];
}

export interface ProofOfAddressTypeRequest {
  proofAddressIds: string[];
}

export interface ProofOfAddressTypeResponse {
  status: number;
  payload: {
    errorMsg: {
      items: {
        messageType: string;
        category: string;
        code: string;
        message: string;
        shortDescription: string;
      }[]
    },
    status: number;
    proofOfAddressType: {
      item: ProofOfAddressType[]
    }
  },
  messages: string[];
}

export interface AddressRole {
  idRolDomicilio: string,
  idRolDomicilioCve: string,
  rolDomicilio: string
}

export interface AddressRoleRequest {
  idRolDomicilioCve: string[];
}
