import { CustomerTabs } from '../models/customer-tabs';

export const TABS_PF: Array<CustomerTabs> = [
  {
    label: 'Datos Iniciales',
    path: 'customer-info',
    step: 1,
    disabled: false,
    hide: false,
  },
  {
    label: 'Datos Generales',
    path: 'general-info',
    step: 2,
    disabled: true,
    hide: false,
  },
  {
    label: 'Identificación y Datos de Contacto',
    path: 'contact-info',
    step: 3,
    disabled: true,
    hide: false,
  },
  {
    label: 'Datos de Cónyuge',
    path: 'spouse',
    step: 4,
    disabled: true,
    hide: true,
  },
  {
    label: 'Información PPE',
    path: 'ppe-info',
    step: 5,
    disabled: true,
    hide: false,
  },
  {
    label: 'Domicilios',
    path: 'address',
    step: 6,
    disabled: true,
    hide: false,
  },
  {
    label: 'Autocertificación y Datos Fiscales',
    path: 'tax-info',
    step: 7,
    disabled: true,
    hide: false,
  },
];



