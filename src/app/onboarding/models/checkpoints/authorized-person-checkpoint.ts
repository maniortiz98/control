export interface AuthorizedPersonCheckpoint {
    authorizedPerson: AuthorizedPersonCheckpointSingle[];
};

export interface AuthorizedPersonCheckpointSingle {
  // customerNumber: number | null; // TODO func. 3ro relacionado.
  curp: string;
  foreignWithoutCURP: boolean;
  rfc: string;
  nif: string;
  tin: string;
  nss: string;
  firstName: string;
  middleName: string;
  lastName: string;
  secondLastName: string;
  birthDate: string;
  gender: number;
  maritalStatus: number;
  nationality: string;
  birthCountry: string;
  federalEntity: string;
  signatureClass: string;
  checkbookManagementAccess: boolean;
  relationship: string;
  authorizedPersonType: string;
  economicActivity: string;
  occupation: string;
  profession: string;
  companyName: string;
  jobTitle: string;
  personPpe: {
    isPpe: boolean;
    ppeType: string;
    positionHeld: string;
    positionEndDate: string;
    hasppeRelatives: boolean;
    ppeRelatives: {
      rfc: string;
      firstName: string;
      firstLastName: string;
      relationship: number;
      positionHeld: string;
      positionEndDate: string;
    };
  };
  residenceAddress: {
    addressType: number;
    otherAddressType: string;
    country: string;
    street: string;
    externalNumber: string;
    internalNumber: string;
    postalCode: string;
    federalEntity: string;
    municipality: string;
    neighborhood: string;
  };
  contact: {
    type: string;
    country: string;
    areaCode: string;
    phone: string;
    extension: string;
    emailAddress: string;
  };
  faculties: {
    signatureInstruction: string;
    otherSignatureInstruction: string;
  }
};


export interface AuthorizedPersonModelSaveMaint {
  id: number | null;
    // customerNumber: number | null; // TODO func. 3ro relacionado.
  personId: number | null;
  curp: string;
  foreignWithoutCURP: boolean;
  rfc: string;
  firstName: string;
  middleName: string;
  lastName: string;
  secondLastName: string;
  birthDate: string; // ex: "23/02/1995",
  gender: string | null;
  maritalStatus: string;
  nationality: string;
  birthCountry: string;
  federalEntity: string;
  signatureClass: string;
  checkbookManagementAccess: boolean;
  relationship: string;
  economicActivity: string;
  occupation: string;
  profession: string;
  companyName: string;
  jobTitle: string;
  personPpe: {
    id: number | null;
    isPpe: boolean;
    ppeType: string;
    positionHeld: string;
    positionEndDate: string; // ex: "24/12/2026",
    hasppeRelatives: boolean;
    ppeRelatives: { }
  };
  residenceAddress: {
    id: number | null;
    addressType: string;
    otherAddressType: string;
    country: string;
    street: string;
    externalNumber: string;
    internalNumber: string;
    postalCode: string;
    federalEntity: string;
    municipality: string;
    neighborhood: string;
  };
  contact: {
    id: number | null;
    type: string;
    country: string;
    areaCode: string;
    phone: string;
    extension: string;
    emailAddress: string;
  };
  faculties: {
    id: number | null;
    signatureInstruction: string;
    otherSignatureInstruction: string;
  };
}
