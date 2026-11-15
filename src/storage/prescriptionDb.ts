export const PRESCRIPTION_DB_NAME = 'elderlycare_attachments_db';
export const PRESCRIPTION_DB_VERSION = 1;
export const PRESCRIPTION_STORE_NAME = 'prescription_files';

export type StorageErrorCode =
  | 'QUOTA_EXCEEDED'
  | 'IDB_UNAVAILABLE'
  | 'IDB_ERROR'
  | 'INVALID_FILE';

export class PrescriptionStorageError extends Error {
  readonly code: StorageErrorCode;

  constructor(code: StorageErrorCode, message: string, cause?: unknown) {
    super(message);
    this.name = 'PrescriptionStorageError';
    this.code = code;
    if (cause !== undefined) {
      (this as { cause?: unknown }).cause = cause;
    }
  }
}

export interface StoredAttachmentRecord {
  id: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  checksum: string;
  blob: Blob;
  createdAt: string;
}

export interface SaveAttachmentResult {
  record: StoredAttachmentRecord;
  deduplicated: boolean;
}

export function classifyStorageError(err: unknown): StorageErrorCode {
  if (err instanceof PrescriptionStorageError) return err.code;
  if (err && typeof err === 'object') {
    const name = 'name' in err ? String((err as { name?: unknown }).name) : '';
    const message = 'message' in err ? String((err as { message?: unknown }).message) : '';
    if (
      name === 'QuotaExceededError' ||
      name === 'NS_ERROR_DOM_QUOTA_REACHED' ||
      /quota/i.test(message)
    ) {
      return 'QUOTA_EXCEEDED';
    }
  }
  return 'IDB_ERROR';
}

function getFactory(customFactory?: IDBFactory): IDBFactory {
  if (customFactory) return customFactory;
  if (typeof indexedDB !== 'undefined') return indexedDB;
  throw new PrescriptionStorageError(
    'IDB_UNAVAILABLE',
    'IndexedDB is unavailable in this environment.'
  );
}

export function openPrescriptionDb(customFactory?: IDBFactory): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    let factory: IDBFactory;
    try {
      factory = getFactory(customFactory);
    } catch (err) {
      reject(err);
      return;
    }

    let request: IDBOpenDBRequest;
    try {
      request = factory.open(PRESCRIPTION_DB_NAME, PRESCRIPTION_DB_VERSION);
    } catch (err) {
      reject(
        new PrescriptionStorageError(
          classifyStorageError(err) === 'QUOTA_EXCEEDED' ? 'QUOTA_EXCEEDED' : 'IDB_UNAVAILABLE',
          'Unable to open IndexedDB database.',
          err
        )
      );
      return;
    }

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(PRESCRIPTION_STORE_NAME)) {
        const store = db.createObjectStore(PRESCRIPTION_STORE_NAME, { keyPath: 'id' });
        store.createIndex('checksum', 'checksum', { unique: false });
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      const code = classifyStorageError(request.error);
      reject(
        new PrescriptionStorageError(
          code,
          request.error?.message || 'Failed to open prescription database.',
          request.error
        )
      );
    };

    request.onblocked = () => {
      reject(
        new PrescriptionStorageError(
          'IDB_UNAVAILABLE',
          'IndexedDB upgrade was blocked by another open tab.'
        )
      );
    };
  });
}

async function readBlobBytes(blob: Blob): Promise<Uint8Array> {
  if (typeof blob.arrayBuffer === 'function') {
    const buf = await blob.arrayBuffer();
    return new Uint8Array(buf);
  }
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(new Uint8Array(reader.result as ArrayBuffer));
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(blob);
  });
}

export async function computeBlobFingerprint(blob: Blob): Promise<string> {
  const bytes = await readBlobBytes(blob);

  if (typeof crypto !== 'undefined' && crypto.subtle && typeof crypto.subtle.digest === 'function') {
    try {
      const hashBuffer = await crypto.subtle.digest('SHA-256', bytes as unknown as BufferSource);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    } catch {
      // Fallback to deterministic FNV-1a below if crypto.subtle is restricted
    }
  }

  let h1 = 0x811c9dc5;
  let h2 = 0x811c9dc5;
  for (let i = 0; i < bytes.length; i += 1) {
    h1 ^= bytes[i];
    h1 = Math.imul(h1, 0x01000193) >>> 0;
    h2 ^= bytes[bytes.length - 1 - i];
    h2 = Math.imul(h2, 0x01000193) >>> 0;
  }
  return `fnv-${bytes.length}-${h1.toString(16).padStart(8, '0')}${h2.toString(16).padStart(8, '0')}`;
}

