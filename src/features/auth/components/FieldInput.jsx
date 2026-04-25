import { Mail, Lock } from "lucide-react";

const icons = {
  Mail,
  Lock,
};

function FieldInput({ label, icon, ...props }) {
  const Icon = icons[icon];

  return (
    <label className="field">
      <span>{label}</span>
      <div className="field-input">
        <Icon className="field-icon" />
        <input {...props} />
      </div>
    </label>
  );
}

export default FieldInput;
