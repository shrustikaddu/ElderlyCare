import React, { useState } from 'react';
import { CloudOff, Download, Smartphone, Wifi, WifiOff } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { Modal } from './UI';

export const ConnectivityStatusBadge: React.FC = () => {
  const isOnline = useOnlineStatus();
  const { t, pendingChangesCount } = useApp();

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={isOnline ? t.common.onlineLabel : t.common.offlineLabel}
      title={
        !isOnline && pendingChangesCount > 0 ? t.common.pendingChangesTooltip : undefined
      }
      className={`relative min-h-[38px] px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
        isOnline
          ? 'border-[#C6EBD4] bg-[#F0FAF4] text-[#15803D]'
          : 'border-amber-300 bg-amber-50 text-amber-900'
      }`}
    >
      {isOnline ? (
        <Wifi className="w-3.5 h-3.5 shrink-0" />
      ) : (
        <WifiOff className="w-3.5 h-3.5 shrink-0" />
      )}
      <span className="hidden sm:inline">
        {isOnline ? t.common.onlineLabel : t.common.offlineLabel}
      </span>

      {/* Pending changes badge — shown even when back online until cleared */}
      {pendingChangesCount > 0 && (
        <span
          aria-label={`${pendingChangesCount} ${t.common.pendingChangesLabel}`}
          className="ml-0.5 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-amber-500 text-white text-[10px] font-bold leading-none"
        >
          {pendingChangesCount}
        </span>
      )}
    </div>
  );
};

export const OfflineBanner: React.FC = () => {
  const isOnline = useOnlineStatus();
  const { t, pendingChangesCount } = useApp();

  if (isOnline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="mb-4 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 flex items-start gap-3 text-amber-950"
    >
      <WifiOff className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold">{t.common.offlineBannerTitle}</p>
        <p className="text-xs text-amber-900 mt-0.5">{t.common.offlineBannerBody}</p>

        {pendingChangesCount > 0 && (
          <div className="mt-2 flex items-start gap-1.5">
            <CloudOff className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800 font-medium">
              <span className="font-bold">{pendingChangesCount}</span>{' '}
              {t.common.pendingChangesLabel}.{' '}
              <span className="font-normal">{t.common.pendingChangesTooltip}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const { t } = useApp();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) return null;

  if (isInstallable) {
    return (
      <button
        type="button"
        onClick={install}
        className="min-h-[40px] px-3 py-1.5 rounded-xl border border-[#BAE6FD] bg-[#F0F9FF] hover:bg-[#E0F2FE] text-[#0369A1] text-xs sm:text-sm font-semibold flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
      >
        <Download className="w-4 h-4 shrink-0" />
        <span className="hidden md:inline">{t.common.installApp}</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          type="button"
          onClick={() => setShowIOSGuide(true)}
          className="min-h-[40px] px-3 py-1.5 rounded-xl border border-[#BAE6FD] bg-[#F0F9FF] hover:bg-[#E0F2FE] text-[#0369A1] text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Smartphone className="w-4 h-4 shrink-0" />
          <span className="hidden md:inline">{t.common.installOnIos}</span>
        </button>

        <Modal
          open={showIOSGuide}
          onClose={() => setShowIOSGuide(false)}
          title={t.common.iosInstallTitle}
          closeLabel={t.common.closeModal}
          maxWidth="max-w-sm"
        >
          <div className="space-y-3 text-sm text-slate-700">
            <p>{t.common.iosInstallStep1}</p>
            <p>{t.common.iosInstallStep2}</p>
          </div>
        </Modal>
      </>
    );
  }

  return null;
};
