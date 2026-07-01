export interface SearchCustomer extends SearchClientFlow{
  fullName: string;
}

export interface SearchClientFlow{
  birthDate: string,
  rfc: string,
  curp: string,
  nif: string,
  clientNumber: string,
  ssn: string
  personType: string,
  name: string,
  middleName: string,
  lastName: string,
  secondLastName: string,
  gender: string,
  countryOfBirth: string,
  federalEntity: string
}
