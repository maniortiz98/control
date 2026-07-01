export const SPINE_GESTOR_OP = {
    'authorized-person': {
        hide: false,
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
        buttonsDisabled: [],
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
        hide: false,
        allDisabled: true,
        permission: ['read'],
        fieldsEnabled: [],
        fieldsDisabled: [],
        buttonsEnabled: [],
        buttonsDisabled: [],
    },
    beneficiaries: {
        hide: false,
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
    'directorate': {
        hide: true,
        allDisabled: true,
        permission: [],
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
        'allDisabled': true,
        'fieldsDisabled': [],
        'buttonsEnabled': [],
        'buttonsDisabled': ['btnSave', 'btnCancel']
    },
    'address': {
        'hide': false,
        'allDisabled': true,
        'fieldsDisabled': [],
        'buttonsEnabled': [],
        'buttonsDisabled': []
    },
    'spouse': {
        'hide': false,
        'allDisabled': true,
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
    'ppe-info': {
        'hide': true,
        allDisabled: false,
        buttonsDisabled: [],
    },
    'contact-info': {
        'hide': false,
        allDisabled: false,
        'fieldsDisabled': [],
        'buttonsDisabled': [],
        'sections': {
            'identification': {
                'allDisabled': true,
                'fieldsDisabled': [],
                'buttonsDisabled': []
            },
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
                'buttonsDisabled': ['btnAddCotitular']
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
        'hide': false,
        'allDisabled': true,
        'fieldsDisabled': [],
        'buttonsDisabled': [],
        'sections': {
            'executor-modal': {
                'allDisabled': true,
                'fieldsDisabled': [],
                'buttonsDisabled': []
            },
            'contract-section': {
                'allDisabled': true,
                'fieldsDisabled': [],
                'buttonsDisabled': []
            },
            'client-section': {
                'allDisabled': true,
                'fieldsDisabled': [],
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
        'allDisabled': true, //UPDATE TO NO ACCESS
        'hide': true,
        'fieldsDisabled': [],
        'buttonsDisabled': []
    },
    'pld-quiz': {
        'allDisabled': true,
        'hide': true,
        'fieldsDisabled': [],
        'buttonsDisabled': []
    },
    'transactional-investment-profile': {
        'allDisabled': true,
        'hide': true,
        'fieldsDisabled': [],
        'buttonsDisabled': []
    },
    'sales-practices': {
        hide: true,
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
        hide: false,
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
        'hide': true,
        'allDisabled': true,
        'fieldsDisabled': [],
        'buttonsDisabled': []
    },
    'tax-info': {
        'hide': true,
        'allDisabled': true,
        'fieldsDisabled': [],
        'buttonsDisabled': []
    },
    'credit-data': {
        'hide': true,
        'allDisabled': true,
        'fieldsDisabled': [],
        'buttonsDisabled': []
    },
    'additional-info': {
        'hide': true,
        'allDisabled': true,
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