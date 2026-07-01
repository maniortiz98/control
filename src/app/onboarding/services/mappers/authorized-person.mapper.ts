import { convertDate, convertDateToStr, formatDateSimple, formatDateYYYYMMDD } from "../../../shared/utils/datetime";
import { AllowedValuesRfcNifTinNss, compareAndReturnIdRfcNifTinNss, compareAndReturnRfcNifTinNss, compareAndReturnValueRfcNifTinNss, rfcNifTinNssValueByType } from "../../../shared/utils/map-rfc-nif-tin-nss";
import { compareAndReturnGender, compareGenderAndReturnValue } from "../../../shared/utils/maper-gender";
import { AuthorizedPerson, AuthorizedPersonPageData } from "../../models/authorized-person-page-data";
import { AuthorizedPersonCheckpointSingle, AuthorizedPersonModelSaveMaint } from "../../models/checkpoints/authorized-person-checkpoint";

const OTHER_RULE_ID: string = 'Otra regla de firma';

/**
 * Este mapper toma la información de la sección y la prepara para guardar
 * en ONBOARDING
 */
export function toCheckpoint(data: AuthorizedPerson[]): AuthorizedPersonCheckpointSingle[] {
  return data.map((per: AuthorizedPerson) => {
    console.log(per);

    let maritalStatus = per.clientData.maritalStatus ?? 0;
    let federalEntity = per.clientData.stateOfBirth || '';
    let federalEntityAdd: any = per.addressData.country === 'MX' ? per.addressData.federalEntityID || '' : per.addressData.federalEntity;

    return {
      // customerNumber: number | null; // TODO func. 3ro relacionado.
      curp                     : per.clientData.curp,
      foreignWithoutCURP       : per.clientData.foreignerWithoutCurp,
      rfc                      : compareAndReturnRfcNifTinNss(per.clientData.rfc, AllowedValuesRfcNifTinNss.RFC, per.clientData.typeIden),
      nif                      : compareAndReturnRfcNifTinNss(per.clientData.rfc, AllowedValuesRfcNifTinNss.NIF, per.clientData.typeIden),
      tin                      : compareAndReturnRfcNifTinNss(per.clientData.rfc, AllowedValuesRfcNifTinNss.TIN, per.clientData.typeIden),
      nss                      : compareAndReturnRfcNifTinNss(per.clientData.rfc, AllowedValuesRfcNifTinNss.SSN, per.clientData.typeIden),
      firstName                : per.clientData.firstName,
      middleName               : per.clientData.middleName,
      lastName                 : per.clientData.firstLastName,
      secondLastName           : per.clientData.secondLastName,
      birthDate                : '' + convertDate(per.clientData.dateOfBirth ?? ''),
      gender                   : compareAndReturnGender(per.clientData.gender ?? ''),
      maritalStatus            : +maritalStatus,
      nationality              : per.clientData.nationality,
      birthCountry             : per.clientData.countryOfBirth,
      federalEntity            : federalEntity,
      signatureClass           : per.authorizedPerson.signClass,
      checkbookManagementAccess: per.authorizedPerson.management ? true : false,
      relationship             : per.authorizedPerson.relationship,
      authorizedPersonType     : per.authorizedPerson.authorizedPerson,
      economicActivity         : per.authorizedPerson.economicActivity,
      occupation               : per.authorizedPerson.occupation,
      profession               : per.authorizedPerson.profession,
      companyName              : per.authorizedPerson.workCompany,
      jobTitle                 : per.authorizedPerson.jobTitle,

      personPpe: {
        isPpe          : (per.authorizedPerson.isPpe === 'si'),
        ppeType        : per.authorizedPerson.ppeType,
        positionHeld   : per.authorizedPerson.ppeRol,
        positionEndDate: convertDate(per.authorizedPerson.ppeExpires).toString(),
        hasppeRelatives: (per.authorizedPerson.ppeHasFamily === 'yes'),
        ppeRelatives: {
          rfc            : '',
          firstName      : '',
          firstLastName  : '',
          relationship   : 1,
          positionHeld   : '',
          positionEndDate: ''
        }
      },
      residenceAddress: {
        addressType     : +per.addressData.addressType,
        otherAddressType: per.addressData.other ?? '',
        country         : per.addressData.country ?? '',
        street          : per.addressData.street ?? '',
        externalNumber  : per.addressData.externalNumber ?? '',
        internalNumber  : per.addressData.internalNumber ?? '',
        postalCode      : per.addressData.postalCode ?? '',
        federalEntity   : federalEntityAdd,
        municipality    : per.addressData.country === 'MX' ? per.addressData.municipalityID || '' : per.addressData.municipality,
        city            : per.addressData.country === 'MX' ? per.addressData.cityID || '' : per.addressData.city,
        neighborhood    : per.addressData.neighborhood ?? ''
      },
      contact: {
        type        : per.contactData?.phoneTypeId ?? '',
        country     : per.contactData?.phoneCountryId ?? '',
        areaCode    : per.contactData?.phoneCodeArea ?? '',
        phone       : per.contactData?.phone ?? '',
        extension   : per.contactData?.phoneExtension ?? '',
        emailAddress: per.authorizedPerson.email ?? ''
      },
      faculties: {
        signatureInstruction     : per.authorizedPerson.faculty,
        otherSignatureInstruction: per.authorizedPerson.faculty === OTHER_RULE_ID ? per.authorizedPerson.otherFaculty : null,
      }
    };
  });
}

