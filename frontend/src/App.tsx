import { useState, useEffect } from 'react';
import { fetchTasks, createTask, updateTask } from './api';
import type { Task, CreateTaskDto } from './types';
import './App.css';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateTaskDto>({
    title: '',
    description: '',
    due_at: '',
  });

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchTasks();
      setTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError('El título es requerido');
      return;
    }

    try {
      setError(null);
      // Solo incluir due_at si tiene valor
      const taskData: CreateTaskDto = {
        title: formData.title,
        description: formData.description,
      };
      if (formData.due_at) {
        taskData.due_at = formData.due_at;
      }
      await createTask(taskData);
      setFormData({ title: '', description: '', due_at: '' });
      await loadTasks();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear la tarea');
    }
  };

  const handleStatusChange = async (task: Task, newStatus: 'pending' | 'in_progress' | 'completed') => {
    try {
      setError(null);
      await updateTask(task.id, { status: newStatus });
      await loadTasks();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar la tarea');
    }
  };

  const getNextStatus = (currentStatus: string): 'pending' | 'in_progress' | 'completed' => {
    switch (currentStatus) {
      case 'pending':
        return 'in_progress';
      case 'in_progress':
        return 'completed';
      case 'completed':
        return 'pending';
      default:
        return 'pending';
    }
  };

  const getStatusLabel = (status: string): string => {
    switch (status) {
      case 'pending':
        return 'Pendiente';
      case 'in_progress':
        return 'En Progreso';
      case 'completed':
        return 'Completada';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Sin fecha';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>📝 Todo App</h1>
        <p>Gestiona tus tareas de manera sencilla</p>
      </header>

      <main className="app-main">
        <section className="task-form-section">
          <h2>Nueva Tarea</h2>
          <form onSubmit={handleSubmit} className="task-form">
            <div className="form-group">
              <label htmlFor="title">Título *</label>
              <input
                id="title"
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ej: Comprar víveres"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Descripción</label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Detalles de la tarea..."
                rows={3}
              />
            </div>

            <div className="form-group">
              <label htmlFor="due_at">Fecha de vencimiento</label>
              <input
                id="due_at"
                type="datetime-local"
                value={formData.due_at}
                onChange={(e) => setFormData({ ...formData, due_at: e.target.value })}
              />
            </div>

            <button type="submit" className="btn-primary">
              Crear Tarea
            </button>
          </form>
        </section>

        <section className="tasks-section">
          <div className="tasks-header">
            <h2>Tareas ({tasks.length})</h2>
            <button onClick={loadTasks} className="btn-refresh" disabled={loading}>
              🔄 Actualizar
            </button>
          </div>

          {error && <div className="error-message">{error}</div>}

          {loading ? (
            <div className="loading">Cargando tareas...</div>
          ) : tasks.length === 0 ? (
            <div className="empty-state">No hay tareas. ¡Crea una nueva!</div>
          ) : (
            <div className="tasks-list">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={`task-card ${task.status === 'completed' ? 'completed' : ''}`}
                >
                  <div className="task-header">
                    <h3>{task.title}</h3>
                    <button
                      onClick={() => handleStatusChange(task, getNextStatus(task.status))}
                      className={`status-toggle ${task.status}`}
                      title={`Cambiar estado: ${getStatusLabel(getNextStatus(task.status))}`}
                    >
                      {task.status === 'completed' ? '✓' : task.status === 'in_progress' ? '◐' : '○'}
                    </button>
                  </div>

                  {task.description && (
                    <p className="task-description">{task.description}</p>
                  )}

                  <div className="task-meta">
                    <div className="task-date">
                      <strong>Creada:</strong> {formatDate(task.created_at)}
                    </div>
                    {task.due_at && (
                      <div className="task-date">
                        <strong>Vence:</strong> {formatDate(task.due_at)}
                      </div>
                    )}
                    <div className="task-status-badge">
                      <span className={`badge ${task.status}`}>
                        {getStatusLabel(task.status)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
