# API.md — Contratos con Microservicios

## Índice

- [API.md — Contratos con Microservicios](#apimd--contratos-con-microservicios)
  - [Índice](#índice)
  - [Convenciones generales](#convenciones-generales)
  - [MS Spine Definition Services](#ms-spine-definition-services)
    - [Buscar contratos por cliente](#buscar-contratos-por-cliente)
    - [Transferencia de Asesores](#transferencia-de-asesores)
  - [MS Customer Checkpoint Maintenance](#ms-customer-checkpoint-maintenance)
    - [Obtener checkpoint de contrato](#obtener-checkpoint-de-contrato)
  - [MS Customers Search](#ms-customers-search)
  - [Manejo de errores](#manejo-de-errores)

---

## Convenciones generales

- **Base URL**: definida en `environment.ts` como `apiUrl`
- **Autenticación**: Bearer token via MSAL (`msal-auth.service.ts`)
- **Formato**: JSON (`Content-Type: application/json`)
- **Proxy local**: configurado en `proxy.conf.json`

---

## MS Spine Definition Services

Swagger de referencia: `ms_swagger/ms-spine-definition-services_sprint_3.yml`

### Buscar contratos por cliente

```bash
GET /customers/{customerNumber}/contracts
```

| Parámetro      | Tipo   | Lugar | Descripción                  |
|----------------|--------|-------|------------------------------|
| customerNumber | string | path  | Número de cliente            |

**_Response 200_**

```json
{
  "client": { "clientId": 1, "fullName": "JUAN PÉREZ", "..." : "..." },
  "contracts": [
    {
      "accountId": 100,
      "contractType": "BANCO",
      "bankingArea": "999",
      "openingDate": "1987-11-10"
    }
  ]
}
```

Servicio Angular: `search-contract.service.ts`
Modelo: `contracts.ts → ContractsSearchResponse`

---

### Transferencia de Asesores

```bash
POST /advisors/transfer
```

**_Request body_**

```json
{
  "advisorFrom": "A001",
  "advisorTo":   "A002",
  "contracts":   ["C001", "C002"]
}
```

**_Response 200_**

```json
{ "success": true, "transferred": 2 }
```

Servicio Angular: `advisors-transfer.service.ts`

---

## MS Customer Checkpoint Maintenance

Swagger: `ms_swagger/20251219_ms-customer-ck-spine-maintenance-checkpoint_v2.6.yml`

### Obtener checkpoint de contrato

```bash
GET /contracts/{contractId}/checkpoint
```

**_Response 200_**

```json
{
  "contractId": "C001",
  "status": "ACTIVE",
  "checkpoints": []
}
```

---

## MS Customers Search

Swagger: `ms_swagger/20251204_customers-search-application.yml`

```bash
GET /customers/search?q={query}
```

| Parámetro | Tipo   | Descripción              |
|-----------|--------|--------------------------|
| q         | string | Nombre, RFC o número     |

---

## Manejo de errores

| Código | Significado              | Acción en frontend                     |
|--------|--------------------------|----------------------------------------|
| 400    | Bad Request              | Mostrar mensaje de validación          |
| 401    | No autenticado           | Redirigir a login (MSAL)               |
| 403    | Sin permisos             | Mostrar pantalla de acceso denegado    |
| 404    | Recurso no encontrado    | Mostrar notificación de error          |
| 500    | Error del servidor       | Notificación genérica + log            |

Interceptor de errores: `http-client.service.ts`