/**
 * Mapper que recibe la info de la consulta en ONBOARDING, y la manda al 'signal'
 * para que pueda ser visualizado en la pantalla.
 */
export function mapAuthorizedPersonsToData(authorizedPersons: any): AuthorizedPersonPageData {
  if (!authorizedPersons) return { data: [], table: [] };

  const mappedData = authorizedPersons.map((person: any) => {
    const tempId = crypto.randomUUID(); // Placeholder for unique ID generation

    return {
      // data: {
        tempId,
        clientData: {
          curp                 : person.curp ?? '',
          foreignerWithoutCurp : person.foreignWithoutCURP ?? false,
          typeIden             : compareAndReturnIdRfcNifTinNss(
            person.rfc ?? '',
            person.nif ?? '',
            person.tin ?? '',
            person.nss ?? ''
          ),
          rfc                  : compareAndReturnValueRfcNifTinNss(
            person.rfc ?? '',
            person.nif ?? '',
            person.tin ?? '',
            person.nss ?? ''
          ),
          firstName            : person.firstName ?? '',
          middleName           : person.middleName ?? '',
          dateOfBirth          : person.birthDate ?? '',
          firstLastName        : person.lastName ?? '',
          secondLastName       : person.secondLastName ?? '',
          gender               : compareGenderAndReturnValue(person.gender || 0),
          maritalStatus        : person.maritalStatus?.toString() ?? '',
          nationality          : person.nationality ?? '',
          countryOfBirth       : person.birthCountry ?? '',
          stateOfBirth         : person.federalEntity ?? '',
          ppe                  : person.personPpe?.isPpe ?? false,
          bankAreaTypeId       : "",
          contraTypeId         : "",
          typeContractSubtypeId: "",
        },
        addressData: {
          addressType   : person.residenceAddress?.addressType?.toString() ?? '',
          other         : person.residenceAddress?.otherAddressType ?? '',
          country       : person.residenceAddress?.country ?? '',
          postalCode    : person.residenceAddress?.postalCode ?? '',
          federalEntity : person.residenceAddress?.federalEntity ?? '',
          city          : person.residenceAddress?.city ?? '',
          municipality  : person.residenceAddress?.municipality ?? '',
          neighborhood  : person.residenceAddress?.neighborhood ?? '',
          street        : person.residenceAddress?.street ?? '',
          externalNumber: person.residenceAddress?.externalNumber ?? '',
          internalNumber: person.residenceAddress?.internalNumber ?? '',
          federalEntityID: person.residenceAddress?.federalEntity ?? '',
          municipalityID: person.residenceAddress?.municipality ?? '',
          cityID: person.residenceAddress?.city ?? '',
        },
        contactData: {
          id               : crypto.randomUUID(), // Placeholder for unique ID generation
          phone            : person.contact?.phone ?? '',
          phoneType        : person.contact?.type ?? '',
          phoneTypeId      : person.contact?.type ?? '',
          phoneCountry     : person.contact?.country ?? '',
          phoneCountryId   : person.contact?.country ?? '',
          phoneCodeArea    : person.contact?.areaCode ?? '',
          phoneExtension   : person.contact?.extension ?? '',
          phoneNotification: false, // TODO no encontrado
          isSaved          : false
        },
        authorizedPerson: {
          signClass       : person.signatureClass ?? '',
          management      : person.checkbookManagementAccess ? "yes" : "no",
          relationship    : person.relationship ?? '',
          authorizedPerson: person.authorizedPersonType ?? '',
          economicActivity: person.economicActivity ?? '',
          occupation      : person.occupation ?? '',
          profession      : '', // TODO no encontrado
          workCompany     : person.companyName ?? '',
          jobTitle        : person.jobTitle ?? '',
          isPpe           : person.personPpe?.isPpe ? "yes" : "no",
          ppeType         : person.personPpe?.ppeType,
          ppeRol          : person.personPpe?.positionHeld,
          ppeExpires      : formatDateYYYYMMDD(person.personPpe?.positionEndDate),
          ppeHasFamily    : person.personPpe?.hasppeRelatives ? "yes" : "no",
          email           : person.contact?.emailAddress ?? '',
          faculty       : person.faculties?.signatureInstruction,
          otherFaculty    : person.faculties?.otherSignatureInstruction ?? ''
        }
      // }
    };
  });

  console.log(mappedData);

  return {
    data: mappedData,
    table: []
  };
}



