import { Plus, UserPlus, CheckCircle, BarChart2 } from 'lucide-react';
import { ActionCard } from '../molecules/ActionCard';
import '../styles/home.css';

export const ActionCardsRow = ({ onOpenInvite }) => {
  return (
    <div className="action-cards-grid">
      <ActionCard 
        title="Nueva tarea" 
        icon={Plus} 
        colorVariant="yellow" 
        filled 
      />
      <ActionCard 
        title="Invitar miembro" 
        icon={UserPlus} 
        colorVariant="blue" 
        filled 
        onClick={onOpenInvite}
      />
      <ActionCard 
        title="Completadas" 
        icon={CheckCircle} 
        colorVariant="blue" 
      />
      <ActionCard 
        title="Estadísticas" 
        icon={BarChart2} 
        colorVariant="yellow" 
      />
    </div>
  );
};
