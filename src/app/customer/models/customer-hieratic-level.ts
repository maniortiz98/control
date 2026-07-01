export interface CustomerOrganizationChartSection{
  firstName: string,
  secondName: string,
  firstLastName: string,
  secondLastName: string,
  hieraticLevelTable: CustomerHieraticLevel[]
}

export interface CustomerHieraticLevel{
  id: string
  firstName: string,
  secondName: string,
  firstLastName: string,
  secondLastName: string,
  charge: string,
}




export type OrganizationChartSection = CustomerOrganizationChartSection;
export type HieraticLevel = CustomerHieraticLevel;

