'use client'
import React, { useEffect, useRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";

export const InputField = ({
  id,
  label,
  required = false,
  name,
  value,
  onChange,
  placeholder,
  readOnly = false,
  type = 'text',
  className = '',
  inputClass = '',
  textarea = false, // <- Add this
  rows = 3,         // <- Optional row control
}) => {
  return (
    <div className={`w-full max-w-full font-sans ${className}`}>
      {label && (
        <label htmlFor={id} className="block text-sm md:text-base font-semibold text-gray-700 mb-1 md:mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      {textarea ? (
        <textarea
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          readOnly={readOnly}
          rows={rows}
          className={`w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm ${inputClass}`}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          readOnly={readOnly}
          className={`w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm ${inputClass}`}
        />
      )}
    </div>
  );
};


// components/common/NativeSelectField.tsx
export const NativeSelectField = ({
  id,
  label,
  name,
  value,
  onChange,
  onClick, // ✅ Add this
  options = [],
  placeholder,
  required = false,
  className = "",
  selectClass = "",
}) => {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="block mb-0.5 font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        onClick={onClick} // ✅ Pass onClick to <select>
        required={required}
        className={`w-full px-2 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white text-gray-700 ${selectClass}`}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};


export const InfoCard = ({ title, children }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-3 shadow-sm">
      <h3 className="text-xl font-semibold text-gray-900 mb-2 border-b pb-2">{title}</h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
};

export const DetailItem = ({ label, value }) => {
  return (
    <div className="flex text-sm text-gray-700">
      <dt className="font-medium font-semibold w-32">{label}:</dt>
      <dd className="ml-1">{value || "-"}</dd>
    </div>
  );
};


// Text area
export const TextAreaField = ({
  id,
  label,
  name,
  value,
  onChange,
  placeholder,
  required = false,
  className = "",
  textareaClass = "",
}) => {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="block mb-0.5 font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <textarea
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`w-full p-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none ${textareaClass}`}
      />
    </div>
  );
};


// Skeleton Loader
export const Skeleton = ({ className = "", variant = "rectangular", width, height, ...props }) => {
  const baseClasses = "bg-gray-200 animate-pulse rounded";
  
  const variants = {
    rectangular: "",
    circular: "rounded-full",
    text: "h-4 rounded-full",
    title: "h-6 rounded-lg w-3/4",
    subtitle: "h-4 rounded-lg w-1/2",
    button: "h-10 rounded-lg w-24",
    card: "h-full w-full rounded-lg"
  };

  const style = {
    ...(width && { width: typeof width === 'number' ? `${width}px` : width }),
    ...(height && { height: typeof height === 'number' ? `${height}px` : height })
  };

  return (
    <motion.div
      className={`${baseClasses} ${variants[variant] || ''} ${className}`}
      style={style}
      initial={{ opacity: 0.7 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, repeat: Infinity, repeatType: 'reverse' }}
      {...props}
    />
  );
};

// Skeleton Wrapper
export const SkeletonWrapper = ({ children, isLoading = true, className = "", ...props }) => {
  if (isLoading) {
    return (
      <div className={`animate-pulse ${className}`} {...props}>
        {children}
      </div>
    );
  }
  return children;
};

// TableFormat

// OtpPasswordInput
export const OtpPasswordInput = ({ value = "", onChange, length = 6 }) => {
  const [otp, setOtp] = useState(Array(length).fill(""));
  const [showPassword, setShowPassword] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (value && value.length === length) {
      setOtp(value.split(""));
    }
  }, [value, length]);

  const handleChange = (index, e) => {
    const digit = e.target.value.replace(/\D/, "");
    if (!digit) return;

    const updated = [...otp];
    updated[index] = digit;
    setOtp(updated);
    onChange?.(updated.join(""));

    // Focus next input
    if (index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const updated = [...otp];
      if (otp[index] === "" && index > 0) {
        updated[index - 1] = "";
        inputRefs.current[index - 1]?.focus();
      } else {
        updated[index] = "";
      }
      setOtp(updated);
      onChange?.(updated.join(""));
    }
  };

  return (
    <div className="relative flex items-center gap-2">
      {otp.map((digit, idx) => (
        <input
          key={idx}
          ref={(el) => (inputRefs.current[idx] = el)}
          type={showPassword ? "text" : "password"}
          inputMode="numeric"
          maxLength="1"
          value={digit}
          onChange={(e) => handleChange(idx, e)}
          onKeyDown={(e) => handleKeyDown(idx, e)}
          className="w-10 h-10 text-center border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 text-lg font-semibold"
        />
      ))}

      <button
        type="button"
        onClick={() => setShowPassword((prev) => !prev)}
        className="ml-2 text-gray-500 hover:text-gray-800"
        title={showPassword ? "Hide Password" : "Show Password"}
      >
        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
  );
};



