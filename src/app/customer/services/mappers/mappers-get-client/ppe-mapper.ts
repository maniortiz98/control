import { DataClientPPE } from "../../../models/customer-client-data"
import { CI_FamilyData, CI_PpeInformation } from "../../../models/customer-customer"
import { formatDateYYYYMMDD } from "../../../utils/customer-datetime"
import { compareAndReturnIdRfcNifTinNss, compareAndReturnValueRfcNifTinNss } from "../../../utils/customer-map-rfc-nif-tin-nss"


export function mapToSignalPPECustomer(input: CI_PpeInformation | null): DataClientPPE {
  return {
    id: input?.id ?? undefined,
    idS: crypto.randomUUID(), // Id generado para front
    ppe: input?.ppe ?? false,
    fppe: input?.hasFamilyPpe === true ? 'yes' : 'no',
    dppe: 'no',
    sappe: 'no',
    typePPE: input?.ppeType ?? '',
    positionHeld: input?.positionHeld ?? '',
    expirationDate: formatDateYYYYMMDD(input?.expirationDate ?? ''),
    dataClientFamilyPPE: input?.familyData?.map((family: CI_FamilyData) => {
      return {
        curp: family.curp ?? '',
        foreignerWithoutCurp: family.foreignerWithoutCurp ?? false,
        typeIden: compareAndReturnIdRfcNifTinNss(family.rfc ?? '', family.nif || '', family.tin || '', family.nss || ''),
        rfc: compareAndReturnValueRfcNifTinNss(family.rfc ?? '', family.nif || '', family.tin || '', family.nss || ''),
        dateOfBirth: formatDateYYYYMMDD(family.dateOfBirth ?? ''),
        nationality: family.nationality ?? '',
        countryOfBirth: family.countryOfBirth || '',
        stateOfBirth: family.stateOfBirth != '' ? family.stateOfBirth || '' : family.cityOfBirth || '',
        firstName: family.firstName ?? '',
        middleName: family.middleName ?? '',
        firstLastName: family.firstLastName ?? '',
        secondLastName: family.secondLastName ?? '',
        chargeDueDate: formatDateYYYYMMDD(family.positionHeldEndDate ?? ''),
        relationship: family.relationship?.toString() ?? '',
        positionHeld: family.positionHeld ?? '',
        maritalStatus: family.maritalStatus?.toString() ?? '',
        idS: crypto.randomUUID(), // Id generado para front
        id: family.id ?? undefined,
      }
    }) || [],
    dataClientDepPPE: [],
    dataClientSocAndAssoPPE: []
  }
}
