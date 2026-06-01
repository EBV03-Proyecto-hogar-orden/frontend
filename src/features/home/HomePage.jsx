import React, { useState } from 'react';
import { useTasks } from './hooks/useTasks';
import { HomeHeader } from './components/organisms/HomeHeader';
import { ActionCardsRow } from './components/organisms/ActionCardsRow';
import { FilterSection } from './components/organisms/FilterSection';
import { TaskGrid } from './components/organisms/TaskGrid';
import { CreateTaskModal } from './components/organisms/CreateTaskModal';
import { EditTaskModal } from './components/organisms/EditTaskModal';
import { JoinHomeGroupModal } from './components/organisms/JoinHomeGroupModal';
import { ManageMembersModal } from './components/organisms/ManageMembersModal';
import { Loader } from 'lucide-react';
import './components/styles/home.css';

const HomePage = () => {
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);
  const [isManageOpen, setIsManageOpen] = useState(false);
  const [isEditTaskOpen, setIsEditTaskOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isJoinHomeOpen, setIsJoinHomeOpen] = useState(false);
  
  const { 
    tasks, 
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
  } = useTasks();

  const [isStatsPanelVisible, setIsStatsPanelVisible] = useState(false);

  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsEditTaskOpen(true);
  };

  const handleOpenJoinHome = () => {
    setIsJoinHomeOpen(true);
  };

  return (
    <div className="home-layout">
      <HomeHeader 
        isInviteOpen={isInviteOpen} 
        setIsInviteOpen={setIsInviteOpen}
        onOpenJoinHome={handleOpenJoinHome}
        onOpenManage={() => setIsManageOpen(true)}
      />
      
      <main className="home-content">
        <ActionCardsRow 
          onOpenInvite={() => setIsInviteOpen(true)} 
          onNewTask={() => setIsNewTaskOpen(true)}
          onOpenManageMembers={() => setIsManageOpen(true)}
          onOpenStats={() => setIsStatsPanelVisible(prev => !prev)}
        />

        {isStatsPanelVisible && (
          <section className="stats-panel">
            <div className="stats-panel__header">
              <div>
                <h2>Resumen de estadísticas</h2>
                <p>Una vista rápida del estado actual del hogar y las tareas.</p>
              </div>
              <span className="stats-panel__badge">{stats.completionRate}% completado</span>
            </div>
            <div className="stats-panel__grid">
              <div className="stats-panel__card">
                <span className="stats-panel__value">{stats.total}</span>
                <span className="stats-panel__label">Tareas totales</span>
              </div>
              <div className="stats-panel__card">
                <span className="stats-panel__value">{stats.completed}</span>
                <span className="stats-panel__label">Completadas</span>
              </div>
              <div className="stats-panel__card">
                <span className="stats-panel__value">{stats.inProgress}</span>
                <span className="stats-panel__label">En progreso</span>
              </div>
              <div className="stats-panel__card">
                <span className="stats-panel__value">{stats.pending}</span>
                <span className="stats-panel__label">Pendientes</span>
              </div>
              <div className="stats-panel__card stats-panel__card--wide">
                <span className="stats-panel__value">{stats.members}</span>
                <span className="stats-panel__label">Miembros en el hogar</span>
              </div>
            </div>
          </section>
        )}

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
            onEditTask={handleEditTask}
          />
        )}
      </main>

      <CreateTaskModal 
        isOpen={isNewTaskOpen} 
        onClose={() => setIsNewTaskOpen(false)} 
        onTaskCreated={loadTasks} 
      />

      <EditTaskModal 
        isOpen={isEditTaskOpen} 
        onClose={() => setIsEditTaskOpen(false)} 
        task={editingTask}
        onTaskUpdated={loadTasks}
        onDelete={deleteTask}
      />

      <JoinHomeGroupModal 
        isOpen={isJoinHomeOpen} 
        onClose={() => setIsJoinHomeOpen(false)}
        onJoinSuccess={() => {}}
      />
      <ManageMembersModal
        isOpen={isManageOpen}
        onClose={() => setIsManageOpen(false)}
        onOpenInvite={() => setIsInviteOpen(true)}
      />
    </div>
  );
};

export default HomePage;
