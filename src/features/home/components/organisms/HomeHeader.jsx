import React from 'react';
import { UserPlus, ChevronDown } from 'lucide-react';
import { useAuth } from '../../../auth/hooks/AuthContext';
import '../styles/home.css';

export const HomeHeader = () => {
  const { user } = useAuth();
  const userName = user?.username || user?.email?.split('@')[0] || 'Usuario';
  // Use '22' as fallback avatar ID to match design
  const avatarId = user?.avatarId || '22';

  return (
    <header className="home-header">
      <h1 className="home-header__title">Hogar de {userName}</h1>
      
      <div className="home-header__actions">
        <button className="btn-invite">
          <UserPlus size={16} />
          Invitar
        </button>
        
        <div className="user-profile-dropdown">
          <div className="avatar avatar--blue">
            {avatarId}
          </div>
          <ChevronDown size={16} className="text-gray-400" />
        </div>
      </div>
    </header>
  );
};
