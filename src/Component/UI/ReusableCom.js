import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { FiLoader } from 'react-icons/fi';

export const Input = forwardRef(({
  label,
  type = 'text',
  placeholder = '',
  value,
  onChange,
  disabled = false,
  error = '',
  className = '',
  icon: Icon,
  required = false,
  ...rest
}, ref) => {
  const inputId = `input-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <div className={`form-group ${className}`}>
      {label && (
        <label 
          htmlFor={inputId} 
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-gray-400" />
          </div>
        )}
        <input
          id={inputId}
          ref={ref}
          type={type}
          placeholder={placeholder}
          className={`block w-full ${Icon ? 'pl-10' : 'pl-3'} pr-3 py-2.5 border ${
            error ? 'border-red-500' : 'border-gray-300'
          } rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200 ${
            disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
          }`}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...rest}
        />
      </div>
      {error && (
        <p 
          id={`${inputId}-error`} 
          className="mt-1 text-sm text-red-600"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

Input.propTypes = {
  label: PropTypes.string,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.any,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  error: PropTypes.string,
  className: PropTypes.string,
  icon: PropTypes.elementType,
  required: PropTypes.bool,
};

/**
 * Reusable Button Component
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Button content
 * @param {string} props.variant - Button style variant (primary, secondary, outline, danger, ghost)
 * @param {string} props.size - Button size (sm, md, lg)
 * @param {boolean} props.loading - Loading state
 * @param {boolean} props.fullWidth - Whether the button should take full width
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.rest - Additional button props
 */
export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  className = '',
  ...rest
}) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200';
  
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-dark focus:ring-primary',
    secondary: 'bg-secondary text-white hover:bg-gray-600 focus:ring-gray-500',
    outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-primary',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 focus:ring-gray-300',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const buttonStyles = `
    ${baseStyles}
    ${variants[variant] || variants.primary}
    ${sizes[size] || sizes.md}
    ${fullWidth ? 'w-full' : ''}
    ${loading ? 'opacity-70 cursor-not-allowed' : ''}
    ${className}
  `;

  return (
    <button
      className={buttonStyles}
      disabled={loading || rest.disabled}
      {...rest}
    >
      {loading && (
        <FiLoader className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" />
      )}
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'danger', 'ghost']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  loading: PropTypes.bool,
  fullWidth: PropTypes.bool,
  className: PropTypes.string,
  disabled: PropTypes.bool,
};