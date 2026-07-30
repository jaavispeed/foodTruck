---
name: Backend Master Skill
description: Delegador principal para el backend de FoodTruck. Instruye al agente a leer las reglas de seguridad y validación.
---

# 👑 FoodTruck Backend - Master Skill

Este es el skill principal del proyecto Backend (NestJS, TypeORM, PostgreSQL). 
Cuando trabajes en cualquier requerimiento del backend, **DEBES** considerar y aplicar de manera estricta los siguientes skills:

## 🛡️ Seguridad y Control de Acceso
- **`seguridad-auth-roles.md`**: Reglas sobre cómo proteger los controladores y endpoints utilizando los decoradores y guards personalizados del proyecto (ej: `@Auth()`) y manejo de JWT.

## 📥 Validación de Entrada (DTOs)
- **`seguridad-validacion-dtos.md`**: Estándares inquebrantables para usar DTOs con `class-validator` y `class-transformer` en todas las peticiones, asegurando la sanitización de los datos.

## 💾 Base de Datos y TypeORM
- **`seguridad-typeorm-sqli.md`**: Reglas críticas para usar TypeORM de manera segura. Define cómo y cuándo usar QueryBuilder, Repository Methods (`preload`, `save`), manejo estandarizado de excepciones (`handleDBExceptions`), y prevención estricta de SQL Injection.
