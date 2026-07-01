import { FormControl } from "@angular/forms";

export interface SpidProfilePageData {
    data: SpidProfile;
    table: any[]
}

export interface SpidProfile {
    accountPurpose: string;
    fundOrigin: string;
    fundDestination: string;
    spidReceiveMonth: string;
    spidSendMonth: string;
    transactReceiveMonth: string;
    transactSendMonth: string;
    customerStock: string;
    publicEntity: string;
    creditInstitution: string;
    counterparts: SpidCounterpart[];
}

export interface SpidCounterpart {
    tempId?: string;
    typeId: '1' | '3' | '5';
    id: string;
    companyName: string;
    economicActivity: string;
    relationType: string;
    bank: string;
    clabe: string;
    frecuency: string;
}

export interface SpidProfileForm {
    adminType       : FormControl<string>;
    firstName       : FormControl<string>;
    secondFirstName : FormControl<string>;
    lastName        : FormControl<string>;
    secondLastName  : FormControl<string>;
    position        : FormControl<string>;
}