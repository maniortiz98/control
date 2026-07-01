import { Question, QuizSection } from "../../onboarding/models/transactional-investment-profile";

export const transactionalProfileSections: QuizSection[] =
[
    {
        "sectionId": "Conocimiento del cliente",
        "questions": [
            {
                "questionId": 1,
                "questionText": "Número de depósitos",
                "questionType": 1,
                "responseType": 3,
                "attributes":
                    {
                        "required": true,
                        "type": "radio"
                    }
                ,
                "options": [
                    {
                        "optionId": 1,
                        "checked": false,
                        "answerText": "De 1 a 5 depósitos al mes",
                        "value": "De 1 a 5 depósitos al mes"
                    },
                    {
                        "optionId": 2,
                        "checked": false,
                        "answerText": "De 6 a 12 depósitos al mes",
                        "value": "De 6 a 12 depósitos al mes"
                    },
                    {
                        "optionId": 3,
                        "checked": false,
                        "answerText": "De 13 o más depósitos al mes",
                        "value": "De 13 o más depósitos al mes"
                    }
                ]
            },
            {
                "questionId": 2,
                "questionText": "Número de retiros",
                "questionType": 1,
                "responseType": 3,
                "attributes":
                    {
                        "required": true,
                        "type": "radio"
                    }
                ,
                "options": [
                    {
                        "optionId": 1,
                        "checked": false,
                        "answerText": "De 1 a 5 retiros al mes",
                        "value": "De 1 a 5 retiros al mes"
                    },
                    {
                        "optionId": 2,
                        "checked": false,
                        "answerText": "De 6 a 12 retiros al mes",
                        "value": "De 6 a 12 retiros al mes"
                    },
                    {
                        "optionId": 3,
                        "checked": false,
                        "answerText": "De 13 o más retiros al mes",
                        "value": "De 13 o más retiros al mes"
                    }
                ]
            },
            {
                "questionId": 3,
                "questionText": "Monto promedio depósitos en el mes",
                "questionType": 1,
                "responseType": 3,
                "attributes":
                    {
                        "required": true,
                        "type": "radio"
                    }
                ,
                "options": [
                    {
                        "optionId": 1,
                        "checked": false,
                        "answerText": "$0 a $299,999.99 MN",
                        "value": "$0 a $299,999.99 MN"
                    },
                    {
                        "optionId": 2,
                        "checked": false,
                        "answerText": "$300,000 a $999,999.99 MN",
                        "value": "$300,000 a $999,999.99 MN"
                    },
                    {
                        "optionId": 3,
                        "checked": false,
                        "answerText": "$1'000,000 a $3'499,999.99 MN",
                        "value": "$1'000,000 a $3'499,999.99 MN"
                    },
                    {
                        "optionId": 4,
                        "checked": false,
                        "answerText": "$3'500,000 a $7'999,999.99 MN",
                        "value": "$3'500,000 a $7'999,999.99 MN"
                    },
                    {
                        "optionId": 5,
                        "checked": false,
                        "answerText": "Mas de $8'000,000 MN",
                        "value": "Mas de $8'000,000 MN"
                    }
                ]
            },
            {
                "questionId": 4,
                "questionText": "Monto promedio retiros en el mes",
                "questionType": 1,
                "responseType": 3,
                "attributes":
                    {
                        "required": true,
                        "type": "radio"
                    }
                ,
                "options": [
                    {
                        "optionId": 1,
                        "checked": false,
                        "answerText": "$0 a 299,999.99 MN",
                        "value": "$0 a 299,999.99 MN"
                    },
                    {
                        "optionId": 2,
                        "checked": false,
                        "answerText": "$300,000 a $999,999.99 MN",
                        "value": "$300,000 a $999,999.99 MN"
                    },
                    {
                        "optionId": 3,
                        "checked": false,
                        "answerText": "$1'000,000 a $3'499,999.99 MN",
                        "value": "$1'000,000 a $3'499,999.99 MN"
                    },
                    {
                        "optionId": 4,
                        "checked": false,
                        "answerText": "$3'500,000 a $7'999,999.99 MN",
                        "value": "$3'500,000 a $7'999,999.99 MN"
                    },
                    {
                        "optionId": 5,
                        "checked": false,
                        "answerText": "Mas de $8'000,000 MN",
                        "value": "Mas de $8'000,000 MN"
                    }
                ]
            },
            {
                "questionId": 5,
                "questionText": "Objetivo de la inversión",
                "questionType": 1,
                "responseType": 3,
                "attributes":
                    {
                        "required": true,
                        "type": "radio"
                    }
                ,
                "options": [
                    {
                        "optionId": 1,
                        "checked": false,
                        "answerText": "Adquisición de Inmuebles",
                        "value": "Adquisición de Inmuebles"
                    },
                    {
                        "optionId": 2,
                        "checked": false,
                        "answerText": "Administración de Negocio",
                        "value": "Administración de Negocio"
                    },
                    {
                        "optionId": 3,
                        "checked": false,
                        "answerText": "Creación de Fondo para la educación de los Hijos",
                        "value": "Creación de Fondo para la educación de los Hijos"
                    },
                    {
                        "optionId": 4,
                        "checked": false,
                        "answerText": "Creación de un Fondo para un Objetivo",
                        "value": "Creación de un Fondo para un Objetivo"
                    },
                    {
                        "optionId": 5,
                        "checked": false,
                        "answerText": "Creación de un Fondo de Contingencia",
                        "value": "Creación de un Fondo de Contingencia"
                    },
                    {
                        "optionId": 6,
                        "checked": false,
                        "answerText": "Incremento de su Patrimonio / Plan de Retiro",
                        "value": "Incremento de su Patrimonio / Plan de Retiro"
                    },
                    {
                        "optionId": 7,
                        "checked": false,
                        "answerText": "Otros",
                        "value": "Otros"
                    }
                ]
            },
            {
                "questionId": 6,
                "questionText": "Plazo planeado para invertir en Actinver",
                "questionType": 1,
                "responseType": 3,
                "attributes":
                    {
                        "required": true,
                        "type": "radio"
                    }
                ,
                "options": [
                    {
                        "optionId": 1,
                        "checked": false,
                        "answerText": "Un año o menos",
                        "value": "Un año o menos"
                    },
                    {
                        "optionId": 2,
                        "checked": false,
                        "answerText": "De 1 a 3 años",
                        "value": "De 1 a 3 años"
                    },
                    {
                        "optionId": 3,
                        "checked": false,
                        "answerText": "De 3 a 5 años",
                        "value": "De 3 a 5 años"
                    },
                    {
                        "optionId": 4,
                        "checked": false,
                        "answerText": "De 5 a 10 años",
                        "value": "De 5 a 10 años"
                    },
                    {
                        "optionId": 5,
                        "checked": false,
                        "answerText": "Más de 10 años",
                        "value": "Más de 10 años"
                    },
                    {
                        "optionId": 6,
                        "checked": false,
                        "answerText": "Más de 5 años",
                        "value": "Más de 5 años"
                    }
                ]
            },
            {
                "questionId": 7,
                "questionText": "Actualmente usted mantiene otras cuentas en",
                "questionType": 1,
                "responseType": 3,
                "attributes":
                    {
                        "required": true,
                        "type": "radio"
                    }
                ,
                "options": [
                    {
                        "optionId": 1,
                        "checked": false,
                        "answerText": "Banco",
                        "value": "Banco"
                    },
                    {
                        "optionId": 2,
                        "checked": false,
                        "answerText": "Operadora de Fondos",
                        "value": "Operadora de Fondos"
                    },
                    {
                        "optionId": 3,
                        "checked": false,
                        "answerText": "Casa de Bolsa",
                        "value": "Casa de Bolsa"
                    },
                    {
                        "optionId": 4,
                        "checked": false,
                        "answerText": "Otros",
                        "value": "Otros"
                    }
                ]
            },
            {
                "questionId": 8,
                "questionText": "Indique el Nombre de la institución",
                "questionType": 1,
                "responseType": 3,
                "attributes":
                    {
                        "required": false,
                        "type": "text",
                        "minlength": 1,
                        "maxlength": 100,
                    }

            },
            {
                "questionId": 9,
                "questionText": "Indique los productos que maneja",
                "questionType": 1,
                "responseType": 3,
                "attributes":
                    {
                        "required": true,
                        "type": "radio"
                    }
                ,
                "options": [
                    // {
                    //     "optionId": 1,
                    //     "checked": false,
                    //     "answerText": "Chequera o tarjeta de débito",
                    //     "value": "Chequera o tarjeta de débito"
                    // },
                    // {
                    //     "optionId": 2,
                    //     "checked": false,
                    //     "answerText": "Cetes, pagarés o certificados",
                    //     "value": "Cetes, pagarés o certificados"
                    // },
                    // {
                    //     "optionId": 3,
                    //     "checked": false,
                    //     "answerText": "Bonos o instrumentos de deuda",
                    //     "value": "Bonos o instrumentos de deuda"
                    // },
                    // {
                    //     "optionId": 4,
                    //     "checked": false,
                    //     "answerText": "Fondos de inversión de deuda",
                    //     "value": "Fondos de inversión de deuda"
                    // },
                    {
                        "optionId": 7,
                        "checked": false,
                        "answerText": "Chequera o tarjeta de débito",
                        "value": "Chequera o tarjeta de débito"
                    },
                    {
                      "optionId": 8,
                      "checked": false,
                      "answerText": "Cetes, pagares o fondos de inversión de deuda corporativa a corto plazo",
                      "value": "Cetes, pagares o fondos de inversión de deuda corporativa a corto plazo"
                    },
                    {
                      "optionId": 9,
                      "checked": false,
                      "answerText": "Fondos de inversión de renta variable y/o deuda gubernamental, corporativa o bancaria a largo plazo",
                      "value": "Fondos de inversión de renta variable y/o deuda gubernamental, corporativa o bancaria a largo plazo"
                    },
                    {
                        "optionId": 5,
                        "checked": false,
                        "answerText": "Divisas, acciones, trackers, productos estructurados, derivados y/o todos los mencionados en los puntos anteriores",
                        "value": "Divisas, acciones, trackers, productos estructurados, derivados y/o todos los mencionados en los puntos anteriores"
                    },
                    // {
                    //     "optionId": 6,
                    //     "checked": false,
                    //     "answerText": "Acciones o trackers",
                    //     "value": "Acciones o trackers"
                    // },
                    
                ]
            },
            {
                "questionId": 10,
                "questionText": "¿Cuánto tiempo tiene de experiencia en el manejo de esos productos?",
                "questionType": 1,
                "responseType": 3,
                "attributes":
                    {
                        "required": true,
                        "type": "radio"
                    }
                ,
                "options": [
                    // {
                    //     "optionId": 1,
                    //     "checked": false,
                    //     "answerText": "Menos de 1 año",
                    //     "value": "Menos de 1 año"
                    // },
                    // {
                    //     "optionId": 2,
                    //     "checked": false,
                    //     "answerText": "De 1 a 3 años",
                    //     "value": "De 1 a 3 años"
                    // },
                    // {
                    //     "optionId": 3,
                    //     "checked": false,
                    //     "answerText": "De 3 a 5 años",
                    //     "value": "De 3 a 5 años"
                    // },
                    // {
                    //     "optionId": 4,
                    //     "checked": false,
                    //     "answerText": "Más de 5 años",
                    //     "value": "Más de 5 años"
                    // }
                ]
            },
            {
                "questionId": 11,
                "questionText": "Usted considera que su conocimiento financiero es",
                "questionType": 1,
                "responseType": 3,
                "attributes":
                    {
                        "required": true,
                        "type": "radio"
                    }
                ,
                "options": [
                    {
                        "optionId": 1,
                        "checked": false,
                        "answerText": "Sofisticado",
                        "value": "Sofisticado"
                    },
                    {
                        "optionId": 2,
                        "checked": false,
                        "answerText": "Muy sofisticado",
                        "value": "Muy sofisticado"
                    },
                    {
                        "optionId": 3,
                        "checked": false,
                        "answerText": "Bajo",
                        "value": "Bajo"
                    },
                    {
                        "optionId": 4,
                        "checked": false,
                        "answerText": "Medio",
                        "value": "Medio"
                    },
                    {
                        "optionId": 5,
                        "checked": false,
                        "answerText": "Nulo",
                        "value": "Nulo"
                    }
                ]
            },
            {
                "questionId": 12,
                "questionText": "Rango anual de ingresos",
                "questionType": 1,
                "responseType": 3,
                "attributes":
                    {
                        "required": true,
                        "type": "radio"
                    }
                ,
                "options": [
                    {
                        "optionId": 1,
                        "checked": false,
                        "answerText": "Menos de $100,000 MN",
                        "value": "Menos de $100,000 MN"
                    },
                    {
                        "optionId": 2,
                        "checked": false,
                        "answerText": "Entre $100,000 y $499,999 MN",
                        "value": "Entre $100,000 y $499,999 MN"
                    },
                    {
                        "optionId": 3,
                        "checked": false,
                        "answerText": "Entre $500,000 y $999,999 MN",
                        "value": "Entre $500,000 y $999,999 MN"
                    },
                    {
                        "optionId": 4,
                        "checked": false,
                        "answerText": "Más de $1,000,000 MN",
                        "value": "Más de $1,000,000 MN"
                    }
                ]
            },
            {
                "questionId": 13,
                "questionText": "Rango de inversión en Actinver",
                "questionType": 1,
                "responseType": 3,
                "attributes":
                    {
                        "required": true,
                        "type": "radio"
                    }
                ,
                "options": [
                    {
                        "optionId": 1,
                        "checked": false,
                        "answerText": "Menos de $500,000 MN",
                        "value": "Menos de $500,000 MN"
                    },
                    {
                        "optionId": 2,
                        "checked": false,
                        "answerText": "Entre $500,000 y $999,999 MN",
                        "value": "Entre $500,000 y $999,999 MN"
                    },
                    {
                        "optionId": 3,
                        "checked": false,
                        "answerText": "Entre $1,000,000 y $4,999,999 MN",
                        "value": "Entre $1,000,000 y $4,999,999 MN"
                    },
                    {
                        "optionId": 4,
                        "checked": false,
                        "answerText": "Más de $5,000,000 MN",
                        "value": "Más de $5,000,000 MN"
                    }
                ]
            },
            {
                "questionId": 14,
                "questionText": "Uso que se le dará al contrato",
                "questionType": 1,
                "responseType": 3,
                "attributes":
                    {
                        "required": true,
                        "type": "radio"
                    }
                ,
                /*
                "options": [
                    {
                        "optionId": '01',
                        "checked": false,
                        "answerText": "Inversiones (fondos,cedes, pagarés)",
                        "value": "Inversiones (fondos,cedes, pagarés)"
                    },
                    {
                        "optionId": '02',
                        "checked": false,
                        "answerText": "Operaciones cambiarias",
                        "value": "Operaciones cambiarias"
                    },
                    {
                        "optionId": '03',
                        "checked": false,
                        "answerText": "Pagos de Primas y Finanzas",
                        "value": "Pagos de Primas y Finanzas"
                    },
                    {
                        "optionId": '04',
                        "checked": false,
                        "answerText": "Pago a proveedores",
                        "value": "Pago a proveedores"
                    },
                    {
                        "optionId": '05',
                        "checked": false,
                        "answerText": "Pago de Créditos",
                        "value": "Pago de Créditos"
                    },
                    {
                        "optionId": '06',
                        "checked": false,
                        "answerText": "Personal y Negocios",
                        "value": "Personal y Negocios"
                    },
                    {
                        "optionId": '07',
                        "checked": false,
                        "answerText": "Adquisición de inmueble",
                        "value": "Adquisición de inmueble"
                    },
                    {
                        "optionId": '08',
                        "checked": false,
                        "answerText": "Incrementar el patrimonio",
                        "value": "Incrementar el patrimonio"
                    },
                    {
                        "optionId": '09',
                        "checked": false,
                        "answerText": "Administración del negocio",
                        "value": "Administración del negocio"
                    },
                    {
                        "optionId": '10',
                        "checked": false,
                        "answerText": "Creación fondos Edu Hijos",
                        "value": "Creación fondos Edu Hijos"
                    },
                    {
                        "optionId": '11',
                        "checked": false,
                        "answerText": "No registra",
                        "value": "No registra"
                    }
                ]
                */
                "options": [
                    {
                        "optionId": '01',
                        "checked": false,
                        "answerText": "INVERSIONES (FONDOS, PAGARES, CEDES)",
                        "value": "INVERSIONES (FONDOS, PAGARES, CEDES)"
                    },
                    {
                        "optionId": '02',
                        "checked": false,
                        "answerText": "PAGO DE PRIMAS Y FIANZAS",
                        "value": "PAGO DE PRIMAS Y FIANZAS"
                    },
                    {
                        "optionId": '03',
                        "checked": false,
                        "answerText": "PAGO DE CREDITOS",
                        "value": "PAGO DE CREDITOS"
                    },
                    {
                        "optionId": '04',
                        "checked": false,
                        "answerText": "PERSONAL Y NEGOCIO",
                        "value": "PERSONAL Y NEGOCIO"
                    },
                    {
                        "optionId": '05',
                        "checked": false,
                        "answerText": "OPERACIONES CAMBIARIAS",
                        "value": "OPERACIONES CAMBIARIAS"
                    },
                    {
                        "optionId": '06',
                        "checked": false,
                        "answerText": "PAGO A PROVEEDORES",
                        "value": "PAGO A PROVEEDORES"
                    }
                ]
            },
            {
                "questionId": 15,
                "questionText": "Alguno de los cotitulares o beneficiarios es empleado Actinver",
                "questionType": 1,
                "responseType": 3,
                "attributes":
                  {
                    "required": true,
                    "type": "radio"
                  },
                  "options": [
                    {
                        "optionId": "true",
                        "checked": false,
                        "answerText": "Si",
                        "value": "Si"
                    },
                    {
                        "optionId": "false",
                        "checked": false,
                        "answerText": "No",
                        "value": "No"
                    }]
            },
            {
                "questionId": 16,
                "questionText": "La atención requerida por la empresa será",
                "questionType": 1,
                "responseType": 3,
                "attributes":
                    {
                        "required": true,
                        "type": "radio"
                    }
                ,
                "options": [
                    {
                        "optionId": 1,
                        "checked": false,
                        "answerText": "Diaria",
                        "value": "Diaria"
                    },
                    {
                        "optionId": 2,
                        "checked": false,
                        "answerText": "Semanal",
                        "value": "Semanal"
                    },
                    {
                        "optionId": 3,
                        "checked": false,
                        "answerText": "Quincenal",
                        "value": "Quincenal"
                    },
                    {
                        "optionId": 4,
                        "checked": false,
                        "answerText": "Mensual",
                        "value": "Mensual"
                    },
                    {
                        "optionId": 5,
                        "checked": false,
                        "answerText": "Trimestral",
                        "value": "Trimestral"
                    }
                ]
            },

            {

            "questionId": 17,
                "questionText": "Se establecerán instrucciones para el manejo de inversiones a través de",
                "questionType": 1,
                "responseType": 3,
                "attributes":
                    {
                        "required": true,
                        "type": "radio"
                    }
                ,
                "options": [
                    {
                        "optionId": 1,
                        "checked": false,
                        "answerText": "Carta",
                        "value": "Carta"
                    },
                    {
                        "optionId": 2,
                        "checked": false,
                        "answerText": "Teléfono",
                        "value": "Telefono"
                    },
                    {
                        "optionId": 3,
                        "checked": false,
                        "answerText": "Mail",
                        "value": "Mail"
                    },
                    {
                        "optionId": 4,
                        "checked": false,
                        "answerText": "Ninguno",
                        "value": "Ninguno"
                    }
                ]
            },
          //   {
          //     "questionId": 18,
          //     "questionText": "Límite del monto transaccional por operación",
          //     "questionType": 1,
          //     "responseType": 3,
          //     "attributes":
          //           {
          //               "required": true,
          //               "type": "radio"
          //           }
          //       ,
          //       "options": [
          //             {
          //               "optionId": 1,
          //               "checked": false,
          //               "answerText": "10,000.00",
          //               "value": "10,000.00"
          //           },
          //           {
          //               "optionId": 2,
          //               "checked": false,
          //               "answerText": "30,000.00",
          //               "value": "30,000.00"
          //           },
          //           {
          //               "optionId": 3,
          //               "checked": false,
          //               "answerText": "50,000.00",
          //               "value": "50,000.00"
          //           },
          //           {
          //               "optionId": 4,
          //               "checked": false,
          //               "answerText": "100,000.00",
          //               "value": "100,000.00"
          //           },
          //           {
          //               "optionId": 5,
          //               "checked": false,
          //               "answerText": "150,000.00",
          //               "value": "150,000.00"
          //           },
          //           {
          //             "optionId": 6,
          //             "checked": false,
          //             "answerText": "500,000.00",
          //             "value": "500,000.00"
          //           },
          //           {
          //             "optionId": 7,
          //             "checked": false,
          //             "answerText": "700,000.00",
          //             "value": "700,000.00"
          //           },
          //           {
          //             "optionId": 8,
          //             "checked": false,
          //             "answerText": "1,000,000.00",
          //             "value": "1,000,000.00"
          //           },
          //           {
          //             "optionId": 9,
          //             "checked": false,
          //             "answerText": "1,500,000.00",
          //             "value": "1,500,000.00"
          //           },
          //           {
          //             "optionId": 10,
          //             "checked": false,
          //             "answerText": "5,000,000.00",
          //             "value": "5,000,000.00"
          //           },

          //       ]
          // },
        ]
    }
];

