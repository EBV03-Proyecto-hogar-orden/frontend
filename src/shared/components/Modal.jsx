import { useEffect } from "react";
import { CheckCircle, XCircle, Info, AlertTriangle, X } from "lucide-react";
import "./shared.css";

const Modal = ({
  isOpen,
  onClose,
  title,
  message,
  type = "info",
  confirmText = "Aceptar",
  onConfirm,
  duration = 0, // 0 means no auto-close
  showActions = true,
}) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    
    let timer;
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleEscape);
      
      if (duration > 0) {
        timer = setTimeout(() => {
          onClose();
          if (onConfirm) onConfirm();
        }, duration);
      }
    }
    
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleEscape);
      if (timer) clearTimeout(timer);
    };
  }, [isOpen, onClose, duration, onConfirm]);

  if (!isOpen) return null;

  const icons = {
    success: <CheckCircle className="modal-icon success" />,
    error: <XCircle className="modal-icon error" />,
    warning: <AlertTriangle className="modal-icon warning" />,
    info: <Info className="modal-icon info" />,
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {showActions && (
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        )}

        <div className="modal-body">
          <div className="modal-icon-container">
            {icons[type]}
          </div>
          <h2 className="modal-title">{title}</h2>
          <p className="modal-message">{message}</p>
        </div>

        {showActions && (
          <div className="modal-actions">
            <button
              className={`modal-btn modal-btn-${type}`}
              onClick={() => {
                if (onConfirm) onConfirm();
                onClose();
              }}
            >
              {confirmText}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
