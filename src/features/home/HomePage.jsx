import React, { useState } from 'react';
import { useTasks } from './hooks/useTasks';
import { HomeHeader } from './components/organisms/HomeHeader';
import { ActionCardsRow } from './components/organisms/ActionCardsRow';
import { FilterSection } from './components/organisms/FilterSection';
import { TaskGrid } from './components/organisms/TaskGrid';
import { CreateTaskModal } from './components/organisms/CreateTaskModal';
import { Loader } from 'lucide-react';
import './components/styles/home.css';

const HomePage = () => {
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);
  const { 
    tasks, 
    isLoading,
    error,
    statusFilter, 
    setStatusFilter, 
    priorityFilter, 
    setPriorityFilter,
    updateTaskStatus,
    deleteTask,
    loadTasks
  } = useTasks();

  return (
    <div className="home-layout">
      <HomeHeader isInviteOpen={isInviteOpen} setIsInviteOpen={setIsInviteOpen} />
      
      <main className="home-content">
        <ActionCardsRow 
          onOpenInvite={() => setIsInviteOpen(true)} 
          onNewTask={() => setIsNewTaskOpen(true)} 
        />
        
        <FilterSection 
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          priorityFilter={priorityFilter}
          setPriorityFilter={setPriorityFilter}
        />
        
        {error && <div className="members-notification error-banner" style={{ marginBottom: '24px' }}>{error}</div>}

        {isLoading ? (
          <div className="members-loading-container" style={{ background: 'white', borderRadius: 'var(--border-radius-lg)', padding: '60px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
            <Loader className="spinner" size={32} />
            <span>Cargando tareas del hogar...</span>
          </div>
        ) : (
          <TaskGrid 
            tasks={tasks}
            updateTaskStatus={updateTaskStatus}
            deleteTask={deleteTask}
          />
        )}
      </main>

      <CreateTaskModal 
        isOpen={isNewTaskOpen} 
        onClose={() => setIsNewTaskOpen(false)} 
        onTaskCreated={loadTasks} 
      />
    </div>
  );
};

export default HomePage;
