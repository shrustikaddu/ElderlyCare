import { Appointment, Caretaker, Medication, ReminderDeliveryChannel, ReminderOutcome, TimeOfDay } from '../types';
import { TranslationDictionary } from './translations';

export function translateTimeOfDay(period: TimeOfDay, t: TranslationDictionary): string {
  switch (period) {
    case 'Morning':
      return t.schedule.morning;
    case 'Afternoon':
      return t.schedule.afternoon;
    case 'Evening':
      return t.schedule.evening;
    case 'Night':
      return t.schedule.night;
    default:
      return period;
  }
}

export function translateMealInstruction(meal: string, t: TranslationDictionary): string {
  switch (meal) {
    case 'Before food':
      return t.medications.mealBefore;
    case 'After food':
      return t.medications.mealAfter;
    case 'With water':
      return t.medications.mealWater;
    case 'Bedtime':
      return t.medications.mealBedtime;
    default:
      return meal;
  }
}

export function translateFrequency(freq: Medication['frequency'], t: TranslationDictionary): string {
  switch (freq) {
    case 'Once daily':
      return t.medications.freqOnce;
    case 'Twice daily':
      return t.medications.freqTwice;
    case 'Three times daily':
      return t.medications.freqThree;
    case 'As needed':
      return t.medications.freqAsNeeded;
    default:
      return freq;
  }
}

export function translateWeekday(day: string, t: TranslationDictionary): string {
  if (day === 'Today') return t.common.todayWord;
  const key = day as keyof TranslationDictionary['common']['weekdays'];
  return t.common.weekdays[key] || day;
}

export function translateReminderChannel(
  channel: ReminderDeliveryChannel,
  t: TranslationDictionary
): string {
  switch (channel) {
    case 'Smart Speaker':
      return t.history.channelSpeaker;
    case 'Voice Call Fallback':
      return t.history.channelVoiceFallback;
    case 'Caretaker Alert':
      return t.history.channelCaretaker;
    default:
      return channel;
  }
}

export function translateReminderOutcome(
  outcome: ReminderOutcome,
  t: TranslationDictionary
): string {
  switch (outcome) {
    case 'Confirmed Taken':
      return t.history.filterConfirmed;
    case 'Snoozed 10m':
      return t.history.filterSnoozed;
    case 'Pending Response':
      return t.history.filterPending;
    case 'Escalated to Family':
      return t.history.filterEscalated;
    default:
      return outcome;
  }
}

export function translateVisitType(
  visitType: Appointment['visitType'],
  t: TranslationDictionary
): string {
  return visitType === 'In-Person' ? t.appointments.inPerson : t.appointments.teleconsultation;
}

export function translateAppointmentStatus(
  status: Appointment['status'],
  t: TranslationDictionary
): string {
  switch (status) {
    case 'Scheduled':
      return t.appointments.filterScheduled;
    case 'Completed':
      return t.appointments.filterCompleted;
    case 'Cancelled':
      return t.appointments.filterCancelled;
    default:
      return status;
  }
}

export function translateCaretakerShift(
  shift: Caretaker['shift'],
  t: TranslationDictionary
): string {
  switch (shift) {
    case 'Morning (7 AM - 2 PM)':
      return t.caretakers.shiftMorning;
    case 'Evening (2 PM - 9 PM)':
      return t.caretakers.shiftEvening;
    case 'Full-Day Live-In':
      return t.caretakers.shiftFullDay;
    default:
      return shift;
  }
}

export function translateCaretakerStatus(
  status: Caretaker['status'],
  t: TranslationDictionary
): string {
  switch (status) {
    case 'On Duty':
      return t.caretakers.statusOnDuty;
    case 'Off Duty':
      return t.caretakers.statusOffDuty;
    case 'On Leave':
      return t.caretakers.statusOnLeave;
    default:
      return status;
  }
}
