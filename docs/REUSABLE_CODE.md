# Código Reutilizable

- [Código Reutilizable](#código-reutilizable)
  - [Componentes](#componentes)
    - [TableResultsComponent](#tableresultscomponent)
      - [Cuándo usarlo](#cuándo-usarlo)
      - [Cómo usarlo](#cómo-usarlo)
      - [API](#api)
      - [Comportamiento importante](#comportamiento-importante)
      - [Recomendaciones de reutilización](#recomendaciones-de-reutilización)
    - [AddressSectionComponent](#addresssectioncomponent)
      - [Cuándo usarlo](#cuándo-usarlo-1)
      - [Cómo usarlo](#cómo-usarlo-1)
      - [API](#api-1)
      - [Comportamiento importante](#comportamiento-importante-1)
      - [Recomendaciones de reutilización](#recomendaciones-de-reutilización-1)
    - [ClientDataComponent](#clientdatacomponent)
    - [SearchCustomerComponent](#searchcustomercomponent)
  - [Servicios](#servicios)
    - [SearchClientFlowService](#searchclientflowservice)
      - [validInWatchList](#validinwatchlist)
      - [validInHomonyms](#validinhomonyms)
    - [CustomerInformationService](#customerinformationservice)
  - [Directivas](#directivas)
    - [UppercaseDirective](#uppercasedirective)
    - [Directivas de Fecha – SharedModule](#directivas-de-fecha--sharedmodule)
    - [PercentageDirective](#percentagedirective)
    - [CurrencyDirective](#currencydirective)
  - [Modelos / Enum](#modelos--enum)
    - [Banking Area Type](#banking-area-type)
  - [CSS](#css)
    - [Botón submit](#botón-submit)
  - [Métodos / Funciones](#métodos--funciones)
    - [Concat Full Name | función](#concat-full-name--función)
  - [Implementaciones](#implementaciones)
    - [Salir Sin Guardar](#salir-sin-guardar)
    - [Material Datepicker](#material-datepicker)
    - [Evitar llamados a servicios](#evitar-llamados-a-servicios)

[Markdown Reference](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax)

[README](../README.md)

---

## Componentes

---

### TableResultsComponent

> Componente reutilizable para desplegar resultados tabulares con Angular Material, soporte para selección simple o múltiple, acciones por fila, ordenamiento, filtrado y paginación.
> Pertenece al módulo `Shared`.

#### Cuándo usarlo

Usar `app-table-results` cuando se necesite:

- renderizar listas en formato tabla con Angular Material
- configurar dinámicamente las columnas visibles
- emitir eventos de selección de fila o acciones como ver, editar y eliminar
- habilitar paginación desde el contenedor
- permitir selección múltiple o selección única visual
- aplicar un filtro de texto simple sobre los datos cargados

#### Cómo usarlo

```html
<app-table-results
  [data]="resultTableData"
  [columns]="resultTableCols"
  [config]="tableConfig"
  [filter]="filterText"
  [readOnly]="false"
  (rowSelect)="onRowSelect($event)"
  (eventRow)="onRowAction($event)"
  (eventPage)="onPageChange($event)"
  (multipleRows)="onMultipleRows($event)">
</app-table-results>
```

Ejemplo mínimo de configuración:

```typescript
resultTableCols: ColumnsDataTable[] = [
  { name: 'customerNumber', title: 'Cliente', type: 'string', show: true },
  { name: 'name', title: 'Nombre', type: 'string', show: true },
  { name: 'status', title: 'Estatus', type: 'status', show: true },
];

tableConfig: ConfigDataTable = {
  showPag: true,
  showViewAction: true,
  showEditAction: false,
  showDeleteAction: false,
  multipleSelection: false,
  idName: 'customerNumber',
  sort: true,
  pagConfig: {
    totalRows: 100,
    currentPage: 0,
    pageSize: 10,
    disabled: false,
    showFirstLastButtons: true,
    pageSizeOptions: [5, 10, 20],
    hidePageSize: false,
  },
};

filterText = '';
```

Ejemplo con filtro desde un `input`:

```html
<input #searchBox type="text" (input)="filterText = searchBox.value" />

<app-table-results
  [data]="resultTableData"
  [columns]="resultTableCols"
  [config]="tableConfig"
  [filter]="filterText">
</app-table-results>
```

`filter` debe recibir un `string`. Si el valor proviene de una referencia de plantilla como `#searchBox`, debe enviarse `searchBox.value`, no el elemento HTML completo.

#### API

**_Inputs_**

| Nombre | Tipo | Requerido | Descripción |
| ------ | ---- | --------- | ----------- |
| `data` | `any[]` | Sí | Registros a pintar en la tabla. El componente asigna internamente `dataSource.data` y, si `idName` no se define o se deja como `tr_tempid`, genera un identificador temporal por fila. |
| `columns` | `ColumnsDataTable[]` | Sí | Define columnas, título, tipo y visibilidad. |
| `config` | `ConfigDataTable` | Sí | Configuración general de selección, acciones, paginación y ordenamiento. |
| `filter` | `string` | No | Texto a aplicar sobre `MatTableDataSource.filter`. Debe recibirse como cadena. |
| `readOnly` | `boolean` | No | Si es `true`, evita la selección de filas y deshabilita el radio button de selección única. |

**_ColumnsDataTable_**

| Propiedad | Tipo | Requerido | Descripción |
| --------- | ---- | --------- | ----------- |
| `name` | `string` | Sí | Nombre de la propiedad a leer en cada fila. También se usa como identificador de columna. |
| `title` | `string` | Sí | Texto mostrado en el encabezado. |
| `type` | `'string' \| 'checkbox' \| 'html' \| 'status'` | Sí | Define cómo se representa la columna. |
| `show` | `boolean` | No | Si es `true`, la columna se incluye en `displayedColumns`. |

Notas sobre tipos de columna:

- `string`: imprime el valor tal cual.
- `checkbox`: muestra icono de marcado o desmarcado según el valor booleano.
- `status`: pinta el texto y un indicador visual para `APROBADO`, `RECHAZADO` o `ESPERA`.
- `html`: existe en la interfaz, pero la plantilla actual no renderiza HTML de forma diferenciada; hoy se comporta igual que `string`.
- Solo se pintan columnas con `show === true`.

**_ConfigDataTable_**

| Propiedad | Tipo | Requerido | Descripción |
| --------- | ---- | --------- | ----------- |
| `showPag` | `boolean` | Sí | Muestra u oculta el paginador. |
| `showViewAction` | `boolean` | Sí | Muestra la acción de ver por fila. |
| `showEditAction` | `boolean` | Sí | Muestra la acción de editar por fila. |
| `showDeleteAction` | `boolean` | Sí | Muestra la acción de eliminar por fila. |
| `multipleSelection` | `boolean` | Sí | Habilita selección múltiple por checkbox. |
| `idName` | `string` | No | Propiedad que identifica de forma única cada fila. Default: `tr_tempid`. |
| `singleSelection` | `{ show: boolean; title?: string; propertyName: string }` | No | Agrega una columna de selección única visual mediante radio button. El estado marcado se lee desde `row[propertyName]`. |
| `isSelected` | `boolean` | No | Controla si la fila seleccionada se resalta visualmente. Default: `true`. |
| `sort` | `boolean` | No | Activa `matSort` sobre las columnas visibles. |
| `saveWord` | `string` | No | Propiedad usada al normalizar filas antes de construir la tabla. Default: `active`. |
| `pagConfig` | `PagConfig` | No | Configuración del paginador cuando `showPag` es `true`. |

**_PagConfig_**

| Propiedad | Tipo | Requerido | Descripción |
| --------- | ---- | --------- | ----------- |
| `totalRows` | `number` | Sí | Total de registros para el paginador. |
| `currentPage` | `number` | Sí | Índice de página actual. |
| `pageSize` | `number` | Sí | Tamaño de página actual. |
| `disabled` | `boolean` | Sí | Habilita o deshabilita el paginador. |
| `showFirstLastButtons` | `boolean` | Sí | Muestra botones de primera y última página. |
| `pageSizeOptions` | `Array<any>` | Sí | Opciones disponibles de tamaño de página. |
| `hidePageSize` | `boolean` | Sí | Oculta el selector de tamaño de página. |

**_Outputs_**

| Nombre | Tipo | Descripción |
| ------ | ---- | ----------- |
| `rowSelect` | `EventEmitter<{ row: any; columns: ColumnsDataTable[] }>` | Se emite al hacer click sobre una fila. Retorna la fila y la definición de columnas. |
| `eventRow` | `EventEmitter<{ type: string; row: any }>` | Se emite al ejecutar acciones de fila con `type` igual a `view`, `edit` o `delete`. |
| `eventPage` | `EventEmitter<PageEvent>` | Se emite al cambiar la página o el tamaño de página. |
| `multipleRows` | `EventEmitter<any[]>` | Retorna el conjunto actual de filas seleccionadas por checkbox. |

**_Métodos públicos reutilizables_**

| Nombre | Tipo | Descripción |
| ------ | ---- | ----------- |
| `deselectAll()` | `void` | Limpia la selección múltiple actual. |
| `selectAll()` | `void` | Selecciona todas las filas cargadas en la tabla. |

#### Comportamiento importante

1. En cada cambio de `config` o `columns`, el componente reconstruye `displayedColumns` en este orden: selección múltiple, columnas visibles, selección simple y acciones.
2. Si `config.showPag` es `true`, la tabla conecta `MatPaginator` y refleja el estado de `pagConfig`, pero la carga de datos y la respuesta a `eventPage` siguen siendo responsabilidad del contenedor.
3. Si `config.sort` es `true`, la tabla conecta `MatSort`; si es `false`, lo desactiva explícitamente.
4. Al recibir cambios en `filter`, el componente asigna el valor directamente a `dataSource.filter`.
5. Antes de pintar los datos, la tabla elimina filas con `active === false`. Si no encuentra la propiedad evaluada por `saveWord`, normaliza el registro agregando `active: true`.
6. La columna `acciones` aparece solo cuando alguna de las banderas `showViewAction`, `showEditAction` o `showDeleteAction` está habilitada.
7. Las acciones visibles también dependen del estado del registro, particularmente de las propiedades `isSaved` e `isView`.
8. El click sobre una fila emite `rowSelect`, guarda el registro seleccionado y resalta la fila si `config.isSelected` no es `false`.
9. Cuando `readOnly` es `true`, se bloquea la selección por click de fila y se deshabilita el radio button de selección simple.

#### Recomendaciones de reutilización

1. Definir siempre `idName` con una propiedad estable del registro cuando la tabla reciba nuevos datos o actualizaciones parciales.
2. Mantener `columns` como una constante o configuración del contenedor para reutilizar la misma tabla en distintos flujos.
3. Usar `eventPage` para paginación server-side y `rowSelect` o `eventRow` para disparar navegación, detalle o edición.
4. Pasar siempre un `string` en `filter`; si el origen es un `<input #ref>`, usar `ref.value`.
5. Si se requiere selección simple persistente, mantener actualizada en los datos la propiedad configurada en `singleSelection.propertyName`.
6. No depender del tipo `html` hasta implementar una representación diferenciada en la plantilla.

### AddressSectionComponent

> Componente reutilizable para captura y edición de domicilio, con soporte para catálogos, validaciones condicionales, búsqueda de código postal y validación de comprobante de domicilio.
> Pertenece al módulo `Shared`.

#### Cuándo usarlo

Usar `app-address-section` cuando se necesite:

- capturar un domicilio completo dentro de un formulario mayor
- precargar una dirección existente para edición
- alternar secciones del formulario según el flujo, por ejemplo rol, tipo de domicilio o comprobante
- resolver automáticamente entidad, ciudad, municipio y colonias a partir del código postal en México
- validar un comprobante de domicilio con reglas de vigencia antes de guardar

#### Cómo usarlo

```html
<app-address-section
  #addressSection
  [dataAddress]="addressData"
  [dataClient]="checkpointData"
  [addressClient]="true"
  [hideRoleSection]="false"
  [hideProofOfAddressSection]="false"
  [hideAddresstype]="false"
  [setReadonly]="false"
  [filter]="false">
</app-address-section>
```

Ejemplo de consumo desde el contenedor:

```typescript
@ViewChild('addressSection')
private addressSection!: AddressSectionComponent;

async saveAddress(): Promise<void> {
  const address = await this.addressSection.onSubmit();

  if (!address) {
    return;
  }

  // Persistir address en el flujo correspondiente.
}
```

Para recargar el formulario con otra dirección desde el contenedor:

```typescript
this.addressSection.setAddresData(existingAddress);
```

#### API

**_Inputs_**

| Nombre | Tipo | Requerido | Descripción |
| ------ | ---- | --------- | ----------- |
| `dataAddress` | `Address \| null` | No | Precarga la información del domicilio cuando el componente inicializa. |
| `hideRoleSection` | `boolean` | No | Oculta o relaja las validaciones relacionadas con el rol del domicilio según el flujo de envío. |
| `hideProofOfAddressSection` | `boolean` | No | Omite la sección y validaciones del comprobante de domicilio. |
| `setReadonly` | `boolean` | No | Si es `true`, deshabilita todos los controles del formulario al inicializar. |
| `setReadonlyDomicileTypes` | `boolean` | No | Input declarado en el componente. Al momento de documentar no tiene efecto visible en la clase TypeScript. |
| `dataClient` | `Data \| null` | No | Se usa para determinar reglas ligadas a nacionalidad, especialmente permanencia en México. |
| `addressClient` | `boolean` | No | Influye en validaciones del flujo simplificado de envío. |
| `hideAddresstype` | `boolean` | No | Permite omitir la exigencia del tipo de domicilio en ciertos flujos. |
| `mant` | `boolean` | No | Input declarado en el componente. Al momento de documentar no tiene efecto visible en la clase TypeScript. |
| `filter` | `boolean` | No | Si es `true`, limita el catálogo de tipos de domicilio al `addressTypeId === '1'`. |

**_Estado interno relevante_**

| Nombre | Tipo | Descripción |
| ------ | ---- | ----------- |
| `profileForm` | `FormGroup` | Formulario reactivo que concentra todos los campos del domicilio. |
| `countries` | `Signal<Countries[]>` | Catálogo de países. |
| `states` | `Signal<Entity[]>` | Catálogo de entidades federativas. |
| `domicileRoles` | `Signal<AddressRole[]>` | Catálogo de roles de domicilio. |
| `domicileTypes` | `Signal<AddressType[]>` | Catálogo de tipos de domicilio. |
| `domiliceProof` | `Signal<ProofOfAddressType[]>` | Catálogo de comprobantes de domicilio para persona física. |
| `colony` | `Signal<SuburbItem[]>` | Colonias obtenidas por código postal. |

**_Métodos públicos reutilizables_**

| Nombre | Tipo | Descripción |
| ------ | ---- | ----------- |
| `onSubmit()` | `Promise<Address \| null>` | Ejecuta validaciones según el flujo visible y retorna el domicilio capturado o `null` si hay errores. |
| `address()` | `Address` | Devuelve el valor actual del formulario usando `getRawValue()`. Útil cuando el contenedor solo necesita leer el estado actual. |
| `setAddresData(dataAddress)` | `void` | Rehidrata el formulario con un domicilio distinto después de inicializado el componente. |
| `toggleControls(formGroup, disable)` | `void` | Habilita o deshabilita controles recursivamente. Puede reutilizarse si el contenedor obtiene acceso a la instancia. |

#### Comportamiento importante

1. El componente consume catálogos en `ngOnInit()` mediante `CatalogsService` y registra su formulario en `NotificationFormRegistry`.
2. Si `setReadonly` es `true`, el formulario se deshabilita completo desde la inicialización.
3. Si existe `dataAddress`, el componente precarga los campos y, si el país es México y hay código postal, consulta `ZipCodeService` para reconstruir entidad, ciudad, municipio y colonias.
4. Cuando el país es distinto de México, los campos de entidad, ciudad y municipio se habilitan para captura manual; para México se deshabilitan y dependen del código postal.
5. `onBlur()` del código postal dispara la consulta al servicio de CP y limpia datos geográficos si el código es inválido o si falta país.
6. `onSubmit()` cambia las validaciones activas según `hideRoleSection`, `hideProofOfAddressSection`, `hideAddresstype` y `addressClient`.
7. En el flujo completo, la vigencia del comprobante se valida así:
   - comprobantes generales: fecha de emisión dentro de los últimos 3 meses
   - `PREDIAL`: vigencia de hasta 2 años
   - `INE`: validación por `expirationYear`
8. El componente agrega la clase global `show-validation` al `body` al enviar, por lo que tiene efecto visual fuera de su plantilla.
9. Las notificaciones de error se emiten con `NotificationsService` cuando faltan campos obligatorios o el domicilio no pasa validaciones de CP o vigencia.

#### Recomendaciones de reutilización

1. Usar `onSubmit()` como punto único de validación desde el contenedor en lugar de leer `profileForm.valid` directamente.
2. Si el flujo edita múltiples domicilios con la misma instancia, preferir `setAddresData()` para rehidratar la sección.
3. Pasar `dataClient` cuando la nacionalidad afecte reglas de permanencia en México; sin ese dato, parte del comportamiento condicional no se activa.
4. Considerar que el componente depende de catálogos y lookup de código postal; si se reutiliza en otro módulo, esos servicios deben seguir disponibles.
5. No documentar ni consumir `setReadonlyDomicileTypes` o `mant` como capacidades funcionales hasta que exista lógica explícita que las soporte.

### ClientDataComponent

> Componente 'app-client-data' utilizado para mostrar el formulario de datos iniciales de una persona.
> Puede personalizarse el que mostrar.
> Pertenece al módulo `Shared`.

**_COMO USAR_**

```html
<app-client-data [data]="data" [gender]="true" [genderMaritalStatus]="true"></app-client-data>
```

**_API_**

**_inputs_**

|  Nombre            |  Tipo     | Requerido |  Descripción                                                                                                          |
| ------------------ | --------- | --------- | --------------------------------------------------------------------------------------------------------------------- |
| data               | `Client`  |           | se le pasa si se requiere que el formulario se precargue con informacion, tambien puede recibir un objeto vacio o null|
| gender             | `boolean` |           | se oculta genero genero y se muestra estado civil si se le pasa un true                                               |
| genderMaritalStatus| `boolean` |           | Muestra el formulario completo                                                                                        |

**_methods_**

|    Nombre     |  Tipo         |  Descripción                                                                                                                                             |
| --------------| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| submit        | `DataClient`  | Retorna los datos del cliente ya validados si gender y genderMaritalStatus son false. estado y ciudad de nacimiento se retornan en (stateOfBirth)        |
| submitPPE     | `DataClient`  | Retorna los datos del cliente ya validados si gender es true y genderMaritalStatus es false. estado y ciudad de nacimiento se retornan en stateOfBirth)  |
| submitComplet | `DataClient`  | Retorna los datos del cliente ya validados si gender es false y genderMaritalStatus es true. estado y ciudad de nacimiento se retornan en (stateOfBirth) |

### SearchCustomerComponent

> Componente del formulario de búsqueda.
> Búsquedas por: Cliente / ID Prospecto
> Pertenece al módulo `Shared`

**_COMO USAR_**

```html
<app-search-customer #searchCustomer
  [type]="typeSearch">
</app-search-customer>
```

**_API_**

**_inputs_**

| Nombre |         Tipo                                | Requerido | Default              |             Descripción                                         |
| ------ | ------------------------------------------- | --------- | ---------------------|---------------------------------------------------------------- |
| type   | SEARCH_TYPE.CUSTOMER ó SEARCH_TYPE.PROSPECT |    x      | SEARCH_TYPE.CUSTOMER | Si buscará por cliente o prospecto. Cambian 2 campos al inicio. |

**_methods_**

==submit(search: boolean)==

**_param: search_** - Si el formulario es válido, entonces realiza la búsqueda automaticamente
y regresa los datos en la propiedad 'results'

retorna:

```typescript
interface SubmitForm
{
  data: SearchForm;
  type: string;
  valid1: number;
  valid2: number;
  valid3: number;
  valid4: number;
  valid: boolean;
  empty: boolean;
  groupError: boolean;
  results?: any;
}
```

---

## Servicios

---

### SearchClientFlowService

> Servicio reutilizable para ejecutar las validaciones de listas de restricción y búsqueda de homónimos dentro de flujos de alta, mantenimiento y validaciones relacionadas.
> Pertenece al módulo `Shared`.

**_Archivo_**

`src\app\shared\services\search-client-flow.service.ts`

**_Métodos públicos relevantes_**

| Nombre | Tipo | Descripción |
| ------ | ---- | ----------- |
| `validInWatchList(data, customerId?)` | `Promise<boolean>` | Ejecuta la validación contra watchlist, dispara modales según el resultado y determina si el flujo puede continuar. |
| `validInHomonyms(data, thirdRelated?)` | `Promise<HomonymsResponseData>` | Ejecuta la búsqueda de homónimos, muestra modales de revisión y devuelve si el flujo debe continuar o reutilizar un cliente existente. |
| `getDataWatchList(data)` | `Promise<WatchListReturn>` | Variante sin workflow visual completo; solo consulta watchlist y retorna la respuesta enriquecida. |
| `getWatchListWF(listData, exceptions?)` | `Promise<boolean>` | Ejecuta únicamente la parte de workflow visual a partir de una respuesta de watchlist ya obtenida. |

#### validInWatchList

> Obtiene las listas donde existe coincidencia, interpreta el `step` devuelto por backend y ejecuta el comportamiento de negocio asociado.

**_Firma_**

```typescript
async validInWatchList(data: DataClient, customerId: string | null = null): Promise<boolean>
```

**_Parámetros_**

| Nombre | Tipo | Requerido | Descripción |
| ------ | ---- | --------- | ----------- |
| `data` | `DataClient` | Sí | Datos capturados del cliente. El método arma `personalInfo` usando nombre, apellidos, fecha de nacimiento, RFC, CURP, género, país y estado de nacimiento. |
| `customerId` | `string \| null` | No | Solo se utiliza cuando el flujo actual está en mantenimiento y existe `accountId` en `OnboardingStateServiceService`. En ese caso se envía junto con `accountId` al backend. |

**_Retorno_**

- `true`: el flujo puede continuar.
- `false`: el flujo debe detenerse, ya sea por coincidencia restrictiva, navegación de salida o error de servicio.

**_Cómo usarlo_**

```typescript
const canContinue = await this.searchClientFlowService.validInWatchList(clientData, customerId);

if (!canContinue) {
  return;
}

// Continuar con el siguiente paso del flujo.
```

**_Reglas de negocio implementadas_**

1. El método reintenta la invocación al servicio hasta 3 veces usando `retry()`.
2. En cada reintento fallido muestra un modal de advertencia con el número de intento.
3. Cuando la respuesta regresa `step === 1`, el flujo termina y se muestra un modal de error indicando que el solicitante se encuentra en listas restrictivas.
4. Cuando `step === 1`, si hay múltiples tipos de lista en `matchLists`, se muestran todas en `beforeMessages`; si no hay tipos, se muestra el mensaje genérico; si hay una sola lista, se concatena en el título.
5. Cuando la respuesta regresa `step === 2`, se muestra advertencia indicando revisión por PLD.
6. En mantenimiento, `step === 2` también cierra diálogos y navega al inicio, devolviendo `false`.
7. Si el estado global indica `isOnboardingWL`, entonces `step === 2` permite continuar devolviendo `true`.
8. Cuando la respuesta regresa `step === 3`, el método devuelve `true` sin abrir modales adicionales.
9. Ante error final del servicio, muestra una notificación toast de error y devuelve `false`.

**_Efectos colaterales importantes_**

1. Actualiza `this.listData` con la última respuesta de watchlist.
2. Limpia el flag de cambios sin guardar con `setUnsavedChanges(false)` en rutas de bloqueo o revisión.
3. Puede cerrar diálogos abiertos mediante `closeAllDialogs(true)`.
4. Puede navegar a la ruta raíz relativa usando `Router.navigate(['/'])`.
5. Depende del estado actual entregado por `OnboardingStateServiceService` para decidir si envía `customerId/accountId` y si permite continuar en `step === 2`.

**_Cuándo reutilizarlo_**

1. En flujos donde la validación de watchlist deba decidir de inmediato si el usuario puede seguir capturando o debe salir del proceso.
2. Cuando se necesite conservar el comportamiento estándar de modales, bloqueo, cierre de diálogos y navegación ya homologado en onboarding y mantenimiento.

**_Recomendaciones de implementación_**

1. Invocarlo solo después de contar con un `DataClient` completo; si faltan datos de identidad, la solicitud se enviará incompleta al backend.
2. No duplicar modales o navegación en el componente contenedor para los casos `step === 1` y `step === 2`; el servicio ya controla ese comportamiento.
3. Si el flujo necesita desacoplar consulta y workflow visual, usar `getDataWatchList()` seguido de `getWatchListWF()` en lugar de `validInWatchList()`.
4. En mantenimiento, pasar `customerId` real solo cuando el flujo represente un cliente existente y exista `accountId` en el estado global.

#### validInHomonyms

> Consulta homónimos, clasifica el nivel de coincidencia y resuelve si se continúa con alta nueva o si se debe seleccionar un cliente existente.

**_Firma_**

```typescript
async validInHomonyms(data: DataClient, thirdRelated: boolean = false): Promise<HomonymsResponseData>
```

**_Parámetros_**

| Nombre | Tipo | Requerido | Descripción |
| ------ | ---- | --------- | ----------- |
| `data` | `DataClient` | Sí | Datos del cliente usados para armar `HomonymsRequest`, incluyendo nombre, apellidos, RFC/NIF/TIN/NSS, país de nacimiento, fecha de nacimiento y CURP. |
| `thirdRelated` | `boolean` | No | Activa una advertencia adicional en mantenimiento cuando, después de revisar homónimos, se decide continuar sin seleccionar un cliente existente. |

**_Retorno_**

```typescript
interface HomonymsResponseData {
  passOnHomonyms: boolean;
  numberClient?: number | null;
}
```

- `passOnHomonyms: true`: el flujo puede continuar como alta nueva.
- `passOnHomonyms: false` y `numberClient` con valor: se seleccionó o detectó un cliente existente para continuar con ese número.
- `passOnHomonyms: false` y `numberClient: null`: el flujo no quedó resuelto por error o cancelación sin selección.

**_Cómo usarlo_**

```typescript
const homonymsResult = await this.searchClientFlowService.validInHomonyms(clientData, false);

if (!homonymsResult.passOnHomonyms && homonymsResult.numberClient) {
  // Recuperar o redirigir al cliente existente.
  return;
}

if (!homonymsResult.passOnHomonyms) {
  return;
}

// Continuar con alta nueva.
```

**_Reglas de negocio implementadas_**

1. El método reintenta la consulta de homónimos hasta 3 veces y muestra advertencia por cada intento fallido.
2. El resultado del servicio se evalúa con `searchPercentSimilarity()`.
3. Si `homo.code === 2` o `homo.code === 3`, se consideran coincidencias relevantes que requieren revisión en el modal de homónimos.
4. Para `code === 2` o `3`, el servicio guarda la lista en `HomonymsService`, muestra modal de éxito y abre `formModalHomonyms()`.
5. Si el modal devuelve `"continue"`, el método retorna `{ passOnHomonyms: true, numberClient: null }`.
6. Si el modal devuelve un identificador distinto de `"continue"`, el método retorna `{ passOnHomonyms: false, numberClient: result }`.
7. Si `homo.code === 1`, se considera coincidencia exacta; se muestra el cliente encontrado y se abre `homonimiaModal()` con el registro exacto.
8. Para coincidencia exacta, cualquier valor devuelto por el modal se regresa como `numberClient` con `passOnHomonyms: false`.
9. Si no hay coincidencias relevantes, el método retorna `{ passOnHomonyms: true, numberClient: null }`.
10. Si `thirdRelated` es `true` y el flujo actual está en mantenimiento, al continuar sin cliente existente se muestra el mensaje: `Cliente no Existente. Favor de dar de Alta en el Módulo Alta Persona.`
11. Si ocurre un error final del servicio, muestra notificación de error y retorna `{ passOnHomonyms: false, numberClient: null }`.

**_Efectos colaterales importantes_**

1. Actualiza `this.listHomonyms` con la respuesta del backend.
2. Guarda la lista consultada en `HomonymsService.setData()` cuando existe coincidencia exacta o relevante.
3. Limpia el estado de cambios sin guardar con `setUnsavedChanges(false)` al entrar a revisión de homónimos.
4. Muestra distintos modales de éxito, advertencia y selección según el tipo de coincidencia.

**_Cuándo reutilizarlo_**

1. En flujos de alta o mantenimiento donde la decisión de continuar depende de determinar si ya existe un cliente con coincidencia exacta o cercana.
2. Cuando se necesite mantener el mismo criterio de similitud y la misma experiencia de revisión homologada con los modales actuales.

**_Recomendaciones de implementación_**

1. Consumir siempre el objeto completo `HomonymsResponseData`; no asumir que basta con revisar solo `passOnHomonyms`.
2. Si `passOnHomonyms` es `false` y `numberClient` tiene valor, el contenedor debe tratarlo como cliente existente y continuar con ese identificador.
3. Si `passOnHomonyms` es `false` y `numberClient` es `null`, tratarlo como flujo detenido por error o cierre no resolutivo.
4. No abrir modales adicionales de confirmación antes o después de invocar este método salvo que el flujo tenga una excepción funcional explícita; el servicio ya resuelve la interacción principal.
5. Activar `thirdRelated` solo para escenarios de terceros relacionados en mantenimiento donde sea obligatorio notificar que el alta debe hacerse en otro módulo.

**_Dependencias funcionales del servicio_**

1. `WatchlistService` para consulta de listas restrictivas.
2. `HomonymsService` para consulta y persistencia temporal de homónimos.
3. `NotificationModalService` y `ModalFormService` para la interacción modal.
4. `ModalHomonymsServiceService` para la revisión detallada de coincidencias múltiples.
5. `OnboardingStateServiceService` para decisiones contextuales de onboarding y mantenimiento.
6. `UnsavedChangesService`, `MatDialog`, `Router` y `ActivatedRoute` para control de estado y navegación del flujo.

### CustomerInformationService

Este servicio consulta la información completa de un cliente existente.

> src\app\shared\services\customer.service.ts

Métodos:

1. getCustomerInfo()

---

## Directivas

---

### UppercaseDirective

Directiva para usar en `inputs type='text'`, que especificamente realiza 3 acciones:

1. Transform el texto a mayúsculas.
2. Reemplaza acentos.
3. Elimina espacios en blanco del inicio y final del string.

Su uso es el siguiente:

```html
<input
  appUppercase
  matinput
  type="text"
  class="form-control"
  formControlName="customerNumber"
  maxlength="10"
/>
```

---

### Directivas de Fecha – SharedModule

Este documento describe las directivas creadas para el manejo estricto de **inputs de fecha**
utilizados con **Angular Material (`matInput` + `mat-datepicker`)**.

El objetivo es asegurar:

- UX consistente y controlada
- Formato de fecha correcto desde el input
- Validaciones estrictas y predecibles
- Separación clara entre **control de entrada** y **validación**

**_USO_**

```html
<input
 matInput
  [matDatepicker]="picker"
  formControlName="date"
  appDateInputStrict
  appDateValidator
  placeholder="DD/MM/AAAA"
  maxlength="10"
/>
```

### PercentageDirective

Directiva para aceptar números entre 0 y 100, con 2 decimales.

**_USO_**

```html
<input
  appPercentage
  matinput
  type="text"
  class="form-control"
  formControlName="percentage"
  maxlength="6"
/>
```

### CurrencyDirective

Esta directiva es usada para formatear visualmente una cantidad numérica en formato moneda.

Permite introducir valores numéricos con 2 ó 0 decimales. Al perder el foco la cantidad se formatea con símbolo de pesos, separador de miles por coma y 2 decimales.

Al entrar al input, se vuelve a mostrar como número, y cuando se obtiene el valor del input por ejemplo desde un formulario reactivo, este obtiene el valor numérico crudo, sin formatear.

**_USO_**

```html
<input
  matinput
  type="text"
  class="form-control"
  formControlName="maxAmount"
  appCurrencyDirective
/>
```

**_ejemplos:_**

- 100 convierte en: $ 100.00
- 15500 convierte en: $ 15,500.00
- 2500.50 convierte en: $ 2,500.50

---

## Modelos / Enum

---

Se listan modelos/interfaces y Enums se consideran importantes y pueden ser de utilidad en diversas secciones y/o partes de la aplicación.

### Banking Area Type

`enum BankingAreaTypeEnum`

- BANCO = '999'
- BOLSA = '998'

`enum AllowedValuesGenders`

- H = 2
- M = 1
- X = 3

`enum AllowedGenders`

- H = 'H'
- M = 'M'
- X = 'X'

`enum AllowedFullTextGenders`

- H = 'Masculino'
- M = 'Femenino'
- X = 'No Binario'

---

## CSS

---

### Botón submit

Botón de submit que persiste en varias pantallas, de color azul.

La clase `.bt-submit` se agrega directamente en un `<button>`

## Métodos / Funciones

### Concat Full Name | función

Esta funcion concatena primer nombre, segundo nombre, primer apellido y segundo apellido en una sola linea, eliminando espacios dobles o al final de la linea.

archivo: `src\app\shared\utils\string.ts`

function: `concatFullName(firstName?: string, secondFirstName?: string, lastName?: string, secondLastName?: string)`

retorna: `string`

## Implementaciones

### Salir Sin Guardar

Agregar la siguiente suscripción donde se tenga el formulario a checar:

```typescript
this.form.valueChanges.subscribe(() => {
  this.unsavedChangesService.setUnsavedChanges(this.form.dirty);
});
```

Agegar `canDeactivate: [PendingChangesGuard]` al objeto del path que se desea vigilar:

```typescript
{
  path: 'customer-info',
  component: FirstDataComponent,
  canDeactivate: [PendingChangesGuard]
}
```

### Material Datepicker

```html
<div class="form-row">
  <div class="mb-3 input-field matinput-date">
    <mat-label>Fecha de Nacimiento</mat-label>
    <input matInput [matDatepicker]="pickerBirthdate" class="form-control" formControlName="birthdate"
      [min]="birthDates.min" [max]="birthDates.max" [maxLength]="10">
      <!-- <mat-hint>MM/DD/YYYY</mat-hint> -->
    <mat-datepicker-toggle matIconSuffix [for]="pickerBirthdate"></mat-datepicker-toggle>
    <mat-datepicker #pickerBirthdate [startAt]="birthDates.startAt"></mat-datepicker>
  </div>
</div>
```

```typescript
birthDates = {
  startAt: DateTimeUtils.yearsAgo(18),
  max: new Date(),
  min: DateTimeUtils.yearsAgo(150),
};
```

### Evitar llamados a servicios

Para evitar que al dar click en "Guardar", se haga una petición al servicio, si el formulario no ha sufrido ningun cambio.
En el método que realice el "submit", se deberá validar si el formulario está 'nuevo'

```typescript
if ( this.form.pristine ) {
  return;
}
```

Si el formulario está nuevo, evitará el flujo que lleva a la petición al back.
Para asegurarse que vuelve al estado original, una vez que ha hecho la petición y se han procesado los datos del formulario, se settea al estado original.

```typescript
this.form.markAsPristine();
```
