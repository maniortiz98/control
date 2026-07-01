import { formatDateYYYYMMDD } from "../../../../shared/utils/datetime";
import { compareAndReturnIdRfcNifTinNss, compareAndReturnValueRfcNifTinNss } from "../../../../shared/utils/map-rfc-nif-tin-nss";
import { compareGenderAndReturnValue } from "../../../../shared/utils/maper-gender";
import { DataResResourceProvider, PpeRelative } from "../../../models/checkpoints/response/resources-provider";
import { ResourceProviderData } from "../../../models/resource-provider";

export function mapToSignalResourceProvider(input: DataResResourceProvider): ResourceProviderData{
  return {
    generalData: {
      curp: input.generalData?.curp || '',
      foreignerWithoutCurp: input.generalData?.foreignWithoutCURP || false,
      typeIden: compareAndReturnIdRfcNifTinNss(input.generalData?.rfc || '', input.generalData?.nif || '', input.generalData?.tin || '', input.generalData?.nss || ''),
      rfc: compareAndReturnValueRfcNifTinNss(input.generalData?.rfc || '', input.generalData?.nif || '', input.generalData?.tin || '', input.generalData?.nss || ''),
      firstName: input.generalData?.firstName || '',
      middleName: input.generalData?.middleName || '',
      dateOfBirth: formatDateYYYYMMDD(input.generalData?.dateOfBirth || ''),
      firstLastName: input.generalData?.firstLastName || '',
      secondLastName: input.generalData?.secondLastName || '',
      gender: compareGenderAndReturnValue(Number(input.generalData?.gender) || 0),
      nationality: input.generalData?.nationality || '',
      countryOfBirth: input.generalData?.countryOfBirth || '',
      stateOfBirth: input.generalData?.federalEntity || '',
      countryTaxCodeAbroad: '',
      typePerson: '1',
      relationship: input.generalData?.relationship?.toString() || '',
      field: input.generalData?.fiel || '',
      phone: input.generalData?.phone?.toString() || '',
      mail: input.generalData?.email || '',
      economicActivity: input.generalData?.economicActivity || '',
      expirationDateField: input.generalData?.fielExpirationDate || '',
    },
    ppe: {
      ppe: input.personPpe?.isPpe || false,
      tppe: input.personPpe?.ppeType || '',
      positionHeld: input.personPpe?.positionHeld || '',
      expirationDate: input.personPpe?.positionEndDate || '',
      fppe: input.personPpe?.hasppeRelatives || false,
      dataFamily: input.personPpe?.ppeRelatives?.map((fam: PpeRelative) => {
        return {
          curp: fam.curp || '',
          foreignerWithoutCurp: fam.foreignerWithoutCurp || false,
          typeIden: compareAndReturnIdRfcNifTinNss(fam.rfc || '', fam.nif || '', fam.tin || '', fam.nss || ''),
          rfc: compareAndReturnValueRfcNifTinNss(fam.rfc || '', fam.nif || '', fam.tin || '', fam.nss || ''),
          firstName: fam.firstName || '',
          middleName: fam.middleName || '',
          dateOfBirth: fam.dateOfBirth || '',
          firstLastName: fam.firstLastName || '',
          secondLastName: fam.secondLastName || '',
          nationality: fam.nationality || '',
          countryOfBirth: fam.countryOfBirth || '',
          countryTaxCodeAbroad: '',
          chargeDueDate: fam.positionEndDate || '',
          relationship: fam.relationship?.toString() || '',
          positionHeld: fam.positionHeld || '',
        }
      }) || []
    },
    adrres: {
      addressType: input.resourceProviderAddress?.addressType || '',
      other: input.resourceProviderAddress?.other || '',
      country: input.resourceProviderAddress?.country || '',
      postalCode: input.resourceProviderAddress?.postalCode?.toString() || '',
      federalEntity: input.resourceProviderAddress?.federalEntity || '',
      city: input.resourceProviderAddress?.city || '',
      municipality: input.resourceProviderAddress?.municipality || '',
      neighborhood: input.resourceProviderAddress?.neighborhood?.toString() || '',
      street: input.resourceProviderAddress?.street || '',
      externalNumber: input.resourceProviderAddress?.externalNumber?.toString() || '',
      internalNumber: input.resourceProviderAddress?.internalNumber?.toString() || ''
    }
  };
}
