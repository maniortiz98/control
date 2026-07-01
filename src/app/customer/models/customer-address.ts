export interface CustomerAddress {
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

export interface CustomerAddressType {
  addressTypeId: string,
  addressType: string
}

export interface CustomerProofOfAddressType {
  mandt: string;
  spras: string;
  proofAddressId: string;
  personTypeId: string;
  proofAddress: string;
}

export interface CustomerAddressTypeRequest {
  addressTypeIds: string[];
}

export interface CustomerProofOfAddressTypeRequest {
  proofAddressIds: string[];
}

export interface CustomerProofOfAddressTypeResponse {
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
      item: CustomerProofOfAddressType[]
    }
  },
  messages: string[];
}

export interface CustomerAddressRole {
  idRolDomicilio: string,
  idRolDomicilioCve: string,
  rolDomicilio: string
}

export interface CustomerAddressRoleRequest {
  idRolDomicilioCve: string[];
}



export type Address = CustomerAddress;
export type AddressType = CustomerAddressType;
export type ProofOfAddressType = CustomerProofOfAddressType;
export type AddressTypeRequest = CustomerAddressTypeRequest;
export type ProofOfAddressTypeRequest = CustomerProofOfAddressTypeRequest;
export type ProofOfAddressTypeResponse = CustomerProofOfAddressTypeResponse;
export type AddressRole = CustomerAddressRole;
export type AddressRoleRequest = CustomerAddressRoleRequest;

