import { SignatureDataCheckpoint, CoHolder, LegalProxy } from '../../models/checkpoints/signature-checkpoint';
import { SingSection } from "../../models/sign-section";
import { AllowedValuesRfcNifTinNss } from "../../../shared/utils/map-rfc-nif-tin-nss";
import { convertDate, convertDateBack, convertStringToDate, formatDateSimple, formatDateYYYYMMDD } from '../../../shared/utils/datetime';
import { compareAndReturnGender, compareGenderAndReturnValue } from "../../../shared/utils/maper-gender";
import { CotitularInfo, cotitularInfoToTable, CotitularTableInfo } from "../../models/cotitular";
import { Countries } from "../../models/country";
import { IdentificationType } from "../../models/identification-type";
import { PhoneType } from "../../models/phone-type";
import { AttoneryInfo, attoneryInfoToTable, AttoneryTableInfo } from "../../models/attonery";
import { mapAutenticationTypeIdQuick, mapAutenticationTypeToDescSafe, mapProffOfAddressTypeIdQuick, mapProffOfAddressTypeToDescSafe, toDDMMYYYY } from '../../../shared/utils/maper-helpers.autocertification';
import { ZipCodeService } from '../../../shared/services/zip-code.service';
import { firstValueFrom } from 'rxjs';

