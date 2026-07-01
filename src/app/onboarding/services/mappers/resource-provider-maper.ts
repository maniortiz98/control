import { convertDate, formatDateSimple } from "../../../shared/utils/datetime";
import { compareAndReturnRfcNifTinNss, AllowedValuesRfcNifTinNss } from "../../../shared/utils/map-rfc-nif-tin-nss";
import { compareAndReturnGender } from "../../../shared/utils/maper-gender";
import { STRINGS } from "../../constants/constants";
import { Data } from "../../models/checkpoints/resources-provider";
import { ResourceProviderData } from "../../models/resource-provider";

export function mapToCheckPointResourceProvider(input: ResourceProviderData): Data {
  let data: Data;
  data = {
    generalData: {
      foreignerWithoutCurp: input.generalData.foreignerWithoutCurp,
      curp: input.generalData.curp,
      rfc: compareAndReturnRfcNifTinNss(input.generalData.rfc, AllowedValuesRfcNifTinNss.RFC, input.generalData.typeIden) === '' ? null : compareAndReturnRfcNifTinNss(input.generalData.rfc, AllowedValuesRfcNifTinNss.RFC, input.generalData.typeIden),
      nif: compareAndReturnRfcNifTinNss(input.generalData.rfc, AllowedValuesRfcNifTinNss.NIF, input.generalData.typeIden) === '' ? null : compareAndReturnRfcNifTinNss(input.generalData.rfc, AllowedValuesRfcNifTinNss.NIF, input.generalData.typeIden),
      tin: compareAndReturnRfcNifTinNss(input.generalData.rfc, AllowedValuesRfcNifTinNss.TIN, input.generalData.typeIden) === '' ? null : compareAndReturnRfcNifTinNss(input.generalData.rfc, AllowedValuesRfcNifTinNss.TIN, input.generalData.typeIden),
      nss: compareAndReturnRfcNifTinNss(input.generalData.rfc, AllowedValuesRfcNifTinNss.SSN, input.generalData.typeIden) === '' ? null : compareAndReturnRfcNifTinNss(input.generalData.rfc, AllowedValuesRfcNifTinNss.SSN, input.generalData.typeIden),
      country: '',
      firstName: input.generalData.firstName,
      middleName: input.generalData.middleName,
      firstLastName: input.generalData.firstLastName,
      secondLastName: input.generalData.secondLastName,
      dateOfBirth: ''+convertDate(input.generalData.dateOfBirth),
      gender: compareAndReturnGender(input.generalData.gender),
      nationality: input.generalData.nationality,
      countryOfBirth: input.generalData.countryOfBirth,
      federalEntity: (input.generalData.foreignerWithoutCurp === false && input.generalData.curp.substring(11, 13) != STRINGS.FOREIGN) ? input.generalData.stateOfBirth : '',
      cityOfBirth: (input.generalData.foreignerWithoutCurp === true || input.generalData.curp.substring(11, 13) === STRINGS.FOREIGN) ? input.generalData.stateOfBirth : '',
      countryFiscal: input.generalData.countryTaxCodeAbroad || '',
      relationship: Number(input.generalData.relationship),
      economicActivity: input.generalData.economicActivity,
      fiel: input.generalData.field,
      expirationFielDate: '' + convertDate(input.generalData.expirationDateField),
      phone: input.generalData.phone,
      email: input.generalData.mail,
      personType: input.generalData.typePerson || ""
    },
    personPpe: {
      isPpe: input.ppe.ppe,
      ppeType: input.ppe.tppe,
      positionHeld: input.ppe.positionHeld,
      positionEndDate: '' + convertDate(input.ppe.expirationDate),
      hasppeRelatives: input.ppe.fppe,
      ppeRelatives: input.ppe.dataFamily?.map((data) => ({
        curp: data.curp,
        foreignerWithoutCurp: data.foreignerWithoutCurp,
        rfc: compareAndReturnRfcNifTinNss(data.rfc, AllowedValuesRfcNifTinNss.RFC, data.typeIden) === '' ? null : compareAndReturnRfcNifTinNss(data.rfc, AllowedValuesRfcNifTinNss.RFC, data.typeIden),
        nif: compareAndReturnRfcNifTinNss(data.rfc, AllowedValuesRfcNifTinNss.NIF, data.typeIden) === '' ? null : compareAndReturnRfcNifTinNss(data.rfc, AllowedValuesRfcNifTinNss.NIF, data.typeIden),
        tin: compareAndReturnRfcNifTinNss(data.rfc, AllowedValuesRfcNifTinNss.TIN, data.typeIden) === '' ? null : compareAndReturnRfcNifTinNss(data.rfc, AllowedValuesRfcNifTinNss.TIN, data.typeIden),
        nss: compareAndReturnRfcNifTinNss(data.rfc, AllowedValuesRfcNifTinNss.SSN, data.typeIden) === '' ? null : compareAndReturnRfcNifTinNss(data.rfc, AllowedValuesRfcNifTinNss.SSN, data.typeIden),
        firstName: data.firstName,
        middleName: data.middleName,
        firstLastName: data.firstLastName,
        secondLastName: data.secondLastName,
        nationality: data.nationality,
        countryOfBirth: data.countryOfBirth,
        countryFiscal: data.countryTaxCodeAbroad || '',
        relationship: Number(data.relationship),
        positionHeld: data.positionHeld,
        dateOfBirth: ''+convertDate(data.dateOfBirth),
        positionEndDate: '' + convertDate(data.chargeDueDate),
      })),
    },
    resourceProviderAddress: {
      addressType: input.adrres.addressType,
      other: input.adrres.other || "",
      country: input.adrres.country,
      postalCode: input.adrres.postalCode,
      federalEntity: input.adrres.country === 'MX' ? input.adrres.federalEntityID || '' : input.adrres.federalEntity,
      municipality: input.adrres.country === 'MX' ? input.adrres.municipalityID || '' : input.adrres.municipality,
      city: input.adrres.country === 'MX' ? input.adrres.cityID || '' : input.adrres.city,
      neighborhood: input.adrres.neighborhood,
      street: input.adrres.street,
      externalNumber: input.adrres.externalNumber,
      internalNumber: input.adrres.internalNumber || ""
    }
  };
  return data;
}

