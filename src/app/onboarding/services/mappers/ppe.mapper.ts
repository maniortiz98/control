import {
  DataClientDepPPE,
  DataClientFamilyPPE,
  DataClientPPE,
  DataClientSocAndAssoPPE,
} from '../../../onboarding/models/client-data';
import { convertDate } from '../../../shared/utils/datetime';
import { AllowedValuesRfcNifTinNss, compareAndReturnRfcNifTinNss } from '../../../shared/utils/map-rfc-nif-tin-nss';
import { STRINGS } from '../../constants/constants';
import { ProfileData } from '../../models/checkpoints/ppe-data-checkpoint';

export function mapFormToCheckPointPpeData(input: DataClientPPE): ProfileData {
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
          dependent.curp.substring(11, 13) === STRINGS.FOREIGN ||
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
              AllowedValuesRfcNifTinNss.RFC,
              dependent.typeIden
            ),
            curp: dependent.curp,
            dateOfBirth: '' + convertDate(dependent.dateOfBirth),
            nif: compareAndReturnRfcNifTinNss(
              dependent.rfc,
              AllowedValuesRfcNifTinNss.NIF,
              dependent.typeIden
            ),
            tin: compareAndReturnRfcNifTinNss(
              dependent.rfc,
              AllowedValuesRfcNifTinNss.TIN,
              dependent.typeIden
            ),
            nss: compareAndReturnRfcNifTinNss(
              dependent.rfc,
              AllowedValuesRfcNifTinNss.SSN,
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
              AllowedValuesRfcNifTinNss.RFC,
              dependent.typeIden
            ),
            curp: dependent.curp,
            dateOfBirth: '' + convertDate(dependent.dateOfBirth),
            nif: compareAndReturnRfcNifTinNss(
              dependent.rfc,
              AllowedValuesRfcNifTinNss.NIF,
              dependent.typeIden
            ),
            tin: compareAndReturnRfcNifTinNss(
              dependent.rfc,
              AllowedValuesRfcNifTinNss.TIN,
              dependent.typeIden
            ),
            nss: compareAndReturnRfcNifTinNss(
              dependent.rfc,
              AllowedValuesRfcNifTinNss.SSN,
              dependent.typeIden
            ),
            maritalStatus: Number(dependent.maritalStatus),
            countryOfBirth: dependent.countryOfBirth,
            stateOfBirth: dependent.stateOfBirth,
            cityOfBirth: '',
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
        family.curp.substring(11, 13) === STRINGS.FOREIGN ||
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
            AllowedValuesRfcNifTinNss.NIF,
            family.typeIden
          ),
          tin: compareAndReturnRfcNifTinNss(
            family.rfc,
            AllowedValuesRfcNifTinNss.TIN,
            family.typeIden
          ),
          nss: compareAndReturnRfcNifTinNss(
            family.rfc,
            AllowedValuesRfcNifTinNss.SSN,
            family.typeIden
          ),
          positionHeld: family.positionHeld,
          positionHeldEndDate: '' + convertDate(family.chargeDueDate),
          relationship: Number(family.relationship),
          nationality: family.nationality,
          rfc: compareAndReturnRfcNifTinNss(
            family.rfc,
            AllowedValuesRfcNifTinNss.RFC,
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
            AllowedValuesRfcNifTinNss.NIF,
            family.typeIden
          ),
          tin: compareAndReturnRfcNifTinNss(
            family.rfc,
            AllowedValuesRfcNifTinNss.TIN,
            family.typeIden
          ),
          nss: compareAndReturnRfcNifTinNss(
            family.rfc,
            AllowedValuesRfcNifTinNss.SSN,
            family.typeIden
          ),
          positionHeld: family.positionHeld,
          positionHeldEndDate: '' + convertDate(family.chargeDueDate),
          relationship: Number(family.relationship),
          nationality: family.nationality,
          rfc: compareAndReturnRfcNifTinNss(
            family.rfc,
            AllowedValuesRfcNifTinNss.RFC,
            family.typeIden
          ),
          curp: family.curp,
          dateOfBirth: '' + convertDate(family.dateOfBirth),
          maritalStatus: Number(family.maritalStatus),
          countryOfBirth: family.countryOfBirth,
          federalEntity: family.stateOfBirth,
          city: '',
        };
      }
    }),
  };
}


