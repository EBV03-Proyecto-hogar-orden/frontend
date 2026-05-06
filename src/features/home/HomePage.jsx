import React from 'react';
import { useTasks } from './hooks/useTasks';
import { HomeHeader } from './components/organisms/HomeHeader';
import { ActionCardsRow } from './components/organisms/ActionCardsRow';
import { FilterSection } from './components/organisms/FilterSection';
import { TaskGrid } from './components/organisms/TaskGrid';
import './components/styles/home.css';

const HomePage = () => {
  const { 
    tasks, 
    statusFilter, 
    setStatusFilter, 
    priorityFilter, 
    setPriorityFilter,
    updateTaskStatus,
    deleteTask
  } = useTasks();

  return (
    <div className="home-layout">
      <HomeHeader />
      
      <main className="home-content">
        <ActionCardsRow />
        
        <FilterSection 
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          priorityFilter={priorityFilter}
          setPriorityFilter={setPriorityFilter}
        />
        
        <TaskGrid 
          tasks={tasks}
          updateTaskStatus={updateTaskStatus}
          deleteTask={deleteTask}
        />
      </main>
    </div>
  );
};

export default HomePage;
