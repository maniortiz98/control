import { formatDateYYYYMMDD } from "../../../../utils/customer-datetime"
import { compareAndReturnIdRfcNifTinNss, compareAndReturnValueRfcNifTinNss } from "../../../../utils/customer-map-rfc-nif-tin-nss"
import { CustomerAssociation, DataResPPE, CustomerEconomicDependent, CustomerFamilyData } from "../../../../models/checkpoints/response/maintenance/customer-ppe"
import { DataClientPPE } from '../../../../models/customer-client-data'


export function mapToSignalPPEm(input: DataResPPE): DataClientPPE {
  return {
    id: input.id,
    idS: crypto.randomUUID(), // id generado para front
    ppe: input.isPpe || false,
    fppe: input.hasFamilyPpe === true ? 'yes' : 'no',
    dppe: input.hasEconomicDependents === true ? 'yes' : 'no',
    sappe: input.hasAssociations === true ? 'yes' : 'no',
    typePPE: input.ppeType || '',
    positionHeld: input.positionHeld || '',
    expirationDate: formatDateYYYYMMDD(input.expirationDate || ''),
    dataClientFamilyPPE: input.familyData?.map((family: CustomerFamilyData) => {
      return {
        curp: family.curp || '',
        foreignerWithoutCurp: family.foreignerWithoutCurp || false,
        typeIden: compareAndReturnIdRfcNifTinNss(family.rfc || '', family.nif || '', family.tin || '', family.nss || ''),
        rfc: compareAndReturnValueRfcNifTinNss(family.rfc || '', family.nif || '', family.tin || '', family.nss || ''),
        dateOfBirth: family.dateOfBirth || '',
        nationality: family.nationality || '',
        countryOfBirth: family.countryOfBirth || '',
        stateOfBirth: family.federalEntity || '',
        firstName: family.firstName || '',
        middleName: family.middleName || '',
        firstLastName: family.firstLastName || '',
        secondLastName: family.secondLastName || '',
        chargeDueDate: family.positionHeldEndDate || '',
        relationship: family.relationship?.toString() || '',
        positionHeld: family.positionHeld || '',
        maritalStatus: family.maritalStatus?.toString() || '',
        idS: crypto.randomUUID(), // id generado para front
        id: family.id,
        personId: family.personId,
        accountRole: family.accountRole,
        isActive: family.isActive ?? true,
        addressId: family.addressId,
        cityOfBirth: family.city || ''
      }
    }) || [],
    dataClientDepPPE: input.economicDependents?.map((dependent: CustomerEconomicDependent) => {
      return {
        curp: dependent.curp || '',
        foreignerWithoutCurp: dependent.foreignerWithoutCurp || false,
        typeIden: compareAndReturnIdRfcNifTinNss(dependent.rfc || '', dependent.nif || '', dependent.tin || '', dependent.nss || ''),
        rfc: compareAndReturnValueRfcNifTinNss(dependent.rfc || '', dependent.nif || '', dependent.tin || '', dependent.nss || ''),
        dateOfBirth: dependent.dateOfBirth || '',
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
        businessTurnaround: dependent.line || '',
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
        idS: crypto.randomUUID(), // id generado para front
        idDep: dependent.id, // Correstponde al campo id de CustomerEconomicDependent de la respuesta
        personId: dependent.personId,
        phoneId: dependent.phoneId,
        accountRoleId: dependent.accountRoleId,
        isActive: dependent.isActive ?? true,
        addressId: dependent.addressId
      }
    }) || [],
    dataClientSocAndAssoPPE: input.associations?.map((aso: CustomerAssociation) => {
      return {
        rfc: aso.rfc || '',
        companyName: aso.companyName || '',
        commercialBusiness: aso.commercialLine || '',
        administratorManagerAttorney: aso.administratorName || '',
        phone: aso.phone || '',
        economicActivity: aso.rfc || '',
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
        idS: crypto.randomUUID(), // id generado para front
        idAso: aso.id, // Correstponde al campo id de CustomerAssociation de la respuesta
        personId: aso.personId,
        phoneId: aso.phoneId,
        isActive: aso.isActive ?? true,
        addressId: aso.addressId,
      }
    }) || []
  }
}





