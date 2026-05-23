import { useState } from "react";
import { useAuth } from "../hooks/AuthContext";
import { Home, Plus, Users, Key, ArrowRight, LogOut, ShieldAlert } from "lucide-react";

function OnboardingPage() {
  const { createGroup, joinGroup, logout, user } = useAuth();
  const [view, setView] = useState("select"); // 'select' | 'create' | 'join'
  const [groupName, setGroupName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!groupName.trim()) {
      setError("El nombre del hogar es requerido.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await createGroup(groupName);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.detail || 
        err.response?.data?.name?.[0] || 
        "Error al crear el hogar. Intenta de nuevo."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async (e) => {
    e.preventDefault();
    if (!inviteCode.trim() || inviteCode.trim().length < 8) {
      setError("El código de invitación debe tener al menos 8 caracteres.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await joinGroup(inviteCode);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.invite_code || 
        err.response?.data?.detail || 
        "Código de invitación inválido o expirado."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="onboarding-shell">
      <div className="onboarding-top-bar">
        <span className="user-email">{user?.email}</span>
        <button className="onboarding-logout-btn" onClick={logout} title="Cerrar sesión">
          <LogOut size={16} />
          <span>Cerrar sesión</span>
        </button>
      </div>

      <div className="onboarding-container">
        <div className="onboarding-brand">
          <Home className="onboarding-brand__icon" />
        </div>

        <div className="onboarding-header">
          <h1>¡Hola, {user?.username || "Usuario"}!</h1>
          <p>Para comenzar a organizar tus tareas, necesitas pertenecer a un hogar.</p>
        </div>

        {error && (
          <div className="auth-error onboarding-error">
            <ShieldAlert size={18} />
            <span className="error-content">{error}</span>
          </div>
        )}

        {view === "select" && (
          <div className="onboarding-cards">
            <div className="onboarding-card-option" onClick={() => { setView("create"); setError(""); }}>
              <div className="option-icon-wrapper create-icon">
                <Plus size={28} />
              </div>
              <h3>Crear un nuevo hogar</h3>
              <p>Sé el administrador de tu hogar y crea un grupo para invitar a tu familia.</p>
              <span className="action-indicator">
                Empezar <ArrowRight size={16} />
              </span>
            </div>

            <div className="onboarding-card-option" onClick={() => { setView("join"); setError(""); }}>
              <div className="option-icon-wrapper join-icon">
                <Users size={28} />
              </div>
              <h3>Unirse a un hogar</h3>
              <p>¿Tus familiares ya crearon un hogar? Pídeles su código de invitación y únete.</p>
              <span className="action-indicator">
                Unirse <ArrowRight size={16} />
              </span>
            </div>
          </div>
        )}

        {view === "create" && (
          <form className="onboarding-form" onSubmit={handleCreate}>
            <div className="form-title-group">
              <h2>Crear un nuevo hogar</h2>
              <p>Define un nombre para identificar tu casa o departamento.</p>
            </div>

            <div className="input-group">
              <label htmlFor="groupName" className="input-label">Nombre del Hogar</label>
              <div className="input-wrapper">
                <Home className="input-icon" size={18} />
                <input
                  id="groupName"
                  type="text"
                  placeholder="Ej: Hogar Pérez, Casa Compartida"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
            </div>

            <div className="form-actions">
              <button 
                type="button" 
                className="btn-secondary" 
                onClick={() => { setView("select"); setError(""); }} 
                disabled={loading}
              >
                Volver
              </button>
              <button 
                type="submit" 
                className="btn-primary" 
                disabled={loading}
              >
                {loading ? "Creando..." : "Crear Hogar"}
              </button>
            </div>
          </form>
        )}

        {view === "join" && (
          <form className="onboarding-form" onSubmit={handleJoin}>
            <div className="form-title-group">
              <h2>Unirse a un hogar</h2>
              <p>Ingresa el código de invitación de 8 caracteres provisto por tu familia.</p>
            </div>

            <div className="input-group">
              <label htmlFor="inviteCode" className="input-label">Código de Invitación</label>
              <div className="input-wrapper">
                <Key className="input-icon" size={18} />
                <input
                  id="inviteCode"
                  type="text"
                  placeholder="Código de 8 caracteres"
                  maxLength={12}
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                  disabled={loading}
                  required
                />
              </div>
            </div>

            <div className="form-actions">
              <button 
                type="button" 
                className="btn-secondary" 
                onClick={() => { setView("select"); setError(""); }} 
                disabled={loading}
              >
                Volver
              </button>
              <button 
                type="submit" 
                className="btn-primary" 
                disabled={loading}
              >
                {loading ? "Uniéndose..." : "Unirse al Hogar"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default OnboardingPage;
