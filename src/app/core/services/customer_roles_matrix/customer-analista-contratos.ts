export const CUSTOMER_ROL_ANALISTA_DE_CONTRATOS = {
  'address': {
    'hide': false,
    'allDisabled': false,
    'permission': ['read', 'edit', 'add', 'delete'],
    'fieldsEnabled': [],
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
  'customer-info': {
    'hide': false,
    'allDisabled': false,
    'fieldsEnabled': [],
    'fieldsDisabled': [],
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
                'allDisabled': false,
                'fieldsDisabled': [],
                'buttonsDisabled': []
            },

            'client-section': {
                'allDisabled': false,
                'fieldsDisabled': [],
                'buttonsDisabled': []
            },
        }
    },
  'ppe-info': {
    'hide': false,
    'allDisabled': true,
    'permission': ['read', 'edit', 'add', 'delete'],
    'fieldsDisabled': [],
    'buttonsEnabled': [],
    'buttonsDisabled': []
  },
  'tax-info': { 
    'hide': false,
    'allDisabled': false,
    'permission': ['read', 'edit', 'add', 'delete'],
    'fieldsEnabled': [],
    'fieldsDisabled': [],
    'buttonsEnabled': ['btnSave', 'btnCancel'],
    'buttonsDisabled': ['btnSave', 'btnCancel']
  },
};