export const transactionalProfileLastQuestion: Question = {
  "questionId": 50,
  "questionText": "¿Desea especificar alguna instrucción especial?",
  "questionType": 1,
  "responseType": 3,
  "attributes":
      {
          "required": true,
          "type": "text",
      }
};

export const transactionalResourcesQuestion: Question = {
    "questionId": 13033,
    "questionText": "Origen de los Recursos",
    "questionType": 1,
    "responseType": 3,
    "attributes":
        {
            "required": true,
            "type": "radio"
        }
    ,
    "options": [
        {
            "optionId": 43722,
            "checked": false,
            "answerText": "Teléfono",
            "value": "telefono"
        },
        {
            "optionId": 43723,
            "checked": false,
            "answerText": "Mail",
            "value": "mail"
        },
    ]
};

export const transactionalPercentageQuestion: Question =             {
    "questionId": 13034,
    "questionText": "Profesión",
    "questionType": 2,
    "responseType": 1,
    "attributes":
        {
            "size": 20,
            "required": true,
            "maxlength": 22,
            "minlength": 4,
            "type": "text"
        }

};

export const investmentProfileData: QuizSection[] = [
    {
        sectionId: "Datos Generales",
        questions: [
                        {
                "questionId": 13011,
                "questionText": "¿Trabaja o ha trabajado como asesor en inversiones o analista bursátil?",
                "questionType": 1,
                "responseType": 3,
                "attributes":
                    {
                        "required": true,
                        "type": "radio"
                    }
                ,
                "options": [
                    {
                        "optionId": 43722,
                        "checked": false,
                        "answerText": "No",
                        "value": "No"
                    },
                    {
                        "optionId": 43723,
                        "checked": false,
                        "answerText": "Si",
                        "value": "Si"
                    }
                ]
            },
            {
                "questionId": 13000,
                "questionText": "Fecha de nacimiento",
                "questionType": 2,
                "responseType": 2,
                "attributes":
                    {
                        "size": 10,
                        "required": true,
                        "type": "date",
                        "min": "2018-01-01",
                        "max": "2018-12-31"
                    }

            },
            {
                "questionId": 13001,
                "questionText": "Estado civil",
                "questionType": 1,
                "responseType": 3,
                "attributes":
                    {
                        "required": true,
                        "type": "radio"
                    }
                ,
                "options": [
                    {
                        "optionId": 43701,
                        "checked": false,
                        "answerText": "Soltero",
                        "value": "Soltero"
                    },
                    {
                        "optionId": 43702,
                        "checked": false,
                        "answerText": "Casado",
                        "value": "Casado"
                    }
                ]
            },
            {
                "questionId": 13013,
                "questionText": "Nivel de estudios",
                "questionType": 1,
                "responseType": 3,
                "attributes":
                    {
                        "required": true,
                        "type": "radio"
                    }
                ,
                "options": [
                    {
                        "optionId": 43703,
                        "checked": false,
                        "answerText": "Primaria",
                        "value": "Primaria"
                    },
                    {
                        "optionId": 43704,
                        "checked": false,
                        "answerText": "Bachillerato",
                        "value": "Bachillerato"
                    },
                    {
                        "optionId": 43705,
                        "checked": false,
                        "answerText": "Licenciatura o grado técnico",
                        "value": "Licenciatura o grado técnico"
                    },
                    {
                        "optionId": 43706,
                        "checked": false,
                        "answerText": "Postgrado, maestría o doctorado",
                        "value": "Postgrado, maestría o doctorado"
                    }
                ]
            },
            {
                "questionId": 13003,
                "questionText": "Profesión",
                "questionType": 2,
                "responseType": 1,
                "attributes":
                    {
                        "size": 20,
                        "required": true,
                        "maxlength": 22,
                        "minlength": 4,
                        "type": "text"
                    }

            },
            {
                "questionId": 13004,
                "questionText": "Número de dependientes",
                "questionType": 1,
                "responseType": 3,
                "attributes":
                    {
                        "required": true,
                        "type": "radio"
                    }
                ,
                "options": [
                    {
                        "optionId": 43708,
                        "checked": false,
                        "answerText": "0",
                        "value": "0"
                    },
                    {
                        "optionId": 43709,
                        "checked": false,
                        "answerText": "1-2",
                        "value": "1-2"
                    },
                    {
                        "optionId": 43710,
                        "checked": false,
                        "answerText": "3-4",
                        "value": "3-4"
                    },
                    {
                        "optionId": 43711,
                        "checked": false,
                        "answerText": "5 o más",
                        "value": "5 o más"
                    }
                ]
            },
            {
                "questionId": 13005,
                "questionText": "Ocupación",
                "questionType": 1,
                "responseType": 3,
                "attributes":
                    {
                        "required": true,
                        "type": "radio"
                    }
                ,
                "options": [
                    {
                        "optionId": 43712,
                        "checked": false,
                        "answerText": "Estudiante",
                        "value": "Estudiante"
                    },
                    {
                        "optionId": 43713,
                        "checked": false,
                        "answerText": "Empleado",
                        "value": "Empleado"
                    },
                    {
                        "optionId": 43714,
                        "checked": false,
                        "answerText": "Sin empleo",
                        "value": "Sin empleo"
                    },
                    {
                        "optionId": 43715,
                        "checked": false,
                        "answerText": "Jubilado",
                        "value": "Jubilado"
                    }
                ]
            },
            {
                "questionId": 13006,
                "questionText": "Nombre de la empresa",
                "questionType": 2,
                "responseType": 1,
                "attributes":
                    {
                        "size": 100,
                        "required": true,
                        "maxlength": 100,
                        "minlength": 4,
                        "type": "text"
                    }

            },
            {
                "questionId": 13007,
                "questionText": "Puesto",
                "questionType": 2,
                "responseType": 1,
                "attributes":
                    {
                        "size": 100,
                        "required": true,
                        "maxlength": 100,
                        "minlength": 4,
                        "type": "text"
                    }

            },
            {
                "questionId": 13008,
                "questionText": "Giro de la empresa",
                "questionType": 2,
                "responseType": 1,
                "attributes":
                    {
                        "size": 100,
                        "required": true,
                        "maxlength": 100,
                        "minlength": 4,
                        "type": "text"
                    }

            },
            {
                "questionId": 13009,
                "questionText": "Teléfonos de la empresa",
                "questionType": 2,
                "responseType": 1,
                "attributes":
                    {
                        "size": 100,
                        "required": true,
                        "maxlength": 100,
                        "minlength": 4,
                        "type": "text"
                    }

            },
            {
                "questionId": 13010,
                "questionText": "Página web de la empresa",
                "questionType": 2,
                "responseType": 1,
                "attributes":
                    {
                        "size": 100,
                        "required": true,
                        "maxlength": 200,
                        "minlength": 4,
                        "type": "text"
                    }

            },
        ]
    }
]

