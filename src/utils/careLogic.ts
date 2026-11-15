import { DEMO_IMAGES } from '../data/demoData';
import {
  AuthUser,
  DailyAdherencePoint,
  DoseSlot,
  FamilyMember,
  Language,
  PageId,
  ReminderHistoryEntry,
  UserPermissions,
} from '../types';

export const VALID_PAGES: readonly PageId[] = [
  'dashboard',
  'profile',
  'medications',
  'schedule',
  'reminders',
  'speaker',
  'history',
  'adherence',
  'catalogue',
  'appointments',
  'family',
  'caretakers',
  'notifications',
  'prescriptions',
  'settings',
  'login',
  'register',
  'auth',
];

const LEGACY_IMAGE_MAP: Record<string, string> = {
  '/src/assets/images/patient_elder_avatar_1794718901878.jpg': DEMO_IMAGES.patientAvatar,
  '/src/assets/images/family_member_avatar_1794718902326.jpg': DEMO_IMAGES.familyAvatar,
  '/src/assets/images/caretaker_nurse_avatar_1794718902723.jpg': DEMO_IMAGES.caretakerAvatar,
  '/src/assets/images/demo_prescription_doc_1794718903567.jpg': DEMO_IMAGES.samplePrescription,
};

export function migrateLegacyImageUrl(url?: string): string {
  if (!url) return '';
  return LEGACY_IMAGE_MAP[url] || url;
}

export function computeUserPermissions(
  user: AuthUser,
  familyMembers: FamilyMember[]
): UserPermissions {
  if (user.role === 'elderly') {
    return {
      canConfirmDose: true,
      canEditSchedule: false,
      canManageMedications: false,
      canManageReminders: false,
      canManageAppointments: false,
      canManagePrescriptions: false,
      canManageProfile: false,
      canManageCareCircle: false,
      canCheckInCaretaker: false,
      canBroadcastSpeaker: false,
      canConfigureSpeaker: false,
      canPostCareNote: false,
      canTriggerSos: true,
    };
  }

  if (user.role === 'caretaker') {
    return {
      canConfirmDose: true,
      canEditSchedule: true,
      canManageMedications: true,
      canManageReminders: true,
      canManageAppointments: true,
      canManagePrescriptions: true,
      canManageProfile: true,
      canManageCareCircle: false,
      canCheckInCaretaker: true,
      canBroadcastSpeaker: true,
      canConfigureSpeaker: true,
      canPostCareNote: true,
      canTriggerSos: true,
    };
  }

  // Family Member role: verify against matching family member permissions if present
  const matchedFamily = familyMembers.find(
    (f) => f.email.trim().toLowerCase() === user.email.trim().toLowerCase()
  );
  const canEdit = matchedFamily ? matchedFamily.canEditSchedule : true;

  return {
    canConfirmDose: canEdit,
    canEditSchedule: canEdit,
    canManageMedications: canEdit,
    canManageReminders: canEdit,
    canManageAppointments: canEdit,
    canManagePrescriptions: canEdit,
    canManageProfile: canEdit,
    canManageCareCircle: canEdit,
    canCheckInCaretaker: canEdit,
    canBroadcastSpeaker: canEdit,
    canConfigureSpeaker: canEdit,
    canPostCareNote: canEdit,
    canTriggerSos: true,
  };
}

export function parsePageFromLocation(pathname: string, hash = ''): PageId | null {
  const cleanHash = hash.replace(/^#\/?/, '').replace(/\/+$/, '').toLowerCase();
  if (cleanHash && (VALID_PAGES as readonly string[]).includes(cleanHash)) {
    return cleanHash as PageId;
  }

  const cleanPath = pathname.replace(/^\/+|\/+$/g, '').toLowerCase();
  if (!cleanPath || cleanPath === 'index.html') {
    return 'dashboard';
  }
  const firstSegment = cleanPath.split('/')[0];
  if ((VALID_PAGES as readonly string[]).includes(firstSegment)) {
    return firstSegment as PageId;
  }
  return null;
}

export function applySpeakerHistoryResponse(
  history: ReminderHistoryEntry[],
  responseType: 'taken' | 'snooze',
  opts: {
    dose?: DoseSlot;
    nowTime: string;
    spokenMessage: string;
    voiceLanguage: Language;
    responderLabel: string;
  }
): ReminderHistoryEntry[] {
  const outcome = responseType === 'taken' ? 'Confirmed Taken' : 'Snoozed 10m';

  const pendingIdx = history.findIndex((entry) => {
    if (entry.outcome !== 'Pending Response') return false;
    if (opts.dose) {
      return (
        (entry.doseId && entry.doseId === opts.dose.id) ||
        (entry.medicationName === opts.dose.medicationName &&
          entry.scheduledTime === opts.dose.time)
      );
    }
    return entry.channel === 'Smart Speaker';
  });

  if (pendingIdx >= 0) {
    return history.map((entry, idx) =>
      idx === pendingIdx
        ? {
            ...entry,
            outcome,
            respondedBy: opts.responderLabel,
          }
        : entry
    );
  }

  const newEntry: ReminderHistoryEntry = {
    id: `hist-${Date.now()}`,
    doseId: opts.dose?.id,
    timestamp: `Today · ${opts.nowTime}`,
    medicationName: opts.dose ? opts.dose.medicationName : 'Scheduled Dose',
    dosage: opts.dose ? opts.dose.dosage : '-',
    scheduledTime: opts.dose ? opts.dose.time : opts.nowTime,
    channel: 'Smart Speaker',
    spokenMessage: opts.spokenMessage,
    language: opts.voiceLanguage,
    outcome,
    respondedBy: opts.responderLabel,
  };

  return [newEntry, ...history];
}

const WEEKDAY_KEYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

export function buildWeeklyAdherence(
  baseline: DailyAdherencePoint[],
  doseSlots: DoseSlot[],
  todayDate: Date = new Date()
): DailyAdherencePoint[] {
  const todayTaken = doseSlots.filter((d) => d.status === 'taken').length;
  const todayMissed = doseSlots.filter((d) => d.status === 'missed').length;
  const todayTotal = doseSlots.length;
  const todayRate = todayTotal > 0 ? Math.round((todayTaken / todayTotal) * 100) : 0;

  const todayWeekdayIdx = todayDate.getDay();
  const priorDays = baseline.slice(0, 6).map((point, idx) => {
    const offset = 6 - idx;
    const weekdayIdx = (todayWeekdayIdx - offset + 7) % 7;
    return {
      ...point,
      day: WEEKDAY_KEYS[weekdayIdx],
    };
  });

  return [
    ...priorDays,
    {
      day: 'Today',
      taken: todayTaken,
      missed: todayMissed,
      total: todayTotal,
      rate: todayRate,
    },
  ];
}
