interface Beneficiary {
  curp: string | null;
  foreignWithoutCURP: boolean | null;
  rfc: string | null;
  nss: string | null;
  nif: string | null;
  tin: string | null;
  country: string | null;
  firstName: string | null;
  middleName: string | null;
  firstLastName: string | null;
  secondLastName: string | null;
  dateOfBirth: string | null; // Formato: "dd/MM/yyyy"
  gender: number | null;
  relationship: number | null;
  beneficiaryPercentage: string | null;
  maritalStatus: string | null;
  nationality: string | null;
  federalEntity: string | null;
  address: Address | null;
}

interface Address {
  addressType: string | null;
  country: string | null;
  street: string | null;
  externalNumber: string | null;
  internalNumber: string | null;
  postalCode: string | null;
  federalEntity: string | null;
  municipality: string | null;
  neighborhood: string | null;
  city: string | null;
}

type Beneficiaries = Beneficiary[] | null;