import { FormControl } from "@angular/forms";

export interface ContractChangeStatusHistory {
    contractNumber: string;
    status        : string;
    statusUpd     : string;
    userId        : string;
    requestId     : string;
    comment       : string;
    cause         : string;
    timeUpdate    : string;
}

export interface UpdateStatusBody {
    contract   : number;
    bankingArea: string;
    status     : number;
    userId     : string;
    requestId  : string;
    cause      : string;
    comment    : string;
}

export interface UpdateStatusForm {
    currentStatus: FormControl<string>;
    newStatus    : FormControl<number>;
    requestor    : FormControl<string>;
    changeCause  : FormControl<string>;
    observations : FormControl<string>;
}

export interface UpdateStatusFormValue {
    currentStatus: string;
    newStatus    : number;
    requestor    : string;
    changeCause  : string;
    observations : string;
}

export interface UpdateStatusResponse {
    contract : number;
    newStatus: string;
}