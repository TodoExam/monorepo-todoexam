from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import crud
import models
import schemas
from database import engine, get_db

# Crear las tablas en la base de datos
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="TO-DO List API",
    description="API REST para gestionar tareas con operaciones CRUD",
    version="1.0.0"
)

# Configurar CORS para aceptar todo
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permitir todos los orígenes
    allow_credentials=True,
    allow_methods=["*"],  # Permitir todos los métodos
    allow_headers=["*"],  # Permitir todos los headers
)

@app.get("/")
def read_root():
    return {"message": "Bienvenido a TO-DO List API"}

@app.post("/create", response_model=schemas.TareaResponse, status_code=201)
def create_tarea(tarea: schemas.TareaCreate, db: Session = Depends(get_db)):
    """Crear una nueva tarea"""
    return crud.create_tarea(db=db, tarea=tarea)

@app.get("/all", response_model=List[schemas.TareaResponse])
def read_all_tareas(db: Session = Depends(get_db)):
    """Obtener todas las tareas"""
    tareas = crud.get_tareas(db, skip=0, limit=1000)
    return tareas

@app.patch("/{id}/check", response_model=schemas.TareaResponse)
def check_tarea(id: int, status_update: schemas.StatusUpdate, db: Session = Depends(get_db)):
    """Actualizar el status de una tarea"""
    db_tarea = crud.update_tarea_status(db, tarea_id=id, new_status=status_update.status)
    if db_tarea is None:
        raise HTTPException(status_code=404, detail="Tarea no encontrada")
    return db_tarea
