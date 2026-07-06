# FreeloTrack — Freelance Project Manager

## Overview
SaaS personal para un freelancer programador que necesita organizar proyectos, clientes, contratos y métricas. Un solo usuario (Tomas). App enfocada, sin bloat.

## Tech Stack
- Next.js 14+ (App Router, Server Components)
- TailwindCSS v4
- shadcn/ui + Radix
- PostgreSQL (Docker local, Neon prod)
- Prisma ORM
- Auth.js (NextAuth v5 beta)
- Claude Code Haiku para generación de contratos

## Schema (Prisma)

### User
- id, name, email, hashedPassword, image, createdAt

### Client
- id, name, email, phone, company, notes, createdAt, updatedAt

### Project
- id, name, description, status (ACTIVE|COMPLETED|PAUSED|CANCELLED), budget (Float), currency (String, default "USD"), deadline (DateTime), clientId, createdAt, updatedAt
- Relations: belongsTo Client, hasMany Task, hasMany Contract

### Task
- id, title, description, dueDate (DateTime?), completed (Boolean, default false), projectId, createdAt
- Relations: belongsTo Project

### ContractTemplate
- id, name, description (String?), content (String — markdown/text del contrato base), createdAt, updatedAt

### Contract
- id, name, clientId, projectId, templateId, content (String — texto generado con variables reemplazadas), value (Float), currency (String, default "USD"), status (DRAFT|SIGNED|COMPLETED|CANCELLED), signedAt (DateTime?), fileUrl (String? — PDF subido), createdAt, updatedAt
- Relations: belongsTo Client, belongsTo Project, belongsTo ContractTemplate (optional)

### Payment
- id, contractId, amount (Float), currency (String, default "USD"), status (PENDING|PAID|OVERDUE|CANCELLED), dueDate (DateTime), paidAt (DateTime?), notes (String?), createdAt

## Pages / Routes

### `/` — Dashboard
- Cards: Proyectos activos, Deadlines próximos (7 días), Ingresos del mes, Pagos pendientes
- Lista de próximos deadlines (próximos 5 vencimientos)
- Últimos contratos generados

### `/projects` — Lista de proyectos
- Tabla con nombre, cliente, estado, deadline, presupuesto
- Filtros por estado
- Botón "Nuevo proyecto"
- Click → `/projects/[id]`

### `/projects/[id]` — Detalle del proyecto
- Info del proyecto, editar, cambiar estado
- Tareas del proyecto (crear, completar, eliminar)
- Contratos asociados
- Métricas del proyecto (presupuesto vs gastado, progreso)

### `/clients` — Lista de clientes
- Tabla con nombre, email, empresa
- Botón "Nuevo cliente"
- Click → `/clients/[id]`

### `/clients/[id]` — Detalle del cliente
- Info del cliente, editar
- Proyectos asociados
- Contratos asociados
- Métricas: total facturado, proyectos completados

### `/contracts` — Lista de contratos
- Tabla con nombre, cliente, proyecto, valor, estado
- Botón "Nuevo contrato" → wizard de generación
- Filtros

### `/contracts/new` — Wizard de generación de contrato IA
**Paso 1:** Seleccionar plantilla base (o subir una nueva)
**Paso 2:** Seleccionar cliente (o crear nuevo)
**Paso 3:** Seleccionar proyecto (o crear nuevo)
**Paso 4:** Formulario con campos variables:
  - Alcance del proyecto (textarea libre)
  - Precio / moneda
  - Método de pago
  - Fechas (inicio, entrega)
  - Entregables específicos
**Paso 5:** La IA genera el contrato uniendo la plantilla + datos
**Paso 6:** Previsualización y descarga como PDF (html→pdf)
**Paso 7:** Guardar contrato en el proyecto

### `/contracts/[id]` — Detalle / vista del contrato
- Contenido renderizado, descargar PDF, cambiar estado

### `/templates` — Gestión de plantillas de contrato
- Lista de plantillas
- Subir nueva (texto plano o extraído de PDF)
- Editar plantilla (editor de texto)
- Previsualizar

### `/metrics` — Métricas globales
- Ingresos por mes (gráfico de barras simple)
- Ingresos por cliente
- Proyectos por estado (donut/pie chart)
- Pagos pendientes vs cobrados
- Rentabilidad estimada

### `/settings` — Configuración
- Moneda predeterminada (ARS/USD/EUR)
- Perfil de usuario (cambiar email, contraseña)
- Pelado técnico: conexión a Neon, etc.

## AI Contract Generation Flow

1. User uploads a contract template (text/markdown) → stored as ContractTemplate
2. When creating a new Contract, user selects template, client, project
3. Form collects variable data: scope, price, payment method, start date, delivery date, specific deliverables
4. Server Action calls Claude Code Haiku via CLI:
   ```
   claude -p "Generate a contract based on this template: [TEMPLATE]
   With these details:
   - Client: [NAME]
   - Project: [NAME]
   - Scope: [SCOPE]
   - Price: $[AMOUNT]
   - Payment method: [METHOD]
   - Start: [DATE], Delivery: [DATE]
   - Deliverables: [LIST]
   
   Keep the SAME sections and legal language from the template.
   Only replace the variable parts with the new data.
   Output the full contract text in markdown."
   --model haiku --max-turns 3
   ```
5. Result is saved as Contract.content, can be converted to PDF

## UI / Design
- Sidebar navigation (responsive, collapses on mobile)
- Color palette: profesional oscuro (slate/gray based) con acentos en azul
- Modo oscuro por defecto
- Tipografía: Inter (default de shadcn)
- Layout: Sidebar + Main content area

## Auth
- Email + contraseña (Auth.js v5 Credentials provider)
- Un solo usuario (Tomas) — el sistema crea el user en seed
- Protegido: todas las rutas excepto /login requieren auth

## Milestones de construcción
1. Setup: Prisma schema + seed + docker-compose
2. Auth: Login page + middleware + session
3. Layout: Sidebar + header + responsive shell
4. Clients: CRUD completo
5. Projects: CRUD + tasks
6. Templates: Upload + edit
7. Contracts: CRUD + wizard + IA generation
8. Dashboard + Metrics
9. PDF generation for contracts
10. Deploy (Vercel + Neon)
