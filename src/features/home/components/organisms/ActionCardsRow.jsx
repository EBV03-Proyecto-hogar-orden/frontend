import { Plus, UserPlus, Users, BarChart2 } from 'lucide-react';
import { ActionCard } from '../molecules/ActionCard';
import '../styles/home.css';

export const ActionCardsRow = ({ onOpenInvite, onNewTask, onOpenManageMembers }) => {
  return (
    <div className="action-cards-grid">
      <ActionCard 
        title="Nueva tarea" 
        icon={Plus} 
        colorVariant="yellow" 
        filled 
        onClick={onNewTask}
      />
      <ActionCard 
        title="Invitar miembro" 
        icon={UserPlus} 
        colorVariant="blue" 
        filled 
        onClick={onOpenInvite}
      />
      <ActionCard 
        title="Gestionar miembros" 
        icon={Users} 
        colorVariant="purple" 
        filled
        onClick={onOpenManageMembers}
      />
      <ActionCard 
        title="Estadísticas" 
        icon={BarChart2} 
        colorVariant="yellow" 
      />
    </div>
  );
};
