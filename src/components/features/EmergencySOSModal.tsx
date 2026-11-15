import React, { useState } from 'react';
import { CheckCircle2, PhoneCall, ShieldAlert } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/UI';

export const EmergencySOSModal: React.FC = () => {
  const {
    sosModalOpen,
    setSosModalOpen,
    t,
    patientProfile,
    familyMembers,
    caretakers,
    medications,
    triggerSosAlert,
    showToast,
  } = useApp();

  const [alertDispatched, setAlertDispatched] = useState(false);

  const primaryFamily = familyMembers.find((f) => f.isEmergencyContact) || familyMembers[0];
  const primaryCaretaker = caretakers[0];

  const handleDispatch = () => {
    triggerSosAlert();
    setAlertDispatched(true);
  };

  return (
    <Modal
      open={sosModalOpen}
      onClose={() => {
        setSosModalOpen(false);
        setAlertDispatched(false);
      }}
      title={t.sos.title}
      subtitle={t.sos.subtitle}
      closeLabel={t.common.closeModal}
      maxWidth="max-w-xl"
    >
      <div className="space-y-5">
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-base font-bold text-red-900">{t.sos.patientSummary}</h3>
              <p className="mt-1 text-sm text-red-900">
                <strong>{patientProfile.fullName}</strong> · {t.common.ageLabel} {patientProfile.age} ·{' '}
                {t.common.bloodGroupLabel} <strong>{patientProfile.bloodGroup}</strong>
              </p>
              <p className="mt-1 text-sm text-red-800">
                {t.common.allergiesLabel} {patientProfile.allergies.join(', ')} · {t.common.conditionsLabel}{' '}
                {patientProfile.chronicConditions.join(', ')}
              </p>
              <p className="mt-1 text-sm text-red-800">
                {t.common.activeMedsLabel} {medications.map((m) => `${m.name} (${m.dosage})`).join(', ')}
              </p>
              <p className="mt-1 text-sm text-red-800">
                {t.common.addressLabel} {patientProfile.address}, {patientProfile.city}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <button
            type="button"
            onClick={() => showToast(t.sos.demoCall108, 'error')}
            className="w-full min-h-[52px] px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-base flex items-center justify-between cursor-pointer"
          >
            <span className="flex items-center gap-3">
              <PhoneCall className="w-5 h-5" />
              <span>{t.sos.callAmbulance}</span>
            </span>
            <span className="font-mono-num text-sm">108 / 112</span>
          </button>

          {primaryFamily && (
            <button
              type="button"
              onClick={() =>
                showToast(`${t.sos.demoCallPrefix} ${primaryFamily.name} (${primaryFamily.phone})`, 'info')
              }
              className="w-full min-h-[52px] px-5 py-3 rounded-xl border border-[#BAE6FD] bg-[#F0F9FF] hover:bg-[#E0F2FE] text-sky-950 font-semibold text-base flex items-center justify-between cursor-pointer"
            >
              <span className="flex items-center gap-3">
                <PhoneCall className="w-5 h-5 text-[#0369A1]" />
                <span>
                  {t.sos.callFamily}: {primaryFamily.name}
                </span>
              </span>
              <span className="font-mono-num text-sm text-slate-700">{primaryFamily.phone}</span>
            </button>
          )}

          {primaryCaretaker && (
            <button
              type="button"
              onClick={() =>
                showToast(`${t.sos.demoCallPrefix} ${primaryCaretaker.name} (${primaryCaretaker.phone})`, 'info')
              }
              className="w-full min-h-[52px] px-5 py-3 rounded-xl border border-[#C6EBD4] bg-[#F0FAF4] hover:bg-[#DCFCE7] text-emerald-950 font-semibold text-base flex items-center justify-between cursor-pointer"
            >
              <span className="flex items-center gap-3">
                <PhoneCall className="w-5 h-5 text-[#15803D]" />
                <span>
                  {t.sos.callCaretaker}: {primaryCaretaker.name}
                </span>
              </span>
              <span className="font-mono-num text-sm text-slate-700">{primaryCaretaker.phone}</span>
            </button>
          )}
        </div>

        <div className="pt-2 border-t border-slate-200">
          {alertDispatched ? (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 flex items-center gap-3 text-emerald-900">
              <CheckCircle2 className="w-6 h-6 text-emerald-700 shrink-0" />
              <p className="text-sm font-semibold">{t.sos.alertSent}</p>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleDispatch}
              className="w-full min-h-[52px] px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-base cursor-pointer"
            >
              {t.sos.sendAlert}
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};
