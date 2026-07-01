# Documentación de Componentes PF y PM

## Índice

- [Documentación de Componentes PF y PM](#documentación-de-componentes-pf-y-pm)
  - [Índice](#índice)
  - [PF - Identificación y Datos de Contacto](#pf---identificación-y-datos-de-contacto)
  - [PF - Datos Generales](#pf---datos-generales)
  - [PF - Firma (Tipo de Firma)](#pf---firma-tipo-de-firma)
    - [Secciones](#secciones)
  - [PF - Perfil de Inversión](#pf---perfil-de-inversión)
    - [Secciones](#secciones-1)
  - [PF - Opera Cambios](#pf---opera-cambios)
    - [Secciones](#secciones-2)
  - [PF - Formato W8 (información adicional)](#pf---formato-w8-información-adicional)
    - [Secciones](#secciones-3)
  - [PM - Datos de Contacto](#pm---datos-de-contacto)
    - [Secciones](#secciones-4)
  - [PM - Datos Generales](#pm---datos-generales)
    - [Secciones](#secciones-5)
  - [PM - Integración del Organigrama](#pm---integración-del-organigrama)
    - [Secciones](#secciones-6)
  - [PM - Estatus de la Entidad](#pm---estatus-de-la-entidad)
    - [Secciones](#secciones-7)
  - [PM - Proveedor de Recursos](#pm---proveedor-de-recursos)
    - [Secciones](#secciones-8)
  - [Reglas Generales de Componentes](#reglas-generales-de-componentes)
    - [Inicialización](#inicialización)
    - [Modo Mantenimiento](#modo-mantenimiento)
    - [Reglas de Negocio](#reglas-de-negocio)
    - [Notas Técnicas](#notas-técnicas)

---

## PF - Identificación y Datos de Contacto

**Secciones**

- **Identificaciones** *(seccion-hija IdentificationSectionComponent)*
- **Teléfonos** *(seccion-hija PhoneSectionComponent)*
- **Correos** *(seccion-hija MailSectionComponent)*

---

## PF - Datos Generales

_Secciones_

- **informacion-general** *(sección default, es el propio formulario del componente)*
- **Datos laborales**  *(solo cuando ocupación es empleado, formulario + seccion-hija AddressSectionComponent)*
- **general-info-contract** *(solo mantenimiento, seccion-hija GeneralInfoContractSectionComponent, tiene varios catalgos hardcodeados)*
- **Albacea** *(solo cuando tipo de contrato y subcontrato son 1)* *(modal de apoderado, que a su vez contiene varias secciones)*
  - **Datos iniciales** *(seccion-hija ClientDataComponent)*
  - **Datos laboraes y fiscales** *(seccion-hija MiscellaneousSectionComponent)*
  - **Autocertificacion** *(seccion-hija AutoCertificationSectionComponent)*
  - **Address** *(seccion-hija AddressSectionComponent)*
  - **Persona Policamente expuesta** *(seccion-hija PpeSectionComponent)*
  - **Identificaciones** *(seccion-hija IdentificationSectionComponent)*
  - **Teléfonos** *(seccion-hija PhoneSectionComponent)*
  - **Correos** *(seccion-hija MailSectionComponent)*

---

## PF - Firma (Tipo de Firma)

### Secciones

- **Firma** *(seccion default, es el propio formulario del componente)*
- **Cotitular** *(modal de cotitular, que a su vez contiene varias secciones)* *(solo cuando tipo de firma MANCOMUNADA O SOLIDARIA)*
  - **Datos iniciales** *(seccion-hija ClientDataComponent)*
  - **Datos laboraes y fiscales** *(seccion-hija MiscellaneousSectionComponent)*
  - **Autocertificacion** *(seccion-hija AutoCertificationSectionComponent)*
  - **Address** *(seccion-hija AddressSectionComponent)*
  - **Persona Policamente expuesta** *(seccion-hija PpeSectionComponent)*
  - **Identificaciones** *(seccion-hija IdentificationSectionComponent)*
  - **Teléfonos** *(seccion-hija PhoneSectionComponent)*
  - **Correos** *(seccion-hija MailSectionComponent)*
- **Apoderado** *(modal de apoderado, que a su vez contiene varias secciones)*
  - **Datos iniciales** *(seccion-hija ClientDataComponent)*
  - **Datos laboraes y fiscales** *(seccion-hija MiscellaneousSectionComponent)*
  - **Address** *(seccion-hija AddressSectionComponent)*
  - **Persona Policamente expuesta** *(seccion-hija PpeSectionComponent)*
  - **Identificaciones** *(seccion-hija IdentificationSectionComponent)*
  - **Teléfonos** *(seccion-hija PhoneSectionComponent)*
  - **Correos** *(seccion-hija MailSectionComponent)*
  - **Poderes legales** *(seccion-hija LegalPowerSectionComponent)*

---

## PF - Perfil de Inversión

- *(El componente es igual para PM y PF solo que se manda a llevar desde TiProfileComponent y TiProfilePmComponent)*
- *(Cada componente padre inyecta sus servcios y su comportamiento)*
- *(El comportamiento de los roles en PM y PF se encuentra definido al unisono: ##Se debe revisar PM para si es necesario separar los roles)*

### Secciones

- **Perfil de inversión** *(permisos de practica de venta, formulario de investmentProfileForm)*
- **Perfil de inversión Mantenimiento** *(permisos de practica de venta, solo se activa en mnto, formulario de maintenanceQuizForm)*
- **Perfil de inversión modal**  *(permisos de practica de venta, modal de InvestmentProfileQuizModalComponent, es un cuestionario dinámico)*
- **Perfil de transacional** *(permisos de perfil-transaccional, modal de transactionalProfileForm, tiene varios catalgos hardcodeados)*
- **Origen de los recursos de recursos** *(permisos de perfil-transaccional, modal de TransactionalResourcesModalComponent)*

---
## PF - Opera Cambios

- *(Se aplican permisos por separado operate-changes y operate-changes-pm)*

### Secciones

- **Opera cambios** *(formulario del componente, algunos campos solo se muestran en modo mantenimiento)*

---

## PF - Formato W8 (información adicional)

- *(Solo aparece en mantenimiento)*

### Secciones

- **Formulario de informacion adicional** *(formulario por default)*
- **Tabla de w8** *(solo se activa si se marca el check de W8, este formulario solo aparece para tipo banco(999))*

---

## PM - Datos de Contacto

### Secciones

- **Teléfonos** *(seccion-hija PhoneSectionComponent)*
- **Correos** *(seccion-hija MailSectionComponent)*

---

## PM - Datos Generales

### Secciones

- **informacion-general-pm** *(componente principal)*
- **general-info-contract** *(solo mantenimiento, seccion-hija GeneralInfoContractSectionComponent, tiene varios catalgos hardcodeados)*

---

## PM - Integración del Organigrama

### Secciones

- **Formulario** *(componente principal)*
- **Modal de niveles Jerárquicos** *(modal específico, OrganizationChartModalComponent)*

---

## PM - Estatus de la Entidad

### Secciones

- **Formulario** *(componente principal, lanza alerta de que debe primero completar propietario real y Admin que ejerce el control)*
- **Modal de personas control** *(Solo deja adicionar, no modificar siguiendo la HU, los valores de la tabla para elegir se cargan desde Admin que ejerce el control)*
- **Modal de países de residencia fiscal**(solo se activa si tiene se marca que tiene residencia fiscal !MX)

---

## PM - Proveedor de Recursos

### Secciones

- **Formulario** *(componente principal)*
- **Address** *(seccion-hija AddressSectionComponent)*

---

## Reglas Generales de Componentes

### Inicialización

1. Al inicializar el componente, se consulta la información previamente almacenada en el **servicio de storage** correspondiente.
2. En general el componente toma la información de una señal que puede ser del tipo de interfaz o null en caso de que no haya info guardada anteriormente
3. Cada uno de los servicios de storage tienen un setter y getter.readonly para obtener la señal
4. Los datos se renderizan en las tablas respetando únicamente los elementos con estado activo (`active === true`).
5. Los datos con la propiedad isSaved == true se renderizan en las tablas pero no tendran permisos de modificación o eliminación

### Modo Mantenimiento

1. Si el componente se encuentra en modo mantenimiento:
   - Se consultan los **permisos asociados** al componente.
   - Los permisos se propagan a los **componentes hijos** mediante una **señal** o en caso de ser relativamente sencillo se manejan desde el componente padre.
2. Cada componente hijo evalúa sus permisos de manera individual.

### Reglas de Negocio

- Las validaciones y reglas de negocio **solo se ejecutan sobre elementos activos**.
- Los elementos inactivos no participan en validaciones ni flujos de negocio, solo se mantienen y en modo mantenimiento si deben de enviarse.

### Notas Técnicas

- Cada sección hija cuenta con permisos de mantenimiento independientes.
- Las reglas de negocio solo aplican a los elementos activos de cada tabla
- Al iniciar el Componente se cargan los valores guardados en su respectiva señal de almacenamiento
- En el afterViewInit en mantenimiento se cargan los permisos del rol.
- Los OTC de confirmación de mails y telefonos son inputs de las secciones y estan por default con el valor que está en las configuraciones de cada ambiente para que se puedan encender y apagar a peticion del cliente
- Si un componente necesita usar mail o telefonos activando o desactivando el OTC sin importar el ambiente puede pasar el input directamente y este sobrescribe el valor por default sin importar el ambiente.

  otcConfig: {
    disableOtcMail: true, **(validacion desactivada)**
    disableOtcSms: false, **(validacion activada)**
  },

---
