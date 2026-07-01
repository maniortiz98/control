export interface CustomerRelationships {
  mandt: string;
  idParent: string;
  spras: string;
  kinShip: string;
}

export interface CustomerRelationshipRequest {
  bool: string;
  clientId: string;
  language: string;
}

export interface CustomerRelationshipResponse {
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
    };
    status: number;
    relationship: {
      item: CustomerRelationships[];
    }
  };
  messages: string[];
}
export type Relationships = CustomerRelationships;
export type RelationshipRequest = CustomerRelationshipRequest;
export type RelationshipResponse = CustomerRelationshipResponse;

