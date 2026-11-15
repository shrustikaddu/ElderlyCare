import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  INITIAL_ACTIVITIES,
  INITIAL_APPOINTMENTS,
  INITIAL_AUTH_USERS,
  INITIAL_CARE_NOTES,
  INITIAL_CARETAKERS,
  INITIAL_DOSE_SLOTS,
  INITIAL_FAMILY_MEMBERS,
  INITIAL_MEDICATIONS,
  INITIAL_NOTIFICATIONS,
  INITIAL_PATIENT_PROFILE,
  INITIAL_PRESCRIPTIONS,
  INITIAL_REMINDER_HISTORY,
  INITIAL_REMINDER_SETTINGS,
  INITIAL_SPEAKER_CONFIG,
  INITIAL_VITALS,
  INITIAL_VOICE_REMINDERS,
  INITIAL_WEEKLY_ADHERENCE,
} from '../data/demoData';
import { TRANSLATIONS, TranslationDictionary } from '../i18n/translations';
import {
  ActivityItem,
  Appointment,
  AuthUser,
  CareNote,
  Caretaker,
  DailyAdherencePoint,
  DoseSlot,
  DoseStatus,
  FamilyMember,
  Language,
  Medication,
  NotificationItem,
  PageId,
  PatientProfile,
  Prescription,
  ReminderHistoryEntry,
  ReminderSettings,
  SmartSpeakerConfig,
  TextScale,
  TimeOfDay,
  UserPermissions,
  UserRole,
  VitalReading,
  VoiceReminder,
} from '../types';
import {
  applySpeakerHistoryResponse,
  buildWeeklyAdherence,
  computeUserPermissions,
  migrateLegacyImageUrl,
  parsePageFromLocation,
} from '../utils/careLogic';
import { useOnlineStatusWithTransition } from '../hooks/useOnlineStatus';
import {
  isAttachmentStillReferenced,
  isDuplicatePrescriptionRecord,
  migrateLegacyPrescriptionBlobs,
  normalizeLegacyPrescriptions,
  safeLoadAppState,
  safeSaveAppState,
  STORAGE_KEY,
} from '../storage/localStateStorage';
import {
  classifyStorageError,
  deleteAttachment,
  saveAttachment,
} from '../storage/prescriptionDb';

interface ToastState {
  id: string;
  message: string;
  tone: 'info' | 'success' | 'warning' | 'error';
}

interface AppContextValue {
  currentPage: PageId;
  navigateTo: (page: PageId, opts?: { replace?: boolean }) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationDictionary;
  textScale: TextScale;
  setTextScale: (scale: TextScale) => void;
  highContrast: boolean;
  setHighContrast: (val: boolean) => void;

  currentUser: AuthUser;
  permissions: UserPermissions;
  registeredUsers: AuthUser[];
  loginDemoUser: (role: UserRole) => void;
  loginWithEmail: (email: string) => boolean;
  registerUser: (data: { name: string; email: string; phone: string; role: UserRole }) => void;

  patientProfile: PatientProfile;
  updatePatientProfile: (profile: PatientProfile) => boolean;
  vitals: VitalReading[];
  addVitalReading: (reading: Omit<VitalReading, 'id'>) => boolean;

  medications: Medication[];
  addMedication: (med: Omit<Medication, 'id'>) => boolean;
  updateMedication: (med: Medication) => boolean;
  deleteMedication: (id: string) => boolean;
  restockMedication: (id: string, amount?: number) => boolean;

  doseSlots: DoseSlot[];
  markDoseStatus: (doseId: string, status: DoseStatus) => boolean;

  voiceReminders: VoiceReminder[];
  addVoiceReminder: (reminder: Omit<VoiceReminder, 'id'>) => boolean;
  updateVoiceReminder: (reminder: VoiceReminder) => boolean;
  deleteVoiceReminder: (id: string) => boolean;
  snoozeVoiceReminder: (id: string) => boolean;

  appointments: Appointment[];
  addAppointment: (appt: Omit<Appointment, 'id'>) => boolean;
  updateAppointment: (appt: Appointment) => boolean;
  deleteAppointment: (id: string) => boolean;

  familyMembers: FamilyMember[];
  addFamilyMember: (member: Omit<FamilyMember, 'id'>) => boolean;
  updateFamilyMember: (member: FamilyMember) => boolean;
  deleteFamilyMember: (id: string) => boolean;

  caretakers: Caretaker[];
  addCaretaker: (caretaker: Omit<Caretaker, 'id'>) => boolean;
  updateCaretaker: (caretaker: Caretaker) => boolean;
  deleteCaretaker: (id: string) => boolean;
  checkInCaretaker: (id: string) => boolean;

  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  deleteNotification: (id: string) => boolean;
  triggerMissedDoseSimulation: () => boolean;

  prescriptions: Prescription[];
  addPrescription: (rx: Omit<Prescription, 'id'>) => boolean;
  addPrescriptionWithAttachment: (
    rx: Omit<Prescription, 'id'>,
    file?: File | null
  ) => Promise<{ ok: boolean; errorMessage?: string }>;
  updatePrescription: (rx: Prescription) => boolean;
  deletePrescription: (id: string) => boolean;

  activities: ActivityItem[];
  careNotes: CareNote[];
  addCareNote: (content: string) => boolean;
  weeklyAdherence: DailyAdherencePoint[];

  reminderSettings: ReminderSettings;
  updateReminderSettings: (settings: ReminderSettings) => boolean;

  speakerConfig: SmartSpeakerConfig;
  updateSpeakerConfig: (cfg: SmartSpeakerConfig, silent?: boolean) => boolean;
  reminderHistory: ReminderHistoryEntry[];
  broadcastToSpeaker: (opts: {
    dose?: DoseSlot;
    voiceReminder?: VoiceReminder;
    customMessage?: string;
    langOverride?: Language;
  }) => boolean;
  respondFromSpeaker: (responseType: 'taken' | 'snooze' | 'help', doseId?: string) => boolean;

  voiceModalOpen: boolean;
  setVoiceModalOpen: (open: boolean) => void;
  sosModalOpen: boolean;
  setSosModalOpen: (open: boolean) => void;
  triggerSosAlert: () => void;
  speakText: (text: string, langOverride?: Language, repeatCount?: number) => void;
  playChime: (bypassSoundToggle?: boolean) => void;

