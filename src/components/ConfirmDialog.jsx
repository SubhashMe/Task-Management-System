import React from 'react';
import { AlertTriangle, Trash2, RotateCcw } from 'lucide-react';
import { Modal } from './Modal';

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  description = 'Are you sure you want to proceed? This action cannot be undone.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger' // 'danger' | 'warning' | 'primary'
}) => {
  const isDanger = type === 'danger';
  const Icon = isDanger ? Trash2 : AlertTriangle;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="text-center py-2">
        <div
          className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
          style={{
            width: '54px',
            height: '54px',
            backgroundColor: isDanger ? 'rgba(239, 68, 68, 0.12)' : 'rgba(245, 158, 11, 0.12)',
            color: isDanger ? '#ef4444' : '#f59e0b'
          }}
        >
          <Icon size={26} />
        </div>

        <h5
          className="fw-bold mb-2"
          style={{ color: 'var(--text-primary)', fontSize: '1.1rem' }}
        >
          {title}
        </h5>

        <p
          className="text-muted mb-4"
          style={{ fontSize: '0.85rem', lineHeight: '1.5' }}
        >
          {description}
        </p>

        <div className="d-flex align-items-center justify-content-center gap-2">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-outline-secondary px-3 py-2"
            style={{
              fontSize: '0.85rem',
              fontWeight: 500,
              borderRadius: 'var(--radius-sm)',
              borderColor: 'var(--border-subtle)'
            }}
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`btn ${isDanger ? 'btn-danger' : 'btn-primary'} px-3 py-2`}
            style={{
              fontSize: '0.85rem',
              fontWeight: 500,
              borderRadius: 'var(--radius-sm)',
              backgroundColor: isDanger ? '#ef4444' : 'var(--brand-primary)',
              borderColor: isDanger ? '#ef4444' : 'var(--brand-primary)'
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
