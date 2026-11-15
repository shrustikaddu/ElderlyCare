import React, { useEffect, useState } from 'react';
import {
  AlertTriangle,
  BellRing,
  CalendarClock,
  Check,
  Clock,
  Edit3,
  History,
  Plus,
  Speaker,
  Trash2,
  Volume2,
} from 'lucide-react';
import {
  ConfirmDialog,
  EmptyState,
  Modal,
  PageHeader,
  ReadOnlyBanner,
} from '../components/common/UI';
import { useApp } from '../context/AppContext';
import { translateMealInstruction, translateWeekday } from '../i18n/helpers';
import { ReminderFrequency, VoiceReminder } from '../types';
import { isValidTimeString, normalizeTimeString } from '../utils/validation';

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const EMPTY_REMINDER: Omit<VoiceReminder, 'id'> = {
  title: '',
  medicationName: '',
  dosage: '',
  date: '2026-11-14',
  time: '08:00 AM',
  frequency: 'Daily',
  daysOfWeek: [...WEEKDAYS],
  enabled: true,
  notes: '',
};

export const RemindersPage: React.FC = () => {
  const {
    medications,
    updateMedication,
    doseSlots,
    markDoseStatus,
    voiceReminders,
    addVoiceReminder,
    updateVoiceReminder,
    deleteVoiceReminder,
    snoozeVoiceReminder,
    reminderSettings,
    updateReminderSettings,
    triggerMissedDoseSimulation,
    broadcastToSpeaker,
    speakerConfig,
    permissions,
    navigateTo,
    speakText,
    playChime,
    language,
    showToast,
    t,
  } = useApp();

  const [form, setForm] = useState(reminderSettings);
  const [snoozedIds, setSnoozedIds] = useState<string[]>([]);

  const [remModalOpen, setRemModalOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState<VoiceReminder | null>(null);
  const [remForm, setRemForm] = useState<Omit<VoiceReminder, 'id'>>(EMPTY_REMINDER);
  const [remError, setRemError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<VoiceReminder | null>(null);

  useEffect(() => {
    setForm(reminderSettings);
  }, [reminderSettings]);

  const activeUnmutedDoses = doseSlots.filter((d) => {
    if (d.status !== 'pending' && d.status !== 'missed') return false;
    const med = medications.find((m) => m.id === d.medicationId);
    return med ? med.reminderEnabled : true;
  });

  const mutedMedCount = medications.filter((m) => !m.reminderEnabled).length;

  const playChimeAndVoice = () => {
    if (form.soundEnabled) {
      playChime(true);
    }

    const nextActive =
      activeUnmutedDoses.find((d) => d.status === 'pending') || activeUnmutedDoses[0];

    if (form.voicePromptEnabled && nextActive) {
      const msg =
        language === 'kn'
          ? `ಔಷಧಿ ಜ್ಞಾಪನೆ: ದಯವಿಟ್ಟು ${nextActive.medicationName} ${nextActive.dosage} ತೆಗೆದುಕೊಳ್ಳಿ.`
          : `Medication reminder: It is time to take ${nextActive.medicationName}, ${nextActive.dosage}, ${nextActive.mealInstruction}.`;
      speakText(msg, language);
    }

    showToast(
      language === 'kn'
        ? 'ಜ್ಞಾಪನೆ ಪರೀಕ್ಷೆ ಪೂರ್ಣಗೊಂಡಿದೆ.'
        : 'Reminder test executed using current sound and mute preferences.',
      'info'
    );
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateReminderSettings(form);
  };

  const openAddReminder = () => {
    setEditingReminder(null);
    setRemForm(EMPTY_REMINDER);
    setRemError('');
    setRemModalOpen(true);
  };

  const openEditReminder = (rem: VoiceReminder) => {
    setEditingReminder(rem);
    const { id: _id, ...rest } = rem;
    setRemForm(rest);
    setRemError('');
    setRemModalOpen(true);
  };

  const toggleDay = (day: string) => {
    setRemError('');
    setRemForm((prev) => {
      const exists = prev.daysOfWeek.includes(day);
      const nextDays = exists
        ? prev.daysOfWeek.filter((d) => d !== day)
        : [...prev.daysOfWeek, day];
      return { ...prev, daysOfWeek: nextDays };
    });
  };

  const handleReminderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTitle = remForm.title.trim();
    const trimmedMed = remForm.medicationName.trim();
    const trimmedDosage = remForm.dosage.trim();

    if (!trimmedTitle) {
      setRemError(t.reminders.errTitleRequired);
      return;
    }
    if (!trimmedMed) {
      setRemError(t.reminders.errMedicineRequired);
      return;
    }
    if (!remForm.date) {
      setRemError(t.reminders.errDateRequired);
      return;
    }
    if (!isValidTimeString(remForm.time)) {
      setRemError(t.reminders.errTimeFormat);
      return;
    }
    if (remForm.frequency === 'Weekly' && remForm.daysOfWeek.length === 0) {
      setRemError(t.reminders.errDaysRequired);
      return;
    }

    const payload: Omit<VoiceReminder, 'id'> = {
      ...remForm,
      title: trimmedTitle,
      medicationName: trimmedMed,
      dosage: trimmedDosage || '-',
      time: normalizeTimeString(remForm.time),
      daysOfWeek: remForm.frequency === 'Daily' ? [...WEEKDAYS] : remForm.daysOfWeek,
      notes: remForm.notes?.trim(),
    };

    if (editingReminder) {
      updateVoiceReminder({ ...payload, id: editingReminder.id });
    } else {
      addVoiceReminder(payload);
    }
    setRemModalOpen(false);
  };

  const handleSpeakReminder = (rem: VoiceReminder) => {
    if (!rem.enabled) {
      showToast(
        language === 'kn' ? 'ಈ ಜ್ಞಾಪನೆ ವಿರಾಮದಲ್ಲಿದೆ.' : 'This reminder is currently paused.',
        'warning'
      );
      return;
    }
    const linkedMed = medications.find(
      (m) => m.name.toLowerCase() === rem.medicationName.toLowerCase()
    );
    if (linkedMed && !linkedMed.reminderEnabled) {
      showToast(
        language === 'kn'
          ? `${linkedMed.name} ಜ್ಞಾಪನೆಗಳನ್ನು ಮ್ಯೂಟ್ ಮಾಡಲಾಗಿದೆ.`
          : `Voice reminders for ${linkedMed.name} are muted.`,
        'warning'
      );
      return;
    }

    if (permissions.canBroadcastSpeaker) {
      broadcastToSpeaker({ voiceReminder: rem });
      return;
    }

    if (form.soundEnabled) {
      playChime(true);
    }
    if (!form.voicePromptEnabled) {
      return;
    }
    const script =
      language === 'kn'
        ? `ಜ್ಞಾಪನೆ (${rem.date}, ${rem.time}): ${rem.title}. ${rem.medicationName} ${rem.dosage}.`
        : `Scheduled reminder for ${rem.date} at ${rem.time}: ${rem.title}. ${rem.medicationName} ${rem.dosage}.`;
    speakText(script, language, speakerConfig.repeatCount);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={t.nav.reminders}
        subtitle={t.reminders.subtitle}
        action={
          <div className="flex flex-wrap items-center gap-2.5">
            {permissions.canManageReminders && (
              <button
                type="button"
                onClick={openAddReminder}
                className="min-h-[44px] px-4 py-2.5 rounded-xl bg-[#15803D] hover:bg-[#166534] text-white font-semibold text-sm flex items-center gap-2 whitespace-nowrap cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{t.reminders.addReminder}</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => navigateTo('speaker')}
              className="min-h-[44px] px-4 py-2.5 rounded-xl border border-[#BAE6FD] bg-[#F0F9FF] hover:bg-[#E0F2FE] text-[#0369A1] font-semibold text-sm flex items-center gap-2 whitespace-nowrap cursor-pointer"
            >
              <Speaker className="w-4 h-4" />
              <span>{t.reminders.speakerSimulator}</span>
            </button>
            <button
              type="button"
              onClick={playChimeAndVoice}
              className="min-h-[44px] px-5 py-2.5 rounded-xl bg-[#0369A1] hover:bg-[#075985] text-white font-semibold text-sm flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
              <span>{t.reminders.testChimeVoice}</span>
            </button>
          </div>
        }
      />

      {!permissions.canManageReminders && (
        <ReadOnlyBanner
          title={t.common.readOnlyNotice}
          message={t.common.permissionDenied}
          actionLabel={t.common.switchAccountBtn}
          onAction={() => navigateTo('auth')}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 space-y-6">
          {/* Active Today's Dose Reminders */}
          <section className="ec-card rounded-2xl border border-[#DCE7F2] bg-white p-6 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {t.reminders.upcomingActiveTitle}
                </h2>
                <p className="text-sm text-slate-600">{t.reminders.upcomingActiveSubtitle}</p>
              </div>
              <div className="flex items-center gap-2">
                {permissions.canManageReminders && (
                  <button
                    type="button"
                    onClick={triggerMissedDoseSimulation}
                    className="min-h-[38px] px-3 py-1.5 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>{t.reminders.triggerMissedAlert}</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => navigateTo('history')}
                  className="min-h-[38px] px-3 py-1.5 rounded-xl border border-[#DCE7F2] bg-white hover:bg-[#F5F9FC] text-[#0369A1] text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <History className="w-3.5 h-3.5" />
                  <span>{t.reminders.viewHistoryLink}</span>
                </button>
              </div>
            </div>

            {mutedMedCount > 0 && (
              <p className="text-xs font-medium text-amber-800 bg-amber-50 border border-amber-200 rounded-xl px-3.5 py-2">
                {mutedMedCount} {t.reminders.mutedSkipNote}
              </p>
            )}

            {activeUnmutedDoses.length === 0 ? (
              <div className="rounded-xl border border-[#C6EBD4] bg-[#F0FAF4] p-5 text-emerald-900 font-medium">
                {t.reminders.allCompletedBanner}
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {activeUnmutedDoses.map((dose) => {
                  const isSnoozed = snoozedIds.includes(dose.id);
                  return (
                    <div
                      key={dose.id}
                      className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <BellRing
                            className={`w-4 h-4 ${
                              dose.status === 'missed' ? 'text-red-600' : 'text-[#0369A1]'
                            }`}
                          />
                          <span className="font-mono-num font-bold text-slate-900">{dose.time}</span>
                          <span className="font-semibold text-slate-900">{dose.medicationName}</span>
                          <span className="text-sm text-slate-600">{dose.dosage}</span>
                        </div>
                        <p className="mt-1 text-sm text-slate-600">
                          {translateMealInstruction(dose.mealInstruction, t)} ·{' '}
                          {isSnoozed
                            ? t.reminders.snoozed15Msg
                            : dose.status === 'missed'
                            ? t.reminders.overdueAlertMsg
                            : `${t.reminders.reminderLeadPrefix} ${form.leadTimeMinutes} ${t.reminders.reminderLeadSuffix}`}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 shrink-0">
                        {permissions.canBroadcastSpeaker && (
                          <button
                            type="button"
                            onClick={() => broadcastToSpeaker({ dose })}
                            className="min-h-[40px] px-3.5 py-2 rounded-xl border border-[#BAE6FD] bg-[#F0F9FF] hover:bg-[#E0F2FE] text-[#0369A1] text-sm font-semibold flex items-center gap-1.5 cursor-pointer"
                          >
                            <Speaker className="w-4 h-4" />
                            <span>{t.reminders.speakOnHub}</span>
                          </button>
                        )}
                        {permissions.canConfirmDose && (
                          <>
                            <button
                              type="button"
                              onClick={() => markDoseStatus(dose.id, 'taken')}
                              className="min-h-[40px] px-4 py-2 rounded-xl bg-[#15803D] hover:bg-[#166534] text-white text-sm font-semibold flex items-center gap-1.5 cursor-pointer"
                            >
                              <Check className="w-4 h-4" />
                              <span>{t.reminders.takeNow}</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (!isSnoozed) setSnoozedIds((prev) => [...prev, dose.id]);
                                showToast(
                                  `${dose.medicationName} — ${t.reminders.snoozed15Msg}`,
                                  'info'
                                );
                              }}
                              className="min-h-[40px] px-3.5 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium flex items-center gap-1.5 cursor-pointer"
                            >
                              <Clock className="w-4 h-4" />
                              <span>{isSnoozed ? t.reminders.snoozedLabel : t.reminders.snooze15m}</span>
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Daily & Weekly Custom Voice Reminders (Add / Edit / Delete / Date & Time) */}
          <section className="ec-card rounded-2xl border border-[#DCE7F2] bg-white p-6 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {t.reminders.customRemindersTitle}
                </h2>
                <p className="text-sm text-slate-600">{t.reminders.customRemindersSubtitle}</p>
              </div>
              {permissions.canManageReminders && (
                <button
                  type="button"
                  onClick={openAddReminder}
                  className="min-h-[38px] px-3.5 py-1.5 rounded-xl border border-[#BAE6FD] bg-[#F0F9FF] hover:bg-[#E0F2FE] text-[#0369A1] text-sm font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>{t.reminders.addReminder}</span>
                </button>
              )}
            </div>

            {voiceReminders.length === 0 ? (
              <EmptyState
                title={t.reminders.noCustomRemindersTitle}
                description={t.reminders.noCustomRemindersDesc}
                actionLabel={permissions.canManageReminders ? t.reminders.addReminder : undefined}
                onAction={permissions.canManageReminders ? openAddReminder : undefined}
              />
            ) : (
              <div className="divide-y divide-slate-100">
                {voiceReminders.map((rem) => (
                  <div
                    key={rem.id}
                    className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <CalendarClock className="w-4 h-4 text-[#0369A1]" />
                        <span className="font-semibold text-slate-900">{rem.title}</span>
                        <span
                          className={`text-xs font-semibold ${
                            rem.enabled ? 'text-[#15803D]' : 'text-slate-500'
                          }`}
                        >
                          · {rem.enabled ? t.reminders.enabledLabel : t.reminders.pausedLabel}
                        </span>
                      </div>
                      <p className="text-sm text-slate-700 font-mono-num">
                        {rem.date} · {rem.time} ·{' '}
                        {rem.frequency === 'Daily'
                          ? t.reminders.dailyOption
                          : `${t.reminders.weeklyOption} (${rem.daysOfWeek
                              .map((d) => translateWeekday(d, t))
                              .join(', ')})`}
                      </p>
                      <p className="text-sm text-slate-600">
                        {rem.medicationName} {rem.dosage !== '-' ? `(${rem.dosage})` : ''}
                        {rem.snoozedUntil ? ` · ${t.reminders.snoozedLabel} (${rem.snoozedUntil})` : ''}
                      </p>
                      {rem.notes && <p className="text-xs text-slate-500">{rem.notes}</p>}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleSpeakReminder(rem)}
                        className="min-h-[36px] px-3 py-1.5 rounded-lg border border-[#BAE6FD] bg-[#F0F9FF] hover:bg-[#E0F2FE] text-[#0369A1] text-xs font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>{t.reminders.readAloudBtn}</span>
                      </button>
                      {permissions.canConfirmDose && (
                        <button
                          type="button"
                          onClick={() => snoozeVoiceReminder(rem.id)}
                          className="min-h-[36px] px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium cursor-pointer"
                        >
                          {t.reminders.snooze15m}
                        </button>
                      )}
                      {permissions.canManageReminders && (
                        <>
                          <button
                            type="button"
                            onClick={() =>
                              updateVoiceReminder({ ...rem, enabled: !rem.enabled })
                            }
                            className={`min-h-[36px] px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                              rem.enabled
                                ? 'bg-[#DCFCE7] text-[#15803D] border border-[#86EFAC]'
                                : 'bg-slate-100 text-slate-600 border border-slate-200'
                            }`}
                          >
                            {rem.enabled ? t.reminders.alertsOn : t.reminders.muted}
                          </button>
                          <button
                            type="button"
                            onClick={() => openEditReminder(rem)}
                            aria-label={`${t.actions.edit} ${rem.title}`}
                            className="min-h-[36px] px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium flex items-center gap-1 cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>{t.actions.edit}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(rem)}
                            aria-label={`${t.actions.delete} ${rem.title}`}
                            className="min-h-[36px] px-3 py-1.5 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-medium flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>{t.actions.delete}</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Per-Medicine Reminder Toggles */}
          <section className="ec-card rounded-2xl border border-[#DCE7F2] bg-white p-6">
            <h3 className="text-base font-bold text-slate-900 mb-3">
              {t.reminders.perMedTogglesTitle}
            </h3>
            <div className="divide-y divide-slate-100">
              {medications.map((med) => (
                <div key={med.id} className="py-3 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-slate-900">
                      {med.name}{' '}
                      <span className="text-sm font-normal text-slate-600">{med.dosage}</span>
                    </p>
                    <p className="text-xs text-slate-500 font-mono-num">{med.timings.join(', ')}</p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={med.reminderEnabled}
                    disabled={!permissions.canManageReminders}
                    onClick={() =>
                      updateMedication({ ...med, reminderEnabled: !med.reminderEnabled })
                    }
                    className={`min-h-[36px] px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer ${
                      med.reminderEnabled
                        ? 'bg-[#DCFCE7] text-[#15803D] border border-[#86EFAC]'
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}
                  >
                    {med.reminderEnabled ? t.reminders.alertsOn : t.reminders.muted}
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right: Reminder & Escalation Preferences */}
        <form
          onSubmit={handleSaveSettings}
          className="lg:col-span-5 ec-card rounded-2xl border border-[#DCE7F2] bg-white p-6 space-y-4"
        >
          <h2 className="text-lg font-bold text-slate-900">{t.reminders.preferencesTitle}</h2>

          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-1">
              {t.reminders.leadTimeLabel}
            </label>
          <select
              disabled={!permissions.canManageReminders}
              value={form.leadTimeMinutes}
              onChange={(e) => setForm({ ...form, leadTimeMinutes: Number(e.target.value) })}
              className="w-full min-h-[46px] px-3.5 py-2 rounded-xl border border-[#CBD8E6] bg-white disabled:bg-slate-100 text-base"
            >
              <option value={5}>5 {t.reminders.minutesBeforeSuffix}</option>
              <option value={10}>10 {t.reminders.minutesBeforeSuffix}</option>
              <option value={15}>15 {t.reminders.minutesBeforeSuffix}</option>
              <option value={30}>30 {t.reminders.minutesBeforeSuffix}</option>
            </select>
          </div>

          <div className="space-y-3 pt-2">
            <label className="flex items-center justify-between gap-3 p-3.5 rounded-xl border border-[#DCE7F2] bg-[#F5F9FC] cursor-pointer">
              <span className="text-sm font-semibold text-slate-900">
                {t.reminders.audioChimeToggle}
              </span>
              <input
                type="checkbox"
                disabled={!permissions.canManageReminders}
                checked={form.soundEnabled}
                onChange={(e) => setForm({ ...form, soundEnabled: e.target.checked })}
                className="w-5 h-5 accent-[#0369A1]"
              />
            </label>

            <label className="flex items-center justify-between gap-3 p-3.5 rounded-xl border border-[#DCE7F2] bg-[#F5F9FC] cursor-pointer">
              <span className="text-sm font-semibold text-slate-900">
                {t.reminders.voicePromptToggle}
              </span>
              <input
                type="checkbox"
                disabled={!permissions.canManageReminders}
                checked={form.voicePromptEnabled}
                onChange={(e) => setForm({ ...form, voicePromptEnabled: e.target.checked })}
                className="w-5 h-5 accent-[#0369A1]"
              />
            </label>

            <label className="flex items-center justify-between gap-3 p-3.5 rounded-xl border border-[#DCE7F2] bg-[#F5F9FC] cursor-pointer">
              <span className="text-sm font-semibold text-slate-900">
                {t.reminders.escalateMissedToggle}
              </span>
              <input
                type="checkbox"
                disabled={!permissions.canManageReminders}
                checked={form.escalateMissedToFamily}
                onChange={(e) => setForm({ ...form, escalateMissedToFamily: e.target.checked })}
                className="w-5 h-5 accent-[#0369A1]"
              />
            </label>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-1">
              {t.reminders.escalationDelayLabel}
            </label>
            <select
              disabled={!permissions.canManageReminders}
              value={form.escalationDelayMinutes}
              onChange={(e) =>
                setForm({ ...form, escalationDelayMinutes: Number(e.target.value) })
              }
              className="w-full min-h-[46px] px-3.5 py-2 rounded-xl border border-[#CBD8E6] bg-white disabled:bg-slate-100 text-base"
            >
              <option value={15}>15 {t.reminders.minutesAfterSuffix}</option>
              <option value={30}>30 {t.reminders.minutesAfterSuffix}</option>
              <option value={45}>45 {t.reminders.minutesAfterSuffix}</option>
              <option value={60}>60 {t.reminders.minutesAfterSuffix}</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={!permissions.canManageReminders}
            className="w-full min-h-[46px] px-5 py-2.5 rounded-xl bg-[#0369A1] hover:bg-[#075985] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-base cursor-pointer"
          >
            {t.actions.save}
          </button>
        </form>
      </div>

      {/* Add / Edit Voice Reminder Modal */}
      <Modal
        open={remModalOpen}
        onClose={() => setRemModalOpen(false)}
        closeLabel={t.common.closeModal}
        title={editingReminder ? t.reminders.editReminder : t.reminders.addReminder}
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleReminderSubmit} noValidate className="space-y-4">
          {remError && (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800"
            >
              {remError}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-1">
              {t.reminders.fieldTitle}
            </label>
            <input
              type="text"
              required
              value={remForm.title}
              onChange={(e) => {
                setRemError('');
                setRemForm({ ...remForm, title: e.target.value });
              }}
              placeholder="e.g., Afternoon Calcium Reminder"
              className="w-full min-h-[46px] px-3.5 py-2 rounded-xl border border-[#CBD8E6] text-base"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1">
                {t.reminders.fieldMedicine}
              </label>
              <input
                type="text"
                required
                value={remForm.medicationName}
                onChange={(e) => {
                  setRemError('');
                  setRemForm({ ...remForm, medicationName: e.target.value });
                }}
                placeholder="e.g., Amlodipine"
                className="w-full min-h-[46px] px-3.5 py-2 rounded-xl border border-[#CBD8E6] text-base"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1">
                {t.reminders.fieldDosage}
              </label>
              <input
                type="text"
                value={remForm.dosage}
                onChange={(e) => setRemForm({ ...remForm, dosage: e.target.value })}
                placeholder="e.g., 5 mg"
                className="w-full min-h-[46px] px-3.5 py-2 rounded-xl border border-[#CBD8E6] text-base"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1">
                {t.reminders.fieldDate}
              </label>
              <input
                type="date"
                required
                value={remForm.date}
                onChange={(e) => {
                  setRemError('');
                  setRemForm({ ...remForm, date: e.target.value });
                }}
                className="w-full min-h-[46px] px-3.5 py-2 rounded-xl border border-[#CBD8E6] text-base"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1">
                {t.reminders.fieldTime}
              </label>
              <input
                type="text"
                required
                value={remForm.time}
                onChange={(e) => {
                  setRemError('');
                  setRemForm({ ...remForm, time: e.target.value });
                }}
                placeholder="08:00 AM"
                className="w-full min-h-[46px] px-3.5 py-2 rounded-xl border border-[#CBD8E6] text-base font-mono-num"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-1">
              {t.reminders.fieldFrequency}
            </label>
            <select
              value={remForm.frequency}
              onChange={(e) =>
                setRemForm({ ...remForm, frequency: e.target.value as ReminderFrequency })
              }
              className="w-full min-h-[46px] px-3.5 py-2 rounded-xl border border-[#CBD8E6] bg-white text-base"
            >
              <option value="Daily">{t.reminders.dailyOption}</option>
              <option value="Weekly">{t.reminders.weeklyOption}</option>
            </select>
          </div>

          {remForm.frequency === 'Weekly' && (
            <div>
              <span className="block text-sm font-semibold text-slate-800 mb-1.5">
                {t.reminders.fieldDays}
              </span>
              <div className="flex flex-wrap gap-2">
                {WEEKDAYS.map((day) => {
                  const selected = remForm.daysOfWeek.includes(day);
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(day)}
                      className={`min-h-[38px] px-3 py-1.5 rounded-lg border text-sm font-medium cursor-pointer ${
                        selected
                          ? 'bg-[#0369A1] text-white border-[#0369A1]'
                          : 'bg-white text-slate-700 border-slate-300'
                      }`}
                    >
                      {translateWeekday(day, t)}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-1">
              {t.reminders.fieldNotes}
            </label>
            <textarea
              rows={2}
              value={remForm.notes || ''}
              onChange={(e) => setRemForm({ ...remForm, notes: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-[#CBD8E6] text-base"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setRemModalOpen(false)}
              className="min-h-[44px] px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-medium cursor-pointer"
            >
              {t.actions.cancel}
            </button>
            <button
              type="submit"
              className="min-h-[44px] px-6 py-2.5 rounded-xl bg-[#0369A1] hover:bg-[#075985] text-white font-semibold cursor-pointer"
            >
              {editingReminder ? t.actions.save : t.reminders.addReminder}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title={t.reminders.deleteReminderTitle}
        message={`${t.reminders.deleteReminderMsg} (${deleteTarget?.title})`}
        confirmLabel={t.actions.delete}
        cancelLabel={t.actions.cancel}
        onConfirm={() => {
          if (deleteTarget) deleteVoiceReminder(deleteTarget.id);
          setDeleteTarget(null);
        }}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
