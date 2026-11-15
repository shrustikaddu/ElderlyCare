export type PageId =
  | 'dashboard'
  | 'profile'
  | 'medications'
  | 'schedule'
  | 'reminders'
  | 'speaker'
  | 'history'
  | 'adherence'
  | 'catalogue'
  | 'appointments'
  | 'family'
  | 'caretakers'
  | 'notifications'
  | 'prescriptions'
  | 'settings'
  | 'login'
  | 'register'
  | 'auth';

export type UserRole = 'elderly' | 'family' | 'caretaker';
export type Language = 'en' | 'kn';
export type TextScale = 'standard' | 'large' | 'xlarge';

export type DoseStatus = 'taken' | 'pending' | 'missed' | 'skipped';
export type TimeOfDay = 'Morning' | 'Afternoon' | 'Evening' | 'Night';

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: 'Once daily' | 'Twice daily' | 'Three times daily' | 'As needed';
  timings: string[]; // e.g., ["08:00 AM", "08:00 PM"]
  startDate: string;
  endDate: string;
  mealInstruction: 'Before food' | 'After food' | 'With water' | 'Bedtime';
  stockCount: number;
  lowStockThreshold: number;
  prescribedBy: string;
  purpose: string;
  reminderEnabled: boolean;
}

export interface DoseSlot {
  id: string;
  medicationId: string;
  medicationName: string;
  dosage: string;
  time: string;
  timeOfDay: TimeOfDay;
  mealInstruction: string;
  status: DoseStatus;
  takenAt?: string;
  loggedBy?: string;
}

export type AppointmentStatus = 'Scheduled' | 'Completed' | 'Cancelled';

export interface Appointment {
  id: string;
  doctorName: string;
  specialty: string;
  clinicName: string;
  date: string;
  time: string;
  visitType: 'In-Person' | 'Teleconsultation';
  purpose: string;
  status: AppointmentStatus;
  notes?: string;
}

export interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email: string;
  avatarUrl?: string;
  isEmergencyContact: boolean;
  receiveMissedAlerts: boolean;
  canEditSchedule: boolean;
  location: string;
}

export interface Caretaker {
  id: string;
  name: string;
  roleTitle: string;
  phone: string;
  email: string;
  shift: 'Morning (7 AM - 2 PM)' | 'Evening (2 PM - 9 PM)' | 'Full-Day Live-In';
  responsibilities: string[];
  avatarUrl?: string;
  lastCheckIn: string;
  status: 'On Duty' | 'Off Duty' | 'On Leave';
}

export type NotificationCategory = 'missed_dose' | 'low_stock' | 'appointment' | 'care_update' | 'sos';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  category: NotificationCategory;
  timestamp: string;
  isRead: boolean;
  actionPage?: PageId;
  severity: 'info' | 'warning' | 'critical';
}

export interface Prescription {
  id: string;
  title: string;
  doctorName: string;
  hospitalName: string;
  issueDate: string;
  linkedMedicines: string[];
  fileName: string;
  fileType: 'image' | 'pdf';
  fileUrl: string;
  attachmentId?: string;
  fileMimeType?: string;
  fileSizeBytes?: number;
  fileChecksum?: string;
  notes: string;
}

export interface VitalReading {
  id: string;
  date: string;
  bloodPressure: string;
  bloodSugar: string;
  heartRate: number;
  recordedBy: string;
}

export interface ActivityItem {
  id: string;
  description: string;
  actor: string;
  timestamp: string;
  type: 'dose_taken' | 'dose_missed' | 'appointment' | 'prescription' | 'stock' | 'sos' | 'note';
}

export interface CareNote {
  id: string;
  authorName: string;
  authorRole: UserRole;
  content: string;
  timestamp: string;
}

export interface PatientProfile {
  fullName: string;
  age: number;
  gender: string;
  bloodGroup: string;
  phone: string;
  address: string;
  city: string;
  primaryPhysician: string;
  physicianPhone: string;
  allergies: string[];
  chronicConditions: string[];
  dietaryNotes: string;
  mobilityNotes: string;
  avatarUrl: string;
}

export interface ReminderSettings {
  leadTimeMinutes: number;
  soundEnabled: boolean;
  voicePromptEnabled: boolean;
  escalateMissedToFamily: boolean;
  escalationDelayMinutes: number;
  quietHoursStart: string;
  quietHoursEnd: string;
}

export interface DailyAdherencePoint {
  day: string;
  taken: number;
  missed: number;
  total: number;
  rate: number;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
}

export interface SmartSpeakerConfig {
  deviceName: string;
  roomLocation: string;
  isOnline: boolean;
  volumePercent: number;
  voiceLanguage: Language;
  chimeBeforeSpeech: boolean;
  repeatCount: 1 | 2 | 3;
  lastBroadcastText: string;
  lastBroadcastAt: string;
}

export type ReminderDeliveryChannel = 'Smart Speaker' | 'Voice Call Fallback' | 'Caretaker Alert';
export type ReminderOutcome = 'Confirmed Taken' | 'Snoozed 10m' | 'Pending Response' | 'Escalated to Family';

export interface ReminderHistoryEntry {
  id: string;
  doseId?: string;
  reminderId?: string;
  timestamp: string;
  medicationName: string;
  dosage: string;
  scheduledTime: string;
  channel: ReminderDeliveryChannel;
  spokenMessage: string;
  language: Language;
  outcome: ReminderOutcome;
  respondedBy: string;
}

export interface UserPermissions {
  canConfirmDose: boolean;
  canEditSchedule: boolean;
  canManageMedications: boolean;
  canManageReminders: boolean;
  canManageAppointments: boolean;
  canManagePrescriptions: boolean;
  canManageProfile: boolean;
  canManageCareCircle: boolean;
  canCheckInCaretaker: boolean;
  canBroadcastSpeaker: boolean;
  canConfigureSpeaker: boolean;
  canPostCareNote: boolean;
  canTriggerSos: boolean;
}

export type ReminderFrequency = 'Daily' | 'Weekly';

export interface VoiceReminder {
  id: string;
  title: string;
  medicationId?: string;
  medicationName: string;
  dosage: string;
  date: string;
  time: string;
  frequency: ReminderFrequency;
  daysOfWeek: string[];
  enabled: boolean;
  snoozedUntil?: string;
  notes?: string;
}

export type CatalogueForm = 'Tablet' | 'Capsule' | 'Syrup' | 'Drops';

export interface CatalogueMedicine {
  id: string;
  brandName: string;
  genericName: string;
  category: string;
  form: CatalogueForm;
  strengthOptions: string;
  summaryEn: string;
  summaryKn: string;
  precautionsEn: string;
  precautionsKn: string;
  storageNotesEn: string;
  storageNotesKn: string;
  verifiedSource: string;
}


