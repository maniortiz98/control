import { FormControl } from "@angular/forms";

export interface CustomerContractChangeStatusHistory {
    contractNumber: string;
    status        : string;
    statusUpd     : string;
    userId        : string;
    requestId     : string;
    comment       : string;
    cause         : string;
    timeUpdate    : string;
}

export interface CustomerUpdateStatusBody {
    contract   : number;
    bankingArea: string;
    status     : number;
    userId     : string;
    requestId  : string;
    cause      : string;
    comment    : string;
}

export interface CustomerUpdateStatusForm {
    currentStatus: FormControl<string>;
    newStatus    : FormControl<number>;
    requestor    : FormControl<string>;
    changeCause  : FormControl<string>;
    observations : FormControl<string>;
}

export interface CustomerUpdateStatusFormValue {
    currentStatus: string;
    newStatus    : number;
    requestor    : string;
    changeCause  : string;
    observations : string;
}

export interface CustomerUpdateStatusResponse {
    contract : number;
    newStatus: string;
}
export type ContractChangeStatusHistory = CustomerContractChangeStatusHistory;
export type UpdateStatusBody = CustomerUpdateStatusBody;
export type UpdateStatusForm = CustomerUpdateStatusForm;
export type UpdateStatusFormValue = CustomerUpdateStatusFormValue;
export type UpdateStatusResponse = CustomerUpdateStatusResponse;

