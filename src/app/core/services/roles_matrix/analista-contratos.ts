export const ROL_ANALISTA_DE_CONTRATOS = {
    'customer-info': {
        'hide': false,
        'allDisabled': false,
        'fieldsEnabled': [],
        'fieldsDisabled': [],
        'buttonsEnabled': ['btnSave', 'btnCancel'],
        'buttonsDisabled': ['btnSave', 'btnCancel']
    },
    beneficiaries: {
        hide: false,
        allDisabled: false,
        permission: ['read', 'edit', 'add', 'delete'],
        fieldsDisabled: [],
        fieldsEnabled: [],
        buttonsEnabled: [],
        buttonsDisabled: []
    },
    'beneficiaries-pm': {
        hide: false,
        allDisabled: false,
        permission: ['read', 'edit'],
        fieldsDisabled: [],
        fieldsEnabled: [],
        buttonsEnabled: [],
        buttonsDisabled: []
    },
    'authorized-person': {
        hide: false,
        allDisabled: false,
        permission: ['read', 'edit', 'add'],
        fieldsDisabled: [],
        buttonsDisabled: []
    },
    'authorized-person-pm': {
        hide: false,
        allDisabled: false,
        permission: ['read', 'edit'],
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
        permission: ['read', 'edit'],
        fieldsEnabled: [],
        fieldsDisabled: [],
        buttonsEnabled: [],
        buttonsDisabled: [],
    },
    'directorate': {
        hide: false,
        allDisabled: false,
        permission: ['read', 'edit'],
        fieldsEnabled: [],
        fieldsDisabled: [],
        buttonsEnabled: [],
        buttonsDisabled: [],
    },
    'spid-profile': {
        hide: false,
        allDisabled: false,
        permission: ['read', 'edit'],
        fieldsEnabled: [],
        fieldsDisabled: [],
        buttonsEnabled: [],
        buttonsDisabled: [],
    },
    'real-owner': {
        'hide': false,
        'allDisabled': false,
        'delete': false,
        'fieldsDisabled': [],
        'buttonsEnabled': ['btnCancel',],
        'buttonsDisabled': ['btnSave', 'btnAddFam', 'btnCancel', 'btnAddFamModal']
    },
    'resource-provider': {
        'hide': false,
        'allDisabled': false,
        'delete': false,
        'fieldsDisabled': [],
        'buttonsEnabled': ['btnCancel',],
        'buttonsDisabled': ['btnSave', 'btnAddFam', 'btnCancel', 'btnAddFamModal']
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
        buttonsDisabled: [],
    },
    'privacy-notice': {
        hide: false,
        'allDisabled': true,
        'fieldsDisabled': [],
        'buttonsDisabled': []
    },
    'pld-quiz': {
        hide: false,
        allDisabled: false,
        permission: ['read', 'edit'],
        fieldsDisabled: [],
        buttonsDisabled: []
    },
    'transactional-investment-profile': {
        hide: false,
        'allDisabled': false,
        'fieldsDisabled': ['btnSaveTIP', 'btnCancelTIP'],
        'buttonsDisabled': []
    },
    'sales-practices': {
        hide: false,
        'allDisabled': false,
        'fieldsDisabled': [],
        'buttonsDisabled': []
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
    'sign': {
        'hide': false,
        'allDisabled': false,
        'fieldsDisabled': [],
        'buttonsDisabled': [],
        'sections': {
            'cotitular-modal': {
                'allDisabled': false,
                'delete': true,
                'fieldsDisabled': [],
                'buttonsDisabled': [],
                'sections': {
                    'identificationSection': {
                        'allDisabled': false,
                        'fieldsDisabled': [],
                        'buttonsDisabled': [],
                        'buttonsEnabled': ['privacidad']
                    },
                    'phoneSection': {
                        'allDisabled': false,
                        'fieldsDisabled': [],
                        'buttonsDisabled': [],
                    },
                    'mailSection': {
                        'allDisabled': false,
                        'fieldsDisabled': [],
                        'buttonsDisabled': [],
                    },
                    'main': {
                        'allDisabled': false,
                        'fieldsEnabled': [],
                        'buttonsEnabled': [],
                    },
                    'clientDataSection': {
                        'allDisabled': false,
                        'fieldsEnabled': [],
                        'buttonsEnabled': [],
                    },
                    'miscellaneousSection': {
                        'allDisabled': false,
                        'fieldsEnabled': [],
                        'buttonsEnabled': [],
                    },
                    'addressSection': {
                        'allDisabled': false,
                        'fieldsEnabled': [],
                        'buttonsEnabled': [],
                    },
                    'ppeSection': {
                        'allDisabled': false,
                        'fieldsEnabled': [],
                        'buttonsEnabled': [],
                    },
                    'autoCertSection': {
                        'allDisabled': false,
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
                        'buttonsEnabled': ['addFiscalResidences'],
                        'permission': ['read', 'edit', 'add', 'delete'],
                    },
                }
            },
            'attonery-modal': {
                'allDisabled': false,
                'delete': true,
                'fieldsDisabled': [],
                'buttonsDisabled': [],
                'sections': {
                    'identificationSection': {
                        'allDisabled': false,
                        'fieldsDisabled': [],
                        'buttonsDisabled': [],
                    },
                    'phoneSection': {
                        'allDisabled': false,
                        'fieldsDisabled': [],
                        'buttonsDisabled': [],
                    },
                    'mailSection': {
                        'allDisabled': false,
                        'fieldsDisabled': [],
                        'buttonsDisabled': [],
                    },
                    'main': {
                        'allDisabled': false,
                        'fieldsEnabled': [],
                        'buttonsEnabled': [],
                    },
                    'clientDataSection': {
                        'allDisabled': false,
                        'fieldsEnabled': [],
                        'buttonsEnabled': [],
                    },
                    'miscellaneousSection': {
                        'allDisabled': false,
                        'fieldsEnabled': [],
                        'buttonsEnabled': [],
                    },
                    'addressSection': {
                        'allDisabled': false,
                        'fieldsEnabled': [],
                        'buttonsEnabled': [],
                    },
                    'ppeSection': {
                        'allDisabled': false,
                        'fieldsEnabled': [],
                        'buttonsEnabled': [],
                    },
                    'legalPowerSection': {
                        'allDisabled': false,
                        'fieldsEnabled': [],
                        'buttonsEnabled': [],
                    },
                }
            },
        }
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
                'allDisabled': false,
                'fieldsDisabled': [],
                'buttonsDisabled': []
            },
            'contract-section': {
                'allDisabled': false,
                'fieldsDisabled': ['openDate',
                                  'initialRiskId',
                                  'clientStatus',
                                  'initialRiskDescription',
                                  'modifyRiskId',
                                  'modifyRiskDespcription',
                                  'origin',
                                  'n4UpdateDate',
                                  'liverpoolDomicilie',
                                  'accountLevel',
                                  'consentGeolocalization',
                                  'date',
                                  'time',
                                  'latitude',
                                  'longitude'],
                'buttonsDisabled': []
            },
            'client-section': {
                'allDisabled': false,
                'fieldsDisabled': [],
                'buttonsDisabled': []
            },
        }
    },
    'general-info-pm': {
        'hide': false,
        'allDisabled': false,
        'buttonsDisabled': [],
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
    'operate-changes': {
        'hide': false,
        'allDisabled': false,
        'fieldsDisabled': [],
        'buttonsDisabled': []
    },
    'operate-changes-pm': {
        'hide': false,
        'allDisabled': false,
        'fieldsDisabled': [],
        'buttonsDisabled': []
    },
    'actiweb': {
        hide: false,
        allDisabled: false,
        permission: ['read', 'edit'],
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
        'hide': false,
        'allDisabled': false,
        'add': false,
        'edit': true,
        'delete': false,
        'fieldsDisabled': [],
        'buttonsEnabled': [],
        'buttonsDisabled': []
    },
    'pld-quiz-pm': {
        hide: false,
        'allDisabled': false,
        'fieldsDisabled': [],
        'buttonsDisabled': []
    },
    'organization-chart': {
        'hide': false,
        'allDisabled': false,
        'fieldsDisabled': [],
        'buttonsDisabled': []
    },
    'entity-status': {
        'hide': false,
        'allDisabled': false,
        'fieldsDisabled': [],
        'buttonsDisabled': [],
        'sections': {
            'fiscal-countries': {
                'allDisabled': false,
            },
            'facta': {
                'allDisabled': false,
            },
            'crs': {
                'allDisabled': true,
            },
            'person-control': {
                'allDisabled': true,
            },
        }
    },
    'resource-provider-pm': {
        'hide': false,
        'allDisabled': false,
        'fieldsDisabled': [],
        'buttonsDisabled': []
    },
    'administrator-exercising-pf-control': {
        'allDisabled': false,
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
        'permission': ['read', 'add', 'edit', 'delete'],
        'allDisabled': false,
        'fieldsDisabled': [],
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
        'fieldsDisabled': [],
        'buttonsDisabled': []
    },
    'tax-profile': {
        'hide': false,
        'allDisabled': false,
        'fieldsDisabled': [],
        'buttonsDisabled': []
    },
};
