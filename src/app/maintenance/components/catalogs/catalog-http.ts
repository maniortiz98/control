export interface RetrieveCatalogRequest {
    catalogName: string;
    fields: string[];
    filterField?: string;
    filterValue?: string | number | boolean;
  }
  
  export interface RetrieveCatalogResponse<T> {
    status: number;
    messages: string[];
    payload: T[];
  }
  
  export interface UpsertCatalogRequest<T> {
    catalogName: string;
    records: T[];
  }
  
  export interface UpsertCatalogResponse {
    status: number;
    messages: string[];
  }
  