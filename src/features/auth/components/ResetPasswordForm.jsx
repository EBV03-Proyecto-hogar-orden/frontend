import { useState, useEffect } from "react";
import { Button, InputField, Modal } from "../../../shared/components";
import { useAuth } from "../hooks/AuthContext";
import { CheckCircle2, Circle, AlertCircle } from "lucide-react";

function ResetPasswordForm({ onSuccess }) {
  const { confirmPasswordReset, getPasswordRules } = useAuth();
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [rules, setRules] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);

  const urlParams = new URLSearchParams(window.location.search);
  const uid = urlParams.get("uid") || "";
  const token = urlParams.get("token") || "";

  useEffect(() => {
    const fetchRules = async () => {
      try {
        const data = await getPasswordRules();
        setRules(data);
      } catch (err) {
        console.error("Error fetching password rules:", err);
      }
    };
    fetchRules();
  }, [getPasswordRules]);

  const validation = {
    length: password.length >= (rules?.min_length || 8),
    letter: /[A-Za-z]/.test(password),
    number: /\d/.test(password),
    special: rules ? new RegExp(`[${rules.special_chars_allowed.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}]`).test(password) : false,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!password || !passwordConfirm) {
      setErrors({ general: "Todos los campos son obligatorios." });
      return;
    }

    if (password !== passwordConfirm) {
      setErrors({ password_confirm: "Las contraseñas no coinciden." });
      return;
    }

    if (rules?.regex && !new RegExp(rules.regex).test(password)) {
      setErrors({ password: "La contraseña no cumple con los requisitos mínimos." });
      return;
    }

    setLoading(true);
    try {
      await confirmPasswordReset(uid, token, password, passwordConfirm);
      setShowModal(true);
    } catch (err) {
      const data = err.response?.data;
      if (data && typeof data === "object") {
        if (data.general) {
          setErrors({ general: data.general });
        } else if (data.password) {
          setErrors({ password: Array.isArray(data.password) ? data.password[0] : data.password });
        } else if (data.password_confirm) {
          setErrors({ password_confirm: Array.isArray(data.password_confirm) ? data.password_confirm[0] : data.password_confirm });
        } else {
          setErrors({ general: "Ocurrió un error al restablecer la contraseña." });
        }
      } else {
        setErrors({ general: "Error de conexión con el servidor." });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    window.history.replaceState({}, document.title, window.location.pathname);
    onSuccess();
  };

  return (
    <>
      <form className="auth-form" onSubmit={handleSubmit}>
        {errors.general && (
          <div className="auth-error">
            <AlertCircle size={16} />
            <span className="error-content">{errors.general}</span>
          </div>
        )}

        <div className="password-field-group">
          <InputField
            label="Nueva contraseña"
            icon="Lock"
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className={errors.password ? "error" : ""}
            required
          />
          {errors.password && <span className="field-error">{errors.password}</span>}

          {rules && (
            <div className="password-requirements">
              <div className="strength-meter">
                <div className="strength-meter__header">
                  <span className="strength-label">Fortaleza:</span>
                  <span className={`strength-text strength-${Object.values(validation).filter(Boolean).length}`}>
                    {Object.values(validation).filter(Boolean).length === 0 && "Muy débil"}
                    {Object.values(validation).filter(Boolean).length === 1 && "Débil"}
                    {Object.values(validation).filter(Boolean).length === 2 && "Media"}
                    {Object.values(validation).filter(Boolean).length === 3 && "Fuerte"}
                    {Object.values(validation).filter(Boolean).length === 4 && "Muy fuerte"}
                  </span>
                </div>
                <div className="strength-meter__bar">
                  <div
                    className={`strength-meter__fill strength-${Object.values(validation).filter(Boolean).length}`}
                    style={{ width: `${(Object.values(validation).filter(Boolean).length / Object.values(validation).length) * 100}%` }}
                  />
                </div>
              </div>

              <p className="requirements-title">Requisitos de seguridad:</p>
              <ul className="requirements-list">
                <li className={validation.length ? "met" : ""}>
                  {validation.length ? <CheckCircle2 size={12} /> : <Circle size={12} />}
                  Mínimo {rules.min_length} caracteres
                </li>
                {rules.require_letter && (
                  <li className={validation.letter ? "met" : ""}>
                    {validation.letter ? <CheckCircle2 size={12} /> : <Circle size={12} />}
                    Al menos una letra
                  </li>
                )}
                {rules.require_number && (
                  <li className={validation.number ? "met" : ""}>
                    {validation.number ? <CheckCircle2 size={12} /> : <Circle size={12} />}
                    Al menos un número
                  </li>
                )}
                {rules.require_special_char && (
                  <li className={validation.special ? "met" : ""}>
                    {validation.special ? <CheckCircle2 size={12} /> : <Circle size={12} />}
                    Un carácter especial ({rules.special_chars_allowed})
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>

        <div className="field-wrapper">
          <InputField
            label="Confirmar nueva contraseña"
            icon="Lock"
            type="password"
            name="password_confirm"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            placeholder="••••••••"
            className={errors.password_confirm ? "error" : ""}
            required
          />
          {errors.password_confirm && <span className="field-error">{errors.password_confirm}</span>}
        </div>

        <Button type="submit" className="auth-button" disabled={loading}>
          {loading ? "Actualizando..." : "Restablecer contraseña"}
        </Button>
      </form>

      <Modal
        isOpen={showModal}
        onClose={handleModalClose}
        type="success"
        title="¡Contraseña restablecida!"
        message="Tu contraseña ha sido restablecida exitosamente. Ahora puedes iniciar sesión con tu nueva contraseña."
        duration={3000}
        showActions={false}
      />
    </>
  );
}

export default ResetPasswordForm;
