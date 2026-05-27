import { TaskCard } from './TaskCard';
import '../styles/home.css';

export const TaskGrid = ({ tasks, updateTaskStatus, deleteTask }) => {
  if (tasks.length === 0) {
    return <div className="task-grid-empty">No hay tareas que coincidan con los filtros.</div>;
  }

  return (
    <div className="task-grid">
      {tasks.map(task => (
        <TaskCard 
          key={task.id} 
          task={task} 
          onStatusChange={updateTaskStatus}
          onDelete={deleteTask}
        />
      ))}
    </div>
  );
};