/**
 * Este mapper toma la información de la sección y la prepara para guardar
 * en MANTENIMIENTO
 */
export function authorizedPersonMapperSaveMaint(data: any[]): AuthorizedPersonModelSaveMaint[] {
  console.log(data);
  return data.map((item: AuthorizedPerson) => {

    console.log(item);

    let gender = item.clientData.gender ?? 'H';
    gender = compareAndReturnGender(gender).toString();

    console.log(item.clientData.dateOfBirth);
    console.log(typeof item.clientData.dateOfBirth);

    const dateofbirth = 'string' === typeof item.clientData.dateOfBirth
      ? formatDateSimple(item.clientData.dateOfBirth)
      : String(convertDate(item.clientData.dateOfBirth));

    let contactId: number | null = Number(item.contactData?.id);
    contactId = isNaN(contactId) ? null : contactId;

    return {
        id: item.id ?? null,
        // customerNumber: number | null; // TODO func. 3ro relacionado.
        personId                 : item.personId ?? null,
        active                   : item.active,
        curp                     : item.clientData.curp,
        foreignWithoutCURP       : item.clientData.foreignerWithoutCurp,
        rfc                      : rfcNifTinNssValueByType('RFC', item.clientData.typeIden, item.clientData.rfc),
        nif                      : rfcNifTinNssValueByType('NIF', item.clientData.typeIden, item.clientData.rfc),
        tin                      : rfcNifTinNssValueByType('TIN', item.clientData.typeIden, item.clientData.rfc),
        nss                      : rfcNifTinNssValueByType('SSN', item.clientData.typeIden, item.clientData.rfc),
        firstName                : item.clientData.firstName,
        middleName               : item.clientData.middleName,
        lastName                 : item.clientData.firstLastName,
        secondLastName           : item.clientData.secondLastName,
        birthDate                : dateofbirth,
        gender                   : gender,
        maritalStatus            : item.clientData.maritalStatus ?? '1',
        nationality              : item.clientData.nationality,
        birthCountry             : item.clientData.countryOfBirth,
        federalEntity            : item.clientData.stateOfBirth,
        signatureClass           : item.authorizedPerson.signClass,
        checkbookManagementAccess: item.authorizedPerson.management === '' ? false : true,
        relationship             : item.authorizedPerson.relationship,
        authorizedPersonType     : item.authorizedPerson.authorizedPerson,
        economicActivity         : item.authorizedPerson.economicActivity,
        occupation               : item.authorizedPerson.occupation,
        profession               : item.authorizedPerson.profession,
        companyName              : item.authorizedPerson.workCompany,
        jobTitle                 : item.authorizedPerson.jobTitle,
        personPpe: {
            id: item.authorizedPerson.personPpeId ?? null,
            isPpe: item.authorizedPerson.isPpe === 'si' ? true : false,
            ppeType: item.authorizedPerson.ppeType ?? '',
            positionHeld: item.authorizedPerson.ppeRol ?? '',
            positionEndDate: convertDate(item.authorizedPerson.ppeExpires).toString(),
            hasppeRelatives: item.authorizedPerson.ppeHasFamily === 'yes' ? true : false,
            ppeRelatives: {}
        },
        residenceAddress: {
            id              : Number(item.addressData.id) ?? null,
            addressType     : item.addressData.addressType,
            otherAddressType: item.addressData.other ?? '',
            country         : item.addressData.country ?? '',
            street          : item.addressData.street ?? '',
            externalNumber  : item.addressData.externalNumber ?? '',
            internalNumber  : item.addressData.internalNumber ?? '',
            postalCode      : item.addressData.postalCode ?? '',
            federalEntity   : item.addressData.country === 'MX' ? item.addressData.federalEntityID || '' : item.addressData.federalEntity,
            municipality    : item.addressData.country === 'MX' ? item.addressData.municipalityID || '' : item.addressData.municipality,
            city            : item.addressData.country === 'MX' ? item.addressData.cityID || '' : item.addressData.city,
            neighborhood    : item.addressData.neighborhood ?? ''
        },
        contact: {
            id          : contactId,
            type        : item.contactData?.phoneTypeId ?? '',
            country     : item.contactData?.phoneCountryId ?? '',
            areaCode    : item.contactData?.phoneCodeArea ?? '',
            phone       : item.contactData?.phone ?? '',
            extension   : item.contactData?.phoneExtension ?? '',
            notification: item.contactData?.phoneNotification ?? false,
            emailAddress: item.authorizedPerson.email ?? ''
        },
        faculties: {
            id                       : item.authorizedPerson.facultiesId ?? null,
            signatureInstruction     : item.authorizedPerson.faculty,
            otherSignatureInstruction: item.authorizedPerson.faculty === OTHER_RULE_ID ? item.authorizedPerson.otherFaculty : null,
        }
    };
  });
}


