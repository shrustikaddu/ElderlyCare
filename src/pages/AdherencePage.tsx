import React, { useState } from 'react';
import { Download } from 'lucide-react';
import { AdherenceTrendChart, WeeklyAdherenceChart } from '../components/charts/AdherenceCharts';
import { PageHeader, StatTile } from '../components/common/UI';
import { useApp } from '../context/AppContext';
import { translateFrequency, translateWeekday } from '../i18n/helpers';

export const AdherencePage: React.FC = () => {
  const { medications, doseSlots, weeklyAdherence, showToast, t } = useApp();
  const [range, setRange] = useState<'7d' | '30d'>('7d');

  // Daily Summary Metrics
  const todayTaken = doseSlots.filter((d) => d.status === 'taken').length;
  const todayMissed = doseSlots.filter((d) => d.status === 'missed').length;
  const todayPending = doseSlots.filter((d) => d.status === 'pending').length;
  const todayTotal = doseSlots.length;
  const todayRate = todayTotal ? Math.round((todayTaken / todayTotal) * 100) : 0;

  // Weekly Summary Metrics
  const totalWeeklyDoses = weeklyAdherence.reduce((acc, d) => acc + d.total, 0);
  const totalWeeklyTaken = weeklyAdherence.reduce((acc, d) => acc + d.taken, 0);
  const totalWeeklyMissed = weeklyAdherence.reduce((acc, d) => acc + d.missed, 0);
  const overallRate = totalWeeklyDoses ? Math.round((totalWeeklyTaken / totalWeeklyDoses) * 100) : 0;

  const trendData30d = [
    { label: `${t.common.weekShort} 1`, rate: 89 },
    { label: `${t.common.weekShort} 2`, rate: 92 },
    { label: `${t.common.weekShort} 3`, rate: 95 },
    { label: `${t.common.weekShort} 4`, rate: overallRate },
  ];

  const trendData7d = weeklyAdherence.map((d) => ({
    label: translateWeekday(d.day, t),
    rate: d.rate,
  }));

  const periodLabels = {
    Morning: t.schedule.morning,
    Afternoon: t.schedule.afternoon,
    Evening: t.schedule.evening,
    Night: t.schedule.night,
  };

  const timeBreakdown = (['Morning', 'Afternoon', 'Evening', 'Night'] as const).map((period) => {
    const slots = doseSlots.filter((d) => d.timeOfDay === period);
    const taken = slots.filter((d) => d.status === 'taken').length;
    const rate = slots.length ? Math.round((taken / slots.length) * 100) : 0;
    return { period, label: periodLabels[period], total: slots.length, taken, rate };
  });

  const handleExportCsv = () => {
    const headers = ['Day', 'Taken', 'Missed', 'Total', 'AdherenceRate(%)'];
    const rows = weeklyAdherence.map((d) => [d.day, d.taken, d.missed, d.total, d.rate].join(','));
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'elderlycare_adherence_report.csv';
    a.click();
    URL.revokeObjectURL(url);
    showToast(t.adherence.csvDownloadedToast, 'success');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={t.nav.adherence}
        subtitle={t.adherence.subtitle}
        action={
          <button
            type="button"
            onClick={handleExportCsv}
            className="min-h-[44px] px-4 py-2.5 rounded-xl border border-[#BAE6FD] bg-[#F0F9FF] hover:bg-[#E0F2FE] text-[#0369A1] font-semibold text-sm flex items-center gap-2 whitespace-nowrap cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{t.actions.exportCsv}</span>
          </button>
        }
      />

      {/* Today's Daily Summary */}
      <section aria-label={t.adherence.dailySummaryTitle} className="space-y-3">
        <h2 className="text-base font-bold text-slate-900">{t.adherence.dailySummaryTitle}</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatTile
            label={t.adherence.todayRate}
            value={`${todayRate}%`}
            helper={`${todayTaken}/${todayTotal} ${t.adherence.takenWord}`}
            tone="blue"
          />
          <StatTile
            label={t.adherence.todayTaken}
            value={todayTaken}
            helper={`${t.adherence.outOfScheduledPrefix} ${todayTotal} ${t.adherence.outOfScheduledSuffix}`}
            tone="green"
          />
          <StatTile
            label={t.adherence.todayPending}
            value={todayPending}
            tone="neutral"
          />
          <StatTile
            label={t.adherence.todayMissed}
            value={todayMissed}
            helper={t.adherence.followUpHelper}
            tone={todayMissed > 0 ? 'red' : 'neutral'}
          />
        </div>
      </section>

      {/* 7-Day Weekly Summary */}
      <section aria-label={t.adherence.weeklySummaryTitle} className="space-y-3">
        <h2 className="text-base font-bold text-slate-900">{t.adherence.weeklySummaryTitle}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatTile
            label={t.adherence.weeklyRate}
            value={`${overallRate}%`}
            helper={t.adherence.targetHelper}
            tone="green"
          />
          <StatTile
            label={t.adherence.weeklyTaken}
            value={totalWeeklyTaken}
            helper={`${t.adherence.outOfScheduledPrefix} ${totalWeeklyDoses} ${t.adherence.outOfScheduledSuffix}`}
            tone="blue"
          />
          <StatTile
            label={t.adherence.weeklyMissed}
            value={totalWeeklyMissed}
            helper={t.adherence.followUpHelper}
            tone={totalWeeklyMissed > 0 ? 'amber' : 'neutral'}
          />
          <StatTile
            label={t.adherence.activeMeds}
            value={medications.length}
            helper={t.adherence.trackedDailyHelper}
            tone="neutral"
          />
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <section className="lg:col-span-6 ec-card rounded-2xl border border-[#DCE7F2] bg-white p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">
            {t.adherence.dailyCompletionTitle}
          </h2>
          <WeeklyAdherenceChart data={weeklyAdherence} height={220} />
        </section>

        <section className="lg:col-span-6 ec-card rounded-2xl border border-[#DCE7F2] bg-white p-6">
          <div className="flex items-center justify-between gap-3 mb-4">
            <h2 className="text-lg font-bold text-slate-900">{t.adherence.rateTrendTitle}</h2>
            <div className="flex items-center gap-1 p-1 rounded-lg bg-[#EFF6FB] border border-[#DCE7F2]">
              <button
                type="button"
                onClick={() => setRange('7d')}
                className={`px-3 py-1 rounded-md text-xs font-semibold cursor-pointer ${
                  range === '7d' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                {t.adherence.range7d}
              </button>
              <button
                type="button"
                onClick={() => setRange('30d')}
                className={`px-3 py-1 rounded-md text-xs font-semibold cursor-pointer ${
                  range === '30d' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                {t.adherence.range4w}
              </button>
            </div>
          </div>
          <AdherenceTrendChart data={range === '7d' ? trendData7d : trendData30d} />
        </section>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <section className="lg:col-span-5 ec-card rounded-2xl border border-[#DCE7F2] bg-white p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">{t.adherence.timeOfDayTitle}</h2>
          <div className="space-y-4">
            {timeBreakdown.map((item) => (
              <div key={item.period}>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="font-semibold text-slate-800">{item.label}</span>
                  <span className="font-mono-num text-slate-600">
                    {item.taken}/{item.total} ({item.rate}%)
                  </span>
                </div>
                <div className="w-full h-3 rounded-full bg-[#EFF6FB] overflow-hidden border border-[#DCE7F2]">
                  <div
                    className={`h-full rounded-full ${
                      item.total === 0
                        ? 'bg-slate-300'
                        : item.rate >= 80
                        ? 'bg-[#16A34A]'
                        : item.rate >= 50
                        ? 'bg-amber-500'
                        : 'bg-red-500'
                    }`}
                    style={{ width: `${item.rate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="lg:col-span-7 ec-card rounded-2xl border border-[#DCE7F2] bg-white p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">{t.adherence.perMedicineTitle}</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-[#DCE7F2] text-slate-600">
                  <th className="py-2.5 pr-4 font-semibold">{t.adherence.colMedicine}</th>
                  <th className="py-2.5 pr-4 font-semibold">{t.adherence.colSchedule}</th>
                  <th className="py-2.5 pr-4 font-semibold text-right">
                    {t.adherence.colTodayStatus}
                  </th>
                  <th className="py-2.5 font-semibold text-right">{t.adherence.colStockLeft}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {medications.map((med) => {
                  const slots = doseSlots.filter((s) => s.medicationId === med.id);
                  const taken = slots.filter((s) => s.status === 'taken').length;
                  return (
                    <tr key={med.id} className="hover:bg-[#F5F9FC]">
                      <td className="py-3 pr-4 font-semibold text-slate-900">
                        {med.name} <span className="font-normal text-slate-600">{med.dosage}</span>
                      </td>
                      <td className="py-3 pr-4 text-slate-600">
                        {translateFrequency(med.frequency, t)}
                      </td>
                      <td className="py-3 pr-4 text-right font-mono-num text-slate-800">
                        {taken}/{slots.length} {t.adherence.takenWord}
                      </td>
                      <td className="py-3 text-right font-mono-num font-semibold text-slate-900">
                        {med.stockCount} {t.adherence.unitsSuffix}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};
