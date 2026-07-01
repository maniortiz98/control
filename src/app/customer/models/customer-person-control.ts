
export interface CustomerFullPersonControl{
  curp: string,
  firstName: string,
  secondName: string,
  firstLastName: string,
  secondLastName: string,
  birthday: Date,
  birthCountry: string,
  birthFederativeEntity: string,
  fullName: string,
  email: string,
  phone: string,
  country: string,
  postalCode: string,
  nationalityName: string,
  nationalityId: string,
}

export interface CustomerSelectedPerson extends CustomerFullPersonControl {
  id: string,
  personType: string,

}



export type FullPersonControl = CustomerFullPersonControl;
export type SelectedPerson = CustomerSelectedPerson;

