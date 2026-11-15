import React, { useState } from 'react';
import { Edit3, HeartPulse, Plus, Save } from 'lucide-react';
import { Modal, PageHeader, ReadOnlyBanner, SafeImage } from '../components/common/UI';
import { useApp } from '../context/AppContext';
import { PatientProfile } from '../types';

export const ProfilePage: React.FC = () => {
  const {
    patientProfile,
    updatePatientProfile,
    vitals,
    addVitalReading,
    currentUser,
    permissions,
    navigateTo,
    t,
  } = useApp();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<PatientProfile>(patientProfile);
  const [allergiesText, setAllergiesText] = useState(patientProfile.allergies.join(', '));
  const [conditionsText, setConditionsText] = useState(patientProfile.chronicConditions.join(', '));

  const [vitalModalOpen, setVitalModalOpen] = useState(false);
  const [bp, setBp] = useState('128/80 mmHg');
  const [sugar, setSugar] = useState('116 mg/dL (Fasting)');
  const [hr, setHr] = useState('72');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = updatePatientProfile({
      ...form,
      allergies: allergiesText
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      chronicConditions: conditionsText
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    });
    if (ok) setEditing(false);
  };

  const handleAddVital = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date();
    const formattedDate = `${now.toISOString().slice(0, 10)} · ${now.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })}`;
    const ok = addVitalReading({
      date: formattedDate,
      bloodPressure: bp.trim() || '125/80 mmHg',
      bloodSugar: sugar.trim() || '115 mg/dL',
      heartRate: Number(hr) || 72,
      recordedBy: currentUser.name.split(' (')[0],
    });
    if (ok) setVitalModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={t.nav.profile}
        subtitle={t.profile.subtitle}
        action={
          !editing && permissions.canManageProfile ? (
            <button
              type="button"
              onClick={() => {
                setForm(patientProfile);
                setAllergiesText(patientProfile.allergies.join(', '));
                setConditionsText(patientProfile.chronicConditions.join(', '));
                setEditing(true);
              }}
              className="min-h-[44px] px-5 py-2.5 rounded-xl bg-[#0369A1] hover:bg-[#075985] text-white font-semibold text-sm flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Edit3 className="w-4 h-4" />
              <span>{t.profile.editProfileBtn}</span>
            </button>
          ) : null
        }
      />

      {!permissions.canManageProfile && (
        <ReadOnlyBanner
          title={t.common.readOnlyNotice}
          message={t.common.permissionDenied}
          actionLabel={t.common.switchAccountBtn}
          onAction={() => navigateTo('auth')}
        />
      )}

      {editing ? (
        <form
          onSubmit={handleSaveProfile}
          className="ec-card rounded-2xl border border-[#DCE7F2] bg-white p-6 space-y-5"
        >
          <h2 className="text-lg font-bold text-slate-900">{t.profile.updateHeading}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1">
                {t.profile.fullName}
              </label>
              <input
                type="text"
                required
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                className="w-full min-h-[46px] px-3.5 py-2 rounded-xl border border-[#CBD8E6] text-base"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1">
                {t.profile.age}
              </label>
              <input
                type="number"
                min={50}
                max={115}
                required
                value={form.age}
                onChange={(e) => setForm({ ...form, age: Number(e.target.value) })}
                className="w-full min-h-[46px] px-3.5 py-2 rounded-xl border border-[#CBD8E6] text-base"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1">
                {t.profile.bloodGroup}
              </label>
              <input
                type="text"
                required
                value={form.bloodGroup}
                onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })}
                className="w-full min-h-[46px] px-3.5 py-2 rounded-xl border border-[#CBD8E6] text-base"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1">
                {t.profile.phone}
              </label>
              <input
                type="tel"
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full min-h-[46px] px-3.5 py-2 rounded-xl border border-[#CBD8E6] text-base"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1">
                {t.profile.primaryPhysician}
              </label>
              <input
                type="text"
                required
                value={form.primaryPhysician}
                onChange={(e) => setForm({ ...form, primaryPhysician: e.target.value })}
                className="w-full min-h-[46px] px-3.5 py-2 rounded-xl border border-[#CBD8E6] text-base"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1">
                {t.profile.city}
              </label>
              <input
                type="text"
                required
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="w-full min-h-[46px] px-3.5 py-2 rounded-xl border border-[#CBD8E6] text-base"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1">
                {t.profile.allergiesInput}
              </label>
              <input
                type="text"
                value={allergiesText}
                onChange={(e) => setAllergiesText(e.target.value)}
                className="w-full min-h-[46px] px-3.5 py-2 rounded-xl border border-[#CBD8E6] text-base"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1">
                {t.profile.conditionsInput}
              </label>
              <input
                type="text"
                value={conditionsText}
                onChange={(e) => setConditionsText(e.target.value)}
                className="w-full min-h-[46px] px-3.5 py-2 rounded-xl border border-[#CBD8E6] text-base"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1">
                {t.profile.dietaryNotes}
              </label>
              <textarea
                rows={3}
                value={form.dietaryNotes}
                onChange={(e) => setForm({ ...form, dietaryNotes: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD8E6] text-base"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1">
                {t.profile.mobilityNotes}
              </label>
              <textarea
                rows={3}
                value={form.mobilityNotes}
                onChange={(e) => setForm({ ...form, mobilityNotes: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD8E6] text-base"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="min-h-[44px] px-5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 font-medium hover:bg-slate-50 cursor-pointer"
            >
              {t.actions.cancel}
            </button>
            <button
              type="submit"
              className="min-h-[44px] px-5 py-2.5 rounded-xl bg-[#15803D] hover:bg-[#166534] text-white font-semibold flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{t.actions.save}</span>
            </button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 ec-card rounded-2xl border border-[#DCE7F2] bg-white p-6">
            <div className="flex items-center gap-4 pb-5 border-b border-slate-100">
              <SafeImage
                src={patientProfile.avatarUrl}
                alt={patientProfile.fullName}
                className="w-20 h-20 rounded-2xl object-cover border border-[#CBE2F5] shrink-0"
              />
              <div>
                <h2 className="text-xl font-bold text-slate-900">{patientProfile.fullName}</h2>
                <p className="text-sm text-slate-600 mt-0.5">
                  {t.common.ageLabel} {patientProfile.age} · {patientProfile.gender} ·{' '}
                  {t.common.bloodGroupLabel}{' '}
                  <strong className="text-red-700">{patientProfile.bloodGroup}</strong>
                </p>
                <p className="text-sm text-slate-600 mt-0.5 font-mono-num">{patientProfile.phone}</p>
              </div>
            </div>

            <dl className="mt-5 space-y-3.5 text-sm">
              <div>
                <dt className="text-slate-500 font-medium">{t.profile.residentialAddress}</dt>
                <dd className="text-slate-900 font-medium mt-0.5">
                  {patientProfile.address}, {patientProfile.city}
                </dd>
              </div>
              <div>
                <dt className="text-slate-500 font-medium">{t.profile.primaryPhysician}</dt>
                <dd className="text-slate-900 font-medium mt-0.5">
                  {patientProfile.primaryPhysician} · {patientProfile.physicianPhone}
                </dd>
              </div>
              <div>
                <dt className="text-slate-500 font-medium">{t.profile.knownAllergies}</dt>
                <dd className="text-red-700 font-semibold mt-0.5">
                  {patientProfile.allergies.join(' · ') || t.profile.noneRecorded}
                </dd>
              </div>
              <div>
                <dt className="text-slate-500 font-medium">{t.profile.managedConditions}</dt>
                <dd className="text-slate-900 mt-0.5">{patientProfile.chronicConditions.join(' · ')}</dd>
              </div>
            </dl>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <div className="ec-card rounded-2xl border border-[#DCE7F2] bg-white p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">{t.profile.careGuidanceTitle}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <p className="text-sm font-semibold text-[#0369A1]">
                    {t.profile.dietaryInstructions}
                  </p>
                  <p className="mt-1 text-base text-slate-700 leading-relaxed">
                    {patientProfile.dietaryNotes}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#15803D]">{t.profile.mobilityExercise}</p>
                  <p className="mt-1 text-base text-slate-700 leading-relaxed">
                    {patientProfile.mobilityNotes}
                  </p>
                </div>
              </div>
            </div>

            <div className="ec-card rounded-2xl border border-[#DCE7F2] bg-white p-6">
              <div className="flex items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <HeartPulse className="w-5 h-5 text-[#0369A1]" />
                  <h3 className="text-lg font-bold text-slate-900">{t.profile.vitalsLogTitle}</h3>
                </div>
                {permissions.canManageProfile && (
                  <button
                    type="button"
                    onClick={() => setVitalModalOpen(true)}
                    className="min-h-[40px] px-4 py-2 rounded-xl bg-[#0369A1] hover:bg-[#075985] text-white text-sm font-semibold flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{t.profile.logVitalsBtn}</span>
                  </button>
                )}
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-[#DCE7F2] text-slate-600">
                      <th className="py-2.5 pr-4 font-semibold">{t.profile.colDateTime}</th>
                      <th className="py-2.5 pr-4 font-semibold">{t.profile.colBp}</th>
                      <th className="py-2.5 pr-4 font-semibold">{t.profile.colSugar}</th>
                      <th className="py-2.5 pr-4 font-semibold text-right">
                        {t.profile.colHeartRate}
                      </th>
                      <th className="py-2.5 font-semibold">{t.profile.colLoggedBy}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {vitals.map((v) => (
                      <tr key={v.id} className="hover:bg-[#F5F9FC]">
                        <td className="py-3 pr-4 font-mono-num text-slate-800 whitespace-nowrap">
                          {v.date}
                        </td>
                        <td className="py-3 pr-4 font-mono-num font-semibold text-slate-900">
                          {v.bloodPressure}
                        </td>
                        <td className="py-3 pr-4 font-mono-num text-slate-800">{v.bloodSugar}</td>
                        <td className="py-3 pr-4 font-mono-num text-right text-slate-900">
                          {v.heartRate} {t.profile.bpmSuffix}
                        </td>
                        <td className="py-3 text-slate-600">{v.recordedBy}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      <Modal
        open={vitalModalOpen}
        onClose={() => setVitalModalOpen(false)}
        closeLabel={t.common.closeModal}
        title={t.profile.recordVitalsTitle}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleAddVital} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-1">
              {t.profile.colBp}
            </label>
            <input
              type="text"
              required
              value={bp}
              onChange={(e) => setBp(e.target.value)}
              placeholder="e.g., 126/78 mmHg"
              className="w-full min-h-[46px] px-3.5 py-2 rounded-xl border border-[#CBD8E6] text-base"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-1">
              {t.profile.colSugar}
            </label>
            <input
              type="text"
              required
              value={sugar}
              onChange={(e) => setSugar(e.target.value)}
              placeholder="e.g., 118 mg/dL (Fasting)"
              className="w-full min-h-[46px] px-3.5 py-2 rounded-xl border border-[#CBD8E6] text-base"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-1">
              {t.profile.colHeartRate} ({t.profile.bpmSuffix})
            </label>
            <input
              type="number"
              required
              min={40}
              max={180}
              value={hr}
              onChange={(e) => setHr(e.target.value)}
              className="w-full min-h-[46px] px-3.5 py-2 rounded-xl border border-[#CBD8E6] text-base"
            />
          </div>
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setVitalModalOpen(false)}
              className="min-h-[44px] px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-medium cursor-pointer"
            >
              {t.actions.cancel}
            </button>
            <button
              type="submit"
              className="min-h-[44px] px-5 py-2 rounded-xl bg-[#0369A1] text-white font-semibold cursor-pointer"
            >
              {t.profile.saveVitalsBtn}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
