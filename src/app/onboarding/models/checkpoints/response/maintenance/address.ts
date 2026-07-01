export interface Address {
    addressId: number,
    addressAccountId: number,
    addressType: string | null;
    addressRole: string | null;
    country: string | null;
    postalCode: string | null;
    street: string | null;
    externalNumber: string | null;
    internalNumber: string | null;
    federalEntity: string | null;
    municipality: string | null;
    neighborhood: string | null;
    city: string | null;
    geographicalArea: string | null;
    deliveryCenter: string | null;
    timeLiveMexico: string | null;
    proofOfAddressType: string | null;
    addressProofIssueDate: string | null;
    expirationYear: number | null;
    reasonsOpeningContractMexico: string | null;
    other: string | null;
    taxPostalCode: string | null;
    isAddressResidenceSameTax: boolean | null;
    active: boolean | null;
}

export interface DataResAddressM {
    addressList: Address[];
}