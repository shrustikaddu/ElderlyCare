import React, { useState } from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/UI';

export const VoiceAssistantModal: React.FC = () => {
  const {
    voiceModalOpen,
    setVoiceModalOpen,
    language,
    t,
    doseSlots,
    appointments,
    patientProfile,
    speakText,
    navigateTo,
    setSosModalOpen,
  } = useApp();

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [assistantReply, setAssistantReply] = useState('');

  const pendingDoses = doseSlots.filter((d) => d.status === 'pending');
  const missedDoses = doseSlots.filter((d) => d.status === 'missed');
  const nextAppt = appointments.find((a) => a.status === 'Scheduled');

  const handleReadSchedule = () => {
    const reply =
      language === 'kn'
        ? `${patientProfile.fullName} ಅವರಿಗೆ ಇಂದು ${pendingDoses.length} ಬಾಕಿ ಔಷಧಿಗಳಿವೆ. ${
            pendingDoses.length > 0
              ? `ಮುಂದಿನ ಔಷಧಿ ${pendingDoses[0].medicationName} ${pendingDoses[0].dosage}, ಸಮಯ ${pendingDoses[0].time}.`
              : 'ಇಂದಿನ ಎಲ್ಲಾ ಔಷಧಿಗಳನ್ನು ತೆಗೆದುಕೊಳ್ಳಲಾಗಿದೆ.'
          }`
        : `Hello ${patientProfile.fullName}. You have ${pendingDoses.length} pending doses remaining today. ${
            pendingDoses.length > 0
              ? `Next up is ${pendingDoses[0].medicationName}, ${pendingDoses[0].dosage}, at ${pendingDoses[0].time} (${pendingDoses[0].mealInstruction}).`
              : 'All scheduled medicines for today are completed.'
          }`;
    setAssistantReply(reply);
    speakText(reply, language);
  };

  const handleCheckMissed = () => {
    const reply =
      language === 'kn'
        ? missedDoses.length > 0
          ? `ಇಂದು ${missedDoses.length} ತಪ್ಪಿದ ಔಷಧಿ ಇದೆ: ${missedDoses.map((m) => m.medicationName).join(', ')}.`
          : 'ಇಂದು ಯಾವುದೇ ತಪ್ಪಿದ ಔಷಧಿಗಳಿಲ್ಲ. ತುಂಬಾ ಒಳ್ಳೆಯದು.'
        : missedDoses.length > 0
        ? `There ${missedDoses.length === 1 ? 'is' : 'are'} ${missedDoses.length} missed dose today: ${missedDoses
            .map((m) => `${m.medicationName} at ${m.time}`)
            .join(', ')}.`
        : 'Great news! There are zero missed doses today.';
    setAssistantReply(reply);
    speakText(reply, language);
  };

  const handleNextAppointment = () => {
    const reply =
      language === 'kn'
        ? nextAppt
          ? `ನಿಮ್ಮ ಮುಂದಿನ ವೈದ್ಯರ ಭೇಟಿ ${nextAppt.doctorName} ಅವರೊಂದಿಗೆ ${nextAppt.date} ರಂದು ${nextAppt.time} ಕ್ಕೆ ಇದೆ.`
          : 'ಯಾವುದೇ ಮುಂದಿನ ವೈದ್ಯರ ಭೇಟಿ ನಿಗದಿಯಾಗಿಲ್ಲ.'
        : nextAppt
        ? `Your next doctor appointment is with ${nextAppt.doctorName} on ${nextAppt.date} at ${nextAppt.time} at ${nextAppt.clinicName}.`
        : 'No upcoming doctor appointments are scheduled.';
    setAssistantReply(reply);
    speakText(reply, language);
  };

  const processSpokenCommand = (spoken: string) => {
    const lower = spoken.toLowerCase();
    if (lower.includes('sos') || lower.includes('emergency') || lower.includes('help')) {
      setVoiceModalOpen(false);
      setSosModalOpen(true);
      return;
    }
    if (lower.includes('appointment') || lower.includes('doctor')) {
      handleNextAppointment();
      return;
    }
    if (lower.includes('missed')) {
      handleCheckMissed();
      return;
    }
    if (lower.includes('schedule') || lower.includes('medicine') || lower.includes('tablet')) {
      handleReadSchedule();
      return;
    }
    if (lower.includes('medication')) {
      navigateTo('medications');
      setVoiceModalOpen(false);
      return;
    }
    handleReadSchedule();
  };

  const toggleListening = () => {
    const SpeechRec =
      (window as unknown as { SpeechRecognition?: new () => unknown; webkitSpeechRecognition?: new () => unknown })
        .SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: new () => unknown }).webkitSpeechRecognition;

    if (!SpeechRec) {
      setTranscript(t.voice.unavailableTranscript);
      handleReadSchedule();
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRec() as {
        lang: string;
        interimResults: boolean;
        maxAlternatives: number;
        onresult: (event: { results: { [key: number]: { [key: number]: { transcript: string } } } }) => void;
        onerror: () => void;
        onend: () => void;
        start: () => void;
      };
      recognition.lang = language === 'kn' ? 'kn-IN' : 'en-IN';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      setIsListening(true);
      setTranscript('');

      recognition.onresult = (event) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
        setIsListening(false);
        processSpokenCommand(text);
      };
      recognition.onerror = () => {
        setIsListening(false);
        setTranscript(t.voice.unclearTranscript);
      };
      recognition.onend = () => {
        setIsListening(false);
      };
      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  return (
    <Modal
      open={voiceModalOpen}
      onClose={() => {
        if ('speechSynthesis' in window) window.speechSynthesis.cancel();
        setVoiceModalOpen(false);
      }}
      title={t.voice.title}
      subtitle={t.voice.subtitle}
      closeLabel={t.common.closeModal}
      maxWidth="max-w-lg"
    >
      <div className="space-y-5">
        <div className="rounded-xl border border-[#CBE2F5] bg-[#F0F7FC] p-5 text-center">
          <button
            type="button"
            onClick={toggleListening}
            className={`mx-auto min-h-[56px] px-6 py-3 rounded-xl font-semibold text-base flex items-center justify-center gap-3 transition-colors cursor-pointer ${
              isListening
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-[#0369A1] text-white hover:bg-[#075985]'
            }`}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            <span>{isListening ? t.voice.stopListening : t.voice.startListening}</span>
          </button>

          <p className="mt-3 text-sm text-slate-600">
            {isListening ? t.voice.listening : t.voice.speakPrompt}
          </p>

          {transcript && (
            <div className="mt-3 rounded-lg bg-white border border-[#DCE7F2] px-3 py-2 text-sm text-slate-800">
              {t.voice.heardPrefix} "{transcript}"
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={handleReadSchedule}
            className="min-h-[48px] px-4 py-3 rounded-xl border border-[#DCE7F2] bg-white hover:bg-[#F5F9FC] text-left font-medium text-slate-800 flex items-center gap-2.5 cursor-pointer"
          >
            <Volume2 className="w-5 h-5 text-[#0369A1] shrink-0" />
            <span>{t.voice.readSchedule}</span>
          </button>

          <button
            type="button"
            onClick={handleCheckMissed}
            className="min-h-[48px] px-4 py-3 rounded-xl border border-[#DCE7F2] bg-white hover:bg-[#F5F9FC] text-left font-medium text-slate-800 flex items-center gap-2.5 cursor-pointer"
          >
            <Volume2 className="w-5 h-5 text-[#15803D] shrink-0" />
            <span>{t.voice.checkMissed}</span>
          </button>

          <button
            type="button"
            onClick={handleNextAppointment}
            className="min-h-[48px] px-4 py-3 rounded-xl border border-[#DCE7F2] bg-white hover:bg-[#F5F9FC] text-left font-medium text-slate-800 flex items-center gap-2.5 cursor-pointer"
          >
            <Volume2 className="w-5 h-5 text-[#0369A1] shrink-0" />
            <span>{t.voice.nextAppointment}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setVoiceModalOpen(false);
              setSosModalOpen(true);
            }}
            className="min-h-[48px] px-4 py-3 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-left font-semibold text-red-700 flex items-center gap-2.5 cursor-pointer"
          >
            <Volume2 className="w-5 h-5 text-red-600 shrink-0" />
            <span>{t.voice.openSos}</span>
          </button>
        </div>

        {assistantReply && (
          <div className="rounded-xl border border-[#C6EBD4] bg-[#F0FAF4] p-4">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-xs font-semibold text-emerald-800">{t.voice.spokenSummary}</span>
              <button
                type="button"
                onClick={() => speakText(assistantReply, language)}
                className="text-xs font-semibold text-[#0369A1] hover:underline cursor-pointer"
              >
                {t.voice.replayAudio}
              </button>
            </div>
            <p className="text-base text-slate-800 leading-relaxed">{assistantReply}</p>
          </div>
        )}
      </div>
    </Modal>
  );
};
