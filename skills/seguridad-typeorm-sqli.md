---
name: "seguridad-backend"
description: "Estándares y mejores prácticas de seguridad para el desarrollo del backend en NestJS, abarcando protección de endpoints y prevención de inyecciones SQL."
---

# Seguridad del Backend (NestJS + TypeORM)

Este documento establece las políticas **obligatorias** de seguridad que deben aplicarse a todo el código desarrollado en el proyecto FoodTruck (Backend), garantizando la integridad de los datos y protegiendo el sistema contra vulnerabilidades comunes (ej. Inyecciones SQL, acceso no autorizado).

## 1. Protección de Endpoints (Autenticación)

**Regla de Oro:** **TODOS** los endpoints deben estar protegidos y exigir autenticación, a menos que sean explícitamente diseñados para el acceso público (como el Login o el registro inicial).

- **Uso del Decorador `@Auth()`**:
  El decorador personalizado `@Auth()` (ubicado en `src/auth/decorators/auth.decorator.ts`) incluye internamente `AuthGuard()` de Passport y cualquier otro guard necesario para validar el JWT y los roles.
  
  Siempre debes aplicar `@Auth()` a nivel del controlador completo en lugar de ruta por ruta, para evitar olvidos accidentales:

  ```typescript
  import { Controller } from '@nestjs/common';
  import { Auth } from '../auth/decorators/auth.decorator';

  @Auth() // <-- OBLIGATORIO AQUÍ
  @Controller('entidad')
  export class EntidadController {
    // Todos los métodos de aquí abajo estarán automáticamente protegidos
  }
  ```

## 2. Prevención de SQL Injection (TypeORM)

El backend utiliza TypeORM para interactuar con la base de datos PostgreSQL. Para prevenir inyecciones SQL (SQL Injection), es estrictamente obligatorio delegar la sanitización de parámetros a TypeORM.

### A) Métodos Nativos de los Repositorios
Al utilizar métodos como `find`, `findOne`, `update`, o `delete`, TypeORM parametriza los valores automáticamente de forma segura. Estos son seguros por defecto.

```typescript
// ✅ SEGURO: TypeORM parametriza "id" y "estado" por debajo
this.repository.findOne({ where: { id: id, estado: estado } });
```

### B) Uso del `QueryBuilder`
Cuando necesites consultas más complejas (ej. reportes, conteos o joins manuales), usarás `createQueryBuilder`. Aquí es donde ocurren el 99% de las inyecciones SQL si no se tiene cuidado.

**Regla de Oro:** **NUNCA** concatenes variables dinámicas directamente dentro de los métodos `.where()`, `.andWhere()`, o `.orWhere()`.

🚫 **FORMA INSEGURA (SQL INJECTION):**
```typescript
// ❌ PROHIBIDO: Vulnerabilidad crítica
query.andWhere('orden.estado = ' + estadoIngresado);
query.andWhere(`orden.metodoPago = '${metodoPago}'`);
```

✅ **FORMA SEGURA (PARAMETRIZACIÓN):**
Siempre utiliza la sintaxis de **bind parameters** (`:nombreParametro` y un objeto literal con su valor):
```typescript
// ✅ CORRECTO: TypeORM se encarga de escapar el valor
query.andWhere('orden.estado = :estadoFiltro', { estadoFiltro: estado });
query.andWhere('orden.metodoPago = :metodo', { metodo: metodoPago });
```

### C) Consultas Crudas (Raw Queries)
- El uso de `.query()` o consultas SQL directas está **prohibido** a menos que sea estrictamente necesario para operaciones que TypeORM no soporte nativamente (ej. triggers o funciones espaciales complejas).
- Si te ves obligado a usarlas, debes pasar los parámetros en formato de arreglo `[$1, $2]` para que el motor SQL (Postgres) los trate como variables preparadas y no como texto plano de la consulta.

```typescript
// ❌ PROHIBIDO
await repository.query(`SELECT * FROM users WHERE name = '${name}'`);

// ✅ CORRECTO
await repository.query(`SELECT * FROM users WHERE name = $1`, [name]);
```

## 3. Validación de Entrada (Pipes & DTOs)

Ningún dato proveniente del exterior (Headers, Body, Query, o Params) debe tocar la base de datos o lógica de negocio sin haber sido validado.

- **DTOs y `class-validator`**: Todo Body o Query string complejo debe mapearse a un Data Transfer Object (DTO) que contenga decoradores de validación estricta (`@IsString()`, `@IsEnum()`, `@IsOptional()`).
- **Pipes Nativos**: Al extraer variables de ruta (Params), asegúrate de forzar su tipo utilizando los pipes nativos de NestJS (ej. `@Param('id', ParseIntPipe) id: number`), lo cual rechaza el request inmediatamente si el usuario envía texto en lugar de un número.
