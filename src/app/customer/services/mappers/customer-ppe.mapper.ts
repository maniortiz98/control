import {
  DataClientDepPPE,
  DataClientFamilyPPE,
  DataClientPPE,
  DataClientSocAndAssoPPE,
} from '../../models/customer-client-data';
import { convertDate } from '../../utils/customer-datetime';
import { CustomerAllowedValuesRfcNifTinNss, compareAndReturnRfcNifTinNss } from '../../utils/customer-map-rfc-nif-tin-nss';
import { CustomerSTRINGS } from '../../constants/customer-constants';
import { CustomerProfileData } from '../../models/checkpoints/customer-ppe-data-checkpoint';

export function mapFormToCheckPointPpeData(input: DataClientPPE): CustomerProfileData {
  return {
    ppeType: input.typePPE ?? '',
    positionHeld: input.positionHeld ?? '',
    expirationDate: '' + convertDate(input.expirationDate ?? ''),
    isPpe: input.ppe,
    hasEconomicDependents: input.dppe.toUpperCase() === 'YES',
    hasAssociations: input.sappe.toUpperCase() === 'YES',
    hasFamilyPpe: input.fppe.toUpperCase() === 'YES',
    economicDependents: input.dataClientDepPPE.map(
      (dependent: DataClientDepPPE) => {
        if (
          dependent.curp.substring(11, 13) === CustomerSTRINGS.FOREIGN ||
          dependent.foreignerWithoutCurp
        ) {
          return {
            foreignerWithoutCurp: dependent.foreignerWithoutCurp,
            firstName: dependent.firstName,
            middleName: dependent.middleName,
            firstLastName: dependent.firstLastName,
            secondLastName: dependent.secondLastName,
            rfc: compareAndReturnRfcNifTinNss(
              dependent.rfc,
              CustomerAllowedValuesRfcNifTinNss.RFC,
              dependent.typeIden
            ),
            curp: dependent.curp,
            dateOfBirth: '' + convertDate(dependent.dateOfBirth),
            nif: compareAndReturnRfcNifTinNss(
              dependent.rfc,
              CustomerAllowedValuesRfcNifTinNss.NIF,
              dependent.typeIden
            ),
            tin: compareAndReturnRfcNifTinNss(
              dependent.rfc,
              CustomerAllowedValuesRfcNifTinNss.TIN,
              dependent.typeIden
            ),
            nss: compareAndReturnRfcNifTinNss(
              dependent.rfc,
              CustomerAllowedValuesRfcNifTinNss.SSN,
              dependent.typeIden
            ),
            maritalStatus: Number(dependent.maritalStatus),
            countryOfBirth: dependent.countryOfBirth,
            stateOfBirth: '',
            cityOfBirth: dependent.stateOfBirth,
            occupation: dependent.occupation,
            economicActivity: dependent.businessTurnaround,
            addressType: dependent.addressType,
            other: dependent.other ?? '',
            country: dependent.country,
            street: dependent.street,
            externalNumber: dependent.externalNumber,
            internalNumber: dependent.internalNumber ?? '',
            postalCode: dependent.postalCode,
            federalEntity:
              dependent.country === 'MX'
                ? dependent.federalEntityID || ''
                : dependent.federalEntity,
            city:
              dependent.country === 'MX'
                ? dependent.cityID || ''
                : dependent.city,
            municipality:
              dependent.country === 'MX'
                ? dependent.municipalityID || ''
                : dependent.municipality,
            neighborhood: dependent.neighborhood,
            relationship: Number(dependent.relationship),
            nationality: dependent.nationality,
            phone: dependent.phone.toString(),
          };
        } else {
          return {
            foreignerWithoutCurp: dependent.foreignerWithoutCurp,
            firstName: dependent.firstName,
            middleName: dependent.middleName,
            firstLastName: dependent.firstLastName,
            secondLastName: dependent.secondLastName,
            rfc: compareAndReturnRfcNifTinNss(
              dependent.rfc,
              CustomerAllowedValuesRfcNifTinNss.RFC,
              dependent.typeIden
            ),
            curp: dependent.curp,
            dateOfBirth: '' + convertDate(dependent.dateOfBirth),
            nif: compareAndReturnRfcNifTinNss(
              dependent.rfc,
              CustomerAllowedValuesRfcNifTinNss.NIF,
              dependent.typeIden
            ),
            tin: compareAndReturnRfcNifTinNss(
              dependent.rfc,
              CustomerAllowedValuesRfcNifTinNss.TIN,
              dependent.typeIden
            ),
            nss: compareAndReturnRfcNifTinNss(
              dependent.rfc,
              CustomerAllowedValuesRfcNifTinNss.SSN,
              dependent.typeIden
            ),
            maritalStatus: Number(dependent.maritalStatus),
            countryOfBirth: dependent.countryOfBirth,
            stateOfBirth: dependent.stateOfBirth,
            cityOfBirth: '1',
            occupation: dependent.occupation,
            economicActivity: dependent.businessTurnaround,
            addressType: dependent.addressType,
            other: dependent.other ?? '',
            country: dependent.country,
            street: dependent.street,
            externalNumber: dependent.externalNumber,
            internalNumber: dependent.internalNumber ?? '',
            postalCode: dependent.postalCode,
            federalEntity:
              dependent.country === 'MX'
                ? dependent.federalEntityID || ''
                : dependent.federalEntity,
            city:
              dependent.country === 'MX'
                ? dependent.cityID || ''
                : dependent.city,
            municipality:
              dependent.country === 'MX'
                ? dependent.municipalityID || ''
                : dependent.municipality,
            neighborhood: dependent.neighborhood,
            relationship: Number(dependent.relationship),
            nationality: dependent.nationality,
            phone: dependent.phone.toString(),
          };
        }
      }
    ),
    associations: input.dataClientSocAndAssoPPE.map(
      (association: DataClientSocAndAssoPPE) => ({
        companyName: association.companyName,
        rfc: association.rfc,
        commercialLine: association.commercialBusiness,
        economicActivity: association.economicActivity,
        administratorName: association.administratorManagerAttorney,
        nationality: association.nationality,
        addressType: association.addressType,
        other: association.other ?? '',
        country: association.country,
        street: association.street,
        externalNumber: association.externalNumber,
        internalNumber: association.internalNumber ?? '',
        postalCode: association.postalCode,
        federalEntity:
          association.country === 'MX'
            ? association.federalEntityID || ''
            : association.federalEntity,
        city:
          association.country === 'MX'
            ? association.cityID || ''
            : association.city,
        municipality:
          association.country === 'MX'
            ? association.municipalityID || ''
            : association.municipality,
        neighborhood: association.neighborhood,
        phone: association.phone,
      })
    ),
    familyData: input.dataClientFamilyPPE.map((family: DataClientFamilyPPE) => {
      if (
        family.curp.substring(11, 13) === CustomerSTRINGS.FOREIGN ||
        family.foreignerWithoutCurp
      ) {
        return {
          foreignerWithoutCurp: family.foreignerWithoutCurp,
          firstName: family.firstName,
          middleName: family.middleName,
          firstLastName: family.firstLastName,
          secondLastName: family.secondLastName,
          nif: compareAndReturnRfcNifTinNss(
            family.rfc,
            CustomerAllowedValuesRfcNifTinNss.NIF,
            family.typeIden
          ),
          tin: compareAndReturnRfcNifTinNss(
            family.rfc,
            CustomerAllowedValuesRfcNifTinNss.TIN,
            family.typeIden
          ),
          nss: compareAndReturnRfcNifTinNss(
            family.rfc,
            CustomerAllowedValuesRfcNifTinNss.SSN,
            family.typeIden
          ),
          positionHeld: family.positionHeld,
          positionHeldEndDate: '' + convertDate(family.chargeDueDate),
          relationship: Number(family.relationship),
          nationality: family.nationality,
          rfc: compareAndReturnRfcNifTinNss(
            family.rfc,
            CustomerAllowedValuesRfcNifTinNss.RFC,
            family.typeIden
          ),
          curp: family.curp,
          dateOfBirth: '' + convertDate(family.dateOfBirth),
          maritalStatus: Number(family.maritalStatus),
          countryOfBirth: family.countryOfBirth,
          city: family.stateOfBirth,
          federalEntity: '',
        };
      } else {
        return {
          foreignerWithoutCurp: family.foreignerWithoutCurp,
          firstName: family.firstName,
          middleName: family.middleName,
          firstLastName: family.firstLastName,
          secondLastName: family.secondLastName,
          nif: compareAndReturnRfcNifTinNss(
            family.rfc,
            CustomerAllowedValuesRfcNifTinNss.NIF,
            family.typeIden
          ),
          tin: compareAndReturnRfcNifTinNss(
            family.rfc,
            CustomerAllowedValuesRfcNifTinNss.TIN,
            family.typeIden
          ),
          nss: compareAndReturnRfcNifTinNss(
            family.rfc,
            CustomerAllowedValuesRfcNifTinNss.SSN,
            family.typeIden
          ),
          positionHeld: family.positionHeld,
          positionHeldEndDate: '' + convertDate(family.chargeDueDate),
          relationship: Number(family.relationship),
          nationality: family.nationality,
          rfc: compareAndReturnRfcNifTinNss(
            family.rfc,
            CustomerAllowedValuesRfcNifTinNss.RFC,
            family.typeIden
          ),
          curp: family.curp,
          dateOfBirth: '' + convertDate(family.dateOfBirth),
          maritalStatus: Number(family.maritalStatus),
          countryOfBirth: family.countryOfBirth,
          federalEntity: family.stateOfBirth,
          city: '1',
        };
      }
    }),
  };
}