  toast: ToastState | null;
  showToast: (message: string, tone?: ToastState['tone']) => void;
  dismissToast: () => void;
  resetDemoData: () => void;
  pendingChangesCount: number;
  clearPendingChanges: () => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

function inferTimeOfDay(timeStr: string): TimeOfDay {
  const upper = timeStr.toUpperCase();
  const hourMatch = upper.match(/(\d{1,2})/);
  const rawHour = hourMatch ? parseInt(hourMatch[1], 10) : 8;
  const isPM = upper.includes('PM');
  const isAM = upper.includes('AM');
  const hour24 =
    isPM && rawHour !== 12
      ? rawHour + 12
      : isAM && rawHour === 12
      ? 0
      : rawHour;

  if (hour24 < 12) return 'Morning';
  if (hour24 < 17) return 'Afternoon';
  if (hour24 < 21) return 'Evening';
  return 'Night';
}

function pageToPath(page: PageId): string {
  return page === 'dashboard' ? '/' : `/${page}`;
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const loadResult = safeLoadAppState();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const saved = loadResult.data as Record<string, any> | null;
  const suppressCorruptOverwriteRef = useRef<boolean>(loadResult.parseError);
  const quotaToastShownRef = useRef<boolean>(false);
  const urlPage =
    typeof window !== 'undefined'
      ? parsePageFromLocation(window.location.pathname, window.location.hash)
      : null;
  const initialPage: PageId =
    urlPage && urlPage !== 'dashboard'
      ? urlPage
      : saved?.currentPage || urlPage || 'dashboard';

  const [currentPage, setCurrentPage] = useState<PageId>(initialPage);
  const [language, setLanguageState] = useState<Language>(saved?.language || 'en');
  const [textScale, setTextScale] = useState<TextScale>(saved?.textScale || 'standard');
  const [highContrast, setHighContrast] = useState<boolean>(saved?.highContrast || false);

  const [registeredUsers, setRegisteredUsers] = useState<AuthUser[]>(
    saved?.registeredUsers || INITIAL_AUTH_USERS
  );
  const [currentUser, setCurrentUser] = useState<AuthUser>(
    saved?.currentUser || INITIAL_AUTH_USERS[0]
  );

  const [patientProfile, setPatientProfile] = useState<PatientProfile>(() => {
    const base = saved?.patientProfile || INITIAL_PATIENT_PROFILE;
    return {
      ...base,
      avatarUrl: migrateLegacyImageUrl(base.avatarUrl),
    };
  });
  const [vitals, setVitals] = useState<VitalReading[]>(saved?.vitals || INITIAL_VITALS);
  const [medications, setMedications] = useState<Medication[]>(
    saved?.medications || INITIAL_MEDICATIONS
  );
  const [doseSlots, setDoseSlots] = useState<DoseSlot[]>(
    saved?.doseSlots || INITIAL_DOSE_SLOTS
  );
  const [voiceReminders, setVoiceReminders] = useState<VoiceReminder[]>(
    saved?.voiceReminders || INITIAL_VOICE_REMINDERS
  );
  const [appointments, setAppointments] = useState<Appointment[]>(
    saved?.appointments || INITIAL_APPOINTMENTS
  );
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(() => {
    const list: FamilyMember[] = saved?.familyMembers || INITIAL_FAMILY_MEMBERS;
    return list.map((m) => ({
      ...m,
      avatarUrl: migrateLegacyImageUrl(m.avatarUrl),
    }));
  });
  const [caretakers, setCaretakers] = useState<Caretaker[]>(() => {
    const list: Caretaker[] = saved?.caretakers || INITIAL_CARETAKERS;
    return list.map((c) => ({
      ...c,
      avatarUrl: migrateLegacyImageUrl(c.avatarUrl),
    }));
  });
  const [notifications, setNotifications] = useState<NotificationItem[]>(
    saved?.notifications || INITIAL_NOTIFICATIONS
  );
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(() => {
    const list: Prescription[] = saved?.prescriptions || INITIAL_PRESCRIPTIONS;
    return normalizeLegacyPrescriptions(list);
  });
  const [activities, setActivities] = useState<ActivityItem[]>(
    saved?.activities || INITIAL_ACTIVITIES
  );
  const [careNotes, setCareNotes] = useState<CareNote[]>(
    saved?.careNotes || INITIAL_CARE_NOTES
  );
  const [reminderSettings, setReminderSettings] = useState<ReminderSettings>(
    saved?.reminderSettings || INITIAL_REMINDER_SETTINGS
  );
  const [speakerConfig, setSpeakerConfig] = useState<SmartSpeakerConfig>(() => {
    const base: SmartSpeakerConfig = saved?.speakerConfig || INITIAL_SPEAKER_CONFIG;
    return {
      ...base,
      voiceLanguage: saved?.language || base.voiceLanguage || 'en',
    };
  });
  const [reminderHistory, setReminderHistory] = useState<ReminderHistoryEntry[]>(
    saved?.reminderHistory || INITIAL_REMINDER_HISTORY
  );

  const [voiceModalOpen, setVoiceModalOpen] = useState(false);
  const [sosModalOpen, setSosModalOpen] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [pendingChangesCount, setPendingChangesCount] = useState<number>(
    saved?.pendingChangesCount ?? 0
  );

  const permissions = useMemo(
    () => computeUserPermissions(currentUser, familyMembers),
    [currentUser, familyMembers]
  );

  const t = TRANSLATIONS[language];

  // --- Online status tracking ---
  const isOnline = useOnlineStatusWithTransition();
  // We use a ref to detect offline → online transitions so we can show an
  // honest "back online" toast. The toast logic lives in a useEffect below
  // (after showToast is defined) but we need isOnline early to pass to
  // recordPendingChange.

  // Helper: increment pending change counter only when offline
  const recordPendingChange = useCallback(() => {
    if (!isOnline) {
      setPendingChangesCount((n) => n + 1);
    }
  }, [isOnline]);

  const clearPendingChanges = useCallback(() => {
    setPendingChangesCount(0);
  }, []);

  // Sync browser URL and listen to browser Back / Forward (popstate)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const targetPath = pageToPath(initialPage);
    if (window.location.pathname !== targetPath) {
      window.history.replaceState({ page: initialPage }, '', targetPath);
    }

    const handlePopState = () => {
      const nextPage =
        parsePageFromLocation(window.location.pathname, window.location.hash) || 'dashboard';
      setCurrentPage(nextPage);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    html.classList.remove('text-scale-standard', 'text-scale-large', 'text-scale-xlarge');
    html.classList.add(`text-scale-${textScale}`);
    if (highContrast) {
      html.classList.add('high-contrast');
    } else {
      html.classList.remove('high-contrast');
    }
    html.lang = language === 'kn' ? 'kn' : 'en';
  }, [textScale, highContrast, language]);

