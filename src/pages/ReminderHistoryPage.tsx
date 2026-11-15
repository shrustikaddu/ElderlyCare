import React, { useState } from 'react';
import { Download, Search, Volume2 } from 'lucide-react';
import { EmptyState, PageHeader, StatTile } from '../components/common/UI';
import { useApp } from '../context/AppContext';
import { translateReminderChannel, translateReminderOutcome } from '../i18n/helpers';
import { ReminderOutcome } from '../types';

export const ReminderHistoryPage: React.FC = () => {
  const { reminderHistory, speakText, showToast, t } = useApp();
  const [search, setSearch] = useState('');
  const [outcomeFilter, setOutcomeFilter] = useState<'All' | ReminderOutcome>('All');

  const filterLabels: Record<'All' | ReminderOutcome, string> = {
    All: t.history.filterAll,
    'Confirmed Taken': t.history.filterConfirmed,
    'Snoozed 10m': t.history.filterSnoozed,
    'Pending Response': t.history.filterPending,
    'Escalated to Family': t.history.filterEscalated,
  };

  const filtered = reminderHistory.filter((item) => {
    const q = search.trim().toLowerCase();
    const matchesSearch =
      !q ||
      item.medicationName.toLowerCase().includes(q) ||
      item.spokenMessage.toLowerCase().includes(q) ||
      item.respondedBy.toLowerCase().includes(q);
    if (!matchesSearch) return false;
    if (outcomeFilter === 'All') return true;
    return item.outcome === outcomeFilter;
  });

  const confirmedCount = reminderHistory.filter((h) => h.outcome === 'Confirmed Taken').length;
  const escalatedCount = reminderHistory.filter((h) => h.outcome === 'Escalated to Family').length;
  const speakerCount = reminderHistory.filter((h) => h.channel === 'Smart Speaker').length;

  const handleExport = () => {
    const headers = [
      'Timestamp',
      'Medication',
      'Dosage',
      'ScheduledTime',
      'Channel',
      'Language',
      'Outcome',
      'RespondedBy',
    ];
    const rows = filtered.map((r) =>
      [
        r.timestamp,
        r.medicationName,
        r.dosage,
        r.scheduledTime,
        r.channel,
        r.language,
        r.outcome,
        r.respondedBy,
      ]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(',')
    );
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'elderlycare_reminder_history.csv';
    a.click();
    URL.revokeObjectURL(url);
    showToast(t.history.csvDownloadedToast, 'success');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={t.nav.history}
        subtitle={t.history.subtitle}
        action={
          <button
            type="button"
            onClick={handleExport}
            className="min-h-[44px] px-4 py-2.5 rounded-xl border border-[#BAE6FD] bg-[#F0F9FF] hover:bg-[#E0F2FE] text-[#0369A1] font-semibold text-sm flex items-center gap-2 whitespace-nowrap cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{t.actions.exportCsv}</span>
          </button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatTile
          label={t.history.totalSent}
          value={reminderHistory.length}
          helper={`${speakerCount} ${t.history.viaSpeakerHelper}`}
          tone="blue"
        />
        <StatTile
          label={t.history.confirmedTaken}
          value={confirmedCount}
          helper={t.history.verifiedHelper}
          tone="green"
        />
        <StatTile
          label={t.history.escalatedFamily}
          value={escalatedCount}
          helper={t.history.unansweredHelper}
          tone={escalatedCount > 0 ? 'amber' : 'neutral'}
        />
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.history.searchPlaceholder}
            className="w-full min-h-[44px] pl-10 pr-4 py-2 rounded-xl border border-[#DCE7F2] bg-white text-sm"
          />
        </div>

        <div className="flex items-center gap-1 p-1 rounded-xl bg-[#EFF6FB] border border-[#DCE7F2] overflow-x-auto">
          {(
            ['All', 'Confirmed Taken', 'Snoozed 10m', 'Pending Response', 'Escalated to Family'] as const
          ).map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setOutcomeFilter(status)}
              className={`min-h-[36px] px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap cursor-pointer ${
                outcomeFilter === status
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {filterLabels[status]}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title={t.history.emptyTitle} description={t.history.emptyDesc} />
      ) : (
        <div className="ec-card rounded-2xl border border-[#DCE7F2] bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-[#DCE7F2] bg-[#F5F9FC] text-slate-600">
                  <th className="py-3.5 px-4 font-semibold">{t.history.colTimestamp}</th>
                  <th className="py-3.5 px-4 font-semibold">{t.history.colMedicineSlot}</th>
                  <th className="py-3.5 px-4 font-semibold">{t.history.colSpokenScript}</th>
                  <th className="py-3.5 px-4 font-semibold">{t.history.colOutcomeResponder}</th>
                  <th className="py-3.5 px-4 font-semibold text-right">{t.history.colAudio}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((entry) => (
                  <tr key={entry.id} className="hover:bg-[#F5F9FC]">
                    <td className="py-3.5 px-4 font-mono-num text-slate-700 whitespace-nowrap">
                      {entry.timestamp}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-slate-900">{entry.medicationName}</p>
                      <p className="text-xs text-slate-500 font-mono-num">
                        {entry.dosage} · {entry.scheduledTime} ·{' '}
                        {translateReminderChannel(entry.channel, t)}
                      </p>
                    </td>
                    <td className="py-3.5 px-4 max-w-md text-slate-700">
                      <p className="line-clamp-2">{entry.spokenMessage}</p>
                      <span className="text-xs text-slate-500">
                        {t.history.languageLabel}{' '}
                        {entry.language === 'kn' ? 'ಕನ್ನಡ (Kannada)' : 'English'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <p
                        className={`font-semibold ${
                          entry.outcome === 'Confirmed Taken'
                            ? 'text-[#15803D]'
                            : entry.outcome === 'Escalated to Family'
                            ? 'text-red-700'
                            : entry.outcome === 'Snoozed 10m'
                            ? 'text-[#0369A1]'
                            : 'text-amber-800'
                        }`}
                      >
                        {translateReminderOutcome(entry.outcome, t)}
                      </p>
                      <p className="text-xs text-slate-500">{entry.respondedBy}</p>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => speakText(entry.spokenMessage, entry.language)}
                        className="min-h-[36px] px-3 py-1.5 rounded-lg border border-[#BAE6FD] bg-[#F0F9FF] hover:bg-[#E0F2FE] text-[#0369A1] text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>{t.history.replayBtn}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
