import { Button, InputField } from "../../../shared/components";

function AuthForm() {
  return (
    <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
      <InputField
        label="Correo electrónico"
        icon="Mail"
        type="email"
        placeholder="tu@email.com"
        autoComplete="email"
      />

      <InputField
        label="Contraseña"
        icon="Lock"
        type="password"
        placeholder="••••••••"
        autoComplete="current-password"
      />

      <div className="auth-info">
        <a href="#" className="auth-link">
          ¿Olvidaste tu contraseña?
        </a>
      </div>

      <Button type="submit" className="auth-button">
        Iniciar sesión
      </Button>

      <p className="auth-footer">
        ¿No tienes cuenta? <a href="#">Créala aquí</a>
      </p>
    </form>
  );
}

export default AuthForm;
