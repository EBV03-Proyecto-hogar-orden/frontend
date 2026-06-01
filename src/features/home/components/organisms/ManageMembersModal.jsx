import React, { useState, useEffect } from 'react';
import { UserPlus, Trash2, ArrowLeft, Shield, User, Mail, Lock, Check, Loader, UserMinus } from 'lucide-react';
import { useAuth } from '../../../auth/hooks/AuthContext';
import { Modal } from '../../../../shared/components';
import '../styles/home.css';

export const ManageMembersModal = ({ isOpen, onClose, onOpenInvite }) => {
  const { 
    user, 
    homeGroup, 
    getMembers, 
    addMember, 
    updateMember, 
    removeMember,
    fetchHomeGroup
  } = useAuth();

  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isCurrentUserCreator, setIsCurrentUserCreator] = useState(false);
  
  // View states: 'list' | 'add' | 'edit'
  const [view, setView] = useState('list');
  const [selectedMember, setSelectedMember] = useState(null);

  // Form states - Add
  const [addForm, setAddForm] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    password: ''
  });

  // Form states - Edit
  const [editForm, setEditForm] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: ''
  });

  const normalizeId = (value) => (value === undefined || value === null ? '' : String(value));
  const getGroupCreatorId = (group) => {
    if (!group) return '';
    if (typeof group.creator === 'object') return normalizeId(group.creator.id);
    return normalizeId(group.creator || group.creator_id);
  };

  useEffect(() => {
    const currentUserIsCreator = !!(
      user &&
      homeGroup &&
      normalizeId(user.id) === getGroupCreatorId(homeGroup)
    );
    setIsCurrentUserCreator(currentUserIsCreator);
  }, [homeGroup, user]);

  // Load members when modal opens
  useEffect(() => {
    if (isOpen) {
      loadMembers();
      setView('list');
      setError('');
      setSuccess('');
    }
  }, [isOpen]);

  const loadMembers = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await getMembers();
      setMembers(data);
      const me = data.find((m) => normalizeId(m.id) === normalizeId(user?.id));
      const amCreator = (me && (me.is_creator || normalizeId(me.id) === getGroupCreatorId(homeGroup)));
      setIsCurrentUserCreator(!!amCreator);
    } catch (e) {
      console.error('Error fetching members:', e);
      setError('No se pudieron cargar los miembros del hogar.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!addForm.username.trim() || !addForm.email.trim()) {
      setError('El nombre de usuario y correo son requeridos.');
      return;
    }

    setIsSubmitting(true);
    setError('');
    setSuccess('');
    try {
      await addMember(addForm);
      setSuccess('Miembro agregado exitosamente.');
      setAddForm({
        username: '',
        email: '',
        first_name: '',
        last_name: '',
        password: ''
      });
      await loadMembers();
      await fetchHomeGroup(); // Refresh context group info
      setView('list');
    } catch (e) {
      console.error('Error adding member:', e);
      setError(e.response?.data?.detail || 'Error al agregar el miembro. Verifica los datos.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (member) => {
    setSelectedMember(member);
    setEditForm({
      username: member.username || '',
      email: member.email || '',
      first_name: member.first_name || '',
      last_name: member.last_name || ''
    });
    setView('edit');
    setError('');
    setSuccess('');
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editForm.username.trim() || !editForm.email.trim()) {
      setError('El nombre de usuario y correo son requeridos.');
      return;
    }

    setIsSubmitting(true);
    setError('');
    setSuccess('');
    try {
      await updateMember(selectedMember.id, editForm);
      setSuccess('Miembro actualizado correctamente.');
      await loadMembers();
      setView('list');
    } catch (e) {
      console.error('Error updating member:', e);
      setError(e.response?.data?.detail || 'Error al actualizar el miembro.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveMember = async (memberId, memberName) => {
    const isSelf = memberId === user?.id;
    const confirmMessage = isSelf 
      ? '¿Estás seguro de que deseas salir de este hogar?' 
      : `¿Estás seguro de que deseas remover a "${memberName}" de este hogar?`;

    if (!window.confirm(confirmMessage)) {
      return;
    }

    setIsSubmitting(true);
    setError('');
    setSuccess('');
    try {
      await removeMember(memberId);
      setSuccess(isSelf ? 'Has salido del hogar exitosamente.' : 'Miembro removido exitosamente.');
      
      if (isSelf) {
        // If the user left their own group, reload auth context to reflect they have no home group
        onClose();
        window.location.reload();
      } else {
        await loadMembers();
        await fetchHomeGroup();
      }
    } catch (e) {
      console.error('Error removing member:', e);
      setError(e.response?.data?.detail || 'Error al remover al miembro.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInitials = (member) => {
    if (member.first_name && member.last_name) {
      return `${member.first_name[0]}${member.last_name[0]}`.toUpperCase();
    }
    return member.username ? member.username.substring(0, 2).toUpperCase() : 'US';
  };

  const getRandomAvatarColor = (id) => {
    const colors = [
      'avatar--blue',
      'avatar--green',
      'avatar--purple',
      'avatar--pink',
      'avatar--indigo'
    ];
    return colors[id % colors.length] || 'avatar--blue';
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Gestión de Miembros"
      type="info"
      showActions={false}
    >
      <div className="manage-members-content">
        {/* Navigation & Actions Header */}
        <div className="members-header-bar">
          {view !== 'list' ? (
            <button className="btn-back-link" onClick={() => setView('list')}>
              <ArrowLeft size={16} />
              <span>Volver a la lista</span>
            </button>
          ) : (
            <p className="members-intro-text">
              Administra los integrantes de <strong>{homeGroup?.name}</strong>.
            </p>
          )}

          {view === 'list' && (
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                className="btn-add-member" 
                style={{ backgroundColor: 'var(--color-green-dark)' }} 
                onClick={() => {
                  onClose();
                  onOpenInvite();
                }}
              >
                <UserPlus size={16} />
                <span>Invitar miembro</span>
              </button>
            </div>
          )}
        </div>

        {/* Notifications */}
        {error && <div className="members-notification error-banner">{error}</div>}
        {success && <div className="members-notification success-banner">{success}</div>}

        {/* MEMBERS LIST */}
        {view === 'list' && (
          <div className="members-list-container">
            {isLoading ? (
              <div className="members-loading-container">
                <Loader className="spinner" size={24} />
                <span>Cargando integrantes...</span>
              </div>
            ) : members.length === 0 ? (
              <div className="members-empty-state">
                <span>No hay miembros registrados en este hogar.</span>
              </div>
            ) : (
              <div className="members-cards-grid">
                {members.map((member) => {
                  const isSelf = normalizeId(member.id) === normalizeId(user?.id);
                  const isCreator = member.is_creator || normalizeId(member.id) === getGroupCreatorId(homeGroup);
                  const displayName = `${member.first_name} ${member.last_name}`.trim() || member.username;

                  return (
                    <div key={member.id} className={`member-card ${isSelf ? 'member-card--self' : ''}`}>
                      <div className="member-card__main">
                        <div className={`avatar ${getRandomAvatarColor(member.id)}`}>
                          {getInitials(member)}
                        </div>
                        <div className="member-card__info">
                          <div className="member-card__name">
                            {displayName}
                            {isSelf && <span className="badge-self">Tú</span>}
                          </div>
                          <div className="member-card__email">{member.email}</div>
                          <div className="member-card__username">@{member.username}</div>
                        </div>
                      </div>

                      <div className="member-card__actions">
                        {isCreator ? (
                          <span className="badge-role badge-role--creator">
                            <Shield size={12} />
                            Creador
                          </span>
                        ) : (
                          <span className="badge-role badge-role--member">
                            Miembro
                          </span>
                        )}

                        <div className="action-buttons-group">
                          {/* Delete/Remove button:
                              1. Current user is creator AND targeting another member (remover)
                              2. Current user is a regular member AND targeting themselves (salir)
                          */}
                          {((isCurrentUserCreator && !isCreator) || (!isCurrentUserCreator && isSelf)) && (
                            <button 
                              className="btn-member-action delete" 
                              title={isSelf ? "Salir del hogar" : "Remover del hogar"}
                              onClick={() => handleRemoveMember(member.id, displayName)}
                              disabled={isSubmitting}
                            >
                              {isSelf ? <UserMinus size={14} /> : <Trash2 size={14} />}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* VIEW: ADD MEMBER */}
        {view === 'add' && (
          <form onSubmit={handleAddSubmit} className="member-form">
            <h3 className="form-title">Agregar Integrante</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label><User size={14} /> Nombre de usuario *</label>
                <input 
                  type="text" 
                  placeholder="ej: juanperez" 
                  value={addForm.username}
                  onChange={(e) => setAddForm({ ...addForm, username: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label><Mail size={14} /> Correo electrónico *</label>
                <input 
                  type="email" 
                  placeholder="ej: juan@gmail.com" 
                  value={addForm.email}
                  onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Nombre</label>
                <input 
                  type="text" 
                  placeholder="ej: Juan" 
                  value={addForm.first_name}
                  onChange={(e) => setAddForm({ ...addForm, first_name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Apellido</label>
                <input 
                  type="text" 
                  placeholder="ej: Pérez" 
                  value={addForm.last_name}
                  onChange={(e) => setAddForm({ ...addForm, last_name: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label><Lock size={14} /> Contraseña (opcional)</label>
              <input 
                type="password" 
                placeholder="Por defecto será Hogar123!" 
                value={addForm.password}
                onChange={(e) => setAddForm({ ...addForm, password: e.target.value })}
              />
              <span className="input-helper-text">
                Si el usuario ya existe en el sistema por su correo, se le asignará a este grupo directamente y usará su contraseña actual.
              </span>
            </div>

            <div className="form-actions-row">
              <button 
                type="button" 
                className="filter-pill" 
                onClick={() => setView('list')}
                disabled={isSubmitting}
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                className="btn-copy-code"
                disabled={isSubmitting}
              >
                {isSubmitting ? <Loader className="spinner" size={16} /> : <Check size={16} />}
                <span>Guardar integrante</span>
              </button>
            </div>
          </form>
        )}

        {/* VIEW: EDIT MEMBER */}
        {view === 'edit' && (
          <form onSubmit={handleEditSubmit} className="member-form">
            <h3 className="form-title">Editar Detalles de {selectedMember?.username}</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label><User size={14} /> Nombre de usuario *</label>
                <input 
                  type="text" 
                  placeholder="Nombre de usuario" 
                  value={editForm.username}
                  onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label><Mail size={14} /> Correo electrónico *</label>
                <input 
                  type="email" 
                  placeholder="Correo electrónico" 
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Nombre</label>
                <input 
                  type="text" 
                  placeholder="Nombre" 
                  value={editForm.first_name}
                  onChange={(e) => setEditForm({ ...editForm, first_name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Apellido</label>
                <input 
                  type="text" 
                  placeholder="Apellido" 
                  value={editForm.last_name}
                  onChange={(e) => setEditForm({ ...editForm, last_name: e.target.value })}
                />
              </div>
            </div>

            <div className="form-actions-row">
              <button 
                type="button" 
                className="filter-pill" 
                onClick={() => setView('list')}
                disabled={isSubmitting}
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                className="btn-copy-code"
                disabled={isSubmitting}
              >
                {isSubmitting ? <Loader className="spinner" size={16} /> : <Check size={16} />}
                <span>Guardar cambios</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
};
