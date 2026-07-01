export interface OrganizationChartSection{
  firstName: string,
  secondName: string,
  firstLastName: string,
  secondLastName: string,
  hieraticLevelTable: HieraticLevel[]
}

export interface HieraticLevel{
  id: string
  firstName: string,
  secondName: string,
  firstLastName: string,
  secondLastName: string,
  charge: string,
}

