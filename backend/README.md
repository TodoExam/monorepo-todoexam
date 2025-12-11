# TO-DO List API - Backend

Aplicación backend sencilla desarrollada con FastAPI para gestionar una lista de tareas (TO-DO List) con operaciones CRUD sobre una base de datos PostgreSQL.

## Características

- ✅ API REST con FastAPI
- ✅ Operaciones CRUD completas (Create, Read, Update, Delete)
- ✅ Base de datos PostgreSQL
- ✅ ORM SQLAlchemy
- ✅ Validación de datos con Pydantic
- ✅ Documentación automática con Swagger UI
- ✅ Despliegue con Docker y Docker Compose

## Estructura de la Base de Datos

### Tabla: `tareas`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | Integer | Clave primaria (auto-incremental) |
| title | String | Título de la tarea (obligatorio) |
| description | String | Descripción de la tarea (opcional) |
| created_at | DateTime | Fecha de creación (automática) |
| due_at | DateTime | Fecha de vencimiento (opcional) |
| status | Enum | Estado: pending, in_progress, completed |

## Requisitos Previos

### Para despliegue con Docker (Recomendado):
- Docker
- Docker Compose

### Para desarrollo local:
- Python 3.8 o superior
- PostgreSQL instalado y ejecutándose

## Instalación y Despliegue

### Opción 1: Despliegue con Docker (Recomendado)

1. **Clonar el repositorio o navegar a la carpeta backend**

```bash
cd backend
```

2. **Iniciar la aplicación con Docker Compose**

```bash
docker-compose up --build
```

Esto iniciará automáticamente:
- Un contenedor con PostgreSQL
- Un contenedor con la aplicación FastAPI

El servidor estará disponible en: `http://localhost:8010`

**Comandos útiles de Docker:**

```bash
# Detener los contenedores
docker-compose down

# Detener y eliminar volúmenes (borra la base de datos)
docker-compose down -v

# Ver logs de los contenedores
docker-compose logs -f

# Reconstruir las imágenes
docker-compose build --no-cache
```

### Opción 2: Instalación Local (Desarrollo)

1. **Navegar a la carpeta backend**

```bash
cd backend
```

2. **Crear un entorno virtual**

```bash
python -m venv venv
source venv/bin/activate  # En Linux/Mac
# venv\Scripts\activate  # En Windows
```

3. **Instalar dependencias**

```bash
pip install -r requirements.txt
```

4. **Configurar la base de datos**

Crear una base de datos PostgreSQL:

```sql
CREATE DATABASE todo_db;
```

5. **Configurar variables de entorno (opcional)**

Copiar el archivo de ejemplo y editarlo:

```bash
cp .env.example .env
```

Editar `.env` con tus credenciales:

```
DATABASE_URL=postgresql://tu_usuario:tu_contraseña@localhost:5432/todo_db
```

6. **Iniciar el servidor**

```bash
uvicorn main:app --reload --port 8010
```

El servidor estará disponible en: `http://localhost:8010`

### Documentación Interactiva

Una vez que el servidor esté en funcionamiento:

- **Swagger UI**: http://localhost:8010/docs
- **ReDoc**: http://localhost:8010/redoc

## Endpoints de la API

### 1. Crear una tarea
```http
POST /tareas/
Content-Type: application/json

{
  "title": "Completar proyecto",
  "description": "Terminar el backend de la aplicación TO-DO",
  "due_at": "2025-12-15T18:00:00",
  "status": "pending"
}
```

### 2. Obtener todas las tareas
```http
GET /tareas/
```

Parámetros opcionales:
- `skip`: número de registros a saltar (default: 0)
- `limit`: número máximo de registros (default: 100)

### 3. Obtener una tarea específica
```http
GET /tareas/{tarea_id}
```

### 4. Actualizar una tarea
```http
PUT /tareas/{tarea_id}
Content-Type: application/json

{
  "title": "Título actualizado",
  "status": "completed"
}
```

### 5. Eliminar una tarea
```http
DELETE /tareas/{tarea_id}
```

## Estados de las Tareas

- `pending`: Tarea pendiente
- `in_progress`: Tarea en progreso
- `completed`: Tarea completada

## Estructura del Proyecto

```
backend/
├── main.py              # Aplicación principal FastAPI
├── database.py          # Configuración de la base de datos
├── models.py            # Modelos SQLAlchemy
├── schemas.py           # Esquemas Pydantic
├── crud.py              # Operaciones CRUD
├── requirements.txt     # Dependencias del proyecto
├── Dockerfile           # Configuración de Docker
├── docker-compose.yml   # Orquestación de contenedores
├── .dockerignore        # Archivos a ignorar en Docker
├── .env.example         # Ejemplo de variables de entorno
├── .gitignore           # Archivos a ignorar en Git
└── README.md            # Este archivo
```

## Ejemplo de Uso con curl

```bash
# Crear una tarea
curl -X POST "http://localhost:8010/tareas/" \
  -H "Content-Type: application/json" \
  -d '{"title": "Mi primera tarea", "description": "Descripción de la tarea", "status": "pending"}'

# Obtener todas las tareas
curl -X GET "http://localhost:8010/tareas/"

# Obtener una tarea específica
curl -X GET "http://localhost:8010/tareas/1"

# Actualizar una tarea
curl -X PUT "http://localhost:8010/tareas/1" \
  -H "Content-Type: application/json" \
  -d '{"status": "completed"}'

# Eliminar una tarea
curl -X DELETE "http://localhost:8010/tareas/1"
```

## Configuración de Docker

### Dockerfile

El Dockerfile crea una imagen con:
- Python 3.11 slim
- Dependencias necesarias para PostgreSQL
- Todas las dependencias de Python
- Código de la aplicación
- Puerto expuesto: 8010

### docker-compose.yml

El archivo de compose orquesta:
- **Servicio db**: PostgreSQL 15 en el puerto 5432
- **Servicio backend**: Aplicación FastAPI en el puerto 8010
- Health checks para asegurar que PostgreSQL esté listo antes de iniciar el backend
- Volumen persistente para los datos de PostgreSQL

## Tecnologías Utilizadas

- **FastAPI**: Framework web moderno y rápido
- **SQLAlchemy**: ORM para Python
- **PostgreSQL**: Base de datos relacional
- **Pydantic**: Validación de datos
- **Uvicorn**: Servidor ASGI
- **Docker**: Contenedorización
- **Docker Compose**: Orquestación de contenedores

## Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.
