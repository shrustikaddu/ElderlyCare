import React, { useState } from 'react';
import { Edit3, MessageSquarePlus, Phone, Plus, ShieldCheck, Trash2 } from 'lucide-react';
import {
  ConfirmDialog,
  Modal,
  PageHeader,
  ReadOnlyBanner,
  SafeImage,
} from '../components/common/UI';
import { useApp } from '../context/AppContext';
import { FamilyMember } from '../types';

const EMPTY_MEMBER: Omit<FamilyMember, 'id'> = {
  name: '',
  relationship: '',
  phone: '',
  email: '',
  isEmergencyContact: true,
  receiveMissedAlerts: true,
  canEditSchedule: false,
  location: '',
};

export const FamilyPage: React.FC = () => {
  const {
    familyMembers,
    addFamilyMember,
    updateFamilyMember,
    deleteFamilyMember,
    careNotes,
    addCareNote,
    doseSlots,
    patientProfile,
    permissions,
    navigateTo,
    t,
  } = useApp();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null);
  const [form, setForm] = useState<Omit<FamilyMember, 'id'>>(EMPTY_MEMBER);
  const [deleteTarget, setDeleteTarget] = useState<FamilyMember | null>(null);
  const [noteInput, setNoteInput] = useState('');

  const takenCount = doseSlots.filter((d) => d.status === 'taken').length;
  const missedCount = doseSlots.filter((d) => d.status === 'missed').length;

  const openAdd = () => {
    setEditingMember(null);
    setForm(EMPTY_MEMBER);
    setModalOpen(true);
  };

  const openEdit = (member: FamilyMember) => {
    setEditingMember(member);
    const { id: _id, ...rest } = member;
    setForm(rest);
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = editingMember
      ? updateFamilyMember({ ...form, id: editingMember.id })
      : addFamilyMember(form);
    if (ok) setModalOpen(false);
  };

  const handlePostNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteInput.trim()) return;
    if (addCareNote(noteInput)) {
      setNoteInput('');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={t.nav.family}
        subtitle={t.family.subtitle}
        action={
          permissions.canManageCareCircle ? (
            <button
              type="button"
              onClick={openAdd}
              className="min-h-[44px] px-5 py-2.5 rounded-xl bg-[#0369A1] hover:bg-[#075985] text-white font-semibold text-sm flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{t.family.addMember}</span>
            </button>
          ) : undefined
        }
      />

      {!permissions.canManageCareCircle && (
        <ReadOnlyBanner
          title={t.common.readOnlyNotice}
          message={t.common.careCirclePermissionDenied}
          actionLabel={t.common.switchAccountBtn}
          onAction={() => navigateTo('auth')}
        />
      )}

      {/* Shared Care Circle Status & Access Permissions Strip */}
      <div className="ec-card rounded-2xl border border-[#CBE2F5] bg-[#F0F7FC] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            {t.family.sharedStatusPrefix} · {patientProfile.fullName}
          </h2>
          <p className="mt-1 text-sm text-slate-700">
            <strong>{takenCount}</strong> / <strong>{doseSlots.length}</strong> {t.status.taken} ·{' '}
            <strong className={missedCount > 0 ? 'text-red-700' : 'text-[#15803D]'}>
              {missedCount} {t.status.missed}
            </strong>{' '}
            · {familyMembers.filter((f) => f.receiveMissedAlerts).length} {t.family.subscribedSuffix}
          </p>
          <p className="mt-1 text-xs text-slate-600">
            <strong>{t.family.permissionsCardTitle}:</strong> {t.family.permissionsCardDesc}
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm font-semibold text-[#15803D] shrink-0">
          <ShieldCheck className="w-5 h-5" />
          <span>{t.family.sharedSyncActive}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 space-y-4">
          {familyMembers.map((member) => (
            <article
              key={member.id}
              className="ec-card rounded-2xl border border-[#DCE7F2] bg-white p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <SafeImage
                  src={member.avatarUrl}
                  alt={member.name}
                  className="w-14 h-14 rounded-full object-cover border border-[#CBE2F5] shrink-0"
                />
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{member.name}</h3>
                  <p className="text-sm text-[#0369A1] font-medium">
                    {member.relationship} · {member.location}
                  </p>
                  <p className="mt-1 text-sm text-slate-600 font-mono-num flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{member.phone}</span>
                  </p>
                  <p className="mt-1.5 text-xs text-slate-600">
                    {member.isEmergencyContact ? t.family.emergencyContact : t.family.standardContact} ·{' '}
                    {member.receiveMissedAlerts ? t.family.receivesAlerts : t.family.alertsOff} ·{' '}
                    {member.canEditSchedule ? t.family.canEditSchedule : t.family.viewOnly}
                  </p>
                </div>
              </div>

              {permissions.canManageCareCircle && (
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => openEdit(member)}
                    className="min-h-[40px] px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium flex items-center gap-1.5 cursor-pointer"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>{t.actions.edit}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(member)}
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

        {/* Shared Care Circle Notes Feed */}
        <section className="lg:col-span-5 ec-card rounded-2xl border border-[#DCE7F2] bg-white p-6 space-y-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900">{t.family.notesTitle}</h2>
            <p className="text-sm text-slate-600">{t.family.notesSubtitle}</p>
          </div>

          {permissions.canPostCareNote && (
            <form onSubmit={handlePostNote} className="space-y-3">
              <textarea
                rows={3}
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                placeholder={t.family.notePlaceholder}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD8E6] text-base focus:outline-2 focus:outline-[#0369A1]"
              />
              <button
                type="submit"
                className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-[#15803D] hover:bg-[#166534] text-white font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageSquarePlus className="w-4 h-4" />
                <span>{t.family.postNoteBtn}</span>
              </button>
            </form>
          )}

          <div className="divide-y divide-slate-100 pt-2">
            {careNotes.map((note) => (
              <div key={note.id} className="py-3.5">
                <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
                  <span className="font-semibold text-slate-800">
                    {note.authorName} · {t.roles[note.authorRole]}
                  </span>
                  <span>{note.timestamp}</span>
                </div>
                <p className="mt-1.5 text-sm text-slate-700 leading-relaxed">{note.content}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        closeLabel={t.common.closeModal}
        title={editingMember ? t.actions.edit : t.family.addMember}
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1">
                {t.family.fieldName}
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
                {t.family.fieldRelationship}
              </label>
              <input
                type="text"
                required
                value={form.relationship}
                onChange={(e) => setForm({ ...form, relationship: e.target.value })}
                placeholder="e.g., Daughter, Son, Niece"
                className="w-full min-h-[46px] px-3.5 py-2 rounded-xl border border-[#CBD8E6] text-base"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1">
                {t.family.fieldPhone}
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
                {t.family.fieldEmail}
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

          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-1">
              {t.family.fieldLocation}
            </label>
            <input
              type="text"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              placeholder="e.g., Bengaluru (15 min away)"
              className="w-full min-h-[46px] px-3.5 py-2 rounded-xl border border-[#CBD8E6] text-base"
            />
          </div>

          <div className="space-y-2.5 pt-2">
            <label className="flex items-center justify-between p-3 rounded-xl border border-[#DCE7F2] bg-[#F5F9FC] cursor-pointer">
              <span className="text-sm font-medium text-slate-900">
                {t.family.emergencyContact}
              </span>
              <input
                type="checkbox"
                checked={form.isEmergencyContact}
                onChange={(e) => setForm({ ...form, isEmergencyContact: e.target.checked })}
                className="w-5 h-5 accent-[#0369A1]"
              />
            </label>
            <label className="flex items-center justify-between p-3 rounded-xl border border-[#DCE7F2] bg-[#F5F9FC] cursor-pointer">
              <span className="text-sm font-medium text-slate-900">{t.family.receivesAlerts}</span>
              <input
                type="checkbox"
                checked={form.receiveMissedAlerts}
                onChange={(e) => setForm({ ...form, receiveMissedAlerts: e.target.checked })}
                className="w-5 h-5 accent-[#0369A1]"
              />
            </label>
            <label className="flex items-center justify-between p-3 rounded-xl border border-[#DCE7F2] bg-[#F5F9FC] cursor-pointer">
              <span className="text-sm font-medium text-slate-900">
                {t.family.canEditSchedule}
              </span>
              <input
                type="checkbox"
                checked={form.canEditSchedule}
                onChange={(e) => setForm({ ...form, canEditSchedule: e.target.checked })}
                className="w-5 h-5 accent-[#0369A1]"
              />
            </label>
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
              {editingMember ? t.actions.save : t.family.addMember}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title={t.actions.delete}
        message={`${deleteTarget?.name} — ${t.family.deleteConfirmMsg}`}
        confirmLabel={t.actions.delete}
        cancelLabel={t.actions.cancel}
        onConfirm={() => {
          if (deleteTarget) deleteFamilyMember(deleteTarget.id);
          setDeleteTarget(null);
        }}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
