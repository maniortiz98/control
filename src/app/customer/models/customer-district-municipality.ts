export interface CustomerDistrictMunicipality{
  districtMunicipalityId: string,
  districtMunicipality: string
}

export interface CustomerDistrictMunicipalityRequest{
  idMunicipalityCve: string,
  idState: number,
}

export type DistrictMunicipality = CustomerDistrictMunicipality;
export type DistrictMunicipalityRequest = CustomerDistrictMunicipalityRequest;

