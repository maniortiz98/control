export interface Entity {
  mandt: string,
  land1: string,
  bland: string,
  bezei: string,
  fprcd: string;
  herbl: string;
}

export interface FederalEntityRequest {
  land1s: string[];
}

export interface FederalEntityResponse {
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
        item: Entity[];
      };
    };
  messages: string[];
}
