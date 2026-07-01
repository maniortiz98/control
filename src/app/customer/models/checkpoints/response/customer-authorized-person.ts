interface CustomerAuthorizedPerson {
    curp: string | null;
    foreignWithoutCURP: boolean | null;
    rfc: string | null;
    nif: string | null;
    tin: string | null;
    nss: string | null;
    firstName: string | null;
    middleName: string | null;
    lastName: string | null;
    secondLastName: string | null;
    birthDate: string | null;
    gender: number | null;
    maritalStatus: number | null;
    nationality: string | null;
    birthCountry: string | null;
    federalEntity: string | null;
    signatureClass: string | null;
    checkbookManagementAccess: boolean | null;
    relationship: string | null;
    autorizedPersonType: string | null;
    economicActivity: string | null;
    occupation: string | null;
    companyName: string | null;
    jobTitle: string | null;
    personPpe: CustomerPersonPpe | null;
    residenceAddress: ResidenceAddress | null;
    contact: Contact | null;
    faculties: CustomerFaculties | null;
}

interface CustomerPersonPpe {
    isPpe: boolean | null;
    ppeType: string | null;
    positionHeld: string | null;
    positionEndDate: string | null;
    hasppeRelatives: boolean | null;
    ppeRelatives: PpeRelatives | null;
}

interface PpeRelatives {
    rfc: string | null;
    firstName: string | null;
    firstLastName: string | null;
    relationship: number | null;
    positionHeld: string | null;
    positionEndDate: string | null;
}

interface ResidenceAddress {
    addressType: number | null;
    otherAddressType: string | null;
    country: string | null;
    street: string | null;
    externalNumber: string | null;
    internalNumber: string | null;
    postalCode: string | null;
    federalEntity: string | null;
    municipality: string | null;
    city: string | null;
    neighborhood: string | null;
}

interface Contact {
    type: string | null;
    country: string | null;
    areaCode: string | null;
    phone: string | null;
    extension: string | null;
    emailAddress: string | null;
}

interface CustomerFaculties {
    signatureInstruction: string | null;
    otherSignatureInstruction: string | null;
}

type AuthorizedPersons2 = CustomerAuthorizedPerson[] | null;