/**
 * Mapper que recibe la info de la consulta en MANTENIMIENTO, y la manda al 'signal'
 * para que pueda ser visualizado en la pantalla.
 */
export function authorizedPersonMapperQueryMaint(data: any): AuthorizedPersonPageData {
  console.log(data);
  const dd = data.map((item: any) => {

    let isppe = item.personPpe?.isPpe ?? 'undefined';
    if ( isppe === 'undefined') {
      isppe = 'no';
    } else {
      isppe = isppe ? 'si' : 'no';
    }

    let hasppefam = item.personPpe?.hasppeRelatives ?? 'undefined';
    if ( hasppefam === 'undefined') {
      hasppefam = 'no';
    } else {
      hasppefam = hasppefam ? 'si' : 'no';
    }

    return {
      id: item.id,
      // customerNumber: number | null; // TODO func. 3ro relacionado.
      personId: item.personId,
      active: item.active,
      tempId: crypto.randomUUID(),
      clientData: {
        curp: item.curp,
        foreignerWithoutCurp: item.foreignWithoutCURP,
        typeIden: compareAndReturnIdRfcNifTinNss(
          item.rfc,
          item.nif,
          item.tin,
          item.nss
        ),
        rfc: item.rfc ?? item.nif ?? item.tin ?? item.nss,
        firstName: item.firstName,
        middleName: item.middleName,
        firstLastName: item.lastName,
        secondLastName: item.secondLastName,
        dateOfBirth: item.birthDate,
        gender: compareGenderAndReturnValue(Number(item.gender)),
        maritalStatus: item.maritalStatus,
        nationality: item.nationality,
        countryOfBirth: item.birthCountry,
        stateOfBirth: item.federalEntity ?? '',
        // cityOfBirth?: string;
        isSaved: true,
        // isView?: boolean;
      },
      addressData: {
        id: item.residenceAddress.id,
        // addressId?: number,
        // addressAccountId?: number,
        // addressRole?: string,
        addressType: item.residenceAddress.addressType,
        other: item.residenceAddress.otherAddressType,
        country: item.residenceAddress.country,
        postalCode: item.residenceAddress.postalCode,
        federalEntity: item.residenceAddress.federalEntity,
        city: item.residenceAddress.city,
        municipality: item.residenceAddress.municipality,
        neighborhood: item.residenceAddress.neighborhood,
        street: item.residenceAddress.street,
        externalNumber: item.residenceAddress.externalNumber,
        internalNumber: item.residenceAddress.internalNumber,
        // confirmCp?: string,
        // timeLiveMexico?: string,
        // reasonsOpeningContractMexico?: string,
        // proofOfAddressType?: string,
        // addressProofIssueDate?: string,
        // expirationYear?: string,
        // taxPostalCode?: string,
        // geographicalArea?: string,
        // deliveryCenter?: string,
        // neighborhoodName?: string,
        // addressConcatenation?: string,
        federalEntityID: item.residenceAddress.federalEntity,
        cityID: item.residenceAddress.city,
        municipalityID: item.residenceAddress.municipality,
        //isSaved: true,
        // isView?: boolean,
        active: true
      },
      contactData: {
          id: item.contact.id,
          phone: item.contact.phone,
          phoneType: item.contact.type,
          phoneTypeId: item.contact.type,
          phoneCountry: item.contact.country ?? '',
          phoneCountryId: item.contact.country,
          phoneCodeArea: item.contact.areaCode,
          // phoneLada?: string,
          phoneExtension: item.contact.extension,
          phoneNotification: item.contact.notification ?? false,
          active: true,
      },
      authorizedPerson: {
        signClass: item.signatureClass,
        management: item.checkbookManagementAccess,
        relationship: item.relationship,
        authorizedPerson: item.authorizedPersonType,
        economicActivity: item.economicActivity,
        occupation: item.occupation,
        profession: item.profession,
        workCompany: item.companyName,
        jobTitle: item.jobTitle,

        personPpeId: item.personPpe?.id ?? null,
        isPpe: isppe,
        ppeType: item.personPpe?.ppeType ?? '',
        ppeRol: item.personPpe?.positionHeld ?? '',
        ppeExpires: item.personPpe?.positionEndDate ?? '',
        ppeHasFamily: hasppefam,
        email: item.contact.emailAddress,
        facultiesId: item.faculties.id ?? null,
        faculty: item.faculties.singnatureInstruction ?? '', // no lo mandan
        otherFaculty: item.faculties.otherSignatureInstruction ?? '', // no lo mandan
      }

    }

  });

  console.log(dd);

  return {
    data: dd,
    table: []
  }
}