export function mapFormToCheckPointPpeDataMant(input: DataClientPPE, original: DataClientPPE | null): CustomerProfileData {

  //Busca en los elementos eliminados de cada seccion
  const inputIdsFam = new Set(input.dataClientFamilyPPE.map((data: DataClientFamilyPPE) => data.idS));
  const inputIdsDep = new Set(input.dataClientDepPPE.map((data: DataClientDepPPE) => data.idS));
  const inputIdsAso = new Set(input.dataClientSocAndAssoPPE.map((data: DataClientSocAndAssoPPE) => data.idS));

  //Cambia a false el estatus de los eliminados
  const filteredOriginalFam = original?.dataClientFamilyPPE.filter((data: DataClientFamilyPPE) => {
    return !inputIdsFam.has(data.idS);
  }).map((data: DataClientFamilyPPE) => ({
    ...data,
    isActive: false,
  }));

  const filteredOriginalDep = original?.dataClientDepPPE.filter((data: DataClientDepPPE) => {
    return !inputIdsDep.has(data.idS);
  }).map((data: DataClientDepPPE) => ({
    ...data,
    isActive: false,
  }));

  const filteredOriginalAso = original?.dataClientSocAndAssoPPE.filter((data: DataClientSocAndAssoPPE) => {
    return !inputIdsAso.has(data.idS);
  }).map((data: DataClientSocAndAssoPPE) => ({
    ...data,
    isActive: false,
  }));

  //Combina los eliminados con los que se quedaron activos
  const combinedFam = [...input.dataClientFamilyPPE, ...filteredOriginalFam ?? []];
  const combinedDep = [...input.dataClientDepPPE, ...filteredOriginalDep ?? []];
  const combinedAso = [...input.dataClientSocAndAssoPPE, ...filteredOriginalAso ?? []];


  //Hace el mapeo
  return {
    id: input.id,
    ppeType: input.typePPE ?? '',
    positionHeld: input.positionHeld ?? '',
    expirationDate: '' + convertDate(input.expirationDate ?? ''),
    isPpe: input.ppe,
    hasEconomicDependents: input.dppe.toUpperCase() === 'YES',
    hasAssociations: input.sappe.toUpperCase() === 'YES',
    hasFamilyPpe: input.fppe.toUpperCase() === 'YES',
    economicDependents: combinedDep.map(
      (dependent: DataClientDepPPE) => {
        if (
          dependent.curp.substring(11, 13) === CustomerSTRINGS.FOREIGN ||
          dependent.foreignerWithoutCurp
        ) {
          return {
            foreignerWithoutCurp: dependent.foreignerWithoutCurp,
            firstName: dependent.firstName,
            middleName: dependent.middleName,
            firstLastName: dependent.firstLastName,
            secondLastName: dependent.secondLastName,
            rfc: compareAndReturnRfcNifTinNss(
              dependent.rfc,
              CustomerAllowedValuesRfcNifTinNss.RFC,
              dependent.typeIden
            ),
            curp: dependent.curp,
            dateOfBirth: '' + convertDate(dependent.dateOfBirth),
            nif: compareAndReturnRfcNifTinNss(
              dependent.rfc,
              CustomerAllowedValuesRfcNifTinNss.NIF,
              dependent.typeIden
            ),
            tin: compareAndReturnRfcNifTinNss(
              dependent.rfc,
              CustomerAllowedValuesRfcNifTinNss.TIN,
              dependent.typeIden
            ),
            nss: compareAndReturnRfcNifTinNss(
              dependent.rfc,
              CustomerAllowedValuesRfcNifTinNss.SSN,
              dependent.typeIden
            ),
            maritalStatus: Number(dependent.maritalStatus),
            countryOfBirth: dependent.countryOfBirth,
            stateOfBirth: '',
            cityOfBirth: dependent.stateOfBirth,
            occupation: dependent.occupation,
            economicActivity: dependent.businessTurnaround,
            addressType: dependent.addressType,
            other: dependent.other ?? '',
            country: dependent.country,
            street: dependent.street,
            externalNumber: dependent.externalNumber,
            internalNumber: dependent.internalNumber ?? '',
            postalCode: dependent.postalCode,
            federalEntity:
              dependent.country === 'MX'
                ? dependent.federalEntityID || ''
                : dependent.federalEntity,
            city:
              dependent.country === 'MX'
                ? dependent.cityID || ''
                : dependent.city,
            municipality:
              dependent.country === 'MX'
                ? dependent.municipalityID || ''
                : dependent.municipality,
            neighborhood: dependent.neighborhood,
            relationship: Number(dependent.relationship),
            nationality: dependent.nationality,
            phone: dependent.phone.toString(),
            //CAMPOS de IDs
            id: dependent.idDep, // Correstponde al campo id de CustomerEconomicDependent de la respuesta
            personId: dependent.personId,
            phoneId: dependent.phoneId,
            accountRoleId: dependent.accountRoleId,
            active: dependent.isActive ?? true,
            addressId: dependent.addressId,
            clientIdNum: dependent.clientIdNum,
          };
        } else {
          return {
            foreignerWithoutCurp: dependent.foreignerWithoutCurp,
            firstName: dependent.firstName,
            middleName: dependent.middleName,
            firstLastName: dependent.firstLastName,
            secondLastName: dependent.secondLastName,
            rfc: compareAndReturnRfcNifTinNss(
              dependent.rfc,
              CustomerAllowedValuesRfcNifTinNss.RFC,
              dependent.typeIden
            ),
            curp: dependent.curp,
            dateOfBirth: '' + convertDate(dependent.dateOfBirth),
            nif: compareAndReturnRfcNifTinNss(
              dependent.rfc,
              CustomerAllowedValuesRfcNifTinNss.NIF,
              dependent.typeIden
            ),
            tin: compareAndReturnRfcNifTinNss(
              dependent.rfc,
              CustomerAllowedValuesRfcNifTinNss.TIN,
              dependent.typeIden
            ),
            nss: compareAndReturnRfcNifTinNss(
              dependent.rfc,
              CustomerAllowedValuesRfcNifTinNss.SSN,
              dependent.typeIden
            ),
            maritalStatus: Number(dependent.maritalStatus),
            countryOfBirth: dependent.countryOfBirth,
            stateOfBirth: dependent.stateOfBirth,
            cityOfBirth: '1',
            occupation: dependent.occupation,
            economicActivity: dependent.businessTurnaround,
            addressType: dependent.addressType,
            other: dependent.other ?? '',
            country: dependent.country,
            street: dependent.street,
            externalNumber: dependent.externalNumber,
            internalNumber: dependent.internalNumber ?? '',
            postalCode: dependent.postalCode,
            federalEntity:
              dependent.country === 'MX'
                ? dependent.federalEntityID || ''
                : dependent.federalEntity,
            city:
              dependent.country === 'MX'
                ? dependent.cityID || ''
                : dependent.city,
            municipality:
              dependent.country === 'MX'
                ? dependent.municipalityID || ''
                : dependent.municipality,
            neighborhood: dependent.neighborhood,
            relationship: Number(dependent.relationship),
            nationality: dependent.nationality,
            phone: dependent.phone.toString(),
            //CAMPOS de IDs
            id: dependent.idDep, // Correstponde al campo id de CustomerEconomicDependent de la respuesta
            personId: dependent.personId,
            phoneId: dependent.phoneId,
            accountRoleId: dependent.accountRoleId,
            active: dependent.isActive ?? true,
            addressId: dependent.addressId,
            clientIdNum: dependent.clientIdNum,
          };
        }
      }
    ),
    associations: combinedAso.map(
      (association: DataClientSocAndAssoPPE) => ({
        companyName: association.companyName,
        rfc: association.rfc,
        commercialLine: association.commercialBusiness,
        economicActivity: association.economicActivity,
        administratorName: association.administratorManagerAttorney,
        nationality: association.nationality,
        addressType: association.addressType,
        other: association.other ?? '',
        country: association.country,
        street: association.street,
        externalNumber: association.externalNumber,
        internalNumber: association.internalNumber ?? '',
        postalCode: association.postalCode,
        federalEntity:
          association.country === 'MX'
            ? association.federalEntityID || ''
            : association.federalEntity,
        city:
          association.country === 'MX'
            ? association.cityID || ''
            : association.city,
        municipality:
          association.country === 'MX'
            ? association.municipalityID || ''
            : association.municipality,
        neighborhood: association.neighborhood,
        phone: association.phone,
        //CAMPOS de IDs
        id: association.idAso, // Correstponde al campo id de CustomerAssociation de la respuesta
        personId: association.personId,
        phoneId: association.phoneId,
        active: association.isActive ?? true,
        addressId: association.addressId,
        clientIdNum: association.clientIdNum,
      })
    ),
    familyData: combinedFam.map((family: DataClientFamilyPPE) => {
      if (
        family.curp.substring(11, 13) === CustomerSTRINGS.FOREIGN ||
        family.foreignerWithoutCurp
      ) {
        return {
          foreignerWithoutCurp: family.foreignerWithoutCurp,
          firstName: family.firstName,
          middleName: family.middleName,
          firstLastName: family.firstLastName,
          secondLastName: family.secondLastName,
          nif: compareAndReturnRfcNifTinNss(
            family.rfc,
            CustomerAllowedValuesRfcNifTinNss.NIF,
            family.typeIden
          ),
          tin: compareAndReturnRfcNifTinNss(
            family.rfc,
            CustomerAllowedValuesRfcNifTinNss.TIN,
            family.typeIden
          ),
          nss: compareAndReturnRfcNifTinNss(
            family.rfc,
            CustomerAllowedValuesRfcNifTinNss.SSN,
            family.typeIden
          ),
          positionHeld: family.positionHeld,
          positionHeldEndDate: '' + convertDate(family.chargeDueDate),
          relationship: Number(family.relationship),
          nationality: family.nationality,
          rfc: compareAndReturnRfcNifTinNss(
            family.rfc,
            CustomerAllowedValuesRfcNifTinNss.RFC,
            family.typeIden
          ),
          curp: family.curp,
          dateOfBirth: '' + convertDate(family.dateOfBirth),
          maritalStatus: Number(family.maritalStatus),
          countryOfBirth: family.countryOfBirth,
          city: family.stateOfBirth,
          federalEntity: '',
          //CAMPOS de IDs
          id: family.id,
          personId: family.personId,
          accountRole: family.accountRole,
          active: family.isActive ?? true,
          addressId: family.addressId,
        };
      } else {
        return {
          foreignerWithoutCurp: family.foreignerWithoutCurp,
          firstName: family.firstName,
          middleName: family.middleName,
          firstLastName: family.firstLastName,
          secondLastName: family.secondLastName,
          nif: compareAndReturnRfcNifTinNss(
            family.rfc,
            CustomerAllowedValuesRfcNifTinNss.NIF,
            family.typeIden
          ),
          tin: compareAndReturnRfcNifTinNss(
            family.rfc,
            CustomerAllowedValuesRfcNifTinNss.TIN,
            family.typeIden
          ),
          nss: compareAndReturnRfcNifTinNss(
            family.rfc,
            CustomerAllowedValuesRfcNifTinNss.SSN,
            family.typeIden
          ),
          positionHeld: family.positionHeld,
          positionHeldEndDate: '' + convertDate(family.chargeDueDate),
          relationship: Number(family.relationship),
          nationality: family.nationality,
          rfc: compareAndReturnRfcNifTinNss(
            family.rfc,
            CustomerAllowedValuesRfcNifTinNss.RFC,
            family.typeIden
          ),
          curp: family.curp,
          dateOfBirth: '' + convertDate(family.dateOfBirth),
          maritalStatus: Number(family.maritalStatus),
          countryOfBirth: family.countryOfBirth,
          federalEntity: family.stateOfBirth,
          city: '',
          //CAMPOS de IDs
          id: family.id,
          personId: family.personId,
          accountRole: family.accountRole,
          active: family.isActive ?? true,
          addressId: family.addressId,
        };
      }
    }),
  };
}








