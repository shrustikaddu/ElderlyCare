import React, { useState } from 'react';
import { Clock, Edit3, Phone, Plus, Trash2, UserCheck } from 'lucide-react';
import {
  ConfirmDialog,
  EmptyState,
  Modal,
  PageHeader,
  ReadOnlyBanner,
  SafeImage,
} from '../components/common/UI';
import { useApp } from '../context/AppContext';
import { translateCaretakerShift, translateCaretakerStatus } from '../i18n/helpers';
import { Caretaker } from '../types';

const EMPTY_CARETAKER: Omit<Caretaker, 'id'> = {
  name: '',
  roleTitle: 'Home Care Nurse',
  phone: '',
  email: '',
  shift: 'Morning (7 AM - 2 PM)',
  responsibilities: ['Medication Administration', 'Vitals Check'],
  lastCheckIn: 'Pending check-in',
  status: 'On Duty',
};

export const CaretakersPage: React.FC = () => {
  const {
    caretakers,
    addCaretaker,
    updateCaretaker,
    deleteCaretaker,
    checkInCaretaker,
    permissions,
    navigateTo,
    t,
  } = useApp();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCaretaker, setEditingCaretaker] = useState<Caretaker | null>(null);
  const [form, setForm] = useState<Omit<Caretaker, 'id'>>(EMPTY_CARETAKER);
  const [dutiesText, setDutiesText] = useState('Medication Administration, Vitals Check');
  const [deleteTarget, setDeleteTarget] = useState<Caretaker | null>(null);

  const openAdd = () => {
    setEditingCaretaker(null);
    setForm(EMPTY_CARETAKER);
    setDutiesText('Medication Administration, Vitals Check');
    setModalOpen(true);
  };

  const openEdit = (c: Caretaker) => {
    setEditingCaretaker(c);
    const { id: _id, ...rest } = c;
    setForm(rest);
    setDutiesText(c.responsibilities.join(', '));
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: Omit<Caretaker, 'id'> = {
      ...form,
      responsibilities: dutiesText
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    };
    const ok = editingCaretaker
      ? updateCaretaker({ ...payload, id: editingCaretaker.id })
      : addCaretaker(payload);
    if (ok) setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={t.nav.caretakers}
        subtitle={t.caretakers.subtitle}
        action={
          permissions.canManageCareCircle ? (
            <button
              type="button"
              onClick={openAdd}
              className="min-h-[44px] px-5 py-2.5 rounded-xl bg-[#0369A1] hover:bg-[#075985] text-white font-semibold text-sm flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{t.caretakers.addBtn}</span>
            </button>
          ) : undefined
        }
      />

      {!permissions.canManageCareCircle && !permissions.canCheckInCaretaker && (
        <ReadOnlyBanner
          title={t.common.readOnlyNotice}
          message={t.common.careCirclePermissionDenied}
          actionLabel={t.common.switchAccountBtn}
          onAction={() => navigateTo('auth')}
        />
      )}

      {caretakers.length === 0 ? (
        <EmptyState
          title={t.caretakers.emptyTitle}
          description={t.caretakers.emptyDesc}
          actionLabel={permissions.canManageCareCircle ? t.caretakers.addBtn : undefined}
          onAction={permissions.canManageCareCircle ? openAdd : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {caretakers.map((c) => (
            <article
              key={c.id}
              className="ec-card rounded-2xl border border-[#DCE7F2] bg-white p-6 flex flex-col justify-between gap-5"
            >
              <div>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <SafeImage
                      src={c.avatarUrl}
                      alt={c.name}
                      className="w-16 h-16 rounded-2xl object-cover border border-[#CBE2F5] shrink-0"
                    />
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">{c.name}</h2>
                      <p className="text-sm text-[#0369A1] font-medium">{c.roleTitle}</p>
                      <p className="mt-1 text-sm font-mono-num text-slate-600 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{c.phone}</span>
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-sm font-semibold whitespace-nowrap ${
                      c.status === 'On Duty'
                        ? 'text-[#15803D]'
                        : c.status === 'Off Duty'
                        ? 'text-slate-600'
                        : 'text-amber-700'
                    }`}
                  >
                    {translateCaretakerStatus(c.status, t)}
                  </span>
                </div>

                <dl className="mt-5 pt-4 border-t border-slate-100 space-y-2.5 text-sm">
                  <div className="flex items-center justify-between gap-2">
                    <dt className="text-slate-500">{t.caretakers.assignedShift}</dt>
                    <dd className="font-semibold text-slate-900">
                      {translateCaretakerShift(c.shift, t)}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <dt className="text-slate-500">{t.caretakers.lastCheckIn}</dt>
                    <dd className="font-mono-num text-slate-800">{c.lastCheckIn}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-500 mb-1">{t.caretakers.responsibilitiesLabel}</dt>
                    <dd className="text-slate-800">{c.responsibilities.join(' · ')}</dd>
                  </div>
                </dl>
              </div>

              {(permissions.canCheckInCaretaker || permissions.canManageCareCircle) && (
                <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100">
                  {permissions.canCheckInCaretaker && (
                    <button
                      type="button"
                      onClick={() => checkInCaretaker(c.id)}
                      className="min-h-[40px] px-4 py-2 rounded-xl border border-[#C6EBD4] bg-[#F0FAF4] hover:bg-[#DCFCE7] text-[#15803D] text-sm font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      <UserCheck className="w-4 h-4" />
                      <span>{t.caretakers.logCheckInBtn}</span>
                    </button>
                  )}

                  {permissions.canManageCareCircle && (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => openEdit(c)}
                        className="min-h-[40px] px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium flex items-center gap-1.5 cursor-pointer"
                      >
                        <Edit3 className="w-4 h-4" />
                        <span>{t.actions.edit}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(c)}
                        className="min-h-[40px] px-3.5 py-2 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 text-sm font-medium flex items-center gap-1.5 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>{t.actions.delete}</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </article>
          ))}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        closeLabel={t.common.closeModal}
        title={editingCaretaker ? t.caretakers.editModalTitle : t.caretakers.createModalTitle}
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1">
                {t.caretakers.fieldName}
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full min-h-[46px] px-3.5 py-2 rounded-xl border border-[#CBD8E6] text-base"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1">
                {t.caretakers.fieldRoleTitle}
              </label>
              <input
                type="text"
                required
                value={form.roleTitle}
                onChange={(e) => setForm({ ...form, roleTitle: e.target.value })}
                className="w-full min-h-[46px] px-3.5 py-2 rounded-xl border border-[#CBD8E6] text-base"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1">
                {t.caretakers.fieldPhone}
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
                {t.caretakers.fieldEmail}
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full min-h-[46px] px-3.5 py-2 rounded-xl border border-[#CBD8E6] text-base"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1">
                {t.caretakers.fieldShift}
              </label>
              <select
                value={form.shift}
                onChange={(e) =>
                  setForm({ ...form, shift: e.target.value as Caretaker['shift'] })
                }
                className="w-full min-h-[46px] px-3.5 py-2 rounded-xl border border-[#CBD8E6] bg-white text-base"
              >
                <option value="Morning (7 AM - 2 PM)">{t.caretakers.shiftMorning}</option>
                <option value="Evening (2 PM - 9 PM)">{t.caretakers.shiftEvening}</option>
                <option value="Full-Day Live-In">{t.caretakers.shiftFullDay}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1">
                {t.caretakers.fieldStatus}
              </label>
              <select
                value={form.status}
                onChange={(e) =>
                  setForm({ ...form, status: e.target.value as Caretaker['status'] })
                }
                className="w-full min-h-[46px] px-3.5 py-2 rounded-xl border border-[#CBD8E6] bg-white text-base"
              >
                <option value="On Duty">{t.caretakers.statusOnDuty}</option>
                <option value="Off Duty">{t.caretakers.statusOffDuty}</option>
                <option value="On Leave">{t.caretakers.statusOnLeave}</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-1">
              {t.caretakers.fieldDuties}
            </label>
            <input
              type="text"
              required
              value={dutiesText}
              onChange={(e) => setDutiesText(e.target.value)}
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
              className="min-h-[44px] px-6 py-2.5 rounded-xl bg-[#0369A1] hover:bg-[#075985] text-white font-semibold flex items-center gap-2 cursor-pointer"
            >
              <Clock className="w-4 h-4" />
              <span>{editingCaretaker ? t.actions.save : t.caretakers.addBtn}</span>
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title={t.caretakers.deleteTitle}
        message={`${t.caretakers.deleteMsgPrefix} ${deleteTarget?.name} ${t.caretakers.deleteMsgSuffix}`}
        confirmLabel={t.caretakers.deleteConfirmBtn}
        cancelLabel={t.actions.cancel}
        onConfirm={() => {
          if (deleteTarget) deleteCaretaker(deleteTarget.id);
          setDeleteTarget(null);
        }}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