export const investmentProfileQuizSectionsFake: QuizSection[] = [
        {
            "sectionId": "Información general",
            "questions": [
                {
                    "questionId": 13004,
                    "questionText": "Fecha de Nacimiento",
                    "questionType": 1,
                    "responseType": 3,
                    "attributes":
                        {
                            "required": true,
                            "type": "date",
                            "min": "",
                            "max": "",
                        }

                },
                {
                    "questionId": 13005,
                    "questionText": "Estado Civil",
                    "questionType": 1,
                    "responseType": 3,
                    "attributes":
                        {
                            "required": true,
                            "type": "radio"
                        }
                    ,
                    "options": [
                        {
                            "optionId": 11,
                            "checked": false,
                            "answerText": "Soltero",
                            "value": "soltero"
                        },
                        {
                            "optionId": 12,
                            "checked": false,
                            "answerText": "Casado",
                            "value": "casado"
                        }
                    ]
                },
                {
                    "questionId": 13006,
                    "questionText": "Profesión",
                    "questionType": 1,
                    "responseType": 3,
                    "attributes":
                        {
                            "required": true,
                            "type": "text",
                            "minlength": 1,
                            "maxlength": 100,
                        }

                },
                {
                    "questionId": 13007,
                    "questionText": "Nombre de la empresa",
                    "questionType": 1,
                    "responseType": 3,
                    "attributes":
                        {
                            "required": true,
                            "type": "text",
                            "minlength": 1,
                            "maxlength": 100,
                        }

                },
                {
                    "questionId": 13008,
                    "questionText": "Teléfonos de la empresa",
                    "questionType": 1,
                    "responseType": 3,
                    "attributes":
                        {
                            "required": true,
                            "type": "text",
                            "minlength": 1,
                            "maxlength": 100,
                        }

                },
                {
                    "questionId": 13009,
                    "questionText": "Página web de la empresa",
                    "questionType": 1,
                    "responseType": 3,
                    "attributes":
                        {
                            "required": true,
                            "type": "text",
                            "minlength": 1,
                            "maxlength": 100,
                        }

                },
                {
                    "questionId": 13010,
                    "questionText": "Página web de la empresa",
                    "questionType": 1,
                    "responseType": 3,
                    "attributes":
                        {
                            "required": true,
                            "type": "text",
                            "minlength": 1,
                            "maxlength": 100,
                        }

                },
            ]
        },
        {
            "sectionId": "Información financiera del cliente",
            "questions": [
                {
                    "questionId": 13011,
                    "questionText": "¿Aproximadamente, cuál es el rango anual de los ingresos de la empresa?",
                    "questionType": 1,
                    "responseType": 3,
                    "attributes":
                        {
                            "required": true,
                            "type": "radio"
                        }
                    ,
                    "options": [
                        {
                            "optionId": 11,
                            "checked": false,
                            "answerText": "Menos de $1,000,000",
                            "value": "Menos de $1,000,000"
                        },
                        {
                            "optionId": 12,
                            "checked": false,
                            "answerText": "Entre $1,000,000 y  $5,000,000",
                            "value": "Entre $1,000,000 y  $5,000,000"
                        },
                        {
                            "optionId": 13,
                            "checked": false,
                            "answerText": "Entre $5,000,000 y $10,000,000",
                            "value": "Entre $5,000,000 y $10,000,000"
                        },
                        {
                            "optionId": 14,
                            "checked": false,
                            "answerText": "Más de $10,000,000",
                            "value": "Más de $10,000,000"
                        }
                    ]
                },
                {
                    "questionId": 13012,
                    "questionText": "¿Cuál es el origen principal de los recursos para invertir en Actinver?",
                    "questionType": 1,
                    "responseType": 3,
                    "attributes":
                        {
                            "required": true,
                            "type": "radio"
                        }
                    ,
                    "options": [
                        {
                            "optionId": 43724,
                            "checked": false,
                            "answerText": "Inversiones/Patrimonio/Ahorro",
                            "value": "Inversiones/Patrimonio/Ahorro"
                        },
                        {
                            "optionId": 43725,
                            "checked": false,
                            "answerText": "Fondo de Ahorro y/o Pensiones",
                            "value": "Fondo de Ahorro y/o Pensiones"
                        },
                        {
                            "optionId": 43726,
                            "checked": false,
                            "answerText": "Derivado de actividad económica",
                            "value": "Derivado de actividad económica"
                        },
                        {
                            "optionId": 43727,
                            "checked": false,
                            "answerText": "Postgrado, maestría o doctorado",
                            "value": "Postgrado, maestría o doctorado"
                        },
                        {
                            "optionId": 43728,
                            "checked": false,
                            "answerText": "Venta o Renta de Bienes",
                            "value": "Venta o Renta de Bienes"
                        },
                        {
                            "optionId": 43729,
                            "checked": false,
                            "answerText": "Muebles e Inmuebles",
                            "value": "Muebles e Inmuebles"
                        },
                        {
                            "optionId": 43730,
                            "checked": false,
                            "answerText": "Premios, rifas y sorteos",
                            "value": "Premios, rifas y sorteos"
                        },
                        {
                            "optionId": 43731,
                            "checked": false,
                            "answerText": "Becas y Manutención",
                            "value": "Becas y Manutención"
                        },
                        {
                            "optionId": 43732,
                            "checked": false,
                            "answerText": "Sucesión Testamentaria y Donaciones",
                            "value": "Sucesión Testamentaria y Donaciones"
                        }
                    ]
                },
                {
                    "questionId": 13013,
                    "questionText": "¿Aproximadamente, cuál es el rango anual de sus ingresos?",
                    "questionType": 1,
                    "responseType": 3,
                    "attributes":
                        {
                            "required": true,
                            "type": "radio"
                        }
                    ,
                    "options": [
                        {
                            "optionId": 43733,
                            "checked": false,
                            "answerText": "Menos de $500,000",
                            "value": "Menos de $500,000"
                        },
                        {
                            "optionId": 43734,
                            "checked": false,
                            "answerText": "Entre $500,000 y $999,999",
                            "value": "Entre $500,000 y $999,999"
                        },
                        {
                            "optionId": 43735,
                            "checked": false,
                            "answerText": "Más de $1,000,000",
                            "value": "Más de $1,000,000"
                        }
                    ]
                },
                {
                    "questionId": 13014,
                    "questionText": "¿Aproximadamente, cuál es el rango de inversión que realizará en Actinver?",
                    "questionType": 1,
                    "responseType": 3,
                    "attributes":
                        {
                            "required": true,
                            "type": "radio"
                        }
                    ,
                    "options": [
                        {
                            "optionId": 43736,
                            "checked": false,
                            "answerText": "Menos de $500,000",
                            "value": "Menos de $500,000"
                        },
                        {
                            "optionId": 43737,
                            "checked": false,
                            "answerText": "Entre $500,000 y $999,999",
                            "value": "Entre $500,000 y $999,999"
                        },
                        {
                            "optionId": 43738,
                            "checked": false,
                            "answerText": "Entre $1,000,000 y $4,999,999",
                            "value": "Entre $1,000,000 y $4,999,999"
                        },
                        {
                            "optionId": 43739,
                            "checked": false,
                            "answerText": "Más de $5,000,000",
                            "value": "Más de $5,000,000"
                        }
                    ]
                },
                {
                    "questionId": 13015,
                    "questionText": "¿Cuál es el porcentaje de sus inversiones que destinará a Actinver?",
                    "questionType": 1,
                    "responseType": 3,
                    "attributes":
                        {
                            "required": true,
                            "type": "radio"
                        }
                    ,
                    "options": [
                        {
                            "optionId": 43740,
                            "checked": false,
                            "answerText": "Entre 1% y 25%",
                            "value": "Entre 1% y 25%"
                        },
                        {
                            "optionId": 43741,
                            "checked": false,
                            "answerText": "Entre 25% y 50%",
                            "value": "Entre 25% y 50%"
                        },
                        {
                            "optionId": 43742,
                            "checked": false,
                            "answerText": "Entre 50% y 75%",
                            "value": "Entre 50% y 75%"
                        },
                        {
                            "optionId": 43743,
                            "checked": false,
                            "answerText": "Entre 75% y 100%",
                            "value": "Entre 75% y 100%"
                        }
                    ]
                },
                {
                    "questionId": 13016,
                    "questionText": "¿Qué porcentaje de sus ingresos mensuales destina a pagar sus deudas y/o financiamientos?",
                    "questionType": 1,
                    "responseType": 3,
                    "attributes":
                        {
                            "required": true,
                            "type": "radio"
                        }
                    ,
                    "options": [
                        {
                            "optionId": 43744,
                            "checked": false,
                            "answerText": "Entre 1% y 25% de mis deudas y/o financiamientos",
                            "value": "Entre 1% y 25% de mis deudas y/o financiamientos"
                        },
                        {
                            "optionId": 43745,
                            "checked": false,
                            "answerText": "Entre el 26% y 50% de mis deudas y/o financiamientos",
                            "value": "Entre el 26% y 50% de mis deudas y/o financiamientos"
                        },
                        {
                            "optionId": 43746,
                            "checked": false,
                            "answerText": "Entre el 51% y 75% de mis deudas y/o financiamientos",
                            "value": "Entre el 51% y 75% de mis deudas y/o financiamientos"
                        },
                        {
                            "optionId": 43747,
                            "checked": false,
                            "answerText": "Más del 76% de mis deudas y/o financiamientos",
                            "value": "Más del 76% de mis deudas y/o financiamientos"
                        }
                    ]
                }
            ]
        },
        {
            "sectionId": "Perfil transaccional del cliente",
            "questions": [
                {
                    "questionId": 13017,
                    "questionText": "Indique la frecuencia mensual con la que realizará depósitos",
                    "questionType": 1,
                    "responseType": 3,
                    "attributes":
                        {
                            "required": true,
                            "type": "radio"
                        }
                    ,
                    "options": [
                        {
                            "optionId": 43748,
                            "checked": false,
                            "answerText": "De 1 a 5 depósitos al mes",
                            "value": "De 1 a 5 depósitos al mes"
                        },
                        {
                            "optionId": 43749,
                            "checked": false,
                            "answerText": "De 6 a 12 depósitos al mes",
                            "value": "De 6 a 12 depósitos al mes"
                        },
                        {
                            "optionId": 43750,
                            "checked": false,
                            "answerText": "De 13 o más depósitos al mes",
                            "value": "De 13 o más depósitos al mes"
                        }
                    ]
                },
                {
                    "questionId": 13018,
                    "questionText": "Indique el importe mensual que realizará de depósitos",
                    "questionType": 1,
                    "responseType": 3,
                    "attributes":
                        {
                            "required": true,
                            "type": "radio"
                        }
                    ,
                    "options": [
                        {
                            "optionId": 43751,
                            "checked": false,
                            "answerText": "$1 a $299,999.99",
                            "value": "$1 a $299,999.99"
                        },
                        {
                            "optionId": 43752,
                            "checked": false,
                            "answerText": "$300,000 a $999,999.99",
                            "value": "$300,000 a $999,999.99"
                        },
                        {
                            "optionId": 43753,
                            "checked": false,
                            "answerText": "$1,000,000 a $3,499,999.99",
                            "value": "$1,000,000 a $3,499,999.99"
                        },
                        {
                            "optionId": 43754,
                            "checked": false,
                            "answerText": "$3,500,000 a $7,999,999.99",
                            "value": "$3,500,000 a $7,999,999.99"
                        },
                        {
                            "optionId": 43755,
                            "checked": false,
                            "answerText": "Más de $8,000,000",
                            "value": "Más de $8,000,000"
                        }
                    ]
                },
                {
                    "questionId": 13019,
                    "questionText": "Indique la frecuencia mensual con la que realizará retiros",
                    "questionType": 1,
                    "responseType": 3,
                    "attributes":
                        {
                            "required": true,
                            "type": "radio"
                        }
                    ,
                    "options": [
                        {
                            "optionId": 43756,
                            "checked": false,
                            "answerText": "De 1 a 5 retiros al mes",
                            "value": "De 1 a 5 retiros al mes"
                        },
                        {
                            "optionId": 43757,
                            "checked": false,
                            "answerText": "De 6 a 12 retiros al mes",
                            "value": "De 6 a 12 retiros al mes"
                        },
                        {
                            "optionId": 43758,
                            "checked": false,
                            "answerText": "De 13 o más retiros al mes",
                            "value": "De 13 o más retiros al mes"
                        }
                    ]
                },
                {
                    "questionId": 13020,
                    "questionText": "Indique el importe mensual que realizará de retiros",
                    "questionType": 1,
                    "responseType": 3,
                    "attributes":
                        {
                            "required": true,
                            "type": "radio"
                        }
                    ,
                    "options": [
                        {
                            "optionId": 43759,
                            "checked": false,
                            "answerText": "$1 a $299,999.99",
                            "value": "$1 a $299,999.99"
                        },
                        {
                            "optionId": 43760,
                            "checked": false,
                            "answerText": "$300,000 a $999,999.99",
                            "value": "$300,000 a $999,999.99"
                        },
                        {
                            "optionId": 43761,
                            "checked": false,
                            "answerText": "$1,000,000 a $3,499,999.99",
                            "value": "$1,000,000 a $3,499,999.99"
                        },
                        {
                            "optionId": 43762,
                            "checked": false,
                            "answerText": "$3,500,000 a $7,999,999.99",
                            "value": "$3,500,000 a $7,999,999.99"
                        },
                        {
                            "optionId": 43763,
                            "checked": false,
                            "answerText": "Más de $8,000,000",
                            "value": "Más de $8,000,000"
                        }
                    ]
                }
            ]
        },
        {
            "sectionId": "Perfil de la inversión del cliente",
            "questions": [
                {
                    "questionId": 13021,
                    "questionText": "¿Cuál es el objetivo de su inversión?",
                    "questionType": 1,
                    "responseType": 3,
                    "attributes":
                        {
                            "required": true,
                            "type": "radio"
                        }
                    ,
                    "options": [
                        {
                            "optionId": 43764,
                            "checked": false,
                            "answerText": "Incremento de su patrimonio/Plan de retiro",
                            "value": "Incremento de su patrimonio/Plan de retiro"
                        },
                        {
                            "optionId": 43765,
                            "checked": false,
                            "answerText": "Creación de un fondo para un objetivo específico",
                            "value": "Creación de un fondo para un objetivo específico"
                        },
                        {
                            "optionId": 43766,
                            "checked": false,
                            "answerText": "Creación de un fondo de contingencia",
                            "value": "Creación de un fondo de contingencia"
                        },
                        {
                            "optionId": 43767,
                            "checked": false,
                            "answerText": "Otros",
                            "value": "Otros"
                        }
                    ]
                },
                {
                    "questionId": 13022,
                    "questionText": "¿Cuál es el plazo que tiene planeado para invertir en Actinver?",
                    "questionType": 1,
                    "responseType": 3,
                    "attributes":
                        {
                            "required": true,
                            "type": "radio"
                        }
                    ,
                    "options": [
                        {
                            "optionId": 43768,
                            "checked": false,
                            "answerText": "Un año o menos",
                            "value": "Un año o menos"
                        },
                        {
                            "optionId": 43769,
                            "checked": false,
                            "answerText": "De 1 a 3 años",
                            "value": "De 1 a 3 años"
                        },
                        {
                            "optionId": 43770,
                            "checked": false,
                            "answerText": "De 3 a 5 años",
                            "value": "De 3 a 5 años"
                        },
                        {
                            "optionId": 43771,
                            "checked": false,
                            "answerText": "De 5 a 10 años",
                            "value": "De 5 a 10 años"
                        },
                        {
                            "optionId": 43772,
                            "checked": false,
                            "answerText": "Más de 10 años",
                            "value": "Más de 10 años"
                        }
                    ]
                },
                {
                    "questionId": 13023,
                    "questionText": "¿Actualmente usted tiene o ha tenido otra(s) cuenta(s) de inversión en otra institución financiera?",
                    "questionType": 1,
                    "responseType": 3,
                    "attributes":
                        {
                            "required": true,
                            "type": "radio"
                        }
                    ,
                    "options": [
                        {
                            "optionId": 43773,
                            "checked": false,
                            "answerText": "Banco",
                            "value": "Banco"
                        },
                        {
                            "optionId": 43774,
                            "checked": false,
                            "answerText": "Operadora de fondos",
                            "value": "Operadora de fondos"
                        },
                        {
                            "optionId": 43775,
                            "checked": false,
                            "answerText": "Casa de bolsa",
                            "value": "Casa de bolsa"
                        },
                        {
                            "optionId": 43776,
                            "checked": false,
                            "answerText": "Otros",
                            "value": "Otros"
                        }
                    ]
                },
                {
                    "questionId": 13024,
                    "questionText": "¿Cuánto tiempo tiene de experiencia invirtiendo?",
                    "questionType": 1,
                    "responseType": 3,
                    "attributes":
                        {
                            "required": true,
                            "type": "radio"
                        }
                    ,
                    "options": [
                        {
                            "optionId": 43777,
                            "checked": false,
                            "answerText": "Menos de 1 año",
                            "value": "Menos de 1 año"
                        },
                        {
                            "optionId": 43778,
                            "checked": false,
                            "answerText": "De 1 a 3 años",
                            "value": "De 1 a 3 años"
                        },
                        {
                            "optionId": 43779,
                            "checked": false,
                            "answerText": "De 3 a 5 años",
                            "value": "De 3 a 5 años"
                        },
                        {
                            "optionId": 43780,
                            "checked": false,
                            "answerText": "Más de 5 años",
                            "value": "Más de 5 años"
                        }
                    ]
                },
                {
                    "questionId": 13025,
                    "questionText": "¿Cómo considera su comportamiento como inversionista?",
                    "questionType": 1,
                    "responseType": 3,
                    "attributes":
                        {
                            "required": true,
                            "type": "radio"
                        }
                    ,
                    "options": [
                        {
                            "optionId": 43781,
                            "checked": false,
                            "answerText": "Nulo",
                            "value": "Nulo"
                        },
                        {
                            "optionId": 43782,
                            "checked": false,
                            "answerText": "Escaso",
                            "value": "Escaso"
                        },
                        {
                            "optionId": 43783,
                            "checked": false,
                            "answerText": "Muy activo",
                            "value": "Muy activo"
                        }
                    ]
                },
                {
                    "questionId": 13026,
                    "questionText": "¿Considera indispensable la orientación de un asesor?",
                    "questionType": 1,
                    "responseType": 3,
                    "attributes":
                        {
                            "required": true,
                            "type": "radio"
                        }
                    ,
                    "options": [
                        {
                            "optionId": 43784,
                            "checked": false,
                            "answerText": "Siempre",
                            "value": "Siempre"
                        },
                        {
                            "optionId": 43785,
                            "checked": false,
                            "answerText": "Casi siempre",
                            "value": "Casi siempre"
                        },
                        {
                            "optionId": 43786,
                            "checked": false,
                            "answerText": "Pocas veces",
                            "value": "Pocas veces"
                        },
                        {
                            "optionId": 43787,
                            "checked": false,
                            "answerText": "No es necesaria",
                            "value": "No es necesaria"
                        }
                    ]
                }
            ]
        },
        {
            "sectionId": "Perfil de tolerancia al riesgo",
            "questions": [
                {
                    "questionId": 13027,
                    "questionText": "¿Cuáles son los productos en los que ha invertido?",
                    "questionType": 1,
                    "responseType": 3,
                    "attributes":
                        {
                            "required": true,
                            "type": "radio"
                        }
                    ,
                    "options": [
                        {
                            "optionId": 43788,
                            "checked": false,
                            "answerText": "Chequera o tarjeta de débito.",
                            "value": "Chequera o tarjeta de débito."
                        },
                        {
                            "optionId": 43789,
                            "checked": false,
                            "answerText": "Cetes, pagarés o certificados bursáítiles y todos los mencionados en el punto anterior.",
                            "value": "Cetes, pagarés o certificados bursáítiles y todos los mencionados en el punto anterior."
                        },
                        {
                            "optionId": 43790,
                            "checked": false,
                            "answerText": "Fondos de inversión de deuda y todos los mencionados en el punto anterior.",
                            "value": "Fondos de inversión de deuda y todos los mencionados en el punto anterior."
                        },
                        {
                            "optionId": 43791,
                            "checked": false,
                            "answerText": "Fondos de inversión de renta variable y todos los mencionados en el punto anterior.",
                            "value": "Fondos de inversión de renta variable y todos los mencionados en el punto anterior."
                        },
                        {
                            "optionId": 43792,
                            "checked": false,
                            "answerText": "Bonos o instrumentos de deuda de largo plazo y todos los mencionados en el punto anterior.",
                            "value": "Bonos o instrumentos de deuda de largo plazo y todos los mencionados en el punto anterior."
                        },
                        {
                            "optionId": 43793,
                            "checked": false,
                            "answerText": "Acciones o trackers y todos los mencionados en el punto anterior.",
                            "value": "Acciones o trackers y todos los mencionados en el punto anterior."
                        },
                        {
                            "optionId": 43794,
                            "checked": false,
                            "answerText": "Inversiones en otras monedas y todos los mencionados en el punto anterior.",
                            "value": "Inversiones en otras monedas y todos los mencionados en el punto anterior."
                        },
                        {
                            "optionId": 43795,
                            "checked": false,
                            "answerText": "Instrumentos derivados o productos estructurados y todos los mencionados en el punto anterior.",
                            "value": "Instrumentos derivados o productos estructurados y todos los mencionados en el punto anterior."
                        }
                    ]
                },
                {
                    "questionId": 13028,
                    "questionText": "¿En qué productos le gustaría invertir?",
                    "questionType": 1,
                    "responseType": 3,
                    "attributes":
                        {
                            "required": true,
                            "type": "radio"
                        }
                    ,
                    "options": [
                        {
                            "optionId": 43796,
                            "checked": false,
                            "answerText": "Instrumentos de deuda gubernamentales, bancarios o fondos de inversión a plazo menor a un año.",
                            "value": "Instrumentos de deuda gubernamentales, bancarios o fondos de inversión a plazo menor a un año."
                        },
                        {
                            "optionId": 43797,
                            "checked": false,
                            "answerText": "Además de los mencionados en el punto anterior, inversiones en fondos de fondos, fondos de deuda a plazo mayor a un año y fondos de renta variable nacionales.",
                            "value": "Además de los mencionados en el punto anterior, inversiones en fondos de fondos, fondos de deuda a plazo mayor a un año y fondos de renta variable nacionales."
                        },
                        {
                            "optionId": 43798,
                            "checked": false,
                            "answerText": "Además de los mencionados en los puntos anteriores, inversiones en deuda gubernamental, bancaria o corporativa de largo plazo y acciones de empresas o en fideicomisos.",
                            "value": "Además de los mencionados en los puntos anteriores, inversiones en deuda gubernamental, bancaria o corporativa de largo plazo y acciones de empresas o en fideicomisos."
                        },
                        {
                            "optionId": 43799,
                            "checked": false,
                            "answerText": "Además de los mencionados en los puntos anteriores, inversiones con en distintas monedas y otros productos sofisticados.",
                            "value": "Además de los mencionados en los puntos anteriores, inversiones con en distintas monedas y otros productos sofisticados."
                        }
                    ]
                },
                {
                    "questionId": 13029,
                    "questionText": "¿Qué estrategia de inversión considera más adecuada para usted?",
                    "questionType": 1,
                    "responseType": 3,
                    "attributes":
                        {
                            "required": true,
                            "type": "radio"
                        }
                    ,
                    "options": [
                        {
                            "optionId": 43800,
                            "checked": false,
                            "answerText": "Invertir en instrumentos del Gobierno Federal o bancarios. Horizonte de inversión a corto plazo. Nivel de volatilidad muy bajo.",
                            "value": "Invertir en instrumentos del Gobierno Federal o bancarios. Horizonte de inversión a corto plazo. Nivel de volatilidad muy bajo."
                        },
                        {
                            "optionId": 43801,
                            "checked": false,
                            "answerText": "Invertir en distintos valores. Buscar rendimientos cercanos a la tasa general de referencia (Cetes) o al índice nacional de precios al consumidor (inflación). Horizonte de inversión a mediano y largo plazo. Nivel de volatilidad bajo.",
                            "value": "Invertir en distintos valores. Buscar rendimientos cercanos a la tasa general de referencia (Cetes) o al índice nacional de precios al consumidor (inflación). Horizonte de inversión a mediano y largo plazo. Nivel de volatilidad bajo."
                        },
                        {
                            "optionId": 43802,
                            "checked": false,
                            "answerText": "Invertir en distintos valores. Buscar rendimientos mayores a la tasa general de referencia (Cetes) o al índice nacional de precios al consumidor (inflación). Horizonte de inversión a largo plazo. Nivel de volatilidad medio.",
                            "value": "Invertir en distintos valores. Buscar rendimientos mayores a la tasa general de referencia (Cetes) o al índice nacional de precios al consumidor (inflación). Horizonte de inversión a largo plazo. Nivel de volatilidad medio."
                        },
                        {
                            "optionId": 43803,
                            "checked": false,
                            "answerText": "Invertir en distintos valores. Buscar rendimientos superiores a la tasa general de referencia (Cetes) o al índice nacional de precios al consumidor (inflación). Horizonte de inversión a largo plazo. Nivel de volatilidad alto.",
                            "value": "Invertir en distintos valores. Buscar rendimientos superiores a la tasa general de referencia (Cetes) o al índice nacional de precios al consumidor (inflación). Horizonte de inversión a largo plazo. Nivel de volatilidad alto."
                        }
                    ]
                },
                {
                    "questionId": 13030,
                    "questionText": "¿Cuál sería su reacción si parte de su inversión sufriera repentinamente una pérdida de valor?",
                    "questionType": 1,
                    "responseType": 3,
                    "attributes":
                        {
                            "required": true,
                            "type": "radio"
                        }
                    ,
                    "options": [
                        {
                            "optionId": 43804,
                            "checked": false,
                            "answerText": "Retiraría mi dinero de Actinver.",
                            "value": "Retiraría mi dinero de Actinver."
                        },
                        {
                            "optionId": 43805,
                            "checked": false,
                            "answerText": "Vendería el resto de esa inversión aun significando tomar pérdidas, pero seguiría invirtiendo en otras opciones.",
                            "value": "Vendería el resto de esa inversión aun significando tomar pérdidas, pero seguiría invirtiendo en otras opciones."
                        },
                        {
                            "optionId": 43806,
                            "checked": false,
                            "answerText": "Evaluaría las posibilidades de realizar otro tipo de inversiones que ayudaran a recuperar la pérdida.",
                            "value": "Evaluaría las posibilidades de realizar otro tipo de inversiones que ayudaran a recuperar la pérdida."
                        },
                        {
                            "optionId": 43807,
                            "checked": false,
                            "answerText": "Tomaría las caídas del mercado como oportunidades potenciales, reconociendo que éstas son temporales y son parte de mi estrategia de largo plazo.",
                            "value": "Tomaría las caídas del mercado como oportunidades potenciales, reconociendo que éstas son temporales y son parte de mi estrategia de largo plazo."
                        }
                    ]
                }
            ]
        }
];

