import { Home } from "lucide-react";
import { Card } from "../../shared/components";
import AuthForm from "./components/AuthForm";
import "../../shared/components/shared.css";
import "./auth.css";

function AuthPage() {
  return (
    <main className="auth-shell">
      <div className="auth-background">
        <div className="auth-brand">
          <Home className="auth-brand__icon" />
        </div>
        <div className="auth-copy">
          <h1>Hogar en orden</h1>
          <p>Gestiona las tareas de tu hogar</p>
        </div>

        <Card className="auth-card">
          <AuthForm />
        </Card>
      </div>
    </main>
  );
}

export default AuthPage;
