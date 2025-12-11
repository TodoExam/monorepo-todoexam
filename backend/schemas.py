from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from models import TaskStatus

class TareaBase(BaseModel):
    title: str
    description: Optional[str] = None
    due_at: Optional[datetime] = None
    status: Optional[TaskStatus] = TaskStatus.PENDING

class TareaCreate(TareaBase):
    pass

class TareaUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    due_at: Optional[datetime] = None
    status: Optional[TaskStatus] = None

class TareaResponse(TareaBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class StatusUpdate(BaseModel):
    status: TaskStatus
