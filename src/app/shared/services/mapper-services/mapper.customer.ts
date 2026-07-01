import { Data } from '../../../customer/models/checkpoints/initial-data-checkpoint';
import { STRINGS } from '../../../customer/constants/constants';
import {
  Client,
  DataClient,
} from '../../../customer/models/client-data';
import {
  convertDate,
  formatDateYYYYMMDD,
} from '../../utils/datetime';
import { FiscalSelfDeclaration } from '../../../customer/models/checkpoints/fiscal-self-declaration-checkpoint';
import {
  AllowedValuesRfcNifTinNss,
  compareAndReturnIdRfcNifTinNss,
  compareAndReturnRfcNifTinNss,
} from '../../utils/map-rfc-nif-tin-nss';
import {
  compareAndReturnGender,
  compareGenderAndReturnValue,
} from '../../utils/maper-gender';
import { AdditionalInfoData, AdditionalInfoPageData, AdditionalInfoTableData } from '../../../customer/models/additional-info';
import { toDDMMYYYY, mapAutenticationTypeIdQuick, mapPersonType, mapProffOfAddressTypeIdQuick, normalizeBoolean } from '../../utils/maper-helpers.autocertification';

export function mapFormToInitialData(
  form: any,
  ppe: boolean,
  bankAreaTypeId: string,
  contraTypeId: string,
  typeContractSubtypeId: string
): DataClient {
  if (
    form.curp.substring(11, 13) === STRINGS.FOREIGN ||
    form.foreignerWithoutCurp
  ) {
    return {
      curp: form.curp,
      typeIden: form.typeIden,
      rfc: form.rfc,
      firstName: form.firstName,
      middleName: form.middleName,
      firstLastName: form.firstLastName,
      secondLastName: form.secondLastName,
      dateOfBirth: form.dateOfBirth,
      gender: form.gender,
      nationality: form.nationality,
      countryOfBirth: form.countryOfBirth,
      stateOfBirth: '',
      cityOfBirth: form.stateOfBirth,
      ppe: ppe,
      foreignerWithoutCurp: form.foreignerWithoutCurp,
      bankAreaTypeId: bankAreaTypeId,
      contraTypeId: contraTypeId,
      typeContractSubtypeId: typeContractSubtypeId,
    };
  } else {
    return {
      curp: form.curp,
      typeIden: form.typeIden,
      rfc: form.rfc,
      firstName: form.firstName,
      middleName: form.middleName,
      firstLastName: form.firstLastName,
      secondLastName: form.secondLastName,
      dateOfBirth: form.dateOfBirth,
      gender: form.gender,
      nationality: form.nationality,
      countryOfBirth: form.countryOfBirth,
      stateOfBirth: form.stateOfBirth,
      cityOfBirth: '',
      ppe: ppe,
      foreignerWithoutCurp: form.foreignerWithoutCurp,
      bankAreaTypeId: bankAreaTypeId,
      contraTypeId: contraTypeId,
      typeContractSubtypeId: typeContractSubtypeId,
    };
  }
}

