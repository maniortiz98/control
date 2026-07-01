export const ROL_ASESOR_FIN = {
    'authorized-person': {
        hide: false,
        allDisabled: false,
        permission: ['read', 'edit'],
        fieldsDisabled: [],
        fieldsEnabled: [
            'economicActivity',
            'profession',
            'workCompany',
            'jobTitle',
            'isPpe',
            'ppeType',
            'ppeRol',
            'ppeExpires',
            'ppeHasFamily',
        ],
        buttonsDisabled: [],
        sections: {
            clientDataComponent: {
                formName: 'profileForm',
                disabled: true
            },
            addressComponent: {
                formName: 'profileForm',
                disabled: true
            },
            phoneSectionComponent: {
                formName: 'form',
                disabled: true
            },
        },
    },
    'authorized-person-pm': {
        hide: true,
        allDisabled: true,
        permission: ['xxxxxxx'],
        fieldsEnabled: ['xxxxxxx'],
        fieldsDisabled: ['xxxxxxx'],
        buttonsEnabled: ['xxxxxxx'],
        buttonsDisabled: ['xxxxxxx'],
    },
    'bank-account': {
        hide: false,
        allDisabled: true,
        permission: ['read'],
        fieldsDisabled: [],
        fieldsEnabled: [],
        buttonsEnabled: [],
        buttonsDisabled: []
    },
    'bank-account-pm': {
        hide: true,
        allDisabled: true,
        permission: ['xxxxxxx'],
        fieldsEnabled: ['xxxxxxx'],
        fieldsDisabled: ['xxxxxxx'],
        buttonsEnabled: ['xxxxxxx'],
        buttonsDisabled: ['xxxxxxx'],
    },
    'beneficiaries': {
        hide: false,
        allDisabled: true,
        permission: ['read'],
        fieldsDisabled: [],
        fieldsEnabled: [],
        buttonsEnabled: [],
        buttonsDisabled: []
    },
    'beneficiaries-pm': {
        hide: true,
        allDisabled: true,
        permission: ['xxxxxxx'],
        fieldsEnabled: ['xxxxxxx'],
        fieldsDisabled: ['xxxxxxx'],
        buttonsEnabled: ['xxxxxxx'],
        buttonsDisabled: ['xxxxxxx'],
    },
    'directorate': {
        hide: true,
        allDisabled: true,
        permission: ['xxxxxxx'],
        fieldsEnabled: ['xxxxxxx'],
        fieldsDisabled: ['xxxxxxx'],
        buttonsEnabled: ['xxxxxxx'],
        buttonsDisabled: ['xxxxxxx'],
    },
    'spid-profile': {
        hide: true,
        allDisabled: true,
        permission: ['xxxxxxx'],
        fieldsEnabled: ['xxxxxxx'],
        fieldsDisabled: ['xxxxxxx'],
        buttonsEnabled: ['xxxxxxx'],
        buttonsDisabled: ['xxxxxxx'],
    },
    'customer-info': {
        'hide': false,
        'allDisabled': false,
        'fieldsDisabled': [],
        'fieldsEnabled': ['curp', 'typeIden', 'rfc'],
        'buttonsEnabled': ['btnSave', 'btnCancel'],
        'buttonsDisabled': ['btnSave', 'btnCancel']
    },
    'real-owner': {
        'hide': false,
        'allDisabled': true,
        'delete': false,
        'fieldsDisabled': [],
        'buttonsEnabled': [],
        'buttonsDisabled': ['btnSave', 'btnCancel', 'btnEdit', 'btnAddFam', 'btnAddFamModal']
    },
    'resource-provider': {
        'hide': false,
        'allDisabled': true,
        'delete': false,
        'fieldsDisabled': [],
        'buttonsEnabled': [],
        'buttonsDisabled': ['btnSave', 'btnCancel', 'btnEdit', 'btnAddFam', 'btnAddFamModal']
    },
    'address': {
        'hide': false,
        'allDisabled': false,
        'add': false,
        'edit': true,
        'delete': false,
        'fieldsDisabled': [],
        'buttonsEnabled': [],
        'buttonsDisabled': []
    },
    'ppe-info': {
        'hide': false,
        'allDisabled': false,
        'add': true,
        'edit': true,
        'delete': true,
        'fieldsDisabled': [],
        'buttonsEnabled': [],
        'buttonsDisabled': []
    },
    'spouse': {
        'hide': false,
        'allDisabled': false,
        'add': false,
        'edit': false,
        'delete': false,
        'fieldsDisabled': [],
        'buttonsEnabled': [],
        'buttonsDisabled': []
    },
    'contact-info': {
        'hide': false,
        'allDisabled': false,
        'fieldsDisabled': [],
        'buttonsDisabled': [],
        'sections': {
            'identification': {
                'allDisabled': true,
                'fieldsDisabled': [],
                'buttonsDisabled': []
            },
            'phone': {
                'allDisabled': false,
                'edit': true,
                'fieldsDisabled': [],
                'buttonsDisabled': []
            },
            'mail': {
                'allDisabled': false,
                'edit': true,
                'fieldsDisabled': [],
                'buttonsDisabled': []
            },

        }
    },
    'contact-info-pm': {
        'hide': false,
        'allDisabled': true,
        'fieldsDisabled': [],
        'buttonsDisabled': [],
        'sections': {
            'phone': {
                'allDisabled': true,
                'fieldsDisabled': [],
                'buttonsDisabled': []
            },
            'mail': {
                'allDisabled': true,
                'fieldsDisabled': [],
                'buttonsDisabled': []
            },
        }
    },
    sign: {
        allDisabled: false,
        hide: false,
        fieldsDisabled: ['signType', 'titularIpabPercentaje'],
        buttonsDisabled: [],
        sections: {
            'cotitular-modal': {
                allDisabled: false,
                fieldsDisabled: [],
                buttonsDisabled: [],
                sections: {
                    clientDataSection: {
                        allDisabled: false,
                        fieldsEnabled: ['curp', 'rfc', 'gender', 'typeIden', 'maritalStatus'],
                        buttonsEnabled: [],
                    },
                    miscellaneousSection: {
                        'allDisabled': false,
                        'fieldsEnabled': ['relationship', 'economicActivity',
                            'workCompany', 'positionHeld', 'phoneBusiness',
                            'fiscalCountry', 'retentionIsr'],
                        'buttonsEnabled': [],
                    },
                    addressSection: {
                        allDisabled: false,
                        fieldsEnabled: [
                            'addressRole',
                            'addressType',
                            'other',
                            'country',
                            'postalCode',
                            'federalEntity',
                            'city',
                            'municipality',
                            'neighborhood',
                            'street',
                            'externalNumber',
                            'internalNumber',
                        ],
                        buttonsEnabled: [],
                    },
                    identificationSection: {
                        allDisabled: true,
                        fieldsDisabled: [],
                        buttonsDisabled: [],
                    },
                    phoneSection: {
                        allDisabled: false,
                        fieldsEnabled: ['*'],
                        buttonsDisabled: [],
                    },
                    mailSection: {
                        allDisabled: false,
                        fieldsEnabled: ['*'],
                        buttonsDisabled: [],
                    },
                    'ppeSection': {
                        'allDisabled': false,
                        'fieldsEnabled': [],
                        'buttonsEnabled': [],
                    },
                    autoCertSection: {
                        allDisabled: false,
                        fieldsEnabled: [
                            'mexicoResident',
                            'rfc',
                            'name',
                            'fiscalRegimeId',
                            'cfdiUse',
                            'taxPostalCode',
                            'fiscalResidenceAbroad',
                        ],
                        fieldsDisabled: [
                            'curp',
                            'foreignerWithoutCurp',
                            'country',
                            'nationality',
                            'fatca',
                            'crs',
                        ],
                        'permission': ['read', 'edit', 'add', 'delete'],
                        buttonsEnabled: ['addFiscalResidences'],
                        buttonsDisabled: [],
                    },
                },
            },
            'attonery-modal': {
                allDisabled: false,
                fieldsDisabled: [],
                buttonsDisabled: [],
                sections: {
                    clientDataSection: {
                        allDisabled: false,
                        fieldsEnabled: ['curp', 'rfc', 'gender', 'typeIden', 'maritalStatus'],
                    },
                    miscellaneousSection: {
                        'allDisabled': false,
                        'fieldsEnabled': ['relationship', 'economicActivity',
                            'workCompany', 'positionHeld', 'occupation', 'profession', 'phoneBusiness',
                            'fiscalCountry', 'retentionIsr'],
                        'buttonsEnabled': [],
                    },
                    addressSection: {
                        allDisabled: false,
                        fieldsEnabled: [
                            'addressRole',
                            'addressType',
                            'other',
                            'country',
                            'postalCode',
                            'federalEntity',
                            'city',
                            'municipality',
                            'neighborhood',
                            'street',
                            'externalNumber',
                            'internalNumber',
                        ],
                    },
                    'ppeSection': {
                        'allDisabled': false,
                        'fieldsEnabled': [],
                        'buttonsEnabled': [],
                    },
                    identificationSection: {
                        allDisabled: true,
                    },
                    phoneSection: {
                        allDisabled: false,
                        fieldsEnabled: ['*'],
                    },
                    mailSection: {
                        allDisabled: false,
                        fieldsEnabled: ['*'],
                    },
                },
            },
        },
    },
    'sign-pm': {
        'hide': false,
        'allDisabled': true,
        'fieldsDisabled': [],
        'buttonsDisabled': [],
    },
    'general-info': {
        'hide': false,
        'allDisabled': false,
        'fieldsDisabled': [],
        'buttonsDisabled': [],
        'sections': {
            'executor-modal': {
                'allDisabled': true,
                'fieldsDisabled': [],
                'buttonsDisabled': []
            },
            'contract-section': {
                'allDisabled': false,
                'fieldsDisabled': [
                    'saleForceProspect', 'contractStatus',
                    'isNumbered', 'checkProtected', 'isOwnPosition',
                    'isSocialPrevision', 'authorizationConsultCreditReports',
                    'contractDenomination', 'PMContractBE', 'h2hServices', 'independentAsesor',
                    'asociatedDirector', 'financailCenter',
                    'comissionPercentage',
                    'trust', 'clientHasTrust', 'brokerageActinverTrust',
                    'isPMSorety', 'isBrokerageHouse',
                    'externalCustody', 'custody', 'custodyIndeval', 'financialCenterDelivery',
                    'contractManagement', 'gestionType',
                    'strategyTypes', 'equityStrategies', 'isEquity',
                    'operationReason', 'otherReasons', 'operationConfiramtionMedia',
                    'documents', 'transfers', 'accountDeposit', 'other', 'otherPreferedProduct',
                    'asociatedDirectorStatus', 'asociatedDirectorFolio',
                    'asociatedDirectorNumber', 'asociatedDirectorName',
                    'dateOfDefunction',
                    'openDate',
                    'initialRiskId',
                    'clientStatus',
                    'initialRiskDescription',
                    'modifyRiskId',
                    'modifyRiskDespcription',
                    'origin',
                    'n4UpdateDate',
                    'liverpoolDomicilie',
                    'biometricsAccount',
                    'facialBiometrics',
                    'accountLevel',
                    'enrollmentStatus',
                    'directPromote',
                    'consentGeolocalization',
                    'date',
                    'time',
                    'latitude',
                    'longitude'
                ],
                'buttonsDisabled': []
            },
            'client-section': {
                'allDisabled': false,
                'fieldsDisabled': ['changeOperation', 'haveBanxicoAutorization'
                    , 'actinverEmployee', 'actinverEmployeeNumber', 'mensajesMt940'
                    , 'codigoSwiftBic'],
                'buttonsDisabled': []
            },
        }
    },
    'general-info-pm': {
        'hide': false,
        'allDisabled': true,
        'buttonsDisabled': [],
    },
    'operate-changes': {
        'hide': false,
        'allDisabled': true,
        'fieldsDisabled': [],
        'buttonsDisabled': []
    },
    'operate-changes-pm': {
        'hide': true,
        'allDisabled': true,
        'fieldsDisabled': [],
        'buttonsDisabled': []
    },
    'privacy-notice': {
        hide: false,
        'allDisabled': true,
        'fieldsDisabled': [],
        'buttonsDisabled': []
    },
    'pld-quiz': {
        hide: false,
        allDisabled: true,
        permission: [],
        fieldsDisabled: [],
        buttonsDisabled: []
    },
    'transactional-investment-profile': {
        hide: false,
        allDisabled: false,
        fieldsDisabled: [
            '1',
            '2',
            '3',
            '4',
            '5',
            '6',
            '7',
            '8',
            '9',
            '10',
            '11',
            '12',
            '13',
            '14',
            '15',
            '16',
            '17',
            'transactionalLimit',
            'btnSaveTIP',
            'btnCancelTIP'
        ],
        buttonsDisabled: [],
    },
    'sales-practices': {
        hide: false,
        'allDisabled': false,
        'fieldsDisabled': [],
        'buttonsDisabled': []
    },
    'actiweb': {
        hide: false,
        allDisabled: true,
        permission: [],
        fieldsEnabled: [],
        fieldsDisabled: [],
        buttonsEnabled: [],
        buttonsDisabled: [],
    },
    'customer-info-pm': {
        hide: false,
        'allDisabled': false,
        'fieldsDisabled': [],
        'buttonsDisabled': []
    },
    'address-pm': {
        hide: false,
        'allDisabled': true,
        'fieldsDisabled': [],
        'buttonsEnabled': [],
        'buttonsDisabled': []
    },
    'pld-quiz-pm': {
        'hide': false,
        'allDisabled': true,
        'fieldsDisabled': [],
        'buttonsDisabled': []
    },
    'organization-chart': {
        'hide': true,
        'allDisabled': true,
        'fieldsDisabled': [],
        'buttonsDisabled': []
    },
    'entity-status': {
        'hide': true,
        'allDisabled': true,
        'fieldsDisabled': [],
        'buttonsDisabled': []
    },
    'resource-provider-pm': {
        'hide': true,
        'allDisabled': true,
        'fieldsDisabled': [],
        'buttonsDisabled': []
    },
    'administrator-exercising-pf-control': {
        'allDisabled': true,
        'hide': false,
        'sections': {
            'general-data': {
                'allDisabled': false,
                'fieldsDisabled': ['fatca', 'crs'],
                'table': {
                    'edit': true,
                    'delete': false,
                    'add': false
                }
            },
            'address': {
                'allDisabled': false,
                'fieldsDisabled': [],
            },
            'table': {
                'edit': false,
                'delete': false,
                'add': false
            },
        },
        'fieldsDisabled': [],
        'buttonsDisabled': []
    },
    'interview': {
        'hide': false,
        'permission': ['read', 'edit', 'add', 'delete'],
        'allDisabled': true,
        'fieldsDisabled': [],
        'fieldsEnabled': ['opening'],
        'buttonsDisabled': []
    },
    'tax-info': {
        'hide': false,
        'permission': ['read', 'edit', 'add', 'delete'],
        'allDisabled': false,
        'fieldsDisabled': ['foreignerWithoutCurp'],
        'buttonsDisabled': [],
        'fieldsEnabled': ['*'],
        'buttonsEnabled': ['btnSave', 'btnCancel'],
    },
    'credit-data': {
        'hide': false,
        'permission': ['read', 'add'],
        'allDisabled': false,
        'fieldsDisabled': [],
        'buttonsDisabled': []
    },
    'additional-info': {
        'hide': false,
        'permission': ['read', 'add', 'edit', 'delete'],
        'allDisabled': false,
        'fieldsDisabled': ['isrExempt'],
        'buttonsDisabled': []
    },
    'tax-profile': {
        'hide': false,
        'allDisabled': true,
        'fieldsDisabled': [],
        'buttonsDisabled': []
    },
};
