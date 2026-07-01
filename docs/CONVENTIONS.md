# Convenciones - Actinver Spine

## Índice

- [Convenciones - Actinver Spine](#convenciones---actinver-spine)
  - [Índice](#índice)
  - [Acuerdos con Servicios - backend](#acuerdos-con-servicios---backend)
    - [Fechas](#fechas)
    - [Estructura de Objetos y Valores Vacios](#estructura-de-objetos-y-valores-vacios)
  - [Estructura de Carpetas 📂](#estructura-de-carpetas-)
  - [Nombres de Archivos y Componentes 📄](#nombres-de-archivos-y-componentes-)
  - [Uso de Servicios ⚙️](#uso-de-servicios-️)
  - [Componentes y Ciclo de Vida 🧬](#componentes-y-ciclo-de-vida-)
  - [Routing y Navegacion 🚂](#routing-y-navegacion-)
  - [Signals y Effects 🩻](#signals-y-effects-)
  - [Estilos y Angular Material 🖍️](#estilos-y-angular-material-️)
    - [Icons](#icons)
  - [Comentarios 🖍️](#comentarios-️)
  - [Contribuir ✍️](#contribuir-️)

[Markdown Reference](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax)

[README](../README.md)

---

## Acuerdos con Servicios - backend



### Fechas

Los valores de los campos de fecha serán enviados en formato `dd/mm/aaa` y será de tipo `string`.

De igual forma, los servicios retornarán los valores de fecha en el mismo formato y tipo.

### Estructura de Objetos y Valores Vacios

En la respuesta de los servicios, siempre será retornado el mismo objeto independientemente si las propiedades tienen o no valor.

En el caso de que alguna propiedad no tenga valor, retornará con valor `null`.

> esto solo aplica para MANTENIMIENTO

---

## Estructura de Carpetas 📂

- `shared/` : Módulo con Componentes reutilizables, pipes, directivas y Angular Material.
- `core/` : Modulo con servicios, guards, interceptores y configuración principal para el funcionamiento de la Aplicación.
- `onboarding/` : Módulo con funcionalidad propia de la apliación.

```text
proyecto
|────app
     |────core
     |     |────guards
     |     |────interceptors
     |     |────interfaces
     |     |────services
     |────onboarding
     |     |────components
     |     |────constants
     |     |────models
     |     |     |────checkpoints
     |     |────resolvers
     |     |────services  <<== Servicios que se ocupan dentro del mismo módulo.
     |           |────mappers
     |           |────checkpoint    <<== servicios que almacenan en señal, el contenido de una sección.
     |────workflow    <<== Módulo Workflow.
     |      |────components
     |      |────services
     |────shared
           |────components
           |────directives
           |────providers
           |────services <<== servios que se ocupan en toda la app.
           |────types
           |────utils    <<== clases/funciones de ayuda (strings, datetime, etc...)
```

---

## Nombres de Archivos y Componentes 📄

- Usar `kebab-case` para archivos: `user-profile.component.ts`
- Usar `PascalCase` para componentes/clases: `UserProfileComponent`
- Los módulos deben tener el sufijo `Module`: `OnboardingModule`

---

## Uso de Servicios ⚙️

- Los servicios se inyectan con `@Injectable({ providedIn: 'root'})`
- Se hace uso de los servicios con `inject()`.

> Se deberá priorizar el uso de los servicios así, solo en un caso muy específico que se requiera, podrá inyectarse en el constructor.

---

## Componentes y Ciclo de Vida 🧬

- Usar `OnInit` únicamente si es necesario.
- Priorizar el uso de `signal + effect()`.
- No dejar lógica de negocio en el template (usar métodos y/o servicios).

`ngOnInit()` - Hook del ciclo de vida que se llama una vez al inciar el componente.
_se utiliza para ejecutar cosas solamente una vez al iniciar el componente._
`ngOnChanges()` - Hook que se llama cada vez que cambia un @Input.
`effect()` - Funcion reactiva que se ejecuta automaticamente cada vez que cambian las signals que usa.

---

## Routing y Navegacion 🚂

- Cada módulo funcional debe tener su propio archivo `routing.module.ts`.
- Usar `loadChildren` para lazy loading por módulo.
- Usar resolvers solo si es necesario datos antes de cargar la vista.

---

## Signals y Effects 🩻

- Usar `signal()` para estado local reactivo.
- Usar `effect()` para escuchar cambios y disparar side-effects.
- Evitar hacer efectos anidados.

---

## Estilos y Angular Material 🖍️

### Icons

Los íconos personalizados, se están guardan en formato `svg` en `assets/icons/` y se están registrando para poder ser utilizados por Angular Material.
A continuación un ejemplo.
`<mat-icon svgIcon="contract"></mat-icon>`

El mismo nombre con el que se guarde, `persona.svg`, deberá ser el mismo nombre con el que se registre en Angular Material, y será el mismo nombre a utilizar con `<mat-icon>`

---

## Comentarios 🖍️

Los comentarios de cada método deben ir en inglés haciendo referencia a sus parámetros de entrada y salida
Los comentarios en los estilos deben ir en inglés en el archivo scss correspondiente

---

## Contribuir ✍️

Si consideras una buena práctica que valga la pena documentar, por favor abre un PR contra este archivo.
