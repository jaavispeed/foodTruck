---
name: "seguridad-validacion-dtos"
description: "Directrices obligatorias para la sanitización y validación de datos de entrada usando class-validator y DTOs en NestJS."
---

# Skill: Seguridad - Validación de Entradas (DTOs)

Nunca confíes en los datos (payloads) que provienen del cliente (Frontend, Postman, etc). La validación estricta previene el ingreso de basura a la base de datos, ataques de denegación por payloads masivos, e intentos de escalar privilegios por Asignación Masiva (Mass Assignment).

## 1. DTOs Obligatorios para Mutaciones
Cualquier petición `POST`, `PUT` o `PATCH` debe tiparse y validarse mediante un Data Transfer Object (DTO).
- No uses `any` o interfaces simples sin decoradores en los controladores.
- Usa siempre decoradores de `class-validator`.

```typescript
// ✅ CORRECTO
export class CreateProductoDto {
  @IsString()
  @MinLength(3)
  nombre: string;

  @IsNumber()
  @IsPositive()
  precio: number;
}
```

## 2. Bloqueo de Asignación Masiva (Whitelist)
El `ValidationPipe` global de NestJS **debe** estar configurado con `whitelist: true` y `forbidNonWhitelisted: true`.
- Esto garantiza que si un atacante envía `{ "nombre": "Pan", "esAdmin": true }`, el campo `esAdmin` será limpiado automáticamente o la petición será rechazada (error 400), impidiendo que se inyecten columnas no permitidas en la base de datos.

## 3. Tipado Estricto en Parámetros de Ruta (Pipes)
Los parámetros leídos desde la URL (`@Param()`) son strings por defecto. Jamás los pases directo a la base de datos sin transformar su tipo de forma nativa.
- Usa los pipes de validación integrados: `ParseIntPipe`, `ParseUUIDPipe`, etc.

```typescript
// ❌ INSEGURO (El backend podría fallar o ejecutar una búsqueda con NaN)
@Get(':id')
findOne(@Param('id') id: number) { ... }

// ✅ SEGURO (Devuelve un 400 Bad Request automático si no es un número)
@Get(':id')
findOne(@Param('id', ParseIntPipe) id: number) { ... }
```