export function signSectionToCheckpoint(data: SingSection): SignatureDataCheckpoint {

  const coholders: CoHolder[] = data.cotitularList
  ?.filter(item => item?.active === true)
  ?.map(item => ({
    customerNumber: item.customerNumber ?? null,
    curp: item.dataSection?.curp ?? '',
    foreignerWithoutCurp: item.dataSection?.foreignerWithoutCurp ?? false,
    rfc: item.autoSign?.rfc ?? '',
    nif: item.dataSection?.typeIden === AllowedValuesRfcNifTinNss.NIF ? item.dataSection.rfc : '',
    tin: item.dataSection?.typeIden === AllowedValuesRfcNifTinNss.TIN ? item.dataSection.rfc : '',
    nss: item.dataSection?.typeIden === AllowedValuesRfcNifTinNss.SSN ? item.dataSection.rfc : '',
    firstName: item.dataSection?.firstName ?? '',
    middleName: item.dataSection?.middleName ?? '',
    firstLastName: item.dataSection?.firstLastName ?? '',
    secondLastName: item.dataSection?.secondLastName ?? '',
    dateOfBirth: convertDate(item.dataSection?.dateOfBirth ?? '').toString(),
    gender: compareAndReturnGender(item.dataSection?.gender ?? ''),
    maritalStatus: Number(item.dataSection?.maritalStatus) ?? 0,
    nacionality: item.dataSection?.nationality ?? '',
    countryOfBirth: item.dataSection?.countryOfBirth ?? '',
    occupation: item.taxSection?.occupation ?? '',
    federalEntity: item.dataSection?.stateOfBirth ?? '',
    relationship: Number(item.taxSection?.relationship) ?? 0,
    economicActivity: item.taxSection?.economicActivity ?? '',
    companyName: item.taxSection?.workCompany ?? '',
    positionHeld: item.taxSection?.positionHeld ?? '',
    phoneBussiness: item.taxSection?.phoneBusiness ?? '',
    fiscalCountry: item.taxSection?.fiscalCountry ?? '',
    fiscalIdentificationNumber: item.dataSection?.typeIden === AllowedValuesRfcNifTinNss.NIF ? item.dataSection.rfc : '',
    signatureType: item.taxSection?.signClass ?? '',
    IPABCoverage: item.taxSection?.ipabTitularityPercent?.toString() ?? '',
    incomeTaxWithholding: item.taxSection?.retentionIsr?.toString() ?? '',
    personPpe: {
      isPpe: item.ppeInfo?.ppe ?? false,
      ppeType: item.ppeInfo?.tppe ?? '',
      positionHeld: item.ppeInfo?.positionHeld ?? '',
      positionEndDate: convertDate(item.ppeInfo?.expirationDate ?? '').toString(),
      hasppeRelatives: item.ppeInfo?.fppe ?? false,
      ppeRelatives: item.ppeInfo?.dataFamily?.map(p => ({
        curp: p.curp ?? '',
        foreignerWithoutCurp: p.foreignerWithoutCurp ?? '',
        rfc: p.typeIden === AllowedValuesRfcNifTinNss.RFC ? p.rfc : '',
        nif: p.typeIden === AllowedValuesRfcNifTinNss.NIF ? p.rfc : '',
        tin: p.typeIden === AllowedValuesRfcNifTinNss.TIN ? p.rfc : '',
        nss: p.typeIden === AllowedValuesRfcNifTinNss.SSN ? p.rfc : '',
        firstName: p.firstName ?? '',
        middleName: p.middleName ?? '',
        firstLastName: p.firstLastName ?? '',
        secondLastName: p.secondLastName ?? '',
        dateOfBirth: convertDate(p.dateOfBirth ?? '').toString(),
        maritalStatus: '1',
        nationality: p.nationality ?? '',
        countryOfBirth: p.countryOfBirth ?? '',
        federalEntity: '',
        relationship: Number(p.relationship) ?? 0,
        positionHeld: p.positionHeld ?? '',
        positionEndDate: convertDate(p.chargeDueDate ?? '').toString(),
      })) ?? []
    },
    identification: item.identifications
    ?.filter(item => item?.active === true)
    ?.map(i => ({
      countryOfIdentification: i.identificationCountryId ?? '',
      identificationType: i.identificationTypeId ?? '',
      identificationNumber: i.identificationNumber ?? '',
      expirationDate: i.identificationExpDate ?? ''
    })),
    residentialAddress: {
      addressRol: item.address?.addressRole ?? '',
      addressType: item.address?.addressType ?? '',
      other: item.address?.other ?? '',
      country: item.address?.country ?? '',
      street: item.address?.street ?? '',
      externalNumber: item.address?.externalNumber ?? '',
      internalNumber: item.address?.internalNumber ?? '',
      postalCode: item.address?.postalCode ?? '',
      federalEntity: item.address?.country === 'MX' ? item.address?.federalEntityID ?? '' : item.address?.federalEntity ?? '',
      city: item.address?.country === 'MX' ? item.address?.cityID ?? '' : item.address?.city ?? '',
      municipality: item.address?.country === 'MX' ? item.address?.municipalityID ?? '' : item.address?.municipality ?? '',
      neighborhood: item.address?.neighborhood ?? '',
      geographicalArea: '',
      deliveryCenter: '',
    },
    fiscalSelfDeclaration: {
      residesInMexico:
      item.autoSign?.mexicoResident === true || (typeof item.autoSign?.mexicoResident === "string" && item.autoSign?.mexicoResident === "true"),
      SATRegisteredName: item.autoSign?.name ?? '',
      fiscalRegime: item.autoSign?.fiscalRegimeId?.toString() ?? '',
      useCFDI: item.autoSign?.cfdiUse ?? '',
      taxPostalCode: item.autoSign?.taxPostalCode ?? '',
      expirationStatus: '',
      facta: item.autoSign?.facta ?? false,
      foreignTaxResident: item.autoSign?.crs ?? false,
      taxAddress: item.autoSign?.fiscalResidences?.map(f => ({
        taxAddress: {
          personType: '2', //f.personType != null ? f.personType.toString() : '',
          fiscalResidence: f.country,
          selfCertification: f.declarationFiscalResidence ?? '',
          proofOfTaxResidency: mapProffOfAddressTypeIdQuick(f.proofOfAddressType ?? ''),
          certificationDate:  toDDMMYYYY(f.certificationDate) ?? '',
          declarationYear: Number(f.declarationYear) ?? 0,
          issueDate: toDDMMYYYY(f.issueDate) ?? '',
          expirationStatus: f.expirationStatus,
          expirationDate: toDDMMYYYY(f.expirationDate) ?? '',
          aditionalDays: f.aditionalDays,
        },
        fatcaCompliance: {
          autentication: mapAutenticationTypeIdQuick(f.factaObligations.autentication ?? ''),
          nif: f.factaObligations.nif ?? '',
          tin: f.factaObligations.tin ?? '',
          nss: f.factaObligations?.nss != null ? f.factaObligations.nss?.toString() : '',
        },
        taxAddressActive: f.declarationFiscalResidence ?? false,
      })) ?? []
    },
    contactData: {
      DataNonDisclosureLetter: item.manifestLetter,
      registeredPhones: item.phones
      ?.filter(item => item?.active === true)
      ?.map(p => ({
        type: Number(p.phoneTypeId) ?? 0,
        country: p.phoneCountryId ?? '',
        areaCode: p.phoneCodeArea ?? '',
        phone: p.phone?.toString() ?? '',
        extension: p.phoneExtension ?? '',
        notificationPhone: p.phoneNotification ?? false,
      })),
      registeredEmails: item.mails
      ?.filter(item => item?.active === true)
      ?.map(m => ({
        emailAddress: m.mail ?? '',
        notificationEmail: m.mailNotification ?? false,
      }))
    }
  }))

  const legalProxys: LegalProxy[] = data.attoneryList
  ?.filter(item => item?.active === true)
  ?.map(item => ({
    customerNumber: item.customerNumber ?? null,
    curp: item.dataSection?.curp ?? '',
    foreignerWithoutCurp: item.dataSection?.foreignerWithoutCurp ?? false,
    rfc: item.dataSection?.typeIden === AllowedValuesRfcNifTinNss.RFC ? item.dataSection.rfc : '',
    nif: item.dataSection?.typeIden === AllowedValuesRfcNifTinNss.NIF ? item.dataSection.rfc : '',
    tin: item.dataSection?.typeIden === AllowedValuesRfcNifTinNss.TIN ? item.dataSection.rfc : '',
    nss: item.dataSection?.typeIden === AllowedValuesRfcNifTinNss.SSN ? item.dataSection.rfc : '',
    firstName: item.dataSection?.firstName ?? '',
    middleName: item.dataSection?.middleName ?? '',
    firstLastName: item.dataSection?.firstLastName ?? '',
    secondLastName: item.dataSection?.secondLastName ?? '',
    dateOfBirth: convertDate(item.dataSection?.dateOfBirth ?? '').toString(),
    gender: compareAndReturnGender(item.dataSection?.gender ?? ''),
    maritalStatus: Number(item.dataSection?.maritalStatus) ?? 0,
    nacionality: item.dataSection?.nationality ?? '',
    countryOfBirth: item.dataSection?.countryOfBirth ?? '',
    occupation: item.taxSection?.occupation ?? '',
    profession: item.taxSection?.profession ?? '',
    federalEntity: item.dataSection?.stateOfBirth ?? '',
    relationship: Number(item.taxSection?.relationship) ?? 0,
    economicActivity: item.taxSection?.economicActivity ?? '',
    companyName: item.taxSection?.workCompany ?? '',
    positionHeld: item.taxSection?.positionHeld ?? '',
    phoneBussiness: item.taxSection?.phoneBusiness ?? '',
    fiscalCountry: item.taxSection?.fiscalCountry ?? '',
    fiscalIdentificationNumber: item.dataSection?.typeIden === AllowedValuesRfcNifTinNss.NIF ? item.dataSection.rfc : '',
    signatureType: item.taxSection?.signClass ?? '',
    IPABCoverage: '0',
    incomeTaxWithholding: '0',
    personPpe: {
      isPpe: item.ppeInfo?.ppe ?? false,
      ppeType: item.ppeInfo?.tppe ?? '',
      positionHeld: item.ppeInfo?.positionHeld ?? '',
      positionEndDate: convertDate(item.ppeInfo?.expirationDate ?? '').toString(),
      hasppeRelatives: item.ppeInfo?.fppe ?? false,
      ppeRelatives: item.ppeInfo?.dataFamily?.map(p => ({
        curp: p.curp ?? '',
        foreignerWithoutCurp: p.foreignerWithoutCurp ?? '',
        rfc: p.typeIden === AllowedValuesRfcNifTinNss.RFC ? p.rfc : '',
        nif: p.typeIden === AllowedValuesRfcNifTinNss.NIF ? p.rfc : '',
        tin: p.typeIden === AllowedValuesRfcNifTinNss.TIN ? p.rfc : '',
        nss: p.typeIden === AllowedValuesRfcNifTinNss.SSN ? p.rfc : '',
        firstName: p.firstName ?? '',
        middleName: p.middleName ?? '',
        firstLastName: p.firstLastName ?? '',
        secondLastName: p.secondLastName ?? '',
        dateOfBirth: convertDate(p.dateOfBirth ?? '').toString(),
        maritalStatus: 'p',
        nationality: p.nationality ?? '',
        countryOfBirth: p.countryOfBirth ?? '',
        federalEntity: '',
        relationship: Number(p.relationship) ?? 0,
        positionHeld: p.positionHeld ?? '',
        positionEndDate: convertDate(p.chargeDueDate ?? '').toString(),
      })) ?? []
    },
    identification: item.identifications
    ?.filter(item => item?.active === true)
    ?.map(i => ({
      countryOfIdentification: i.identificationCountryId ?? '',
      identificationType: i.identificationTypeId ?? '',
      identificationNumber: i.identificationNumber ?? '',
      expirationDate: i.identificationExpDate ?? ''
    })),
    residentialAddress: {
      addressRol: item.address?.addressRole ?? '',
      addressType: item.address?.addressType ?? '',
      other: item.address?.other ?? '',
      country: item.address?.country ?? '',
      street: item.address?.street ?? '',
      externalNumber: item.address?.externalNumber ?? '',
      internalNumber: item.address?.internalNumber ?? '',
      postalCode: item.address?.postalCode ?? '',
      federalEntity: item.address?.country === "MX" ? item.address?.federalEntityID ?? '' : item.address?.federalEntity ?? '',
      city: item.address?.country === "MX" ? item.address?.cityID ?? '' : item.address?.city ?? '',
      municipality: item.address?.country === "MX" ? item.address?.municipalityID ?? '' : item.address?.municipality ?? '',
      neighborhood: item.address?.neighborhood ?? '',
      geographicalArea: '',
      deliveryCenter: '',
    },
    contactData: {
      DataNonDisclosureLetter: item.manifestLetter,
      registeredPhones: item.phones
      ?.filter(item => item?.active === true)
      ?.map(p => ({
        type: Number(p.phoneTypeId) ?? 0,
        country: p.phoneCountryId ?? '',
        areaCode: p.phoneCodeArea ?? '',
        phone: p.phone?.toString() ?? '',
        extension: p.phoneExtension ?? '',
        notificationPhone: p.phoneNotification ?? false,
      })),
      registeredEmails: item.mails
      ?.filter(item => item?.active === true)
      ?.map(m => ({
        emailAddress: m.mail ?? '',
        notificationEmail: m.mailNotification ?? false,
      }))
    },
    faculties: {
      faculties: item.legalPowerSection?.adminitration ?? false,
      domain: item.legalPowerSection?.domain ?? false,
      delegationPower: item.legalPowerSection?.powerToDelegate ?? false,
      creditInstruments: item.legalPowerSection?.creditTitles ?? false,
      powerToOpenAccounts: item.legalPowerSection?.powerToOpenAccount ?? false,
      numberPropertyDeeds: item.legalPowerSection?.writingNumber ?? '',
      datePropertyDeeds: convertDate(item.legalPowerSection?.writingDate ?? '').toString(),
      notaryName: item.legalPowerSection?.writingNotaryName ?? '',
      notarynumber: Number(item.legalPowerSection?.notaryNumber) ?? 0,
      protocolizationBranch: item.legalPowerSection?.protocalizationPlace ?? '',
      limitationsOnAuthority: item.legalPowerSection?.powerLimitations ?? '',
    }
  }))

  return {
    signatureType: mapSignatureToCheckpoint(data.signType),
    instructions: data.instructions,
    ipabOwnership: data.titularIpabPercentaje?.toString() ?? '',
    isrRetention: data.titularIsrPecentaje?.toString() ?? '',
    coHolders: coholders,
    legalProxy: legalProxys
  }
}

