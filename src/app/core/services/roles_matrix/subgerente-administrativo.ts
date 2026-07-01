export const ROL_SUBGERENTE_ADMINISTRATIVO = {
  'customer-info': {
    'hide': false,
    'allDisabled': false,
    'fieldsDisabled': [],
    'fieldsEnabled': ['curp', 'gender', 'dateOfBirth', 'stateOfBirth', 'nationality', 'countryOfBirth'],
    'buttonsEnabled': ['btnSave', 'btnCancel'],
    'buttonsDisabled': ['btnSave', 'btnCancel']
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
    hide: false,
    allDisabled: true,
    permission: ['read'],
    fieldsDisabled: [],
    fieldsEnabled: [],
    buttonsEnabled: [],
    buttonsDisabled: []
  },
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
    fieldsDisabled: [],
    buttonsDisabled: []
  },
  directorate: {
    hide: false,
    allDisabled: false,
    permission: ['read' ,'edit'],
    fieldsDisabled: [],
    buttonsDisabled: []
  },
  'spid-profile':{
    hide: false,
    allDisabled: false,
    permission: ['read', 'edit'],
    fieldsDisabled: [],
    buttonsDisabled: []
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
    allDisabled: true,
    permission: ['read'],
    fieldsDisabled: [],
    fieldsEnabled: [],
    buttonsEnabled: [],
    buttonsDisabled: []
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
  'sign': {
    'hide': false,
    'allDisabled': false,
    'fieldsDisabled': [],
    'buttonsDisabled': [],
    'sections': {
      'cotitular-modal': {
        'allDisabled': false,
        'fieldsDisabled': [],
        'buttonsDisabled': ['btnAddCotitular'],
        'sections': {
          'autoCertSection': {
            'allDisabled': false,
            'fieldsEnabled': ['name'],
            'buttonsEnabled': [],
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
          'clientDataSection': {
            'allDisabled': false,
            'fieldsEnabled': ['firstName', 'middleName',
              'firstLastName', 'secondLastName'],
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
        'fieldsDisabled': ['openDate',
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
                          'longitude'],
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
    'allDisabled': false,
    'fieldsDisabled': [],
    'buttonsDisabled': [],
    'sections': {
      "profile": {
        'allDisabled': true,
      },
      "banxico": {
        'allDisabled': true,
      },
      "company-general-data": {
        'allDisabled': false,
        'fields': ['socialCapital', 'investmentRange', 'isGobermentMoralPerson', 'companySize'],
      },
      "fiscal-info": {
        'allDisabled': true,
      },
      "fiel": {
        'allDisabled': false,
        'fields': ['haveResourceProvider'],
      },
      "vulnerable-activities": {
        'allDisabled': true,
      },
      "constitutive-documents": {
        'allDisabled': false,
        'fields': [],
      },
    },
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
  'privacy-notice': {
    hide: false,
    'allDisabled': true,
    'fieldsDisabled': [],
    'buttonsDisabled': []
  },
  'pld-quiz': {
    hide: false,
    'allDisabled': false,
    'fieldsDisabled': [],
    'buttonsDisabled': []
  },
  'transactional-investment-profile': {
    hide: false,
    'allDisabled': false,
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
    hide: false,
    'allDisabled': true,
    'fieldsDisabled': [],
    'buttonsDisabled': []
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
    hide: false,
    'allDisabled': false,
    'fieldsDisabled': [],
    'buttonsDisabled': []
  },
  'organization-chart': {
    'hide': false,
    'allDisabled': true,
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
    'allDisabled': true,
    'fieldsDisabled': [],
    'buttonsDisabled': []
  },
  'administrator-exercising-pf-control': {
    'allDisabled': false,
    'hide': false,
    'sections': {
      'general-data': {
        'allDisabled': false,
        'fieldsDisabled': [],
        'fieldsEnabled': ['countryOfBirth', 'nationality'],
        'table': {
          'edit': true,
          'delete': false,
          'add': false
        }
      },
      'address': {
        'allDisabled': true,
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
    'permission': ['read','add','edit','delete'],
    'allDisabled': false,
    'fieldsDisabled': [],
    'buttonsDisabled': []
  },
  'tax-info': {
    'hide': false,
    'permission': ['read','add','edit','delete'],
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
    'allDisabled': false,
    'fieldsDisabled': [],
    'buttonsDisabled': []
  },
};
