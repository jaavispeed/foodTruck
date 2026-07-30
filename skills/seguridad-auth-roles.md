---
name: "seguridad-auth-roles"
description: "Estándar obligatorio para la protección de controladores, manejo de sesiones y autorización basada en roles (RBAC) en el backend."
---

# Skill: Seguridad - Autenticación y Roles

Este documento define cómo debe protegerse el acceso a la aplicación.

## 1. Protección por Defecto
**Regla Estricta:** Ningún controlador debe ser de acceso público por omisión. Todo endpoint debe requerir autenticación usando el decorador personalizado `@Auth()`.

- **Controladores Nuevos:** Inmediatamente después de crear un nuevo controlador con el CLI de NestJS, debes importarlo y decorarlo a nivel de clase:
  
  ```typescript
  import { Controller } from '@nestjs/common';
  import { Auth } from '../auth/decorators/auth.decorator';

  @Auth() // Obligatorio siempre en la línea anterior a @Controller
  @Controller('ventas')
  export class VentasController { ... }
  ```

## 2. Autorización Basada en Roles (RBAC)
Si un módulo es destructivo o de configuración sensible (ej. Eliminar usuarios, ver balances generales), se debe restringir explícitamente a roles administrativos.

- **Uso:** El decorador `@Auth()` acepta una lista de roles permitidos definidos en el enum de tu proyecto.
- **Ejemplo:** Si un endpoint de reportes financieros solo debe ser visto por Administradores:
  
  ```typescript
  import { ValidRoles } from '../auth/interfaces/valid-roles';

  @Auth(ValidRoles.admin, ValidRoles.superUser)
  @Controller('reportes-financieros')
  export class ReportesController { ... }
  ```

## 3. Extracción Segura del Usuario Actual
Nunca confíes en un ID de usuario enviado en el Body (`{ "userId": 5 }`) para operaciones que requieran la identidad del emisor. 
- Utiliza siempre el decorador `@GetUser()` (o tu equivalente de Passport) para extraer la identidad directamente desde el Token JWT verificado por el servidor.
