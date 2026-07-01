export interface AccountDocumentKitRequest {
  personTypeId: string;
  subContractTypeId: number;
  contractTypeIde: number;
}

export interface AccountDocumentKit {
  accountDocumentKitId: string,
  kitDocumentName: string,
  bankingArea: string,
  contractType: string,
  subTypeContract: string,
  typeOfPerson: string
}
