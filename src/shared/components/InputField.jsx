import { Mail, Lock, User } from "lucide-react";

const icons = {
  Mail,
  Lock,
  User,
};

function InputField({ label, icon, className = "", ...props }) {
  const Icon = icons[icon];

  return (
    <label className={`input-field ${className}`.trim()}>
      <span className="input-field__label">{label}</span>
      <div className="input-field__control">
        {Icon && <Icon className="input-field__icon" />}
        <input {...props} />
      </div>
    </label>
  );
}

export default InputField;
