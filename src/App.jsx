import { AuthProvider, useAuth } from "./features/auth/hooks/AuthContext";
import AuthPage from "./features/auth";
import OnboardingPage from "./features/auth/components/OnboardingPage";
import HomePage from "./features/home/HomePage";

function AppContent() {
  const { isAuthenticated, loading, homeGroup, loadingGroup } = useAuth();

  if (loading || loadingGroup) {
    return <div className="loading">Cargando...</div>;
  }

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  if (!homeGroup) {
    return <OnboardingPage />;
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
