import React, { useState, useEffect } from 'react';
import { Plus, Check, Loader, Calendar, User, AlignLeft, BarChart } from 'lucide-react';
import { useAuth } from '../../../auth/hooks/AuthContext';
import { Modal } from '../../../../shared/components';
import { taskService } from '../../services/taskService';
import '../styles/home.css';

export const CreateTaskModal = ({ isOpen, onClose, onTaskCreated }) => {
  const { getMembers } = useAuth();
  
  const [members, setMembers] = useState([]);
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [form, setForm] = useState({
    name: '',
    description: '',
    priority: 'MEDIA', // ALTA, MEDIA, BAJA
    due_date: '',
    member_id: '' // selected member for assignment
  });

  const [error, setError] = useState('');

  // Load members on modal open
  useEffect(() => {
    if (isOpen) {
      loadMembers();
      // Initialize due_date to today as default
      const today = new Date().toISOString().split('T')[0];
      setForm({
        name: '',
        description: '',
        priority: 'MEDIA',
        due_date: today,
        member_id: ''
      });
      setError('');
    }
  }, [isOpen]);

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
      // 1. Create the task in the backend
      const taskData = {
        name: form.name.trim(),
        description: form.description.trim(),
        priority: form.priority,
        due_date: form.due_date
      };
      
      const createdTask = await taskService.createTask(taskData);
      
      // 2. Assign member if one was selected
      if (form.member_id && createdTask.id) {
        await taskService.assignTask(createdTask.id, parseInt(form.member_id, 10));
      }

      onTaskCreated(); // Trigger reload of task list
      onClose();       // Close modal
    } catch (e) {
      console.error('Error creating task:', e);
      setError(e.response?.data?.detail || 'No se pudo crear la tarea. Verifica los datos.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Crear Nueva Tarea"
      type="info"
      showActions={false}
    >
      <div className="manage-members-content">
        {error && <div className="members-notification error-banner" style={{ marginBottom: '12px' }}>{error}</div>}

        <form onSubmit={handleSubmit} className="member-form">
          <div className="form-group">
            <label><Plus size={14} /> Nombre de la tarea *</label>
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
              <label><Calendar size={14} /> Fecha límite *</label>
              <input 
                type="date" 
                value={form.due_date}
                onChange={(e) => setForm({ ...form, due_date: e.target.value })}
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="form-group">
            <label><User size={14} /> Asignar a (responsable)</label>
            {isLoadingMembers ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--color-gray-dark)' }}>
                <Loader className="spinner" size={14} /> Cargando integrantes...
              </div>
            ) : (
              <select
                value={form.member_id}
                onChange={(e) => setForm({ ...form, member_id: e.target.value })}
                disabled={isSubmitting}
                style={{
                  padding: '10px 14px',
                  border: '1px solid #d1d5db',
                  borderRadius: 'var(--border-radius-md)',
                  fontSize: '14px',
                  backgroundColor: 'white'
                }}
              >
                <option value="">Sin asignar (libre)</option>
                {members.map(member => (
                  <option key={member.id} value={member.id}>
                    {`${member.first_name} ${member.last_name}`.trim() || member.username} (@{member.username})
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="form-actions-row">
            <button 
              type="button" 
              className="filter-pill" 
              onClick={onClose}
              disabled={isSubmitting}
              style={{ padding: '10px 20px' }}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="btn-copy-code"
              disabled={isSubmitting}
              style={{ padding: '10px 24px' }}
            >
              {isSubmitting ? <Loader className="spinner" size={16} /> : <Check size={16} />}
              <span>Crear tarea</span>
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
