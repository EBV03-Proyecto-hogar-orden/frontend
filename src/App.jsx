import { AuthProvider, useAuth } from "./features/auth/hooks/AuthContext";
import AuthPage from "./features/auth";

import HomePage from "./features/home/HomePage";

function AppContent() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  return <HomePage />;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
