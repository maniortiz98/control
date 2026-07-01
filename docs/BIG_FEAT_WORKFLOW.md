# Big Feature Workflow

Guía de trabajo para operar una feature grande sin mezclar cambios, mantener limpia la integración y reducir conflictos entre secciones.

[regresar a README](../README.md)

---

## Objetivo

Definir cómo se debe trabajar sobre una rama `Feature`, cómo integrar cambios desde `Develop` y qué reglas seguir para que cada sección llegue limpia y trazable.

---

## Estrategia de Ramas

- El trabajo del PM se realiza sobre una rama `Feature`.
- La rama `Feature` se actualiza desde `Develop` únicamente por los responsables de integración.
- Cada rama de tarea debe salir desde la rama `Feature`.
- Cada rama de tarea debe mantenerse actualizada desde esa misma rama `Feature`.
- No se debe hacer merge de `Develop` directamente sobre una rama de tarea bajo ningún motivo.

Flujo esperado:

```text
Develop -> Feature -> Rama de tarea por sección
```

---

## Ventanas de Integración

La integración entre `Develop` y `Feature` se divide en dos bloques durante el día:

- Primer bloque: de 9:00 a 14:00. Lo cubre quien entra en horario de 9 a 18.
- Segundo bloque: de 16:00 a 20:00. Lo cubre quien entra en horario de 11 a 20.

Esto permite centralizar los merges y evitar que varias personas actualicen la rama `Feature` al mismo tiempo.

---

## Responsables de Integración

Los backups pueden integrar únicamente cuando el responsable les delegue la actividad.

- Jonthan -> backup Felix
- Gayol -> backup Dani

---

## Reglas Para Ramas de Tarea

- Cada rama de tarea debe corresponder a una sección específica del PM.
- La rama debe contener únicamente cambios de esa sección.
- Los commits deben reflejar funcionalidad terminada o fixes puntuales, no trabajo parcial mezclado.
- Una vez integrada la sección en `Feature`, la rama de tarea debe eliminarse.

---

## Alcance Esperado de los Commits

Se espera que los commits se agrupen por funcionalidad, por ejemplo:

- PM sección onboarding guardado
- PM sección onboarding consulta
- PM sección mantenimiento guardado
- PM sección mantenimiento consulta
- Fix de sección

La intención es que cada commit sea fácil de revisar y revertir si hiciera falta.

Puedes consultar la guia de [Commits](COMMITS.md)

---

## Reglas de Integración

- Solo los responsables de integración actualizan la rama `Feature` desde `Develop`.
- Las personas que desarrollan una sección deben actualizar su rama desde `Feature`, no desde `Develop`.
- Antes de pedir integración, la rama debe estar ordenada y con commits limpios.
- Si una sección ya fue integrada, la rama asociada debe borrarse para evitar reutilizarla.

Se tendrá una sesión para explicar esta forma de integración y asegurar que los commits lleguen limpios a la rama `Feature`.

---

## Antes de Levantar Dudas

Antes de consultar una duda, valida si la respuesta ya existe en el [README](../README.md).

---

## Checklist Rápido

- La rama de tarea fue creada desde `Feature`.
- La rama de tarea se actualizó desde `Feature`.
- No se hizo merge de `develop` hacia la rama de tarea.
- Los commits están agrupados por funcionalidad o fix.
- La sección está lista para integrarse sin cambios ajenos.
- La rama se eliminará después de integrarse.
