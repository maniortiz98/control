import { Address } from "../address";

export interface AdministratorExercisingPfControl{
  curp: string;
  foreignerWithoutCurp: boolean;
  rfc: string;
  firstName: string;
  middleName: string;
  dateOfBirth: string;
  firstLastName: string;
  secondLastName: string;
  gender: string;
  nationality: string;
  nationalityTwo: string;
  countryOfBirth: string;
  stateOfBirth: string;
  mail: string;
  phone: string;
  mexicoResident: boolean;
  fiscalResidenceAbroad: boolean;
  fatca: boolean;
  crs: boolean;
}

export interface FiscalResidenceAdministratorExercisingPfControl {
  country: string;
  declarationFiscalResidence: boolean;
  proofOfAddressType: string;
  issueDate: string;
  expirationStatus: string;
  expirationDate: string;
  certificationDate: string;
  declarationYear: number;
  aditionalDays: string;
  factaObligations: {
    autentication: string;
    nif?: string;
    tin?: string;
    nss?: string;
  };
}

export interface AdministratorExercisingPfControlTableData{
  id: string;
  firstName: string;
  middleName: string;
  firstLastName: string;
  secondLastName: string;
  nationality: string;
}

export interface AdministratorExercisingPfControlTable extends AdministratorExercisingPfControl, Address{
  id: string;
  fiscalAddress: Array<FiscalResidenceAdministratorExercisingPfControl>,
}

export interface AdministratorExercisingPfControlSaveData extends AdministratorExercisingPfControl, Address{
  fiscalAddress: Array<FiscalResidenceAdministratorExercisingPfControl>,
}

export interface AdministratorExercisingPfControlData{
  id: string,
  generalData: AdministratorExercisingPfControl,
  adrres: Address,
  fiscalAddress: Array<FiscalResidenceAdministratorExercisingPfControl>,
}

export interface AdministratorExercisingPfControlDataSave{
  client: Array<AdministratorExercisingPfControlSaveData>;
}
