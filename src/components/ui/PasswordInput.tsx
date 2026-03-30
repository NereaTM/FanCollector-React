import { useState } from "react";

type Props = {
  id: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
};

export default function PasswordInput({ id, name, value, onChange, required }: Props) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="password-input">
      <input
        type={visible ? "text" : "password"}
        id={id} name={name} value={value} onChange={onChange}
        required={required}
      />
      <button
        type="button"
        className="toggle-password"
        onClick={() => setVisible((v) => !v)}
        aria-label="Mostrar/ocultar contraseña"
      >
        <i className={`fas ${visible ? "fa-eye-slash" : "fa-eye"}`} />
      </button>
    </div>
  );
}