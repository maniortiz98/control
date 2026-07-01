export interface CustomerAccountDocumentKitRequest {
  personTypeId: string;
  subContractTypeId: number;
  contractTypeIde: number;
}

export interface CustomerAccountDocumentKit {
  accountDocumentKitId: string,
  kitDocumentName: string,
  bankingArea: string,
  contractType: string,
  subTypeContract: string,
  typeOfPerson: string
}

export type AccountDocumentKitRequest = CustomerAccountDocumentKitRequest;
export type AccountDocumentKit = CustomerAccountDocumentKit;