export function mapToCheckPointInitialData(form: DataClient, isMaintenance: boolean, id: number): Data {
  console.log(form.dateOfBirth)
  if (isMaintenance) {
    if (form.curp.substring(11, 13) === STRINGS.FOREIGN) {
      return {
        id: id,
        curp: form.curp,
        rfc: compareAndReturnRfcNifTinNss(
          form.rfc,
          AllowedValuesRfcNifTinNss.RFC,
          form.typeIden
        ),
        nif: compareAndReturnRfcNifTinNss(
          form.rfc,
          AllowedValuesRfcNifTinNss.NIF,
          form.typeIden
        ),
        tin: compareAndReturnRfcNifTinNss(
          form.rfc,
          AllowedValuesRfcNifTinNss.TIN,
          form.typeIden
        ),
        nss: compareAndReturnRfcNifTinNss(
          form.rfc,
          AllowedValuesRfcNifTinNss.SSN,
          form.typeIden
        ),
        firstName: form.firstName,
        middleName: form.middleName || '',
        firstLastName: form.firstLastName || '',
        secondLastName: form.secondLastName || '',
        dateOfBirth: '' + convertDate(form.dateOfBirth),
        gender: compareAndReturnGender(form.gender || ''),
        nationality: form.nationality,
        countryOfBirth: form.countryOfBirth,
        stateOfBirth: '',
        cityOfBirth: form.cityOfBirth || '',
        ppe: form.ppe,
        foreignerWithoutCurp: form.foreignerWithoutCurp,
        bankAreaTypeId: form.bankAreaTypeId,
        contraTypeId: Number(form.contraTypeId),
        typeContractSubtypeId: Number(form.typeContractSubtypeId),
      };
    } else if (form.foreignerWithoutCurp) {
      return {
        id: id,
        curp: form.curp,
        rfc: compareAndReturnRfcNifTinNss(
          form.rfc,
          AllowedValuesRfcNifTinNss.RFC,
          form.typeIden
        ),
        nif: compareAndReturnRfcNifTinNss(
          form.rfc,
          AllowedValuesRfcNifTinNss.NIF,
          form.typeIden
        ),
        tin: compareAndReturnRfcNifTinNss(
          form.rfc,
          AllowedValuesRfcNifTinNss.TIN,
          form.typeIden
        ),
        nss: compareAndReturnRfcNifTinNss(
          form.rfc,
          AllowedValuesRfcNifTinNss.SSN,
          form.typeIden
        ),
        firstName: form.firstName,
        middleName: form.middleName || '',
        firstLastName: form.firstLastName || '',
        secondLastName: form.secondLastName || '',
        dateOfBirth: '' + convertDate(form.dateOfBirth),
        gender: compareAndReturnGender(form.gender || ''),
        nationality: form.nationality,
        countryOfBirth: form.countryOfBirth,
        stateOfBirth: '',
        cityOfBirth: form.cityOfBirth || '',
        ppe: form.ppe,
        foreignerWithoutCurp: form.foreignerWithoutCurp,
        bankAreaTypeId: form.bankAreaTypeId,
        contraTypeId: Number(form.contraTypeId),
        typeContractSubtypeId: Number(form.typeContractSubtypeId),
      };
    } else {
      return {
        id: id,
        curp: form.curp,
        rfc: compareAndReturnRfcNifTinNss(
          form.rfc,
          AllowedValuesRfcNifTinNss.RFC,
          form.typeIden
        ),
        nif: compareAndReturnRfcNifTinNss(
          form.rfc,
          AllowedValuesRfcNifTinNss.NIF,
          form.typeIden
        ),
        tin: compareAndReturnRfcNifTinNss(
          form.rfc,
          AllowedValuesRfcNifTinNss.TIN,
          form.typeIden
        ),
        nss: compareAndReturnRfcNifTinNss(
          form.rfc,
          AllowedValuesRfcNifTinNss.SSN,
          form.typeIden
        ),
        firstName: form.firstName,
        middleName: form.middleName || '',
        firstLastName: form.firstLastName || '',
        secondLastName: form.secondLastName || '',
        dateOfBirth: '' + convertDate(form.dateOfBirth),
        gender: compareAndReturnGender(form.gender || ''),
        nationality: form.nationality,
        countryOfBirth: form.countryOfBirth,
        stateOfBirth: form.stateOfBirth,
        cityOfBirth: '1',
        ppe: form.ppe,
        foreignerWithoutCurp: form.foreignerWithoutCurp || false,
        bankAreaTypeId: form.bankAreaTypeId,
        contraTypeId: Number(form.contraTypeId),
        typeContractSubtypeId: Number(form.typeContractSubtypeId),
      };
    }
  } else {
    if (form.curp.substring(11, 13) === STRINGS.FOREIGN) {
      return {
        curp: form.curp,
        rfc: compareAndReturnRfcNifTinNss(
          form.rfc,
          AllowedValuesRfcNifTinNss.RFC,
          form.typeIden
        ),
        nif: compareAndReturnRfcNifTinNss(
          form.rfc,
          AllowedValuesRfcNifTinNss.NIF,
          form.typeIden
        ),
        tin: compareAndReturnRfcNifTinNss(
          form.rfc,
          AllowedValuesRfcNifTinNss.TIN,
          form.typeIden
        ),
        nss: compareAndReturnRfcNifTinNss(
          form.rfc,
          AllowedValuesRfcNifTinNss.SSN,
          form.typeIden
        ),
        firstName: form.firstName,
        middleName: form.middleName || '',
        firstLastName: form.firstLastName || '',
        secondLastName: form.secondLastName || '',
        dateOfBirth: '' + convertDate(form.dateOfBirth),
        gender: compareAndReturnGender(form.gender || ''),
        nationality: form.nationality,
        countryOfBirth: form.countryOfBirth,
        stateOfBirth: '',
        cityOfBirth: form.cityOfBirth || '',
        ppe: form.ppe,
        foreignerWithoutCurp: form.foreignerWithoutCurp,
        bankAreaTypeId: form.bankAreaTypeId,
        contraTypeId: Number(form.contraTypeId),
        typeContractSubtypeId: Number(form.typeContractSubtypeId),
      };
    } else if (form.foreignerWithoutCurp) {
      return {
        curp: form.curp,
        rfc: compareAndReturnRfcNifTinNss(
          form.rfc,
          AllowedValuesRfcNifTinNss.RFC,
          form.typeIden
        ),
        nif: compareAndReturnRfcNifTinNss(
          form.rfc,
          AllowedValuesRfcNifTinNss.NIF,
          form.typeIden
        ),
        tin: compareAndReturnRfcNifTinNss(
          form.rfc,
          AllowedValuesRfcNifTinNss.TIN,
          form.typeIden
        ),
        nss: compareAndReturnRfcNifTinNss(
          form.rfc,
          AllowedValuesRfcNifTinNss.SSN,
          form.typeIden
        ),
        firstName: form.firstName,
        middleName: form.middleName || '',
        firstLastName: form.firstLastName || '',
        secondLastName: form.secondLastName || '',
        dateOfBirth: '' + convertDate(form.dateOfBirth),
        gender: compareAndReturnGender(form.gender || ''),
        nationality: form.nationality,
        countryOfBirth: form.countryOfBirth,
        stateOfBirth: '',
        cityOfBirth: form.cityOfBirth || '',
        ppe: form.ppe,
        foreignerWithoutCurp: form.foreignerWithoutCurp,
        bankAreaTypeId: form.bankAreaTypeId,
        contraTypeId: Number(form.contraTypeId),
        typeContractSubtypeId: Number(form.typeContractSubtypeId),
      };
    } else {
      return {
        curp: form.curp,
        rfc: compareAndReturnRfcNifTinNss(
          form.rfc,
          AllowedValuesRfcNifTinNss.RFC,
          form.typeIden
        ),
        nif: compareAndReturnRfcNifTinNss(
          form.rfc,
          AllowedValuesRfcNifTinNss.NIF,
          form.typeIden
        ),
        tin: compareAndReturnRfcNifTinNss(
          form.rfc,
          AllowedValuesRfcNifTinNss.TIN,
          form.typeIden
        ),
        nss: compareAndReturnRfcNifTinNss(
          form.rfc,
          AllowedValuesRfcNifTinNss.SSN,
          form.typeIden
        ),
        firstName: form.firstName,
        middleName: form.middleName || '',
        firstLastName: form.firstLastName || '',
        secondLastName: form.secondLastName || '',
        dateOfBirth: '' + convertDate(form.dateOfBirth),
        gender: compareAndReturnGender(form.gender || ''),
        nationality: form.nationality,
        countryOfBirth: form.countryOfBirth,
        stateOfBirth: form.stateOfBirth,
        cityOfBirth: '1',
        ppe: form.ppe,
        foreignerWithoutCurp: form.foreignerWithoutCurp || false,
        bankAreaTypeId: form.bankAreaTypeId,
        contraTypeId: Number(form.contraTypeId),
        typeContractSubtypeId: Number(form.typeContractSubtypeId),
      };
    }
  }
}

