export const STRINGS = {
  CITY: 'cities',
  COUNTRY: 'country',
  DELETE: 'delete',
  EDIT: 'edit',
  ENTITY: 'federalEntity',
  FOREIGN: 'NE',
  GENDER: 'H',
  MEXICAN: 'MX',
  USA: 'US',
  MEXICO: 'MX',
  NATIONALITY: 'nationality',
  CFDI: 'cfdi',
  FISCALREGIME: 'fiscalRegime',
  RFC: "1",
};

export const ADDRESS = {
  DOMICILE_ROLE: '5',
  DOMICILE_ROLE_ONE_PM: '2',
  DOMICILE_ROLE_TWO_PM: 'SUCURSAL',
  DOMICILE_TYPE: 'OTRO',
  PREDIAL: "03",
  INE: "04",
};

export const CATALOG_NAME = {
  ACCOUNT_STATEMENT: 'accountStatement',
  ACCOUNT_TYPE: 'accountType',
  BANK: 'bank',
  BRANCH: 'branch',
  CITY: 'cities',
  COUNTRY: 'countries',
  CURRENCY_TYPE: 'currencyType',
  ECNOMIC_ACTIVITIES: 'economicActivity',
  ENTITY: 'entities',
  IDENTIFICATION_TYPES: 'identificationType',
  MARITAL_STATUS: 'maritalStatus',
  MARRIAGE_TYPE: 'marriageType',
  NATIONALITY: 'nationalityes',
  OCCUPATIONS: 'occupations',
  PERSON_TYPES: 'personType',
  PHONE_TYPES: 'phoneType',
  RELATIONSHIPS: 'relationships',
};

export const APIS_SERVICES = {
  VALITDATE_OTC: 'otcValidate',
  SEND_OTC_SMS: 'otcSendSms',
  SEND_OTC_MAIL: 'otcSendEmail',
};

export const SEARCH_TYPE = {
  CUSTOMER: 'customer',
  PROSPECT: 'prospect',
};

export const TYPE_IDENTIFICATION = {
  NIF: 'nif',
  NSS: 'nss',
  TIN: 'tin',
  RFC: 'rfc',
};

export const CLIENT = {
  KEY: 'dataClient',
};

export const REGEX = {
  ALPHANUMERIC: /^[A-Za-z0-9]+$/,
  CITY_VALIDATION: /^[A-ZÜÑ.\s]{2,50}$/,
  CURP_VALIDATION: /^[A-Z]{4}[0-9]{6}[HMX][A-Z]{5}[0-9A-Z][0-9]$/,
  FIRST_NAME_VALIDATION: /^[A-ZÄËÏÖÜŞ0-9\(\!\'@\*\),\[\]\/\\Ñ:\-\=\?><#\$%\.\; ]{0,50}$/,
  LAST_NAME_VALIDATION: /^[A-ZÄËÏÖÜŞ0-9\(\!\'@\*\),\[\]\/\\Ñ:\-\=\?><#\$%\.\; ]{0,50}$/,
  MAIL_VALIDATION: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{1,}$/,
  MONEY: /^\d+\.\d{1,2}$/,
  MULTIPLE_SPACES: /\s+/g,
  NIF_TIN_NSS_PM_VALIDATION: /^[a-zA-Z0-9]{9}$/,
  NIF_TIN_NSS_VALIDATION: /^[a-zA-Z0-9]{1,13}$/,
  ONLY_NUMBERS: /^[0-9]+$/,
  PHONE_INVALIDS: [/^0+$/, /^[01]+$/, '0123456789', '1234567890'],
  PHONE_VALIDATION: /^[0-9]{7,15}$/,
  RFC_PM_VALIDATION: /^[A-ZÑ]{1,3}[0-9]{6}[0-9A-Z]{3}$/,
  RFC_VALIDATION: /^([A-ZÑ&]{4}\d{6}|[A-ZÑ&]{4}\d{6}[A-Z0-9]{3})$/,
  RFC_VALIDATION_COMPLETE: /^[A-ZÑ&]{4}\d{6}[A-Z0-9]{3}$/,
  STATE_VALIDATION: /^[A-ZÜÑ.\s]{2,50}$/,
  SWIFT_VALIDATION: /^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/,
  BIC_VALIDATION: /^([a-zA-Z0-9]{8}|[a-zA-Z0-9]{11})$/,
};

export const PERSON_TYPE = {
  LEGAL: 'moral',
  NATURAL: 'fisica',
  PF: 'PF',
  PM: 'PM',
};

export const LOCAL_STORAGE_KEYS = {
  MAIL_CONTACT_INFO: 'mailcontact',
  MAIL_CONTACT_INFO_COTITULAR: 'mailCotitularContact',
  MAIL_CONTACT_INFO_COTITULAR_ALBACEA: 'mailCotitularContactAlbacea',
  PHONE_CONTACT_INFO: 'phoneContact',
  PHONE_CONTACT_INFO_COTITULAR: 'phoneCotitularContact',
  PHONE_CONTACT_INFO_COTITULAR_ALBACEA: 'phoneCotitularContactAlbacea',
  IDENTIFICATION_CONTACT_INFO: 'identificationContact',
};

export const CHECKPOINT_IDS = {
  TRANSACTIONAL_INVESTMENT_PROFILE: 'transactionalInvestmentProfile',
  IDENTIFICATION_SECTION: 'identification-contact',
  GENERAL_INFO_SECTION: 'general-information',
  INITIAL_DATA_SECTION: 'initial-data',
  OPERATE_CHANGE: 'exchange-operation',
  SIGNATURE: '',
  PLD_QUIZ: '',
};

export type FormFlow = 
  'initialFlow' |
  'normalFlow' |
  'searchOfRequest' |
  'homonymy' |
  'clear'
;