export interface CustomerEconomicActivity {
  lineBusinessId: string,
  lineBusiness: string,
  risk: string,
  isPublic: string,
  level: string,
  terminationDate: string
}

export interface CustomerEconomicActivityAccredited {
  lineBusinessId: number,
  lineBussiness: string
}

export type CustomerEconomicActivityAccreditedRequest = Record<never, never>;

export interface CustomerEconomicActivityRequest {
  lineBusinessId: string[];
}

export interface CustomerEconomicActivityByPersonTypeRequest {
  subPersonTypeId: string;
}

export type CustomerCatalogById = Record<string, { data: any[]; updatedAt: string }>;

export interface CustomerEconomicActivityResponse {
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





export type EconomicActivity = CustomerEconomicActivity;
export type EconomicActivityAccredited = CustomerEconomicActivityAccredited;
export type EconomicActivityAccreditedRequest = CustomerEconomicActivityAccreditedRequest;
export type EconomicActivityRequest = CustomerEconomicActivityRequest;
export type EconomicActivityByPersonTypeRequest = CustomerEconomicActivityByPersonTypeRequest;
export type CatalogById = CustomerCatalogById;
export type EconomicActivityResponse = CustomerEconomicActivityResponse;

