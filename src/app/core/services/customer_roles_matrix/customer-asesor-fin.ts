export const CUSTOMER_ROL_ASESOR_FIN = {
  'address': {
    'hide': false,
    'allDisabled': true,
    'permission': [],
    'fieldsEnabled': [],
    'fieldsDisabled': [],
    'buttonsEnabled': [],
    'buttonsDisabled': []
  },
  'contact-info': {
    'hide': false,
    'allDisabled': true,
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
  'customer-info': {
    'hide': false,
    'allDisabled': true,
    'fieldsDisabled': [],
    'fieldsEnabled': [],
    'buttonsEnabled': ['btnSave', 'btnCancel'],
    'buttonsDisabled': ['btnSave', 'btnCancel']
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

            'client-section': {
                'allDisabled': false,
                'fieldsDisabled': ['changeOperation', 'haveBanxicoAutorization'
                    , 'actinverEmployee', 'actinverEmployeeNumber', 'mensajesMt940'
                    , 'codigoSwiftBic'],
                'buttonsDisabled': []
            },
        }
    },
  'ppe-info': {
    'hide': false,
    'allDisabled': true,
    'permission': [],
    'fieldsDisabled': [],
    'buttonsEnabled': [],
    'buttonsDisabled': []
  },
  'tax-info': { 
    'hide': false,
    'allDisabled': true,
    'permission': [],
    'fieldsDisabled': [],
    'buttonsEnabled': [],
    'buttonsDisabled': ['btnSave', 'btnCancel']
  },
};
