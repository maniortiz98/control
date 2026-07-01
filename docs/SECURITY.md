# Seguridad

[README](../README.md)

## Autenticación API y Roles

Actualmente la aplicación utiliza dos credenciales de autenticación con propósitos distintos:

1. `tkn_api`: credencial utilizada para solicitar un token Bearer de acceso a la API.
2. `tkn_rol`: credencial utilizada durante el flujo de login para consultar los roles del usuario autenticado en Azure.

> Nota: en este documento se distingue entre una credencial inicial y un token de acceso. La cadena configurada en la aplicación no necesariamente es el token final consumido por los servicios.

### Flujo de login y obtención de roles

El flujo para obtener los roles del usuario autenticado es el siguiente:

1. El usuario inicia sesión mediante Microsoft Azure.
2. A partir de la sesión activa, se obtiene un token silencioso (`silent token`).
3. Del resultado anterior se toma la propiedad `accessToken`.
4. Se realiza una petición a `/cross/security/users/login`, enviando:

   - el `accessToken` de Azure en el cuerpo (`payload`)
   - la credencial `tkn_rol` como `Authorization: Basic ...` en los headers

5. La respuesta del servicio de login devuelve un nuevo `accessToken`.
6. Ese segundo `accessToken` se envía como `Authorization: Bearer ...` en la petición a `/employees/advisor`.
7. La respuesta de ese servicio contiene la información de roles del usuario autenticado.

### Flujo de autenticación hacia la API

La credencial `tkn_api` se usa para obtener un token Bearer que posteriormente se reutiliza en las llamadas a la API.

1. Se realiza una petición a `/oauth/accesstoken` enviando `tkn_api` como `Authorization: Basic ...` en los headers.
2. La respuesta devuelve un `accessToken`.
3. Ese `accessToken` se utiliza como `Authorization: Bearer ...` en las peticiones subsecuentes a la API.
4. Cuando el Bearer token expira o no existe en memoria, debe solicitarse nuevamente repitiendo el paso 1.
