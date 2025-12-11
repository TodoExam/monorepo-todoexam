export type TaskStatus = 'pending' | 'in_progress' | 'completed';

export interface Task {
  id: number;
  title: string;
  description: string;
  created_at: string;
  due_at: string | null;
  status: TaskStatus;
}

export interface CreateTaskDto {
  title: string;
  description: string;
  due_at?: string;
}

export interface UpdateTaskDto {
  status: TaskStatus;
}

