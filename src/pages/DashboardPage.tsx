import React from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Bell,
  Calendar,
  CheckCircle2,
  Clock,
  Package,
  Pill,
  ShieldCheck,
  Speaker,
  Volume2,
} from 'lucide-react';
import { WeeklyAdherenceChart } from '../components/charts/AdherenceCharts';
import { PageHeader, StatTile } from '../components/common/UI';
import { useApp } from '../context/AppContext';
import {
  translateMealInstruction,
  translateTimeOfDay,
  translateVisitType,
} from '../i18n/helpers';

export const DashboardPage: React.FC = () => {
  const {
    t,
    language,
    currentUser,
    permissions,
    patientProfile,
    medications,
    doseSlots,
    appointments,
    notifications,
    activities,
    weeklyAdherence,
    speakerConfig,
    markDoseStatus,
    restockMedication,
    broadcastToSpeaker,
    navigateTo,
    speakText,
  } = useApp();

  const totalMedicines = medications.length;
  const todaysTotal = doseSlots.length;
  const takenCount = doseSlots.filter((d) => d.status === 'taken').length;
  const missedCount = doseSlots.filter((d) => d.status === 'missed').length;
  const upcomingAppts = appointments.filter((a) => a.status === 'Scheduled');
  const lowStockMeds = medications.filter((m) => m.stockCount <= m.lowStockThreshold);
  const unreadNotifications = notifications.filter((n) => !n.isRead);
  const nextPending = doseSlots.find((d) => {
    if (d.status !== 'pending' && d.status !== 'missed') return false;
    const med = medications.find((m) => m.id === d.medicationId);
    return med ? med.reminderEnabled : true;
  });

  const canManageSchedule = permissions.canManageMedications || permissions.canEditSchedule;

  const handleReadSummary = () => {
    const pending = doseSlots.filter((d) => d.status === 'pending');
    const summary =
      language === 'kn'
        ? `${patientProfile.fullName} ಅವರಿಗೆ ಇಂದು ಒಟ್ಟು ${todaysTotal} ಔಷಧಿಗಳಲ್ಲಿ ${takenCount} ತೆಗೆದುಕೊಳ್ಳಲಾಗಿದೆ, ${missedCount} ತಪ್ಪಿದೆ, ಮತ್ತು ${pending.length} ಬಾಕಿ ಇದೆ.`
        : `Care summary for ${patientProfile.fullName}. Out of ${todaysTotal} scheduled doses today, ${takenCount} have been taken, ${missedCount} missed, and ${pending.length} remain pending.`;
    speakText(summary, language);
  };

  return (
    <div className="space-y-7">
      <PageHeader
        title={`${t.dashboard.welcomePrefix} ${patientProfile.fullName}`}
        subtitle={t.dashboard.subtitle}
        action={
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => navigateTo('speaker')}
              className="min-h-[44px] px-4 py-2.5 rounded-xl bg-[#0369A1] hover:bg-[#075985] text-white font-semibold text-sm flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Speaker className="w-4 h-4" />
              <span>{t.dashboard.openSmartSpeaker}</span>
            </button>
            <button
              type="button"
              onClick={handleReadSummary}
              className="min-h-[44px] px-4 py-2.5 rounded-xl border border-[#BAE6FD] bg-[#F0F9FF] text-[#0369A1] hover:bg-[#E0F2FE] font-semibold text-sm flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
              <span>{t.actions.readAloud}</span>
            </button>
          </div>
        }
      />

      {/* Remote Family & Caretaker Smart Speaker Status Strip */}
      <section
        aria-label={t.dashboard.remoteScheduleSync}
        className="ec-card rounded-2xl border border-[#C6EBD4] bg-[#F0FAF4] p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
      >
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-white border border-[#C6EBD4] text-[#15803D] flex items-center justify-center shrink-0">
            <Speaker className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900">
              {t.dashboard.remoteScheduleSync} · {speakerConfig.roomLocation} (
              {speakerConfig.isOnline ? t.dashboard.online : t.dashboard.standby})
            </p>
            <p className="mt-0.5 text-sm text-slate-700">
              {t.dashboard.signedInAs} <strong>{t.roles[currentUser.role]}</strong>.{' '}
              {patientProfile.fullName} {t.dashboard.speakerNoPhoneNote}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {nextPending && permissions.canBroadcastSpeaker && (
            <button
              type="button"
              onClick={() => broadcastToSpeaker({ dose: nextPending })}
              className="min-h-[40px] px-4 py-2 rounded-xl bg-[#15803D] hover:bg-[#166534] text-white text-sm font-semibold flex items-center gap-2 whitespace-nowrap cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
              <span>
                {t.dashboard.remindPrefix} {nextPending.medicationName}
                {t.dashboard.remindSuffix ? ` ${t.dashboard.remindSuffix}` : ''}
              </span>
            </button>
          )}
          {canManageSchedule && (
            <button
              type="button"
              onClick={() => navigateTo('medications')}
              className="min-h-[40px] px-4 py-2 rounded-xl border border-[#A7F3D0] bg-white hover:bg-emerald-50 text-emerald-950 text-sm font-semibold whitespace-nowrap cursor-pointer"
            >
              {t.dashboard.manageSchedulesRemotely}
            </button>
          )}
        </div>
      </section>

      {/* Caregiver Access Permissions Strip */}
      <section
        aria-label={t.dashboard.permissionsTitle}
        className="ec-card rounded-2xl border border-[#CBE2F5] bg-[#F0F7FC] px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
      >
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-[#0369A1] shrink-0" />
          <p className="text-sm text-slate-800">
            <strong>{t.dashboard.permissionsTitle}:</strong>{' '}
            {canManageSchedule
              ? t.dashboard.permissionsSummaryCanEdit
              : t.dashboard.permissionsSummaryViewConfirm}
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigateTo('family')}
          className="text-sm font-semibold text-[#0369A1] hover:underline whitespace-nowrap shrink-0 cursor-pointer"
        >
          {t.dashboard.permissionsManageLink}
        </button>
      </section>

      {/* 5 Core KPI Summary Metrics */}
      <section aria-label={t.dashboard.dailyCareSummaryAria} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatTile
          label={t.dashboard.totalMedicines}
          value={totalMedicines}
          helper={`${lowStockMeds.length} ${t.dashboard.lowStockHelper}`}
          tone="blue"
          icon={<Pill className="w-5 h-5 text-[#0369A1]" />}
          onClick={() => navigateTo('medications')}
        />
        <StatTile
          label={t.dashboard.todaysMedicines}
          value={todaysTotal}
          helper={`${doseSlots.filter((d) => d.status === 'pending').length} ${t.dashboard.pendingTodayHelper}`}
          tone="neutral"
          icon={<Clock className="w-5 h-5 text-slate-600" />}
          onClick={() => navigateTo('schedule')}
        />
        <StatTile
          label={t.dashboard.takenMedicines}
          value={takenCount}
          helper={`${todaysTotal ? Math.round((takenCount / todaysTotal) * 100) : 0}${t.dashboard.completedHelper}`}
          tone="green"
          icon={<CheckCircle2 className="w-5 h-5 text-[#15803D]" />}
          onClick={() => navigateTo('schedule')}
        />
        <StatTile
          label={t.dashboard.missedMedicines}
          value={missedCount}
          helper={missedCount > 0 ? t.dashboard.actionNeeded : t.dashboard.onTrack}
          tone={missedCount > 0 ? 'red' : 'neutral'}
          icon={
            <AlertTriangle
              className={`w-5 h-5 ${missedCount > 0 ? 'text-red-600' : 'text-slate-500'}`}
            />
          }
          onClick={() => navigateTo('notifications')}
        />
        <StatTile
          label={t.dashboard.upcomingAppointments}
          value={upcomingAppts.length}
          helper={
            upcomingAppts[0]
              ? `${upcomingAppts[0].date} · ${upcomingAppts[0].time}`
              : t.dashboard.noneScheduled
          }
          tone="blue"
          icon={<Calendar className="w-5 h-5 text-[#0369A1]" />}
          onClick={() => navigateTo('appointments')}
        />
      </section>

      {/* Main 2-Column Analytical & Queue Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Today's Dose Queue */}
        <section className="lg:col-span-7 ec-card rounded-2xl border border-[#DCE7F2] bg-white p-6">
          <div className="flex items-center justify-between gap-4 mb-5">
            <div>
              <h2 className="text-lg font-bold text-slate-900">{t.dashboard.todaysDoseQueue}</h2>
              <p className="text-sm text-slate-600">{t.dashboard.todaysQueueSubtitle}</p>
            </div>
            <button
              type="button"
              onClick={() => navigateTo('schedule')}
              className="text-sm font-semibold text-[#0369A1] hover:underline inline-flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span>{t.dashboard.viewAll}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {doseSlots.map((slot) => (
              <div
                key={slot.id}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="font-mono-num text-sm font-semibold text-[#0369A1]">
                      {slot.time}
                    </span>
                    <span aria-hidden="true" className="text-slate-300">
                      ·
                    </span>
                    <span className="text-base font-semibold text-slate-900">
                      {slot.medicationName}
                    </span>
                    <span className="text-sm text-slate-600">{slot.dosage}</span>
                  </div>
                  <p className="mt-0.5 text-sm text-slate-500">
                    {translateTimeOfDay(slot.timeOfDay, t)} ·{' '}
                    {translateMealInstruction(slot.mealInstruction, t)}
                    {slot.takenAt ? ` · ${t.dashboard.takenAt} ${slot.takenAt}` : ''}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {slot.status === 'taken' ? (
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#15803D]">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{t.status.taken}</span>
                    </span>
                  ) : slot.status === 'missed' ? (
                    <>
                      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-red-700 mr-1">
                        <AlertTriangle className="w-4 h-4" />
                        <span>{t.status.missed}</span>
                      </span>
                      {permissions.canConfirmDose && (
                        <button
                          type="button"
                          onClick={() => markDoseStatus(slot.id, 'taken')}
                          className="min-h-[38px] px-3.5 py-1.5 rounded-lg bg-[#15803D] hover:bg-[#166534] text-white text-sm font-semibold whitespace-nowrap cursor-pointer"
                        >
                          {t.actions.markTaken}
                        </button>
                      )}
                    </>
                  ) : permissions.canConfirmDose ? (
                    <>
                      <button
                        type="button"
                        onClick={() => markDoseStatus(slot.id, 'taken')}
                        className="min-h-[38px] px-3.5 py-1.5 rounded-lg bg-[#15803D] hover:bg-[#166534] text-white text-sm font-semibold whitespace-nowrap cursor-pointer"
                      >
                        {t.actions.markTaken}
                      </button>
                      <button
                        type="button"
                        onClick={() => markDoseStatus(slot.id, 'missed')}
                        className="min-h-[38px] px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium whitespace-nowrap cursor-pointer"
                      >
                        {t.actions.markMissed}
                      </button>
                    </>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600">
                      <Clock className="w-4 h-4" />
                      <span>{t.status.pending}</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Adherence Chart + Low Stock Watchlist */}
        <div className="lg:col-span-5 space-y-6">
          <section className="ec-card rounded-2xl border border-[#DCE7F2] bg-white p-6">
            <div className="flex items-center justify-between gap-2 mb-4">
              <h2 className="text-lg font-bold text-slate-900">{t.dashboard.adherenceChartTitle}</h2>
              <button
                type="button"
                onClick={() => navigateTo('adherence')}
                className="text-sm font-semibold text-[#0369A1] hover:underline whitespace-nowrap cursor-pointer"
              >
                {t.dashboard.analyticsLink}
              </button>
            </div>
            <WeeklyAdherenceChart data={weeklyAdherence} height={200} />
          </section>

          <section className="ec-card rounded-2xl border border-[#DCE7F2] bg-white p-6">
            <div className="flex items-center justify-between gap-2 mb-4">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-amber-700" />
                <h2 className="text-lg font-bold text-slate-900">{t.dashboard.lowStockAlerts}</h2>
              </div>
              <button
                type="button"
                onClick={() => navigateTo('medications')}
                className="text-sm font-semibold text-[#0369A1] hover:underline whitespace-nowrap cursor-pointer"
              >
                {t.dashboard.manageStockLink}
              </button>
            </div>

            {lowStockMeds.length === 0 ? (
              <p className="text-sm text-slate-600">{t.dashboard.allStockHealthy}</p>
            ) : (
              <div className="divide-y divide-slate-100">
                {lowStockMeds.map((med) => (
                  <div key={med.id} className="py-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-900">
                        {med.name}{' '}
                        <span className="text-sm font-normal text-slate-600">{med.dosage}</span>
                      </p>
                      <p className="text-sm text-amber-800 font-medium tabular-nums">
                        {med.stockCount} {t.dashboard.tabletsLeft} · {t.dashboard.thresholdLabel}{' '}
                        {med.lowStockThreshold}
                      </p>
                    </div>
                    {canManageSchedule && (
                      <button
                        type="button"
                        onClick={() => restockMedication(med.id, 15)}
                        className="min-h-[38px] px-3.5 py-1.5 rounded-lg border border-[#BAE6FD] bg-[#F0F9FF] hover:bg-[#E0F2FE] text-[#0369A1] text-sm font-semibold whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        {t.actions.restock}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>

      {/* Bottom 3-Column Row: Upcoming Appointments, Notifications, Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="ec-card rounded-2xl border border-[#DCE7F2] bg-white p-6">
          <div className="flex items-center justify-between gap-2 mb-4">
            <h2 className="text-lg font-bold text-slate-900">
              {t.dashboard.upcomingAppointments}
            </h2>
            <button
              type="button"
              onClick={() => navigateTo('appointments')}
              className="text-sm font-semibold text-[#0369A1] hover:underline cursor-pointer"
            >
              {t.dashboard.viewAll}
            </button>
          </div>
          <div className="divide-y divide-slate-100">
            {upcomingAppts.length === 0 ? (
              <p className="text-sm text-slate-600">{t.dashboard.noUpcomingAppointments}</p>
            ) : (
              upcomingAppts.map((appt) => (
                <div key={appt.id} className="py-3">
                  <p className="font-semibold text-slate-900">{appt.doctorName}</p>
                  <p className="text-sm text-slate-600">
                    {appt.specialty} · {translateVisitType(appt.visitType, t)}
                  </p>
                  <p className="mt-1 font-mono-num text-sm font-medium text-[#0369A1]">
                    {appt.date} · {appt.time}
                  </p>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="ec-card rounded-2xl border border-[#DCE7F2] bg-white p-6">
          <div className="flex items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-[#0369A1]" />
              <h2 className="text-lg font-bold text-slate-900">{t.dashboard.notificationsTitle}</h2>
            </div>
            <button
              type="button"
              onClick={() => navigateTo('notifications')}
              className="text-sm font-semibold text-[#0369A1] hover:underline cursor-pointer"
            >
              {unreadNotifications.length} {t.dashboard.unreadLabel}
            </button>
          </div>
          <div className="divide-y divide-slate-100">
            {notifications.slice(0, 4).map((item) => (
              <div key={item.id} className="py-3">
                <p
                  className={`text-sm font-semibold ${
                    item.severity === 'critical'
                      ? 'text-red-700'
                      : item.severity === 'warning'
                      ? 'text-amber-800'
                      : 'text-slate-900'
                  }`}
                >
                  {item.title}
                </p>
                <p className="mt-0.5 text-sm text-slate-600 line-clamp-2">{item.message}</p>
                <p className="mt-1 text-xs text-slate-500">{item.timestamp}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="ec-card rounded-2xl border border-[#DCE7F2] bg-white p-6">
          <div className="flex items-center justify-between gap-2 mb-4">
            <h2 className="text-lg font-bold text-slate-900">{t.dashboard.recentActivities}</h2>
          </div>
          <div className="divide-y divide-slate-100">
            {activities.slice(0, 5).map((act) => (
              <div key={act.id} className="py-3">
                <p className="text-sm font-medium text-slate-900">{act.description}</p>
                <p className="mt-0.5 text-xs text-slate-500">
                  {act.actor} · {act.timestamp}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
