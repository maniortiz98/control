export interface CustomerDocumentType {
  documentTypeId: string,
  documentType: string,
}

export interface CustomerDocumentTypeRequest {
  documentTypeIds: string[],
}

export type DocumentType = CustomerDocumentType;
export type DocumentTypeRequest = CustomerDocumentTypeRequest;

