export interface CustomerPropertyType {
  propertyTypeId: string,
  propertyType: string,
}

export interface CustomerPropertyTypeRequest {
  propertyTypeIds: string[],
}

export type PropertyType = CustomerPropertyType;
export type PropertyTypeRequest = CustomerPropertyTypeRequest;

