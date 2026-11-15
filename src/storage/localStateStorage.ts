import { Prescription } from '../types';
import { migrateLegacyImageUrl } from '../utils/careLogic';
import {
  classifyStorageError,
  dataUrlToBlob,
  saveAttachment,
  StorageErrorCode,
} from './prescriptionDb';

export const STORAGE_KEY = 'elderlycare_demo_state_v1';

export interface StorageWriteResult {
  ok: boolean;
  code?: 'QUOTA_EXCEEDED' | 'STORAGE_ERROR';
}

export interface StorageLoadResult {
  data: Record<string, unknown> | null;
  parseError: boolean;
}

export interface StorageBackend {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

function getStorageBackend(custom?: StorageBackend): StorageBackend | null {
  if (custom) return custom;
  if (typeof localStorage !== 'undefined') return localStorage;
  return null;
}

export function safeLoadAppState(customStorage?: StorageBackend): StorageLoadResult {
  const storage = getStorageBackend(customStorage);
  if (!storage) return { data: null, parseError: false };

  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return { data: null, parseError: false };
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return { data: null, parseError: true };
    }
    return { data: parsed as Record<string, unknown>, parseError: false };
  } catch {
    // Do NOT delete existing stored data on parse error
    return { data: null, parseError: true };
  }
}

export function safeSaveAppState(
  payload: unknown,
  customStorage?: StorageBackend
): StorageWriteResult {
  const storage = getStorageBackend(customStorage);
  if (!storage) return { ok: false, code: 'STORAGE_ERROR' };

  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(payload));
    return { ok: true };
  } catch (err) {
    const code = classifyStorageError(err);
    return {
      ok: false,
      code: code === 'QUOTA_EXCEEDED' ? 'QUOTA_EXCEEDED' : 'STORAGE_ERROR',
    };
  }
}

export function normalizeLegacyPrescriptions(list: Prescription[]): Prescription[] {
  return list.map((rx) => ({
    ...rx,
    fileUrl: migrateLegacyImageUrl(rx.fileUrl),
  }));
}

export interface MigrationReport {
  prescriptions: Prescription[];
  migratedCount: number;
  failedCount: number;
  lastErrorCode?: StorageErrorCode;
}

/**
 * Safely migrates legacy base64 Data URLs in `prescriptions` out of localStorage
 * into IndexedDB without deleting any existing records if migration fails.
 */
export async function migrateLegacyPrescriptionBlobs(
  prescriptions: Prescription[],
  customFactory?: IDBFactory
): Promise<MigrationReport> {
  let migratedCount = 0;
  let failedCount = 0;
  let lastErrorCode: StorageErrorCode | undefined;

  const next: Prescription[] = [];
  for (const rx of prescriptions) {
    if (rx.attachmentId || !rx.fileUrl || !rx.fileUrl.startsWith('data:')) {
      next.push(rx);
      continue;
    }

    const converted = dataUrlToBlob(rx.fileUrl);
    if (!converted) {
      // Keep original record untouched if Data URL cannot be parsed
      next.push(rx);
      continue;
    }

    try {
      const { record } = await saveAttachment(
        converted.blob,
        {
          id: `att-mig-${rx.id}`,
          fileName: rx.fileName || `${rx.title}.dat`,
          mimeType: converted.mimeType,
        },
        customFactory
      );
      migratedCount += 1;
      next.push({
        ...rx,
        attachmentId: record.id,
        fileMimeType: record.mimeType,
        fileSizeBytes: record.sizeBytes,
        fileChecksum: record.checksum,
        fileUrl: '',
      });
    } catch (err) {
      failedCount += 1;
      lastErrorCode = classifyStorageError(err);
      // Preserve original base64 record intact so zero user data is lost
      next.push(rx);
    }
  }

  return {
    prescriptions: next,
    migratedCount,
    failedCount,
    lastErrorCode,
  };
}

export function isDuplicatePrescriptionRecord(
  existing: Prescription[],
  candidate: Pick<Prescription, 'title' | 'issueDate' | 'fileName' | 'fileChecksum' | 'attachmentId'>
): boolean {
  const normTitle = candidate.title.trim().toLowerCase();
  const normFile = candidate.fileName.trim().toLowerCase();
  return existing.some((rx) => {
    const sameMeta =
      rx.title.trim().toLowerCase() === normTitle && rx.issueDate === candidate.issueDate;
    if (!sameMeta) return false;
    if (candidate.attachmentId && rx.attachmentId) {
      return rx.attachmentId === candidate.attachmentId;
    }
    if (candidate.fileChecksum && rx.fileChecksum) {
      return rx.fileChecksum === candidate.fileChecksum;
    }
    return rx.fileName.trim().toLowerCase() === normFile;
  });
}

export function isAttachmentStillReferenced(
  prescriptions: Prescription[],
  attachmentId: string | undefined,
  excludingPrescriptionId: string
): boolean {
  if (!attachmentId) return false;
  return prescriptions.some(
    (rx) => rx.id !== excludingPrescriptionId && rx.attachmentId === attachmentId
  );
}
