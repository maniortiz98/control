import { Data } from "../../../models/checkpoints/customer-initial-data-checkpoint"
import { InitialDataCustomer } from "../../../models/checkpoints/response/customer-initial-data"

export function mapToSignalInitialDataCustomer(input: InitialDataCustomer | null): Data {
  console.log(input)
  return {
    id: input?.id ?? 0,
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