  useEffect(() => {
    if (loadResult.parseError) {
      showToast(t.common.storageReadWarning, 'warning');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Safely migrate legacy base64 Data URLs in prescriptions to IndexedDB on mount
  useEffect(() => {
    const hasLegacyBase64 = prescriptions.some(
      (rx) => !rx.attachmentId && Boolean(rx.fileUrl && rx.fileUrl.startsWith('data:'))
    );
    if (!hasLegacyBase64) return;

    let cancelled = false;
    migrateLegacyPrescriptionBlobs(prescriptions).then((report) => {
      if (cancelled) return;
      if (report.migratedCount > 0) {
        suppressCorruptOverwriteRef.current = false;
        setPrescriptions((current) =>
          current.map((item) => {
            const migrated = report.prescriptions.find((m) => m.id === item.id);
            return migrated || item;
          })
        );
      }
      if (report.failedCount > 0) {
        showToast(t.prescriptions.migrationPartialWarning, 'warning');
      }
    });

    return () => {
      cancelled = true;
    };
    // Run once on initial mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (suppressCorruptOverwriteRef.current) {
      return;
    }

    const payload = {
      currentPage,
      language,
      textScale,
      highContrast,
      registeredUsers,
      currentUser,
      patientProfile,
      vitals,
      medications,
      doseSlots,
      voiceReminders,
      appointments,
      familyMembers,
      caretakers,
      notifications,
      prescriptions,
      activities,
      careNotes,
      reminderSettings,
      speakerConfig,
      reminderHistory,
      pendingChangesCount,
    };

    const writeResult = safeSaveAppState(payload);
    if (!writeResult.ok && !quotaToastShownRef.current) {
      quotaToastShownRef.current = true;
      showToast(t.common.storageQuotaError, 'error');
    } else if (writeResult.ok) {
      quotaToastShownRef.current = false;
    }
  }, [
    currentPage,
    language,
    textScale,
    highContrast,
    registeredUsers,
    currentUser,
    patientProfile,
    vitals,
    medications,
    doseSlots,
    voiceReminders,
    appointments,
    familyMembers,
    caretakers,
    notifications,
    prescriptions,
    activities,
    careNotes,
    reminderSettings,
    speakerConfig,
    reminderHistory,
    pendingChangesCount,
  ]);

  const showToast = (message: string, tone: ToastState['tone'] = 'info') => {
    const id = String(Date.now());
    setToast({ id, message, tone });
    setTimeout(() => {
      setToast((prev) => (prev?.id === id ? null : prev));
    }, 4500);
  };

  const dismissToast = () => setToast(null);

  // Detect offline → online transition and show an honest note (no sync claimed)
  const prevIsOnlineRef = useRef(isOnline);
  useEffect(() => {
    if (!prevIsOnlineRef.current && isOnline) {
      showToast(TRANSLATIONS[language].common.pendingChangesClearedNote, 'info');
    }
    prevIsOnlineRef.current = isOnline;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOnline]);

  const requirePermission = (allowed: boolean, careCircle = false): boolean => {
    if (allowed) return true;
    showToast(
      careCircle ? t.common.careCirclePermissionDenied : t.common.permissionDenied,
      'warning'
    );
    return false;
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    setSpeakerConfig((prev) => ({ ...prev, voiceLanguage: lang }));
  };

  const navigateTo = (page: PageId, opts?: { replace?: boolean }) => {
    setCurrentPage(page);
    if (typeof window !== 'undefined') {
      const nextPath = pageToPath(page);
      if (window.location.pathname !== nextPath) {
        if (opts?.replace) {
          window.history.replaceState({ page }, '', nextPath);
        } else {
          window.history.pushState({ page }, '', nextPath);
        }
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const addActivity = (description: string, type: ActivityItem['type']) => {
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setActivities((prev) => [
      {
        id: `act-${Date.now()}`,
        description,
        actor: currentUser.name
          .replace(' (Demo Patient)', '')
          .replace(' (Demo Family)', '')
          .replace(' (Demo Caretaker)', '')
          .replace(' (View-Only Family)', ''),
        timestamp: `Today · ${nowTime}`,
        type,
      },
      ...prev,
    ]);
  };

  const loginDemoUser = (role: UserRole) => {
    const match = registeredUsers.find((u) => u.role === role) || INITIAL_AUTH_USERS[0];
    setCurrentUser(match);
    navigateTo('dashboard');
    showToast(
      language === 'kn' ? `${match.name} ಆಗಿ ಲಾಗಿನ್ ಆಗಿದ್ದೀರಿ` : `Signed in as ${match.name}`,
      'success'
    );
  };

  const loginWithEmail = (email: string): boolean => {
    const found = registeredUsers.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    if (found) {
      setCurrentUser(found);
      navigateTo('dashboard');
      showToast(
        language === 'kn' ? `ಸ್ವಾಗತ, ${found.name}` : `Welcome back, ${found.name}`,
        'success'
      );
      return true;
    }
    return false;
  };

  const registerUser = (data: { name: string; email: string; phone: string; role: UserRole }) => {
    const newUser: AuthUser = {
      id: `user-${Date.now()}`,
      name: `${data.name} (Demo)`,
      email: data.email,
      phone: data.phone,
      role: data.role,
    };
    setRegisteredUsers((prev) => [newUser, ...prev]);
    setCurrentUser(newUser);
    navigateTo('dashboard');
    showToast(
      language === 'kn'
        ? `${data.name} ಅವರಿಗೆ ಪ್ರದರ್ಶನ ಖಾತೆ ರಚಿಸಲಾಗಿದೆ`
        : `Demo account created for ${data.name}`,
      'success'
    );
  };

  const updatePatientProfile = (profile: PatientProfile): boolean => {
    if (!requirePermission(permissions.canManageProfile)) return false;
    setPatientProfile(profile);
    addActivity('Updated elderly patient medical profile', 'note');
    showToast(
      language === 'kn' ? 'ರೋಗಿಯ ವಿವರಗಳನ್ನು ಉಳಿಸಲಾಗಿದೆ.' : 'Patient profile saved successfully.',
      'success'
    );
    return true;
  };

  const addVitalReading = (reading: Omit<VitalReading, 'id'>): boolean => {
    if (!requirePermission(permissions.canManageProfile)) return false;
    setVitals((prev) => [{ ...reading, id: `vit-${Date.now()}` }, ...prev]);
    addActivity(`Logged vitals: BP ${reading.bloodPressure}, Sugar ${reading.bloodSugar}`, 'note');
    showToast(
      language === 'kn' ? 'ವೈಟಲ್ಸ್ ದಾಖಲಿಸಲಾಗಿದೆ.' : 'Vital signs recorded.',
      'success'
    );
    return true;
  };

  const addMedication = (medData: Omit<Medication, 'id'>): boolean => {
    if (!requirePermission(permissions.canManageMedications)) return false;
    const newId = `med-${Date.now()}`;
    const newMed: Medication = { ...medData, id: newId };
    setMedications((prev) => [newMed, ...prev]);
    recordPendingChange();

    const newSlots: DoseSlot[] = newMed.timings.map((timeStr, idx) => ({
      id: `dose-${newId}-${idx}`,
      medicationId: newId,
      medicationName: newMed.name,
      dosage: newMed.dosage,
      time: timeStr,
      timeOfDay: inferTimeOfDay(timeStr),
      mealInstruction: newMed.mealInstruction,
      status: 'pending',
    }));
    setDoseSlots((prev) => [...prev, ...newSlots]);
    addActivity(`Added medication ${newMed.name} (${newMed.dosage})`, 'stock');
    showToast(
      language === 'kn'
        ? `${newMed.name} ಔಷಧಿಗಳು ಮತ್ತು ಇಂದಿನ ವೇಳಾಪಟ್ಟಿಗೆ ಸೇರಿಸಲಾಗಿದೆ.`
        : `${newMed.name} added to medications and today's schedule.`,
      'success'
    );
    return true;
  };

  const updateMedication = (updated: Medication): boolean => {
    if (!requirePermission(permissions.canManageMedications)) return false;
    setMedications((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
    recordPendingChange();
    setDoseSlots((prev) => {
      const otherSlots = prev.filter((s) => s.medicationId !== updated.id);
      const remainingExisting = [...prev.filter((s) => s.medicationId === updated.id)];
      const rebuilt: DoseSlot[] = updated.timings.map((timeStr, idx) => {
        const matchIdx = remainingExisting.findIndex(
          (s) => s.time.trim().toUpperCase() === timeStr.trim().toUpperCase()
        );
        const match = matchIdx >= 0 ? remainingExisting.splice(matchIdx, 1)[0] : undefined;
        return {
          id: match ? match.id : `dose-${updated.id}-${idx}-${Date.now()}`,
          medicationId: updated.id,
          medicationName: updated.name,
          dosage: updated.dosage,
          time: timeStr,
          timeOfDay: inferTimeOfDay(timeStr),
          mealInstruction: updated.mealInstruction,
          status: match ? match.status : 'pending',
          takenAt: match?.takenAt,
          loggedBy: match?.loggedBy,
        };
      });
      return [...otherSlots, ...rebuilt];
    });
    setVoiceReminders((prev) =>
      prev.map((r) =>
        r.medicationId === updated.id
          ? {
              ...r,
              medicationName: updated.name,
              dosage: updated.dosage,
              enabled: updated.reminderEnabled,
            }
          : r
      )
    );
    addActivity(`Updated medication details for ${updated.name}`, 'stock');
    showToast(
      language === 'kn' ? `${updated.name} ನವೀಕರಿಸಲಾಗಿದೆ.` : `${updated.name} updated.`,
      'success'
    );
    return true;
  };

  const deleteMedication = (id: string): boolean => {
    if (!requirePermission(permissions.canManageMedications)) return false;
    const target = medications.find((m) => m.id === id);
    setMedications((prev) => prev.filter((m) => m.id !== id));
    setDoseSlots((prev) => prev.filter((s) => s.medicationId !== id));
    setVoiceReminders((prev) => prev.filter((r) => r.medicationId !== id));
    recordPendingChange();
    if (target) {
      addActivity(`Removed medication ${target.name}`, 'stock');
      showToast(
        language === 'kn' ? `${target.name} ಅಳಿಸಲಾಗಿದೆ.` : `${target.name} deleted.`,
        'info'
      );
    }
    return true;
  };

  const restockMedication = (id: string, amount = 15): boolean => {
    if (!requirePermission(permissions.canManageMedications)) return false;
    const target = medications.find((m) => m.id === id);
    setMedications((prev) =>
      prev.map((m) => (m.id === id ? { ...m, stockCount: m.stockCount + amount } : m))
    );
    if (target) {
      addActivity(`Restocked ${target.name} (+${amount} units)`, 'stock');
      showToast(
        language === 'kn'
          ? `${target.name} ದಾಸ್ತಾನಿಗೆ ${amount} ಘಟಕಗಳನ್ನು ಸೇರಿಸಲಾಗಿದೆ.`
          : `Added ${amount} units to ${target.name} stock.`,
        'success'
      );
    }
    return true;
  };

  const applyDoseStatusUpdate = (
    doseId: string,
    status: DoseStatus,
    responderOverride?: string
  ): boolean => {
    const target = doseSlots.find((d) => d.id === doseId);
    if (!target || target.status === status) return false;
    const prevStatus = target.status;
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const actorName = responderOverride || currentUser.name.split(' (')[0];

    setDoseSlots((prev) =>
      prev.map((d) =>
        d.id === doseId
          ? {
              ...d,
              status,
              takenAt: status === 'taken' ? nowTime : undefined,
              loggedBy: status === 'taken' ? actorName : undefined,
            }
          : d
      )
    );

    if (status === 'taken' && prevStatus !== 'taken') {
      const med = medications.find((m) => m.id === target.medicationId);
      if (med && med.stockCount > 0) {
        const nextStock = Math.max(0, med.stockCount - 1);
        setMedications((prev) =>
          prev.map((m) => (m.id === med.id ? { ...m, stockCount: nextStock } : m))
        );
        if (nextStock <= med.lowStockThreshold) {
          setNotifications((prev) => [
            {
              id: `notif-stock-${Date.now()}`,
              title: `Low Medicine Stock: ${med.name} ${med.dosage}`,
              message: `Remaining stock is ${nextStock} units (threshold: ${med.lowStockThreshold}).`,
              category: 'low_stock',
              timestamp: 'Just now',
              isRead: false,
              actionPage: 'medications',
              severity: 'warning',
            },
            ...prev,
          ]);
        }
      }
      setReminderHistory((prev) =>
        prev.map((entry) =>
          entry.outcome === 'Pending Response' &&
          ((entry.doseId && entry.doseId === target.id) ||
            (entry.medicationName === target.medicationName &&
              entry.scheduledTime === target.time))
            ? { ...entry, outcome: 'Confirmed Taken', respondedBy: actorName }
            : entry
        )
      );
      addActivity(`Marked ${target.medicationName} (${target.dosage}) as Taken`, 'dose_taken');
      showToast(
        language === 'kn'
          ? `${target.medicationName} ತೆಗೆದುಕೊಂಡಿರುವುದಾಗಿ ದಾಖಲಿಸಲಾಗಿದೆ.`
          : `${target.medicationName} marked as Taken.`,
        'success'
      );
    } else if (prevStatus === 'taken' && status !== 'taken') {
      const med = medications.find((m) => m.id === target.medicationId);
      if (med) {
        setMedications((prev) =>
          prev.map((m) => (m.id === med.id ? { ...m, stockCount: m.stockCount + 1 } : m))
        );
      }
      addActivity(`Reset ${target.medicationName} (${target.time}) to ${status}`, 'stock');
      showToast(
        language === 'kn'
          ? `${target.medicationName} ಸ್ಥಿತಿಯನ್ನು ಮರುಹೊಂದಿಸಲಾಗಿದೆ ಮತ್ತು ದಾಸ್ತಾನು ಸರಿಪಡಿಸಲಾಗಿದೆ.`
          : `${target.medicationName} reset to ${status} and stock restored.`,
        'info'
      );
    } else if (status === 'missed' && prevStatus !== 'missed') {
      setNotifications((prev) => [
        {
          id: `notif-missed-${Date.now()}`,
          title: `Missed Dose Alert: ${target.medicationName}`,
          message: `Scheduled at ${target.time} (${target.dosage}) was marked missed. Family care circle alerted.`,
          category: 'missed_dose',
          timestamp: 'Just now',
          isRead: false,
          actionPage: 'schedule',
          severity: 'critical',
        },
        ...prev,
      ]);
      addActivity(
        `Missed dose recorded for ${target.medicationName} (${target.time})`,
        'dose_missed'
      );
      showToast(
        language === 'kn'
          ? `${target.medicationName} ತಪ್ಪಿದ ಔಷಧಿ ಎಚ್ಚರಿಕೆ ಕಳುಹಿಸಲಾಗಿದೆ.`
          : `Missed dose alert sent for ${target.medicationName}.`,
        'warning'
      );
    } else {
      showToast(
        language === 'kn'
          ? `${target.medicationName} ಸ್ಥಿತಿ ನವೀಕರಿಸಲಾಗಿದೆ.`
          : `${target.medicationName} status updated to ${status}.`,
        'info'
      );
    }
    return true;
  };

  const markDoseStatus = (doseId: string, status: DoseStatus): boolean => {
    if (!requirePermission(permissions.canConfirmDose)) return false;
    recordPendingChange();
    return applyDoseStatusUpdate(doseId, status);
  };

  const addVoiceReminder = (reminder: Omit<VoiceReminder, 'id'>): boolean => {
    if (!requirePermission(permissions.canManageReminders)) return false;
    const newRem: VoiceReminder = { ...reminder, id: `rem-${Date.now()}` };
    setVoiceReminders((prev) => [newRem, ...prev]);
    recordPendingChange();
    addActivity(`Added voice reminder: ${newRem.title} (${newRem.date} ${newRem.time})`, 'note');
    showToast(
      language === 'kn' ? 'ಧ್ವನಿ ಜ್ಞಾಪನೆ ಸೇರಿಸಲಾಗಿದೆ.' : `Voice reminder "${newRem.title}" added.`,
      'success'
    );
    return true;
  };

  const updateVoiceReminder = (reminder: VoiceReminder): boolean => {
    if (!requirePermission(permissions.canManageReminders)) return false;
    setVoiceReminders((prev) => prev.map((r) => (r.id === reminder.id ? reminder : r)));
    recordPendingChange();
    addActivity(`Updated voice reminder: ${reminder.title}`, 'note');
    showToast(
      language === 'kn'
        ? 'ಧ್ವನಿ ಜ್ಞಾಪನೆ ನವೀಕರಿಸಲಾಗಿದೆ.'
        : `Voice reminder "${reminder.title}" updated.`,
      'success'
    );
    return true;
  };

  const deleteVoiceReminder = (id: string): boolean => {
    if (!requirePermission(permissions.canManageReminders)) return false;
    const target = voiceReminders.find((r) => r.id === id);
    setVoiceReminders((prev) => prev.filter((r) => r.id !== id));
    recordPendingChange();
    if (target) {
      addActivity(`Deleted voice reminder: ${target.title}`, 'note');
      showToast(
        language === 'kn'
          ? 'ಧ್ವನಿ ಜ್ಞಾಪನೆ ಅಳಿಸಲಾಗಿದೆ.'
          : `Voice reminder "${target.title}" deleted.`,
        'info'
      );
    }
    return true;
  };

  const snoozeVoiceReminder = (id: string): boolean => {
    if (!requirePermission(permissions.canConfirmDose)) return false;
    const snoozeTarget = new Date(Date.now() + 15 * 60 * 1000).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
    const target = voiceReminders.find((r) => r.id === id);
    setVoiceReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, snoozedUntil: snoozeTarget } : r))
    );
    if (target) {
      showToast(
        language === 'kn'
          ? `${target.title} 15 ನಿಮಿಷ ಮುಂದೂಡಲಾಗಿದೆ (${snoozeTarget} ವರೆಗೆ).`
          : `Snoozed "${target.title}" until ${snoozeTarget}.`,
        'info'
      );
    }
    return true;
  };

  const addAppointment = (appt: Omit<Appointment, 'id'>): boolean => {
    if (!requirePermission(permissions.canManageAppointments)) return false;
    const newAppt: Appointment = { ...appt, id: `appt-${Date.now()}` };
    setAppointments((prev) => [newAppt, ...prev]);
    recordPendingChange();
    addActivity(`Scheduled appointment with ${appt.doctorName} on ${appt.date}`, 'appointment');
    setNotifications((prev) => [
      {
        id: `notif-appt-${Date.now()}`,
        title: `Appointment Scheduled: ${appt.doctorName}`,
        message: `${appt.date} at ${appt.time} · ${appt.clinicName}`,
        category: 'appointment',
        timestamp: 'Just now',
        isRead: false,
        actionPage: 'appointments',
        severity: 'info',
      },
      ...prev,
    ]);
    showToast(
      language === 'kn'
        ? `${appt.doctorName} ಅವರೊಂದಿಗೆ ಭೇಟಿ ನಿಗದಿಯಾಗಿದೆ.`
        : `Appointment scheduled with ${appt.doctorName}.`,
      'success'
    );
    return true;
  };

  const updateAppointment = (appt: Appointment): boolean => {
    if (!requirePermission(permissions.canManageAppointments)) return false;
    setAppointments((prev) => prev.map((a) => (a.id === appt.id ? appt : a)));
    recordPendingChange();
    addActivity(`Updated appointment with ${appt.doctorName} (${appt.status})`, 'appointment');
    showToast(
      language === 'kn' ? 'ವೈದ್ಯರ ಭೇಟಿ ನವೀಕರಿಸಲಾಗಿದೆ.' : 'Appointment updated.',
      'success'
    );
    return true;
  };

  const deleteAppointment = (id: string): boolean => {
    if (!requirePermission(permissions.canManageAppointments)) return false;
    const target = appointments.find((a) => a.id === id);
    setAppointments((prev) => prev.filter((a) => a.id !== id));
    recordPendingChange();
    if (target) {
      addActivity(`Removed appointment with ${target.doctorName}`, 'appointment');
      showToast(
        language === 'kn' ? 'ವೈದ್ಯರ ಭೇಟಿ ಅಳಿಸಲಾಗಿದೆ.' : 'Appointment deleted.',
        'info'
      );
    }
    return true;
  };

  const addFamilyMember = (member: Omit<FamilyMember, 'id'>): boolean => {
    if (!requirePermission(permissions.canManageCareCircle, true)) return false;
    setFamilyMembers((prev) => [{ ...member, id: `fam-${Date.now()}` }, ...prev]);
    addActivity(`Added family member ${member.name} (${member.relationship})`, 'note');
    showToast(
      language === 'kn'
        ? `${member.name} ಕುಟುಂಬ ಆರೈಕೆ ವೃಂದಕ್ಕೆ ಸೇರಿಸಲಾಗಿದೆ.`
        : `${member.name} added to Care Circle.`,
      'success'
    );
    return true;
  };

  const updateFamilyMember = (member: FamilyMember): boolean => {
    if (!requirePermission(permissions.canManageCareCircle, true)) return false;
    setFamilyMembers((prev) => prev.map((f) => (f.id === member.id ? member : f)));
    showToast(
      language === 'kn' ? `${member.name} ನವೀಕರಿಸಲಾಗಿದೆ.` : `${member.name} updated.`,
      'success'
    );
    return true;
  };

  const deleteFamilyMember = (id: string): boolean => {
    if (!requirePermission(permissions.canManageCareCircle, true)) return false;
    const target = familyMembers.find((f) => f.id === id);
    setFamilyMembers((prev) => prev.filter((f) => f.id !== id));
    if (target) {
      showToast(
        language === 'kn'
          ? `${target.name} ಆರೈಕೆ ವೃಂದದಿಂದ ತೆಗೆದುಹಾಕಲಾಗಿದೆ.`
          : `${target.name} removed from Care Circle.`,
        'info'
      );
    }
    return true;
  };

  const addCaretaker = (caretaker: Omit<Caretaker, 'id'>): boolean => {
    if (!requirePermission(permissions.canManageCareCircle, true)) return false;
    setCaretakers((prev) => [{ ...caretaker, id: `care-${Date.now()}` }, ...prev]);
    addActivity(`Assigned caretaker ${caretaker.name}`, 'note');
    showToast(
      language === 'kn' ? `${caretaker.name} ಸೇರಿಸಲಾಗಿದೆ.` : `${caretaker.name} added.`,
      'success'
    );
    return true;
  };

  const updateCaretaker = (caretaker: Caretaker): boolean => {
    if (!requirePermission(permissions.canManageCareCircle, true)) return false;
    setCaretakers((prev) => prev.map((c) => (c.id === caretaker.id ? caretaker : c)));
    showToast(
      language === 'kn' ? `${caretaker.name} ನವೀಕರಿಸಲಾಗಿದೆ.` : `${caretaker.name} updated.`,
      'success'
    );
    return true;
  };

  const deleteCaretaker = (id: string): boolean => {
    if (!requirePermission(permissions.canManageCareCircle, true)) return false;
    const target = caretakers.find((c) => c.id === id);
    setCaretakers((prev) => prev.filter((c) => c.id !== id));
    if (target) {
      showToast(
        language === 'kn' ? `${target.name} ತೆಗೆದುಹಾಕಲಾಗಿದೆ.` : `${target.name} removed.`,
        'info'
      );
    }
    return true;
  };

  const checkInCaretaker = (id: string): boolean => {
    if (!requirePermission(permissions.canCheckInCaretaker)) return false;
    const target = caretakers.find((c) => c.id === id);
    if (!target) return false;
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setCaretakers((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, status: 'On Duty', lastCheckIn: `Today · ${nowTime}` } : c
      )
    );
    addActivity(`${target.name} checked in for shift`, 'note');
    showToast(
      language === 'kn'
        ? `${target.name} ಶಿಫ್ಟ್ ಚೆಕ್-ಇನ್ ದಾಖಲಿಸಲಾಗಿದೆ.`
        : `${target.name} checked in for shift.`,
      'success'
    );
    return true;
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    showToast(
      language === 'kn' ? 'ಎಲ್ಲಾ ಸೂಚನೆಗಳನ್ನು ಓದಿದಂತೆ ಗುರುತಿಸಲಾಗಿದೆ.' : 'All notifications marked as read.',
      'info'
    );
  };

  const deleteNotification = (id: string): boolean => {
    if (!requirePermission(permissions.canEditSchedule)) return false;
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    return true;
  };

  const triggerMissedDoseSimulation = (): boolean => {
    if (!requirePermission(permissions.canEditSchedule)) return false;
    const pending = doseSlots.find((d) => d.status === 'pending') || doseSlots[0];
    if (!pending) return false;
    setNotifications((prev) => [
      {
        id: `notif-sim-${Date.now()}`,
        title: `Missed Medication Alert: ${pending.medicationName}`,
        message: `${pending.dosage} scheduled at ${pending.time} has exceeded the ${reminderSettings.escalationDelayMinutes}-minute window. Alert sent to subscribed family contacts.`,
        category: 'missed_dose',
        timestamp: 'Just now',
        isRead: false,
        actionPage: 'schedule',
        severity: 'critical',
      },
      ...prev,
    ]);
    addActivity(`Simulated missed-dose escalation alert for ${pending.medicationName}`, 'dose_missed');
    showToast(
      language === 'kn'
        ? `${pending.medicationName} ತಪ್ಪಿದ ಔಷಧಿ ಎಚ್ಚರಿಕೆ ಕಳುಹಿಸಲಾಗಿದೆ.`
        : `Missed medication alert triggered for ${pending.medicationName}.`,
      'warning'
    );
    return true;
  };

  const addPrescription = (rx: Omit<Prescription, 'id'>): boolean => {
    if (!requirePermission(permissions.canManagePrescriptions)) return false;
    if (isDuplicatePrescriptionRecord(prescriptions, rx)) {
      showToast(t.prescriptions.duplicateRecordError, 'warning');
      return false;
    }
    suppressCorruptOverwriteRef.current = false;
    setPrescriptions((prev) => [{ ...rx, id: `rx-${Date.now()}` }, ...prev]);
    addActivity(`Uploaded prescription: ${rx.title}`, 'prescription');
    showToast(
      language === 'kn' ? 'ಔಷಧ ಚೀಟಿ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ ಉಳಿಸಲಾಗಿದೆ.' : 'Prescription uploaded and saved.',
      'success'
    );
    return true;
  };

  const addPrescriptionWithAttachment = async (
    rx: Omit<Prescription, 'id'>,
    file?: File | null
  ): Promise<{ ok: boolean; errorMessage?: string }> => {
    if (!requirePermission(permissions.canManagePrescriptions)) {
      return { ok: false, errorMessage: t.common.permissionDenied };
    }

    if (!file) {
      const ok = addPrescription(rx);
      return ok ? { ok: true } : { ok: false, errorMessage: t.prescriptions.duplicateRecordError };
    }

    try {
      const { record, deduplicated } = await saveAttachment(file, {
        fileName: file.name,
        mimeType: file.type,
      });

      const nextMeta: Omit<Prescription, 'id'> = {
        ...rx,
        fileName: file.name,
        fileUrl: '',
        attachmentId: record.id,
        fileMimeType: record.mimeType,
        fileSizeBytes: record.sizeBytes,
        fileChecksum: record.checksum,
      };

      if (isDuplicatePrescriptionRecord(prescriptions, nextMeta)) {
        if (!deduplicated) {
          await deleteAttachment(record.id).catch(() => {});
        }
        showToast(t.prescriptions.duplicateRecordError, 'warning');
        return { ok: false, errorMessage: t.prescriptions.duplicateRecordError };
      }

      suppressCorruptOverwriteRef.current = false;
      setPrescriptions((prev) => [{ ...nextMeta, id: `rx-${Date.now()}` }, ...prev]);
      addActivity(`Uploaded prescription: ${nextMeta.title}`, 'prescription');
      showToast(
        deduplicated
          ? t.prescriptions.duplicateFileReusedInfo
          : language === 'kn'
          ? 'ಔಷಧ ಚೀಟಿ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ ಉಳಿಸಲಾಗಿದೆ.'
          : 'Prescription uploaded and saved.',
        deduplicated ? 'info' : 'success'
      );
      return { ok: true };
    } catch (err) {
      const code = classifyStorageError(err);
      const errorMessage =
        code === 'QUOTA_EXCEEDED'
          ? t.prescriptions.indexedDbQuotaError
          : code === 'IDB_UNAVAILABLE'
          ? t.prescriptions.indexedDbUnavailableError
          : t.prescriptions.indexedDbSaveError;
      showToast(errorMessage, 'error');
      return { ok: false, errorMessage };
    }
  };

  const updatePrescription = (rx: Prescription): boolean => {
    if (!requirePermission(permissions.canManagePrescriptions)) return false;
    suppressCorruptOverwriteRef.current = false;
    setPrescriptions((prev) => prev.map((p) => (p.id === rx.id ? rx : p)));
    showToast(
      language === 'kn' ? 'ಔಷಧ ಚೀಟಿ ವಿವರ ನವೀಕರಿಸಲಾಗಿದೆ.' : 'Prescription details updated.',
      'success'
    );
    return true;
  };

  const deletePrescription = (id: string): boolean => {
    if (!requirePermission(permissions.canManagePrescriptions)) return false;
    const target = prescriptions.find((p) => p.id === id);
    suppressCorruptOverwriteRef.current = false;
    setPrescriptions((prev) => prev.filter((p) => p.id !== id));

    if (
      target?.attachmentId &&
      !isAttachmentStillReferenced(prescriptions, target.attachmentId, id)
    ) {
      deleteAttachment(target.attachmentId).catch(() => {
        showToast(t.prescriptions.indexedDbSaveError, 'warning');
      });
    }

    showToast(
      language === 'kn' ? 'ಔಷಧ ಚೀಟಿ ಅಳಿಸಲಾಗಿದೆ.' : 'Prescription deleted.',
      'info'
    );
    return true;
  };

  const addCareNote = (content: string): boolean => {
    if (!requirePermission(permissions.canPostCareNote)) return false;
    if (!content.trim()) return false;
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setCareNotes((prev) => [
      {
        id: `note-${Date.now()}`,
        authorName: currentUser.name.split(' (')[0],
        authorRole: currentUser.role,
        content: content.trim(),
        timestamp: `Today · ${nowTime}`,
      },
      ...prev,
    ]);
    addActivity('Shared a care update note with the family circle', 'note');
    showToast(
      language === 'kn' ? 'ಆರೈಕೆ ಟಿಪ್ಪಣಿ ಪೋಸ್ಟ್ ಮಾಡಲಾಗಿದೆ.' : 'Care note posted to shared family feed.',
      'success'
    );
    return true;
  };

  const updateReminderSettings = (settings: ReminderSettings): boolean => {
    if (!requirePermission(permissions.canManageReminders)) return false;
    setReminderSettings(settings);
    showToast(
      language === 'kn' ? 'ಜ್ಞಾಪನೆ ಸೆಟ್ಟಿಂಗ್‌ಗಳನ್ನು ನವೀಕರಿಸಲಾಗಿದೆ.' : 'Reminder settings updated.',
      'success'
    );
    return true;
  };

  const triggerSosAlert = () => {
    setNotifications((prev) => [
      {
        id: `notif-sos-${Date.now()}`,
        title: 'EMERGENCY SOS ALERT DISPATCHED',
        message: `Urgent SOS triggered for ${patientProfile.fullName}. All emergency family contacts and on-duty caretaker notified immediately.`,
        category: 'sos',
        timestamp: 'Just now',
        isRead: false,
        actionPage: 'family',
        severity: 'critical',
      },
      ...prev,
    ]);
    addActivity('Triggered Emergency SOS Alert to family and caretaker', 'sos');
    showToast(
      language === 'kn'
        ? 'ತುರ್ತು SOS ಎಚ್ಚರಿಕೆಯನ್ನು ಕುಟುಂಬ ಮತ್ತು ಆರೈಕೆದಾರರಿಗೆ ಕಳುಹಿಸಲಾಗಿದೆ.'
        : 'Emergency SOS Alert sent to Care Circle.',
      'error'
    );
  };

  const speakText = (text: string, langOverride?: Language, repeatCount = 1) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      showToast(
        language === 'kn'
          ? 'ಈ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಧ್ವನಿ ಪ್ಲೇಬ್ಯಾಕ್ ಬೆಂಬಲಿತವಾಗಿಲ್ಲ.'
          : 'Voice playback is not supported in this browser.',
        'warning'
      );
      return;
    }
    window.speechSynthesis.cancel();
    const activeLang = langOverride || language;
    const repeats = Math.max(1, Math.min(3, Math.round(repeatCount)));
    const volumeLevel = Math.max(0.1, Math.min(1, speakerConfig.volumePercent / 100));

    for (let i = 0; i < repeats; i += 1) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = activeLang === 'kn' ? 'kn-IN' : 'en-IN';
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.volume = volumeLevel;
      window.speechSynthesis.speak(utterance);
    }
  };

  const playChime = (bypassSoundToggle = false) => {
    if (!bypassSoundToggle && !reminderSettings.soundEnabled) {
      return;
    }
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const scaledGain = Math.max(0.02, 0.22 * (speakerConfig.volumePercent / 100));
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime);
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.16);
        osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.32);
        gain.gain.setValueAtTime(scaledGain, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.75);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.75);
      }
    } catch {
      // Ignore Web Audio restriction
    }
  };

  const updateSpeakerConfig = (cfg: SmartSpeakerConfig, silent = false): boolean => {
    if (!requirePermission(permissions.canConfigureSpeaker)) return false;
    setSpeakerConfig(cfg);
    if (!silent) {
      showToast(
        language === 'kn'
          ? 'ಸಿಮ್ಯುಲೇಟೆಡ್ ಸ್ಮಾರ್ಟ್ ಸ್ಪೀಕರ್ ಸೆಟ್ಟಿಂಗ್‌ಗಳನ್ನು ನವೀಕರಿಸಲಾಗಿದೆ.'
          : 'Simulated smart speaker settings updated.',
        'success'
      );
    }
    return true;
  };

  const broadcastToSpeaker = ({
    dose,
    voiceReminder,
    customMessage,
    langOverride,
  }: {
    dose?: DoseSlot;
    voiceReminder?: VoiceReminder;
    customMessage?: string;
    langOverride?: Language;
  }): boolean => {
    if (!requirePermission(permissions.canBroadcastSpeaker)) return false;

    if (!speakerConfig.isOnline) {
      showToast(
        language === 'kn'
          ? 'ಸ್ಪೀಕರ್ ಆಫ್‌ಲೈನ್ / ಸ್ಟ್ಯಾಂಡ್‌ಬೈ ಮೋಡ್‌ನಲ್ಲಿದೆ. ಘೋಷಿಸಲು ಸ್ಪೀಕರ್ ಅನ್ನು ಆನ್‌ಲೈನ್‌ಗೆ ಬದಲಾಯಿಸಿ.'
          : 'Simulated speaker is Standby / Offline. Switch to Speaker Online to announce.',
        'warning'
      );
      return false;
    }

    if (dose) {
      const med = medications.find((m) => m.id === dose.medicationId);
      if (med && !med.reminderEnabled) {
        showToast(
          language === 'kn'
            ? `${dose.medicationName} ಜ್ಞಾಪನೆಗಳು ಮ್ಯೂಟ್ ಆಗಿವೆ.`
            : `Reminders for ${dose.medicationName} are currently muted.`,
          'warning'
        );
        return false;
      }
    }

    if (voiceReminder) {
      if (!voiceReminder.enabled) {
        showToast(
          language === 'kn'
            ? 'ಈ ಜ್ಞಾಪನೆ ವಿರಾಮದಲ್ಲಿದೆ.'
            : 'This scheduled reminder is currently paused.',
          'warning'
        );
        return false;
      }
      if (voiceReminder.medicationId) {
        const linkedMed = medications.find((m) => m.id === voiceReminder.medicationId);
        if (linkedMed && !linkedMed.reminderEnabled) {
          showToast(
            language === 'kn'
              ? `${linkedMed.name} ಜ್ಞಾಪನೆಗಳು ಮ್ಯೂಟ್ ಆಗಿವೆ.`
              : `Reminders for ${linkedMed.name} are currently muted.`,
            'warning'
          );
          return false;
        }
      }
    }

    const activeLang = langOverride || speakerConfig.voiceLanguage || language;
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const message =
      customMessage?.trim() ||
      (dose
        ? activeLang === 'kn'
          ? `ನಮಸ್ಕಾರ ${patientProfile.fullName} ಅವರೇ. ಈಗ ${dose.time} ಆಗಿದೆ. ದಯವಿಟ್ಟು ${dose.medicationName} ${dose.dosage} ಮಾತ್ರೆ (${dose.mealInstruction}) ತೆಗೆದುಕೊಳ್ಳಿ.`
          : `Namaste ${patientProfile.fullName}. It is ${dose.time}. Please take ${dose.medicationName}, ${dose.dosage}, ${dose.mealInstruction}. Press the green top button on your speaker or say I took it.`
        : voiceReminder
        ? activeLang === 'kn'
          ? `ನಮಸ್ಕಾರ ${patientProfile.fullName} ಅವರೇ. ಜ್ಞಾಪನೆ (${voiceReminder.date}, ${voiceReminder.time}): ${voiceReminder.title}. ದಯವಿಟ್ಟು ${voiceReminder.medicationName} ${voiceReminder.dosage === '-' ? '' : voiceReminder.dosage} ಗಮನಿಸಿ.`
          : `Namaste ${patientProfile.fullName}. Scheduled reminder for ${voiceReminder.date} at ${voiceReminder.time}: ${voiceReminder.title}. ${voiceReminder.medicationName}${voiceReminder.dosage !== '-' ? `, ${voiceReminder.dosage}` : ''}.`
        : activeLang === 'kn'
        ? `ನಮಸ್ಕಾರ ${patientProfile.fullName} ಅವರೇ. ನಿಮ್ಮ ಔಷಧಿಗಳನ್ನು ಸಮಯಕ್ಕೆ ತೆಗೆದುಕೊಳ್ಳಿ.`
        : `Namaste ${patientProfile.fullName}. This is a reminder from your family to take your scheduled medicine with water.`);

    if (speakerConfig.chimeBeforeSpeech && reminderSettings.soundEnabled) {
      playChime();
    }
    if (reminderSettings.voicePromptEnabled) {
      speakText(message, activeLang, speakerConfig.repeatCount);
    }

    setSpeakerConfig((prev) => ({
      ...prev,
      lastBroadcastText: message,
      lastBroadcastAt: `Today · ${nowTime}`,
    }));

    const historyEntry: ReminderHistoryEntry = {
      id: `hist-${Date.now()}`,
      doseId: dose?.id,
      reminderId: voiceReminder?.id,
      timestamp: `Today · ${nowTime}`,
      medicationName: dose
        ? dose.medicationName
        : voiceReminder
        ? `${voiceReminder.title} (${voiceReminder.medicationName})`
        : 'Family Voice Message',
      dosage: dose ? dose.dosage : voiceReminder ? voiceReminder.dosage : 'Custom Broadcast',
      scheduledTime: dose ? dose.time : voiceReminder ? voiceReminder.time : nowTime,
      channel: 'Smart Speaker',
      spokenMessage: message,
      language: activeLang,
      outcome: 'Pending Response',
      respondedBy: 'Awaiting simulated speaker confirmation',
    };
    setReminderHistory((prev) => [historyEntry, ...prev]);
    addActivity(`Broadcasted simulated speaker reminder to ${speakerConfig.roomLocation}`, 'note');
    showToast(
      language === 'kn'
        ? 'ಸಿಮ್ಯುಲೇಟೆಡ್ ಮನೆಯ ಸ್ಪೀಕರ್‌ಗೆ ಧ್ವನಿ ಜ್ಞಾಪನೆ ಪ್ರಸಾರ ಮಾಡಲಾಗಿದೆ.'
        : 'Voice reminder broadcasted to simulated home smart speaker.',
      'success'
    );
    return true;
  };

  const respondFromSpeaker = (
    responseType: 'taken' | 'snooze' | 'help',
    doseId?: string
  ): boolean => {
    if (!speakerConfig.isOnline) {
      showToast(
        language === 'kn'
          ? 'ಸ್ಪೀಕರ್ ಆಫ್‌ಲೈನ್ / ಸ್ಟ್ಯಾಂಡ್‌ಬೈ ಮೋಡ್‌ನಲ್ಲಿದೆ.'
          : 'Simulated speaker is Standby / Offline. Switch to Speaker Online to respond.',
        'warning'
      );
      return false;
    }

    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const targetDose =
      (doseId &&
        doseSlots.find(
          (d) => d.id === doseId && (d.status === 'pending' || d.status === 'missed')
        )) ||
      doseSlots.find((d) => d.status === 'pending' || d.status === 'missed');

    if (responseType === 'taken') {
      if (!targetDose) {
        const msg =
          speakerConfig.voiceLanguage === 'kn'
            ? 'ಇಂದಿನ ಎಲ್ಲಾ ನಿಗದಿತ ಔಷಧಿಗಳನ್ನು ಈಗಾಗಲೇ ತೆಗೆದುಕೊಳ್ಳಲಾಗಿದೆ.'
            : 'All scheduled doses for today are already marked taken.';
        if (reminderSettings.voicePromptEnabled) {
          speakText(msg, speakerConfig.voiceLanguage);
        }
        showToast(msg, 'info');
        return false;
      }

      const responderLabel = 'Elderly Person (Simulated Hands-Free Speaker)';
      const hasPendingBroadcast = reminderHistory.some(
        (entry) =>
          entry.outcome === 'Pending Response' &&
          ((entry.doseId && entry.doseId === targetDose.id) ||
            (entry.medicationName === targetDose.medicationName &&
              entry.scheduledTime === targetDose.time))
      );

      // Update dose status (which also updates matching Pending Response in reminderHistory)
      applyDoseStatusUpdate(targetDose.id, 'taken', responderLabel);

      // Only append a new Confirmed Taken entry if there was no existing Pending Response row to update
      if (!hasPendingBroadcast) {
        setReminderHistory((prev) =>
          applySpeakerHistoryResponse(prev, 'taken', {
            dose: targetDose,
            nowTime,
            spokenMessage: speakerConfig.lastBroadcastText,
            voiceLanguage: speakerConfig.voiceLanguage,
            responderLabel,
          })
        );
      }

      const reply =
        speakerConfig.voiceLanguage === 'kn'
          ? 'ಧನ್ಯವಾದಗಳು. ನಿಮ್ಮ ಔಷಧಿ ತೆಗೆದುಕೊಂಡಿರುವುದನ್ನು ದಾಖಲಿಸಲಾಗಿದೆ.'
          : 'Thank you. Your dose has been recorded and your family has been notified.';
      if (reminderSettings.voicePromptEnabled) {
        speakText(reply, speakerConfig.voiceLanguage);
      }
      return true;
    }

    if (responseType === 'snooze') {
      setReminderHistory((prev) =>
        applySpeakerHistoryResponse(prev, 'snooze', {
          dose: targetDose,
          nowTime,
          spokenMessage: speakerConfig.lastBroadcastText,
          voiceLanguage: speakerConfig.voiceLanguage,
          responderLabel: 'Elderly Person (Simulated Speaker Snooze)',
        })
      );
      const reply =
        speakerConfig.voiceLanguage === 'kn'
          ? 'ಸರಿ, ನಾನು ಹತ್ತು ನಿಮಿಷಗಳಲ್ಲಿ ಮತ್ತೆ ನೆನಪಿಸುತ್ತೇನೆ.'
          : 'Okay, I will gently remind you again in 10 minutes.';
      if (reminderSettings.voicePromptEnabled) {
        speakText(reply, speakerConfig.voiceLanguage);
      }
      showToast(
        language === 'kn'
          ? 'ಸಿಮ್ಯುಲೇಟೆಡ್ ಸ್ಪೀಕರ್ ಜ್ಞಾಪನೆಯನ್ನು 10 ನಿಮಿಷ ಮುಂದೂಡಲಾಗಿದೆ.'
          : 'Simulated smart speaker snoozed reminder for 10 minutes.',
        'info'
      );
      return true;
    }

    setNotifications((prev) => [
      {
        id: `notif-speaker-help-${Date.now()}`,
        title: 'Assistance Requested via Simulated Home Smart Speaker',
        message: `${patientProfile.fullName} pressed the Help button on the ${speakerConfig.roomLocation}. Please check in immediately.`,
        category: 'sos',
        timestamp: 'Just now',
        isRead: false,
        actionPage: 'speaker',
        severity: 'critical',
      },
      ...prev,
    ]);
    addActivity('Elderly person requested assistance via Simulated Home Smart Speaker', 'sos');
    const reply =
      speakerConfig.voiceLanguage === 'kn'
        ? 'ಚಿಂತಿಸಬೇಡಿ. ನಿಮ್ಮ ಕುಟುಂಬದವರಿಗೆ ತಕ್ಷಣ ಸಂದೇಶ ಕಳುಹಿಸಲಾಗಿದೆ.'
        : 'Do not worry. I have immediately alerted your family and caretaker.';
    if (reminderSettings.voicePromptEnabled) {
      speakText(reply, speakerConfig.voiceLanguage);
    }
    showToast(
      language === 'kn'
        ? 'ಕುಟುಂಬ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ಗೆ ತುರ್ತು ಸಹಾಯ ಎಚ್ಚರಿಕೆ ಕಳುಹಿಸಲಾಗಿದೆ.'
        : 'Urgent assistance alert sent to family dashboard.',
      'error'
    );
    return true;
  };

  const resetDemoData = () => {
    suppressCorruptOverwriteRef.current = false;
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore storage clear errors
    }
    setRegisteredUsers(INITIAL_AUTH_USERS);
    setCurrentUser(INITIAL_AUTH_USERS[0]);
    setPatientProfile(INITIAL_PATIENT_PROFILE);
    setVitals(INITIAL_VITALS);
    setMedications(INITIAL_MEDICATIONS);
    setDoseSlots(INITIAL_DOSE_SLOTS);
    setVoiceReminders(INITIAL_VOICE_REMINDERS);
    setAppointments(INITIAL_APPOINTMENTS);
    setFamilyMembers(INITIAL_FAMILY_MEMBERS);
    setCaretakers(INITIAL_CARETAKERS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setPrescriptions(INITIAL_PRESCRIPTIONS);
    setActivities(INITIAL_ACTIVITIES);
    setCareNotes(INITIAL_CARE_NOTES);
    setReminderSettings(INITIAL_REMINDER_SETTINGS);
    setSpeakerConfig(INITIAL_SPEAKER_CONFIG);
    setReminderHistory(INITIAL_REMINDER_HISTORY);
    setLanguageState('en');
    setTextScale('standard');
    setHighContrast(false);
    navigateTo('dashboard', { replace: true });
    showToast('Demonstration data reset to initial defaults.', 'info');
  };

  const weeklyAdherence = useMemo(
    () => buildWeeklyAdherence(INITIAL_WEEKLY_ADHERENCE, doseSlots),
    [doseSlots]
  );

  return (
    <AppContext.Provider
      value={{
        currentPage,
        navigateTo,
        language,
        setLanguage,
        t,
        textScale,
        setTextScale,
        highContrast,
        setHighContrast,
        currentUser,
        permissions,
        registeredUsers,
        loginDemoUser,
        loginWithEmail,
        registerUser,
        patientProfile,
        updatePatientProfile,
        vitals,
        addVitalReading,
        medications,
        addMedication,
        updateMedication,
        deleteMedication,
        restockMedication,
        doseSlots,
        markDoseStatus,
        voiceReminders,
        addVoiceReminder,
        updateVoiceReminder,
        deleteVoiceReminder,
        snoozeVoiceReminder,
        appointments,
        addAppointment,
        updateAppointment,
        deleteAppointment,
        familyMembers,
        addFamilyMember,
        updateFamilyMember,
        deleteFamilyMember,
        caretakers,
        addCaretaker,
        updateCaretaker,
        deleteCaretaker,
        checkInCaretaker,
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        deleteNotification,
        triggerMissedDoseSimulation,
        prescriptions,
        addPrescription,
        addPrescriptionWithAttachment,
        updatePrescription,
        deletePrescription,
        activities,
        careNotes,
        addCareNote,
        weeklyAdherence,
        reminderSettings,
        updateReminderSettings,
        speakerConfig,
        updateSpeakerConfig,
        reminderHistory,
        broadcastToSpeaker,
        respondFromSpeaker,
        voiceModalOpen,
        setVoiceModalOpen,
        sosModalOpen,
        setSosModalOpen,
        triggerSosAlert,
        speakText,
        playChime,
        toast,
        showToast,
        dismissToast,
        resetDemoData,
        pendingChangesCount,
        clearPendingChanges,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
