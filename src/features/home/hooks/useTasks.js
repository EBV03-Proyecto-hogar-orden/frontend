import { useState, useEffect, useCallback, useMemo } from 'react';
import { taskService } from '../services/taskService';
import { useAuth } from '../../auth/hooks/AuthContext';

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todas');
  const [priorityFilter, setPriorityFilter] = useState('Todas');
  const { homeGroup } = useAuth();

  const mapPriorityBackToFront = (p) => {
    const map = { ALTA: 'Alta', MEDIA: 'Media', BAJA: 'Baja' };
    return map[p] || 'Media';
  };

  const mapStatusBackToFront = (s) => {
    const map = { PENDIENTE: 'Pendiente', PROGRESO: 'En progreso', COMPLETADA: 'Completada' };
    return map[s] || 'Pendiente';
  };

  const mapStatusFrontToBack = (s) => {
    const map = { 'Pendiente': 'PENDIENTE', 'En progreso': 'PROGRESO', 'Completada': 'COMPLETADA' };
    return map[s] || 'PENDIENTE';
  };

  const mapTaskFromApi = (task) => ({
    id: task.id,
    title: task.name,
    description: task.description,
    date: task.due_date ? new Date(task.due_date + 'T00:00:00').toLocaleDateString() : 'Sin fecha',
    rawDueDate: task.due_date,
    assignee: task.user_assigned ? {
      id: task.user_assigned.id,
      name: task.user_assigned.full_name,
      username: task.user_assigned.username,
      email: task.user_assigned.email,
      avatarId: task.user_assigned.full_name.substring(0, 2).toUpperCase()
    } : { name: 'Sin asignar', avatarId: 'SA' },
    status: mapStatusBackToFront(task.status),
    priority: mapPriorityBackToFront(task.priority),
    comments: 0
  });

  const loadTasks = useCallback(async () => {
    if (!homeGroup) {
      setTasks([]);
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const apiTasks = await taskService.getTasks();
      const mapped = apiTasks.map(mapTaskFromApi);
      setTasks(mapped);
    } catch (e) {
      console.error('Error fetching tasks:', e);
      setError('No se pudieron cargar las tareas.');
    } finally {
      setIsLoading(false);
    }
  }, [homeGroup]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchStatus = statusFilter === 'Todas' || task.status === statusFilter;
      const matchPriority = priorityFilter === 'Todas' || task.priority === priorityFilter;
      return matchStatus && matchPriority;
    });
  }, [tasks, statusFilter, priorityFilter]);

  const updateTaskStatus = async (taskId, newStatus) => {
    const backendStatus = mapStatusFrontToBack(newStatus);
    try {
      await taskService.updateTaskStatus(taskId, backendStatus);
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    } catch (e) {
      console.error('Error updating task status:', e);
      alert('No se pudo actualizar el estado de la tarea.');
    }
  };

  const deleteTask = async (taskId) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
      return;
    }
    try {
      await taskService.deleteTask(taskId);
      setTasks(prev => prev.filter(t => t.id !== taskId));
    } catch (e) {
      console.error('Error deleting task:', e);
      alert(e.response?.data?.detail || 'No se pudo eliminar la tarea.');
    }
  };

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'Completada').length;
    const pending = tasks.filter(t => t.status === 'Pendiente').length;
    const inProgress = tasks.filter(t => t.status === 'En progreso').length;
    const completionRate = total ? Math.round((completed / total) * 100) : 0;

    return {
      total,
      completed,
      pending,
      inProgress,
      completionRate,
      members: homeGroup?.members?.length || 1
    };
  }, [tasks, homeGroup]);

  return {
    tasks: filteredTasks,
    stats,
    isLoading,
    error,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    updateTaskStatus,
    deleteTask,
    loadTasks
  };
};
