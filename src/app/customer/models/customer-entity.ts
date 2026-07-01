export interface CustomerEntity {
  mandt: string,
  land1: string,
  bland: string,
  bezei: string,
  fprcd: string;
  herbl: string;
}

export interface CustomerFederalEntityRequest {
  land1s: string[];
}

export interface CustomerFederalEntityResponse {
  status: number;
    payload: {
      errorMsg: {
        items: {
          messageType: string;
          category: string;
          code: string;
          message: string;
          shortDescription: string;
        }[] | null;
      };
      status: number|null;
      federalEntity: {
        item: CustomerEntity[];
      };
    };
  messages: string[];
}

export type Entity = CustomerEntity;
export type FederalEntityRequest = CustomerFederalEntityRequest;
export type FederalEntityResponse = CustomerFederalEntityResponse;

