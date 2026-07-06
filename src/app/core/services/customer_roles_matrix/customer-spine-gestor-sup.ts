export const CUSTOMER_SPINE_GESTOR_SUP = {
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
    'permission': [],
    'fieldsDisabled': [],
    'buttonsEnabled': [],
    'buttonsDisabled': []
  },
  'tax-info': { 
    'hide': false,
    'allDisabled': false,
    'permission': ['read', 'edit', 'add', 'delete'],
    'fieldsDisabled': [],
    'buttonsEnabled': ['btnSave', 'btnCancel'],
    'buttonsDisabled': ['btnSave', 'btnCancel']
  },
};
