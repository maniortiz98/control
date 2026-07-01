import { convertDate, convertDateBack, formatDateSimple } from "../../../shared/utils/datetime";
import { AllowedValuesRfcNifTinNss, compareAndReturnIdRfcNifTinNss, compareAndReturnRfcNifTinNss, compareAndReturnValueRfcNifTinNss, rfcNifTinNssValueByType } from "../../../shared/utils/map-rfc-nif-tin-nss";
import { compareAndReturnGender, compareGenderAndReturnValue } from "../../../shared/utils/maper-gender";
import { STRINGS } from "../../constants/constants";
import { BeneficiariesCheckpointSingle, BeneficiariesCurrentTableData } from "../../models/checkpoints/beneficiaries";

/**
 * This mapper, receives the data stored for Beneficiaries page
 * and return the object neccesary to perform the checkpoint.
 */
export function toCheckpoint(data: any): Array<BeneficiariesCheckpointSingle> {

  return data.map((item: any) => {
    console.log(item);
    let federalEntity = item.clientData.stateOfBirth ?? '';
    let city = '';

    if (item.clientData.curp.substring(11, 13) === STRINGS.FOREIGN || item.clientData.foreignerWithoutCurp ) {
      federalEntity = '';
      city = item.clientData.federalEntity ?? '';
    }

    return {
      curp: item.clientData.curp,
      foreignWithoutCURP: item.clientData.foreignWithoutCURP ?? false,
      rfc: item.clientData.rfc,
      nss: compareAndReturnRfcNifTinNss(item.clientData.rfc, AllowedValuesRfcNifTinNss.SSN, item.clientData.typeIden),
      nif: compareAndReturnRfcNifTinNss(item.clientData.rfc, AllowedValuesRfcNifTinNss.NIF, item.clientData.typeIden),
      tin: compareAndReturnRfcNifTinNss(item.clientData.rfc, AllowedValuesRfcNifTinNss.TIN, item.clientData.typeIden),
      country: item.clientData.countryOfBirth,
      firstName: item.clientData.firstName,
      middleName: item.clientData.middleName,
      firstLastName: item.clientData.firstLastName,
      secondLastName: item.clientData.secondLastName,
      dateOfBirth: convertDate(item.clientData.dateOfBirth ?? ''),
      gender: compareAndReturnGender(item.clientData.gender),
      relationship: +item.relationShip,
      beneficiaryPercentage: item.percentage,
      maritalStatus        : item.clientData.maritalStatus,
      nationality          : item.clientData.nationality,
      federalEntity        : federalEntity,
      address: {
        addressType   : item.addressData.addressType ?? '',
        country       : item.addressData.country ?? '',
        street        : item.addressData.street ?? '',
        externalNumber: item.addressData.externalNumber ?? '',
        internalNumber: item.addressData.internalNumber ?? '',
        postalCode    : item.addressData.postalCode ?? '',
        federalEntity : item.addressData.country === 'MX' ? item.addressData.federalEntityID || '' : item.addressData.federalEntity,
        municipality  : item.addressData.country === 'MX' ? item.addressData.municipalityID || '' : item.addressData.municipality,
        neighborhood  : item.addressData.neighborhood ?? '',
        city          : item.addressData.country === 'MX' ? item.addressData.cityID || '' : item.addressData.city,
      }
    };
  });
}

/**
 * used in ONBOARDING
 * map info from service to signal data section.
 */
