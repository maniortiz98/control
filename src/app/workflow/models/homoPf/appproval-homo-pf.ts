export interface Person {
    typePerson: number;
    firstName: string;
    middleName: string;
    lastName: string;
    secondLastName: string;
    curp: string;
    rfc: string;
    nif: string;
    tin: string;
    nss: string;
}

export interface Advisor {
    id: number;
}

export interface WorkFlowAssignmentHomo {
    workFlowAssignmentId: number;
    person: Person;
    advisor: Advisor;
}
