import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export const Modal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  size = 'md'
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  const maxWidths = {
    sm: '420px',
    md: '560px',
    lg: '780px',
    xl: '980px'
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1050,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)'
      }}
      onClick={onClose}
    >
      <div
        className="card shadow-lg animate-scale-up"
        style={{
          width: '100%',
          maxWidth: maxWidths[size] || '560px',
          maxHeight: '90vh',
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-xl)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="d-flex align-items-center justify-content-between p-3 p-md-4 border-bottom"
          style={{ borderColor: 'var(--border-subtle)' }}
        >
          <div>
            <h5
              className="fw-bold mb-0"
              style={{ color: 'var(--text-primary)', fontSize: '1.1rem' }}
            >
              {title}
            </h5>
            {subtitle && (
              <p
                className="text-muted mb-0 mt-1"
                style={{ fontSize: '0.8rem' }}
              >
                {subtitle}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-sm btn-link text-muted p-1 rounded-circle"
            aria-label="Close"
            style={{ textDecoration: 'none' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div
          className="p-3 p-md-4"
          style={{
            overflowY: 'auto',
            flex: 1,
            color: 'var(--text-primary)',
            fontSize: '0.875rem'
          }}
        >
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div
            className="p-3 border-top d-flex align-items-center justify-content-end gap-2"
            style={{
              borderColor: 'var(--border-subtle)',
              backgroundColor: 'var(--bg-subtle)'
            }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
