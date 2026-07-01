export interface CustomerOriginResource {
    status: number,
    messages: string[]
    payload: {
      ranges: CustomerRanges[]
    }

}


export interface CustomerOriginResourceRequest {
   full: boolean,
   rangeId: string
}

export interface CustomerRanges {
  rangeId: string;
  description: string;
}

export type OriginResource = CustomerOriginResource;
export type OriginResourceRequest = CustomerOriginResourceRequest;
export type Ranges = CustomerRanges;

