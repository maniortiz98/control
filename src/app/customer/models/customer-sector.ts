export interface CustomerSector {
  idSectorTypeCve: string,
  sector: string,
}

export interface CustomerSectorRequest {
  idsSectorTypeCve: string[],
}

export type Sector = CustomerSector;
export type SectorRequest = CustomerSectorRequest;

