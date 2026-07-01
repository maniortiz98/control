export interface EconomicActivity {
  lineBusinessId: string,
  lineBusiness: string,
  risk: string,
  isPublic: string,
  level: string,
  terminationDate: string
}

export interface EconomicActivityAccredited {
  lineBusinessId: number,
  lineBussiness: string
}

export type EconomicActivityAccreditedRequest = Record<never, never>;

export interface EconomicActivityRequest {
  lineBusinessId: string[];
}

export interface EconomicActivityByPersonTypeRequest {
  subPersonTypeId: string;
}

export type CatalogById = Record<string, { data: any[]; updatedAt: string }>;

export interface EconomicActivityResponse {
  status: number;
  payload: {
    errorMsg: {
      items: {
        messageType: string;
        category: string;
        code: string;
        message: string;
        shortDescription: string;
      }[];
    },
    status: any;
    economicActivity:{
      item: {
        mandt: string;
        spras: string;
        lineBusinessId: string;
        lineBusiness: string;
        personType1: string;
        personType2: string;
        personType3: string;
        personType4: string;
        personType5: string;
        personType6: string;
        personType7: string;
        risk: string;
        terminationDate: string;
        isPublic: string;
        level: string;
      }[];
    }
  };
  messages: string[];
}


