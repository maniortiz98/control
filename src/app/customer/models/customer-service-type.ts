export interface CustomerServiceType {
    serviceTypeCve: string;
    serviceType: string;
}

export interface CustomerServiceTypeRequest {
    serviceTypeCve: string[];
}
export type ServiceType = CustomerServiceType;
export type ServiceTypeRequest = CustomerServiceTypeRequest;

