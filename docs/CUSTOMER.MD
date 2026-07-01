# Historia de Usuario: Flujo "Alta de Personas" (Módulo Customer)

## 1. Descripción general

**Como** asesor u operador del sistema,  
**Quiero** disponer de un flujo dedicado, simplificado y técnicamente aislado para el "Alta de Personas" (Persona Física),  
**Para** registrar individuos en el sistema de manera independiente al flujo completo de "Alta Cliente", recolectando únicamente los datos esenciales sin generar conflictos ni dependencias con la funcionalidad de originación de contratos existentes.

---

## 2. Requisitos Funcionales y Técnicos (Características)

### 2.1. Arquitectura e Independencia
- El flujo "Alta de Personas" debe residir en un módulo propio (`src/app/customer/`).
- Debe estar completamente desacoplado (standalone) de los recursos bajo las rutas  `src/app/onboarding`, `src/app/shared`, `src/app/core`, `src/app/services`, y cualquier otro recurso del proyecto principal. Todos los componentes, servicios, utilerías y modelos necesarios deben tener copias locales (bajo el modulo customer en la ruta: `src/app/customer/`) exclusivas para este flujo.
- El único punto de contacto externo permitido es la autenticación (via `CustomerAuthFacade`).

### 2.2. Punto de Entrada y Navegación
- Se requiere un nuevo icono/tarjeta en el Dashboardº principal llamado **"Alta de Personas"**.
- La ruta asociada a este flujo debe ser `/customer/new-contract`.
- Al finalizar el alta (pantalla de confirmación), el botón "Aceptar" debe redirigir al usuario de regreso al Dashboard principal (`/onboarding`), suprimiendo la redirección a la generación de kits de contratos (`kit-contract`).

### 2.3. Estructura del Flujo
El formulario multi-pasos para Persona Física estará reducido estricta y exclusivamente a 7 pestañas:
1. **Datos Iniciales** (`customer-info`)
2. **Datos Generales** (`general-info`)
3. **Datos de Contacto** (`contact-info`)
4. **Información PPE** (`ppe-info`)
5. **Domicilios** (`address`)
6. **Autocertificación y Datos Fiscales** (`tax-info`)

*Supresión de vistas:* Pestañas como "Propiedad Real", "Proveedor de Recursos", "Entrevista", "Firma", entre otras, así como el código de edición/mantenimiento heredado de onboarding, deben estar completamente desactivados u omitidos.

### 2.4. Reglas de Negocio por Pestaña
**Datos Iniciales (`initial-data`):**
- Al guardar el checkpoint, se deben inyectar los siguientes valores por defecto de contrato para permitir el registro:
  - `bankAreaTypeId`: `"999"`
  - `contraTypeId`: `1`
  - `typeContractSubtypeId`: `1`

**Datos Generales (`general-info`):**
- Se ocultan de la interfaz visual los campos "¿Está actuando por cuenta propia?" y "¿Tiene Proveedor de recursos?", los cuales deben asumir el valor por defecto `false`.

**Autocertificación y Datos Fiscales (`tax-info`):**
- **Visible e interactivo:** Las opciones "¿El cliente reside en México?" y "¿Residencia Fiscal en el Extranjero?", así como la tabla interactiva de "Residencias Fiscales".
- **Oculto y sin validación requerida:** Los campos "Régimen Fiscal" y "Uso de CFDI".
- **Validaciones obligatorias:** Se requiere registrar mínimo 1 residencia fiscal válida y 1 domicilio fiscal activo para habilitar el guardado.

### 2.5. Integración con Servicios (Checkpoint)
- Todas las peticiones HTTP realizadas al servicio central de persistencia (Checkpoint) desde este módulo deben interceptarse e incluir obligatoriamente el header HTTP:
  - `business: cliente`

---

## 3. Estrategia de Nomenclatura Customer

Dado que el módulo de `customer` nació como un clon de `onboarding`, mantener los mismos nombres de clases (ej. `GeneralInfoComponent`) genera ambigüedad al buscar archivos en el IDE o al debugear (stack traces).

**Prefijo `Customer`**
Se utilizará el prefijo **`Customer`** en las clases, interfaces y nombres de archivo para todos los recursos dentro de `src/app/customer`.

1. **Componentes**: `CustomerGeneralInfoComponent`, `CustomerAddressComponent`.
2. **Servicios y Mapeos**: `CustomerOnboardingService` (en lugar de OnboardingService dentro de customer).
3. **Modelos**: `CustomerGeneralInfo`, `CustomerAddressData`.
4. **Excepción**: No agregar el prefijo 'Customer' cuando el nombre del archivo ya tiene la etiqueta 'Customer' como prefijo.
5. **Alcance**: Los recursos fuera del path `src/app/customer` **no** deben ser renombrados con la Nomenclatura Customer.

**Ventajas:**
- Facilita el autocompletado en el IDE (escribir "Customer" muestra todos los recursos exclusivos).
- Evita importaciones accidentales desde el módulo de `onboarding`.
- Claridad absoluta en stack traces y depuración.
