'use client'
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { Button } from './TableFormat';

export const ConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  description = 'This action cannot be undone.',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  confirmColor = 'danger',
  loading = false,
  size = 'md',
  icon,
}) => {
  // Color configurations
  const colorConfig = {
    danger: {
      button: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
      icon: 'text-red-600',
    },
    warning: {
      button: 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500',
      icon: 'text-amber-600',
    },
    success: {
      button: 'bg-green-600 hover:bg-green-700 focus:ring-green-500',
      icon: 'text-green-600',
    },
    primary: {
      button: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
      icon: 'text-blue-600',
    },
  };

  // Size configurations
  const sizeConfig = {
    sm: {
      dialog: 'max-w-sm',
      iconSize: 'h-5 w-5',
    },
    md: {
      dialog: 'max-w-md',
      iconSize: 'h-6 w-6',
    },
    lg: {
      dialog: 'max-w-lg',
      iconSize: 'h-7 w-7',
    },
  };

  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity z-50" />
        <Dialog.Content
          className={`fixed z-50 w-full ${sizeConfig[size].dialog} rounded-xl bg-white p-6 shadow-xl transition-all top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2`}
        >
          <div className="flex flex-col space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                {icon && (
                  <div className={`${colorConfig[confirmColor].icon} ${sizeConfig[size].iconSize}`}>
                    {icon}
                  </div>
                )}
                <Dialog.Title className="text-lg font-semibold text-gray-900">
                  {title}
                </Dialog.Title>
              </div>
              <Dialog.Close asChild>
                <button
                  className="rounded-full p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </Dialog.Close>
            </div>

            {/* Description */}
            <Dialog.Description className="text-sm text-gray-500">
              {description}
            </Dialog.Description>

            {/* Footer */}
            <div className="flex justify-end space-x-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onClose(false)}
                disabled={loading}
              >
                {cancelLabel}
              </Button>
              <Button
                type="button"
                className={`${colorConfig[confirmColor].button} focus:ring-2 focus:ring-offset-2`}
                onClick={onConfirm}
                disabled={loading}
                isLoading={loading}
              >
                {confirmLabel}
              </Button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

ConfirmDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string,
  description: PropTypes.string,
  confirmLabel: PropTypes.string,
  cancelLabel: PropTypes.string,
  confirmColor: PropTypes.oneOf(['danger', 'warning', 'success', 'primary']),
  loading: PropTypes.bool,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  icon: PropTypes.node,
};