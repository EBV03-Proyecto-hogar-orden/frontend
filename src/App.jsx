import { AuthProvider, useAuth } from "./features/auth/hooks/AuthContext";
import AuthPage from "./features/auth";

function AppContent() {
  const { isAuthenticated, loading, user, logout } = useAuth();

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  return (
    <div className="home-layout">
      <header className="home-header">
        <h1>Bienvenido, {user?.username || user?.email}</h1>
        <button onClick={logout} className="logout-btn">Cerrar sesión</button>
      </header>
      <main className="home-content">
        <p>Tu sesión está activa. ¡Pronto añadiremos más funcionalidades!</p>
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
