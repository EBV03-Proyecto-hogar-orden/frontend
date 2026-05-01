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
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [rules, setRules] = useState(null);
  const [validation, setValidation] = useState({
    length: false,
    letter: false,
    number: false,
    special: false,
  });

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

  useEffect(() => {
    if (!isLogin && rules) {
      const { password } = formData;
      setValidation({
        length: password.length >= (rules.min_length || 8),
        letter: /[A-Za-z]/.test(password),
        number: /\d/.test(password),
        special: new RegExp(`[${rules.special_chars_allowed.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}]`).test(password),
      });
    }
  }, [formData.password, rules, isLogin]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!isLogin) {
      if (formData.password !== formData.password_confirm) {
        setError("Las contraseñas no coinciden");
        return;
      }

      if (rules && rules.regex) {
        const regex = new RegExp(rules.regex);
        if (!regex.test(formData.password)) {
          setError(rules.message || "La contraseña no cumple con los requisitos");
          return;
        }
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
      setError(err.response?.data?.detail || err.response?.data?.message || "Ocurrió un error");
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
        {error && (
          <div className="auth-error">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {!isLogin && (
          <InputField
            label="Usuario"
            icon="User"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="nombreusuario"
            required
          />
        )}

        <InputField
          label="Correo electrónico"
          icon="Mail"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="tu@email.com"
          autoComplete="email"
          required
        />

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
            required
          />

          {!isLogin && rules && (
            <div className="password-requirements">
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
          <InputField
            label="Confirmar contraseña"
            icon="Lock"
            type="password"
            name="password_confirm"
            value={formData.password_confirm}
            onChange={handleChange}
            placeholder="••••••••"
            required
          />
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
        message="Tu usuario ha sido registrado exitosamente. Redirigiendo al inicio de sesión..."
        duration={2500}
        showActions={false}
      />
    </>
  );
}

export default AuthForm;
