import React, { useState } from 'react';
import { AlertTriangle, Bell, CheckCheck, Info, ShieldAlert, Trash2 } from 'lucide-react';
import { EmptyState, PageHeader } from '../components/common/UI';
import { useApp } from '../context/AppContext';
import { NotificationCategory } from '../types';

export const NotificationsPage: React.FC = () => {
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    deleteNotification,
    triggerMissedDoseSimulation,
    permissions,
    navigateTo,
    t,
  } = useApp();

  const [categoryFilter, setCategoryFilter] = useState<'all' | 'unread' | NotificationCategory>('all');

  const filtered = notifications.filter((n) => {
    if (categoryFilter === 'all') return true;
    if (categoryFilter === 'unread') return !n.isRead;
    return n.category === categoryFilter;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title={t.nav.notifications}
        subtitle={t.notifications.subtitle}
        action={
          <div className="flex flex-wrap items-center gap-2.5">
            {permissions.canEditSchedule && (
              <button
                type="button"
                onClick={triggerMissedDoseSimulation}
                className="min-h-[42px] px-4 py-2 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 font-semibold text-sm flex items-center gap-2 whitespace-nowrap cursor-pointer"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>{t.notifications.testAlertBtn}</span>
              </button>
            )}
            <button
              type="button"
              onClick={markAllNotificationsRead}
              className="min-h-[42px] px-4 py-2 rounded-xl border border-[#DCE7F2] bg-white hover:bg-[#F5F9FC] text-slate-800 font-semibold text-sm flex items-center gap-2 whitespace-nowrap cursor-pointer"
            >
              <CheckCheck className="w-4 h-4 text-[#0369A1]" />
              <span>{t.notifications.markAllReadBtn}</span>
            </button>
          </div>
        }
      />

      <div className="flex items-center gap-1 p-1 rounded-xl bg-[#EFF6FB] border border-[#DCE7F2] w-fit overflow-x-auto">
        {(
          [
            { id: 'all', label: `${t.notifications.filterAll} (${notifications.length})` },
            {
              id: 'unread',
              label: `${t.notifications.filterUnread} (${notifications.filter((n) => !n.isRead).length})`,
            },
            { id: 'missed_dose', label: t.notifications.filterMissed },
            { id: 'low_stock', label: t.notifications.filterLowStock },
            { id: 'appointment', label: t.notifications.filterAppointments },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setCategoryFilter(tab.id)}
            className={`min-h-[36px] px-3.5 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap cursor-pointer ${
              categoryFilter === tab.id
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState title={t.notifications.emptyTitle} description={t.notifications.emptyDesc} />
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => (
            <article
              key={item.id}
              className={`ec-card rounded-2xl border p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                item.isRead
                  ? 'bg-white border-[#DCE7F2]'
                  : item.severity === 'critical'
                  ? 'bg-[#FEF2F2] border-red-200'
                  : item.severity === 'warning'
                  ? 'bg-[#FFFBEB] border-amber-200'
                  : 'bg-[#F0F7FC] border-[#BAE6FD]'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="mt-0.5 shrink-0">
                  {item.severity === 'critical' ? (
                    <ShieldAlert className="w-5 h-5 text-red-600" />
                  ) : item.severity === 'warning' ? (
                    <AlertTriangle className="w-5 h-5 text-amber-700" />
                  ) : item.isRead ? (
                    <Info className="w-5 h-5 text-slate-400" />
                  ) : (
                    <Bell className="w-5 h-5 text-[#0369A1]" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-base font-bold text-slate-900">{item.title}</h2>
                    {!item.isRead && (
                      <span className="text-xs font-bold text-[#0369A1]">
                        {t.notifications.unreadTag}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-slate-700 leading-relaxed">{item.message}</p>
                  <p className="mt-1.5 text-xs text-slate-500">{item.timestamp}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {item.actionPage && (
                  <button
                    type="button"
                    onClick={() => {
                      markNotificationRead(item.id);
                      navigateTo(item.actionPage!);
                    }}
                    className="min-h-[38px] px-3.5 py-1.5 rounded-xl bg-white border border-[#CBD8E6] hover:bg-slate-50 text-sm font-semibold text-[#0369A1] whitespace-nowrap cursor-pointer"
                  >
                    {t.notifications.reviewBtn}
                  </button>
                )}
                {!item.isRead && (
                  <button
                    type="button"
                    onClick={() => markNotificationRead(item.id)}
                    className="min-h-[38px] px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-sm font-medium text-slate-700 whitespace-nowrap cursor-pointer"
                  >
                    {t.notifications.markReadBtn}
                  </button>
                )}
                {permissions.canEditSchedule && (
                  <button
                    type="button"
                    onClick={() => deleteNotification(item.id)}
                    aria-label={t.notifications.deleteAria}
                    className="min-h-[38px] min-w-[38px] flex items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-red-50 text-slate-500 hover:text-red-700 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};
