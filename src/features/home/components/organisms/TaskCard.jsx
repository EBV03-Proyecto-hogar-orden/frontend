import React from 'react';
import { Calendar, User, MessageSquare, Trash2, Edit2 } from 'lucide-react';
import { Badge } from '../atoms/Badge';
import '../styles/home.css';

export const TaskCard = ({ task, onStatusChange, onDelete }) => {
  return (
    <div className="task-card">
      <div className="task-card__header">
        <Badge type="priority" value={task.priority} />
        <Badge type="status" value={task.status} />
      </div>
      
      <div className="task-card__content">
        <h3 className="task-card__title">{task.title}</h3>
        <p className="task-card__desc">{task.description}</p>
        
        <div className="task-card__meta">
          <div className="meta-item">
            <Calendar size={14} />
            <span>{task.date}</span>
          </div>
          <div className="meta-item">
            <User size={14} />
            <span>{task.assignee.name || task.assignee.avatarId}</span>
          </div>
        </div>
      </div>
      
      <div className="task-card__footer">
        <div className="status-selector">
          <label>Cambiar estado:</label>
          <select 
            value={task.status} 
            onChange={(e) => onStatusChange(task.id, e.target.value)}
            className="status-select"
          >
            <option value="Pendiente">Pendiente</option>
            <option value="En progreso">En progreso</option>
            <option value="Completada">Completada</option>
          </select>
        </div>
        
        <div className="task-card__actions">
          <button className="btn-action btn-action--edit">
            <Edit2 size={14} /> Editar
          </button>
          <button className="btn-icon btn-icon--yellow">
            <MessageSquare size={14} />
            {task.comments > 0 && <span className="btn-icon__badge">{task.comments}</span>}
          </button>
          <button className="btn-icon btn-icon--red" onClick={() => onDelete(task.id)}>
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
