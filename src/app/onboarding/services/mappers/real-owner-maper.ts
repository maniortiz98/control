import { convertDate, convertDateToStr, formatDateSimple } from "../../../shared/utils/datetime";
import { AllowedValuesRfcNifTinNss, compareAndReturnRfcNifTinNss } from "../../../shared/utils/map-rfc-nif-tin-nss";
import { compareAndReturnGender } from "../../../shared/utils/maper-gender";
import { STRINGS } from "../../constants/constants";
import { Data } from "../../models/checkpoints/real-owner";
import { RealOwnerData } from "../../models/real-owner";

export function mapToCheckPointRealOwner(input: RealOwnerData): Data {
  let data: Data;
  console.log(input)
  data = {
    generalData: {
      personType: input.generalData.typePerson || '1',
      foreignWithoutCURP: input.generalData.foreignerWithoutCurp,
      curp: input.generalData.curp,
      rfc: compareAndReturnRfcNifTinNss(input.generalData.rfc, AllowedValuesRfcNifTinNss.RFC, input.generalData.typeIden) === '' ? null : compareAndReturnRfcNifTinNss(input.generalData.rfc, AllowedValuesRfcNifTinNss.RFC, input.generalData.typeIden),
      nif: compareAndReturnRfcNifTinNss(input.generalData.rfc, AllowedValuesRfcNifTinNss.NIF, input.generalData.typeIden) === '' ? null : compareAndReturnRfcNifTinNss(input.generalData.rfc, AllowedValuesRfcNifTinNss.NIF, input.generalData.typeIden),
      tin: compareAndReturnRfcNifTinNss(input.generalData.rfc, AllowedValuesRfcNifTinNss.TIN, input.generalData.typeIden) === '' ? null : compareAndReturnRfcNifTinNss(input.generalData.rfc, AllowedValuesRfcNifTinNss.TIN, input.generalData.typeIden),
      nss: compareAndReturnRfcNifTinNss(input.generalData.rfc, AllowedValuesRfcNifTinNss.SSN, input.generalData.typeIden) === '' ? null : compareAndReturnRfcNifTinNss(input.generalData.rfc, AllowedValuesRfcNifTinNss.SSN, input.generalData.typeIden),
      countryFiscal: input.generalData.countryTaxCodeAbroad ?? '',
      cityOfBirth: (input.generalData.foreignerWithoutCurp === true || input.generalData.curp.substring(11, 13) === STRINGS.FOREIGN) ? input.generalData.stateOfBirth : '',
      firstName: input.generalData.firstName,
      middleName: input.generalData.middleName,
      firstLastName: input.generalData.firstLastName,
      secondLastName: input.generalData.secondLastName,
      dateOfBirth: ''+convertDate(input.generalData.dateOfBirth),
      gender: compareAndReturnGender(input.generalData.gender),
      nationality: input.generalData.nationality,
      countryOfBirth: input.generalData.countryOfBirth,
      federalEntity: (input.generalData.foreignerWithoutCurp === false && input.generalData.curp.substring(11, 13) != STRINGS.FOREIGN) ? input.generalData.stateOfBirth : '',
      relationship: Number(input.generalData.relationship),
      economicActivity: input.generalData.economicActivity,
      fiel: input.generalData.field,
      fielExpirationDate: '' + convertDate(input.generalData.expirationDateField),
      phone: Number(input.generalData.phone),
      email: input.generalData.mail
    },
    personPpe: {
      isPpe: input.ppe.ppe,
      ppeType: input.ppe.tppe,
      positionHeld: input.ppe.positionHeld,
      positionEndDate: ''+convertDate(input.ppe.expirationDate),
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
        relationship: Number(data.relationship),
        positionHeld: data.positionHeld,
        positionEndDate: ''+convertDate(data.chargeDueDate),
        dateOfBirth:''+convertDate(data.dateOfBirth),
        federalEntity:"",
        countryFiscal: data.countryTaxCodeAbroad || ''
      })),
    },
    addressRealOwner: {
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

function date(date: any, curp: string) : string{
  if(curp ===''){
    return ''+convertDate(date);
  }else{
    return formatDateSimple(date)
  }
}

export function mapToCheckPointRealOwnerMant(input: RealOwnerData, original: RealOwnerData | null): Data {
  let data: Data;
  console.log(input);
  console.log({original});
  const inputIds = new Set(input.ppe.dataFamily?.map((data) => data.idS));
  console.log(inputIds);
  const filteredOriginal = original?.ppe.dataFamily?.filter((data) => {
    return !inputIds.has(data.idS);
  })?.map((data) => ({
    ...data,
    active: false,
  }));

  console.log(filteredOriginal);
  const combinedFam = [...input.ppe.dataFamily, ...filteredOriginal ?? []];

  data = {
    generalData: {
      personType: input.generalData.typePerson || '1',
      foreignWithoutCURP: input.generalData.foreignerWithoutCurp,
      curp: input.generalData.curp,
      rfc: compareAndReturnRfcNifTinNss(input.generalData.rfc, AllowedValuesRfcNifTinNss.RFC, input.generalData.typeIden) === '' ? null : compareAndReturnRfcNifTinNss(input.generalData.rfc, AllowedValuesRfcNifTinNss.RFC, input.generalData.typeIden),
      nif: compareAndReturnRfcNifTinNss(input.generalData.rfc, AllowedValuesRfcNifTinNss.NIF, input.generalData.typeIden) === '' ? null : compareAndReturnRfcNifTinNss(input.generalData.rfc, AllowedValuesRfcNifTinNss.NIF, input.generalData.typeIden),
      tin: compareAndReturnRfcNifTinNss(input.generalData.rfc, AllowedValuesRfcNifTinNss.TIN, input.generalData.typeIden) === '' ? null : compareAndReturnRfcNifTinNss(input.generalData.rfc, AllowedValuesRfcNifTinNss.TIN, input.generalData.typeIden),
      nss: compareAndReturnRfcNifTinNss(input.generalData.rfc, AllowedValuesRfcNifTinNss.SSN, input.generalData.typeIden) === '' ? null : compareAndReturnRfcNifTinNss(input.generalData.rfc, AllowedValuesRfcNifTinNss.SSN, input.generalData.typeIden),
      countryFiscal: input.generalData.countryTaxCodeAbroad ?? '',
      cityOfBirth: (input.generalData.foreignerWithoutCurp === true || input.generalData.curp.substring(11, 13) === STRINGS.FOREIGN) ? input.generalData.stateOfBirth : '',
      firstName: input.generalData.firstName,
      middleName: input.generalData.middleName,
      firstLastName: input.generalData.firstLastName,
      secondLastName: input.generalData.secondLastName,
      dateOfBirth: ''+convertDate(input.generalData.dateOfBirth),
      gender: compareAndReturnGender(input.generalData.gender),
      nationality: input.generalData.nationality,
      countryOfBirth: input.generalData.countryOfBirth,
      federalEntity: (input.generalData.foreignerWithoutCurp === false && input.generalData.curp.substring(11, 13) != STRINGS.FOREIGN) ? input.generalData.stateOfBirth : '',
      relationship: (input.generalData.relationship),
      economicActivity: input.generalData.economicActivity,
      fiel: input.generalData.field,
      fielExpirationDate: '' + convertDate(input.generalData.expirationDateField),
      phone: (input.generalData.phone),
      email: input.generalData.mail,
      rolAccountId: original?.generalData?.id !== 0 ? original?.generalData?.id : null, //Se envia en mantenimiento
      personId: original?.generalData?.personId !== 0 ? original?.generalData?.personId : null   //Se envia en mantenimiento
    },
    personPpe: {
      id: original?.ppe.id,
      isPpe: input.ppe.ppe,
      ppeType: input.ppe.tppe,
      positionHeld: input.ppe.positionHeld,
      positionEndDate: ''+convertDate(input.ppe.expirationDate),
      hasppeRelatives: input.ppe.fppe,
      ppeRelatives: combinedFam?.map((data) => ({
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
        relationship: (data.relationship ?? ''),
        positionHeld: data.positionHeld,
        positionEndDate: ''+convertDate(data.chargeDueDate),
        dateOfBirth:''+convertDate(data.dateOfBirth),
        federalEntity:"",
        countryFiscal: data.countryTaxCodeAbroad || '',
        id: data.idM, //Se envia en mantenimiento
        personId: data.personId, //Se envia en mantenimiento
        accountRoleId: data.accountRoleId, //Se envia en mantenimiento
        active: data.active ?? true, //Se envia en mantenimiento
      })),
    },
    addressRealOwner: {
      addressType: input.adrres.addressType,
      other: input.adrres.other || "",
      country: input.adrres.country,
      postalCode: (input.adrres.postalCode),
      federalEntity: input.adrres.country === 'MX' ? input.adrres.federalEntityID || '' : input.adrres.federalEntity,
      municipality: input.adrres.country === 'MX' ? input.adrres.municipalityID || '' : input.adrres.municipality,
      city: input.adrres.country === 'MX' ? input.adrres.cityID || '' : input.adrres.city,
      neighborhood: (input.adrres.neighborhood),
      street: input.adrres.street,
      externalNumber: (input.adrres.externalNumber),
      internalNumber: input.adrres.internalNumber || "",
      addressId: original?.adrres.id //Se envia en mantenimiento
    }
  };
  return data;
}
