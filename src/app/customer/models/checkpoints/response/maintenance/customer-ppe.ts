export interface CustomerEconomicDependent {
    foreignerWithoutCurp?: boolean | null;
    firstName?: string | null;
    middleName?: string | null;
    firstLastName?: string | null;
    secondLastName?: string | null;
    rfc?: string | null;
    curp?: string | null;
    dateOfBirth?: string | null;
    nif?: string | null;
    tin?: string | null;
    nss?: string | null;
    maritalStatus?: number | null;
    countryOfBirth?: string | null; 
    stateOfBirth?: string | null; 
    cityOfBirth?: string | null; 
    occupation?: string | null; 
    economicActivity?: string | null; 
    addressType?: string | null; 
    other?: string | null; 
    country?: string | null; 
    street?: string | null; 
    externalNumber?: string | null; 
    internalNumber?: string | null; 
    postalCode?: string | null; 
    federalEntity?: string | null;
    city?: string | null;
    municipality?: string | null; 
    neighborhood?: string | null; 
    relationship?: number | null;
    nationality?: string | null;
    phone?: string | null;
    id:number,
    personId:number,
    phoneId:number,
    accountRoleId:number,
    isActive:boolean| null, // Puede que la cambien es el borrado logico
    addressId:number;
    clientIdNum?: number | null;
}

export interface CustomerAssociation {
    companyName?: string | null;
    rfc?: string | null;
    commercialLine?: string | null; 
    economicActivity?: string | null; 
    administratorName?: string | null;
    nationality?: string | null; 
    addressType?: string | null; 
    other?: string | null; 
    country?: string | null; 
    street?: string | null; 
    externalNumber?: string | null; 
    internalNumber?: string | null; 
    postalCode?: string | null; 
    federalEntity?: string | null;
    city?: string | null;
    municipality?: string | null; 
    neighborhood?: string | null; 
    phone?: string | null;
    id:number,
    personId:number,
    phoneId:number,
    isActive:boolean| null, // Puede que la cambien es el borrado logico
    addressId:number,
    constitutionDate:string | null
    clientIdNum?:number | null;
}

export interface CustomerFamilyData {
    foreignerWithoutCurp?: boolean | null;
    firstName?: string | null;
    middleName?: string | null;
    firstLastName?: string | null;
    secondLastName?: string | null;
    nif?: string | null;
    tin?: string | null;
    nss?: string | null;
    positionHeld?: string | null;
    positionHeldEndDate?: string | null;
    relationship?: number | null;
    nationality?: string | null;
    rfc?: string | null;
    curp?: string | null;
    dateOfBirth?: string | null;
    maritalStatus?: number | null;
    countryOfBirth?: string | null;
    federalEntity?: string | null;
    city?: string | null;
    id:number,
    personId:number,
    accountRole:number,
    isActive:boolean | null, // Puede que la cambien es el borrado logico
    addressId: number,
}

export interface DataResPPE {
    id: number,
    ppeType?: string | null;
    positionHeld?: string | null;
    expirationDate?: string | null;
    isPpe?: boolean | null;
    hasEconomicDependents?: boolean | null;
    hasAssociations?: boolean | null;
    hasFamilyPpe?: boolean | null;
    economicDependents?: CustomerEconomicDependent[] | null;
    associations?: CustomerAssociation[] | null;
    familyData?: CustomerFamilyCustomerData[] | null;
}



export type EconomicDependent = CustomerEconomicDependent;
export type Association = CustomerAssociation;
export type FamilyData = CustomerFamilyData;
export type DataResPPE = DataResPPE;

