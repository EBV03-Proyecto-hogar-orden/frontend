import { useState, useEffect } from "react";
import { Button, InputField, Modal } from "../../../shared/components";
import { useAuth } from "../hooks/AuthContext";
import { CheckCircle2, Circle, AlertCircle } from "lucide-react";

function AuthForm({ type = "login", onToggle }) {
  const { login, register, getPasswordRules } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
    password_confirm: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [rules, setRules] = useState(null);

  const isLogin = type === "login";

  useEffect(() => {
    if (!isLogin) {
      const fetchRules = async () => {
        try {
          const data = await getPasswordRules();
          setRules(data);
        } catch (err) {
          console.error("Error fetching password rules:", err);
        }
      };
      fetchRules();
    }
  }, [isLogin, getPasswordRules]);

  const validation = {
    length: formData.password.length >= (rules?.min_length || 8),
    letter: /[A-Za-z]/.test(formData.password),
    number: /\d/.test(formData.password),
    special: rules ? new RegExp(`[${rules.special_chars_allowed.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}]`).test(formData.password) : false,
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const requiredFields = isLogin ? ["email", "password"] : ["username", "email", "password", "password_confirm"];
    const hasEmptyFields = requiredFields.some(field => !formData[field]);

    if (hasEmptyFields) {
      setErrors({ general: "Todos los campos son obligatorios" });
      return;
    }

    if (!isLogin) {
      const newErrors = {};

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = "El correo electrónico no es válido";
      }

      if (rules?.regex && !new RegExp(rules.regex).test(formData.password)) {
        newErrors.password = "La contraseña no cumple con los requisitos";
      }

      if (formData.password !== formData.password_confirm) {
        newErrors.password_confirm = "Las contraseñas no coinciden";
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
    }

    setLoading(true);
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await register({
          email: formData.email,
          username: formData.username,
          password: formData.password,
          password_confirm: formData.password_confirm,
        });

        setShowModal(true);
      }
    } catch (err) {
      const data = err.response?.data;
      console.log("Error data:", data);

      if (data && typeof data === "object" && !data.detail && !data.message) {
        const newErrors = {};
        Object.keys(data).forEach((key) => {
          let msg = Array.isArray(data[key]) ? data[key][0] : data[key];

          if (key === "email" && msg.toLowerCase().includes("already exists")) {
            msg = "Este correo ya está registrado";
          }
          if (key === "username" && msg.toLowerCase().includes("already exists")) {
            msg = "Este nombre de usuario ya está en uso";
          }

          newErrors[key] = msg;
        });
        setErrors(newErrors);
      } else {
        let detail = data?.detail || data?.message || "Ocurrió un error";
        const field = data?.field;

        if (detail.toLowerCase().includes("email") && detail.toLowerCase().includes("registrado")) {
          detail = "Este correo ya está registrado";
        }

        if (field && (field === "email" || field === "username" || field === "password")) {
          setErrors({ [field]: detail });
        } else {
          setErrors({ general: detail });
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    onToggle();
  };

  return (
    <>
      <form className="auth-form" onSubmit={handleSubmit}>
        {errors.general && (
          <div className="auth-error">
            <AlertCircle size={16} />
            {errors.general}
          </div>
        )}

        {!isLogin && (
          <div className="field-wrapper">
            <InputField
              label="Usuario"
              icon="User"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="nombre de usuario"
              className={errors.username ? "error" : ""}
              required
            />
            {errors.username && <span className="field-error">{errors.username}</span>}
          </div>
        )}

        <div className="field-wrapper">
          <InputField
            label="Correo electrónico"
            icon="Mail"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="tu@email.com"
            autoComplete="email"
            className={errors.email ? "error" : ""}
            required
          />
          {errors.email && <span className="field-error">{errors.email}</span>}
        </div>

        <div className="password-field-group">
          <InputField
            label="Contraseña"
            icon="Lock"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            autoComplete={isLogin ? "current-password" : "new-password"}
            className={errors.password ? "error" : ""}
            required
          />
          {errors.password && <span className="field-error">{errors.password}</span>}

          {!isLogin && rules && (
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

        {!isLogin && (
          <div className="field-wrapper">
            <InputField
              label="Confirmar contraseña"
              icon="Lock"
              type="password"
              name="password_confirm"
              value={formData.password_confirm}
              onChange={handleChange}
              placeholder="••••••••"
              className={errors.password_confirm ? "error" : ""}
              required
            />
            {errors.password_confirm && <span className="field-error">{errors.password_confirm}</span>}
          </div>
        )}

        {isLogin && (
          <div className="auth-info">
            <a href="#" className="auth-link">
              ¿Olvidaste tu contraseña?
            </a>
          </div>
        )}

        <Button type="submit" className="auth-button" disabled={loading}>
          {loading ? "Cargando..." : isLogin ? "Iniciar sesión" : "Crear cuenta"}
        </Button>

        <p className="auth-footer">
          {isLogin ? (
            <>
              ¿No tienes cuenta?{" "}
              <button type="button" onClick={onToggle} className="auth-link-btn">
                Créala aquí
              </button>
            </>
          ) : (
            <>
              ¿Ya tienes cuenta?{" "}
              <button type="button" onClick={onToggle} className="auth-link-btn">
                Inicia sesión
              </button>
            </>
          )}
        </p>
      </form>

      <Modal
        isOpen={showModal}
        onClose={handleModalClose}
        type="success"
        title="¡Cuenta creada!"
        message="¡Cuenta creada exitosamente!"
        duration={2000}
        showActions={false}
      />
    </>
  );
}

export default AuthForm;
