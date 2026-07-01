import { formatDateYYYYMMDD } from "../../../../../shared/utils/datetime"
import { compareAndReturnIdRfcNifTinNss, compareAndReturnValueRfcNifTinNss } from "../../../../../shared/utils/map-rfc-nif-tin-nss"
import { Association, DataResPPE, EconomicDependent, FamilyData } from "../../../../models/checkpoints/response/maintenance/ppe"
import { DataClientPPE } from "../../../../models/client-data"


export function mapToSignalPPEm(input: DataResPPE): DataClientPPE {
  return {
    id: input.id,
    idS: crypto.randomUUID(), // Id generado para front
    ppe: input.isPpe || false,
    fppe: input.hasFamilyPpe === true ? 'yes' : 'no',
    dppe: input.hasEconomicDependents === true ? 'yes' : 'no',
    sappe: input.hasAssociations === true ? 'yes' : 'no',
    typePPE: input.ppeType || '',
    positionHeld: input.positionHeld || '',
    expirationDate: formatDateYYYYMMDD(input.expirationDate || ''),
    dataClientFamilyPPE: input.familyData?.map((family: FamilyData) => {
      return {
        curp: family.curp || '',
        foreignerWithoutCurp: family.foreignerWithoutCurp || false,
        typeIden: compareAndReturnIdRfcNifTinNss(family.rfc || '', family.nif || '', family.tin || '', family.nss || ''),
        rfc: compareAndReturnValueRfcNifTinNss(family.rfc || '', family.nif || '', family.tin || '', family.nss || ''),
        dateOfBirth: formatDateYYYYMMDD(family.dateOfBirth || ''),
        nationality: family.nationality || '',
        countryOfBirth: family.countryOfBirth || '',
        stateOfBirth: family.federalEntity || '',
        firstName: family.firstName || '',
        middleName: family.middleName || '',
        firstLastName: family.firstLastName || '',
        secondLastName: family.secondLastName || '',
        chargeDueDate: formatDateYYYYMMDD(family.positionHeldEndDate || ''),
        relationship: family.relationship?.toString() || '',
        positionHeld: family.positionHeld || '',
        maritalStatus: family.maritalStatus?.toString() || '',
        idS: crypto.randomUUID(), // Id generado para front
        id: family.id,
        personId: family.personId,
        accountRole: family.accountRole,
        isActive: family.isActive ?? true,
        addressId: family.addressId,
        cityOfBirth: family.city || ''
      }
    }) || [],
    dataClientDepPPE: input.economicDependents?.map((dependent: EconomicDependent) => {
      return {
        curp: dependent.curp || '',
        foreignerWithoutCurp: dependent.foreignerWithoutCurp || false,
        typeIden: compareAndReturnIdRfcNifTinNss(dependent.rfc || '', dependent.nif || '', dependent.tin || '', dependent.nss || ''),
        rfc: compareAndReturnValueRfcNifTinNss(dependent.rfc || '', dependent.nif || '', dependent.tin || '', dependent.nss || ''),
        dateOfBirth: formatDateYYYYMMDD(dependent.dateOfBirth || ''),
        nationality: dependent.nationality || '',
        countryOfBirth: dependent.countryOfBirth || '',
        stateOfBirth: dependent.stateOfBirth || '',
        cityOfBirth : dependent.cityOfBirth || '',
        firstName: dependent.firstName || '',
        middleName: dependent.middleName || '',
        firstLastName: dependent.firstLastName || '',
        secondLastName: dependent.secondLastName || '',
        relationship: dependent.relationship?.toString() || '',
        occupation: dependent.occupation || '',
        businessTurnaround: dependent.economicActivity || '',
        phone: Number(dependent.phone) || Number(''),
        addressType: dependent.addressType || '',
        country: dependent.country || '',
        postalCode: dependent.postalCode || '',
        federalEntity: dependent.federalEntity || '',
        city: dependent.city || '',
        municipality: dependent.municipality || '',
        neighborhood: dependent.neighborhood || '',
        street: dependent.street || '',
        externalNumber: dependent.externalNumber || '',
        internalNumber: dependent.internalNumber || '',
        maritalStatus: dependent.maritalStatus?.toString() || '',
        idS: crypto.randomUUID(), // Id generado para front
        idDep: dependent.id, // Correstponde al campo id de EconomicDependent de la respuesta
        personId: dependent.personId,
        phoneId: dependent.phoneId,
        accountRoleId: dependent.accountRoleId,
        isActive: dependent.isActive ?? true,
        addressId: dependent.addressId,
        clientIdNum: dependent?.clientIdNum ?? null,
        federalEntityID: dependent.federalEntity || '',  //REVISAR CON FELIX.
        municipalityID: dependent.municipality || '',
        cityID: dependent.city || ''


      }
    }) || [],
    dataClientSocAndAssoPPE: input.associations?.map((aso: Association) => {
      return {
        rfc: aso.rfc || '',
        companyName: aso.companyName || '',
        commercialBusiness: aso.commercialLine || '',
        administratorManagerAttorney: aso.administratorName || '',
        phone: aso.phone || '',
        economicActivity: aso.economicActivity || '',
        nationality: aso.nationality || '',
        addressType: aso.addressType || '',
        country: aso.country || '',
        postalCode: aso.postalCode || '',
        federalEntity: aso.federalEntity || '',
        city: aso.city || '',
        municipality: aso.municipality || '',
        neighborhood: aso.neighborhood || '',
        street: aso.street || '',
        externalNumber: aso.externalNumber || '',
        internalNumber: aso.internalNumber || '',
        idS: crypto.randomUUID(), // Id generado para front
        idAso: aso.id, // Correstponde al campo id de Association de la respuesta
        personId: aso.personId,
        phoneId: aso.phoneId,
        isActive: aso.isActive ?? true,
        addressId: aso.addressId,
        clientIdNum: aso?.clientIdNum ?? null,
        federalEntityID: aso.federalEntity || '',
        municipalityID: aso.municipality || '',
        cityID: aso.city || '',
      }
    }) || []
  }
}
