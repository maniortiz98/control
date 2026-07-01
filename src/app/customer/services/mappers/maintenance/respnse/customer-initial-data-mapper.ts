import { Data } from '../../../../models/checkpoints/customer-initial-data-checkpoint'
import { CustomerInitialDataM } from '../../../../models/checkpoints/response/maintenance/customer-initial-data'


export function mapToSignalInitialDataM(input: CustomerInitialDataM): Data {
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
    stateOfBirth: input.stateOfBirth,
    cityOfBirth: input.cityOfBirth || '',
    ppe: input.ppe,
    foreignerWithoutCurp: input.foreignerWithoutCurp,
    bankAreaTypeId: input.bankAreaTypeId,
    contraTypeId: input.contraTypeId,
    typeContractSubtypeId: input.typeContractSubtypeId
  }
}





