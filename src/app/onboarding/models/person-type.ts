export interface PersonType {
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
export interface PersonTypeRequest {
  subPersonTypeIds : string[];
  personType: '1'|'2';
}

export interface PersonTypeResponse {
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
        item: PersonType[];
      }
    };
    messages: string[];
}
