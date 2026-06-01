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