export function dataUrlToBlob(dataUrl: string): { blob: Blob; mimeType: string } | null {
  if (!dataUrl || !dataUrl.startsWith('data:')) return null;
  const commaIdx = dataUrl.indexOf(',');
  if (commaIdx === -1) return null;

  const header = dataUrl.slice(5, commaIdx);
  const payload = dataUrl.slice(commaIdx + 1);
  const isBase64 = /;base64/i.test(header);
  const mimeMatch = header.match(/^([^;]+)/);
  const mimeType = mimeMatch ? mimeMatch[1] : 'application/octet-stream';

  try {
    let bytes: Uint8Array;
    if (isBase64) {
      const binary =
        typeof atob === 'function'
          ? atob(payload)
          : Buffer.from(payload, 'base64').toString('binary');
      bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i += 1) {
        bytes[i] = binary.charCodeAt(i);
      }
    } else {
      const decoded = decodeURIComponent(payload);
      bytes = new TextEncoder().encode(decoded);
    }
    return {
      blob: new Blob([bytes as unknown as BlobPart], { type: mimeType }),
      mimeType,
    };
  } catch {
    return null;
  }
}

export async function findAttachmentByChecksum(
  checksum: string,
  sizeBytes: number,
  mimeType: string,
  customFactory?: IDBFactory
): Promise<StoredAttachmentRecord | null> {
  const db = await openPrescriptionDb(customFactory);
  return new Promise((resolve, reject) => {
    try {
      const tx = db.transaction(PRESCRIPTION_STORE_NAME, 'readonly');
      const store = tx.objectStore(PRESCRIPTION_STORE_NAME);
      const index = store.index('checksum');
      const req = index.getAll(checksum);

      req.onsuccess = () => {
        const matches = (req.result || []) as StoredAttachmentRecord[];
        const exact = matches.find(
          (item) => item.sizeBytes === sizeBytes && item.mimeType === mimeType
        );
        resolve(exact || null);
      };
      req.onerror = () => {
        reject(
          new PrescriptionStorageError(
            classifyStorageError(req.error),
            req.error?.message || 'Failed to query attachment index.',
            req.error
          )
        );
      };
      tx.oncomplete = () => db.close();
      tx.onabort = () => {
        db.close();
      };
    } catch (err) {
      db.close();
      reject(new PrescriptionStorageError(classifyStorageError(err), 'IndexedDB read failed.', err));
    }
  });
}

