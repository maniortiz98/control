export interface CustomerSignatureType {
    signatureId: string;
    signatureType: string;
}

export interface CustomerSignatureTypeRequest {
    signatureTypeIds: string[];
}

export type SignatureType = CustomerSignatureType;
export type SignatureTypeRequest = CustomerSignatureTypeRequest;

