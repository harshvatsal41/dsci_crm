'use client';

import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import PropTypes from 'prop-types';

// Utility function for conditional class names
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

// Dialog Components
export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;

export const DialogContent = React.forwardRef(({ className, children, ...props }, ref) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        'fixed z-50 bg-white rounded-xl shadow-2xl top-1/2 left-1/2 w-[95%] sm:w-[90%] md:w-[85%] lg:w-[80%] xl:w-[70%] transform -translate-x-1/2 -translate-y-1/2',
        'max-h-[90vh] overflow-y-auto',
        className
      )}
      {...props}
    >
      {children}
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
));

DialogContent.displayName = 'DialogContent';

export const DialogTitle = React.forwardRef(({ className, children, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      'text-lg sm:text-xl font-semibold text-[#111827]  pt-6  border-b border-[#E5E7EB]',
      className
    )}
    {...props}
  >
    {children}
  </DialogPrimitive.Title>
));
DialogTitle.displayName = 'DialogTitle';


// Enhanced Button Component with responsive sizes
export const Button = React.forwardRef(({
  className,
  variant = 'default',
  size = 'default',
  icon,
  iconPosition = 'left',
  fullWidth = false,
  children,
  ...props 
}, ref) => {
  // Style configurations
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  
  const sizeStyles = {
    default: 'px-3 py-2 text-sm sm:px-4 sm:py-2',
    sm: 'px-2.5 py-1.5 text-xs sm:px-3 sm:py-1.5',
    lg: 'px-5 py-2.5 text-base sm:px-6 sm:py-3',
    icon: 'p-2'
  };
  
  const variantStyles = {
    default: 'bg-blue-600 text-white hover:bg-blue-700',
    outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-700',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    success: 'bg-green-600 text-white hover:bg-green-700',
  };

  // Icon rendering logic
  const renderIcon = () => {
    if (!icon) return null;
    
    const iconClasses = cn(
      'flex-shrink-0',
      children ? (iconPosition === 'left' ? 'mr-2' : 'ml-2') : '',
      'h-4 w-4'
    );

    if (React.isValidElement(icon)) {
      return React.cloneElement(icon, { className: cn(icon.props.className, iconClasses) });
    }
    
    const IconComponent = icon;
    return <IconComponent className={iconClasses} aria-hidden="true" />;
  };

  return (
    <button
      ref={ref}
      className={cn(
        baseStyles,
        sizeStyles[size] || sizeStyles.default,
        variantStyles[variant] || variantStyles.default,
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {iconPosition === 'left' && renderIcon()}
      {children}
      {iconPosition === 'right' && renderIcon()}
    </button>
  );
});

Button.displayName = 'Button';

// Responsive Table Components
export function Table({ className, children, ...props }) {
  return (
    <div className="overflow-x-auto -mx-2  font-sans sm:-mx-4 md:mx-0">
      <div className="inline-block min-w-full  align-middle  lg:px-0">
        <div className="overflow-hidden bg-white rounded-lg shadow border border-gray-200">
          <table className={cn('min-w-full divide-y divide-gray-200 text-sm', className)} {...props}>
            {children}
          </table>
        </div>
      </div>
    </div>
  );
}

export function TableHeader({ className, children, ...props }) {
  return (
    <thead className={cn('bg-gray-50 hidden sm:table-header-group', className)} {...props}>
      {children}
    </thead>
  );
}

export function TableBody({ className, children, ...props }) {
  return (
    <tbody className={cn('divide-y divide-gray-100 bg-white', className)} {...props}>
      {children}
    </tbody>
  );
}

export function TableRow({ className, children, ...props }) {
  return (
    <tr
      className={cn(
        'hover:bg-gray-50 transition-colors block sm:table-row',
        'border-b border-gray-200 sm:border-0',
        className
      )}
      {...props}
    >
      {children}
    </tr>
  );
}

export function TableHead({ className, children, ...props }) {
  return (
    <th
      className={cn(
        'px-3 py-3.5 text-left text-xs font-semibold text-gray-700 whitespace-nowrap',
        'hidden sm:table-cell',
        className
      )}
      {...props}
    >
      {children}
    </th>
  );
}

export function TableCell({ className, header, children, ...props }) {
  return (
    <td
      className={cn(
        'px-3 py-3 text-sm text-gray-900',
        'block sm:table-cell',
        'first:pt-4 last:pb-4 sm:first:pt-3 sm:last:pb-3',
        'before:content-[attr(data-label)] before:block before:font-medium before:text-gray-500 before:text-xs before:mb-1 sm:before:content-none',
        className
      )}
      data-label={header}
      {...props}
    >
      {children}
    </td>
  );
}

// Responsive Expandable Table Row
export function ExpandableTableRow({ children, expanded, onToggle, expandedContent, ...props }) {
  return (
    <>
      <tr
        className={cn(
          'hover:bg-gray-50 transition-colors block sm:table-row',
          'border-b border-gray-200 sm:border-0',
          expanded && 'bg-gray-50',
          props.className
        )}
        onClick={onToggle}
      >
        {React.Children.map(children, (child, index) => {
          if (React.isValidElement(child) && child.type === TableCell) {
            return React.cloneElement(child, {
              className: cn(
                child.props.className,
                'block sm:table-cell',
                index === 0 && 'pt-4 sm:pt-3',
                index === React.Children.count(children) - 1 && 'pb-4 sm:pb-3'
              )
            });
          }
          return child;
        })}
      </tr>
      {expanded && (
        <tr className="block bg-gray-50">
          <td colSpan={100} className="px-4 py-3 sm:px-6 sm:py-4">
            <div className="text-sm text-gray-700">
              {expandedContent}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

// Responsive Card Component
export function Card({ className, children, ...props }) {
  return (
    <div
      className={cn(
        'bg-white rounded-xl border border-gray-200 shadow-sm',
        'w-full mx-auto',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

Card.Header = function CardHeader({ className, children, ...props }) {
  return (
    <div
      className={cn(
        'px-4 py-4 border-b border-gray-200',
        'sm:px-6',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

Card.Content = function CardContent({ className, children, ...props }) {
  return (
    <div
      className={cn(
        'p-4',
        'sm:p-6',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  description = 'This action cannot be undone.',
  confirmLabel = 'Yes',
  cancelLabel = 'Cancel',
  confirmColor = 'danger',
  loading = false,
}) {
  const confirmBtnColor =
    confirmColor === 'danger'
      ? 'bg-[#EF4444] hover:bg-[#DC2626] text-white'
      : confirmColor === 'success'
        ? 'bg-[#22C55E] hover:bg-[#16A34A] text-white'
        : 'bg-[#0C2FB2] hover:bg-[#0A2899] text-white';

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onClose}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-3" />
        <DialogPrimitive.Content
          className="fixed z-50 bg-white rounded-xl shadow-2xl top-1/2 left-1/2 w-[95%] sm:w-[400px] transform -translate-x-1/2 -translate-y-1/2 max-h-[90vh] overflow-y-auto font-sans"
        >
          {/* ✅ DialogTitle required for accessibility */}
          <DialogTitle className="px-6 pt-6 pb-2 text-lg font-semibold text-[#111827]">
            {title}
          </DialogTitle>

          <div className="px-6 pb-6 text-[#374151] text-sm">{description}</div>

          <div className="px-6 pb-6 flex justify-end gap-2">
            <button
              type="button"
              className="px-4 py-2 rounded bg-[#E5E7EB] text-[#374151] hover:bg-[#D1D5DB] font-medium"
              onClick={() => onClose(false)}
              disabled={loading}
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              className={`px-4 py-2 rounded font-medium ${confirmBtnColor}`}
              onClick={() => onConfirm()}
              disabled={loading}
            >
              {loading ? 'Please wait...' : confirmLabel}
            </button>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

// Responsive Input Component
export const Input = React.forwardRef(({ className, type = 'text', ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        'flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white',
        'focus:outline-none focus:ring-2 focus:ring-[#0C2FB2] focus:ring-offset-1',
        'placeholder:text-gray-400',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'sm:text-sm',
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = 'Input';

// Responsive Grid Layout
export function Grid({ className, children, ...props }) {
  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-4',
        'sm:grid-cols-2',
        'lg:grid-cols-3',
        'xl:grid-cols-4',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// Responsive Container
export function Container({ className, children, ...props }) {
  return (
    <div
      className={cn(
        'w-full px-4 mx-auto',
        'sm:max-w-[640px] sm:px-6',
        'md:max-w-[768px] md:px-8',
        'lg:max-w-[1024px]',
        'xl:max-w-[1280px]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// Responsive Status Badge
export function StatusBadge({ status, className, ...props }) {
  const statusConfig = {
    pending: {
      text: 'Pending',
      bg: 'bg-yellow-50',
      textColor: 'text-yellow-800',
      border: 'border-yellow-400'
    },
    accepted: {
      text: 'Accepted',
      bg: 'bg-green-50',
      textColor: 'text-green-800',
      border: 'border-green-400'
    },
    rejected: {
      text: 'Rejected',
      bg: 'bg-red-50',
      textColor: 'text-red-700',
      border: 'border-red-400'
    },
    active: {
      text: 'Active',
      bg: 'bg-green-50',
      textColor: 'text-green-800',
      border: 'border-green-400'
    },
    inactive: {
      text: 'Inactive',
      bg: 'bg-gray-100',
      textColor: 'text-gray-800',
      border: 'border-gray-300'
    },
  };

  const config = statusConfig[status?.toLowerCase()] || {
    text: status || 'Unknown',
    bg: 'bg-gray-100',
    textColor: 'text-gray-800',
    border: 'border-gray-300'
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded px-2.5 py-0.5 text-xs font-bold border',
        'sm:px-3 sm:py-1 sm:text-sm',
        config.bg,
        config.textColor,
        config.border,
        className
      )}
      {...props}
    >
      {config.text}
    </span>
  );
}


export function formatDate(dateString) {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  if (isNaN(date)) return 'N/A';
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}


export const Tabs = ({ activeTab, setActiveTab, children, onRemoveTab }) => {
  const tabCount = React.Children.count(children);

  return (
    <div className="w-full font-sans">
      {/* Tab Headers */}
      <div className="border-b border-blue-400">
        <div className="flex flex-wrap px-2 items-center gap-2  ">
          {React.Children.map(children, (child, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setActiveTab(index)}
              className={`flex items-center px-3 py-1.5 rounded-t-lg text-sm font-medium border transition-all duration-200
                ${index === activeTab
                  ? 'bg-blue-50 text-blue-600 border-blue-300 shadow-sm'
                  : 'bg-white text-blue-500 border border-blue-100 hover:bg-blue-50'
                }
              `}
            >
              <span>{child.props.title || `Tab ${index + 1}`}</span>
              {tabCount > 1 && typeof onRemoveTab === 'function' && (
                <X
                  size={14}
                  className="ml-2 text-gray-400 hover:text-red-500 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveTab(index);
                  }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white mt-3 rounded-md border border-blue-100 p-1 shadow-sm transition-all duration-300">
        {children[activeTab]}
      </div>
    </div>
  );
};

export const Tab = ({ children }) => <>{children}</>;