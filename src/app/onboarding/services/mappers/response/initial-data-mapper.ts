import { Data } from "../../../models/checkpoints/initial-data-checkpoint";
import { InitialData, InitialDataCustomer } from "../../../models/checkpoints/response/initial-data";

export function mapToSignalInitialData(input: InitialData): Data {
  console.log(input)
  return {
    curp: input.curp,
    nif: input.nif || '',
    tin: input.tin || '',
    nss: input.nss || '',
    rfc: input.rfc || '',
    firstName: input.firstName,
    middleName: input.middleName,
    firstLastName: input.firstLastName,
    secondLastName: input.secondLastName,
    dateOfBirth: input.dateOfBirth,
    gender: input.gender,
    nationality: input.nationality,
    countryOfBirth: input.countryOfBirth,
    stateOfBirth: input.stateOfBirth,
    cityOfBirth: input.cityOfBirth || '',
    ppe: input.ppe,
    foreignerWithoutCurp: input.foreignerWithoutCurp,
    bankAreaTypeId: input.bankAreaTypeId,
    contraTypeId: input.contraTypeId,
    typeContractSubtypeId: input.typeContractSubtypeId
  }
}

export function mapToSignalInitialDataCustomer(input: InitialDataCustomer | null): Data {
  console.log(input)
  return {
    curp: input?.curp ?? '',
    nif: input?.nif ?? '',
    tin: input?.tin ?? '',
    nss: input?.nss ?? '',
    rfc: input?.rfc ?? '',
    firstName: input?.firstName ?? '',
    middleName: input?.middleName ?? '',
    firstLastName: input?.firstLastName ?? '',
    secondLastName: input?.secondLastName ?? '',
    dateOfBirth: input?.dateOfBirth ?? '',
    gender: input?.gender ?? '',
    nationality: input?.nationality ?? '',
    countryOfBirth: input?.countryOfBirth ?? '',
    stateOfBirth: input?.stateOfBirth ?? '',
    cityOfBirth: input?.cityOfBirth ?? '',
    ppe: input?.ppe ?? false,
    foreignerWithoutCurp: input?.foreignerWithoutCurp ?? false
  }
}
