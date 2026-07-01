export interface IdentificationItem {
  id: string | number,
  identificationCountry: string,
  identificationCountryId: string,
  identificationType: string,
  identificationTypeId: string,
  identificationNumber: string,
  identificationExpDate: string,
  active: boolean,
  isSaved?: boolean,
}
