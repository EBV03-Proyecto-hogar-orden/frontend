import { useState } from "react";
import { Home } from "lucide-react";
import { Card } from "../../shared/components";
import AuthForm from "./components/AuthForm";
import "../../shared/components/shared.css";
import "./auth.css";

function AuthPage() {
  const [authType, setAuthType] = useState("login");

  const toggleAuth = () => {
    setAuthType((prev) => (prev === "login" ? "register" : "login"));
  };

  return (
    <main className="auth-shell">
      <div className="auth-background">
        <div className="auth-brand">
          <Home className="auth-brand__icon" />
        </div>
        <div className="auth-copy">
          <h1>Hogar en orden</h1>
          <p>
            {authType === "login"
              ? "Gestiona las tareas de tu hogar"
              : "Únete y mantén tu hogar organizado"}
          </p>
        </div>

        <Card className="auth-card">
          <AuthForm type={authType} onToggle={toggleAuth} />
        </Card>
      </div>
    </main>
  );
}

export default AuthPage;
