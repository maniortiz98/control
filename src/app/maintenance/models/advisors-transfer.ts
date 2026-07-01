import { FormControl } from "@angular/forms";

export interface AdvisorsTransferForm {
  advisorNumber1: FormControl<string>;
  advisorNumber2: FormControl<string>;
}

export interface AdvisorTransferContracts {
    bankingArea     : string;
    bankingAreaText?: string; // setted in front, to show text instead ID
    contract        : number;
    fullName        : string;
    numClient       : number;
    status          : string;
}

export interface AdvisorTransfersList {
    bankingArea        : string;
    contract           : string;
    originPromoter     : string;
    destinationPromoter: string;
}