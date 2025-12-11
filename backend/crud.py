from sqlalchemy.orm import Session
from models import Tarea
from schemas import TareaCreate, TareaUpdate
from typing import List, Optional

def get_tarea(db: Session, tarea_id: int) -> Optional[Tarea]:
    """Obtener una tarea por ID"""
    return db.query(Tarea).filter(Tarea.id == tarea_id).first()

def get_tareas(db: Session, skip: int = 0, limit: int = 100) -> List[Tarea]:
    """Obtener lista de tareas"""
    return db.query(Tarea).offset(skip).limit(limit).all()

def create_tarea(db: Session, tarea: TareaCreate) -> Tarea:
    """Crear una nueva tarea"""
    db_tarea = Tarea(**tarea.model_dump())
    db.add(db_tarea)
    db.commit()
    db.refresh(db_tarea)
    return db_tarea

def update_tarea(db: Session, tarea_id: int, tarea: TareaUpdate) -> Optional[Tarea]:
    """Actualizar una tarea existente"""
    db_tarea = get_tarea(db, tarea_id)
    if db_tarea is None:
        return None
    
    update_data = tarea.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_tarea, key, value)
    
    db.commit()
    db.refresh(db_tarea)
    return db_tarea

def delete_tarea(db: Session, tarea_id: int) -> bool:
    """Eliminar una tarea"""
    db_tarea = get_tarea(db, tarea_id)
    if db_tarea is None:
        return False
    
    db.delete(db_tarea)
    db.commit()
    return True

def update_tarea_status(db: Session, tarea_id: int, new_status: str) -> Optional[Tarea]:
    """Actualizar solo el status de una tarea"""
    db_tarea = get_tarea(db, tarea_id)
    if db_tarea is None:
        return None
    
    db_tarea.status = new_status
    db.commit()
    db.refresh(db_tarea)
    return db_tarea