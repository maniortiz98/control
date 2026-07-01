import { formatDateYYYYMMDD } from "../../../../../shared/utils/datetime";
import { compareAndReturnIdRfcNifTinNss, compareAndReturnValueRfcNifTinNss } from "../../../../../shared/utils/map-rfc-nif-tin-nss";
import { compareGenderAndReturnValue } from "../../../../../shared/utils/maper-gender";
import { DataResResourceProvider, PpeRelative } from "../../../../models/checkpoints/response/maintenance/resources-provider";
import { ResourceProviderData } from "../../../../models/resource-provider";


export function mapToSignalResourceProviderMant(input: DataResResourceProvider): ResourceProviderData{
  return {
    generalData: {
      curp: input.generalData?.curp || '',
      foreignerWithoutCurp: input.generalData?.foreignerWithoutCurp || false,
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
      countryTaxCodeAbroad: input.generalData?.countryFiscal || '',
      typePerson: input.generalData?.personType || '1',
      relationship: input.generalData?.relationship?.toString() || '',
      field: input.generalData?.fiel || '',
      phone: input.generalData?.phone?.toString() || '',
      mail: input.generalData?.email || '',
      economicActivity: input.generalData?.economicActivity || '',
      expirationDateField: formatDateYYYYMMDD(input.generalData?.expirationFielDate || ''),
      accountRoleId:input.generalData?.accountRoleId, // Campos Nuevos
      active: input.generalData?.active ?? true, // Campos Nuevos
    },
    ppe: {
      ppe: input.personPpe?.isPpe || false,
      tppe: input.personPpe?.ppeType || '',
      positionHeld: input.personPpe?.positionHeld || '',
      expirationDate: formatDateYYYYMMDD(input.personPpe?.positionEndDate || ''),
      fppe: input.personPpe?.hasppeRelatives || false,
      active: input.personPpe?.active ?? true,  // Campos Nuevos
      personPpeId: input.personPpe?.personPpeId,  // Campos Nuevos
      dataFamily: input.personPpe?.ppeRelatives?.map((fam: PpeRelative) => {
        return {
          curp: fam.curp || '',
          foreignerWithoutCurp: fam.foreignerWithoutCurp || false,
          typeIden: compareAndReturnIdRfcNifTinNss(fam.rfc || '', fam.nif || '', fam.tin || '', fam.nss || ''),
          rfc: compareAndReturnValueRfcNifTinNss(fam.rfc || '', fam.nif || '', fam.tin || '', fam.nss || ''),
          firstName: fam.firstName || '',
          middleName: fam.middleName || '',
          dateOfBirth: formatDateYYYYMMDD(fam.dateOfBirth || ''),
          firstLastName: fam.firstLastName || '',
          secondLastName: fam.secondLastName || '',
          nationality: fam.nationality || '',
          countryOfBirth: fam.countryOfBirth || '',
          countryTaxCodeAbroad: fam.countryFiscal || '',
          chargeDueDate: formatDateYYYYMMDD(fam.positionEndDate || ''),
          relationship: fam.relationship?.toString() || '',
          positionHeld: fam.positionHeld || '',
          //Aqui faltan dos campos active y id de back para la eliminacion logica
          accountRoleId: fam.accountRole ?? 0, // Campo mock para logica solo remplazar nombre
          active: fam.active ?? true, // Campo mock para logica solo remplazar nombre

          idS:crypto.randomUUID(), // Id generado para front
        };
      }) || [],
    },
    adrres: {
      addressId: input.resourceProviderAddress?.addressId, // Campos Nuevos
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