export function mapToClient(initialData: Data): Client {
  let dataClient: Client;

  if (
    initialData.curp.substring(11, 13) === STRINGS.FOREIGN ||
    initialData.foreignerWithoutCurp
  ) {
    dataClient = {
      curp: initialData.curp,
      rfc:
        initialData.rfc ||
        initialData.nif ||
        initialData.tin ||
        initialData.nss,
      typeIden: compareAndReturnIdRfcNifTinNss(
        initialData.rfc,
        initialData.nif,
        initialData.tin,
        initialData.nss
      ),
      firstName: initialData.firstName,
      middleName: initialData.middleName,
      firstLastName: initialData.firstLastName,
      secondLastName: initialData.secondLastName,
      dateOfBirth: formatDateYYYYMMDD(initialData.dateOfBirth),
      gender: compareGenderAndReturnValue(Number(initialData.gender)),
      nationality: initialData.nationality,
      countryOfBirth: initialData.countryOfBirth,
      stateOfBirth: initialData.cityOfBirth,
      ppe: initialData.ppe,
      foreignerWithoutCurp: initialData.foreignerWithoutCurp,
      bankAreaTypeId: Number(initialData.bankAreaTypeId),
      contractType: '',
      contraTypeId: initialData.contraTypeId,
      contractTypeId: 0,
      typeContractSubtypeId: Number(initialData.typeContractSubtypeId),
      typeContractSubtype: '',
      personType: '1',
    };
  } else {
    dataClient = {
      curp: initialData.curp,
      rfc:
        initialData.rfc ||
        initialData.nif ||
        initialData.tin ||
        initialData.nss,
      typeIden: compareAndReturnIdRfcNifTinNss(
        initialData.rfc,
        initialData.nif,
        initialData.tin,
        initialData.nss
      ),
      firstName: initialData.firstName,
      middleName: initialData.middleName,
      firstLastName: initialData.firstLastName,
      secondLastName: initialData.secondLastName,
      dateOfBirth: formatDateYYYYMMDD(initialData.dateOfBirth),
      gender: compareGenderAndReturnValue(Number(initialData.gender)),
      nationality: initialData.nationality,
      countryOfBirth: initialData.countryOfBirth,
      stateOfBirth: initialData.stateOfBirth,
      ppe: initialData.ppe,
      foreignerWithoutCurp: initialData.foreignerWithoutCurp,
      bankAreaTypeId: Number(initialData.bankAreaTypeId),
      contractType: '',
      contraTypeId: initialData.contraTypeId,
      contractTypeId: 0,
      typeContractSubtypeId: Number(initialData.typeContractSubtypeId),
      typeContractSubtype: '',
      personType: '1',
    };
  }
  return dataClient;
}



