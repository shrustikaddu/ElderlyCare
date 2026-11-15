import React, { useEffect } from 'react';
import { AlertCircle, CheckCircle2, Info, UserRound, X } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, action }) => (
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-[#DCE7F2]">
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900" style={{ textWrap: 'balance' }}>
        {title}
      </h1>
      {subtitle && <p className="mt-1.5 text-base text-slate-600 max-w-2xl">{subtitle}</p>}
    </div>
    {action && <div className="flex items-center gap-3 shrink-0">{action}</div>}
  </div>
);

interface StatTileProps {
  label: string;
  value: string | number;
  helper?: string;
  tone?: 'blue' | 'green' | 'amber' | 'red' | 'neutral';
  icon?: React.ReactNode;
  onClick?: () => void;
}

export const StatTile: React.FC<StatTileProps> = ({
  label,
  value,
  helper,
  tone = 'neutral',
  icon,
  onClick,
}) => {
  const toneClasses: Record<NonNullable<StatTileProps['tone']>, string> = {
    blue: 'bg-[#F0F7FC] border-[#CBE2F5] text-sky-900',
    green: 'bg-[#F0FAF4] border-[#C6EBD4] text-emerald-900',
    amber: 'bg-[#FFFBEB] border-[#FDE68A] text-amber-900',
    red: 'bg-[#FEF2F2] border-[#FECACA] text-red-900',
    neutral: 'bg-white border-[#DCE7F2] text-slate-900',
  };

  const Wrapper = onClick ? 'button' : 'div';

  return (
    <Wrapper
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={`ec-card w-full text-left rounded-xl border p-5 transition-colors duration-150 ${toneClasses[tone]} ${
        onClick ? 'hover:border-sky-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 cursor-pointer' : ''
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-slate-600">{label}</span>
        {icon && <span className="text-slate-500 shrink-0">{icon}</span>}
      </div>
      <div className="mt-2.5 text-3xl font-bold tracking-tight tabular-nums font-display">{value}</div>
      {helper && <p className="mt-1.5 text-sm text-slate-600">{helper}</p>}
    </Wrapper>
  );
};

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: string;
  closeLabel?: string;
}

export const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'max-w-xl',
  closeLabel = 'Close modal',
}) => {
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-[2px] p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={onClose}
    >
      <div
        className={`w-full ${maxWidth} max-h-[90vh] overflow-y-auto rounded-2xl bg-white border border-[#D9E5F0] shadow-xl`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-[#E5EEF6] sticky top-0 bg-white z-10">
          <div>
            <h2 id="modal-title" className="text-xl font-bold text-slate-900">
              {title}
            </h2>
            {subtitle && <p className="mt-1 text-sm text-slate-600">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={closeLabel}
            className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-sky-600 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title,
  message,
  confirmLabel = 'Confirm Delete',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
}) => (
  <Modal open={open} onClose={onCancel} title={title} maxWidth="max-w-md">
    <p className="text-base text-slate-700 leading-relaxed">{message}</p>
    <div className="mt-6 flex items-center justify-end gap-3">
      <button
        type="button"
        onClick={onCancel}
        className="min-h-[44px] px-5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 font-medium hover:bg-slate-50 whitespace-nowrap shrink-0 cursor-pointer"
      >
        {cancelLabel}
      </button>
      <button
        type="button"
        onClick={onConfirm}
        className="min-h-[44px] px-5 py-2.5 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 whitespace-nowrap shrink-0 cursor-pointer"
      >
        {confirmLabel}
      </button>
    </div>
  </Modal>
);

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
}) => (
  <div className="rounded-xl border border-dashed border-[#C7DAEC] bg-white px-6 py-12 text-center">
    <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
    <p className="mt-2 text-base text-slate-600 max-w-md mx-auto">{description}</p>
    {actionLabel && onAction && (
      <button
        type="button"
        onClick={onAction}
        className="mt-5 min-h-[44px] px-5 py-2.5 rounded-xl bg-[#0369A1] text-white font-semibold hover:bg-[#075985] transition-colors cursor-pointer"
      >
        {actionLabel}
      </button>
    )}
  </div>
);

export const DemoBanner: React.FC<{ text: string }> = ({ text }) => (
  <div className="mb-5 flex items-center gap-2.5 rounded-xl border border-[#CBE2F5] bg-[#EFF7FD] px-4 py-2.5 text-sm text-sky-900">
    <Info className="w-4 h-4 text-[#0369A1] shrink-0" />
    <span>{text}</span>
  </div>
);

export const SafeImage: React.FC<{
  src?: string;
  alt: string;
  className?: string;
}> = ({ src, alt, className = 'w-12 h-12 rounded-full object-cover' }) => {
  const [failed, setFailed] = React.useState(false);

  if (!src || failed) {
    return (
      <div
        className={`${className} flex items-center justify-center bg-[#E0F2FE] text-[#0369A1] border border-[#BAE6FD]`}
        aria-label={alt}
      >
        <UserRound className="w-1/2 h-1/2" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
};

export const ReadOnlyBanner: React.FC<{
  title: string;
  message: string;
  actionLabel: string;
  onAction: () => void;
}> = ({ title, message, actionLabel, onAction }) => (
  <div
    role="status"
    className="rounded-xl border border-[#CBE2F5] bg-[#F0F7FC] px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
  >
    <div className="flex items-start gap-2.5 text-sm text-sky-950">
      <Info className="w-4 h-4 text-[#0369A1] shrink-0 mt-0.5" />
      <p>
        <strong>{title}:</strong> {message}
      </p>
    </div>
    <button
      type="button"
      onClick={onAction}
      className="min-h-[36px] px-3.5 py-1.5 rounded-lg border border-[#BAE6FD] bg-white hover:bg-[#E0F2FE] text-[#0369A1] text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer"
    >
      {actionLabel}
    </button>
  </div>
);

export const ToastNotification: React.FC<{
  toast: { message: string; tone: 'info' | 'success' | 'warning' | 'error' } | null;
  onDismiss: () => void;
  dismissLabel?: string;
}> = ({ toast, onDismiss, dismissLabel = 'Dismiss notification' }) => {
  if (!toast) return null;

  const toneStyle = {
    info: 'bg-slate-900 text-white border-slate-700',
    success: 'bg-emerald-800 text-white border-emerald-700',
    warning: 'bg-amber-800 text-white border-amber-700',
    error: 'bg-red-700 text-white border-red-600',
  }[toast.tone];

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-md">
      <div
        role="status"
        className={`flex items-center gap-3 rounded-xl border px-4 py-3.5 shadow-lg ${toneStyle}`}
      >
        {toast.tone === 'success' ? (
          <CheckCircle2 className="w-5 h-5 shrink-0" />
        ) : toast.tone === 'warning' || toast.tone === 'error' ? (
          <AlertCircle className="w-5 h-5 shrink-0" />
        ) : (
          <Info className="w-5 h-5 shrink-0" />
        )}
        <p className="text-sm font-medium">{toast.message}</p>
        <button
          type="button"
          onClick={onDismiss}
          aria-label={dismissLabel}
          className="ml-2 p-1 rounded-md hover:bg-white/15 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
