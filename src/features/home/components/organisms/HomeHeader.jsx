import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { UserPlus, ChevronDown, LogOut, Copy, Check, Plus, Home, Users, LogIn } from 'lucide-react';
import { useAuth } from '../../../auth/hooks/AuthContext';
import { Modal } from '../../../../shared/components';
import { JoinHomeGroupModal } from './JoinHomeGroupModal';
import '../styles/home.css';

export const HomeHeader = ({ isInviteOpen: isInviteOpenExternal, setIsInviteOpen: setIsInviteOpenExternal, onOpenJoinHome, onOpenManage }) => {
  const { user, logout, homeGroup, createGroup, switchGroup, listGroups } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  
  const [isInviteOpenLocal, setIsInviteOpenLocal] = useState(false);
  const isInviteOpen = isInviteOpenExternal !== undefined ? isInviteOpenExternal : isInviteOpenLocal;
  const setIsInviteOpen = setIsInviteOpenExternal !== undefined ? setIsInviteOpenExternal : setIsInviteOpenLocal;

  const [copied, setCopied] = useState(false);
  const dropdownRef = useRef(null);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isSwitchOpen, setIsSwitchOpen] = useState(false);
  const [isJoinOpen, setIsJoinOpen] = useState(false);
  const [newHomeName, setNewHomeName] = useState('');
  const [homeList, setHomeList] = useState([]);
  const [isLoadingHomes, setIsLoadingHomes] = useState(false);
  const [createError, setCreateError] = useState('');
  const [switchError, setSwitchError] = useState('');

  const userName = user?.username || user?.email?.split('@')[0] || 'Usuario';
  const userEmail = user?.email || '';
  const avatarId = user?.avatarId || '22';

  const headerTitle = homeGroup?.name || `Hogar de ${userName}`;

  // Fetch groups list once when component mounts or user changes
  const fetchHomeList = useCallback(async () => {
    setIsLoadingHomes(true);
    try {
      const groups = await listGroups();
      setHomeList(groups);
    } catch (e) {
      console.error('Error fetching home list:', e);
    } finally {
      setIsLoadingHomes(false);
    }
  }, [listGroups]);

  useEffect(() => {
    if (user) {
      fetchHomeList();
    }
  }, [user, fetchHomeList]);

  // Memoize the home list to prevent re-querying and unnecessary computation
  const memoizedHomeList = useMemo(() => homeList, [homeList]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    logout();
  };

  const handleCopyCode = () => {
    if (homeGroup?.invite_code) {
      navigator.clipboard.writeText(homeGroup.invite_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleOpenCreateModal = () => {
    setNewHomeName('');
    setCreateError('');
    setIsCreateOpen(true);
    setIsOpen(false);
  };

  const handleOpenSwitchModal = () => {
    setSwitchError('');
    setIsSwitchOpen(true);
    setIsOpen(false);
  };

  // external manage handler prop will open the ManageMembersModal in parent

  const handleOpenJoinModal = () => {
    setIsJoinOpen(true);
    setIsOpen(false);
  };

  const handleCreateHome = async (e) => {
    e.preventDefault();
    if (!newHomeName.trim()) {
      setCreateError('El nombre es requerido.');
      return;
    }
    try {
      await createGroup(newHomeName);
      setIsCreateOpen(false);
      await fetchHomeList();
    } catch (e) {
      setCreateError('Error al crear el hogar. Por favor, intenta de nuevo.');
    }
  };

  const handleSwitchHome = async (groupId) => {
    try {
      await switchGroup(groupId);
      setIsSwitchOpen(false);
      await fetchHomeList();
    } catch (e) {
      setSwitchError('No se pudo cambiar de hogar.');
    }
  };

  return (
    <>
      <header className="home-header">
        <h1 className="home-header__title">{headerTitle}</h1>
        
        <div className="home-header__actions">
          {homeGroup && (
            <button className="btn-invite" onClick={() => setIsInviteOpen(true)}>
              <UserPlus size={16} />
              Invitar
            </button>
          )}
          
          <div className="user-profile-dropdown" ref={dropdownRef}>
            <div className="user-profile-dropdown__trigger" onClick={toggleDropdown}>
              <div className="avatar avatar--blue">
                <Home size={16} />
              </div>
              <ChevronDown size={16} className={`text-gray-400 dropdown-arrow ${isOpen ? 'dropdown-arrow--open' : ''}`} />
            </div>

            {isOpen && (
              <div className="user-profile-dropdown__menu">
                <div className="user-profile-dropdown__info">
                  <div className="user-profile-dropdown__name">{userName}</div>
                  {userEmail && <div className="user-profile-dropdown__email">{userEmail}</div>}
                </div>
                
                <button 
                  className="user-profile-dropdown__item"
                  onClick={handleOpenCreateModal}
                >
                  <Plus size={16} />
                  Crear nuevo hogar
                </button>

                <button 
                  className="user-profile-dropdown__item"
                  onClick={handleOpenSwitchModal}
                >
                  <Home size={16} />
                  Cambiar de hogar
                </button>

                <button 
                  className="user-profile-dropdown__item"
                  onClick={handleOpenJoinModal}
                >
                  <LogIn size={16} />
                  Unirse con código
                </button>

                {homeGroup && (
                  <button 
                    className="user-profile-dropdown__item"
                    onClick={() => { onOpenManage && onOpenManage(); setIsOpen(false); }}
                  >
                    <Users size={16} />
                    Gestionar miembros
                  </button>
                )}

                <button 
                  className="user-profile-dropdown__item user-profile-dropdown__item--logout"
                  onClick={handleLogout}
                >
                  <LogOut size={16} />
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Invite Modal */}
      <Modal
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        title="Invitar miembros a tu hogar"
        type="info"
        showActions={false}
      >
        <div className="invite-modal-content">
          <p className="invite-description">
            Comparte este código de invitación con tu familia o compañeros de casa. Al ingresar el código en su pantalla de bienvenida, se unirán a <strong>{homeGroup?.name}</strong>.
          </p>
          <div className="invite-code-container">
            <span className="invite-code-display">{homeGroup?.invite_code || '------'}</span>
            <button 
              className={`btn-copy-code ${copied ? 'copied' : ''}`} 
              onClick={handleCopyCode}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              <span>{copied ? '¡Copiado!' : 'Copiar código'}</span>
            </button>
          </div>
        </div>
      </Modal>

      {/* Create Home Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Crear un nuevo hogar"
        type="info"
        showActions={false}
      >
        <form onSubmit={handleCreateHome} className="invite-modal-content">
          <p className="invite-description">
            Ingresa el nombre para tu nuevo grupo de hogar. Una vez creado, podrás invitar a otros miembros a unirse.
          </p>
          {createError && <p className="error-message" style={{ color: 'var(--color-red-dark)', fontSize: '14px', margin: 0 }}>{createError}</p>}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input 
              type="text" 
              placeholder="Nombre del hogar (ej: Mi Casa, Depto 201)" 
              value={newHomeName}
              onChange={(e) => setNewHomeName(e.target.value)}
              style={{ padding: '10px 14px', borderRadius: '12px', border: '1px solid #e5e7eb', width: '100%', fontSize: '15px' }}
              autoFocus
            />
            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              <button 
                type="button" 
                className="filter-pill" 
                onClick={() => setIsCreateOpen(false)}
                style={{ flex: 1, padding: '10px' }}
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                className="btn-copy-code"
                style={{ flex: 1, padding: '10px' }}
              >
                Crear hogar
              </button>
            </div>
          </div>
        </form>
      </Modal>

      {/* Switch Home Modal */}
      <Modal
        isOpen={isSwitchOpen}
        onClose={() => setIsSwitchOpen(false)}
        title="Cambiar de hogar"
        type="info"
        showActions={false}
      >
        <div className="invite-modal-content" style={{ maxHeight: '400px', overflowY: 'auto' }}>
          <p className="invite-description">
            Selecciona el hogar al que deseas cambiarte:
          </p>
          {switchError && <p className="error-message" style={{ color: 'var(--color-red-dark)', fontSize: '14px', margin: 0 }}>{switchError}</p>}
          
          {isLoadingHomes ? (
            <div style={{ textAlign: 'center', padding: '20px', color: 'var(--color-gray-dark)' }}>
              Cargando hogares...
            </div>
          ) : memoizedHomeList.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px', color: 'var(--color-gray-dark)' }}>
              No tienes otros hogares disponibles.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', margin: '12px 0' }}>
              {memoizedHomeList.map((home) => {
                const isActive = home.id === homeGroup?.id;
                return (
                  <div 
                    key={home.id}
                    onClick={() => handleSwitchHome(home.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      border: isActive ? '2px solid var(--color-blue-dark)' : '1px solid #e5e7eb',
                      backgroundColor: isActive ? 'var(--color-blue-light)' : 'white',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    className="home-item-hover"
                  >
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontWeight: '600', color: 'var(--color-text-main)' }}>{home.name}</span>
                      <span style={{ fontSize: '12px', color: 'var(--color-gray-dark)' }}>Código: {home.invite_code}</span>
                    </div>
                    {isActive && (
                      <span style={{ 
                        fontSize: '11px', 
                        fontWeight: '700', 
                        backgroundColor: 'var(--color-blue-dark)', 
                        color: 'white', 
                        padding: '2px 8px', 
                        borderRadius: '10px' 
                      }}>
                        Activo
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
          
          <button 
            type="button" 
            className="filter-pill" 
            onClick={() => setIsSwitchOpen(false)}
            style={{ width: '100%', padding: '10px', marginTop: '12px' }}
          >
            Cerrar
          </button>
        </div>
      </Modal>

      <JoinHomeGroupModal
        isOpen={isJoinOpen}
        onClose={() => setIsJoinOpen(false)}
        onJoinSuccess={() => {}}
      />
    </>
  );
};