export async function checkpointToSignSection(response: SignatureDataCheckpoint, phoneTypes: PhoneType[], countries: Countries[], identifications: IdentificationType[], zipCodeService: ZipCodeService):  Promise<SingSection>{



  const cotitularListSection: CotitularInfo[] = response.coHolders?.map((cot, index) => ({
    active: true,
      cotitularNumber: index + 1,
      clientNumber: '-', //TODO es necesario un client number opcional
      coHolderId: null,
      personId: null,
      cotitularId: crypto.randomUUID(),
      dataSection: {
        ppe: false,
        bankAreaTypeId: '',
        contraTypeId: '',
        typeContractSubtypeId: '',
        curp: cot.curp,
        foreignerWithoutCurp: cot.foreignerWithoutCurp,
        typeIden: determineTypeIndent(cot),
        rfc: rfcNifTinSsnValue(cot),
        dateOfBirth: formatDateYYYYMMDD(cot.dateOfBirth),
        gender: compareGenderAndReturnValue(cot.gender),
        maritalStatus: cot.maritalStatus?.toString() ?? '',
        nationality: cot.nacionality,
        countryOfBirth: cot.countryOfBirth,
        stateOfBirth: cot.federalEntity,
        cityOfBirth: '',
        firstName: cot.firstName,
        middleName: cot.middleName,
        firstLastName: cot.firstLastName,
        secondLastName: cot.secondLastName,
      },
      taxSection: {
        relationship: cot.relationship?.toString() ?? '',
        economicActivity: cot.economicActivity,
        occupation: cot.occupation ?? '', //TODO revisar
        profession: '', //TODO revisar  

        workCompany: cot.companyName,
        positionHeld: cot.positionHeld,
        phoneBusiness: cot.phoneBussiness,

        fiscalCountry: cot.fiscalCountry,
        fiscalIdentificationNumber: cot.fiscalIdentificationNumber,

        ipabTitularityPercent: Number(cot.IPABCoverage),
        retentionIsr: Number(cot.incomeTaxWithholding),
        signClass: cot.signatureType,
      },
      address: {
        addressRole: cot.residentialAddress.addressRol,
        addressType: cot.residentialAddress.addressType,
        other: cot.residentialAddress.other,
        country: cot.residentialAddress.country,
        postalCode: cot.residentialAddress.postalCode,
        federalEntity: cot.residentialAddress.country !== "MX" ? cot.residentialAddress.federalEntity : '',
        city: cot.residentialAddress.country !== "MX" ? cot.residentialAddress.city : '',
        municipality: cot.residentialAddress.country !== "MX" ? cot.residentialAddress.municipality : '',
        neighborhood: cot.residentialAddress.neighborhood,
        street: cot.residentialAddress.street,
        externalNumber: cot.residentialAddress.externalNumber,
        internalNumber: cot.residentialAddress.internalNumber,
        confirmCp: '',
        timeLiveMexico: '',
        reasonsOpeningContractMexico: '',
        proofOfAddressType: '',
        addressProofIssueDate: '',
        expirationYear: '',
        taxPostalCode: '',
        geographicalArea: '',
        deliveryCenter: '',
        neighborhoodName: '',
        addressConcatenation: '',
        federalEntityID: cot.residentialAddress.country === "MX" ? cot.residentialAddress.federalEntity : '',
        cityID: cot.residentialAddress.country === "MX" ? cot.residentialAddress.city : '',
        municipalityID: cot.residentialAddress.country === "MX" ? cot.residentialAddress.municipality : '',
      },
      autoSign: {
        mexicoResident: cot.fiscalSelfDeclaration.residesInMexico,
        curp: cot.curp,
        foreignerWithoutCurp: cot.foreignerWithoutCurp,
        rfc: cot.rfc,
        name: cot.fiscalSelfDeclaration.SATRegisteredName,
        fiscalRegimeId: Number(cot.fiscalSelfDeclaration.fiscalRegime),
        cfdiUse: cot.fiscalSelfDeclaration.useCFDI,
        taxPostalCode: cot.fiscalSelfDeclaration.taxPostalCode,
        nationality: cot.nacionality,
        country: cot.countryOfBirth,
        fiscalResidenceAbroad: cot.fiscalSelfDeclaration.taxAddress.length > 1,
        facta: cot?.fiscalSelfDeclaration?.facta, //TODO ES NECESARIO GUARDAR Y ENVIAR
        crs: cot?.fiscalSelfDeclaration?.foreignTaxResident, //TODO ES NECESARIO GUARDAR Y ENVIAR
        fiscalResidences: cot.fiscalSelfDeclaration.taxAddress?.map(res => ({
          tempId: '', //TODO ES NECESARIO GUARDAR Y ENVIAR
          personType: "COTITULAR",
          country: res.taxAddress.fiscalResidence,
          declarationFiscalResidence: res.taxAddress.selfCertification,
          proofOfAddressType: mapProffOfAddressTypeToDescSafe(res.taxAddress.proofOfTaxResidency),
          issueDate: formatDateYYYYMMDD(res.taxAddress.issueDate), //TODO ES NECESARIO GUARDAR Y ENVIAR
          expirationStatus: res.taxAddress.expirationStatus, //TODO ES NECESARIO GUARDAR Y ENVIAR
          expirationDate: formatDateYYYYMMDD(res.taxAddress.expirationDate), //TODO ES NECESARIO GUARDAR Y ENVIAR
          certificationDate: formatDateYYYYMMDD(res.taxAddress.certificationDate),
          declarationYear: res.taxAddress.declarationYear,
          aditionalDays: res.taxAddress.aditionalDays, //TODO ES NECESARIO GUARDAR Y ENVIAR
          factaObligations: {
            autentication: mapAutenticationTypeToDescSafe(res.fatcaCompliance.autentication),
            nif: res.fatcaCompliance.nif,
            tin: res.fatcaCompliance.tin,
            nss: res.fatcaCompliance.nss,
          }
        }))
      },
      ppeInfo: {
        ppe: cot.personPpe.isPpe,
        tppe: cot.personPpe.ppeType,
        positionHeld: cot.personPpe.positionHeld,
        expirationDate: formatDateYYYYMMDD(cot.personPpe.positionEndDate),
        fppe: cot.personPpe.hasppeRelatives,
        dataFamily: cot.personPpe?.ppeRelatives?.map(fam => ({
          curp: fam.curp,
          foreignerWithoutCurp: fam.foreignerWithoutCurp,
          rfc: rfcNifTinSsnValue(fam),
          firstName: fam.firstName,
          middleName: fam.middleName,
          dateOfBirth: formatDateYYYYMMDD(fam.dateOfBirth),
          firstLastName: fam.firstLastName,
          secondLastName: fam.secondLastName,
          nationality: fam.nationality,
          countryOfBirth: fam.countryOfBirth ?? '',
          countryTaxCodeAbroad: '', //TODO revisar
          typeIden: determineTypeIndent(fam),
          chargeDueDate: formatDateYYYYMMDD(fam.positionEndDate),
          relationship: fam.relationship?.toString()  ?? '',
          positionHeld: fam.positionHeld,
        })) ?? []
      },
      identifications: cot.identification?.map(i => ({
        id: crypto.randomUUID(),
        identificationCountry: countries.find(c => c.countryId === i.countryOfIdentification)?.country ?? '', 
        identificationCountryId: i.countryOfIdentification,
        identificationType: identifications.find(ident => ident.type === i.identificationType)?.text ?? '',
        identificationTypeId: i.identificationType,
        identificationNumber: i.identificationNumber,
        identificationExpDate: i.expirationDate,
        active: true,
      })),
      manifestLetter: cot.contactData.DataNonDisclosureLetter,
      phones: cot.contactData.registeredPhones?.map(p =>({
        id: crypto.randomUUID(),
        phone: p.phone,
        phoneType: phoneTypes.find(phone => phone.telephoneTypeId === p.type?.toString())?.telephoneType ?? '',
        phoneTypeId: p.type?.toString(),
        phoneCountry: countries.find(c => c.countryId === p.country)?.country ?? '',
        phoneCountryId: p.country,
        phoneCodeArea: p.areaCode,
        phoneExtension: p.extension,
        phoneNotification: p.notificationPhone,
        active: true,
      })),
      mails: cot.contactData.registeredEmails?.map(m => ({
        id: crypto.randomUUID(),
        mail: m.emailAddress,
        mailNotification: m.notificationEmail,
        active: true,
      }))
  }))

  const attoneryListSection: AttoneryInfo[] = response.legalProxy?.map((apo, index) => ({
    active: true,
    legalProxyId: null,
    personId: null,
    attoneryNumber: index + 1,
    clientNumber: '-', //TODO es necesario un client number opcional
    attoneryId: crypto.randomUUID(),
    dataSection: {
      ppe: false,
      bankAreaTypeId: '',
      contraTypeId: '',
      typeContractSubtypeId: '',
      curp: apo.curp,
      foreignerWithoutCurp: apo.foreignerWithoutCurp,
      typeIden: determineTypeIndent(apo),
      rfc: rfcNifTinSsnValue(apo),
      dateOfBirth: formatDateYYYYMMDD(apo.dateOfBirth),
      gender: compareGenderAndReturnValue(apo.gender),
      maritalStatus: apo.maritalStatus?.toString() ?? '',
      nationality: apo.nacionality,
      countryOfBirth: apo.countryOfBirth,
      stateOfBirth: apo.federalEntity,
      cityOfBirth: '',
      firstName: apo.firstName,
      middleName: apo.middleName,
      firstLastName: apo.firstLastName,
      secondLastName: apo.secondLastName,
    },
    taxSection: {
      relationship: apo.relationship?.toString()  ?? '',
      economicActivity: apo.economicActivity?.toString() ?? '',
      occupation: apo.occupation ?? '', //TODO revisar
      profession: apo.profession ?? '', //TODO revisar

      workCompany: apo.companyName,
      positionHeld: apo.positionHeld,
      phoneBusiness: apo.phoneBussiness,

      fiscalCountry: apo.fiscalCountry,
      fiscalIdentificationNumber: apo.fiscalIdentificationNumber,

      ipabTitularityPercent: Number(apo.IPABCoverage),
      retentionIsr: Number(apo.incomeTaxWithholding),
      signClass: apo.signatureType,
    },
    address: {
      addressRole: apo.residentialAddress.addressRol,
      addressType: apo.residentialAddress.addressType,
      other: apo.residentialAddress.other,
      country: apo.residentialAddress.country,
      postalCode: apo.residentialAddress.postalCode,
      federalEntity: apo.residentialAddress.country !== "MX" ? apo.residentialAddress.federalEntity : '',
      city: apo.residentialAddress.country !== "MX" ? apo.residentialAddress.city : '',
      municipality: apo.residentialAddress.country !== "MX" ? apo.residentialAddress.municipality : '',
      neighborhood: apo.residentialAddress.neighborhood,
      street: apo.residentialAddress.street,
      externalNumber: apo.residentialAddress.externalNumber,
      internalNumber: apo.residentialAddress.internalNumber,
      confirmCp: '',
      timeLiveMexico: '',
      reasonsOpeningContractMexico: '',
      proofOfAddressType: '',
      addressProofIssueDate: '',
      expirationYear: '',
      taxPostalCode: '',
      geographicalArea: '',
      deliveryCenter: '',
      neighborhoodName: '',
      addressConcatenation: '',
      federalEntityID: apo.residentialAddress.country === "MX" ? apo.residentialAddress.federalEntity : '',
      cityID: apo.residentialAddress.country === "MX" ? apo.residentialAddress.city : '',
      municipalityID: apo.residentialAddress.country === "MX" ? apo.residentialAddress.municipality : '',
    },
    ppeInfo: {
      ppe: apo.personPpe.isPpe,
      tppe: apo.personPpe.ppeType,
      positionHeld: apo.personPpe.positionHeld,
      expirationDate: formatDateYYYYMMDD(apo.personPpe.positionEndDate),
      fppe: apo.personPpe.hasppeRelatives,
      dataFamily: apo.personPpe?.ppeRelatives?.map(fam => ({
        curp: fam.curp,
        foreignerWithoutCurp: fam.foreignerWithoutCurp,
        rfc: rfcNifTinSsnValue(fam),
        firstName: fam.firstName,
        middleName: fam.middleName,
        dateOfBirth: formatDateYYYYMMDD(fam.dateOfBirth),
        firstLastName: fam.firstLastName,
        secondLastName: fam.secondLastName,
        nationality: fam.nationality,
        countryOfBirth: fam.countryOfBirth ?? '',
        countryTaxCodeAbroad: '', //TODO revisar
        typeIden: determineTypeIndent(fam),
        chargeDueDate: formatDateYYYYMMDD(fam.positionEndDate),
        relationship: fam.relationship?.toString() ?? '',
        positionHeld: fam.positionHeld,
      })) ?? []
    },
    identifications: apo.identification?.map(i => ({
      id: crypto.randomUUID(),
      identificationCountry: countries.find(c => c.countryId === i.countryOfIdentification)?.country ?? '', 
      identificationCountryId: i.countryOfIdentification,
      identificationType: identifications.find(ident => ident.type === i.identificationType)?.text ?? '',
      identificationTypeId: i.identificationType,
      identificationNumber: i.identificationNumber,
      identificationExpDate: i.expirationDate,
      active: true,
    })),
    manifestLetter: apo.contactData.DataNonDisclosureLetter,
    phones: apo.contactData.registeredPhones?.map(p =>({
      id: crypto.randomUUID(),
      phone: p.phone,
      phoneType: phoneTypes.find(phone => phone.telephoneTypeId === p.type?.toString())?.telephoneType ?? '',
      phoneTypeId: p.type?.toString(),
      phoneCountry: countries.find(c => c.countryId === p.country)?.country ?? '',
      phoneCountryId: p.country,
      phoneCodeArea: p.areaCode,
      phoneExtension: p.extension,
      phoneNotification: p.notificationPhone,
      active: true,
    })),
    mails: apo.contactData.registeredEmails?.map(m => ({
      id: crypto.randomUUID(),
      mail: m.emailAddress,
      mailNotification: m.notificationEmail,
      active: true,
    })),
    legalPowerSection: {
      adminitration: apo.faculties.faculties,
      domain: apo.faculties.domain,
      powerToDelegate: apo.faculties.delegationPower,
      creditTitles: apo.faculties.creditInstruments,
      powerToOpenAccount: apo.faculties.powerToOpenAccounts,

      writingNumber: apo.faculties.numberPropertyDeeds,
      writingDate: convertDateBack(apo.faculties.datePropertyDeeds) as Date,
      writingNotaryName: apo.faculties.notaryName,
      notaryNumber: apo.faculties.notarynumber?.toString(),
      protocalizationPlace: apo.faculties.protocolizationBranch,
      powerLimitations: apo.faculties.limitationsOnAuthority,
    },
    preFillAdress: false,
}))


  const cotitularTable: CotitularTableInfo[] = await Promise.all(
  cotitularListSection?.map(async cot => {
    let federalEntity = 'N/A';

    if (cot?.address?.federalEntity?.trim()) {
      federalEntity = cot.address.federalEntity;
    } else if (cot?.address?.federalEntityID?.trim()) {
      const zipCodeData = await firstValueFrom(
        zipCodeService.postData({ zipCode: cot?.address?.postalCode })
      );

      federalEntity = zipCodeData?.federalEntity?.toUpperCase()  ?? 'N/A';
    }

    const country =
      countries.find(c => c.countryId === (cot?.address?.country ?? ''))?.country ?? 'N/A';

    return cotitularInfoToTable(cot, `${federalEntity}, ${country}`);
    })
  );


  const attoneryTable: AttoneryTableInfo[] = await Promise.all(
  attoneryListSection?.map(async ato => {
    let federalEntity = 'N/A';

    if (ato?.address?.federalEntity?.trim()) {
      federalEntity = ato.address.federalEntity;
    } else if (ato?.address?.federalEntityID?.trim()) {
      const zipCodeData = await firstValueFrom(
        zipCodeService.postData({ zipCode: ato?.address?.postalCode })
      );

      federalEntity = zipCodeData?.federalEntity?.toUpperCase()  ?? 'N/A';
    }

    const country =
      countries.find(c => c.countryId === (ato?.address?.country ?? ''))?.country ?? 'N/A';
    return attoneryInfoToTable(ato, `${federalEntity}, ${country}`);
    })
  );

  return {
      id: 0,
      signType: mapCheckpointToSignature(response.signatureType),
      instructions: response.instructions,
      titularIpabPercentaje: Number(response.ipabOwnership),
      titularIsrPecentaje: Number(response.isrRetention),
      cotitularList: cotitularListSection,
      cotitularTableList: cotitularTable,
      attoneryList: attoneryListSection,
      attoneryTableList: attoneryTable
  }
}

