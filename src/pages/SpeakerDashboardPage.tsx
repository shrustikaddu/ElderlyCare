import React, { useEffect, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Radio,
  Send,
  ShieldAlert,
  Speaker,
  Volume2,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { PageHeader, ReadOnlyBanner } from '../components/common/UI';
import { useApp } from '../context/AppContext';
import { Language } from '../types';

export const SpeakerDashboardPage: React.FC = () => {
  const {
    speakerConfig,
    updateSpeakerConfig,
    medications,
    doseSlots,
    broadcastToSpeaker,
    respondFromSpeaker,
    reminderHistory,
    patientProfile,
    permissions,
    speakText,
    showToast,
    navigateTo,
    language,
    t,
  } = useApp();

  const pendingOrMissed = doseSlots.filter((d) => {
    if (d.status !== 'pending' && d.status !== 'missed') return false;
    const med = medications.find((m) => m.id === d.medicationId);
    return med ? med.reminderEnabled : true;
  });

  const [selectedDoseId, setSelectedDoseId] = useState<string>(pendingOrMissed[0]?.id || '');
  const [customMessage, setCustomMessage] = useState('');
  const [broadcastLang, setBroadcastLang] = useState<Language>(speakerConfig.voiceLanguage);

  useEffect(() => {
    setBroadcastLang(speakerConfig.voiceLanguage);
  }, [speakerConfig.voiceLanguage]);

  useEffect(() => {
    const stillValid = pendingOrMissed.some((d) => d.id === selectedDoseId);
    if (!stillValid) {
      setSelectedDoseId(pendingOrMissed[0]?.id || '');
    }
  }, [doseSlots, medications, selectedDoseId]);

  const activeDose = pendingOrMissed.find((d) => d.id === selectedDoseId) || pendingOrMissed[0];

  const handleBroadcastDose = () => {
    if (!activeDose) {
      showToast(t.speaker.allConfirmedMsg, 'info');
      return;
    }
    broadcastToSpeaker({
      dose: activeDose,
      langOverride: broadcastLang,
    });
  };

  const handleBroadcastCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customMessage.trim()) return;
    const sent = broadcastToSpeaker({
      customMessage: customMessage.trim(),
      langOverride: broadcastLang,
    });
    if (sent) setCustomMessage('');
  };

  const handleReplayLast = () => {
    if (!speakerConfig.isOnline) {
      showToast(t.speaker.offlineWarningBanner, 'warning');
      return;
    }
    speakText(
      speakerConfig.lastBroadcastText,
      speakerConfig.voiceLanguage,
      speakerConfig.repeatCount
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={t.nav.speaker}
        subtitle={t.speaker.subtitle}
        action={
          <button
            type="button"
            onClick={() => navigateTo('history')}
            className="min-h-[44px] px-4 py-2.5 rounded-xl border border-[#BAE6FD] bg-[#F0F9FF] hover:bg-[#E0F2FE] text-[#0369A1] font-semibold text-sm whitespace-nowrap shrink-0 cursor-pointer"
          >
            {t.speaker.viewHistory}
          </button>
        }
      />

      {!permissions.canBroadcastSpeaker && !permissions.canConfigureSpeaker && (
        <ReadOnlyBanner
          title={t.common.readOnlyNotice}
          message={t.common.permissionDenied}
          actionLabel={t.common.switchAccountBtn}
          onAction={() => navigateTo('auth')}
        />
      )}

      {!speakerConfig.isOnline && (
        <div
          role="status"
          className="rounded-2xl border border-amber-300 bg-amber-50 p-4 flex items-start gap-3 text-amber-950"
        >
          <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <p className="text-sm font-medium">{t.speaker.offlineWarningBanner}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Simulated Physical Home Smart Speaker */}
        <section className="lg:col-span-7 ec-card rounded-2xl border border-[#DCE7F2] bg-white p-6 sm:p-7 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#E0F2FE] text-[#0369A1] flex items-center justify-center shrink-0">
                <Speaker className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#0369A1]">{t.speaker.simulatedBadge}</p>
                <h2 className="text-lg font-bold text-slate-900">{speakerConfig.deviceName}</h2>
                <p className="text-sm text-slate-600">{speakerConfig.roomLocation}</p>
              </div>
            </div>

            <button
              type="button"
              disabled={!permissions.canConfigureSpeaker}
              onClick={() =>
                updateSpeakerConfig({ ...speakerConfig, isOnline: !speakerConfig.isOnline })
              }
              className={`min-h-[38px] px-3.5 py-1.5 rounded-xl border text-sm font-semibold flex items-center gap-2 whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer ${
                speakerConfig.isOnline
                  ? 'border-[#C6EBD4] bg-[#F0FAF4] text-[#15803D]'
                  : 'border-slate-300 bg-slate-100 text-slate-700'
              }`}
            >
              {speakerConfig.isOnline ? (
                <Wifi className="w-4 h-4" />
              ) : (
                <WifiOff className="w-4 h-4" />
              )}
              <span>
                {speakerConfig.isOnline ? t.speaker.speakerOnline : t.speaker.standbyOffline}
              </span>
            </button>
          </div>

          {/* Tabletop Speaker Display Box */}
          <div className="rounded-2xl border border-[#CBD8E6] bg-[#EFF6FB] p-6 space-y-5">
            <div className="flex items-center justify-between gap-3 text-sm text-slate-600 flex-wrap">
              <span className="inline-flex items-center gap-2 font-semibold text-[#0369A1]">
                <Radio className="w-4 h-4" />
                <span>
                  {t.speaker.spokenOutputLabel} (
                  {speakerConfig.voiceLanguage === 'kn' ? 'ಕನ್ನಡ' : 'English'})
                </span>
              </span>
              <span className="font-mono-num text-xs text-slate-500">
                {t.speaker.lastSpokenLabel} {speakerConfig.lastBroadcastAt}
              </span>
            </div>

            <div className="rounded-xl bg-white border border-[#DCE7F2] p-5">
              <p className="text-lg sm:text-xl font-semibold text-slate-900 leading-relaxed">
                “{speakerConfig.lastBroadcastText}”
              </p>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleReplayLast}
                  disabled={!speakerConfig.isOnline}
                  className="min-h-[42px] px-4 py-2 rounded-xl border border-[#BAE6FD] bg-[#F0F9FF] hover:bg-[#E0F2FE] disabled:opacity-50 disabled:cursor-not-allowed text-[#0369A1] text-sm font-semibold flex items-center gap-2 cursor-pointer"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>{t.speaker.replayReminder}</span>
                </button>
                <span className="text-sm text-slate-600 font-mono-num">
                  {t.speaker.volumeLabel} {speakerConfig.volumePercent}% · {t.speaker.repeatLabel}{' '}
                  {speakerConfig.repeatCount}x
                </span>
              </div>
            </div>

            {/* Simulated Physical / Voice Buttons on Speaker for Elderly Person */}
            <div>
              <p className="text-sm font-semibold text-slate-700 mb-3">
                {t.speaker.handsFreeHeading}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => respondFromSpeaker('taken', activeDose?.id)}
                  disabled={!speakerConfig.isOnline || !permissions.canConfirmDose}
                  className="min-h-[60px] px-4 py-3 rounded-xl bg-[#15803D] hover:bg-[#166534] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-base flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span>{t.speaker.btnTookIt}</span>
                </button>

                <button
                  type="button"
                  onClick={() => respondFromSpeaker('snooze', activeDose?.id)}
                  disabled={!speakerConfig.isOnline || !permissions.canConfirmDose}
                  className="min-h-[60px] px-4 py-3 rounded-xl bg-[#0369A1] hover:bg-[#075985] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-base flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Clock className="w-5 h-5 shrink-0" />
                  <span>{t.speaker.btnSnooze10}</span>
                </button>

                <button
                  type="button"
                  onClick={() => respondFromSpeaker('help', activeDose?.id)}
                  disabled={!speakerConfig.isOnline}
                  className="min-h-[60px] px-4 py-3 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-base flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <ShieldAlert className="w-5 h-5 shrink-0" />
                  <span>{t.speaker.btnNeedHelp}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Speaker Hardware Settings */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <label htmlFor="speaker-vol" className="block text-sm font-semibold text-slate-800 mb-1.5">
                {t.speaker.sliderVolumeLabel} ({speakerConfig.volumePercent}%)
              </label>
              <input
                id="speaker-vol"
                type="range"
                min={20}
                max={100}
                step={5}
                disabled={!permissions.canConfigureSpeaker}
                value={speakerConfig.volumePercent}
                onChange={(e) =>
                  updateSpeakerConfig(
                    { ...speakerConfig, volumePercent: Number(e.target.value) },
                    true
                  )
                }
                className="w-full accent-[#0369A1] disabled:opacity-50"
              />
            </div>

            <div>
              <label htmlFor="speaker-lang" className="block text-sm font-semibold text-slate-800 mb-1.5">
                {t.speaker.voiceLangLabel}
              </label>
              <select
                id="speaker-lang"
                disabled={!permissions.canConfigureSpeaker}
                value={speakerConfig.voiceLanguage}
                onChange={(e) => {
                  const lang = e.target.value as Language;
                  setBroadcastLang(lang);
                  updateSpeakerConfig({ ...speakerConfig, voiceLanguage: lang });
                }}
                className="w-full min-h-[42px] px-3 py-1.5 rounded-xl border border-[#CBD8E6] bg-white disabled:bg-slate-100 text-sm"
              >
                <option value="en">English (India)</option>
                <option value="kn">ಕನ್ನಡ (Kannada)</option>
              </select>
            </div>

            <div>
              <label htmlFor="speaker-repeat" className="block text-sm font-semibold text-slate-800 mb-1.5">
                {t.speaker.repeatSelectLabel}
              </label>
              <select
                id="speaker-repeat"
                disabled={!permissions.canConfigureSpeaker}
                value={speakerConfig.repeatCount}
                onChange={(e) =>
                  updateSpeakerConfig({
                    ...speakerConfig,
                    repeatCount: Number(e.target.value) as 1 | 2 | 3,
                  })
                }
                className="w-full min-h-[42px] px-3 py-1.5 rounded-xl border border-[#CBD8E6] bg-white disabled:bg-slate-100 text-sm"
              >
                <option value={1}>{t.speaker.speak1Time}</option>
                <option value={2}>{t.speaker.speak2Times}</option>
                <option value={3}>{t.speaker.speak3Times}</option>
              </select>
            </div>
          </div>
        </section>

        {/* Right: Remote Family Broadcast Controller */}
        <div className="lg:col-span-5 space-y-6">
          <section className="ec-card rounded-2xl border border-[#DCE7F2] bg-white p-6 space-y-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {t.speaker.remoteControllerTitle}
              </h2>
              <p className="text-sm text-slate-600">
                {t.speaker.remoteControllerSubtitle} {patientProfile.fullName}.
              </p>
            </div>

            <div>
              <label htmlFor="select-dose" className="block text-sm font-semibold text-slate-800 mb-1.5">
                {t.speaker.selectDoseLabel}
              </label>
              <select
                id="select-dose"
                value={selectedDoseId}
                onChange={(e) => setSelectedDoseId(e.target.value)}
                disabled={pendingOrMissed.length === 0}
                className="w-full min-h-[46px] px-3.5 py-2 rounded-xl border border-[#CBD8E6] bg-white text-sm disabled:bg-slate-100"
              >
                {pendingOrMissed.length === 0 ? (
                  <option value="">{t.speaker.noPendingDropdown}</option>
                ) : (
                  pendingOrMissed.map((slot) => (
                    <option key={slot.id} value={slot.id}>
                      {slot.time} — {slot.medicationName} ({slot.dosage}) [{t.status[slot.status]}]
                    </option>
                  ))
                )}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-700">
                {t.speaker.voiceLanguageShort}
              </span>
              <div className="flex items-center gap-1 p-1 rounded-lg bg-[#EFF6FB] border border-[#DCE7F2]">
                <button
                  type="button"
                  onClick={() => setBroadcastLang('en')}
                  className={`px-3 py-1 rounded-md text-xs font-semibold cursor-pointer ${
                    broadcastLang === 'en' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => setBroadcastLang('kn')}
                  className={`px-3 py-1 rounded-md text-xs font-semibold cursor-pointer ${
                    broadcastLang === 'kn' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  ಕನ್ನಡ
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={handleBroadcastDose}
              disabled={!speakerConfig.isOnline || pendingOrMissed.length === 0 || !permissions.canBroadcastSpeaker}
              className="w-full min-h-[48px] px-5 py-3 rounded-xl bg-[#0369A1] hover:bg-[#075985] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-base flex items-center justify-center gap-2 cursor-pointer"
            >
              <Volume2 className="w-5 h-5" />
              <span>{t.speaker.announceDoseBtn}</span>
            </button>

            <form onSubmit={handleBroadcastCustom} className="pt-4 border-t border-slate-100 space-y-3">
              <label htmlFor="custom-voice-msg" className="block text-sm font-semibold text-slate-800">
                {t.speaker.customMessageLabel}
              </label>
              <textarea
                id="custom-voice-msg"
                rows={3}
                disabled={!permissions.canBroadcastSpeaker}
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder={t.speaker.customMessagePlaceholder}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD8E6] disabled:bg-slate-100 text-sm"
              />
              <button
                type="submit"
                disabled={!speakerConfig.isOnline || !customMessage.trim() || !permissions.canBroadcastSpeaker}
                className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-[#15803D] hover:bg-[#166534] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>{t.speaker.speakCustomBtn}</span>
              </button>
            </form>
          </section>

          <section className="ec-card rounded-2xl border border-[#DCE7F2] bg-white p-6">
            <h3 className="text-base font-bold text-slate-900 mb-3">
              {t.speaker.pendingQueueTitle} ({pendingOrMissed.length})
            </h3>
            {pendingOrMissed.length === 0 ? (
              <p className="text-sm text-emerald-800 font-medium">{t.speaker.allConfirmedMsg}</p>
            ) : (
              <ul className="divide-y divide-slate-100 text-sm">
                {pendingOrMissed.map((slot) => (
                  <li key={slot.id} className="py-2.5 flex items-center justify-between gap-2">
                    <div>
                      <span className="font-mono-num font-semibold text-[#0369A1]">{slot.time}</span>
                      <span className="mx-2 text-slate-300">·</span>
                      <span className="font-semibold text-slate-900">{slot.medicationName}</span>
                    </div>
                    {permissions.canBroadcastSpeaker && (
                      <button
                        type="button"
                        disabled={!speakerConfig.isOnline}
                        onClick={() => {
                          setSelectedDoseId(slot.id);
                          broadcastToSpeaker({ dose: slot, langOverride: broadcastLang });
                        }}
                        className="text-xs font-semibold text-[#0369A1] hover:underline disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                      >
                        {t.speaker.speakNowBtn}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500">
              {t.speaker.recentLogsPrefix} {reminderHistory.length} {t.speaker.recentLogsSuffix} (
              {language === 'kn' ? 'ಕನ್ನಡ / EN' : 'EN / KN'})
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
