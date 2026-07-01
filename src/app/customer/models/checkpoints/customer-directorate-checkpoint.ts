export interface CustomerDirectorateCheckpoint {
    authorizedPersons: any[];
    personPpe: any;
    residenceAddresses: any[];
    contacts: any[];
    faculties: {
        signatureInstruction: string;
        otherSignatureInstruction: string;
    }
}
export type DirectorateCheckpoint = CustomerDirectorateCheckpoint;

