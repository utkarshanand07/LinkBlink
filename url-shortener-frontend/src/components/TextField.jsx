import React from "react";

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
  return (
    <div className="flex flex-col gap-1 w-full">
      <label
        htmlFor={id}
        className="text-sm font-medium text-gray-700 tracking-wide"
      >
        {label}
      </label>

      <input
        type={type}
        id={id}
        placeholder={placeholder}
        className={`w-full px-4 py-3 bg-white border outline-none rounded-lg transition-all duration-200 text-black placeholder-gray-400 ${
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