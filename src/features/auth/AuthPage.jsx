import { useState } from "react";
import { Home } from "lucide-react";
import { Card } from "../../shared/components";
import AuthForm from "./components/AuthForm";
import ForgotPasswordForm from "./components/ForgotPasswordForm";
import ResetPasswordForm from "./components/ResetPasswordForm";
import "../../shared/components/shared.css";
import "./auth.css";

function AuthPage() {
  const [authType, setAuthType] = useState(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("uid") && urlParams.get("token")) {
      return "reset-password";
    }
    return "login";
  });

  console.log("AuthPage rendering with authType:", authType);

  const toggleAuth = () => {
    setAuthType((prev) => (prev === "login" ? "register" : "login"));
  };

  const getSubTitle = () => {
    switch (authType) {
      case "login":
        return "Gestiona las tareas de tu hogar";
      case "register":
        return "Únete y mantén tu hogar organizado";
      case "forgot":
        return "Recupera el acceso a tu cuenta";
      case "reset-password":
        return "Establece tu nueva contraseña de acceso";
      default:
        return "";
    }
  };

  return (
    <main className="auth-shell">
      <div className="auth-background">
        <div className="auth-brand">
          <Home className="auth-brand__icon" />
        </div>
        <div className="auth-copy">
          <h1>Hogar en orden</h1>
          <p>{getSubTitle()}</p>
        </div>

        <Card className="auth-card">
          {authType === "login" && (
            <AuthForm 
              key="login" 
              type="login" 
              onToggle={toggleAuth} 
              onForgotPassword={() => setAuthType("forgot")} 
            />
          )}
          {authType === "register" && (
            <AuthForm 
              key="register" 
              type="register" 
              onToggle={toggleAuth} 
            />
          )}
          {authType === "forgot" && (
            <ForgotPasswordForm 
              onBackToLogin={() => setAuthType("login")} 
            />
          )}
          {authType === "reset-password" && (
            <ResetPasswordForm 
              onSuccess={() => setAuthType("login")} 
            />
          )}
        </Card>
      </div>
    </main>
  );
}

export default AuthPage;

