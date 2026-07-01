import { Data } from "../../../../models/checkpoints/initial-data-checkpoint"
import { InitialDataM } from "../../../../models/checkpoints/response/maintenance/initial-data"


export function mapToSignalInitialDataM(input: InitialDataM): Data {
  console.log(input)
  return {
    id: input.id,
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
    stateOfBirth: input.stateOfBirth || '',
    cityOfBirth: input.cityOfBirth || '',
    ppe: input.ppe,
    foreignerWithoutCurp: input.foreignerWithoutCurp,
    bankAreaTypeId: input.bankAreaTypeId,
    contraTypeId: input.contraTypeId,
    typeContractSubtypeId: input.typeContractSubtypeId
  }
}
