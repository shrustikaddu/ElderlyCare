import React, { useState } from 'react';
import { AlertTriangle, Edit3, PackagePlus, Plus, Search, Trash2 } from 'lucide-react';
import {
  ConfirmDialog,
  EmptyState,
  Modal,
  PageHeader,
  ReadOnlyBanner,
} from '../components/common/UI';
import { useApp } from '../context/AppContext';
import { Medication } from '../types';
import { isValidTimeString, normalizeTimeString } from '../utils/validation';

const EMPTY_MED_FORM: Omit<Medication, 'id'> = {
  name: '',
  dosage: '',
  frequency: 'Once daily',
  timings: ['08:00 AM'],
  startDate: '2026-11-14',
  endDate: '2026-12-31',
  mealInstruction: 'After food',
  stockCount: 30,
  lowStockThreshold: 7,
  prescribedBy: 'Dr. Kavitha Deshmukh',
  purpose: '',
  reminderEnabled: true,
};

export const MedicationsPage: React.FC = () => {
  const {
    medications,
    addMedication,
    updateMedication,
    deleteMedication,
    restockMedication,
    permissions,
    navigateTo,
    t,
  } = useApp();

  const [search, setSearch] = useState('');
  const [filterMode, setFilterMode] = useState<
    'all' | 'low' | 'once' | 'twice' | 'three' | 'needed'
  >('all');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingMed, setEditingMed] = useState<Medication | null>(null);
  const [form, setForm] = useState<Omit<Medication, 'id'>>(EMPTY_MED_FORM);
  const [timingsText, setTimingsText] = useState('08:00 AM');
  const [formError, setFormError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<Medication | null>(null);

  const frequencyLabelMap: Record<Medication['frequency'], string> = {
    'Once daily': t.medications.freqOnce,
    'Twice daily': t.medications.freqTwice,
    'Three times daily': t.medications.freqThree,
    'As needed': t.medications.freqAsNeeded,
  };

  const mealLabelMap: Record<Medication['mealInstruction'], string> = {
    'Before food': t.medications.mealBefore,
    'After food': t.medications.mealAfter,
    'With water': t.medications.mealWater,
    Bedtime: t.medications.mealBedtime,
  };

  const openAddModal = () => {
    setEditingMed(null);
    setForm(EMPTY_MED_FORM);
    setTimingsText('08:00 AM');
    setFormError('');
    setModalOpen(true);
  };

  const openEditModal = (med: Medication) => {
    setEditingMed(med);
    const { id: _id, ...rest } = med;
    setForm(rest);
    setTimingsText(med.timings.join(', '));
    setFormError('');
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = form.name.trim();
    const trimmedDosage = form.dosage.trim();
    const trimmedDoctor = form.prescribedBy.trim();
    const trimmedPurpose = form.purpose.trim();

    if (!trimmedName) {
      setFormError(t.medications.errNameRequired);
      return;
    }
    if (!trimmedDosage) {
      setFormError(t.medications.errDosageRequired);
      return;
    }

    const rawTimings = timingsText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    if (rawTimings.length === 0) {
      setFormError(t.medications.errTimingsRequired);
      return;
    }

    if (rawTimings.some((item) => !isValidTimeString(item))) {
      setFormError(t.medications.errTimingFormat);
      return;
    }

    if (!form.startDate || !form.endDate) {
      setFormError(t.medications.errDateRequired);
      return;
    }

    if (form.endDate < form.startDate) {
      setFormError(t.medications.errDateRange);
      return;
    }

    if (!Number.isFinite(form.stockCount) || form.stockCount < 0) {
      setFormError(t.medications.errStockInvalid);
      return;
    }

    if (!Number.isFinite(form.lowStockThreshold) || form.lowStockThreshold < 1) {
      setFormError(t.medications.errThresholdInvalid);
      return;
    }

    const normalizedTimings = rawTimings.map(normalizeTimeString);

    const payload: Omit<Medication, 'id'> = {
      ...form,
      name: trimmedName,
      dosage: trimmedDosage,
      prescribedBy: trimmedDoctor || 'Dr. Kavitha Deshmukh',
      purpose: trimmedPurpose,
      timings: normalizedTimings,
      stockCount: Math.floor(form.stockCount),
      lowStockThreshold: Math.floor(form.lowStockThreshold),
    };

    if (editingMed) {
      updateMedication({ ...payload, id: editingMed.id });
    } else {
      addMedication(payload);
    }
    setFormError('');
    setModalOpen(false);
  };

  const filtered = medications.filter((med) => {
    const q = search.trim().toLowerCase();
    const matchesSearch =
      !q ||
      med.name.toLowerCase().includes(q) ||
      med.purpose.toLowerCase().includes(q) ||
      med.prescribedBy.toLowerCase().includes(q);

    if (!matchesSearch) return false;
    if (filterMode === 'low') return med.stockCount <= med.lowStockThreshold;
    if (filterMode === 'once') return med.frequency === 'Once daily';
    if (filterMode === 'twice') return med.frequency === 'Twice daily';
    if (filterMode === 'three') return med.frequency === 'Three times daily';
    if (filterMode === 'needed') return med.frequency === 'As needed';
    return true;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title={t.nav.medications}
        subtitle={t.medications.subtitle}
        action={
          permissions.canManageMedications ? (
            <button
              type="button"
              onClick={openAddModal}
              className="min-h-[44px] px-5 py-2.5 rounded-xl bg-[#0369A1] hover:bg-[#075985] text-white font-semibold text-sm flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{t.medications.addMedicine}</span>
            </button>
          ) : undefined
        }
      />

      {!permissions.canManageMedications && (
        <ReadOnlyBanner
          title={t.common.readOnlyNotice}
          message={t.common.permissionDenied}
          actionLabel={t.common.switchAccountBtn}
          onAction={() => navigateTo('auth')}
        />
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.medications.searchPlaceholder}
            className="w-full min-h-[44px] pl-10 pr-4 py-2 rounded-xl border border-[#DCE7F2] bg-white text-sm text-slate-900 focus:outline-2 focus:outline-[#0369A1]"
          />
        </div>

        <div className="flex items-center gap-1 p-1 rounded-xl bg-[#EFF6FB] border border-[#DCE7F2] w-fit max-w-full overflow-x-auto">
          {(
            [
              { id: 'all', label: `${t.medications.filterAll} (${medications.length})` },
              {
                id: 'low',
                label: `${t.medications.filterLow} (${medications.filter((m) => m.stockCount <= m.lowStockThreshold).length})`,
              },
              { id: 'once', label: t.medications.filterOnce },
              { id: 'twice', label: t.medications.filterTwice },
              { id: 'three', label: t.medications.filterThree },
              { id: 'needed', label: t.medications.filterAsNeeded },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterMode(tab.id)}
              className={`min-h-[36px] px-3.5 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap shrink-0 cursor-pointer ${
                filterMode === tab.id
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title={t.medications.emptyTitle}
          description={t.medications.emptyDesc}
          actionLabel={permissions.canManageMedications ? t.medications.addMedicine : undefined}
          onAction={permissions.canManageMedications ? openAddModal : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map((med) => {
            const isLow = med.stockCount <= med.lowStockThreshold;
            return (
              <article
                key={med.id}
                className="ec-card rounded-2xl border border-[#DCE7F2] bg-white p-6 flex flex-col justify-between gap-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">
                        {med.name}{' '}
                        <span className="text-base font-semibold text-[#0369A1]">{med.dosage}</span>
                      </h2>
                      <p className="mt-1 text-sm text-slate-600">
                        {frequencyLabelMap[med.frequency]} · {mealLabelMap[med.mealInstruction]} ·{' '}
                        {med.purpose || t.medications.prescribedCare}
                      </p>
                    </div>
                    <span
                      className={`text-sm font-semibold tabular-nums whitespace-nowrap shrink-0 flex items-center gap-1 ${
                        isLow ? 'text-amber-800' : 'text-[#15803D]'
                      }`}
                    >
                      {isLow && <AlertTriangle className="w-4 h-4" />}
                      <span>
                        {med.stockCount} {t.medications.leftLabel} ·{' '}
                        {isLow ? t.status.lowStock : t.status.adequateStock}
                      </span>
                    </span>
                  </div>

                  <dl className="mt-4 grid grid-cols-2 gap-3 pt-4 border-t border-slate-100 text-sm">
                    <div>
                      <dt className="text-slate-500">{t.medications.timingsLabel}</dt>
                      <dd className="mt-0.5 font-mono-num font-semibold text-slate-900">
                        {med.timings.join(', ')}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-slate-500">{t.medications.prescribedByLabel}</dt>
                      <dd className="mt-0.5 font-medium text-slate-900">{med.prescribedBy}</dd>
                    </div>
                    <div>
                      <dt className="text-slate-500">{t.medications.courseDurationLabel}</dt>
                      <dd className="mt-0.5 font-mono-num text-slate-800">
                        {med.startDate} {t.medications.toWord} {med.endDate}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-slate-500">{t.medications.refillThresholdLabel}</dt>
                      <dd className="mt-0.5 font-mono-num text-slate-800">
                        {med.lowStockThreshold} {t.medications.unitsLabel}
                      </dd>
                    </div>
                  </dl>
                </div>

                {permissions.canManageMedications && (
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => restockMedication(med.id, 15)}
                      className="min-h-[40px] px-3.5 py-2 rounded-xl border border-[#BAE6FD] bg-[#F0F9FF] hover:bg-[#E0F2FE] text-[#0369A1] text-sm font-semibold flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
                    >
                      <PackagePlus className="w-4 h-4" />
                      <span>{t.actions.restock}</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => openEditModal(med)}
                        className="min-h-[40px] px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium flex items-center gap-1.5 cursor-pointer"
                      >
                        <Edit3 className="w-4 h-4" />
                        <span>{t.actions.edit}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(med)}
                        className="min-h-[40px] px-3.5 py-2 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 text-sm font-medium flex items-center gap-1.5 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>{t.actions.delete}</span>
                      </button>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        closeLabel={t.common.closeModal}
        title={
          editingMed
            ? `${t.medications.editTitlePrefix} ${editingMed.name}`
            : t.medications.addModalTitle
        }
        subtitle={t.medications.modalSubtitle}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {formError && (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800"
            >
              {formError}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1">
                {t.medications.fieldName}
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => {
                  setFormError('');
                  setForm({ ...form, name: e.target.value });
                }}
                placeholder="e.g., Losartan"
                className="w-full min-h-[46px] px-3.5 py-2 rounded-xl border border-[#CBD8E6] text-base"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1">
                {t.medications.fieldDosage}
              </label>
              <input
                type="text"
                required
                value={form.dosage}
                onChange={(e) => {
                  setFormError('');
                  setForm({ ...form, dosage: e.target.value });
                }}
                placeholder="e.g., 50 mg"
                className="w-full min-h-[46px] px-3.5 py-2 rounded-xl border border-[#CBD8E6] text-base"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1">
                {t.medications.fieldFrequency}
              </label>
              <select
                value={form.frequency}
                onChange={(e) =>
                  setForm({ ...form, frequency: e.target.value as Medication['frequency'] })
                }
                className="w-full min-h-[46px] px-3.5 py-2 rounded-xl border border-[#CBD8E6] bg-white text-base"
              >
                <option value="Once daily">{t.medications.freqOnce}</option>
                <option value="Twice daily">{t.medications.freqTwice}</option>
                <option value="Three times daily">{t.medications.freqThree}</option>
                <option value="As needed">{t.medications.freqAsNeeded}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1">
                {t.medications.fieldMeal}
              </label>
              <select
                value={form.mealInstruction}
                onChange={(e) =>
                  setForm({
                    ...form,
                    mealInstruction: e.target.value as Medication['mealInstruction'],
                  })
                }
                className="w-full min-h-[46px] px-3.5 py-2 rounded-xl border border-[#CBD8E6] bg-white text-base"
              >
                <option value="Before food">{t.medications.mealBefore}</option>
                <option value="After food">{t.medications.mealAfter}</option>
                <option value="With water">{t.medications.mealWater}</option>
                <option value="Bedtime">{t.medications.mealBedtime}</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-1">
              {t.medications.fieldTimings}
            </label>
            <input
              type="text"
              required
              value={timingsText}
              onChange={(e) => {
                setFormError('');
                setTimingsText(e.target.value);
              }}
              placeholder="08:00 AM, 08:00 PM"
              className="w-full min-h-[46px] px-3.5 py-2 rounded-xl border border-[#CBD8E6] text-base font-mono-num"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1">
                {t.medications.fieldStartDate}
              </label>
              <input
                type="date"
                required
                value={form.startDate}
                onChange={(e) => {
                  setFormError('');
                  setForm({ ...form, startDate: e.target.value });
                }}
                className="w-full min-h-[46px] px-3.5 py-2 rounded-xl border border-[#CBD8E6] text-base"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1">
                {t.medications.fieldEndDate}
              </label>
              <input
                type="date"
                required
                value={form.endDate}
                onChange={(e) => {
                  setFormError('');
                  setForm({ ...form, endDate: e.target.value });
                }}
                className="w-full min-h-[46px] px-3.5 py-2 rounded-xl border border-[#CBD8E6] text-base"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1">
                {t.medications.fieldStock}
              </label>
              <input
                type="number"
                min={0}
                required
                value={Number.isNaN(form.stockCount) ? '' : form.stockCount}
                onChange={(e) => {
                  setFormError('');
                  setForm({
                    ...form,
                    stockCount: e.target.value === '' ? Number.NaN : Number(e.target.value),
                  });
                }}
                className="w-full min-h-[46px] px-3.5 py-2 rounded-xl border border-[#CBD8E6] text-base"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1">
                {t.medications.fieldThreshold}
              </label>
              <input
                type="number"
                min={1}
                required
                value={Number.isNaN(form.lowStockThreshold) ? '' : form.lowStockThreshold}
                onChange={(e) => {
                  setFormError('');
                  setForm({
                    ...form,
                    lowStockThreshold: e.target.value === '' ? Number.NaN : Number(e.target.value),
                  });
                }}
                className="w-full min-h-[46px] px-3.5 py-2 rounded-xl border border-[#CBD8E6] text-base"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1">
                {t.medications.fieldDoctor}
              </label>
              <input
                type="text"
                value={form.prescribedBy}
                onChange={(e) => setForm({ ...form, prescribedBy: e.target.value })}
                className="w-full min-h-[46px] px-3.5 py-2 rounded-xl border border-[#CBD8E6] text-base"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-1">
              {t.medications.fieldPurpose}
            </label>
            <input
              type="text"
              value={form.purpose}
              onChange={(e) => setForm({ ...form, purpose: e.target.value })}
              placeholder="e.g., Blood pressure regulation"
              className="w-full min-h-[46px] px-3.5 py-2 rounded-xl border border-[#CBD8E6] text-base"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="min-h-[44px] px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-medium cursor-pointer"
            >
              {t.actions.cancel}
            </button>
            <button
              type="submit"
              className="min-h-[44px] px-6 py-2.5 rounded-xl bg-[#0369A1] hover:bg-[#075985] text-white font-semibold cursor-pointer"
            >
              {editingMed ? t.actions.save : t.medications.addMedicine}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title={t.medications.deleteTitle}
        message={`${t.medications.deleteMessagePrefix} ${deleteTarget?.name} (${deleteTarget?.dosage}) ${t.medications.deleteMessageSuffix}`}
        confirmLabel={t.medications.deleteConfirmBtn}
        cancelLabel={t.actions.cancel}
        onConfirm={() => {
          if (deleteTarget) deleteMedication(deleteTarget.id);
          setDeleteTarget(null);
        }}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