export async function saveAttachment(
  blob: Blob,
  meta: { id?: string; fileName: string; mimeType?: string },
  customFactory?: IDBFactory
): Promise<SaveAttachmentResult> {
  if (!blob || blob.size === 0) {
    throw new PrescriptionStorageError('INVALID_FILE', 'Selected file is empty or invalid.');
  }

  const mimeType = meta.mimeType || blob.type || 'application/octet-stream';
  const checksum = await computeBlobFingerprint(blob);

  // Deduplicate identical file payloads already stored in IndexedDB
  const existing = await findAttachmentByChecksum(checksum, blob.size, mimeType, customFactory);
  if (existing) {
    return { record: existing, deduplicated: true };
  }

  const record: StoredAttachmentRecord = {
    id: meta.id || `att-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    fileName: meta.fileName,
    mimeType,
    sizeBytes: blob.size,
    checksum,
    blob,
    createdAt: new Date().toISOString(),
  };

  const db = await openPrescriptionDb(customFactory);
  return new Promise((resolve, reject) => {
    try {
      const tx = db.transaction(PRESCRIPTION_STORE_NAME, 'readwrite');
      const store = tx.objectStore(PRESCRIPTION_STORE_NAME);
      const req = store.put(record);

      req.onerror = () => {
        reject(
          new PrescriptionStorageError(
            classifyStorageError(req.error),
            req.error?.message || 'Failed to save attachment to IndexedDB.',
            req.error
          )
        );
      };
      tx.oncomplete = () => {
        db.close();
        resolve({ record, deduplicated: false });
      };
      tx.onabort = () => {
        const err = tx.error;
        db.close();
        reject(
          new PrescriptionStorageError(
            classifyStorageError(err),
            err?.message || 'Transaction aborted while saving attachment.',
            err
          )
        );
      };
    } catch (err) {
      db.close();
      reject(
        new PrescriptionStorageError(
          classifyStorageError(err),
          'IndexedDB write failed.',
          err
        )
      );
    }
  });
}

export async function getAttachment(
  id: string,
  customFactory?: IDBFactory
): Promise<StoredAttachmentRecord | null> {
  if (!id) return null;
  const db = await openPrescriptionDb(customFactory);
  return new Promise((resolve, reject) => {
    try {
      const tx = db.transaction(PRESCRIPTION_STORE_NAME, 'readonly');
      const store = tx.objectStore(PRESCRIPTION_STORE_NAME);
      const req = store.get(id);

      req.onsuccess = () => {
        resolve((req.result as StoredAttachmentRecord | undefined) || null);
      };
      req.onerror = () => {
        reject(
          new PrescriptionStorageError(
            classifyStorageError(req.error),
            req.error?.message || 'Failed to read attachment from IndexedDB.',
            req.error
          )
        );
      };
      tx.oncomplete = () => db.close();
    } catch (err) {
      db.close();
      reject(new PrescriptionStorageError(classifyStorageError(err), 'IndexedDB read failed.', err));
    }
  });
}

export async function deleteAttachment(id: string, customFactory?: IDBFactory): Promise<void> {
  if (!id) return;
  const db = await openPrescriptionDb(customFactory);
  return new Promise((resolve, reject) => {
    try {
      const tx = db.transaction(PRESCRIPTION_STORE_NAME, 'readwrite');
      const store = tx.objectStore(PRESCRIPTION_STORE_NAME);
      const req = store.delete(id);

      req.onerror = () => {
        reject(
          new PrescriptionStorageError(
            classifyStorageError(req.error),
            req.error?.message || 'Failed to delete attachment from IndexedDB.',
            req.error
          )
        );
      };
      tx.oncomplete = () => {
        db.close();
        resolve();
      };
      tx.onabort = () => {
        const err = tx.error;
        db.close();
        reject(
          new PrescriptionStorageError(
            classifyStorageError(err),
            err?.message || 'Transaction aborted while deleting attachment.',
            err
          )
        );
      };
    } catch (err) {
      db.close();
      reject(new PrescriptionStorageError(classifyStorageError(err), 'IndexedDB delete failed.', err));
    }
  });
}

export async function listAttachments(
  customFactory?: IDBFactory
): Promise<StoredAttachmentRecord[]> {
  const db = await openPrescriptionDb(customFactory);
  return new Promise((resolve, reject) => {
    try {
      const tx = db.transaction(PRESCRIPTION_STORE_NAME, 'readonly');
      const store = tx.objectStore(PRESCRIPTION_STORE_NAME);
      const req = store.getAll();

      req.onsuccess = () => {
        resolve((req.result as StoredAttachmentRecord[]) || []);
      };
      req.onerror = () => {
        reject(
          new PrescriptionStorageError(
            classifyStorageError(req.error),
            req.error?.message || 'Failed to list attachments.',
            req.error
          )
        );
      };
      tx.oncomplete = () => db.close();
    } catch (err) {
      db.close();
      reject(new PrescriptionStorageError(classifyStorageError(err), 'IndexedDB list failed.', err));
    }
  });
}

export async function checkStorageQuota(): Promise<{
  quota?: number;
  usage?: number;
  available?: number;
} | null> {
  try {
    if (typeof navigator !== 'undefined' && navigator.storage && navigator.storage.estimate) {
      const est = await navigator.storage.estimate();
      const available =
        typeof est.quota === 'number' && typeof est.usage === 'number'
          ? Math.max(0, est.quota - est.usage)
          : undefined;
      return { quota: est.quota, usage: est.usage, available };
    }
  } catch {
    // Ignore storage estimate failure
  }
  return null;
}

export function formatFileSize(bytes?: number): string {
  if (typeof bytes !== 'number' || Number.isNaN(bytes) || bytes <= 0) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