export function mapSignatureToCheckpoint(type: string): string {
  switch (type) {
    case 'INDIVIDUAL':
      return '1'
    case 'MANCOMUNADA':
      return '2'
    case 'SOLIDARIA':
      return '3'
    default:
      return '0'
  }
}

export function mapCheckpointToSignature(type: string): string {
  switch (type) {
    case '1':
      return 'INDIVIDUAL'
    case '2':
      return 'MANCOMUNADA'
    case '3':
      return 'SOLIDARIA'
    default:
      return ''
  }
}

export function determineTypeIndent(data: Identifiable): string{
  if(data.rfc){
    return AllowedValuesRfcNifTinNss.RFC;
  } else if(data.nif){
    return AllowedValuesRfcNifTinNss.NIF;
  } else if(data.tin){
    return AllowedValuesRfcNifTinNss.TIN;
  } else if(data.nss){
    return AllowedValuesRfcNifTinNss.SSN;
  } else {
    return ''
  }
}

export function rfcNifTinSsnValue(data: Identifiable): string{
  if(data.rfc){
    return data.rfc;
  } else if(data.nif){
    return data.nif;
  } else if(data.tin){
    return data.tin;
  } else if(data.nss){
    return data.nss;
  } else {
    return ''
  }
}


type Identifiable = {
  rfc?: string;
  nif?: string;
  tin?: string;
  nss?: string;
}
