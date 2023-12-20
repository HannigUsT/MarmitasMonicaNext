import { SelectHTMLAttributes, forwardRef, useId } from "react";

interface SelectOption {
  label: string;
  value: string;
}

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  helperText?: string;
  options: SelectOption[];
};

// eslint-disable-next-line react/display-name
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ name = "", label = "", helperText = "", options = [], ...props }, ref) => {
    const selectId = useId();

    return (
      <>
        <div>
          <label className="text-base mb-1 text-neutral-500" htmlFor={selectId}>
            {label}
          </label>
          <select
            id={selectId}
            className="p-4 rounded-lg border-2 border-solid border-slate-900"
            name={name}
            ref={ref}
            {...props}
          >
            {options.map((option, index) => (
              <option key={index} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {helperText.length > 0 && (
            <p className="text-red-500 text-sm mb-4">{helperText}</p>
          )}
        </div>
      </>
    );
  }
);
