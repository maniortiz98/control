export interface Relationships {
  mandt: string;
  idParent: string;
  spras: string;
  kinShip: string;
}

export interface RelationshipRequest {
  bool: string;
  clientId: string;
  language: string;
}

export interface RelationshipResponse {
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
      item: Relationships[];
    }
  };
  messages: string[];
}