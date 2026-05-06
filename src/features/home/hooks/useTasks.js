import { useState, useMemo } from 'react';
import { MOCK_TASKS, MOCK_STATS } from '../data/mockTasks';

export const useTasks = () => {
  const [tasks, setTasks] = useState(MOCK_TASKS);
  const [statusFilter, setStatusFilter] = useState('Todas');
  const [priorityFilter, setPriorityFilter] = useState('Todas');

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchStatus = statusFilter === 'Todas' || task.status === statusFilter;
      const matchPriority = priorityFilter === 'Todas' || task.priority === priorityFilter;
      return matchStatus && matchPriority;
    });
  }, [tasks, statusFilter, priorityFilter]);

  const updateTaskStatus = (taskId, newStatus) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
  };

  const deleteTask = (taskId) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  return {
    tasks: filteredTasks,
    stats: MOCK_STATS,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    updateTaskStatus,
    deleteTask
  };
};
