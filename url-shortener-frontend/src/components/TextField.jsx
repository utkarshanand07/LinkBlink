import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const TextField = ({
  label,
  id,
  type,
  errors,
  register,
  required,
  message,
  className,
  min,
  value,
  placeholder,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = type === "password" && showPassword ? "text" : type;

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label
        htmlFor={id}
        className="text-sm font-bold text-slate-700 dark:text-slate-300 tracking-wide"
      >
        {label}
      </label>

      <div className="relative w-full">
        <input
          type={inputType}
          id={id}
          placeholder={placeholder}
          className={`w-full px-4 py-3.5 pr-12 bg-white dark:bg-brand-900/50 border outline-none rounded-xl transition-all duration-200 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 font-medium ${
            errors[id]?.message
              ? "border-red-500 dark:border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500"
              : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 focus:border-slate-900 dark:focus:border-slate-100 focus:ring-1 focus:ring-slate-900 dark:focus:ring-slate-100"
          } ${className || ""}`}
          {...register(id, {
            required: { value: required, message },
            minLength: min ? { value: min, message: "Minimum 6 characters required" } : null,
            pattern:
              type === "email"
                ? {
                    value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
                    message: "Invalid email",
                  }
                : type === "url"
                ? {
                    value: /^(https?:\/\/)?(([a-zA-Z0-9\u00a1-\uffff-]+\.)+[a-zA-Z\u00a1-\uffff]{2,})(:\d{2,5})?(\/[^\s]*)?$/,
                    message: "Please enter a valid url",
                  }
                : null,
          })}
        />

        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors duration-200 focus:outline-none"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
          </button>
        )}
      </div>

      {errors[id]?.message && (
        <p className="text-xs font-bold text-red-500 dark:text-red-400 mt-0.5">
          {errors[id]?.message}
        </p>
      )}
    </div>
  );
};

export default TextField;