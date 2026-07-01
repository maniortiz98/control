export interface CustomerTaxId {
    idIdentificacionfiscalCve: string;
    identificacionFiscal: string;
}

export interface CustomerTaxIdRequest {
    idIdentificacionfiscalCve: string[];
}
export type TaxId = CustomerTaxId;
export type TaxIdRequest = CustomerTaxIdRequest;

