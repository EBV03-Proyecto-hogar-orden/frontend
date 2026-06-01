import React, { useState, useEffect } from 'react';
import { Check, Loader, Calendar, BarChart, AlignLeft, Trash2 } from 'lucide-react';
import { useAuth } from '../../../auth/hooks/AuthContext';
import { Modal } from '../../../../shared/components';
import { taskService } from '../../services/taskService';
import '../styles/home.css';

export const EditTaskModal = ({ isOpen, onClose, task, onTaskUpdated, onDelete }) => {
  const { getMembers } = useAuth();
  
  const [members, setMembers] = useState([]);
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [form, setForm] = useState({
    name: '',
    description: '',
    priority: 'MEDIA',
    due_date: '',
    status: 'Pendiente',
    member_id: ''
  });

  const [error, setError] = useState('');

  const mapPriorityFrontToBack = (priority) => {
    const map = { Alta: 'ALTA', Media: 'MEDIA', Baja: 'BAJA' };
    return map[priority] || 'MEDIA';
  };

  useEffect(() => {
    if (isOpen && task) {
      loadMembers();
      setForm({
        name: task.title || '',
        description: task.description || '',
        priority: mapPriorityFrontToBack(task.priority),
        due_date: task.rawDueDate || '',
        status: task.status || 'Pendiente',
        member_id: task.assignee?.id || ''
      });
      setError('');
    }
  }, [isOpen, task]);

  const loadMembers = async () => {
    setIsLoadingMembers(true);
    try {
      const data = await getMembers();
      setMembers(data);
    } catch (e) {
      console.error('Error fetching members for tasks:', e);
    } finally {
      setIsLoadingMembers(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.due_date) {
      setError('El nombre y la fecha de vencimiento son requeridos.');
      return;
    }

    setIsSubmitting(true);
    setError('');
    try {
      const taskData = {
        name: form.name.trim(),
        description: form.description.trim(),
        priority: form.priority,
        due_date: form.due_date
      };
      
      await taskService.modifyTask(task.id, taskData);
      
      // Update status if changed (backend expects codes)
      const mapStatusFrontToBack = (s) => {
        const map = { 'Pendiente': 'PENDIENTE', 'En progreso': 'PROGRESO', 'Completada': 'COMPLETADA' };
        return map[s] || 'PENDIENTE';
      };

      if (form.status && form.status !== task.status) {
        await taskService.updateTaskStatus(task.id, mapStatusFrontToBack(form.status));
      }

      // Update assignment if changed
      if (form.member_id && form.member_id !== (task.assignee?.id || '')) {
        await taskService.assignTask(task.id, parseInt(form.member_id, 10));
      }

      onTaskUpdated();
      onClose();
    } catch (e) {
      console.error('Error updating task:', e);
      setError(e.response?.data?.detail || 'No se pudo actualizar la tarea. Verifica los datos.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onDelete(task.id);
      onClose();
    } catch (e) {
      console.error('Error deleting task:', e);
      setError('No se pudo eliminar la tarea.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Editar Tarea: ${task?.title || ''}`}
      type="info"
      showActions={false}
    >
      <div className="manage-members-content">
        {error && <div className="members-notification error-banner" style={{ marginBottom: '12px' }}>{error}</div>}

        <form onSubmit={handleSubmit} className="member-form">
          <div className="form-group">
            <label>Nombre de la tarea *</label>
            <input 
              type="text" 
              placeholder="ej: Limpiar la sala o Pagar servicios" 
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="form-group">
            <label><AlignLeft size={14} /> Descripción</label>
            <textarea 
              placeholder="Detalla los pasos o insumos necesarios..." 
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              disabled={isSubmitting}
              style={{
                padding: '10px 14px',
                border: '1px solid #d1d5db',
                borderRadius: 'var(--border-radius-md)',
                fontSize: '14px',
                outline: 'none',
                minHeight: '80px',
                fontFamily: 'inherit',
                resize: 'vertical'
              }}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label><BarChart size={14} /> Prioridad</label>
              <select
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
                disabled={isSubmitting}
                style={{
                  padding: '10px 14px',
                  border: '1px solid #d1d5db',
                  borderRadius: 'var(--border-radius-md)',
                  fontSize: '14px',
                  backgroundColor: 'white'
                }}
              >
                <option value="BAJA">Baja</option>
                <option value="MEDIA">Media</option>
                <option value="ALTA">Alta</option>
              </select>
            </div>

            <div className="form-group">
              <label>Estado</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                disabled={isSubmitting}
                style={{
                  padding: '10px 14px',
                  border: '1px solid #d1d5db',
                  borderRadius: 'var(--border-radius-md)',
                  fontSize: '14px',
                  backgroundColor: 'white'
                }}
              >
                <option value="Pendiente">Pendiente</option>
                <option value="En progreso">En progreso</option>
                <option value="Completada">Completada</option>
              </select>
            </div>

            <div className="form-group">
              <label><Calendar size={14} /> Fecha de vencimiento *</label>
              <input 
                type="date" 
                value={form.due_date}
                onChange={(e) => setForm({ ...form, due_date: e.target.value })}
                required
                disabled={isSubmitting}
                style={{
                  padding: '10px 14px',
                  border: '1px solid #d1d5db',
                  borderRadius: 'var(--border-radius-md)',
                  fontSize: '14px',
                  backgroundColor: 'white'
                }}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Asignar a</label>
            <select
              value={form.member_id}
              onChange={(e) => setForm({ ...form, member_id: e.target.value })}
              disabled={isLoadingMembers || isSubmitting}
              style={{
                padding: '10px 14px',
                border: '1px solid #d1d5db',
                borderRadius: 'var(--border-radius-md)',
                fontSize: '14px',
                backgroundColor: 'white'
              }}
            >
              <option value="">Sin asignar</option>
              {members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.first_name && member.last_name 
                    ? `${member.first_name} ${member.last_name}` 
                    : member.username}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
            <button 
              type="submit" 
              disabled={isSubmitting}
              style={{
                flex: 1,
                padding: '10px 16px',
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--border-radius-md)',
                fontSize: '14px',
                fontWeight: '600',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                opacity: isSubmitting ? 0.6 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              {isSubmitting ? <Loader size={16} className="spinner" /> : <Check size={16} />}
              Guardar cambios
            </button>
            <button 
              type="button"
              onClick={handleDelete}
              disabled={isSubmitting}
              style={{
                padding: '10px 16px',
                backgroundColor: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--border-radius-md)',
                fontSize: '14px',
                fontWeight: '600',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                opacity: isSubmitting ? 0.6 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
              title="Eliminar tarea"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
