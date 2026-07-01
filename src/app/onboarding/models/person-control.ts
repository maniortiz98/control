
export interface FullPersonControl{
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

export interface SelectedPerson extends FullPersonControl {
  id: string,
  personType: string,

}