export function mapToSignalBeneficiaries(beneficiaries: any): BeneficiariesCurrentTableData[] {
  if (!beneficiaries) {
    return [];
  }
  return beneficiaries.map((beneficiary: any) => ({
    clientData: {
      ppe: false,
      bankAreaTypeId: '',
      contraTypeId: '',
      typeContractSubtypeId: '',
      curp: beneficiary.curp || '',
      foreignerWithoutCurp: beneficiary.foreignWithoutCURP || false,
      firstName: beneficiary.firstName || '',
      middleName: beneficiary.middleName || '',
      firstLastName: beneficiary.firstLastName || '',
      secondLastName: beneficiary.secondLastName || '',
      typeIden: compareAndReturnIdRfcNifTinNss(beneficiary.rfc || '', beneficiary.nif || '', beneficiary.tin || '', beneficiary.nss || ''),
      rfc: compareAndReturnValueRfcNifTinNss(beneficiary.rfc || '', beneficiary.nif || '', beneficiary.tin || '', beneficiary.nss || ''),
      dateOfBirth: beneficiary.dateOfBirth || '',
      gender: compareGenderAndReturnValue(Number(beneficiary.gender) || 0),
      maritalStatus: beneficiary.maritalStatus || '',
      nationality: beneficiary.nationality || '',
      countryOfBirth: beneficiary.country || '',
      stateOfBirth: beneficiary.federalEntity || '',
    },
    addressData: {
      addressType: beneficiary.address?.addressType || '',
      country: beneficiary.address?.country || '',
      street: beneficiary.address?.street || '',
      externalNumber: beneficiary.address?.externalNumber || '',
      internalNumber: beneficiary.address?.internalNumber || '',
      postalCode: beneficiary.address?.postalCode || '',
      federalEntity: beneficiary.address?.federalEntity || '',
      municipality: beneficiary.address?.municipality || '',
      neighborhood: beneficiary.address?.neighborhood || '',
      city: beneficiary.address?.city || '',
    },
    firstName: beneficiary.firstName || '',
    lastName: beneficiary.firstLastName || '',
    relationShip: beneficiary.relationship?.toString() || '',
    percentage: beneficiary.beneficiaryPercentage || '',
    sameAddress: false, // Asumido como constante
    tempId: crypto.randomUUID(),
    active: true
  }));

}

/**
 * MAINTENANCE mapper.
 * Used to pass data to service.
 */
export function beneficiariesMapperSaveMaint(data: any): Array<BeneficiariesCheckpointSingle> {

  console.log(data);

  return data.map((item: any) => {
    console.log(item);

    let federalEntity = item.clientData.stateOfBirth ?? '';

    if (item.clientData.curp.substring(11, 13) === STRINGS.FOREIGN || item.clientData.foreignerWithoutCurp ) {
      federalEntity = '';
    }

    let gender = item.clientData.gender ?? 'H';
    gender = compareAndReturnGender(gender).toString();

    return {
      beneficiaryId        : item.beneficiaryId ?? null,
      personId             : item.personId ?? null,
      accountRoleId        : item.accountRoleId ?? null,
      active               : item.active,
      curp                 : item.clientData.curp,
      foreignWithoutCURP   : item.clientData.foreignerWithoutCurp,
      rfc                  : rfcNifTinNssValueByType('RFC', item.clientData.typeIden, item.clientData.rfc),
      nif                  : rfcNifTinNssValueByType('NIF', item.clientData.typeIden, item.clientData.rfc),
      tin                  : rfcNifTinNssValueByType('TIN', item.clientData.typeIden, item.clientData.rfc),
      nss                  : rfcNifTinNssValueByType('SSN', item.clientData.typeIden, item.clientData.rfc),
      country              : item.clientData.countryOfBirth,
      firstName            : item.clientData.firstName,
      middleName           : item.clientData.middleName,
      firstLastName        : item.clientData.firstLastName,
      secondLastName       : item.clientData.secondLastName,
      dateOfBirth          : convertDate(item.clientData.dateOfBirth).toString(),
      gender               : gender,
      relationship         : item.relationShip,
      beneficiaryPercentage: item.percentage,
      maritalStatus        : "1", // by default. not shown on section.
      nationality          : item.clientData.nationality,
      federalEntity        : federalEntity,
      address: {
        addressId     : item.addressData.addressId ?? null,
        addressType   : item.addressData.addressType,
        country       : item.addressData.country,
        street        : item.addressData.street,
        externalNumber: item.addressData.externalNumber,
        internalNumber: item.addressData.internalNumber,
        postalCode    : item.addressData.postalCode,
        federalEntity : item.addressData.country === 'MX' ? item.addressData.federalEntityID || '' : item.addressData.federalEntity,
        municipality  : item.addressData.country === 'MX' ? item.addressData.municipalityID || '' : item.addressData.municipality,
        neighborhood  : item.addressData.neighborhood ?? '',
        city          : item.addressData.country === 'MX' ? item.addressData.cityID || '' : item.addressData.city,
      }
    };
  });
}


