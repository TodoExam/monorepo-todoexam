export interface Task {
  id: number;
  title: string;
  description: string;
  created_at: string;
  due_at: string;
  status: string;
}

export interface CreateTaskDto {
  title: string;
  description: string;
  due_at: string;
}

export interface UpdateTaskDto {
  status: string;
}

