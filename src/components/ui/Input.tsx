import { InputHTMLAttributes, forwardRef, useId } from "react";
import { FieldError } from "react-hook-form";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  helperText?: string;
};

// eslint-disable-next-line react/display-name
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { type = "text", name = "", label = "", helperText = "", ...props },
    ref
  ) => {
    const inputId = useId();

    return (
      <>
        <div>
          <label className="text-base mb-1 text-neutral-500 " htmlFor={inputId}>
            {label}
          </label>
          <input
            id={inputId}
            className="p-4 rounded-lg border-2 border-solid border-slate-900"
            type={type}
            name={name}
            ref={ref}
            {...props}
          />
          {helperText &&
            typeof helperText !== "string" &&
            "message" in helperText && (
              <p className="text-red-500 text-sm mb-4">
                {(helperText as FieldError).message}
              </p>
            )}
          {helperText && typeof helperText === "string" && (
            <p className="text-red-500 text-sm mb-4">{helperText}</p>
          )}
        </div>
      </>
    );
  }
);
