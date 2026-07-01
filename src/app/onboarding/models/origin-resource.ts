export interface OriginResource {
    status: number,
    messages: string[]
    payload: {
      ranges: Ranges[]
    }

}


export interface OriginResourceRequest {
   full: boolean,
   rangeId: string
}

export interface Ranges {
  rangeId: string;
  description: string;
}
