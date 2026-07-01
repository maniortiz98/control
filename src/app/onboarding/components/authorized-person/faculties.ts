export interface FacultyContractOption {
    id: string;
    title: string;
    text1: string;
    text2: string;
    options: Array<string>;
    otherOpt: boolean;
    relation: {
        contractId: number;
        subcontractId: number;
        personType: ('PF'|'PM')[];
    }[]
};
export const facultiesContractOptions: FacultyContractOption[] = [
    {
        id: '2-AS-016',
        title: 'Facultades para el Contrato de Intermediación Bursátil',
        text1: 'Formular instrucciones respecto de la celebración de operaciones incluyéndose compras y/o ventas o retiros a las cuentas a nombre del Cliente, conforme a las políticas internas establecidas; estas instrucciones no incluyen el dar de alta, ni dar de baja ni modificar ninguno de los datos previamente registrados por el Cliente.',
        text2: 'La Persona Autorizada podrá girar instrucciones mediante vía telefónica o por escrito o con firma autógrafa, para lo cual deberá respetar en todo momento las siguientes instrucciones de firma:',
        options: [
            '1 Firma A',
            '1 Firma B',
            '2 Firmas A',
            '2 Firmas B',
            'Una firma A y una firma B'
        ],
        otherOpt: true,
        relation: [
            {
                contractId: 8,
                subcontractId: 49,
                personType: ['PF', 'PM'],
            }, {
                contractId: 8,
                subcontractId: 50,
                personType: ['PF', 'PM'],
            }, {
                contractId: 8,
                subcontractId: 51,
                personType: ['PM'],
            }, {
                contractId: 8,
                subcontractId: 52,
                personType: ['PF', 'PM'],
            }, {
                contractId: 8,
                subcontractId: 53,
                personType: ['PF', 'PM'],
            }, {
                contractId: 8,
                subcontractId: 54,
                personType: ['PF', 'PM'],
            }, {
                contractId: 8,
                subcontractId: 55,
                personType: ['PF', 'PM'],
            }, {
                contractId: 8,
                subcontractId: 56,
                personType: ['PF', 'PM'],
            }, {
                contractId: 8,
                subcontractId: 62,
                personType: ['PF', 'PM'],
            }, {
                contractId: 8,
                subcontractId: 63,
                personType: ['PF', 'PM'],
            }, {
                contractId: 8,
                subcontractId: 64,
                personType: ['PF', 'PM'],
            }, {
                contractId: 8,
                subcontractId: 67,
                personType: ['PF', 'PM'],
            }, {
                contractId: 8,
                subcontractId: 70,
                personType: ['PF', 'PM'],
            }
        ]
    }, {
        id: '4-AS-002',
        title: 'Facultades para el Contrato Marco Productos y Servicios Bancarios Múltiples (Persona Moral)',
        text1: 'Realizar cargos y depósitos a las cuentas registradas en el contrato; realizar depósitos y retiros bancarios de la cuenta eje;' +
            'Girar órdenes de compra, traspaso y venta de títulos en los fondos, conforme a las políticas establecidas en los prospectos de dichos fondos, así como para que autorice al Banco para que en nombre del Cliente realice operaciones de compra, venta o reporto de valores y operaciones de compraventa de divisas.'
            + 'Girar instrucciones vía telefónica a través de los Centros de Atención Telefónica del Banco, por escrito, con firma autógrafa o por correo electrónico a partir de la dirección de correo señalada dentro de los datos de la persona autorizada.',
        text2: 'Acceder al manejo, administración y disposición de las chequeras que en su momento sean solicitadas por el Cliente, como medio de disposición de los recursos del contrato, siempre atendiendo a la categoría e instrucciones de firma designadas para la Persona Autorizada, para lo cual deberá respetar en todo momento las siguientes instrucciones de firma:',
        options: [
            '1 Firma A',
            '1 Firma B',
            '2 Firmas A',
            '2 Firmas B',
            'Una firma A y una firma B',
        ],
        otherOpt: true,
        relation: [
            {
                contractId: 1,
                subcontractId: 2,
                personType: ['PM']
            }, {
                contractId: 1,
                subcontractId: 3,
                personType: ['PM']
            }, {
                contractId: 1,
                subcontractId: 4,
                personType: ['PM']
            }, {
                contractId: 1,
                subcontractId: 5,
                personType: ['PM']
            }, {
                contractId: 1,
                subcontractId: 7,
                personType: ['PM']
            }, {
                contractId: 1,
                subcontractId: 8,
                personType: ['PM']
            }, {
                contractId: 1,
                subcontractId: 9,
                personType: ['PM']
            }, {
                contractId: 1,
                subcontractId: 10,
                personType: ['PM']
            }, {
                contractId: 1,
                subcontractId: 11,
                personType: ['PM']
            }, {
                contractId: 1,
                subcontractId: 12,
                personType: ['PM']
            }, {
                contractId: 1,
                subcontractId: 13,
                personType: ['PM']
            }, {
                contractId: 1,
                subcontractId: 14,
                personType: ['PM']
            }, {
                contractId: 1,
                subcontractId: 15,
                personType: ['PM']
            }, {
                contractId: 1,
                subcontractId: 16,
                personType: ['PM']
            }, {
                contractId: 1,
                subcontractId: 17,
                personType: ['PM']
            }, {
                contractId: 1,
                subcontractId: 18,
                personType: ['PM']
            }, {
                contractId: 1,
                subcontractId: 20,
                personType: ['PM']
            }, {
                contractId: 1,
                subcontractId: 21,
                personType: ['PM']
            }, {
                contractId: 1,
                subcontractId: 23,
                personType: ['PM']
            }, {
                contractId: 1,
                subcontractId: 24,
                personType: ['PM']
            }, {
                contractId: 1,
                subcontractId: 26,
                personType: ['PM']
            }, {
                contractId: 1,
                subcontractId: 27,
                personType: ['PM']
            }, {
                contractId: 1,
                subcontractId: 28,
                personType: ['PM']
            }, {
                contractId: 1,
                subcontractId: 29,
                personType: ['PM']
            }, {
                contractId: 1,
                subcontractId: 31,
                personType: ['PM']
            }, {
                contractId: 1,
                subcontractId: 32,
                personType: ['PM']
            }, {
                contractId: 1,
                subcontractId: 36,
                personType: ['PM']
            }, {
                contractId: 1,
                subcontractId: 37,
                personType: ['PM']
            }, {
                contractId: 1,
                subcontractId: 39,
                personType: ['PM']
            }, {
                contractId: 1,
                subcontractId: 40,
                personType: ['PM']
            }, {
                contractId: 1,
                subcontractId: 41,
                personType: ['PM']
            }, {
                contractId: 1,
                subcontractId: 42,
                personType: ['PM']
            }, {
                contractId: 1,
                subcontractId: 1,
                personType: ['PF', 'PM']
            }, {
                contractId: 1,
                subcontractId: 6,
                personType: ['PF', 'PM']
            }, {
                contractId: 1,
                subcontractId: 22,
                personType: ['PF', 'PM']
            }, {
                contractId: 1,
                subcontractId: 35,
                personType: ['PF', 'PM']
            }, {
                contractId: 1,
                subcontractId: 38,
                personType: ['PF', 'PM']
            }, {
                contractId: 1,
                subcontractId: 43,
                personType: ['PF', 'PM']
            }, {
                contractId: 1,
                subcontractId: 60,
                personType: ['PF', 'PM']
            }, {
                contractId: 1,
                subcontractId: 61,
                personType: ['PF', 'PM']
            }, {
                contractId: 1,
                subcontractId: 65,
                personType: ['PF', 'PM']
            }, {
                contractId: 1,
                subcontractId: 66,
                personType: ['PF', 'PM']
            }, {
                contractId: 1,
                subcontractId: 67,
                personType: ['PF', 'PM']
            }, {
                contractId: 1,
                subcontractId: 68,
                personType: ['PF', 'PM']
            }, {
                contractId: 1,
                subcontractId: 69,
                personType: ['PF', 'PM']
            },
        ]
    }, {
        id: '4-AS-008',
        title: 'Facultades para el Contrato Compraventa Divisas (Persona Moral)',
        text1: '',
        text2: '',
        options: [
            'Solicitar, operar y/o pago, confirmar instrucciones de pago',
            'Solicitar a su vez el registro en los sistemas de esa institución las contrapartes que deban darse de alta en el Contrato de referencia para poder liquidar transacciones comerciales a través del "Sistema de Pagos Interbancarios en Dólares" (el "SPID")',
        ],
        otherOpt: false,
        relation: [
            {
                contractId: 4,
                subcontractId: 47,
                personType: ['PF', 'PM']
            }, {
                contractId: 4,
                subcontractId: 48,
                personType: ['PF', 'PM']
            }, {
                contractId: 7,
                subcontractId: 60,
                personType: ['PM']
            }
        ]
    }, {
        id: '4-AS-062',
        title: 'Marco Productos y Servicios Bancarios Múltiples (Persona Física)',
        text1: 'Realizar cargos y depósitos a las cuentas registradas en el contrato; depósitos y retiros bancarios de la cuenta eje; girar órdenes de compra, traspaso y venta de títulos en los fondos, conforme a las políticas establecidas en los prospectos de dichos fondos, así como para que autorice al Banco para que en nombre del Cliente realice operaciones de compra, venta o reporto de valores. La Persona Autorizada podrá girar instrucciones vía telefónica a través de los Centros de Atención Telefónica del Banco, o por escrito con firma autógrafa.',
        text2: 'Acceder al manejo, administración y disposición de las chequeras que en su momento sean solicitadas por el Cliente, como medio de disposición de los recursos del contrato, siempre atendiendo a la categoría e instrucciones de firma designadas para la Persona Autorizada, para lo cual deberá respetar en todo momento las siguientes instrucciones de firma:',
        options: [
            '1 Firma A',
            '1 Firma B',
            '2 Firmas A',
            '2 Firmas B',
            'Una firma A y una firma B',
        ],
        otherOpt: true,
        relation: [
            {
                contractId: 1,
                subcontractId: 19,
                personType: ['PF']
            }, {
                contractId: 1,
                subcontractId: 25,
                personType: ['PF']
            }, {
                contractId: 1,
                subcontractId: 30,
                personType: ['PF']
            }, {
                contractId: 1,
                subcontractId: 33,
                personType: ['PF']
            }, {
                contractId: 1,
                subcontractId: 34,
                personType: ['PF']
            }, {
                contractId: 1,
                subcontractId: 70,
                personType: ['PF']
            }, {
                contractId: 1,
                subcontractId: 71,
                personType: ['PF']
            }, {
                contractId: 1,
                subcontractId: 1,
                personType: ['PF', 'PM']
            }, {
                contractId: 1,
                subcontractId: 6,
                personType: ['PF', 'PM']
            }, {
                contractId: 1,
                subcontractId: 22,
                personType: ['PF', 'PM']
            }, {
                contractId: 1,
                subcontractId: 35,
                personType: ['PF', 'PM']
            }, {
                contractId: 1,
                subcontractId: 38,
                personType: ['PF', 'PM']
            }, {
                contractId: 1,
                subcontractId: 43,
                personType: ['PF', 'PM']
            }, {
                contractId: 1,
                subcontractId: 60,
                personType: ['PF', 'PM']
            }, {
                contractId: 1,
                subcontractId: 61,
                personType: ['PF', 'PM']
            }, {
                contractId: 1,
                subcontractId: 65,
                personType: ['PF', 'PM']
            }, {
                contractId: 1,
                subcontractId: 66,
                personType: ['PF', 'PM']
            }, {
                contractId: 1,
                subcontractId: 67,
                personType: ['PF', 'PM']
            }, {
                contractId: 1,
                subcontractId: 68,
                personType: ['PF', 'PM']
            }, {
                contractId: 1,
                subcontractId: 69,
                personType: ['PF', 'PM']
            },
        ]
    }, {
        id: '4-AS-1375',
        title: 'Cuenta Mexdolar (Persona Moral)',
        text1: 'Realizar cargos y depósitos a las cuentas registradas en el contrato; depósitos y retiros bancarios de la cuenta; así como operaciones de compra y venta de divisas. La Persona Autorizada podrá girar instrucciones vía telefónica a través de los Centros de Atención Telefónica del Banco, por escrito con firma autógrafa o por correo electrónico a partir de la dirección de correo señalada dentro de los datos de la persona autorizada. Estas instrucciones no incluyen el dar de alta, ni dar de baja ni modificar ninguno de los datos previamente registrados por el Cliente.',
        text2: 'Acceder al manejo, administración y disposición de las chequeras que en su momento sean solicitadas por el Cliente, como medio de disposición de los recursos del contrato, siempre atendiendo a la categoría e instrucciones de firma designadas para la Persona Autorizada, para lo cual deberá respetar en todo momento las siguientes instrucciones de firma:',
        options: [
            '1 Firma A',
            '1 Firma B',
            '2 Firmas A',
            '2 Firmas B',
            'Una firma A y una firma B',
        ],
        otherOpt: true,
        relation: [
            {
                contractId: 62,
                subcontractId: 1,
                personType: ['PM']
            }
        ]
    }
];