export function mapToCheckPointResourceProviderMant(input: ResourceProviderData, original: ResourceProviderData | null): Data {
  const inputIds = new Set(input.ppe.dataFamily?.map((data) => data.idS));

  const filteredOriginal = original?.ppe.dataFamily?.filter((data) => {
    return !inputIds.has(data.idS);
  })?.map((data) => ({
    ...data,
    active: false,
  }));

  const combinedFam = [...input.ppe.dataFamily, ...filteredOriginal ?? []];

  let data: Data;
  data = {
    generalData: {
      foreignerWithoutCurp: input.generalData.foreignerWithoutCurp,
      curp: input.generalData.curp,
      rfc: compareAndReturnRfcNifTinNss(input.generalData.rfc, AllowedValuesRfcNifTinNss.RFC, input.generalData.typeIden) === '' ? null : compareAndReturnRfcNifTinNss(input.generalData.rfc, AllowedValuesRfcNifTinNss.RFC, input.generalData.typeIden),
      nif: compareAndReturnRfcNifTinNss(input.generalData.rfc, AllowedValuesRfcNifTinNss.NIF, input.generalData.typeIden) === '' ? null : compareAndReturnRfcNifTinNss(input.generalData.rfc, AllowedValuesRfcNifTinNss.NIF, input.generalData.typeIden),
      tin: compareAndReturnRfcNifTinNss(input.generalData.rfc, AllowedValuesRfcNifTinNss.TIN, input.generalData.typeIden) === '' ? null : compareAndReturnRfcNifTinNss(input.generalData.rfc, AllowedValuesRfcNifTinNss.TIN, input.generalData.typeIden),
      nss: compareAndReturnRfcNifTinNss(input.generalData.rfc, AllowedValuesRfcNifTinNss.SSN, input.generalData.typeIden) === '' ? null : compareAndReturnRfcNifTinNss(input.generalData.rfc, AllowedValuesRfcNifTinNss.SSN, input.generalData.typeIden),
      country: '',
      firstName: input.generalData.firstName,
      middleName: input.generalData.middleName,
      firstLastName: input.generalData.firstLastName,
      secondLastName: input.generalData.secondLastName,
      dateOfBirth: ''+convertDate(input.generalData.dateOfBirth),
      gender: compareAndReturnGender(input.generalData.gender),
      nationality: input.generalData.nationality,
      countryOfBirth: input.generalData.countryOfBirth,
      federalEntity: (input.generalData.foreignerWithoutCurp === false && input.generalData.curp.substring(11, 13) != STRINGS.FOREIGN) ? input.generalData.stateOfBirth : '',
      cityOfBirth: (input.generalData.foreignerWithoutCurp === true || input.generalData.curp.substring(11, 13) === STRINGS.FOREIGN) ? input.generalData.stateOfBirth : '',
      countryFiscal: input.generalData.countryTaxCodeAbroad || '',
      relationship: Number(input.generalData.relationship),
      economicActivity: input.generalData.economicActivity,
      fiel: input.generalData.field,
      expirationFielDate: '' + convertDate(input.generalData.expirationDateField),
      phone: input.generalData.phone,
      email: input.generalData.mail,
      personType: input.generalData.typePerson || "",
      accountRoleId: original?.generalData?.accountRoleId,
      active: original?.generalData.active ?? true,
    },
    personPpe: {
      isPpe: input.ppe.ppe,
      ppeType: input.ppe.tppe,
      positionHeld: input.ppe.positionHeld,
      positionEndDate: '' + convertDate(input.ppe.expirationDate),
      hasppeRelatives: input.ppe.fppe,
      active: original?.ppe.active ?? true,
      personPpeId:  original?.ppe.personPpeId,
      ppeRelatives: combinedFam?.map((data) => ({
        curp: data.curp,
        foreignerWithoutCurp: data.foreignerWithoutCurp,
        rfc: compareAndReturnRfcNifTinNss(data.rfc, AllowedValuesRfcNifTinNss.RFC, data.typeIden) === '' ? null : compareAndReturnRfcNifTinNss(data.rfc, AllowedValuesRfcNifTinNss.RFC, data.typeIden),
        nif: compareAndReturnRfcNifTinNss(data.rfc, AllowedValuesRfcNifTinNss.NIF, data.typeIden) === '' ? null : compareAndReturnRfcNifTinNss(data.rfc, AllowedValuesRfcNifTinNss.NIF, data.typeIden),
        tin: compareAndReturnRfcNifTinNss(data.rfc, AllowedValuesRfcNifTinNss.TIN, data.typeIden) === '' ? null : compareAndReturnRfcNifTinNss(data.rfc, AllowedValuesRfcNifTinNss.TIN, data.typeIden),
        nss: compareAndReturnRfcNifTinNss(data.rfc, AllowedValuesRfcNifTinNss.SSN, data.typeIden) === '' ? null : compareAndReturnRfcNifTinNss(data.rfc, AllowedValuesRfcNifTinNss.SSN, data.typeIden),
        dateOfBirth: '' + convertDate(data.dateOfBirth),
        firstName: data.firstName,
        middleName: data.middleName,
        firstLastName: data.firstLastName,
        secondLastName: data.secondLastName,
        nationality: data.nationality,
        countryOfBirth: data.countryOfBirth,
        countryFiscal: data.countryTaxCodeAbroad || '',
        relationship: Number(data.relationship),
        positionHeld: data.positionHeld,
        positionEndDate: '' + convertDate(data.chargeDueDate),
        accountRole:data.accountRoleId ?? 0,
        active:data.active ?? true
      })),
    },
    resourceProviderAddress: {
      addressId: original?.adrres.addressId,
      addressType: input.adrres.addressType,
      other: input.adrres.other || "",
      country: input.adrres.country,
      postalCode: input.adrres.postalCode,
      federalEntity: input.adrres.country === 'MX' ? input.adrres.federalEntityID || '' : input.adrres.federalEntity,
      municipality: input.adrres.country === 'MX' ? input.adrres.municipalityID || '' : input.adrres.municipality,
      city: input.adrres.country === 'MX' ? input.adrres.cityID || '' : input.adrres.city,
      neighborhood: input.adrres.neighborhood,
      street: input.adrres.street,
      externalNumber: input.adrres.externalNumber,
      internalNumber: input.adrres.internalNumber || ""
    }
  };
  return data;
}
function date(date: any, curp: string): string {
  if (curp === '') {
    return '' + convertDate(date);
  } else {
    return formatDateSimple(date)
  }
}