/**
 * MAINTENANCE mapper.
 * Used to pass data from service to signal data section.
 */
export function beneficiariesMapperQueryMaint(data: any): any {
  console.log(data);
  return data.map((item: any) => {
    console.log(item);

    let percentage: any = Number(item.beneficiaryPercentage);
    percentage = isNaN(percentage) ? '0' : percentage.toString();

    return {
      beneficiaryId: item.beneficiaryId,
      personId     : item.personId,
      accountRoleId: item.accountRoleId,
      active       : item.active,
      clientData: {
        curp                : item.curp,
        foreignerWithoutCurp: item.foreignWithoutCURP,
        rfc                 : item.rfc ?? item.nif ?? item.tin ?? item.nss,
        firstName           : item.firstName,
        middleName          : item.middleName,
        dateOfBirth         : customConvertDate(item.dateOfBirth), //dateOfBirth: "1950-12-20", dateOfBirth: "14/06/1958"
        firstLastName       : item.firstLastName,
        secondLastName      : item.secondLastName,
        gender              : compareGenderAndReturnValue(item.gender),
        maritalStatus       : "",
        nationality         : item.nationality,
        countryOfBirth      : item.country,
        stateOfBirth        : item.federalEntity ?? '',
        countryTaxCodeAbroad: "",
        typeIden: compareAndReturnIdRfcNifTinNss(
          item.rfc,
          item.nif,
          item.tin,
          item.nss
        ),
      },
      addressData: {
        addressId: item.address.addressId,
        // addressRole: "",
        addressType: item.address.addressType,
        // other: "",
        country    : item.address.country,
        postalCode : item.address.postalCode,
        // federalEntity: "AGUASCALIENTES",
        city: item.address.city,
        municipality: item.address.municipality,
        neighborhood  : item.address.neighborhood ?? '',
        street        : item.address.street,
        externalNumber: item.address.externalNumber,
        internalNumber: item.address.internalNumber,
        // confirmCp: null,
        // timeLiveMexico: "",
        // reasonsOpeningContractMexico: "",
        // proofOfAddressType: "",
        // addressProofIssueDate: "",
        // expirationYear: "",
        // taxPostalCode: "",
        // geographicalArea: "B",
        // deliveryCenter: "20001",
        federalEntity: item.address.federalEntity,
        cityID: item.address.city,
        municipalityID: item.address.municipality,
        federalEntityID: item.address.federalEntity
      },
      firstName       : item.firstName,
      lastName        : item.firstLastName,
      relationShip    : item.relationship,
      relationShipName: '',
      percentage      : percentage,
      sameAddress     : false,
      tempId          : crypto.randomUUID()
    };
  });

}
// TODO quitar este método, ya existe uno en: src\app\shared\utils\datetime.ts:157
/**
 * Customer date convert function
 *
 * from : "14/06/1958"
 * to   : "1958-06-14"
 *
 * if fails, return an empty string
 */
function customConvertDate(dd: string): string {
  let rr = '';
  const tt = dd.split('/');
  try {
    rr = `${tt[2]}-${tt[1]}-${tt[0]}`;
  } catch (err) {
    console.log(dd, tt);
  }
  return rr;
}
