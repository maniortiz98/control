export const ROL_CAT_VIDEOLLAMADAS = {
    'authorized-person': {
        hide: false,
        allDisabled: false,
        permission: ['read', 'edit'],
        fieldsDisabled: [],
        buttonsDisabled: [],
        add: true,
        delete: true,
        fieldsEnabled: [],
        buttonsEnabled: [],
        sections: {}
    },
    'authorized-person-pm': {
        hide: false,
        allDisabled: true,
        permission: ['read'],
        fieldsEnabled: [],
        fieldsDisabled: [],
        buttonsEnabled: [],
        buttonsDisabled: [],
    },
    'bank-account': {
        hide: false,
        allDisabled: false,
        permission: ['read', 'edit', 'add', 'delete'],
        fieldsDisabled: [],
        fieldsEnabled: [],
        buttonsEnabled: [],
        buttonsDisabled: []
    },
    'bank-account-pm': {
        hide: false,
        allDisabled: false,
        permission: ['read', 'edit', 'add', 'delete'],
        fieldsEnabled: [],
        fieldsDisabled: [],
        buttonsEnabled: [],
        buttonsDisabled: [],
    },
    beneficiaries: {
        hide: false,
        allDisabled: false,
        permission: ['read', 'edit', 'add', 'delete'],
        fieldsDisabled: [],
        fieldsEnabled: [],
        buttonsEnabled: [],
        buttonsDisabled: [],
    },
    'beneficiaries-pm': {
        hide: false,
        allDisabled: false,
        permission: ['read', 'edit', 'add', 'delete'],
        fieldsDisabled: [],
        fieldsEnabled: [],
        buttonsEnabled: [],
        buttonsDisabled: []
    },
    'directorate': {
        hide: false,
        allDisabled: true,
        permission: ['read'],
        fieldsEnabled: [],
        fieldsDisabled: [],
        buttonsEnabled: [],
        buttonsDisabled: [],
    },
    'spid-profile': {
        hide: true,
        allDisabled: true,
        permission: [],
        fieldsEnabled: [],
        fieldsDisabled: [],
        buttonsEnabled: [],
        buttonsDisabled: [],
    },
    'customer-info': {
        'hide': false,
        'allDisabled': false,
        'fieldsDisabled': [],
        'fieldsEnabled': ['curp', 'gender', 'dateOfBirth', 'stateOfBirth', 'foreignerWithoutCurp', 'typeIden', 'rfc'],
        'buttonsEnabled': ['btnSave', 'btnCancel'],
        'buttonsDisabled': ['btnSave', 'btnCancel']
    },
    'address': {
        'hide': false,
        'allDisabled': false,
        'add': true,
        'edit': true,
        'delete': true,
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
    'real-owner': {
        'hide': true,
        allDisabled: false,
        buttonsDisabled: [],
    },
    'resource-provider': {
        'hide': true,
        allDisabled: false,
        buttonsDisabled: [],
    },
    'contact-info': {
        'hide': false,
        'allDisabled': false,
        'fieldsDisabled': [],
        'buttonsDisabled': [],
        'sections': {
            'identification': {
                'allDisabled': false,
                'fieldsDisabled': [],
                'buttonsDisabled': []
            },
            'phone': {
                'allDisabled': false,
                'fieldsDisabled': [],
                'buttonsDisabled': []
            },
            'mail': {
                'allDisabled': false,
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
        hide: false,
        allDisabled: false,
        fieldsDisabled: ['signType'],
        buttonsEnabled: ['addFiscalResidences'],
        buttonsDisabled: [],
        sections: {
            'cotitular-modal': {
                allDisabled: false,
                fieldsDisabled: [],
                buttonsDisabled: [],
                sections: {
                    clientDataSection: {
                        allDisabled: false,
                        fieldsEnabled: [
                            'curp',
                            'foreignerWithoutCurp',
                            'gender',
                            'rfc',
                            'typeIden',
                            'maritalStatus'
                        ],
                        buttonsEnabled: [],
                    },
                    miscellaneousSection: {
                        'allDisabled': false,
                        'fieldsEnabled': ['relationship', 'economicActivity',
                            'workCompany', 'positionHeld', 'phoneBusiness',
                            'fiscalCountry', 'retentionIsr', 'ipabTitularityPercent'],
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
                            'confirmCp',
                            'timeLiveMexico',
                            'reasonsOpeningContractMexico',
                            'proofOfAddressType',
                            'addressProofIssueDate',
                            'expirationYear',
                            'taxPostalCode',
                            'geographicalArea',
                            'deliveryCenter',
                            'federalEntityID',
                            'cityID',
                            'municipalityID',
                        ],
                        buttonsEnabled: [],
                    },
                    identificationSection: {
                        allDisabled: false,
                        fieldsDisabled: [],
                        buttonsDisabled: [],
                        buttonsEnabled: ['privacidad']
                    },
                    phoneSection: {
                        allDisabled: false,
                        fieldsDisabled: [],
                        buttonsDisabled: [],
                    },
                    mailSection: {
                        allDisabled: false,
                        fieldsDisabled: [],
                        buttonsDisabled: [],
                    },
                    'ppeSection': {
                        'allDisabled': false,
                        'fieldsEnabled': [],
                        'buttonsEnabled': [],
                    },
                    autoCertSection: {
                        allDisabled: false,
                        fieldsEnabled: ['mexicoResident',
                            'rfc',
                            'name',
                            'fiscalRegimeId',
                            'cfdiUse',
                            'taxPostalCode',
                            'fiscalResidenceAbroad',
                            'curp',
                            'foreignerWithoutCurp',
                            'country',
                            'nationality',],
                        fieldsDisabled: [
                            'fatca',
                            'crs',],
                        buttonsEnabled: ['addFiscalResidences'],
                        buttonsDisabled: [],
                        'permission': ['read', 'edit', 'add', 'delete'],
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
                        fieldsEnabled: [
                            'curp',
                            'rfc',
                            'typeIden',
                            'gender',
                            'maritalStatus',
                        ],
                        buttonsEnabled: [],
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
                            'confirmCp',
                            'timeLiveMexico',
                            'reasonsOpeningContractMexico',
                            'proofOfAddressType',
                            'addressProofIssueDate',
                            'expirationYear',
                            'taxPostalCode',
                            'geographicalArea',
                            'deliveryCenter',
                            'federalEntityID',
                            'cityID',
                            'municipalityID',
                        ],
                        buttonsEnabled: [],
                    },
                    'ppeSection': {
                        'allDisabled': false,
                        'fieldsEnabled': [],
                        'buttonsEnabled': [],
                    },
                    identificationSection: {
                        allDisabled: false,
                        fieldsDisabled: [],
                        buttonsDisabled: [],
                    },
                    phoneSection: {
                        allDisabled: false,
                        fieldsDisabled: [],
                        buttonsDisabled: [],
                    },
                    mailSection: {
                        allDisabled: false,
                        fieldsDisabled: [],
                        buttonsDisabled: [],
                    },
                    'legalPowerSection': {
                        'allDisabled': false,
                        'fieldsEnabled': [],
                        'buttonsEnabled': [],
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
                    'isrMonthlyCommision', 'comissionPercentage',
                    'trust', 'clientHasTrust', 'brokerageActinverTrust',
                    'isPMSorety', 'isBrokerageHouse',
                    'externalCustody', 'custody', 'custodyIndeval', 'financialCenterDelivery',
                    'contractManagement', 'gestionType',
                    'vip',
                    'strategyTypes', 'equityStrategies', 'isEquity',
                    'operationReason', 'otherReasons', 'operationConfiramtionMedia',
                    'documents', 'transfers', 'accountDeposit', 'other', 'otherPreferedProduct',
                    'asociatedDirectorStatus', 'asociatedDirectorFolio',
                    'asociatedDirectorNumber', 'asociatedDirectorName',
                    'dateOfDefunction','openDate',
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
                'fieldsDisabled': ['changeOperation', 'haveBanxicoAutorization', 'fiel', 'expirationFiel',
                    'isOwnAccountAct', 'haveResourceProvider', 'sector', 'actinverEmployee', 'actinverEmployeeNumber'
                    , 'relationship', 'isParentOfEmployee'],
                'buttonsDisabled': []
            },
        }
    },
    'general-info-pm': {
        'hide': false,
        'allDisabled': false,
        'fieldsDisabled': [],
        'buttonsDisabled': [],
        'sections': {
            "profile": {
                'allDisabled': false,
                'fields': ['personType', 'personClasification', 'moralPersonClasification', 'economicActivities', 'otherEconomicActivities', 'sector', 'employeesNumber', 'w9facta', 'exemptDE', 'exemptIVA', 'retentionISR', 'privateCompany'],
            },
            "banxico": {
                'allDisabled': true,
            },
            "company-general-data": {
                'allDisabled': false,
                'fields': ['socialCapital', 'investmentRange', 'isGobermentMoralPerson', 'companySize'],
            },
            "fiscal-info": {
                'allDisabled': false,
                'fields': ['rfc', 'socialReason', 'zipCode', 'taxRegime', 'cdfi'],
            },
            "fiel": {
                'allDisabled': false,
                'fields': ['haveResourceProvider'],
            },
            "vulnerable-activities": {
                'allDisabled': false,
                'fields': ['vulnerableActivity', 'activity'],
            },
            "constitutive-documents": {
                'allDisabled': false,
            },
        },
    },
    'operate-changes': {
        'hide': true,
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
        'allDisabled': true, //UPDATE TO NO ACCESS
        'hide': false,
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
        'allDisabled': false,
        'hide': false,
        'fieldsDisabled': ['btnSaveTIP', 'btnCancelTIP'],
        'buttonsDisabled': []
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
        hide: true,
        'allDisabled': true,
        'fieldsDisabled': [],
        'buttonsEnabled': [],
        'buttonsDisabled': []
    },
    'pld-quiz-pm': {
        'allDisabled': true,
        'hide': true,
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
        'allDisabled': false,
        'hide': true,
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
                'edit': true,
                'delete': false,
                'add': false
            },
        },
        'fieldsDisabled': [],
        'buttonsDisabled': []
    },
    'interview': {
        'hide': false,
        'permission': ['read', 'add', 'edit', 'delete'],
        'allDisabled': false,
        'fieldsDisabled': [],
        'fieldsEnabled': ['opening'],
        'buttonsDisabled': []
    },
    'tax-info': {
        'hide': false,
        'allDisabled': false,
        'permission': ['read', 'edit', 'add', 'delete'],
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
        'permission': ['read', 'edit', 'add', 'delete'],
        'allDisabled': false,
        'fieldsDisabled': [],
        'buttonsDisabled': []
    },
    'tax-profile': {
        'hide': true,
        'allDisabled': true,
        'fieldsDisabled': [],
        'buttonsDisabled': []
    },
};
