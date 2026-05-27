import { FilterPill } from '../atoms/FilterPill';
import '../styles/home.css';

export const FilterSection = ({ statusFilter, setStatusFilter, priorityFilter, setPriorityFilter }) => {
  const statuses = ['Todas', 'Pendiente', 'En progreso', 'Completada'];
  const priorities = ['Todas', 'Alta', 'Media', 'Baja'];

  return (
    <div className="filter-section">
      <h2 className="section-title">Tareas pendientes y en progreso</h2>
      
      <div className="filter-row">
        <div className="filter-group">
          <span className="filter-label">Estado:</span>
          <div className="filter-pills">
            {statuses.map(status => (
              <FilterPill 
                key={status} 
                label={status} 
                isActive={statusFilter === status} 
                onClick={() => setStatusFilter(status)}
                colorVariant="blue"
              />
            ))}
          </div>
        </div>

        <div className="filter-group">
          <span className="filter-label">Prioridad:</span>
          <div className="filter-pills">
            {priorities.map(priority => (
              <FilterPill 
                key={priority} 
                label={priority} 
                isActive={priorityFilter === priority} 
                onClick={() => setPriorityFilter(priority)}
                colorVariant="yellow"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
