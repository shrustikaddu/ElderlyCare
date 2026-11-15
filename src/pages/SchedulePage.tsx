import React, { useState } from 'react';
import { AlertTriangle, CheckCircle2, Clock, RotateCcw, Volume2 } from 'lucide-react';
import { PageHeader, ReadOnlyBanner, StatTile } from '../components/common/UI';
import { useApp } from '../context/AppContext';
import { translateMealInstruction } from '../i18n/helpers';
import { TimeOfDay } from '../types';

const TIME_SLOTS: TimeOfDay[] = ['Morning', 'Afternoon', 'Evening', 'Night'];

export const SchedulePage: React.FC = () => {
  const { doseSlots, markDoseStatus, language, speakText, permissions, navigateTo, t } = useApp();
  const [selectedPeriod, setSelectedPeriod] = useState<'All' | TimeOfDay>('All');

  const periodLabels: Record<'All' | TimeOfDay, string> = {
    All: t.schedule.all,
    Morning: t.schedule.morning,
    Afternoon: t.schedule.afternoon,
    Evening: t.schedule.evening,
    Night: t.schedule.night,
  };

  const totalCount = doseSlots.length;
  const takenCount = doseSlots.filter((d) => d.status === 'taken').length;
  const pendingCount = doseSlots.filter((d) => d.status === 'pending').length;
  const missedCount = doseSlots.filter((d) => d.status === 'missed').length;

  const visibleSlots =
    selectedPeriod === 'All'
      ? TIME_SLOTS
      : TIME_SLOTS.filter((slot) => slot === selectedPeriod);

  const handleSpeakPeriod = (period: TimeOfDay) => {
    const items = doseSlots.filter((d) => d.timeOfDay === period);
    const localizedPeriod = periodLabels[period];
    if (items.length === 0) {
      speakText(
        language === 'kn'
          ? `${localizedPeriod} ಸಮಯಕ್ಕೆ ಯಾವುದೇ ಔಷಧಿಗಳಿಲ್ಲ.`
          : `${t.schedule.noScheduledSpeechPrefix} ${period}.`,
        language
      );
      return;
    }
    const text =
      language === 'kn'
        ? `${localizedPeriod} ಔಷಧಿಗಳು: ${items.map((i) => `${i.medicationName} ${i.dosage}, ${i.time}`).join(', ')}`
        : `${period} schedule: ${items
            .map((i) => `${i.medicationName} ${i.dosage} at ${i.time}, ${i.mealInstruction}`)
            .join('. ')}`;
    speakText(text, language);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={t.nav.schedule}
        subtitle={t.schedule.subtitle}
        action={
          <div className="flex items-center gap-1 p-1 rounded-xl bg-[#EFF6FB] border border-[#DCE7F2] overflow-x-auto">
            {(['All', ...TIME_SLOTS] as const).map((period) => (
              <button
                key={period}
                type="button"
                onClick={() => setSelectedPeriod(period)}
                className={`min-h-[36px] px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap cursor-pointer ${
                  selectedPeriod === period
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {periodLabels[period]}
              </button>
            ))}
          </div>
        }
      />

      {!permissions.canConfirmDose && (
        <ReadOnlyBanner
          title={t.common.readOnlyNotice}
          message={t.common.permissionDenied}
          actionLabel={t.common.switchAccountBtn}
          onAction={() => navigateTo('auth')}
        />
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile label={t.schedule.totalSummary} value={totalCount} tone="blue" />
        <StatTile label={t.schedule.takenSummary} value={takenCount} tone="green" />
        <StatTile label={t.schedule.pendingSummary} value={pendingCount} tone="neutral" />
        <StatTile
          label={t.schedule.missedSummary}
          value={missedCount}
          tone={missedCount > 0 ? 'red' : 'neutral'}
        />
      </div>

      <div className="space-y-6">
        {visibleSlots.map((period) => {
          const items = doseSlots.filter((d) => d.timeOfDay === period);
          const periodTaken = items.filter((i) => i.status === 'taken').length;
          const periodPending = items.filter((i) => i.status === 'pending').length;
          const periodMissed = items.filter((i) => i.status === 'missed').length;
          const localizedPeriod = periodLabels[period];

          return (
            <section
              key={period}
              className="ec-card rounded-2xl border border-[#DCE7F2] bg-white p-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    {localizedPeriod} {t.schedule.dosesSuffix}
                  </h2>
                  <p className="text-sm text-slate-600 tabular-nums">
                    {periodTaken} {t.schedule.ofWord} {items.length} {t.schedule.takenSummary} ·{' '}
                    {periodPending} {t.schedule.pendingSummary} · {periodMissed}{' '}
                    {t.schedule.missedSummary}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleSpeakPeriod(period)}
                  className="min-h-[40px] px-4 py-2 rounded-xl border border-[#BAE6FD] bg-[#F0F9FF] hover:bg-[#E0F2FE] text-[#0369A1] text-sm font-semibold flex items-center gap-2 whitespace-nowrap w-fit cursor-pointer"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>
                    {t.schedule.readPeriodPrefix} {localizedPeriod}
                    {t.schedule.readPeriodSuffix ? ` ${t.schedule.readPeriodSuffix}` : ''}
                  </span>
                </button>
              </div>

              {items.length === 0 ? (
                <p className="py-6 text-base text-slate-500">
                  {t.schedule.emptyPeriodPrefix} {localizedPeriod.toLowerCase()}.
                </p>
              ) : (
                <div className="divide-y divide-slate-100">
                  {items.map((dose) => (
                    <div
                      key={dose.id}
                      className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="font-mono-num text-base font-bold text-[#0369A1]">
                            {dose.time}
                          </span>
                          <span className="text-lg font-bold text-slate-900">
                            {dose.medicationName}
                          </span>
                          <span className="text-base font-medium text-slate-600">
                            {dose.dosage}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600">
                          {translateMealInstruction(dose.mealInstruction, t)}
                          {dose.takenAt
                            ? ` · ${t.schedule.loggedTakenPrefix} ${dose.takenAt} ${t.schedule.byWord} ${dose.loggedBy}`
                            : ''}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                        {dose.status === 'taken' && (
                          <>
                            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#15803D] mr-2">
                              <CheckCircle2 className="w-4 h-4" />
                              <span>{t.status.taken}</span>
                            </span>
                            {permissions.canConfirmDose && (
                              <button
                                type="button"
                                onClick={() => markDoseStatus(dose.id, 'pending')}
                                className="min-h-[40px] px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium inline-flex items-center gap-1.5 cursor-pointer"
                              >
                                <RotateCcw className="w-4 h-4" />
                                <span>{t.actions.reset}</span>
                              </button>
                            )}
                          </>
                        )}

                        {dose.status === 'missed' && (
                          <>
                            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-red-700 mr-2">
                              <AlertTriangle className="w-4 h-4" />
                              <span>{t.status.missed}</span>
                            </span>
                            {permissions.canConfirmDose && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => markDoseStatus(dose.id, 'taken')}
                                  className="min-h-[42px] px-4 py-2 rounded-xl bg-[#15803D] hover:bg-[#166534] text-white text-sm font-semibold cursor-pointer"
                                >
                                  {t.actions.markTaken}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => markDoseStatus(dose.id, 'pending')}
                                  className="min-h-[40px] px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium inline-flex items-center gap-1.5 cursor-pointer"
                                >
                                  <RotateCcw className="w-4 h-4" />
                                  <span>{t.actions.reset}</span>
                                </button>
                              </>
                            )}
                          </>
                        )}

                        {dose.status === 'pending' && (
                          <>
                            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 mr-2">
                              <Clock className="w-4 h-4" />
                              <span>{t.status.pending}</span>
                            </span>
                            {permissions.canConfirmDose && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => markDoseStatus(dose.id, 'taken')}
                                  className="min-h-[42px] px-4 py-2 rounded-xl bg-[#15803D] hover:bg-[#166534] text-white text-sm font-semibold cursor-pointer"
                                >
                                  {t.actions.markTaken}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => markDoseStatus(dose.id, 'missed')}
                                  className="min-h-[42px] px-4 py-2 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 text-sm font-semibold cursor-pointer"
                                >
                                  {t.actions.markMissed}
                                </button>
                              </>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
};