export function mapFormToCheckPointPpeDataMant(input: DataClientPPE, original: DataClientPPE | null): ProfileData {

  //Busca en los elementos eliminados de cada seccion
  const inputIdsFam = new Set(input.dataClientFamilyPPE.map((data) => data.idS));
  const inputIdsDep = new Set(input.dataClientDepPPE.map((data) => data.idS));
  const inputIdsAso = new Set(input.dataClientSocAndAssoPPE.map((data) => data.idS));

  //Cambia a false el estatus de los eliminados
  const filteredOriginalFam = original?.dataClientFamilyPPE.filter((data) => {
    return !inputIdsFam.has(data.idS);
  }).map((data) => ({
    ...data,
    isActive: false,
  }));

  const filteredOriginalDep = original?.dataClientDepPPE.filter((data) => {
    return !inputIdsDep.has(data.idS);
  }).map((data) => ({
    ...data,
    isActive: false,
  }));

  const filteredOriginalAso = original?.dataClientSocAndAssoPPE.filter((data) => {
    return !inputIdsAso.has(data.idS);
  }).map((data) => ({
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
          dependent.curp.substring(11, 13) === STRINGS.FOREIGN ||
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
              AllowedValuesRfcNifTinNss.RFC,
              dependent.typeIden
            ),
            curp: dependent.curp,
            dateOfBirth: '' + convertDate(dependent.dateOfBirth),
            nif: compareAndReturnRfcNifTinNss(
              dependent.rfc,
              AllowedValuesRfcNifTinNss.NIF,
              dependent.typeIden
            ),
            tin: compareAndReturnRfcNifTinNss(
              dependent.rfc,
              AllowedValuesRfcNifTinNss.TIN,
              dependent.typeIden
            ),
            nss: compareAndReturnRfcNifTinNss(
              dependent.rfc,
              AllowedValuesRfcNifTinNss.SSN,
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
            id: dependent.idDep || null, // Correstponde al campo id de EconomicDependent de la respuesta
            personId: dependent.personId || null,
            phoneId: dependent.phoneId || null,
            accountRoleId: dependent.accountRoleId || null ,
            active: dependent.isActive ?? true,
            addressId: dependent.addressId || null,
            clientIdNum: dependent.clientIdNum || null,
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
              AllowedValuesRfcNifTinNss.RFC,
              dependent.typeIden
            ),
            curp: dependent.curp,
            dateOfBirth: '' + convertDate(dependent.dateOfBirth),
            nif: compareAndReturnRfcNifTinNss(
              dependent.rfc,
              AllowedValuesRfcNifTinNss.NIF,
              dependent.typeIden
            ),
            tin: compareAndReturnRfcNifTinNss(
              dependent.rfc,
              AllowedValuesRfcNifTinNss.TIN,
              dependent.typeIden
            ),
            nss: compareAndReturnRfcNifTinNss(
              dependent.rfc,
              AllowedValuesRfcNifTinNss.SSN,
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
            id: dependent.idDep || null , // Correstponde al campo id de EconomicDependent de la respuesta
            personId: dependent.personId || null,
            phoneId: dependent.phoneId || null,
            accountRoleId: dependent.accountRoleId || null,
            active: dependent.isActive ?? true,
            addressId: dependent.addressId || null ,
            clientIdNum: dependent.clientIdNum || null,
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
        id: association.idAso || null, // Correstponde al campo id de Association de la respuesta
        personId: association.personId || null,
        phoneId: association.phoneId || null,
        active: association.isActive ?? true,
        addressId: association.addressId || null,
        clientIdNum: association.clientIdNum || null,
      })
    ),
    familyData: combinedFam.map((family: DataClientFamilyPPE) => {
      if (
        family.curp.substring(11, 13) === STRINGS.FOREIGN ||
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
            AllowedValuesRfcNifTinNss.NIF,
            family.typeIden
          ),
          tin: compareAndReturnRfcNifTinNss(
            family.rfc,
            AllowedValuesRfcNifTinNss.TIN,
            family.typeIden
          ),
          nss: compareAndReturnRfcNifTinNss(
            family.rfc,
            AllowedValuesRfcNifTinNss.SSN,
            family.typeIden
          ),
          positionHeld: family.positionHeld,
          positionHeldEndDate: '' + convertDate(family.chargeDueDate),
          relationship: Number(family.relationship),
          nationality: family.nationality,
          rfc: compareAndReturnRfcNifTinNss(
            family.rfc,
            AllowedValuesRfcNifTinNss.RFC,
            family.typeIden
          ),
          curp: family.curp,
          dateOfBirth: '' + convertDate(family.dateOfBirth),
          maritalStatus: Number(family.maritalStatus),
          countryOfBirth: family.countryOfBirth,
          city: family.stateOfBirth,
          federalEntity: '',
          //CAMPOS de IDs
          id: family.id || null,
          personId: family.personId || null,
          accountRole: family.accountRole || null,
          active: family.isActive ?? true,
          addressId: family.addressId || null,
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
            AllowedValuesRfcNifTinNss.NIF,
            family.typeIden
          ),
          tin: compareAndReturnRfcNifTinNss(
            family.rfc,
            AllowedValuesRfcNifTinNss.TIN,
            family.typeIden
          ),
          nss: compareAndReturnRfcNifTinNss(
            family.rfc,
            AllowedValuesRfcNifTinNss.SSN,
            family.typeIden
          ),
          positionHeld: family.positionHeld,
          positionHeldEndDate: '' + convertDate(family.chargeDueDate),
          relationship: Number(family.relationship),
          nationality: family.nationality,
          rfc: compareAndReturnRfcNifTinNss(
            family.rfc,
            AllowedValuesRfcNifTinNss.RFC,
            family.typeIden
          ),
          curp: family.curp,
          dateOfBirth: '' + convertDate(family.dateOfBirth),
          maritalStatus: Number(family.maritalStatus),
          countryOfBirth: family.countryOfBirth,
          federalEntity: family.stateOfBirth,
          city: '',
          //CAMPOS de IDs
          id: family.id || null,
          personId: family.personId || null,
          accountRole: family.accountRole || null ,
          active: family.isActive ?? true,
          addressId: family.addressId || null,
        };
      }
    }),
  };
}
