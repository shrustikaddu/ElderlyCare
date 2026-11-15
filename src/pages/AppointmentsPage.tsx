import React, { useState } from 'react';
import { Calendar, CheckCircle2, Edit3, Plus, Trash2, XCircle } from 'lucide-react';
import {
  ConfirmDialog,
  EmptyState,
  Modal,
  PageHeader,
  ReadOnlyBanner,
} from '../components/common/UI';
import { useApp } from '../context/AppContext';
import { translateAppointmentStatus, translateVisitType } from '../i18n/helpers';
import { Appointment, AppointmentStatus } from '../types';

const EMPTY_APPT: Omit<Appointment, 'id'> = {
  doctorName: '',
  specialty: '',
  clinicName: '',
  date: '2026-11-25',
  time: '11:00 AM',
  visitType: 'In-Person',
  purpose: '',
  status: 'Scheduled',
  notes: '',
};

export const AppointmentsPage: React.FC = () => {
  const {
    appointments,
    addAppointment,
    updateAppointment,
    deleteAppointment,
    permissions,
    navigateTo,
    t,
  } = useApp();

  const [statusFilter, setStatusFilter] = useState<'All' | AppointmentStatus>('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAppt, setEditingAppt] = useState<Appointment | null>(null);
  const [form, setForm] = useState<Omit<Appointment, 'id'>>(EMPTY_APPT);
  const [deleteTarget, setDeleteTarget] = useState<Appointment | null>(null);

  const filterLabels: Record<'All' | AppointmentStatus, string> = {
    All: t.appointments.filterAll,
    Scheduled: t.appointments.filterScheduled,
    Completed: t.appointments.filterCompleted,
    Cancelled: t.appointments.filterCancelled,
  };

  const openScheduleModal = () => {
    setEditingAppt(null);
    setForm(EMPTY_APPT);
    setModalOpen(true);
  };

  const openEditModal = (appt: Appointment) => {
    setEditingAppt(appt);
    const { id: _id, ...rest } = appt;
    setForm(rest);
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = editingAppt
      ? updateAppointment({ ...form, id: editingAppt.id })
      : addAppointment(form);
    if (ok) setModalOpen(false);
  };

  const filtered =
    statusFilter === 'All'
      ? appointments
      : appointments.filter((a) => a.status === statusFilter);

  return (
    <div className="space-y-6">
      <PageHeader
        title={t.nav.appointments}
        subtitle={t.appointments.subtitle}
        action={
          permissions.canManageAppointments ? (
            <button
              type="button"
              onClick={openScheduleModal}
              className="min-h-[44px] px-5 py-2.5 rounded-xl bg-[#0369A1] hover:bg-[#075985] text-white font-semibold text-sm flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{t.appointments.scheduleBtn}</span>
            </button>
          ) : undefined
        }
      />

      {!permissions.canManageAppointments && (
        <ReadOnlyBanner
          title={t.common.readOnlyNotice}
          message={t.common.permissionDenied}
          actionLabel={t.common.switchAccountBtn}
          onAction={() => navigateTo('auth')}
        />
      )}

      <div className="flex items-center gap-1 p-1 rounded-xl bg-[#EFF6FB] border border-[#DCE7F2] w-fit">
        {(['All', 'Scheduled', 'Completed', 'Cancelled'] as const).map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => setStatusFilter(status)}
            className={`min-h-[36px] px-4 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap cursor-pointer ${
              statusFilter === status
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {filterLabels[status]}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title={t.appointments.emptyTitle}
          description={t.appointments.emptyDesc}
          actionLabel={permissions.canManageAppointments ? t.appointments.scheduleBtn : undefined}
          onAction={permissions.canManageAppointments ? openScheduleModal : undefined}
        />
      ) : (
        <div className="space-y-4">
          {filtered.map((appt) => (
            <article
              key={appt.id}
              className="ec-card rounded-2xl border border-[#DCE7F2] bg-white p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-5"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-3 flex-wrap">
                  <span
                    className={`text-sm font-semibold ${
                      appt.status === 'Scheduled'
                        ? 'text-[#0369A1]'
                        : appt.status === 'Completed'
                        ? 'text-[#15803D]'
                        : 'text-red-700'
                    }`}
                  >
                    {translateAppointmentStatus(appt.status, t)}
                  </span>
                  <span aria-hidden="true" className="text-slate-300">
                    ·
                  </span>
                  <span className="font-mono-num text-sm font-semibold text-slate-900">
                    {appt.date} · {appt.time}
                  </span>
                  <span aria-hidden="true" className="text-slate-300">
                    ·
                  </span>
                  <span className="text-sm text-slate-600">
                    {translateVisitType(appt.visitType, t)}
                  </span>
                </div>

                <h2 className="text-xl font-bold text-slate-900">{appt.doctorName}</h2>
                <p className="text-sm text-slate-700">
                  {appt.specialty} · {appt.clinicName}
                </p>
                <p className="text-sm text-slate-600">
                  {t.appointments.purposeLabel} {appt.purpose}
                  {appt.notes ? ` · ${t.appointments.noteLabel} ${appt.notes}` : ''}
                </p>
              </div>

              {permissions.canManageAppointments && (
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  {appt.status === 'Scheduled' && (
                    <>
                      <button
                        type="button"
                        onClick={() => updateAppointment({ ...appt, status: 'Completed' })}
                        className="min-h-[40px] px-3.5 py-2 rounded-xl border border-[#C6EBD4] bg-[#F0FAF4] hover:bg-[#DCFCE7] text-[#15803D] text-sm font-semibold flex items-center gap-1.5 cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{t.appointments.markCompleted}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => updateAppointment({ ...appt, status: 'Cancelled' })}
                        className="min-h-[40px] px-3.5 py-2 rounded-xl border border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-800 text-sm font-semibold flex items-center gap-1.5 cursor-pointer"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>{t.appointments.cancelVisit}</span>
                      </button>
                    </>
                  )}

                  <button
                    type="button"
                    onClick={() => openEditModal(appt)}
                    className="min-h-[40px] px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium flex items-center gap-1.5 cursor-pointer"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>{t.actions.edit}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeleteTarget(appt)}
                    className="min-h-[40px] px-3.5 py-2 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 text-sm font-medium flex items-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>{t.actions.delete}</span>
                  </button>
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
        title={editingAppt ? t.appointments.editModalTitle : t.appointments.createModalTitle}
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1">
                {t.appointments.fieldDoctor}
              </label>
              <input
                type="text"
                required
                value={form.doctorName}
                onChange={(e) => setForm({ ...form, doctorName: e.target.value })}
                placeholder="e.g., Dr. Kavitha Deshmukh"
                className="w-full min-h-[46px] px-3.5 py-2 rounded-xl border border-[#CBD8E6] text-base"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1">
                {t.appointments.fieldSpecialty}
              </label>
              <input
                type="text"
                required
                value={form.specialty}
                onChange={(e) => setForm({ ...form, specialty: e.target.value })}
                placeholder="e.g., Cardiology"
                className="w-full min-h-[46px] px-3.5 py-2 rounded-xl border border-[#CBD8E6] text-base"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-1">
              {t.appointments.fieldClinic}
            </label>
            <input
              type="text"
              required
              value={form.clinicName}
              onChange={(e) => setForm({ ...form, clinicName: e.target.value })}
              placeholder="e.g., Manipal Care Clinic, Indiranagar"
              className="w-full min-h-[46px] px-3.5 py-2 rounded-xl border border-[#CBD8E6] text-base"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1">
                {t.appointments.fieldDate}
              </label>
              <input
                type="date"
                required
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full min-h-[46px] px-3.5 py-2 rounded-xl border border-[#CBD8E6] text-base"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1">
                {t.appointments.fieldTime}
              </label>
              <input
                type="text"
                required
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                placeholder="10:30 AM"
                className="w-full min-h-[46px] px-3.5 py-2 rounded-xl border border-[#CBD8E6] text-base font-mono-num"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1">
                {t.appointments.fieldVisitType}
              </label>
              <select
                value={form.visitType}
                onChange={(e) =>
                  setForm({ ...form, visitType: e.target.value as Appointment['visitType'] })
                }
                className="w-full min-h-[46px] px-3.5 py-2 rounded-xl border border-[#CBD8E6] bg-white text-base"
              >
                <option value="In-Person">{t.appointments.inPerson}</option>
                <option value="Teleconsultation">{t.appointments.teleconsultation}</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-1">
              {t.appointments.fieldPurpose}
            </label>
            <input
              type="text"
              required
              value={form.purpose}
              onChange={(e) => setForm({ ...form, purpose: e.target.value })}
              placeholder="e.g., Blood pressure review & prescription renewal"
              className="w-full min-h-[46px] px-3.5 py-2 rounded-xl border border-[#CBD8E6] text-base"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-1">
              {t.appointments.fieldNotes}
            </label>
            <textarea
              rows={2}
              value={form.notes || ''}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-[#CBD8E6] text-base"
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
              <Calendar className="w-4 h-4" />
              <span>{editingAppt ? t.actions.save : t.appointments.confirmBtn}</span>
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title={t.appointments.deleteTitle}
        message={`${t.appointments.deleteMsgPrefix} ${deleteTarget?.doctorName} ${t.appointments.deleteMsgOn} ${deleteTarget?.date}?`}
        confirmLabel={t.appointments.deleteConfirmBtn}
        cancelLabel={t.actions.cancel}
        onConfirm={() => {
          if (deleteTarget) deleteAppointment(deleteTarget.id);
          setDeleteTarget(null);
        }}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
