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

  // If it's a password field and the eye is clicked, show as text
  const inputType = type === "password" && showPassword ? "text" : type;

  return (
    <div className="flex flex-col gap-1 w-full">
      <label
        htmlFor={id}
        className="text-sm font-medium text-gray-700 tracking-wide"
      >
        {label}
      </label>

      {/* Wrapper div for relative positioning of the icon */}
      <div className="relative w-full">
        <input
          type={inputType}
          id={id}
          placeholder={placeholder}
          /* Added pr-12 so text doesn't type underneath the eye icon */
          className={`w-full px-4 py-3 pr-12 bg-white border outline-none rounded-lg transition-all duration-200 text-black placeholder-gray-400 ${
            errors[id]?.message
              ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
              : "border-gray-200 hover:border-gray-300 focus:border-black focus:ring-1 focus:ring-black"
          } ${className || ""}`}
          {...register(id, {
            required: { value: required, message },
            minLength: min
              ? { value: min, message: "Minimum 6 characters required" }
              : null,

            pattern:
              type === "email"
                ? {
                    value: /^[a-zA-Z0-9]+@(?:[a-zA-Z0-9]+\.)+com+$/,
                    message: "Invalid email",
                  }
                : type === "url"
                ? {
                    value:
                      /^(https?:\/\/)?(([a-zA-Z0-9\u00a1-\uffff-]+\.)+[a-zA-Z\u00a1-\uffff]{2,})(:\d{2,5})?(\/[^\s]*)?$/,
                    message: "Please enter a valid url",
                  }
                : null,
          })}
        />

        {/* Conditionally render the toggle button only for password fields */}
        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-black transition-colors duration-200 focus:outline-none"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
          </button>
        )}
      </div>

      {/* Error Message */}
      {errors[id]?.message && (
        <p className="text-xs font-medium text-red-500 mt-1">
          {errors[id]?.message}
        </p>
      )}
    </div>
  );
};

export default TextField;