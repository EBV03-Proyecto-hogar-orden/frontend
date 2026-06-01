import React, { useState } from 'react';
import { Check, Loader, Home, Copy, Check as CheckCircle } from 'lucide-react';
import { Modal } from '../../../../shared/components';
import { groupService } from '../../../auth/services/groupService';
import '../styles/home.css';

export const JoinHomeGroupModal = ({ isOpen, onClose, onJoinSuccess }) => {
  const [inviteCode, setInviteCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!inviteCode.trim()) {
      setError('Por favor ingresa un código de invitación.');
      return;
    }

    setIsSubmitting(true);
    setError('');
    setSuccess('');
    
    try {
      await groupService.joinHomeGroup(inviteCode.trim());
      setSuccess('¡Te has unido al hogar exitosamente!');
      setInviteCode('');
      
      // Reload the page or refresh context to reflect the new home group
      setTimeout(() => {
        onJoinSuccess();
        onClose();
        window.location.reload();
      }, 1500);
    } catch (e) {
      console.error('Error joining home group:', e);
      const errorMessage = e.response?.data?.detail || 'No se pudo unirse al hogar. Verifica el código de invitación.';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setInviteCode('');
    setError('');
    setSuccess('');
    setCopied(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Unirse a un Hogar"
      type="info"
      showActions={false}
    >
      <div className="manage-members-content">
        <p style={{ marginBottom: '16px', color: 'var(--color-text-muted)', fontSize: '14px' }}>
          Ingresa el código de invitación que recibiste para unirte a un hogar existente.
        </p>

        {error && <div className="members-notification error-banner" style={{ marginBottom: '12px' }}>{error}</div>}
        {success && <div className="members-notification success-banner" style={{ marginBottom: '12px' }}>{success}</div>}

        <form onSubmit={handleSubmit} className="member-form">
          <div className="form-group">
            <label><Home size={14} /> Código de invitación *</label>
            <input 
              type="text" 
              placeholder="ej: ABC123XYZ" 
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
              required
              disabled={isSubmitting || success !== ''}
              style={{
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}
            />
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting || success !== ''}
            style={{
              width: '100%',
              padding: '10px 16px',
              backgroundColor: success ? '#10b981' : '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--border-radius-md)',
              fontSize: '14px',
              fontWeight: '600',
              cursor: (isSubmitting || success) ? 'not-allowed' : 'pointer',
              opacity: (isSubmitting || success) ? 0.6 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginTop: '20px'
            }}
          >
            {isSubmitting ? (
              <>
                <Loader size={16} className="spinner" />
                Validando...
              </>
            ) : success ? (
              <>
                <CheckCircle size={16} />
                ¡Listo!
              </>
            ) : (
              <>
                <Check size={16} />
                Unirse al hogar
              </>
            )}
          </button>
        </form>
      </div>
    </Modal>
  );
};
