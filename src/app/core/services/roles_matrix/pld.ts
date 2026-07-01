export const ROL_PLD = {
    'customer-info': {
        'hide': false,
        'allDisabled': false,
        'fieldsDisabled': [],
        'fieldsEnabled': ['curp', 'rfc', 'typeIden'],
        'buttonsEnabled': ['btnSave', 'btnCancel'],
        'buttonsDisabled': ['btnSave', 'btnCancel']
    },
    'beneficiaries': {
        hide: true,
        allDisabled: true,
        permission: ['read'],
        fieldsDisabled: [],
        fieldsEnabled: [],
        buttonsEnabled: [],
        buttonsDisabled: []
    },
    'beneficiaries-pm': {
        hide: false,
        allDisabled: true,
        permission: ['read'],
        fieldsDisabled: [],
        fieldsEnabled: [],
        buttonsEnabled: [],
        buttonsDisabled: []
    },
    'authorized-person': {
        hide: true,
        allDisabled: true,
        permission: ['read'],
        fieldsDisabled: [],
        buttonsDisabled: []
    },
    'authorized-person-pm': {
        hide: false,
        allDisabled: true,
        permission: ['read'],
        fieldsEnabled: [],
        fieldsDisabled: [],
        buttonsEnabled: [],
        buttonsDisabled: []
    },
    'bank-account': {
        hide: true,
        allDisabled: false,
        permission: ['read', 'edit', 'add', 'delete'],
        fieldsDisabled: [],
        fieldsEnabled: [],
        buttonsEnabled: [],
        buttonsDisabled: []
    },
    'bank-account-pm': {
        hide: false,
        allDisabled: true,
        permission: ['read'],
        fieldsEnabled: [],
        fieldsDisabled: [],
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
        buttonsDisabled: []
    },
    'spid-profile': {
        hide: false,
        allDisabled: true,
        permission: ['read'],
        fieldsEnabled: [],
        fieldsDisabled: [],
        buttonsEnabled: [],
        buttonsDisabled: []
    },
    'real-owner': {
        'hide': true,
        'allDisabled': true,
        'delete': false,
        'fieldsDisabled': [],
        'buttonsEnabled': [],
        'buttonsDisabled': ['btnSave', 'btnCancel', 'btnEdit', 'btnAddFam', 'btnAddFamModal']
    },
    'resource-provider': {
        'hide': true,
        'allDisabled': true,
        'delete': false,
        'fieldsDisabled': [],
        'buttonsEnabled': [],
        'buttonsDisabled': ['btnSave', 'btnCancel', 'btnEdit', 'btnAddFam', 'btnAddFamModal']
    },
    'address': {
        'hide': false,
        'allDisabled': true,
        'fieldsDisabled': [],
        'buttonsEnabled': [],
        'buttonsDisabled': []
    },
    'ppe-info': {
        'hide': false,
        'allDisabled': false,
        'add': false,
        'edit': true,
        'delete': false,
        'fieldsDisabled': [],
        'buttonsEnabled': [],
        'buttonsDisabled': []
    },
    'spouse': {
        'hide': true,
        'allDisabled': false,
        'add': false,
        'edit': false,
        'delete': false,
        'fieldsDisabled': [],
        'buttonsEnabled': [],
        'buttonsDisabled': []
    },
    'contact-info': {
        'hide': true,
        'allDisabled': false,
        'fieldsDisabled': [],
        'buttonsDisabled': [],
        'sections': {
            'identification': {
                'allDisabled': false,
                'fieldsDisabled': [],
                'buttonsDisabled': ['save', 'delete']
            },
            'phone': {
                'allDisabled': false,
                'fieldsDisabled': [],
                'buttonsDisabled': ['save', 'delete']
            },
            'mail': {
                'allDisabled': false,
                'fieldsDisabled': [],
                'buttonsDisabled': ['save', 'delete']
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
    'sign': {
        'hide': false,
        'allDisabled': true,
        'fieldsDisabled': [],
        'buttonsDisabled': [],
        'sections': {
            'cotitular-modal': {
                'allDisabled': true,
                'fieldsDisabled': [],
                'buttonsDisabled': ['btnAddCotitular'],
                'sections': {
                    'autoCertSection': {
                        'allDisabled': true,
                        'fieldsEnabled': [],
                        'buttonsEnabled': [],
                    },
                    'phoneSection': {
                        'allDisabled': true,
                        'fieldsDisabled': [],
                        'buttonsDisabled': [],
                    },
                    'mailSection': {
                        'allDisabled': true,
                        'fieldsDisabled': [],
                        'buttonsDisabled': [],
                    },
                    'clientDataSection': {
                        'allDisabled': true,
                        'fieldsEnabled': [],
                        'buttonsEnabled': [],
                    },
                }
            },
            'attonery-modal': {
                'allDisabled': true,
                'fieldsDisabled': [],
                'buttonsDisabled': ['btnAddAttonery']
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
        'hide': true,
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
                'fieldsDisabled': [],
                'buttonsDisabled': []
            },
            'client-section': {
                'allDisabled': false,
                'fieldsDisabled': ['changeOperation', 'expirationFiel',
                    'isOwnAccountAct', 'haveResourceProvider'],
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
        hide: true,
        'allDisabled': true,
        'fieldsDisabled': [],
        'buttonsDisabled': []
    },
    'pld-quiz': {
        hide: true,
        'allDisabled': false,
        'fieldsDisabled': [],
        'buttonsDisabled': []
    },
    'transactional-investment-profile': {
        hide: true,
        'allDisabled': false,
        'fieldsDisabled': [],
        'buttonsDisabled': []
    },
    'sales-practices': {
        hide: false,
        'allDisabled': true,
        'fieldsDisabled': [],
        'buttonsDisabled': []
    },
    'actiweb': {
        hide: true,
        'allDisabled': true,
        'fieldsDisabled': [],
        'buttonsDisabled': []
    },
    'customer-info-pm': {
        hide: false,
        'allDisabled': true,
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
        'permission': ['read'],
        'allDisabled': true,
        'fieldsDisabled': [],
        'buttonsDisabled': []
    },
    'tax-info': {
        'hide': false,
        'permission': ['read'],
        'allDisabled': true,
        'fieldsDisabled': [],
        'buttonsDisabled': []
    },
    'credit-data': {
        'hide': false,
        'permission': ['read'],
        'allDisabled': true,
        'fieldsDisabled': [],
        'buttonsDisabled': []
    },
    'additional-info': {
        'hide': false,
        'permission': ['read'],
        'allDisabled': true,
        'fieldsDisabled': [],
        'buttonsDisabled': []
    },
    'tax-profile': {
        'hide': false,
        'allDisabled': true,
        'fieldsDisabled': [],
        'buttonsDisabled': []
    },
};