export function mapToCheckPointFiscalSelfDeclarationData(
  form: FiscalSelfDeclaration
): FiscalSelfDeclaration {
  const {
    mexicoResident,
    curp,
    foreignerWithoutCurp,
    rfc,
    name,
    fiscalRegimeId,
    cfdiUse,
    taxPostalCode,
    nationality,
    country,
    fiscalResidenceAbroad,
    facta,
    crs,
    fiscalResidences,
  } = form;

  const hasActiveResidence = fiscalResidences.some(
    (residence) => residence.declarationFiscalResidence
  );

  if (!hasActiveResidence) {
    throw new Error('No active fiscal residence found.');
  }

  return {
    mexicoResident: normalizeBoolean(mexicoResident),
    curp: curp ?? '',
    foreignerWithoutCurp: foreignerWithoutCurp ?? false,
    rfc: rfc ?? '',
    name: name ?? '',
    fiscalRegimeId: fiscalRegimeId,
    cfdiUse: cfdiUse ?? '',
    taxPostalCode: taxPostalCode ?? '',
    nationality: nationality ?? '',
    country: country ?? '',
    fiscalResidenceAbroad: normalizeBoolean(fiscalResidenceAbroad),
    facta: normalizeBoolean(facta),
    crs: normalizeBoolean(crs),
    fiscalResidences: fiscalResidences.map((residence) => ({
      personType: mapPersonType(String(residence.personType ?? '')),
      country: residence.country ?? '',
      declarationFiscalResidence: normalizeBoolean(
        residence.declarationFiscalResidence
      ),
      proofOfAddressType: mapProffOfAddressTypeIdQuick(residence.proofOfAddressType ?? ''),
      issueDate: toDDMMYYYY(residence.issueDate) ?? '',
      expirationStatus: residence.expirationStatus ?? '',
      expirationDate:
        toDDMMYYYY(residence.expirationDate) ?? '',
      certificationDate:
        toDDMMYYYY(residence.certificationDate) ?? '',
      declarationYear: Number(residence.declarationYear),
      aditionalDays: residence.aditionalDays ?? '',
      factaObligations: {
        autentication: mapAutenticationTypeIdQuick(residence.factaObligations?.autentication ?? ''),
        nif: residence.factaObligations?.nif ?? '',
        tin: residence.factaObligations?.tin ?? '',
        nss: residence.factaObligations?.nss ?? '',
      }
    })),
  };
}

export function mapFormToAdditionalInfo(
  input: AdditionalInfoData, inputTable?: AdditionalInfoTableData[],
): AdditionalInfoPageData {
  return {
    data: {
      addressKey: input.addressKey ?? '',
      sendDocuments: input.sendDocuments ?? '',
      isrExempt: input.isrExempt ?? '',
      expirationDate: input.expirationDate ?? '',
      startDate: input.startDate ?? '',
      endDate: input.endDate ?? '',
      w8benForm: input.w8benForm ?? '',
      locations: input.locations ?? '',
      currencyOperations: input.currencyOperations ?? '',
      thirdPartyCompanies: input.thirdPartyCompanies ?? '',
      ownCompanies: input.ownCompanies ?? '',
      sicShares: input.sicShares ?? '',
      derivativeInstruments: input.derivativeInstruments ?? '',
      debtInstruments: input.debtInstruments ?? '',
      savingsPlans: input.savingsPlans ?? '',
    },
    table: inputTable ?? [],
  };
}
