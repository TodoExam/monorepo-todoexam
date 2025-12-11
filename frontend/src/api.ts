import type { Task, CreateTaskDto, UpdateTaskDto } from './types';

const API_BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:8000';

export const fetchTasks = async (): Promise<Task[]> => {
  const response = await fetch(`${API_BASE_URL}/tasks`);
  if (!response.ok) {
    throw new Error('Error al obtener las tareas');
  }
  return response.json();
};

export const createTask = async (task: CreateTaskDto): Promise<Task> => {
  const response = await fetch(`${API_BASE_URL}/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(task),
  });
  if (!response.ok) {
    throw new Error('Error al crear la tarea');
  }
  return response.json();
};

export const updateTask = async (id: number, task: UpdateTaskDto): Promise<Task> => {
  const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(task),
  });
  if (!response.ok) {
    throw new Error('Error al actualizar la tarea');
  }
  return response.json();
};

