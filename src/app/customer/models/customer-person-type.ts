export interface CustomerPersonType {
  mandt: string,
  spras: string,
  subPersonTypeId: string,
  subPersonType: string,
  personTypeId: string

}

/**
 * personType '1' => Persona Física
 * personType '2' => Persona Moral
 */
export interface CustomerPersonTypeRequest {
  subPersonTypeIds : string[];
  personType: '1'|'2';
}

export interface CustomerPersonTypeResponse {
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
      personType:{
        item: CustomerPersonType[];
      }
    };
    messages: string[];
}

export type PersonType = CustomerPersonType;
export type PersonTypeRequest = CustomerPersonTypeRequest;
export type PersonTypeResponse = CustomerPersonTypeResponse;

