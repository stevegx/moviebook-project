import { useId, useState } from "react";
import type { ComponentPropsWithoutRef } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

type Props = ComponentPropsWithoutRef<"input"> & { label: string };

export default function FormInput({ label, type, ...props }: Props) {
  const id = useId();
  const [visible, setVisible] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="form-label">
      <label htmlFor={id}>{label}</label>
      <span className="relative block">
        <input
          {...props}
          id={id}
          className={`input-control ${isPassword ? "pr-12" : ""}`}
          type={isPassword && visible ? "text" : type}
        />
        {isPassword && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 grid w-11 place-items-center rounded-r-lg text-movie-text-sec hover:text-movie-text-main"
            aria-label={visible ? "Hide password" : "Show password"}
            onClick={() => setVisible(!visible)}
          >
            {visible ? <FaEyeSlash aria-hidden="true" /> : <FaEye aria-hidden="true" />}
          </button>
        )}
      </span>
    </div>
  );
}
