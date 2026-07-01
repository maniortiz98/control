export interface CustomerSearchCustomer extends CustomerSearchClientFlow{
  fullName: string;
}

export interface CustomerSearchClientFlow{
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

export type SearchCustomer = CustomerSearchCustomer;
export type SearchClientFlow = CustomerSearchClientFlow;

