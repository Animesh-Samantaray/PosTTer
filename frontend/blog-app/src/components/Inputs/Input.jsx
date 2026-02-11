import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

const Input = ({ value, onChange, label, placeholder, type = "text" }) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword((s) => !s);
  };

  const resolvedType =
    type === "password"
      ? showPassword ? "text" : "password"
      : type;

  return (
    <div className="space-y-1.5">
      
      {/* LABEL */}
      <label className="text-sm font-medium text-gray-700">
        {label}
      </label>

      {/* INPUT WRAPPER */}
      <div className="
        w-full
        flex items-center
        gap-2
        border border-gray-300
        rounded-lg
        px-3 py-2.5
        bg-white
        focus-within:border-black
        focus-within:ring-1
        focus-within:ring-black/20
        transition
      ">
        <input
          type={resolvedType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="
            w-full
            bg-transparent
            outline-none
            text-sm
            placeholder:text-gray-400
          "
        />

        {/* PASSWORD TOGGLE */}
        {type === "password" && (
          showPassword ? (
            <FaRegEye
              size={18}
              className="text-gray-500 cursor-pointer hover:text-black transition"
              onClick={toggleShowPassword}
            />
          ) : (
            <FaRegEyeSlash
              size={18}
              className="text-gray-400 cursor-pointer hover:text-black transition"
              onClick={toggleShowPassword}
            />
          )
        )}
      </div>

    </div>
  );
};

export default Input;
