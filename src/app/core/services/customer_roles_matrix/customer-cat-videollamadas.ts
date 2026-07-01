export const CUSTOMER_ROL_CAT_VIDEOLLAMADAS = {
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
                'fieldsDisabled': ['changeOperation', 'haveBanxicoAutorization', 'fiel', 'expirationFiel',
                    'isOwnAccountAct', 'haveResourceProvider', 'sector', 'actinverEmployee', 'actinverEmployeeNumber'
                    , 'relationship', 'isParentOfEmployee'],
                'buttonsDisabled': []
            },
        }
    },
  'ppe-info': {
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
