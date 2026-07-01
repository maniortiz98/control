# Buenas Prácticas Para Commits

## Índice

- [Buenas Prácticas Para Commits](#buenas-prácticas-para-commits)
  - [Índice](#índice)
  - [Objetivo](#objetivo)
  - [Formato Recomendado](#formato-recomendado)
  - [Tipos de Commit](#tipos-de-commit)
  - [Buenas Prácticas](#buenas-prácticas)
  - [Commits Que Deben Evitarse](#commits-que-deben-evitarse)
  - [Ejemplos](#ejemplos)
  - [Checklist Antes de Hacer Commit](#checklist-antes-de-hacer-commit)

[Markdown Reference](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax)

[README](../README.md)

---

## Objetivo

Mantener un historial de cambios claro, consistente y fácil de revisar.

La recomendación para este proyecto es seguir el estilo de **Conventional Commits**, ampliamente usado en el ecosistema de Angular.

---

## Formato Recomendado

```text
type(scope): short description
```

Ejemplo:

```text
feat(onboarding): add beneficiary summary card
```

Reglas recomendadas:

- `type` debe indicar claramente la intención del cambio.
- `scope` es opcional, pero se recomienda cuando el cambio afecta un módulo, componente o servicio específico.
- La descripción debe ser corta, clara y en modo imperativo.
- La descripción debe escribirse en inglés para mantener consistencia técnica.
- No cerrar el asunto con punto final.
- Evitar mensajes genéricos como `changes`, `fix`, `update` o `misc`.

---

## Tipos de Commit

Tipos sugeridos, alineados con Angular:

- `feat`: nueva funcionalidad.
- `fix`: corrección de bug.
- `docs`: cambios en documentación.
- `style`: cambios de formato sin impacto funcional.
- `refactor`: mejora interna sin cambiar comportamiento funcional esperado.
- `test`: altas o ajustes en pruebas.
- `build`: cambios en build, dependencias o tooling.
- `ci`: cambios en pipelines o automatización.
- `perf`: mejoras de rendimiento.
- `chore`: tareas de mantenimiento que no encajan en otra categoría.
- `revert`: revierte un commit anterior.

Scopes sugeridos para este proyecto:

- `core`
- `shared`
- `workflow`
- `onboarding`
- `intialData`
- `beneficiaries`
- `address`
- `actiweb`
- `sign`
- `interview`
- `security`
- `docs`
- `cicd`

---

## Buenas Prácticas

- Hacer commits pequeños y enfocados en un solo objetivo.
- Separar cambios funcionales de cambios de formato o refactor.
- Asegurar que el código compile y las pruebas relevantes pasen antes del commit.
- Incluir solo archivos relacionados con el cambio.
- Escribir mensajes que expliquen el resultado del cambio, no el proceso.
- Usar `scope` cuando ayude a ubicar rápidamente el área impactada.
- Si el cambio rompe compatibilidad, usar `!`.

Ejemplo:

```text
feat(workflow)!: replace legacy checkpoint contract
```

Cuando aplique, agregar contexto adicional en el cuerpo del commit:

```text
fix(core): handle null service response in profile mapper

Prevent the mapper from throwing when backend returns null values
for optional fields.
```

También se puede usar un pie para cambios importantes:

```text
BREAKING CHANGE: profile service now requires normalized checkpoint data
```

---

## Commits Que Deben Evitarse

- `fix stuff`
- `changes`
- `update code`
- `wip`
- `test`
- `misc`

Estos mensajes no explican el alcance ni el impacto del cambio.

---

## Ejemplos

```text
feat(onboarding): add transactional profile stepper
fix(shared): correct currency mask on amount input
refactor(core): simplify checkpoint state initialization
test(workflow): add unit tests for summary mapper
docs(docs): document commit message conventions
build(ci): update npm cache strategy in pipeline
```

---

## Checklist Antes de Hacer Commit

- El cambio resuelve un solo objetivo claro.
- El mensaje sigue el formato `type(scope): description`.
- La descripción está en inglés, es corta y específica.
- No se incluyeron archivos temporales, logs o artefactos innecesarios.
- El código fue probado en el alcance que corresponde.
- Si hubo cambio rompiente, se indicó con `!` o con `BREAKING CHANGE`.

---

Si consideras una práctica útil para el equipo, agrega una propuesta y actualiza este documento.
