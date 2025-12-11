# Todo App - Monorepo

Sistema de gestión de tareas con frontend en React y backend en FastAPI. Todo corre en Docker para facilitar el despliegue.

## Requisitos

Necesitas tener instalado Docker y Docker Compose. Si no los tienes, puedes instalarlos desde [docker.com](https://www.docker.com/get-started).

## Levantar el sistema

Para levantar todos los servicios (base de datos, backend y frontend) simplemente ejecuta:

```bash
docker-compose up --build
```

La primera vez puede tardar un poco porque descarga las imágenes y construye los contenedores. Si quieres que corra en segundo plano, usa la bandera `-d`:

```bash
docker-compose up --build -d
```

Para detener todo:

```bash
docker-compose down
```

Si también quieres eliminar los volúmenes (y por tanto los datos de la base de datos):

```bash
docker-compose down -v
```

## Servicios

Una vez levantado, tendrás tres servicios corriendo:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8010
- **Base de datos PostgreSQL**: localhost:5439

El frontend se comunica con el backend automáticamente. Si necesitas cambiar la URL del backend, puedes crear un archivo `.env` en la raíz del proyecto con:

```
VITE_BASE_URL=http://localhost:8010
```

## Endpoints de la API

El backend expone una API REST en el puerto 8010. Todos los endpoints devuelven JSON.

### Obtener todas las tareas

```
GET /all
```

Devuelve un array con todas las tareas almacenadas.

**Ejemplo de respuesta:**

```json
[
  {
    "id": 1,
    "title": "Comprar víveres",
    "description": "Leche, pan y huevos",
    "created_at": "2024-01-15T10:30:00Z",
    "due_at": "2024-01-20T18:00:00Z",
    "status": "pending"
  }
]
```

### Crear una nueva tarea

```
POST /create
```

Crea una nueva tarea. El campo `title` es obligatorio, los demás son opcionales.

**Cuerpo de la petición:**

```json
{
  "title": "Revisar código",
  "description": "Revisar los cambios del PR",
  "due_at": "2024-01-25T17:00:00Z",
  "status": "pending"
}
```

Los campos opcionales son:
- `description`: texto descriptivo de la tarea
- `due_at`: fecha y hora de vencimiento en formato ISO 8601
- `status`: puede ser `pending`, `in_progress` o `completed`. Por defecto es `pending`

**Ejemplo de respuesta:**

```json
{
  "id": 2,
  "title": "Revisar código",
  "description": "Revisar los cambios del PR",
  "created_at": "2024-01-15T11:00:00Z",
  "due_at": "2024-01-25T17:00:00Z",
  "status": "pending"
}
```

### Actualizar el estado de una tarea

```
PATCH /{id}/check
```

Actualiza el estado de una tarea existente. El `id` va en la URL.

**Cuerpo de la petición:**

```json
{
  "status": "in_progress"
}
```

El campo `status` puede ser uno de estos valores:
- `pending`
- `in_progress`
- `completed`

**Ejemplo de respuesta:**

```json
{
  "id": 2,
  "title": "Revisar código",
  "description": "Revisar los cambios del PR",
  "created_at": "2024-01-15T11:00:00Z",
  "due_at": "2024-01-25T17:00:00Z",
  "status": "in_progress"
}
```

Si la tarea no existe, devuelve un error 404.

## Estructura del proyecto

```
monorepo-todoexam/
├── backend/          # API FastAPI
├── frontend/         # Aplicación React
├── database/         # Scripts de base de datos (si los hay)
└── docker-compose.yml
```

## Desarrollo local

Si prefieres desarrollar sin Docker, puedes levantar cada servicio por separado:

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8010
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Asegúrate de tener PostgreSQL corriendo y configurar la variable de entorno `DATABASE_URL` en el backend.

## Notas

El backend tiene CORS configurado para aceptar peticiones desde cualquier origen. La base de datos usa un volumen de Docker para persistir los datos, así que aunque detengas los contenedores, los datos se mantienen.
