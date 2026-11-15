import React, { useEffect, useRef, useState } from 'react';
import { AlertCircle, Eye, FileText, Plus, Trash2, Upload } from 'lucide-react';
import {
  ConfirmDialog,
  EmptyState,
  Modal,
  PageHeader,
  ReadOnlyBanner,
  SafeImage,
} from '../components/common/UI';
import { useApp } from '../context/AppContext';
import { DEMO_IMAGES } from '../data/demoData';
import { formatFileSize, getAttachment } from '../storage/prescriptionDb';
import { Prescription } from '../types';

export const PrescriptionsPage: React.FC = () => {
  const {
    prescriptions,
    addPrescriptionWithAttachment,
    deletePrescription,
    permissions,
    navigateTo,
    showToast,
    language,
    t,
  } = useApp();

  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [previewTarget, setPreviewTarget] = useState<Prescription | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Prescription | null>(null);

  const [title, setTitle] = useState('');
  const [doctorName, setDoctorName] = useState('Dr. Kavitha Deshmukh');
  const [hospitalName, setHospitalName] = useState('Manipal Care Clinic, Indiranagar');
  const [issueDate, setIssueDate] = useState('2026-11-14');
  const [linkedText, setLinkedText] = useState('Amlodipine 5 mg, Metformin SR 500 mg');
  const [notes, setNotes] = useState('');
  const [fileName, setFileName] = useState('Clinic_Prescription_Demo.jpg');
  const [fileType, setFileType] = useState<'image' | 'pdf'>('image');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const [resolvedUrls, setResolvedUrls] = useState<Record<string, string>>({});
  const [missingAttachments, setMissingAttachments] = useState<Record<string, boolean>>({});
  const createdUrlsRef = useRef<Record<string, string>>({});

  useEffect(() => {
    let active = true;
    const neededIds = Array.from(
      new Set(
        prescriptions
          .map((rx) => rx.attachmentId)
          .filter((id): id is string => Boolean(id))
      )
    );

    neededIds.forEach((attId) => {
      if (createdUrlsRef.current[attId]) return;
      getAttachment(attId)
        .then((rec) => {
          if (!active) return;
          if (rec && rec.blob) {
            const url = URL.createObjectURL(rec.blob);
            createdUrlsRef.current[attId] = url;
            setResolvedUrls((prev) => ({ ...prev, [attId]: url }));
            setMissingAttachments((prev) => {
              if (!prev[attId]) return prev;
              const copy = { ...prev };
              delete copy[attId];
              return copy;
            });
          } else {
            setMissingAttachments((prev) => ({ ...prev, [attId]: true }));
          }
        })
        .catch(() => {
          if (!active) return;
          setMissingAttachments((prev) => ({ ...prev, [attId]: true }));
        });
    });

    return () => {
      active = false;
    };
  }, [prescriptions]);

  useEffect(() => {
    const urlsMap = createdUrlsRef.current;
    return () => {
      Object.values(urlsMap).forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const resolvePrescriptionUrl = (rx: Prescription): string => {
    if (rx.attachmentId) {
      return resolvedUrls[rx.attachmentId] || rx.fileUrl || '';
    }
    return rx.fileUrl;
  };

  const resetUploadForm = () => {
    setTitle('');
    setNotes('');
    setFileName('Clinic_Prescription_Demo.jpg');
    setFileType('image');
    setSelectedFile(null);
    setUploadError('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError('');
    setSelectedFile(file);
    setFileName(file.name);
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    setFileType(isPdf ? 'pdf' : 'image');

    showToast(
      language === 'kn' ? `ಲಗತ್ತಿಸಿದ ಕಡತ: ${file.name}` : `Attached file: ${file.name}`,
      'info'
    );
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadError('');
    setIsSaving(true);

    const res = await addPrescriptionWithAttachment(
      {
        title: title.trim() || 'Clinic Prescription Document',
        doctorName: doctorName.trim(),
        hospitalName: hospitalName.trim(),
        issueDate,
        linkedMedicines: linkedText
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        fileName,
        fileType,
        fileUrl: selectedFile ? '' : DEMO_IMAGES.samplePrescription,
        notes: notes.trim(),
      },
      selectedFile
    );

    setIsSaving(false);
    if (res.ok) {
      resetUploadForm();
      setUploadModalOpen(false);
    } else if (res.errorMessage) {
      setUploadError(res.errorMessage);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={t.nav.prescriptions}
        subtitle={t.prescriptions.subtitle}
        action={
          permissions.canManagePrescriptions ? (
            <button
              type="button"
              onClick={() => {
                setUploadError('');
                setUploadModalOpen(true);
              }}
              className="min-h-[44px] px-5 py-2.5 rounded-xl bg-[#0369A1] hover:bg-[#075985] text-white font-semibold text-sm flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{t.prescriptions.uploadBtn}</span>
            </button>
          ) : undefined
        }
      />

      {!permissions.canManagePrescriptions && (
        <ReadOnlyBanner
          title={t.common.readOnlyNotice}
          message={t.common.permissionDenied}
          actionLabel={t.common.switchAccountBtn}
          onAction={() => navigateTo('auth')}
        />
      )}

      {prescriptions.length === 0 ? (
        <EmptyState
          title={t.prescriptions.emptyTitle}
          description={t.prescriptions.emptyDesc}
          actionLabel={permissions.canManagePrescriptions ? t.prescriptions.uploadBtn : undefined}
          onAction={
            permissions.canManagePrescriptions
              ? () => {
                  setUploadError('');
                  setUploadModalOpen(true);
                }
              : undefined
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {prescriptions.map((rx) => {
            const displayUrl = resolvePrescriptionUrl(rx);
            const isMissingAttachment = Boolean(
              rx.attachmentId && missingAttachments[rx.attachmentId] && !rx.fileUrl
            );
            const sizeLabel = formatFileSize(rx.fileSizeBytes);

            return (
              <article
                key={rx.id}
                className="ec-card rounded-2xl border border-[#DCE7F2] bg-white p-6 flex flex-col sm:flex-row gap-5"
              >
                <div className="w-full sm:w-32 h-40 rounded-xl border border-[#DCE7F2] bg-[#F5F9FC] overflow-hidden shrink-0 flex items-center justify-center">
                  {rx.fileType === 'image' && displayUrl ? (
                    <SafeImage
                      src={displayUrl}
                      alt={rx.title}
                      className="w-full h-full object-cover"
                    />
                  ) : isMissingAttachment ? (
                    <div className="text-center p-3">
                      <AlertCircle className="w-8 h-8 text-amber-600 mx-auto" />
                      <span className="mt-1 block text-xs font-medium text-amber-800">
                        {t.prescriptions.attachmentMissing}
                      </span>
                    </div>
                  ) : (
                    <div className="text-center p-3">
                      <FileText className="w-9 h-9 text-[#0369A1] mx-auto" />
                      <span className="mt-1 block text-xs font-semibold text-slate-700">
                        {t.prescriptions.pdfDocLabel}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex-1 flex flex-col justify-between gap-3 min-w-0">
                  <div>
                    <p className="font-mono-num text-xs font-semibold text-[#0369A1]">
                      {t.prescriptions.issuedPrefix} {rx.issueDate} · {rx.fileType.toUpperCase()}
                      {sizeLabel ? ` · ${sizeLabel}` : ''}
                    </p>
                    <h2 className="mt-1 text-lg font-bold text-slate-900">{rx.title}</h2>
                    <p className="text-sm text-slate-700">
                      {rx.doctorName} · {rx.hospitalName}
                    </p>
                    <p className="mt-2 text-sm text-slate-600">
                      {t.prescriptions.medicinesLabel} {rx.linkedMedicines.join(', ')}
                    </p>
                    {rx.attachmentId && (
                      <p className="mt-1 text-xs font-medium text-[#15803D]">
                        {t.prescriptions.localFileBadge}
                      </p>
                    )}
                    {rx.notes && <p className="mt-1 text-xs text-slate-500">{rx.notes}</p>}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setPreviewTarget(rx)}
                      className="min-h-[38px] px-3.5 py-1.5 rounded-xl border border-[#BAE6FD] bg-[#F0F9FF] hover:bg-[#E0F2FE] text-[#0369A1] text-sm font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Eye className="w-4 h-4" />
                      <span>{t.prescriptions.viewDocBtn}</span>
                    </button>
                    {permissions.canManagePrescriptions && (
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(rx)}
                        className="min-h-[38px] px-3.5 py-1.5 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 text-sm font-medium flex items-center gap-1.5 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>{t.actions.delete}</span>
                      </button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <Modal
        open={uploadModalOpen}
        onClose={() => {
          setUploadModalOpen(false);
          setUploadError('');
        }}
        closeLabel={t.common.closeModal}
        title={t.prescriptions.uploadModalTitle}
        subtitle={t.prescriptions.uploadModalSubtitle}
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleUploadSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-1">
              {t.prescriptions.fieldTitle}
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., November Cardiac & Sugar Follow-Up Rx"
              className="w-full min-h-[46px] px-3.5 py-2 rounded-xl border border-[#CBD8E6] text-base"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1">
                {t.prescriptions.fieldDoctor}
              </label>
              <input
                type="text"
                required
                value={doctorName}
                onChange={(e) => setDoctorName(e.target.value)}
                className="w-full min-h-[46px] px-3.5 py-2 rounded-xl border border-[#CBD8E6] text-base"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1">
                {t.prescriptions.fieldIssueDate}
              </label>
              <input
                type="date"
                required
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                className="w-full min-h-[46px] px-3.5 py-2 rounded-xl border border-[#CBD8E6] text-base"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-1">
              {t.prescriptions.fieldClinic}
            </label>
            <input
              type="text"
              required
              value={hospitalName}
              onChange={(e) => setHospitalName(e.target.value)}
              className="w-full min-h-[46px] px-3.5 py-2 rounded-xl border border-[#CBD8E6] text-base"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-1">
              {t.prescriptions.fieldLinkedMeds}
            </label>
            <input
              type="text"
              value={linkedText}
              onChange={(e) => setLinkedText(e.target.value)}
              className="w-full min-h-[46px] px-3.5 py-2 rounded-xl border border-[#CBD8E6] text-base"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-1.5">
              {t.prescriptions.fieldFile}
            </label>
            <label className="flex items-center justify-center gap-2.5 w-full min-h-[64px] px-4 py-3 rounded-xl border-2 border-dashed border-[#93C5FD] bg-[#F0F7FC] hover:bg-[#E0F2FE] text-[#0369A1] font-semibold cursor-pointer transition-colors">
              <Upload className="w-5 h-5" />
              <span>
                {t.prescriptions.chooseFilePrefix} ({fileName})
              </span>
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-1">
              {t.prescriptions.fieldNotes}
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-[#CBD8E6] text-base"
            />
          </div>

          {uploadError && (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 flex items-start gap-2.5"
            >
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{uploadError}</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                setUploadModalOpen(false);
                setUploadError('');
              }}
              className="min-h-[44px] px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-medium cursor-pointer"
            >
              {t.actions.cancel}
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="min-h-[44px] px-6 py-2.5 rounded-xl bg-[#0369A1] hover:bg-[#075985] disabled:opacity-60 text-white font-semibold cursor-pointer"
            >
              {isSaving ? t.prescriptions.savingBtn : t.prescriptions.saveBtn}
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        open={Boolean(previewTarget)}
        onClose={() => setPreviewTarget(null)}
        closeLabel={t.common.closeModal}
        title={previewTarget?.title || t.prescriptions.previewDefaultTitle}
        subtitle={
          previewTarget
            ? `${previewTarget.doctorName} · ${previewTarget.hospitalName} · ${previewTarget.issueDate}`
            : ''
        }
        maxWidth="max-w-2xl"
      >
        {previewTarget && (() => {
          const previewUrl = resolvePrescriptionUrl(previewTarget);
          return (
            <div className="space-y-4">
              {previewTarget.fileType === 'image' ? (
                previewUrl ? (
                  <div className="rounded-xl border border-[#DCE7F2] overflow-hidden bg-slate-50">
                    <SafeImage
                      src={previewUrl}
                      alt={previewTarget.title}
                      className="w-full max-h-[520px] object-contain mx-auto"
                    />
                  </div>
                ) : (
                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-center text-sm text-amber-900">
                    <AlertCircle className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                    <p>{t.prescriptions.attachmentMissing}</p>
                  </div>
                )
              ) : (
                <div className="rounded-xl border border-[#DCE7F2] bg-[#F5F9FC] p-8 text-center">
                  <FileText className="w-12 h-12 text-[#0369A1] mx-auto" />
                  <p className="mt-3 font-semibold text-slate-900">{previewTarget.fileName}</p>
                  {previewTarget.fileSizeBytes ? (
                    <p className="mt-1 text-xs text-slate-500">
                      {formatFileSize(previewTarget.fileSizeBytes)}
                    </p>
                  ) : null}
                  {previewUrl ? (
                    <a
                      href={previewUrl}
                      download={previewTarget.fileName}
                      className="mt-4 inline-flex min-h-[42px] px-5 py-2 rounded-xl bg-[#0369A1] text-white font-semibold"
                    >
                      {t.prescriptions.downloadPdfBtn}
                    </a>
                  ) : (
                    <p className="mt-3 text-sm text-amber-800">{t.prescriptions.attachmentMissing}</p>
                  )}
                </div>
              )}
              <div className="text-sm text-slate-700">
                <p>
                  <strong>{t.prescriptions.medicinesLabel}</strong>{' '}
                  {previewTarget.linkedMedicines.join(', ')}
                </p>
                {previewTarget.notes && (
                  <p className="mt-1">
                    <strong>{t.prescriptions.notesLabel}</strong> {previewTarget.notes}
                  </p>
                )}
              </div>
            </div>
          );
        })()}
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title={t.prescriptions.deleteTitle}
        message={`${t.prescriptions.deleteMsgPrefix} "${deleteTarget?.title}" ${t.prescriptions.deleteMsgSuffix}`}
        confirmLabel={t.prescriptions.deleteConfirmBtn}
        cancelLabel={t.actions.cancel}
        onConfirm={() => {
          if (deleteTarget) deletePrescription(deleteTarget.id);
          setDeleteTarget(null);
        }}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