// #region PM Questions
export const transactionalProfilePMSections: QuizSection[] | any[] =
[
    {
        "sectionId": "Conocimiento del cliente",
        "questions": [
            {
                "questionId": 1,
                "questionText": "Número de depósitos",
                "questionType": 1,
                "responseType": 3,
                "attributes": [
                    {
                        "required": true,
                        "type": "radio"
                    }
                ],
                "options": [
                    {
                        "optionId": 1,
                        "checked": false,
                        "answerText": "De 0 a 10 depósitos al mes",
                        "value": "De 0 a 10 depósitos al mes"
                    },
                    {
                        "optionId": 2,
                        "checked": false,
                        "answerText": "De 11 a 20 depósitos al mes",
                        "value": "De 11 a 20 depósitos al mes"
                    },
                    {
                        "optionId": 3,
                        "checked": false,
                        "answerText": "más de 20 depósitos al mes",
                        "value": "más de 20 depósitos al mes"
                    }
                ]
            },
            {
                "questionId": 2,
                "questionText": "Número de retiros",
                "questionType": 1,
                "responseType": 3,
                "attributes": [
                    {
                        "required": true,
                        "type": "radio"
                    }
                ],
                "options": [
                    {
                        "optionId": 1,
                        "checked": false,
                        "answerText": "De 0 a 10 retiros al mes",
                        "value": "De 0 a 10 retiros al mes"
                    },
                    {
                        "optionId": 2,
                        "checked": false,
                        "answerText": "De 11 a 20 retiros al mes",
                        "value": "De 11 a 20 retiros al mes"
                    },
                    {
                        "optionId": 3,
                        "checked": false,
                        "answerText": "más de 20 retiros al  mes",
                        "value": "más de 20 retiros al  mes"
                    }
                ]
            },
            {
                "questionId": 3,
                "questionText": "Monto promedio depósitos en el mes",
                "questionType": 1,
                "responseType": 3,
                "attributes": [
                    {
                        "required": true,
                        "type": "radio"
                    }
                ],
                "options": [
                    {
                        "optionId": 1,
                        "checked": false,
                        "answerText": "$0 a $299,999.99 MN",
                        "value": "$0 a $299,999.99 MN"
                    },
                    {
                        "optionId": 2,
                        "checked": false,
                        "answerText": "$300,000 a $999,999.99 MN",
                        "value": "$300,000 a $999,999.99 MN"
                    },
                    {
                        "optionId": 3,
                        "checked": false,
                        "answerText": "$1'000,000 a $3'499,999.99 MN",
                        "value": "$1'000,000 a $3'499,999.99 MN"
                    },
                    {
                        "optionId": 4,
                        "checked": false,
                        "answerText": "$3'500,000 a $7'999,999.99 MN",
                        "value": "$3'500,000 a $7'999,999.99 MN"
                    },
                    {
                        "optionId": 5,
                        "checked": false,
                        "answerText": "Mas de $8'000,000 MN",
                        "value": "Mas de $8'000,000 MN"
                    }
                ]
            },
            {
                "questionId": 4,
                "questionText": "Monto promedio retiros en el mes",
                "questionType": 1,
                "responseType": 3,
                "attributes": [
                    {
                        "required": true,
                        "type": "radio"
                    }
                ],
                "options": [
                    {
                        "optionId": 1,
                        "checked": false,
                        "answerText": "$0 a 299,999.99 MN",
                        "value": "$0 a 299,999.99 MN"
                    },
                    {
                        "optionId": 2,
                        "checked": false,
                        "answerText": "$300,000 a $999,999.99 MN",
                        "value": "$300,000 a $999,999.99 MN"
                    },
                    {
                        "optionId": 3,
                        "checked": false,
                        "answerText": "$1'000,000 a $3'499,999.99 MN",
                        "value": "$1'000,000 a $3'499,999.99 MN"
                    },
                    {
                        "optionId": 4,
                        "checked": false,
                        "answerText": "$3'500,000 a $7'999,999.99 MN",
                        "value": "$3'500,000 a $7'999,999.99 MN"
                    },
                    {
                        "optionId": 5,
                        "checked": false,
                        "answerText": "Mas de $8'000,000 MN",
                        "value": "Mas de $8'000,000 MN"
                    }
                ]
            },
            {
                "questionId": 5,
                "questionText": "Uso que le dará al contrato",
                "questionType": 1,
                "responseType": 3,
                "attributes": [
                    {
                        "required": true,
                        "type": "radio"
                    }
                ],
                /*
                "options": [
                    {
                        "optionId": 1,
                        "checked": false,
                        "answerText": "Inversiones (fondos, cedes, pagarés)",
                        "value": "Inversiones (fondos, cedes, pagarés)"
                    },
                    {
                        "optionId": 2,
                        "checked": false,
                        "answerText": "Pago de primas y finanzas",
                        "value": "Pago de primas y finanzas"
                    },
                    {
                        "optionId": 3,
                        "checked": false,
                        "answerText": "Pago de créditos",
                        "value": "Pago de créditos"
                    },
                    {
                        "optionId": 4,
                        "checked": false,
                        "answerText": "Pago a proveedores",
                        "value": "Pago a proveedores"
                    },
                    {
                        "optionId": 5,
                        "checked": false,
                        "answerText": "Administración de gastos e ingresos personales",
                        "value": "Administración de gastos e ingresos personales"
                    },
                    {
                        "optionId": 6,
                        "checked": false,
                        "answerText": "Garantizar una obligación",
                        "value": "Garantizar una obligación"
                    },
                    {
                        "optionId": 7,
                        "checked": false,
                        "answerText": "Concentrado y dispersión de fondos",
                        "value": "Concentrado y dispersión de fondos"
                    },
                    {
                        "optionId": 8,
                        "checked": false,
                        "answerText": "Operaciones de tesoreria",
                        "value": "Operaciones de tesoreria"
                    }
                ]
                */
                "options": [
                    {
                        "optionId": '07',
                        "checked": false,
                        "answerText": "INVERSIONES (FONDOS, PAGARES, CEDES)",
                        "value": "INVERSIONES (FONDOS, PAGARES, CEDES)"
                    },
                    {
                        "optionId": '08',
                        "checked": false,
                        "answerText": "PAGO DE PRIMAS Y FIANZAS",
                        "value": "PAGO DE PRIMAS Y FIANZAS"
                    },
                    {
                        "optionId": '09',
                        "checked": false,
                        "answerText": "PAGO DE CREDITOS",
                        "value": "PAGO DE CREDITOS"
                    },
                    {
                        "optionId": '10',
                        "checked": false,
                        "answerText": "PAGO A PROVEEDORES",
                        "value": "PAGO A PROVEEDORES"
                    },
                    {
                        "optionId": '11',
                        "checked": false,
                        "answerText": "ADMINISTRACION DE GASTOS E INGRESOS PERSONALES",
                        "value": "ADMINISTRACION DE GASTOS E INGRESOS PERSONALES"
                    },
                    {
                        "optionId": '12',
                        "checked": false,
                        "answerText": "GARANTIZAR UNA OBLIGACION",
                        "value": "GARANTIZAR UNA OBLIGACION"
                    },
                    {
                        "optionId": '13',
                        "checked": false,
                        "answerText": "CONCENTRADO Y DISPERSION DE FONDOS",
                        "value": "CONCENTRADO Y DISPERSION DE FONDOS"
                    },
                    {
                        "optionId": '14',
                        "checked": false,
                        "answerText": "OPERACIONES DE TESORERIA",
                        "value": "OPERACIONES DE TESORERIA"
                    }
                ]
            },
            {
                "questionId": 6,
                "questionText": "Objetivo de la inversión",
                "questionType": 1,
                "responseType": 3,
                "attributes": [
                    {
                        "required": true,
                        "type": "radio"
                    }
                ],
                "options": [
                    {
                        "optionId": 1,
                        "checked": false,
                        "answerText": "Incremento del patrimonio de la empresa",
                        "value": "Incremento del patrimonio de la empresa"
                    },
                    {
                        "optionId": 2,
                        "checked": false,
                        "answerText": "Administración de los recursos de tesorería",
                        "value": "Administración de los recursos de tesorería"
                    },
                    {
                        "optionId": 3,
                        "checked": false,
                        "answerText": "Financiamiento corporativo",
                        "value": "Financiamiento corporativo"
                    },
                    {
                        "optionId": 4,
                        "checked": false,
                        "answerText": "Administración de pagos y servicios",
                        "value": "Administración de pagos y servicios"
                    },
                    {
                        "optionId": 5,
                        "checked": false,
                        "answerText": "Incremento de patrimonio de la empresa",
                        "value": "Incremento de patrimonio de la empresa"
                    }
                ]
            },
            {
                "questionId": 7,
                "questionText": "Plazo planeado para invertir en Actinver",
                "questionType": 1,
                "responseType": 3,
                "attributes": [
                    {
                        "required": true,
                        "type": "radio"
                    }
                ],
                "options": [
                    {
                        "optionId": 1,
                        "checked": false,
                        "answerText": "Un año o menos",
                        "value": "Un año o menos"
                    },
                    {
                        "optionId": 2,
                        "checked": false,
                        "answerText": "De 1 a 3 años",
                        "value": "De 1 a 3 años"
                    },
                    {
                        "optionId": 3,
                        "checked": false,
                        "answerText": "De 3 a 5 años",
                        "value": "De 3 a 5 años"
                    },
                    {
                        "optionId": 4,
                        "checked": false,
                        "answerText": "Más de 5 años",
                        "value": "Más de 5 años"
                    }
                ]
            },
            {
                "questionId": 8,
                "questionText": "Actualmente usted mantiene otras cuentas en",
                "questionType": 1,
                "responseType": 3,
                "attributes": [
                    {
                        "required": true,
                        "type": "radio"
                    }
                ],
                "options": [
                    {
                        "optionId": 1,
                        "checked": false,
                        "answerText": "Banco",
                        "value": "Banco"
                    },
                    {
                        "optionId": 2,
                        "checked": false,
                        "answerText": "Casa de bolsa",
                        "value": "Casa de bolsa"
                    },
                    {
                        "optionId": 3,
                        "checked": false,
                        "answerText": "Operador de fondos",
                        "value": "Operador de fondos"
                    },
                    {
                        "optionId": 4,
                        "checked": false,
                        "answerText": "Otros",
                        "value": "Otros"
                    }
                ]
            },
            {
                "questionId": 9,
                "questionText": "Indique el nombre de la institución",
                "questionType": 1,
                "responseType": 3,
                "attributes": [
                    {
                        "required": true,
                        "type": "text",
                        "minlength": 1,
                        "maxlength": 100,
                    }
                ]
            },
            {
                "questionId": 10,
                "questionText": "Indique los productos que maneja",
                "questionType": 1,
                "responseType": 3,
                "attributes": [
                    {
                        "required": true,
                        "type": "radio"
                    }
                ],
                "options": [
                    {
                        "optionId": 1,
                        "checked": false,
                        "answerText": "Chequera o tarjeta de débito",
                        "value": "Chequera o tarjeta de débito"
                    },
                    {
                        "optionId": 2,
                        "checked": false,
                        "answerText": "Cetes, pagarés o certificados",
                        "value": "Cetes, pagarés o certificados"
                    },
                    {
                        "optionId": 3,
                        "checked": false,
                        "answerText": "Bonos o instrumentos de deuda",
                        "value": "Bonos o instrumentos de deuda"
                    },
                    {
                        "optionId": 4,
                        "checked": false,
                        "answerText": "Fondos de inversión de deuda",
                        "value": "Fondos de inversión de deuda"
                    },
                    {
                        "optionId": 5,
                        "checked": false,
                        "answerText": "Fondos de inversión de renta variable",
                        "value": "Fondos de inversión de renta variable"
                    },
                    {
                        "optionId": 6,
                        "checked": false,
                        "answerText": "Acciones o trackers",
                        "value": "Acciones o trackers"
                    },
                    {
                        "optionId": 7,
                        "checked": false,
                        "answerText": "Inversiones en otras monedas Instrumentos derivados o productos estructurados",
                        "value": "Inversiones en otras monedas Instrumentos derivados o productos estructurados"
                    }
                ]
            },
            {
                "questionId": 11,
                "questionText": "¿Cuánto tiempo tiene de experiencia en el manejo de esos productos?",
                "questionType": 1,
                "responseType": 3,
                "attributes": [
                    {
                        "required": true,
                        "type": "radio"
                    }
                ],
                "options": [
                    {
                        "optionId": 1,
                        "checked": false,
                        "answerText": "Menos de 1 año",
                        "value": "Menos de 1 año"
                    },
                    {
                        "optionId": 2,
                        "checked": false,
                        "answerText": "De 1 a 3 años",
                        "value": "De 1 a 3 años"
                    },
                    {
                        "optionId": 3,
                        "checked": false,
                        "answerText": "De 3 a 5 años",
                        "value": "De 3 a 5 años"
                    },
                    {
                        "optionId": 4,
                        "checked": false,
                        "answerText": "Más de 5 años",
                        "value": "Más de 5 años"
                    }
                ]
            },
            {
                "questionId": 12,
                "questionText": "Usted considera que su conocimiento financiero es",
                "questionType": 1,
                "responseType": 3,
                "attributes": [
                    {
                        "required": true,
                        "type": "radio"
                    }
                ],
                "options": [
                    {
                        "optionId": 1,
                        "checked": false,
                        "answerText": "Nulo",
                        "value": "Nulo"
                    },
                    {
                        "optionId": 2,
                        "checked": false,
                        "answerText": "Escaso",
                        "value": "Escaso"
                    },
                    {
                        "optionId": 3,
                        "checked": false,
                        "answerText": "Activo",
                        "value": "Activo"
                    },
                    {
                        "optionId": 4,
                        "checked": false,
                        "answerText": "Muy activo",
                        "value": "Muy activo"
                    }
                ]
            },
            {
                "questionId": 13,
                "questionText": "Alguno de los cotitulares o beneficiarios es empleado Actinver",
                "questionType": 1,
                "responseType": 3,
                "attributes": [
                    {
                        "required": true,
                        "type": "text",
                        "minlength": 1,
                        "maxlength": 100,
                    }
                ]
            },
            {
                "questionId": 14,
                "questionText": "Se establecerán instrucciones para el manejo de inversiones a través de",
                "questionType": 1,
                "responseType": 3,
                "attributes": [
                    {
                        "required": true,
                        "type": "radio"
                    }
                ],
                "options": [
                    {
                        "optionId": 1,
                        "checked": false,
                        "answerText": "Carta genérica",
                        "value": "Carta genérica"
                    },
                    {
                        "optionId": 2,
                        "checked": false,
                        "answerText": "Órdenes programadas",
                        "value": "Órdenes programadas"
                    },
                    {
                        "optionId": 3,
                        "checked": false,
                        "answerText": "Ninguno",
                        "value": "Ninguno"
                    },
                    {
                        "optionId": 4,
                        "checked": false,
                        "answerText": "Teléfono",
                        "value": "Teléfono"
                    },
                    {
                        "optionId": 5,
                        "checked": false,
                        "answerText": "Mail",
                        "value": "Mail"
                    }
                ]
            },
            {
                "questionId": 15,
                "questionText": "La atención requerida por la empresa será",
                "questionType": 1,
                "responseType": 3,
                "attributes": [
                    {
                        "required": true,
                        "type": "radio"
                    }
                ],
                "options": [
                    {
                        "optionId": 1,
                        "checked": false,
                        "answerText": "Diaria",
                        "value": "Diaria"
                    },
                    {
                        "optionId": 2,
                        "checked": false,
                        "answerText": "Semanal",
                        "value": "Semanal"
                    },
                    {
                        "optionId": 3,
                        "checked": false,
                        "answerText": "Quincenal",
                        "value": "Quincenal"
                    },
                    {
                        "optionId": 4,
                        "checked": false,
                        "answerText": "Mensual",
                        "value": "Mensual"
                    },
                    {
                        "optionId": 5,
                        "checked": false,
                        "answerText": "Trimestral",
                        "value": "Trimestral"
                    }
                ]
            },
            {
                "questionId": 16,
                "questionText": "¿Desea especificar alguna instrucción especial?",
                "questionType": 1,
                "responseType": 3,
                "attributes": [
                    {
                        "required": true,
                        "type": "text",
                        "minlength": 1,
                        "maxlength": 100,
                    }
                ]
            },
            {
                "questionId": 17,
                "questionText": "Rango Anual de Ingresos",
                "questionType": 1,
                "responseType": 3,
                "attributes": [
                    {
                        "required": true,
                        "type": "radio"
                    }
                ],
                "options": [
                    {
                        "optionId": 1,
                        "checked": false,
                        "answerText": "Menos de $1,000,000",
                        "value": "Menos de $1,000,000"
                    },
                    {
                        "optionId": 2,
                        "checked": false,
                        "answerText": "Entre $1,000,000 y  $5,000,000",
                        "value": "Entre $1,000,000 y  $5,000,000"
                    },
                    {
                        "optionId": 3,
                        "checked": false,
                        "answerText": "Entre $5,000,000 y $10,000,000",
                        "value": "Entre $5,000,000 y $10,000,000"
                    },
                    {
                        "optionId": 4,
                        "checked": false,
                        "answerText": "Más de $10,000,000",
                        "value": "Más de $10,000,000"
                    }
                ]
            },
            {
                "questionId": 18,
                "questionText": "Rango de inversión en Activner",
                "questionType": 1,
                "responseType": 3,
                "attributes": [
                    {
                        "required": true,
                        "type": "radio"
                    }
                ],
                "options": [
                    {
                        "optionId": 1,
                        "checked": false,
                        "answerText": "Menos de $500,000",
                        "value": "Menos de $500,000"
                    },
                    {
                        "optionId": 2,
                        "checked": false,
                        "answerText": "Entre $500,000 y $1,000,000",
                        "value": "Entre $500,000 y $1,000,000"
                    },
                    {
                        "optionId": 3,
                        "checked": false,
                        "answerText": "Entre $1,000,000 y $5,000,000",
                        "value": "Entre $1,000,000 y $5,000,000"
                    },
                    {
                        "optionId": 4,
                        "checked": false,
                        "answerText": "Más de $5,000,000",
                        "value": "Más de $5,000,000"
                    }
                ]
            },
            {
                "questionId": 19,
                "questionText": "Origen de los recursos",
                "questionType": 1,
                "responseType": 3,
                "attributes": [
                    {
                        "required": true,
                        "type": "radio"
                    }
                ],
                "options": [
                    {
                        "optionId": 1,
                        "checked": false,
                        "answerText": "Ahorros, inversiones, patrimonios",
                        "value": "Ahorros, inversiones, patrimonios"
                    },
                    {
                        "optionId": 2,
                        "checked": false,
                        "answerText": "Donaciones",
                        "value": "Donaciones"
                    },
                    {
                        "optionId": 3,
                        "checked": false,
                        "answerText": "Sucesión Testamentaria",
                        "value": "Sucesión Testamentaria"
                    },
                    {
                        "optionId": 4,
                        "checked": false,
                        "answerText": "Sueldo fijo",
                        "value": "Sueldo fijo"
                    },
                    {
                        "optionId": 5,
                        "checked": false,
                        "answerText": "Comisiones",
                        "value": "Comisiones"
                    },
                    {
                        "optionId": 6,
                        "checked": false,
                        "answerText": "Prestaciones de Serv. U Hon.",
                        "value": "Prestaciones de Serv. U Hon."
                    },
                    {
                        "optionId": 7,
                        "checked": false,
                        "answerText": "Patrimonio",
                        "value": "Patrimonio"
                    },
                    {
                        "optionId": 8,
                        "checked": false,
                        "answerText": "Venta de Inmueble",
                        "value": "Venta de Inmueble"
                    },
                    {
                        "optionId": 9,
                        "checked": false,
                        "answerText": "Arrendamiento de bienes inmuebles",
                        "value": "Arrendamiento de bienes inmuebles"
                    },
                    {
                        "optionId": 10,
                        "checked": false,
                        "answerText": "ganancias de su negocio",
                        "value": "ganancias de su negocio"
                    },
                    {
                        "optionId": 11,
                        "checked": false,
                        "answerText": "Herencia",
                        "value": "Herencia"
                    },
                    {
                        "optionId": 12,
                        "checked": false,
                        "answerText": "Sucesión test; donaciones; herencia",
                        "value": "Sucesión test; donaciones; herencia"
                    },
                    {
                        "optionId": 13,
                        "checked": false,
                        "answerText": "Becas, Manutención",
                        "value": "Becas, Manutención"
                    }
                ]
            },
            {
                "questionId": 20,
                "questionText": "Porcentaje",
                "questionType": 1,
                "responseType": 3,
                "attributes": [
                    {
                        "required": true,
                        "type": "number",
                        "min": 1,
                        "max": 9999999,
                    }
                ]
            },
        ]
    }
];

// #endregion PM Questions
