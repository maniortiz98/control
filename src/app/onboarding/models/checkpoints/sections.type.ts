/**
 * Onboarding sections.
 *
 * Please fill with sections that only appears in Onboarding.
 */
export type CheckpointSections = 'questionnairePld' // Jonathan
| 'privacy-notice'                   // Alan
| 'transactional-investment-profile' // Alan
| 'identification-contact'           // Luis
| 'general-information'              // Luis
| 'exchange-operation'               // Luis
| 'signature'                        // Luis
| 'authorized-person'                // Jonathan
| 'bank-account'                     // Jonathan
| 'beneficiaries'                    // Jonathan
| 'actiweb'                          // Jonathan
| 'initial-data'                     // Felix
| 'address'                          // Felix
| 'ppe-information'                  // Felix
| 'real-owner'                       // Felix
| 'resources-provider'               // Felix
| 'personal-interview'               // Gayol
| 'fiscal-self-declaration'          // Gayol
;


/**
 * Allowed Sections
 * ONBOARDING - PERSONA MORAL
 */
export type CheckpointSectionPM =
    | 'questionnairePld'
    | 'privacy-notice'
    | 'transactional-investment-profile'
    | 'identification-contact'
    | 'general-information'
    | 'exchange-operation'
    | 'signature'
    | 'authorized-person'
    | 'bank-account'
    | 'beneficiaries'
    | 'initial-data'
    | 'address'
    | 'ppe-information'
    | 'real-owner'
    | 'resources-provider'
    | 'personal-interview'
    | 'fiscal-self-declaration'
    ;


/**
 * Sections that appears in Maintenance Mode
 *
 * please fill only with section in Maintenance
 */
export type CheckpointSectionsMant = 'questionnairePld' // Jonathan
| 'privacy-notice'                   // Alan
| 'transactional-investment-profile' // Alan
| 'identification-contact'           // Luis
| 'general-information'              // Luis
| 'exchange-operation'               // Luis
| 'signature'                        // Luis
| 'authorized-person'                // Jonathan
| 'bank-account'                     // Jonathan
| 'beneficiaries'                    // Jonathan
| 'actiweb'                          // Jonathan
| 'initial-data'                     // Felix
| 'address'                          // Felix
| 'ppe-information'                  // Felix
| 'real-owner'                       // Felix
| 'resources-provider'                // Felix
| 'personal-interview'               // Gayol
| 'fiscal-self-declaration'          // Gayol

| 'additional-information'
| 'credit-information' // Datos Crediticios | credit-data.component | path: credit-data
| 'spouse-data'
| 'tax-profile'
;


/**
 * Allowed Sections
 * MAINTENANCE - PERSONA MORAL
 */
export type CheckpointSectionManttoPM = '';