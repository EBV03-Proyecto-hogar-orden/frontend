import { useState } from "react";
import { Button, InputField } from "../../../shared/components";
import { useAuth } from "../hooks/AuthContext";
import { AlertCircle, CheckCircle2, ArrowLeft } from "lucide-react";

function ForgotPasswordForm({ onBackToLogin }) {
  const { requestPasswordReset } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email) {
      setError("El correo electrónico es obligatorio");
      setLoading(false);
      return;
    }

    try {
      console.log("Calling requestPasswordReset with email:", email);
      await requestPasswordReset(email);
      console.log("requestPasswordReset succeeded");
      setSuccess(true);
    } catch (err) {
      console.error("Error calling requestPasswordReset:", err);
      const data = err.response?.data;
      if (data && data.detail) {
        setError(data.detail);
      } else if (data && data.email) {
        setError(Array.isArray(data.email) ? data.email[0] : data.email);
      } else {
        setError("Ocurrió un error al enviar el enlace. Intenta de nuevo.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="auth-form text-center" style={{ textAlign: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", padding: "16px 0" }}>
          <CheckCircle2 size={48} style={{ color: "#10b981", margin: "0 auto" }} />
          <h2 style={{ fontSize: "18px", fontWeight: "600", color: "#1f2937", marginTop: "8px" }}>Enlace enviado</h2>
          <p style={{ fontSize: "14px", color: "#6b7280", maxWidth: "320px", margin: "0 auto", lineHeight: "1.5" }}>
            Si el correo <strong>{email}</strong> está registrado, recibirás un enlace para restablecer tu contraseña en unos instantes.
          </p>
        </div>
        <Button onClick={onBackToLogin} className="auth-button">
          Volver a iniciar sesión
        </Button>
      </div>
    );
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      {error && (
        <div className="auth-error">
          <AlertCircle size={16} />
          <span className="error-content">{error}</span>
        </div>
      )}

      <div className="field-wrapper">
        <InputField
          label="Correo electrónico"
          icon="Mail"
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@email.com"
          required
        />
      </div>

      <Button type="submit" className="auth-button" disabled={loading}>
        {loading ? "Enviando..." : "Enviar enlace de recuperación"}
      </Button>

      <p className="auth-footer">
        <button type="button" onClick={onBackToLogin} className="auth-link-btn" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
          <ArrowLeft size={16} />
          Volver a iniciar sesión
        </button>
      </p>
    </form>
  );
}

export default ForgotPasswordForm;
