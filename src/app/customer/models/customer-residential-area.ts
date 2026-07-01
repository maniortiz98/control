export interface CustomerResidentialArea {
    residentialAreaId: string;
    residentialArea: string;
}

export interface CustomerResidentialAreaRequest {
    residentialAreaIds: string[];
}
export type ResidentialArea = CustomerResidentialArea;
export type ResidentialAreaRequest = CustomerResidentialAreaRequest;

