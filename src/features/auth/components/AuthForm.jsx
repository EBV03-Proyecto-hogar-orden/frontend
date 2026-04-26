import { useState } from "react";
import { Button, InputField, Modal } from "../../../shared/components";
import { useAuth } from "../hooks/AuthContext";

function AuthForm({ type = "login", onToggle }) {
  const { login, register } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
    password_confirm: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const isLogin = type === "login";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
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
        {error && <div className="auth-error">{error}</div>}

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
