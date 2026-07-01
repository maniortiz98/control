export interface CustomerServiceSubtypeRequest {
    serviceTypeCve: string;
}

export interface CustomerServiceSubtype {
    serviceSubTypeCve: string;
    serviceSubType: string;
}
export type ServiceSubtypeRequest = CustomerServiceSubtypeRequest;
export type ServiceSubtype = CustomerServiceSubtype;

