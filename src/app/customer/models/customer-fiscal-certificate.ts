export interface CustomerFiscalCertificate {
    fiscalCertificateCve: string;
    fiscalCertificate: string;
}

export interface CustomerFiscalCertificateRequest {
    countryCve: string;
}

export type FiscalCertificate = CustomerFiscalCertificate;
export type FiscalCertificateRequest = CustomerFiscalCertificateRequest;

