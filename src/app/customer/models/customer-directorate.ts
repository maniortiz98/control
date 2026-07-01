import { FormControl } from "@angular/forms";

export interface CustomerDirectorateForm {
    adminType       : FormControl<string>;
    firstName       : FormControl<string>;
    secondFirstName : FormControl<string>;
    lastName        : FormControl<string>;
    secondLastName  : FormControl<string>;
    position        : FormControl<string>;
}

export interface CustomerDirectorate {
    tempId          : string;
    adminType       : string;
    firstName       : string;
    secondFirstName : string;
    lastName        : string;
    secondLastName  : string;
    position        : string;
}

// export interface CustomerDirectoratePageData extends CustomerDirectorate {
//     tempId          : string;
// }

export interface CustomerDirectoratePageData {
    data : CustomerDirectorate[];
    table: CustomerDirectorate[];
}
export type DirectorateForm = CustomerDirectorateForm;
export type Directorate = CustomerDirectorate;
export type DirectorateTableData = CustomerDirectoratePageData;
export type DirectoratePageData = CustomerDirectoratePageData;

