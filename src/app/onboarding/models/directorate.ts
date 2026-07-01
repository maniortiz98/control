import { FormControl } from "@angular/forms";

export interface DirectorateForm {
    adminType       : FormControl<string>;
    firstName       : FormControl<string>;
    secondFirstName : FormControl<string>;
    lastName        : FormControl<string>;
    secondLastName  : FormControl<string>;
    position        : FormControl<string>;
}

export interface Directorate {
    tempId          : string;
    adminType       : string;
    firstName       : string;
    secondFirstName : string;
    lastName        : string;
    secondLastName  : string;
    position        : string;
}

// export interface DirectorateTableData extends Directorate {
//     tempId          : string;
// }

export interface DirectoratePageData {
    data : Directorate[];
    table: Directorate[];
}