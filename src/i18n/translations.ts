import { Language, PageId } from '../types';

export interface TranslationDictionary {
  appName: string;
  demoNotice: string;
  common: {
    brandTagline: string;
    yearsShort: string;
    openMenu: string;
    closeMenu: string;
    languageSwitcher: string;
    toggleLanguage: string;
    primaryNav: string;
    closeModal: string;
    dismissNotification: string;
    footerTitle: string;
    footerNote: string;
    readOnlyNotice: string;
    permissionDenied: string;
    careCirclePermissionDenied: string;
    switchAccountBtn: string;
    ageLabel: string;
    bloodGroupLabel: string;
    allergiesLabel: string;
    conditionsLabel: string;
    activeMedsLabel: string;
    addressLabel: string;
    weekdays: Record<'Sun' | 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat', string>;
    todayWord: string;
    weekShort: string;
    onlineLabel: string;
    offlineLabel: string;
    offlineBannerTitle: string;
    offlineBannerBody: string;
    installApp: string;
    installOnIos: string;
    iosInstallTitle: string;
    iosInstallStep1: string;
    iosInstallStep2: string;
    storageQuotaError: string;
    storageReadWarning: string;
    pendingChangesLabel: string;
    pendingChangesTooltip: string;
    pendingChangesClearedNote: string;
  };
  nav: Record<PageId, string>;
  navGroups: {
    careOverview: string;
    medicationSuite: string;
    careNetwork: string;
    system: string;
  };
  actions: {
    save: string;
    cancel: string;
    add: string;
    edit: string;
    delete: string;
    markTaken: string;
    markMissed: string;
    restock: string;
    voiceAssistant: string;
    emergencySos: string;
    signOut: string;
    signIn: string;
    exportCsv: string;
    readAloud: string;
    resetDemo: string;
    reset: string;
  };
  dashboard: {
    welcomePrefix: string;
    subtitle: string;
    dailyCareSummaryAria: string;
    totalMedicines: string;
    todaysMedicines: string;
    takenMedicines: string;
    missedMedicines: string;
    upcomingAppointments: string;
    adherenceChartTitle: string;
    recentActivities: string;
    notificationsTitle: string;
    todaysDoseQueue: string;
    lowStockAlerts: string;
    viewAll: string;
    openSmartSpeaker: string;
    remoteScheduleSync: string;
    online: string;
    standby: string;
    signedInAs: string;
    speakerNoPhoneNote: string;
    remindPrefix: string;
    remindSuffix: string;
    manageSchedulesRemotely: string;
    lowStockHelper: string;
    pendingTodayHelper: string;
    completedHelper: string;
    actionNeeded: string;
    onTrack: string;
    noneScheduled: string;
    todaysQueueSubtitle: string;
    takenAt: string;
    analyticsLink: string;
    manageStockLink: string;
    allStockHealthy: string;
    tabletsLeft: string;
    thresholdLabel: string;
    noUpcomingAppointments: string;
    unreadLabel: string;
    permissionsTitle: string;
    permissionsSummaryCanEdit: string;
    permissionsSummaryViewConfirm: string;
    permissionsManageLink: string;
  };
  charts: {
    takenDoses: string;
    missedDoses: string;
    pending: string;
    takenWord: string;
    missedWord: string;
    adherenceTrendAria: string;
  };
  medications: {
    subtitle: string;
    addMedicine: string;
    editTitlePrefix: string;
    addModalTitle: string;
    modalSubtitle: string;
    searchPlaceholder: string;
    filterAll: string;
    filterLow: string;
    filterOnce: string;
    filterTwice: string;
    filterThree: string;
    filterAsNeeded: string;
    emptyTitle: string;
    emptyDesc: string;
    prescribedCare: string;
    leftLabel: string;
    timingsLabel: string;
    prescribedByLabel: string;
    courseDurationLabel: string;
    toWord: string;
    refillThresholdLabel: string;
    unitsLabel: string;
    fieldName: string;
    fieldDosage: string;
    fieldFrequency: string;
    fieldMeal: string;
    fieldTimings: string;
    fieldStartDate: string;
    fieldEndDate: string;
    fieldStock: string;
    fieldThreshold: string;
    fieldDoctor: string;
    fieldPurpose: string;
    deleteTitle: string;
    deleteConfirmBtn: string;
    deleteMessagePrefix: string;
    deleteMessageSuffix: string;
    errNameRequired: string;
    errDosageRequired: string;
    errTimingsRequired: string;
    errTimingFormat: string;
    errDateRequired: string;
    errDateRange: string;
    errStockInvalid: string;
    errThresholdInvalid: string;
    freqOnce: string;
    freqTwice: string;
    freqThree: string;
    freqAsNeeded: string;
    mealBefore: string;
    mealAfter: string;
    mealWater: string;
    mealBedtime: string;
  };
  schedule: {
    subtitle: string;
    all: string;
    morning: string;
    afternoon: string;
    evening: string;
    night: string;
    dosesSuffix: string;
    takenSummary: string;
    pendingSummary: string;
    missedSummary: string;
    totalSummary: string;
    ofWord: string;
    readPeriodPrefix: string;
    readPeriodSuffix: string;
    emptyPeriodPrefix: string;
    loggedTakenPrefix: string;
    byWord: string;
    noScheduledSpeechPrefix: string;
  };
  reminders: {
    subtitle: string;
    speakerSimulator: string;
    testChimeVoice: string;
    addReminder: string;
    editReminder: string;
    deleteReminderTitle: string;
    deleteReminderMsg: string;
    upcomingActiveTitle: string;
    upcomingActiveSubtitle: string;
    allCompletedBanner: string;
    snoozed15Msg: string;
    overdueAlertMsg: string;
    reminderLeadPrefix: string;
    reminderLeadSuffix: string;
    speakOnHub: string;
    takeNow: string;
    snooze15m: string;
    snoozedLabel: string;
    mutedSkipNote: string;
    customRemindersTitle: string;
    customRemindersSubtitle: string;
    noCustomRemindersTitle: string;
    noCustomRemindersDesc: string;
    perMedTogglesTitle: string;
    alertsOn: string;
    muted: string;
    preferencesTitle: string;
    leadTimeLabel: string;
    minutesBeforeSuffix: string;
    audioChimeToggle: string;
    voicePromptToggle: string;
    escalateMissedToggle: string;
    escalationDelayLabel: string;
    minutesAfterSuffix: string;
    viewHistoryLink: string;
    triggerMissedAlert: string;
    fieldTitle: string;
    fieldMedicine: string;
    fieldDosage: string;
    fieldDate: string;
    fieldTime: string;
    fieldFrequency: string;
    fieldDays: string;
    fieldNotes: string;
    dailyOption: string;
    weeklyOption: string;
    enabledLabel: string;
    pausedLabel: string;
    readAloudBtn: string;
    errTitleRequired: string;
    errMedicineRequired: string;
    errDateRequired: string;
    errTimeFormat: string;
    errDaysRequired: string;
  };
  speaker: {
    subtitle: string;
    viewHistory: string;
    simulatedBadge: string;
    speakerOnline: string;
    standbyOffline: string;
    offlineWarningBanner: string;
    spokenOutputLabel: string;
    lastSpokenLabel: string;
    replayReminder: string;
    volumeLabel: string;
    repeatLabel: string;
    handsFreeHeading: string;
    btnTookIt: string;
    btnSnooze10: string;
    btnNeedHelp: string;
    sliderVolumeLabel: string;
    voiceLangLabel: string;
    repeatSelectLabel: string;
    speak1Time: string;
    speak2Times: string;
    speak3Times: string;
    remoteControllerTitle: string;
    remoteControllerSubtitle: string;
    selectDoseLabel: string;
    noPendingDropdown: string;
    voiceLanguageShort: string;
    announceDoseBtn: string;
    customMessageLabel: string;
    customMessagePlaceholder: string;
    speakCustomBtn: string;
    pendingQueueTitle: string;
    allConfirmedMsg: string;
    speakNowBtn: string;
    mutedTag: string;
    recentLogsPrefix: string;
    recentLogsSuffix: string;
  };
  history: {
    subtitle: string;
    totalSent: string;
    viaSpeakerHelper: string;
    confirmedTaken: string;
    verifiedHelper: string;
    escalatedFamily: string;
    unansweredHelper: string;
    searchPlaceholder: string;
    filterAll: string;
    filterConfirmed: string;
    filterSnoozed: string;
    filterPending: string;
    filterEscalated: string;
    emptyTitle: string;
    emptyDesc: string;
    colTimestamp: string;
    colMedicineSlot: string;
    colSpokenScript: string;
    colOutcomeResponder: string;
    colAudio: string;
    languageLabel: string;
    replayBtn: string;
    channelSpeaker: string;
    channelVoiceFallback: string;
    channelCaretaker: string;
    csvDownloadedToast: string;
  };
  adherence: {
    subtitle: string;
    dailySummaryTitle: string;
    weeklySummaryTitle: string;
    todayTaken: string;
    todayPending: string;
    todayMissed: string;
    todayRate: string;
    weeklyRate: string;
    weeklyTaken: string;
    weeklyMissed: string;
    activeMeds: string;
    targetHelper: string;
    outOfScheduledPrefix: string;
    outOfScheduledSuffix: string;
    followUpHelper: string;
    trackedDailyHelper: string;
    dailyCompletionTitle: string;
    rateTrendTitle: string;
    range7d: string;
    range4w: string;
    timeOfDayTitle: string;
    perMedicineTitle: string;
    colMedicine: string;
    colSchedule: string;
    colTodayStatus: string;
    colStockLeft: string;
    unitsSuffix: string;
    takenWord: string;
    csvDownloadedToast: string;
  };
  catalogue: {
    title: string;
    subtitle: string;
    disclaimerTitle: string;
    disclaimerBody: string;
    searchPlaceholder: string;
    categoryAll: string;
    formAll: string;
    formTablet: string;
    formCapsule: string;
    formSyrup: string;
    formDrops: string;
    genericLabel: string;
    categoryLabel: string;
    formLabel: string;
    strengthsLabel: string;
    precautionsLabel: string;
    storageLabel: string;
    sourceLabel: string;
    emptyTitle: string;
    emptyDesc: string;
  };
  family: {
    subtitle: string;
    addMember: string;
    sharedStatusPrefix: string;
    sharedSyncActive: string;
    subscribedSuffix: string;
    emergencyContact: string;
    standardContact: string;
    receivesAlerts: string;
    alertsOff: string;
    canEditSchedule: string;
    viewOnly: string;
    notesTitle: string;
    notesSubtitle: string;
    notePlaceholder: string;
    postNoteBtn: string;
    permissionsCardTitle: string;
    permissionsCardDesc: string;
    fieldName: string;
    fieldRelationship: string;
    fieldPhone: string;
    fieldEmail: string;
    fieldLocation: string;
    deleteConfirmMsg: string;
  };
  profile: {
    subtitle: string;
    editProfileBtn: string;
    updateHeading: string;
    fullName: string;
    age: string;
    bloodGroup: string;
    phone: string;
    primaryPhysician: string;
    city: string;
    allergiesInput: string;
    conditionsInput: string;
    dietaryNotes: string;
    mobilityNotes: string;
    residentialAddress: string;
    knownAllergies: string;
    noneRecorded: string;
    managedConditions: string;
    careGuidanceTitle: string;
    dietaryInstructions: string;
    mobilityExercise: string;
    vitalsLogTitle: string;
    logVitalsBtn: string;
    colDateTime: string;
    colBp: string;
    colSugar: string;
    colHeartRate: string;
    colLoggedBy: string;
    recordVitalsTitle: string;
    bpmSuffix: string;
    saveVitalsBtn: string;
  };
  appointments: {
    subtitle: string;
    scheduleBtn: string;
    filterAll: string;
    filterScheduled: string;
    filterCompleted: string;
    filterCancelled: string;
    emptyTitle: string;
    emptyDesc: string;
    purposeLabel: string;
    noteLabel: string;
    markCompleted: string;
    cancelVisit: string;
    editModalTitle: string;
    createModalTitle: string;
    fieldDoctor: string;
    fieldSpecialty: string;
    fieldClinic: string;
    fieldDate: string;
    fieldTime: string;
    fieldVisitType: string;
    fieldPurpose: string;
    fieldNotes: string;
    inPerson: string;
    teleconsultation: string;
    confirmBtn: string;
    deleteTitle: string;
    deleteMsgPrefix: string;
    deleteMsgOn: string;
    deleteConfirmBtn: string;
  };
  caretakers: {
    subtitle: string;
    addBtn: string;
    emptyTitle: string;
    emptyDesc: string;
    assignedShift: string;
    lastCheckIn: string;
    responsibilitiesLabel: string;
    logCheckInBtn: string;
    editModalTitle: string;
    createModalTitle: string;
    fieldName: string;
    fieldRoleTitle: string;
    fieldPhone: string;
    fieldEmail: string;
    fieldShift: string;
    fieldStatus: string;
    fieldDuties: string;
    shiftMorning: string;
    shiftEvening: string;
    shiftFullDay: string;
    statusOnDuty: string;
    statusOffDuty: string;
    statusOnLeave: string;
    deleteTitle: string;
    deleteMsgPrefix: string;
    deleteMsgSuffix: string;
    deleteConfirmBtn: string;
  };
  notifications: {
    subtitle: string;
    testAlertBtn: string;
    markAllReadBtn: string;
    filterAll: string;
    filterUnread: string;
    filterMissed: string;
    filterLowStock: string;
    filterAppointments: string;
    emptyTitle: string;
    emptyDesc: string;
    unreadTag: string;
    reviewBtn: string;
    markReadBtn: string;
    deleteAria: string;
  };
  prescriptions: {
    subtitle: string;
    uploadBtn: string;
    emptyTitle: string;
    emptyDesc: string;
    issuedPrefix: string;
    pdfDocLabel: string;
    medicinesLabel: string;
    viewDocBtn: string;
    uploadModalTitle: string;
    uploadModalSubtitle: string;
    fieldTitle: string;
    fieldDoctor: string;
    fieldIssueDate: string;
    fieldClinic: string;
    fieldLinkedMeds: string;
    fieldFile: string;
    chooseFilePrefix: string;
    fieldNotes: string;
    saveBtn: string;
    previewDefaultTitle: string;
    downloadPdfBtn: string;
    notesLabel: string;
    deleteTitle: string;
    deleteMsgPrefix: string;
    deleteMsgSuffix: string;
    deleteConfirmBtn: string;
    savingBtn: string;
    localFileBadge: string;
    attachmentMissing: string;
    duplicateRecordError: string;
    duplicateFileReusedInfo: string;
    indexedDbUnavailableError: string;
    indexedDbQuotaError: string;
    indexedDbSaveError: string;
    migrationPartialWarning: string;
  };
  settings: {
    subtitle: string;
    langVoiceTitle: string;
    englishTitle: string;
    englishDesc: string;
    kannadaTitle: string;
    kannadaDesc: string;
    testVoiceBtn: string;
    readabilityTitle: string;
    textSizeLabel: string;
    scaleStandard: string;
    scaleLarge: string;
    scaleXlarge: string;
    highContrastTitle: string;
    highContrastDesc: string;
    demoControlsTitle: string;
    demoControlsDesc: string;
  };
  auth: {
    loginSubtitle: string;
    newAccountRegister: string;
    signInEmailHeading: string;
    emailLabel: string;
    passwordDemoLabel: string;
    signInBtn: string;
    quickRoleHeading: string;
    activeSessionLabel: string;
    roleFamilyTitle: string;
    roleFamilyDesc: string;
    roleCaretakerTitle: string;
    roleCaretakerDesc: string;
    roleElderlyTitle: string;
    roleElderlyDesc: string;
    errLoginEmpty: string;
    errLoginNotFound: string;
    registerSubtitle: string;
    alreadyRegistered: string;
    registerHeading: string;
    fullName: string;
    phone: string;
    selectRole: string;
    password: string;
    createEnterBtn: string;
    registeredUsersHeading: string;
    errRegisterIncomplete: string;
    authSubtitle: string;
    tabSignIn: string;
    tabCreateAccount: string;
    signInDashboardBtn: string;
    mobileLabel: string;
    careRoleLabel: string;
    createPasswordLabel: string;
    registerDemoBtn: string;
    quickSwitchHeading: string;
    currentlyActive: string;
    signInAsElderly: string;
    signInAsFamily: string;
    signInAsCaretaker: string;
    registeredAccountsHeading: string;
    errRegRequired: string;
  };
  status: {
    taken: string;
    pending: string;
    missed: string;
    skipped: string;
    lowStock: string;
    adequateStock: string;
  };
  roles: {
    elderly: string;
    family: string;
    caretaker: string;
  };
  voice: {
    title: string;
    subtitle: string;
    listening: string;
    speakPrompt: string;
    startListening: string;
    stopListening: string;
    readSchedule: string;
    checkMissed: string;
    nextAppointment: string;
    openSos: string;
    heardPrefix: string;
    spokenSummary: string;
    replayAudio: string;
    unavailableTranscript: string;
    unclearTranscript: string;
  };
  sos: {
    title: string;
    subtitle: string;
    callAmbulance: string;
    callFamily: string;
    callCaretaker: string;
    sendAlert: string;
    alertSent: string;
    patientSummary: string;
    demoCall108: string;
    demoCallPrefix: string;
  };
}

export const TRANSLATIONS: Record<Language, TranslationDictionary> = {
  en: {
    appName: 'ElderlyCare',
    demoNotice: 'Demonstration Mode · Sample Patient Profile & Demo Records (No Real Patient Data)',
    common: {
      brandTagline: 'Smart Voice Reminder',
      yearsShort: 'yrs',
      openMenu: 'Open navigation menu',
      closeMenu: 'Close navigation menu',
      languageSwitcher: 'Language switcher',
      toggleLanguage: 'Toggle language',
      primaryNav: 'Primary Navigation',
      closeModal: 'Close modal',
      dismissNotification: 'Dismiss notification',
      footerTitle: 'ElderlyCare – Smart Voice Medication Reminder & Care Platform',
      footerNote: 'Demonstration Platform · Sample Patient Records Only',
      readOnlyNotice: 'View-Only / Patient Mode',
      permissionDenied:
        'Permission required: Only authorized family coordinators or caretakers can modify care records.',
      careCirclePermissionDenied:
        'Permission required: Only family coordinators with schedule-edit permissions can update Care Circle members.',
      switchAccountBtn: 'Switch Role',
      ageLabel: 'Age',
      bloodGroupLabel: 'Blood Group',
      allergiesLabel: 'Allergies',
      conditionsLabel: 'Conditions',
      activeMedsLabel: 'Active Medications',
      addressLabel: 'Address',
      weekdays: {
        Sun: 'Sun',
        Mon: 'Mon',
        Tue: 'Tue',
        Wed: 'Wed',
        Thu: 'Thu',
        Fri: 'Fri',
        Sat: 'Sat',
      },
      todayWord: 'Today',
      weekShort: 'Wk',
      onlineLabel: 'Online',
      offlineLabel: 'Offline',
      offlineBannerTitle: 'Offline Mode — Local Care Data Active',
      offlineBannerBody:
        'Internet is unavailable. Cached screens and your saved medication schedules remain accessible.',
      installApp: 'Install App',
      installOnIos: 'Install on iOS',
      iosInstallTitle: 'Install ElderlyCare on iPhone / iPad',
      iosInstallStep1: '1. Tap the Share button in the Safari toolbar.',
      iosInstallStep2: '2. Scroll down and tap Add to Home Screen.',
      storageQuotaError:
        'Device local storage is full. Please delete unused attachments or free browser storage space.',
      storageReadWarning:
        'Saved local data could not be read cleanly. Existing records were left untouched.',
      pendingChangesLabel: 'local change(s) pending',
      pendingChangesTooltip:
        'These changes are saved locally on this device. No backend is connected yet — they will not sync automatically.',
      pendingChangesClearedNote:
        'Back online. Your local changes are saved on this device. No backend sync has occurred.',
    },
    nav: {
      dashboard: 'Family Dashboard',
      profile: 'Elderly Profile',
      medications: 'Medication Management',
      schedule: 'Medication Schedule',
      reminders: 'Smart Voice Reminder',
      speaker: 'Simulated Speaker Dashboard',
      history: 'Reminder History',
      adherence: 'Medication Analytics',
      catalogue: 'Medicine Catalogue',
      appointments: 'Appointment Management',
      family: 'Family Members',
      caretakers: 'Caretaker Management',
      notifications: 'Family Notifications',
      prescriptions: 'Prescriptions',
      settings: 'Language Settings',
      login: 'Login',
      register: 'Registration',
      auth: 'Account Switch',
    },
    navGroups: {
      careOverview: 'Remote Family Care',
      medicationSuite: 'Voice & Medications',
      careNetwork: 'Care Circle & Visits',
      system: 'Account & Language',
    },
    actions: {
      save: 'Save Changes',
      cancel: 'Cancel',
      add: 'Add New',
      edit: 'Edit',
      delete: 'Delete',
      markTaken: 'Mark Taken',
      markMissed: 'Mark Missed',
      restock: 'Restock +15',
      voiceAssistant: 'Voice Assistant',
      emergencySos: 'Emergency SOS',
      signOut: 'Switch / Sign Out',
      signIn: 'Sign In',
      exportCsv: 'Download CSV',
      readAloud: 'Read Schedule Aloud',
      resetDemo: 'Reset Demo Data',
      reset: 'Reset',
    },
    dashboard: {
      welcomePrefix: 'Good Care Day,',
      subtitle: 'Daily medicine summary, scheduled doses, and shared family care updates.',
      dailyCareSummaryAria: 'Daily Care Summary',
      totalMedicines: 'Total Medicines',
      todaysMedicines: "Today's Doses",
      takenMedicines: 'Taken Today',
      missedMedicines: 'Missed Doses',
      upcomingAppointments: 'Upcoming Appointments',
      adherenceChartTitle: '7-Day Medication Adherence',
      recentActivities: 'Recent Care Activities',
      notificationsTitle: 'Priority Alerts & Notifications',
      todaysDoseQueue: "Today's Medication Queue",
      lowStockAlerts: 'Low Stock Watchlist',
      viewAll: 'View all',
      openSmartSpeaker: 'Open Smart Speaker',
      remoteScheduleSync: 'Remote Schedule Sync (Simulated Hub)',
      online: 'Online',
      standby: 'Standby',
      signedInAs: 'Signed in as',
      speakerNoPhoneNote:
        'receives automatic spoken reminders on the simulated home speaker — no smartphone required.',
      remindPrefix: 'Remind',
      remindSuffix: 'Now',
      manageSchedulesRemotely: 'Manage Schedules Remotely',
      lowStockHelper: 'low stock',
      pendingTodayHelper: 'pending today',
      completedHelper: '% completed',
      actionNeeded: 'Action needed',
      onTrack: 'On track',
      noneScheduled: 'None scheduled',
      todaysQueueSubtitle: 'Tap Taken to log a dose and automatically update stock.',
      takenAt: 'Taken at',
      analyticsLink: 'Analytics',
      manageStockLink: 'Manage Stock',
      allStockHealthy: 'All medicine stock levels are currently healthy.',
      tabletsLeft: 'tablets left',
      thresholdLabel: 'Threshold',
      noUpcomingAppointments: 'No upcoming doctor appointments.',
      unreadLabel: 'unread',
      permissionsTitle: 'Caregiver Access Permissions',
      permissionsSummaryCanEdit:
        'Full care management: edit medication schedules, log doses, and trigger speaker alerts.',
      permissionsSummaryViewConfirm:
        'Guided patient/view mode: confirm doses, trigger SOS, and view schedules safely.',
      permissionsManageLink: 'Manage Permissions',
    },
    charts: {
      takenDoses: 'Taken Doses',
      missedDoses: 'Missed Doses',
      pending: 'Pending',
      takenWord: 'taken',
      missedWord: 'missed',
      adherenceTrendAria: 'Medication adherence rate trend',
    },
    medications: {
      subtitle:
        'Add, edit, delete medicines, configure daily timings, and monitor remaining tablet stock.',
      addMedicine: 'Add Medicine',
      editTitlePrefix: 'Edit',
      addModalTitle: 'Add New Medicine',
      modalSubtitle: 'Enter prescription details, daily timings, and tablet stock count.',
      searchPlaceholder: 'Search by medicine name, doctor, or purpose...',
      filterAll: 'All',
      filterLow: 'Low Stock',
      filterOnce: 'Once Daily',
      filterTwice: 'Twice Daily',
      filterThree: 'Three Times Daily',
      filterAsNeeded: 'As Needed',
      emptyTitle: 'No matching medicines found',
      emptyDesc: 'Try clearing your search filter or add a new prescribed medicine.',
      prescribedCare: 'Prescribed Care',
      leftLabel: 'left',
      timingsLabel: 'Timings',
      prescribedByLabel: 'Prescribed By',
      courseDurationLabel: 'Course Duration',
      toWord: 'to',
      refillThresholdLabel: 'Refill Threshold',
      unitsLabel: 'units',
      fieldName: 'Medicine Name',
      fieldDosage: 'Prescribed Dosage',
      fieldFrequency: 'Frequency',
      fieldMeal: 'Meal Instruction',
      fieldTimings: 'Timings (comma separated, e.g. 08:00 AM, 08:00 PM)',
      fieldStartDate: 'Start Date',
      fieldEndDate: 'End Date',
      fieldStock: 'Current Stock',
      fieldThreshold: 'Low Stock Alert At',
      fieldDoctor: 'Prescribing Doctor',
      fieldPurpose: 'Purpose / Condition',
      deleteTitle: 'Delete Medication',
      deleteConfirmBtn: 'Delete Medicine',
      deleteMessagePrefix: 'Are you sure you want to remove',
      deleteMessageSuffix: "from the patient's medication list and today's schedule?",
      errNameRequired: 'Please enter a valid medicine name.',
      errDosageRequired: 'Please enter the prescribed dosage (e.g., 50 mg).',
      errTimingsRequired: 'Please enter at least one timing (e.g., 08:00 AM).',
      errTimingFormat: 'Use valid times such as 08:00 AM, 01:30 PM, or 20:00.',
      errDateRequired: 'Please select both start date and end date.',
      errDateRange: 'End date cannot be earlier than the start date.',
      errStockInvalid: 'Current stock must be 0 or greater.',
      errThresholdInvalid: 'Low stock threshold must be at least 1.',
      freqOnce: 'Once daily',
      freqTwice: 'Twice daily',
      freqThree: 'Three times daily',
      freqAsNeeded: 'As needed',
      mealBefore: 'Before food',
      mealAfter: 'After food',
      mealWater: 'With water',
      mealBedtime: 'Bedtime',
    },
    schedule: {
      subtitle: 'Organized daily timetable grouped by Morning, Afternoon, Evening, and Night.',
      all: 'All',
      morning: 'Morning',
      afternoon: 'Afternoon',
      evening: 'Evening',
      night: 'Night',
      dosesSuffix: 'Doses',
      takenSummary: 'Taken',
      pendingSummary: 'Pending',
      missedSummary: 'Missed',
      totalSummary: 'Total Scheduled',
      ofWord: 'of',
      readPeriodPrefix: 'Read',
      readPeriodSuffix: 'Aloud',
      emptyPeriodPrefix: 'No medicines scheduled for',
      loggedTakenPrefix: 'Logged taken at',
      byWord: 'by',
      noScheduledSpeechPrefix: 'No medicines scheduled for',
    },
    reminders: {
      subtitle:
        'Add, edit, or delete daily/weekly voice reminders, snooze active alerts, and respect muted medicine controls.',
      speakerSimulator: 'Speaker Simulator',
      testChimeVoice: 'Test Chime & Voice Alert',
      addReminder: 'Add Reminder',
      editReminder: 'Edit Reminder',
      deleteReminderTitle: 'Delete Voice Reminder',
      deleteReminderMsg: 'Are you sure you want to delete this scheduled voice reminder?',
      upcomingActiveTitle: 'Active Today’s Dose Reminders',
      upcomingActiveSubtitle:
        'Acknowledge a dose or snooze by 15 minutes. Muted medicines are automatically skipped.',
      allCompletedBanner: 'All active dose reminders for today have been completed or muted.',
      snoozed15Msg: 'Snoozed for 15 minutes',
      overdueAlertMsg: 'Overdue — Family alert active',
      reminderLeadPrefix: 'Reminder',
      reminderLeadSuffix: 'min prior',
      speakOnHub: 'Speak on Hub',
      takeNow: 'Take Now',
      snooze15m: 'Snooze 15m',
      snoozedLabel: 'Snoozed',
      mutedSkipNote: 'Muted in Per-Medicine Toggles (excluded from alerts)',
      customRemindersTitle: 'Daily & Weekly Scheduled Voice Reminders',
      customRemindersSubtitle: 'Custom date-and-time reminders across daily and weekly care routines.',
      noCustomRemindersTitle: 'No voice reminders configured',
      noCustomRemindersDesc: 'Add a daily or weekly reminder to trigger spoken alerts on schedule.',
      perMedTogglesTitle: 'Per-Medicine Reminder Toggles',
      alertsOn: 'Alerts On',
      muted: 'Muted',
      preferencesTitle: 'Reminder & Escalation Preferences',
      leadTimeLabel: 'Advance Reminder Lead Time',
      minutesBeforeSuffix: 'minutes before dose',
      audioChimeToggle: 'Gentle Audio Chime',
      voicePromptToggle: 'Spoken Voice Prompt (EN / KN)',
      escalateMissedToggle: 'Escalate Missed Dose to Family',
      escalationDelayLabel: 'Family Escalation Delay',
      minutesAfterSuffix: 'minutes after scheduled time',
      viewHistoryLink: 'Reminder History',
      triggerMissedAlert: 'Test Missed-Dose Alert',
      fieldTitle: 'Reminder Title',
      fieldMedicine: 'Medicine / Routine',
      fieldDosage: 'Dosage / Detail',
      fieldDate: 'Reminder Date',
      fieldTime: 'Reminder Time (e.g., 08:00 AM)',
      fieldFrequency: 'Repeat Schedule',
      fieldDays: 'Select Days (Weekly)',
      fieldNotes: 'Voice Note / Instructions',
      dailyOption: 'Daily',
      weeklyOption: 'Weekly',
      enabledLabel: 'Active',
      pausedLabel: 'Paused',
      readAloudBtn: 'Broadcast & Log',
      errTitleRequired: 'Please enter a reminder title.',
      errMedicineRequired: 'Please enter a medicine or routine name.',
      errDateRequired: 'Please select a reminder date.',
      errTimeFormat: 'Enter a valid time such as 08:00 AM or 20:00.',
      errDaysRequired: 'Select at least one weekday for weekly reminders.',
    },
    speaker: {
      subtitle:
        'Simulated hands-free home smart speaker — demonstrates spoken reminders and single-button confirmation without a smartphone.',
      viewHistory: 'View Reminder History',
      simulatedBadge: 'Simulated Hardware Interface',
      speakerOnline: 'Speaker Online (Simulated)',
      standbyOffline: 'Standby / Offline (Simulated)',
      offlineWarningBanner:
        'Speaker is currently in Standby / Offline mode. Switch back to Speaker Online to test simulated announcements and voice confirmations.',
      spokenOutputLabel: 'Simulated Spoken Audio Output',
      lastSpokenLabel: 'Last spoken:',
      replayReminder: 'Replay Spoken Reminder',
      volumeLabel: 'Volume',
      repeatLabel: 'Repeat',
      handsFreeHeading: 'Simulated Elderly Hands-Free Speaker Actions',
      btnTookIt: '“I Took It”',
      btnSnooze10: 'Snooze 10m',
      btnNeedHelp: 'Need Help',
      sliderVolumeLabel: 'Speaker Volume',
      voiceLangLabel: 'Speaker Voice Language',
      repeatSelectLabel: 'Repeat Announcement',
      speak1Time: 'Speak 1 time',
      speak2Times: 'Speak 2 times',
      speak3Times: 'Speak 3 times',
      remoteControllerTitle: 'Remote Family Broadcast (Simulated)',
      remoteControllerSubtitle: 'Trigger a simulated spoken reminder on the home speaker for',
      selectDoseLabel: 'Select Scheduled Dose to Announce',
      noPendingDropdown: 'No pending doses remaining',
      voiceLanguageShort: 'Voice Language:',
      announceDoseBtn: 'Announce Dose on Home Speaker',
      customMessageLabel: 'Or Send Custom Spoken Family Message',
      customMessagePlaceholder:
        'e.g., Appa, please drink warm water and take your 8 PM Metformin tablet after dinner.',
      speakCustomBtn: 'Speak Custom Message Now',
      pendingQueueTitle: 'Active Doses Queued for Speaker',
      allConfirmedMsg: 'All active doses for today have been confirmed or muted.',
      speakNowBtn: 'Speak Now',
      mutedTag: 'Muted',
      recentLogsPrefix: 'Recent simulated speaker broadcasts logged:',
      recentLogsSuffix: 'entries',
    },
    history: {
      subtitle:
        'Audit log of every simulated smart speaker voice reminder, spoken script, and elderly person or caretaker confirmation.',
      totalSent: 'Total Voice Reminders Sent',
      viaSpeakerHelper: 'via Simulated Home Speaker',
      confirmedTaken: 'Confirmed Taken',
      verifiedHelper: 'Verified by voice, button, or caretaker',
      escalatedFamily: 'Escalated to Family',
      unansweredHelper: 'Triggered when unanswered',
      searchPlaceholder: 'Search medicine, spoken phrase, or responder...',
      filterAll: 'All',
      filterConfirmed: 'Confirmed Taken',
      filterSnoozed: 'Snoozed 10m',
      filterPending: 'Pending Response',
      filterEscalated: 'Escalated to Family',
      emptyTitle: 'No reminder history records match',
      emptyDesc:
        'Broadcast a reminder from the Simulated Speaker Dashboard or change the status filter.',
      colTimestamp: 'Timestamp',
      colMedicineSlot: 'Medicine & Slot',
      colSpokenScript: 'Spoken Script',
      colOutcomeResponder: 'Outcome & Responder',
      colAudio: 'Audio',
      languageLabel: 'Language:',
      replayBtn: 'Replay',
      channelSpeaker: 'Smart Speaker',
      channelVoiceFallback: 'Voice Call Fallback',
      channelCaretaker: 'Caretaker Alert',
      csvDownloadedToast: 'Reminder history CSV downloaded.',
    },
    adherence: {
      subtitle:
        'Daily and weekly adherence summaries with taken, missed, and pending counts and visual progress charts.',
      dailySummaryTitle: "Today's Daily Summary",
      weeklySummaryTitle: '7-Day Weekly Summary',
      todayTaken: "Today's Taken Doses",
      todayPending: "Today's Pending Doses",
      todayMissed: "Today's Missed Doses",
      todayRate: "Today's Completion",
      weeklyRate: '7-Day Adherence Rate',
      weeklyTaken: 'Doses Taken (7 Days)',
      weeklyMissed: 'Missed Doses (7 Days)',
      activeMeds: 'Active Medications',
      targetHelper: 'Target ≥ 90%',
      outOfScheduledPrefix: 'Out of',
      outOfScheduledSuffix: 'scheduled',
      followUpHelper: 'Follow-up recommended when > 0',
      trackedDailyHelper: 'Tracked daily',
      dailyCompletionTitle: 'Daily Dose Completion (Last 7 Days)',
      rateTrendTitle: 'Adherence Rate Trend',
      range7d: '7 Days',
      range4w: '4 Weeks',
      timeOfDayTitle: 'Adherence by Time of Day (Today)',
      perMedicineTitle: 'Per-Medicine Adherence Summary',
      colMedicine: 'Medicine',
      colSchedule: 'Schedule',
      colTodayStatus: 'Today Status',
      colStockLeft: 'Stock Left',
      unitsSuffix: 'units',
      takenWord: 'taken',
      csvDownloadedToast: 'Adherence CSV report downloaded.',
    },
    catalogue: {
      title: 'Medicine Information Catalogue',
      subtitle:
        'Verified medicine reference organized by category and dosage form (separate from patient prescriptions).',
      disclaimerTitle: 'Verified Reference Information Only',
      disclaimerBody:
        'Summaries are sourced from public clinical drug monographs (MedlinePlus NIH, WHO Essential Medicines, DailyMed, BNF). This catalogue does not replace a doctor’s prescription or provide personalized dosage advice.',
      searchPlaceholder: 'Search by brand or generic medicine name...',
      categoryAll: 'All Categories',
      formAll: 'All Forms',
      formTablet: 'Tablet',
      formCapsule: 'Capsule',
      formSyrup: 'Syrup',
      formDrops: 'Drops',
      genericLabel: 'Generic Name',
      categoryLabel: 'Category',
      formLabel: 'Dosage Form',
      strengthsLabel: 'Common Reference Strengths',
      precautionsLabel: 'General Precautions',
      storageLabel: 'Storage Guidance',
      sourceLabel: 'Verified Source',
      emptyTitle: 'No catalogue entries match your filters',
      emptyDesc: 'Try searching another generic name or resetting the category/form filter.',
    },
    family: {
      subtitle:
        'Shared family caregiver dashboard keeping relatives and caretakers informed with clear access permissions.',
      addMember: 'Add Family Member',
      sharedStatusPrefix: 'Shared Care Circle Status',
      sharedSyncActive: 'Shared Sync Active',
      subscribedSuffix: 'family members subscribed to missed-dose alerts',
      emergencyContact: 'Emergency Contact',
      standardContact: 'Standard Contact',
      receivesAlerts: 'Receives Missed Alerts',
      alertsOff: 'Alerts Off',
      canEditSchedule: 'Can Edit Schedule',
      viewOnly: 'View Only',
      notesTitle: 'Shared Family & Caretaker Notes',
      notesSubtitle:
        'Post updates about meals, pharmacy refills, or comfort for everyone in the care circle.',
      notePlaceholder: 'Write a care update (e.g., Pharmacy refill delivered)...',
      postNoteBtn: 'Post Care Update',
      permissionsCardTitle: 'Access Permissions Overview',
      permissionsCardDesc:
        'Role-based controls define which family members can modify medication schedules vs receive alerts only.',
      fieldName: 'Full Name',
      fieldRelationship: 'Relationship',
      fieldPhone: 'Phone Number',
      fieldEmail: 'Email',
      fieldLocation: 'Location / Proximity',
      deleteConfirmMsg: 'Remove from Family Care Circle?',
    },
    profile: {
      subtitle:
        'Comprehensive elderly patient health record, chronic conditions, allergies, and daily vital signs.',
      editProfileBtn: 'Edit Profile',
      updateHeading: 'Update Elderly Patient Details',
      fullName: 'Full Name',
      age: 'Age',
      bloodGroup: 'Blood Group',
      phone: 'Phone Number',
      primaryPhysician: 'Primary Physician',
      city: 'City / Region',
      allergiesInput: 'Allergies (comma separated)',
      conditionsInput: 'Chronic Conditions (comma separated)',
      dietaryNotes: 'Dietary Notes',
      mobilityNotes: 'Mobility Notes',
      residentialAddress: 'Residential Address',
      knownAllergies: 'Known Allergies',
      noneRecorded: 'None recorded',
      managedConditions: 'Managed Conditions',
      careGuidanceTitle: 'Daily Care & Dietary Guidance',
      dietaryInstructions: 'Dietary Instructions',
      mobilityExercise: 'Mobility & Exercise',
      vitalsLogTitle: 'Recent Vital Signs Log',
      logVitalsBtn: 'Log Vitals',
      colDateTime: 'Date & Time',
      colBp: 'Blood Pressure',
      colSugar: 'Blood Sugar',
      colHeartRate: 'Heart Rate',
      colLoggedBy: 'Logged By',
      recordVitalsTitle: 'Record Vital Signs',
      bpmSuffix: 'bpm',
      saveVitalsBtn: 'Save Vitals',
    },
    appointments: {
      subtitle:
        'Schedule, edit, complete, or cancel in-person clinic visits and family teleconsultations.',
      scheduleBtn: 'Schedule Appointment',
      filterAll: 'All',
      filterScheduled: 'Scheduled',
      filterCompleted: 'Completed',
      filterCancelled: 'Cancelled',
      emptyTitle: 'No appointments match this filter',
      emptyDesc: 'Schedule a new doctor visit or switch the status filter above.',
      purposeLabel: 'Purpose:',
      noteLabel: 'Note:',
      markCompleted: 'Mark Completed',
      cancelVisit: 'Cancel Visit',
      editModalTitle: 'Edit Doctor Appointment',
      createModalTitle: 'Schedule Doctor Appointment',
      fieldDoctor: 'Doctor Name',
      fieldSpecialty: 'Specialty',
      fieldClinic: 'Clinic / Hospital',
      fieldDate: 'Date',
      fieldTime: 'Time',
      fieldVisitType: 'Visit Type',
      fieldPurpose: 'Purpose of Visit',
      fieldNotes: 'Preparation Notes',
      inPerson: 'In-Person',
      teleconsultation: 'Teleconsultation',
      confirmBtn: 'Confirm Appointment',
      deleteTitle: 'Delete Appointment',
      deleteMsgPrefix: 'Remove the appointment with',
      deleteMsgOn: 'on',
      deleteConfirmBtn: 'Delete Appointment',
    },
    caretakers: {
      subtitle:
        'Manage home nurses and caretakers, daily shift schedules, assigned duties, and check-in logs.',
      addBtn: 'Add Caretaker',
      emptyTitle: 'No caretakers assigned',
      emptyDesc: 'Add a home care nurse or aide to coordinate daily medicine administration.',
      assignedShift: 'Assigned Shift',
      lastCheckIn: 'Last Check-In',
      responsibilitiesLabel: 'Care Responsibilities',
      logCheckInBtn: 'Log Shift Check-In',
      editModalTitle: 'Edit Caretaker',
      createModalTitle: 'Add New Caretaker',
      fieldName: 'Full Name',
      fieldRoleTitle: 'Role Title',
      fieldPhone: 'Phone',
      fieldEmail: 'Email',
      fieldShift: 'Shift Schedule',
      fieldStatus: 'Current Status',
      fieldDuties: 'Responsibilities (comma separated)',
      shiftMorning: 'Morning (7 AM - 2 PM)',
      shiftEvening: 'Evening (2 PM - 9 PM)',
      shiftFullDay: 'Full-Day Live-In',
      statusOnDuty: 'On Duty',
      statusOffDuty: 'Off Duty',
      statusOnLeave: 'On Leave',
      deleteTitle: 'Remove Caretaker',
      deleteMsgPrefix: 'Remove',
      deleteMsgSuffix: 'from assigned caretakers?',
      deleteConfirmBtn: 'Remove Caretaker',
    },
    notifications: {
      subtitle:
        'Missed medication alerts, low tablet stock warnings, upcoming appointment notices, and emergency SOS logs.',
      testAlertBtn: 'Test Missed-Dose Alert',
      markAllReadBtn: 'Mark All Read',
      filterAll: 'All',
      filterUnread: 'Unread',
      filterMissed: 'Missed Doses',
      filterLowStock: 'Low Stock',
      filterAppointments: 'Appointments',
      emptyTitle: 'No notifications in this view',
      emptyDesc:
        'You are all caught up. Missed dose alerts and stock warnings will appear here automatically.',
      unreadTag: '· Unread',
      reviewBtn: 'Review',
      markReadBtn: 'Mark Read',
      deleteAria: 'Delete notification',
    },
    prescriptions: {
      subtitle: 'Upload, organize, and preview doctor prescriptions linked to active medications.',
      uploadBtn: 'Upload Prescription',
      emptyTitle: 'No prescriptions uploaded yet',
      emptyDesc:
        "Upload an image or PDF scan of the doctor's prescription for quick family and pharmacy access.",
      issuedPrefix: 'Issued',
      pdfDocLabel: 'PDF Document',
      medicinesLabel: 'Medicines:',
      viewDocBtn: 'View Document',
      uploadModalTitle: 'Upload Doctor Prescription',
      uploadModalSubtitle:
        'Attach a prescription image or PDF from your device, or use the sample clinic scan.',
      fieldTitle: 'Prescription Title',
      fieldDoctor: 'Doctor Name',
      fieldIssueDate: 'Issue Date',
      fieldClinic: 'Clinic / Hospital',
      fieldLinkedMeds: 'Linked Medicines (comma separated)',
      fieldFile: 'Prescription File (Image or PDF)',
      chooseFilePrefix: 'Choose File',
      fieldNotes: 'Pharmacist / Care Notes',
      saveBtn: 'Save Prescription',
      previewDefaultTitle: 'Prescription Preview',
      downloadPdfBtn: 'Download PDF',
      notesLabel: 'Notes:',
      deleteTitle: 'Delete Prescription',
      deleteMsgPrefix: 'Remove',
      deleteMsgSuffix: 'from saved prescriptions?',
      deleteConfirmBtn: 'Delete Prescription',
      savingBtn: 'Saving...',
      localFileBadge: 'IndexedDB Offline File',
      attachmentMissing: 'Attached file could not be loaded from local IndexedDB storage.',
      duplicateRecordError:
        'A prescription with this same title, issue date, and attached file already exists.',
      duplicateFileReusedInfo:
        'Identical file already saved locally — reused existing attachment without duplicating storage.',
      indexedDbUnavailableError:
        'Local IndexedDB storage is unavailable or blocked in this browser. Could not save large attachment.',
      indexedDbQuotaError:
        'Insufficient device storage for this attachment. Choose a smaller file or remove older prescriptions.',
      indexedDbSaveError: 'Could not save the prescription attachment to local IndexedDB storage.',
      migrationPartialWarning:
        'Some older prescription attachments could not be migrated to IndexedDB; original records were preserved.',
    },
    settings: {
      subtitle:
        'Customize language (English / Kannada), large readable text sizes for elderly comfort, contrast, and demonstration data.',
      langVoiceTitle: 'Language & Voice Support',
      englishTitle: 'English',
      englishDesc: 'Standard English UI & Voice',
      kannadaTitle: 'ಕನ್ನಡ (Kannada)',
      kannadaDesc: 'Bilingual Care Interface & Voice',
      testVoiceBtn: 'Test Voice Playback',
      readabilityTitle: 'Elderly Readability & Contrast',
      textSizeLabel: 'Text Size Scale',
      scaleStandard: 'Standard (16px)',
      scaleLarge: 'Large (18px)',
      scaleXlarge: 'Extra Large (20px)',
      highContrastTitle: 'High-Contrast Borders',
      highContrastDesc: 'Strengthens card outlines and pure white canvas for low-vision clarity.',
      demoControlsTitle: 'Demonstration Dataset Controls',
      demoControlsDesc:
        'All records shown in this application are fictional demonstration data saved locally in your browser. Reset anytime to restore defaults.',
    },
    auth: {
      loginSubtitle: 'Sign in as a Family Member, Caretaker, or Elderly Person to access ElderlyCare.',
      newAccountRegister: 'New Account? Register',
      signInEmailHeading: 'Sign In with Email',
      emailLabel: 'Email Address',
      passwordDemoLabel: 'Password (Demo)',
      signInBtn: 'Sign In',
      quickRoleHeading: 'One-Click Role Sign-In (Demo)',
      activeSessionLabel: 'Active Session:',
      roleFamilyTitle: '1. Family Member — Ananya Rao',
      roleFamilyDesc: 'Manage elderly schedules remotely & view family alerts',
      roleCaretakerTitle: '2. Caretaker — Karthik Nair, RN',
      roleCaretakerDesc: 'Log administered doses, vitals & daily shift updates',
      roleElderlyTitle: '3. Elderly Person — Sri Ramesh Rao',
      roleElderlyDesc: 'Large-font view & hands-free Simulated Speaker interface',
      errLoginEmpty: 'Please enter both email and password.',
      errLoginNotFound:
        'Account not found in demonstration directory. Select one of the quick role cards or register a new account.',
      registerSubtitle:
        'Create a demonstration account for a Family Member, Caretaker, or Elderly Person.',
      alreadyRegistered: 'Already Registered? Sign In',
      registerHeading: 'Register Care Circle Account',
      fullName: 'Full Name',
      phone: 'Phone Number',
      selectRole: 'Select User Role',
      password: 'Password',
      createEnterBtn: 'Create Account & Enter Dashboard',
      registeredUsersHeading: 'Registered Demo Users',
      errRegisterIncomplete:
        'Please complete all fields (minimum 4-character password for demo registration).',
      authSubtitle:
        'Sign in with a demonstration role, switch between Elderly Patient / Family / Caretaker views, or register a new care circle account.',
      tabSignIn: 'Sign In',
      tabCreateAccount: 'Create Account',
      signInDashboardBtn: 'Sign In to Care Dashboard',
      mobileLabel: 'Mobile Number',
      careRoleLabel: 'Care Circle Role',
      createPasswordLabel: 'Create Password',
      registerDemoBtn: 'Register Demo Account',
      quickSwitchHeading: 'Quick Demo Role Switch',
      currentlyActive: 'Currently active:',
      signInAsElderly: 'Sign in as Elderly Patient',
      signInAsFamily: 'Sign in as Family Member',
      signInAsCaretaker: 'Sign in as Caretaker / Nurse',
      registeredAccountsHeading: 'Registered Demo Accounts',
      errRegRequired: 'Please fill in all required registration fields.',
    },
    status: {
      taken: 'Taken',
      pending: 'Pending',
      missed: 'Missed',
      skipped: 'Skipped',
      lowStock: 'Low Stock',
      adequateStock: 'In Stock',
    },
    roles: {
      elderly: 'Elderly Patient',
      family: 'Family Member',
      caretaker: 'Caretaker / Nurse',
    },
    voice: {
      title: 'Care Voice Assistant',
      subtitle: 'Hear your medicine schedule aloud or speak a command in English or Kannada.',
      listening: 'Listening for your voice command...',
      speakPrompt: 'Tap a quick prompt below or use your microphone to ask about medicines.',
      startListening: 'Start Voice Command',
      stopListening: 'Stop Listening',
      readSchedule: "Read Today's Medicines",
      checkMissed: 'Check Missed Doses',
      nextAppointment: 'Next Doctor Appointment',
      openSos: 'Open Emergency SOS',
      heardPrefix: 'Heard:',
      spokenSummary: 'Spoken Summary',
      replayAudio: 'Replay Audio',
      unavailableTranscript:
        'Browser speech recognition unavailable — use the quick voice buttons below.',
      unclearTranscript: 'Could not hear clearly. You can tap any quick prompt below.',
    },
    sos: {
      title: 'Emergency SOS Assistance',
      subtitle: 'Immediate emergency contacts, critical medical summary, and instant family alert.',
      callAmbulance: 'Call Emergency Ambulance (108)',
      callFamily: 'Call Primary Family Contact',
      callCaretaker: 'Call Assigned Caretaker',
      sendAlert: 'Send Urgent SOS Alert to Care Circle',
      alertSent: 'Urgent SOS alert dispatched to family members and caretaker.',
      patientSummary: 'Critical Medical Summary for Responders',
      demoCall108: 'Demo Call Triggered: Dialing Emergency Ambulance 108',
      demoCallPrefix: 'Demo Call Triggered: Dialing',
    },
  },
  kn: {
    appName: 'ElderlyCare',
    demoNotice: 'ಪ್ರದರ್ಶನ ಡೇಟಾ · ಮಾದರಿ ರೋಗಿ ವಿವರಗಳು (ನಿಜವಾದ ರೋಗಿ ಮಾಹಿತಿ ಅಲ್ಲ)',
    common: {
      brandTagline: 'ಸ್ಮಾರ್ಟ್ ಧ್ವನಿ ಜ್ಞಾಪನೆ',
      yearsShort: 'ವರ್ಷ',
      openMenu: 'ನ್ಯಾವಿಗೇಷನ್ ಮೆನು ತೆರೆಯಿರಿ',
      closeMenu: 'ನ್ಯಾವಿಗೇಷನ್ ಮೆನು ಮುಚ್ಚಿ',
      languageSwitcher: 'ಭಾಷೆ ಆಯ್ಕೆ',
      toggleLanguage: 'ಭಾಷೆ ಬದಲಾಯಿಸಿ',
      primaryNav: 'ಮುಖ್ಯ ನ್ಯಾವಿಗೇಷನ್',
      closeModal: 'ವಿಂಡೋ ಮುಚ್ಚಿ',
      dismissNotification: 'ಸೂಚನೆ ಮುಚ್ಚಿ',
      footerTitle: 'ElderlyCare – ಸ್ಮಾರ್ಟ್ ಧ್ವನಿ ಔಷಧಿ ಜ್ಞಾಪನೆ ಮತ್ತು ಆರೈಕೆ ವೇದಿಕೆ',
      footerNote: 'ಪ್ರದರ್ಶನ ವೇದಿಕೆ · ಮಾದರಿ ರೋಗಿ ದಾಖಲೆಗಳು ಮಾತ್ರ',
      readOnlyNotice: 'ವೀಕ್ಷಣೆ / ರೋಗಿ ಮೋಡ್',
      permissionDenied:
        'ಅನುಮತಿ ಅಗತ್ಯವಿದೆ: ಅಧಿಕೃತ ಕುಟುಂಬ ಸದಸ್ಯರು ಅಥವಾ ಆರೈಕೆದಾರರು ಮಾತ್ರ ಆರೈಕೆ ದಾಖಲೆಗಳನ್ನು ಬದಲಾಯಿಸಬಹುದು.',
      careCirclePermissionDenied:
        'ಅನುಮತಿ ಅಗತ್ಯವಿದೆ: ವೇಳಾಪಟ್ಟಿ ತಿದ್ದುಪಡಿ ಅನುಮತಿಯಿರುವ ಕುಟುಂಬ ಸದಸ್ಯರು ಮಾತ್ರ ಆರೈಕೆ ವೃಂದವನ್ನು ಬದಲಾಯಿಸಬಹುದು.',
      switchAccountBtn: 'ಖಾತೆ ಬದಲಿಸಿ',
      ageLabel: 'ವಯಸ್ಸು',
      bloodGroupLabel: 'ರಕ್ತದ ಗುಂಪು',
      allergiesLabel: 'ಅಲರ್ಜಿಗಳು',
      conditionsLabel: 'ಆರೋಗ್ಯ ಸ್ಥಿತಿಗಳು',
      activeMedsLabel: 'ಸಕ್ರಿಯ ಔಷಧಿಗಳು',
      addressLabel: 'ವಿಳಾಸ',
      weekdays: {
        Sun: 'ಭಾನು',
        Mon: 'ಸೋಮ',
        Tue: 'ಮಂಗಳ',
        Wed: 'ಬುಧ',
        Thu: 'ಗುರು',
        Fri: 'ಶುಕ್ರ',
        Sat: 'ಶನಿ',
      },
      todayWord: 'ಇಂದು',
      weekShort: 'ವಾರ',
      onlineLabel: 'ಆನ್‌ಲೈನ್',
      offlineLabel: 'ಆಫ್‌ಲೈನ್',
      offlineBannerTitle: 'ಆಫ್‌ಲೈನ್ ಮೋಡ್ — ಸ್ಥಳೀಯ ಆರೈಕೆ ಡೇಟಾ ಸಕ್ರಿಯವಾಗಿದೆ',
      offlineBannerBody:
        'ಇಂಟರ್ನೆಟ್ ಸಂಪರ್ಕವಿಲ್ಲ. ಕ್ಯಾಶ್ ಮಾಡಿದ ಪುಟಗಳು ಮತ್ತು ಉಳಿಸಿದ ಔಷಧಿ ವೇಳಾಪಟ್ಟಿಗಳು ಲಭ್ಯವಿವೆ.',
      installApp: 'ಆ್ಯಪ್ ಇನ್‌ಸ್ಟಾಲ್ ಮಾಡಿ',
      installOnIos: 'iOS ನಲ್ಲಿ ಇನ್‌ಸ್ಟಾಲ್ ಮಾಡಿ',
      iosInstallTitle: 'iPhone / iPad ನಲ್ಲಿ ElderlyCare ಇನ್‌ಸ್ಟಾಲ್ ಮಾಡಿ',
      iosInstallStep1: '1. Safari ಟೂಲ್‌ಬಾರ್‌ನಲ್ಲಿರುವ ಹಂಚಿಕೆ (Share) ಬಟನ್ ಟ್ಯಾಪ್ ಮಾಡಿ.',
      iosInstallStep2: '2. ಕೆಳಗೆ ಸ್ಕ್ರಾಲ್ ಮಾಡಿ "Add to Home Screen" ಟ್ಯಾಪ್ ಮಾಡಿ.',
      storageQuotaError:
        'ಸಾಧನದ ಸ್ಥಳೀಯ ಸಂಗ್ರಹಣೆ ತುಂಬಿದೆ. ದಯವಿಟ್ಟು ಬಳಸದ ಕಡತಗಳನ್ನು ಅಳಿಸಿ ಅಥವಾ ಬ್ರೌಸರ್ ಸಂಗ್ರಹಣೆಯನ್ನು ಖಾಲಿ ಮಾಡಿ.',
      storageReadWarning:
        'ಉಳಿಸಿದ ಸ್ಥಳೀಯ ಡೇಟಾವನ್ನು ಓದಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ಅಸ್ತಿತ್ವದಲ್ಲಿರುವ ದಾಖಲೆಗಳನ್ನು ಹಾಗೆಯೇ ಉಳಿಸಲಾಗಿದೆ.',
      pendingChangesLabel: 'ಸ್ಥಳೀಯ ಬದಲಾವಣೆ(ಗಳು) ಬಾಕಿಯಿದೆ',
      pendingChangesTooltip:
        'ಈ ಬದಲಾವಣೆಗಳನ್ನು ಈ ಸಾಧನದಲ್ಲಿ ಸ್ಥಳೀಯವಾಗಿ ಉಳಿಸಲಾಗಿದೆ. ಯಾವುದೇ ಬ್ಯಾಕ್‌ಎಂಡ್ ಸಂಪರ್ಕಿಸಿಲ್ಲ — ಸ್ವಯಂಚಾಲಿತ ಸಿಂಕ್ ಆಗುವುದಿಲ್ಲ.',
      pendingChangesClearedNote:
        'ಆನ್‌ಲೈನ್ ಆಗಿದೆ. ನಿಮ್ಮ ಸ್ಥಳೀಯ ಬದಲಾವಣೆಗಳನ್ನು ಈ ಸಾಧನದಲ್ಲಿ ಉಳಿಸಲಾಗಿದೆ. ಯಾವುದೇ ಬ್ಯಾಕ್‌ಎಂಡ್ ಸಿಂಕ್ ಆಗಿಲ್ಲ.',
    },
    nav: {
      dashboard: 'ಕುಟುಂಬ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
      profile: 'ಹಿರಿಯರ ವಿವರ',
      medications: 'ಔಷಧಿ ನಿರ್ವಹಣೆ',
      schedule: 'ಔಷಧಿ ವೇಳಾಪಟ್ಟಿ',
      reminders: 'ಸ್ಮಾರ್ಟ್ ಧ್ವನಿ ಜ್ಞಾಪನೆ',
      speaker: 'ಸಿಮ್ಯುಲೇಟೆಡ್ ಸ್ಪೀಕರ್ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
      history: 'ಜ್ಞಾಪನೆ ಇತಿಹಾಸ',
      adherence: 'ಔಷಧಿ ವಿಶ್ಲೇಷಣೆ',
      catalogue: 'ಔಷಧಿ ಮಾಹಿತಿ ಕೋಶ',
      appointments: 'ವೈದ್ಯರ ಭೇಟಿ ನಿರ್ವಹಣೆ',
      family: 'ಕುಟುಂಬ ಸದಸ್ಯರು',
      caretakers: 'ಆರೈಕೆದಾರರ ನಿರ್ವಹಣೆ',
      notifications: 'ಕುಟುಂಬ ಸೂಚನೆಗಳು',
      prescriptions: 'ಔಷಧ ಚೀಟಿಗಳು',
      settings: 'ಭಾಷಾ ಸೆಟ್ಟಿಂಗ್‌ಗಳು',
      login: 'ಲಾಗಿನ್',
      register: 'ನೋಂದಣಿ',
      auth: 'ಖಾತೆ ಬದಲಿಸಿ',
    },
    navGroups: {
      careOverview: 'ದೂರಸ್ಥ ಕುಟುಂಬ ಆರೈಕೆ',
      medicationSuite: 'ಧ್ವನಿ ಮತ್ತು ಔಷಧಿ ವಿಭಾಗ',
      careNetwork: 'ಕುಟುಂಬ ಮತ್ತು ಭೇಟಿಗಳು',
      system: 'ಖಾತೆ ಮತ್ತು ಭಾಷೆ',
    },
    actions: {
      save: 'ಉಳಿಸಿ',
      cancel: 'ರದ್ದುಮಾಡಿ',
      add: 'ಹೊಸದು ಸೇರಿಸಿ',
      edit: 'ತಿದ್ದುಪಡಿ',
      delete: 'ಅಳಿಸಿ',
      markTaken: 'ತೆಗೆದುಕೊಂಡಿದ್ದೇನೆ',
      markMissed: 'ತಪ್ಪಿದೆ',
      restock: 'ಮರುಪೂರಣ +15',
      voiceAssistant: 'ಧ್ವನಿ ಸಹಾಯಕ',
      emergencySos: 'ತುರ್ತು SOS',
      signOut: 'ಖಾತೆ ಬದಲಿಸಿ',
      signIn: 'ಲಾಗಿನ್ ಆಗಿ',
      exportCsv: 'CSV ಡೌನ್‌ಲೋಡ್',
      readAloud: 'ವೇಳಾಪಟ್ಟಿ ಓದಿ ಹೇಳಿ',
      resetDemo: 'ಡೇಟಾ ಮರುಹೊಂದಿಸಿ',
      reset: 'ಮರುಹೊಂದಿಸಿ',
    },
    dashboard: {
      welcomePrefix: 'ಶುಭ ಆರೈಕೆ ದಿನ,',
      subtitle: 'ದೈನಂದಿನ ಔಷಧಿ ಸಾರಾಂಶ, ವೇಳಾಪಟ್ಟಿ ಮತ್ತು ಕುಟುಂಬದ ಆರೈಕೆ ಮಾಹಿತಿ.',
      dailyCareSummaryAria: 'ದೈನಂದಿನ ಆರೈಕೆ ಸಾರಾಂಶ',
      totalMedicines: 'ಒಟ್ಟು ಔಷಧಿಗಳು',
      todaysMedicines: 'ಇಂದಿನ ಔಷಧಿಗಳು',
      takenMedicines: 'ತೆಗೆದುಕೊಂಡ ಔಷಧಿಗಳು',
      missedMedicines: 'ತಪ್ಪಿದ ಔಷಧಿಗಳು',
      upcomingAppointments: 'ಮುಂದಿನ ವೈದ್ಯರ ಭೇಟಿ',
      adherenceChartTitle: '7-ದಿನಗಳ ಔಷಧಿ ಪಾಲನೆ',
      recentActivities: 'ಇತ್ತೀಚಿನ ಚಟುವಟಿಕೆಗಳು',
      notificationsTitle: 'ಮುಖ್ಯ ಸೂಚನೆಗಳು ಮತ್ತು ಎಚ್ಚರಿಕೆಗಳು',
      todaysDoseQueue: 'ಇಂದಿನ ಔಷಧಿ ಪಟ್ಟಿ',
      lowStockAlerts: 'ಕಡಿಮೆ ದಾಸ್ತಾನು ಎಚ್ಚರಿಕೆ',
      viewAll: 'ಎಲ್ಲಾ ನೋಡಿ',
      openSmartSpeaker: 'ಸ್ಮಾರ್ಟ್ ಸ್ಪೀಕರ್ ತೆರೆಯಿರಿ',
      remoteScheduleSync: 'ದೂರಸ್ಥ ವೇಳಾಪಟ್ಟಿ ಸಿಂಕ್ (ಸಿಮ್ಯುಲೇಟೆಡ್)',
      online: 'ಆನ್‌ಲೈನ್',
      standby: 'ಸ್ಟ್ಯಾಂಡ್‌ಬೈ',
      signedInAs: 'ಸಕ್ರಿಯ ಪಾತ್ರ:',
      speakerNoPhoneNote:
        'ಅವರಿಗೆ ಸಿಮ್ಯುಲೇಟೆಡ್ ಮನೆಯ ಸ್ಪೀಕರ್‌ನಲ್ಲಿ ಸ್ವಯಂಚಾಲಿತ ಧ್ವನಿ ಜ್ಞಾಪನೆಗಳು ಬರುತ್ತವೆ — ಸ್ಮಾರ್ಟ್‌ಫೋನ್ ಅಗತ್ಯವಿಲ್ಲ.',
      remindPrefix: 'ಈಗ ಜ್ಞಾಪಿಸಿ:',
      remindSuffix: '',
      manageSchedulesRemotely: 'ವೇಳಾಪಟ್ಟಿ ನಿರ್ವಹಿಸಿ',
      lowStockHelper: 'ಕಡಿಮೆ ದಾಸ್ತಾನು',
      pendingTodayHelper: 'ಇಂದು ಬಾಕಿ',
      completedHelper: '% ಪೂರ್ಣಗೊಂಡಿದೆ',
      actionNeeded: 'ಕ್ರಮ ಅಗತ್ಯವಿದೆ',
      onTrack: 'ಸರಿಯಾಗಿದೆ',
      noneScheduled: 'ಯಾವುದೂ ನಿಗದಿಯಾಗಿಲ್ಲ',
      todaysQueueSubtitle: 'ಔಷಧಿ ದಾಖಲಿಸಲು ಮತ್ತು ದಾಸ್ತಾನು ನವೀಕರಿಸಲು ತೆಗೆದುಕೊಂಡಿದ್ದೇನೆ ಒತ್ತಿರಿ.',
      takenAt: 'ತೆಗೆದುಕೊಂಡ ಸಮಯ',
      analyticsLink: 'ವಿಶ್ಲೇಷಣೆ',
      manageStockLink: 'ದಾಸ್ತಾನು ನಿರ್ವಹಿಸಿ',
      allStockHealthy: 'ಎಲ್ಲಾ ಔಷಧಿಗಳ ದಾಸ್ತಾನು ಪ್ರಸ್ತುತ ಸಮರ್ಪಕವಾಗಿದೆ.',
      tabletsLeft: 'ಮಾತ್ರೆಗಳು ಬಾಕಿ',
      thresholdLabel: 'ಕನಿಷ್ಠ ಮಿತಿ',
      noUpcomingAppointments: 'ಮುಂದಿನ ವೈದ್ಯರ ಭೇಟಿಗಳಿಲ್ಲ.',
      unreadLabel: 'ಓದದಿರುವವು',
      permissionsTitle: 'ಆರೈಕೆದಾರರ ಪ್ರವೇಶ ಅನುಮತಿಗಳು',
      permissionsSummaryCanEdit:
        'ಪೂರ್ಣ ನಿರ್ವಹಣೆ: ವೇಳಾಪಟ್ಟಿ ತಿದ್ದುಪಡಿ, ಔಷಧಿ ದಾಖಲೆ ಮತ್ತು ಸ್ಪೀಕರ್ ಜ್ಞಾಪನೆ ಅನುಮತಿ ಇದೆ.',
      permissionsSummaryViewConfirm:
        'ಸುರಕ್ಷಿತ ವೀಕ್ಷಣೆ/ದೃಢೀಕರಣ ಮೋಡ್: ಔಷಧಿ ತೆಗೆದುಕೊಂಡಿರುವುದನ್ನು ದೃಢೀಕರಿಸಬಹುದು ಮತ್ತು SOS ಬಳಸಬಹುದು.',
      permissionsManageLink: 'ಅನುಮತಿಗಳನ್ನು ನಿರ್ವಹಿಸಿ',
    },
    charts: {
      takenDoses: 'ತೆಗೆದುಕೊಂಡ ಔಷಧಿಗಳು',
      missedDoses: 'ತಪ್ಪಿದ ಔಷಧಿಗಳು',
      pending: 'ಬಾಕಿ ಇದೆ',
      takenWord: 'ತೆಗೆದುಕೊಂಡಿದೆ',
      missedWord: 'ತಪ್ಪಿದೆ',
      adherenceTrendAria: 'ಔಷಧಿ ಪಾಲನೆ ದರ ಪ್ರವೃತ್ತಿ',
    },
    medications: {
      subtitle: 'ಔಷಧಿಗಳನ್ನು ಸೇರಿಸಿ, ತಿದ್ದುಪಡಿ ಮಾಡಿ, ಅಳಿಸಿ, ದೈನಂದಿನ ಸಮಯ ಮತ್ತು ದಾಸ್ತಾನು ನಿರ್ವಹಿಸಿ.',
      addMedicine: 'ಔಷಧಿ ಸೇರಿಸಿ',
      editTitlePrefix: 'ತಿದ್ದುಪಡಿ:',
      addModalTitle: 'ಹೊಸ ಔಷಧಿ ಸೇರಿಸಿ',
      modalSubtitle: 'ಔಷಧ ಚೀಟಿ ವಿವರಗಳು, ದೈನಂದಿನ ಸಮಯ ಮತ್ತು ಮಾತ್ರೆ ದಾಸ್ತಾನು ನಮೂದಿಸಿ.',
      searchPlaceholder: 'ಔಷಧಿ ಹೆಸರು, ವೈದ್ಯರು ಅಥವಾ ಉದ್ದೇಶದಿಂದ ಹುಡುಕಿ...',
      filterAll: 'ಎಲ್ಲಾ',
      filterLow: 'ಕಡಿಮೆ ದಾಸ್ತಾನು',
      filterOnce: 'ದಿನಕ್ಕೆ ಒಮ್ಮೆ',
      filterTwice: 'ದಿನಕ್ಕೆ ಎರಡು ಬಾರಿ',
      filterThree: 'ದಿನಕ್ಕೆ ಮೂರು ಬಾರಿ',
      filterAsNeeded: 'ಅಗತ್ಯವಿದ್ದಾಗ',
      emptyTitle: 'ಯಾವುದೇ ಔಷಧಿಗಳು ಕಂಡುಬಂದಿಲ್ಲ',
      emptyDesc: 'ಹುಡುಕಾಟ ಫಿಲ್ಟರ್ ತೆರವುಗೊಳಿಸಿ ಅಥವಾ ಹೊಸ ಔಷಧಿಯನ್ನು ಸೇರಿಸಿ.',
      prescribedCare: 'ನಿಗದಿತ ಆರೈಕೆ',
      leftLabel: 'ಬಾಕಿ',
      timingsLabel: 'ಸಮಯಗಳು',
      prescribedByLabel: 'ಸೂಚಿಸಿದ ವೈದ್ಯರು',
      courseDurationLabel: 'ಅವಧಿ',
      toWord: 'ರಿಂದ',
      refillThresholdLabel: 'ಮರುಪೂರಣ ಮಿತಿ',
      unitsLabel: 'ಘಟಕಗಳು',
      fieldName: 'ಔಷಧಿ ಹೆಸರು',
      fieldDosage: 'ನಿಗದಿತ ಪ್ರಮಾಣ',
      fieldFrequency: 'ಆವರ್ತನ',
      fieldMeal: 'ಆಹಾರ ಸೂಚನೆ',
      fieldTimings: 'ಸಮಯಗಳು (ಕಾಮಾ ಮೂಲಕ ಪ್ರತ್ಯೇಕಿಸಿ, ಉದಾ. 08:00 AM, 08:00 PM)',
      fieldStartDate: 'ಪ್ರಾರಂಭ ದಿನಾಂಕ',
      fieldEndDate: 'ಅಂತಿಮ ದಿನಾಂಕ',
      fieldStock: 'ಪ್ರಸ್ತುತ ದಾಸ್ತಾನು',
      fieldThreshold: 'ಕಡಿಮೆ ದಾಸ್ತಾನು ಎಚ್ಚರಿಕೆ ಮಿತಿ',
      fieldDoctor: 'ವೈದ್ಯರ ಹೆಸರು',
      fieldPurpose: 'ಉದ್ದೇಶ / ಆರೋಗ್ಯ ಸ್ಥಿತಿ',
      deleteTitle: 'ಔಷಧಿ ಅಳಿಸಿ',
      deleteConfirmBtn: 'ಔಷಧಿ ಅಳಿಸಿ',
      deleteMessagePrefix: 'ನೀವು ಖಚಿತವಾಗಿ',
      deleteMessageSuffix: 'ಔಷಧಿಯನ್ನು ಪಟ್ಟಿ ಮತ್ತು ಇಂದಿನ ವೇಳಾಪಟ್ಟಿಯಿಂದ ತೆಗೆದುಹಾಕಲು ಬಯಸುವಿರಾ?',
      errNameRequired: 'ದಯವಿಟ್ಟು ಮಾನ್ಯವಾದ ಔಷಧಿ ಹೆಸರನ್ನು ನಮೂದಿಸಿ.',
      errDosageRequired: 'ದಯವಿಟ್ಟು ಔಷಧಿ ಪ್ರಮಾಣವನ್ನು ನಮೂದಿಸಿ (ಉದಾ. 50 mg).',
      errTimingsRequired: 'ಕನಿಷ್ಠ ಒಂದು ಸಮಯವನ್ನು ನಮೂದಿಸಿ (ಉದಾ. 08:00 AM).',
      errTimingFormat: '08:00 AM, 01:30 PM ಅಥವಾ 20:00 ನಂತಹ ಮಾನ್ಯ ಸಮಯ ನಮೂದಿಸಿ.',
      errDateRequired: 'ಪ್ರಾರಂಭ ಮತ್ತು ಅಂತಿಮ ದಿನಾಂಕಗಳನ್ನು ಆಯ್ಕೆಮಾಡಿ.',
      errDateRange: 'ಅಂತಿಮ ದಿನಾಂಕವು ಪ್ರಾರಂಭ ದಿನಾಂಕಕ್ಕಿಂತ ಹಿಂದಿನದಾಗಿರಬಾರದು.',
      errStockInvalid: 'ಪ್ರಸ್ತುತ ದಾಸ್ತಾನು 0 ಅಥವಾ ಅದಕ್ಕಿಂತ ಹೆಚ್ಚಾಗಿರಬೇಕು.',
      errThresholdInvalid: 'ಕಡಿಮೆ ದಾಸ್ತಾನು ಮಿತಿ ಕನಿಷ್ಠ 1 ಆಗಿರಬೇಕು.',
      freqOnce: 'ದಿನಕ್ಕೆ ಒಮ್ಮೆ',
      freqTwice: 'ದಿನಕ್ಕೆ ಎರಡು ಬಾರಿ',
      freqThree: 'ದಿನಕ್ಕೆ ಮೂರು ಬಾರಿ',
      freqAsNeeded: 'ಅಗತ್ಯವಿದ್ದಾಗ',
      mealBefore: 'ಊಟಕ್ಕೆ ಮುಂಚೆ',
      mealAfter: 'ಊಟದ ನಂತರ',
      mealWater: 'ನೀರಿನೊಂದಿಗೆ',
      mealBedtime: 'ಮಲಗುವ ಮುನ್ನ',
    },
    schedule: {
      subtitle: 'ಬೆಳಿಗ್ಗೆ, ಮಧ್ಯಾಹ್ನ, ಸಂಜೆ ಮತ್ತು ರಾತ್ರಿ ಅವಧಿಗಳಂತೆ ವ್ಯವಸ್ಥಿತ ದೈನಂದಿನ ವೇಳಾಪಟ್ಟಿ.',
      all: 'ಎಲ್ಲಾ',
      morning: 'ಬೆಳಿಗ್ಗೆ',
      afternoon: 'ಮಧ್ಯಾಹ್ನ',
      evening: 'ಸಂಜೆ',
      night: 'ರಾತ್ರಿ',
      dosesSuffix: 'ಔಷಧಿಗಳು',
      takenSummary: 'ತೆಗೆದುಕೊಂಡಿದೆ',
      pendingSummary: 'ಬಾಕಿ ಇದೆ',
      missedSummary: 'ತಪ್ಪಿದೆ',
      totalSummary: 'ಒಟ್ಟು ನಿಗದಿತ',
      ofWord: 'ರಲ್ಲಿ',
      readPeriodPrefix: 'ಓದಿ ಹೇಳಿ:',
      readPeriodSuffix: '',
      emptyPeriodPrefix: 'ಈ ಅವಧಿಗೆ ಯಾವುದೇ ಔಷಧಿಗಳು ನಿಗದಿಯಾಗಿಲ್ಲ:',
      loggedTakenPrefix: 'ತೆಗೆದುಕೊಂಡ ಸಮಯ',
      byWord: 'ದಾಖಲಿಸಿದವರು',
      noScheduledSpeechPrefix: 'ಈ ಸಮಯಕ್ಕೆ ಯಾವುದೇ ಔಷಧಿ ನಿಗದಿಯಾಗಿಲ್ಲ:',
    },
    reminders: {
      subtitle:
        'ದೈನಂದಿನ ಮತ್ತು ಸಾಪ್ತಾಹಿಕ ಧ್ವನಿ ಜ್ಞಾಪನೆಗಳನ್ನು ಸೇರಿಸಿ, ತಿದ್ದುಪಡಿ ಮಾಡಿ, ಅಳಿಸಿ ಮತ್ತು ಎಚ್ಚರಿಕೆಗಳನ್ನು ನಿರ್ವಹಿಸಿ.',
      speakerSimulator: 'ಸ್ಪೀಕರ್ ಸಿಮ್ಯುಲೇಟರ್',
      testChimeVoice: 'ಧ್ವನಿ ಮತ್ತು ಗಂಟೆ ಪರೀಕ್ಷಿಸಿ',
      addReminder: 'ಜ್ಞಾಪನೆ ಸೇರಿಸಿ',
      editReminder: 'ಜ್ಞಾಪನೆ ತಿದ್ದುಪಡಿ',
      deleteReminderTitle: 'ಧ್ವನಿ ಜ್ಞಾಪನೆ ಅಳಿಸಿ',
      deleteReminderMsg: 'ಈ ನಿಗದಿತ ಧ್ವನಿ ಜ್ಞಾಪನೆಯನ್ನು ಅಳಿಸಲು ನೀವು ಖಚಿತವಾಗಿದ್ದೀರಾ?',
      upcomingActiveTitle: 'ಇಂದಿನ ಸಕ್ರಿಯ ಔಷಧಿ ಜ್ಞಾಪನೆಗಳು',
      upcomingActiveSubtitle:
        'ಜ್ಞಾಪನೆಯನ್ನು ದೃಢೀಕರಿಸಿ ಅಥವಾ 15 ನಿಮಿಷ ಮುಂದೂಡಿ. ಮ್ಯೂಟ್ ಮಾಡಿದ ಔಷಧಿಗಳನ್ನು ಬಿಡಲಾಗುತ್ತದೆ.',
      allCompletedBanner: 'ಇಂದಿನ ಎಲ್ಲಾ ಸಕ್ರಿಯ ಔಷಧಿ ಜ್ಞಾಪನೆಗಳು ಪೂರ್ಣಗೊಂಡಿವೆ ಅಥವಾ ಮ್ಯೂಟ್ ಆಗಿವೆ.',
      snoozed15Msg: '15 ನಿಮಿಷ ಮುಂದೂಡಲಾಗಿದೆ',
      overdueAlertMsg: 'ಸಮಯ ಮೀರಿದೆ — ಕುಟುಂಬ ಎಚ್ಚರಿಕೆ ಸಕ್ರಿಯ',
      reminderLeadPrefix: 'ಜ್ಞಾಪನೆ:',
      reminderLeadSuffix: 'ನಿಮಿಷ ಮುಂಚೆ',
      speakOnHub: 'ಸ್ಪೀಕರ್‌ನಲ್ಲಿ ಹೇಳಿ',
      takeNow: 'ಈಗ ತೆಗೆದುಕೊಳ್ಳಿ',
      snooze15m: '15 ನಿಮಿಷ ಮುಂದೂಡಿ',
      snoozedLabel: 'ಮುಂದೂಡಲಾಗಿದೆ',
      mutedSkipNote: 'ಮ್ಯೂಟ್ ಮಾಡಲಾಗಿದೆ (ಧ್ವನಿ ಎಚ್ಚರಿಕೆಯಿಂದ ಹೊರಗಿಡಲಾಗಿದೆ)',
      customRemindersTitle: 'ದೈನಂದಿನ ಮತ್ತು ಸಾಪ್ತಾಹಿಕ ಧ್ವನಿ ಜ್ಞಾಪನೆಗಳು',
      customRemindersSubtitle: 'ದಿನಾಂಕ, ಸಮಯ ಮತ್ತು ದೈನಂದಿನ/ಸಾಪ್ತಾಹಿಕ ವೇಳಾಪಟ್ಟಿಯೊಂದಿಗೆ ನಿಗದಿತ ಜ್ಞಾಪನೆಗಳು.',
      noCustomRemindersTitle: 'ಯಾವುದೇ ಜ್ಞಾಪನೆಗಳನ್ನು ಸೇರಿಸಲಾಗಿಲ್ಲ',
      noCustomRemindersDesc: 'ದೈನಂದಿನ ಅಥವಾ ಸಾಪ್ತಾಹಿಕ ಜ್ಞಾಪನೆಯನ್ನು ಸೇರಿಸಿ.',
      perMedTogglesTitle: 'ಪ್ರತಿ ಔಷಧಿ ಜ್ಞಾಪನೆ ನಿಯಂತ್ರಣ',
      alertsOn: 'ಎಚ್ಚರಿಕೆ ಆನ್',
      muted: 'ಮ್ಯೂಟ್',
      preferencesTitle: 'ಜ್ಞಾಪನೆ ಮತ್ತು ಎಚ್ಚರಿಕೆ ಆದ್ಯತೆಗಳು',
      leadTimeLabel: 'ಮುಂಗಡ ಜ್ಞಾಪನೆ ಸಮಯ',
      minutesBeforeSuffix: 'ನಿಮಿಷಗಳ ಮುಂಚೆ',
      audioChimeToggle: 'ಮೃದುವಾದ ಗಂಟೆ ಶಬ್ದ',
      voicePromptToggle: 'ಧ್ವನಿ ಜ್ಞಾಪನೆ (EN / KN)',
      escalateMissedToggle: 'ತಪ್ಪಿದ ಔಷಧಿ ಕುಟುಂಬಕ್ಕೆ ಎಚ್ಚರಿಕೆ',
      escalationDelayLabel: 'ಕುಟುಂಬ ಎಚ್ಚರಿಕೆ ವಿಳಂಬ',
      minutesAfterSuffix: 'ನಿಮಿಷಗಳ ನಂತರ',
      viewHistoryLink: 'ಜ್ಞಾಪನೆ ಇತಿಹಾಸ',
      triggerMissedAlert: 'ತಪ್ಪಿದ ಔಷಧಿ ಪರೀಕ್ಷೆ',
      fieldTitle: 'ಜ್ಞಾಪನೆ ಶೀರ್ಷಿಕೆ',
      fieldMedicine: 'ಔಷಧಿ / ದಿನಚರಿ',
      fieldDosage: 'ಪ್ರಮಾಣ / ವಿವರ',
      fieldDate: 'ಜ್ಞಾಪನೆ ದಿನಾಂಕ',
      fieldTime: 'ಜ್ಞಾಪನೆ ಸಮಯ (ಉದಾ. 08:00 AM)',
      fieldFrequency: 'ಪುನರಾವರ್ತನೆ ವೇಳಾಪಟ್ಟಿ',
      fieldDays: 'ದಿನಗಳನ್ನು ಆಯ್ಕೆಮಾಡಿ (ಸಾಪ್ತಾಹಿಕ)',
      fieldNotes: 'ಧ್ವನಿ ಟಿಪ್ಪಣಿ / ಸೂಚನೆಗಳು',
      dailyOption: 'ಪ್ರತಿದಿನ',
      weeklyOption: 'ವಾರಕ್ಕೊಮ್ಮೆ',
      enabledLabel: 'ಸಕ್ರಿಯ',
      pausedLabel: 'ವಿರಾಮ',
      readAloudBtn: 'ಸ್ಪೀಕರ್ ಪ್ರಸಾರ',
      errTitleRequired: 'ದಯವಿಟ್ಟು ಜ್ಞಾಪನೆ ಶೀರ್ಷಿಕೆ ನಮೂದಿಸಿ.',
      errMedicineRequired: 'ದಯವಿಟ್ಟು ಔಷಧಿ ಅಥವಾ ದಿನಚರಿ ಹೆಸರು ನಮೂದಿಸಿ.',
      errDateRequired: 'ದಯವಿಟ್ಟು ಜ್ಞಾಪನೆ ದಿನಾಂಕ ಆಯ್ಕೆಮಾಡಿ.',
      errTimeFormat: '08:00 AM ಅಥವಾ 20:00 ನಂತಹ ಮಾನ್ಯ ಸಮಯ ನಮೂದಿಸಿ.',
      errDaysRequired: 'ಸಾಪ್ತಾಹಿಕ ಜ್ಞಾಪನೆಗೆ ಕನಿಷ್ಠ ಒಂದು ದಿನವನ್ನು ಆಯ್ಕೆಮಾಡಿ.',
    },
    speaker: {
      subtitle:
        'ಸಿಮ್ಯುಲೇಟೆಡ್ ಮನೆಯ ಸ್ಮಾರ್ಟ್ ಸ್ಪೀಕರ್ — ಸ್ಮಾರ್ಟ್‌ಫೋನ್ ಇಲ್ಲದೆ ಧ್ವನಿ ಜ್ಞಾಪನೆಗಳು ಮತ್ತು ಸರಳ ಬಟನ್ ದೃಢೀಕರಣ.',
      viewHistory: 'ಜ್ಞಾಪನೆ ಇತಿಹಾಸ ನೋಡಿ',
      simulatedBadge: 'ಸಿಮ್ಯುಲೇಟೆಡ್ ಸ್ಪೀಕರ್ ಇಂಟರ್‌ಫೇಸ್',
      speakerOnline: 'ಸ್ಪೀಕರ್ ಆನ್‌ಲೈನ್ (ಸಿಮ್ಯುಲೇಟೆಡ್)',
      standbyOffline: 'ಸ್ಟ್ಯಾಂಡ್‌ಬೈ / ಆಫ್‌ಲೈನ್ (ಸಿಮ್ಯುಲೇಟೆಡ್)',
      offlineWarningBanner:
        'ಸ್ಪೀಕರ್ ಪ್ರಸ್ತುತ ಆಫ್‌ಲೈನ್ / ಸ್ಟ್ಯಾಂಡ್‌ಬೈ ಮೋಡ್‌ನಲ್ಲಿದೆ. ಸಿಮ್ಯುಲೇಟೆಡ್ ಪ್ರಸಾರಗಳನ್ನು ಪರೀಕ್ಷಿಸಲು ಆನ್‌ಲೈನ್‌ಗೆ ಬದಲಾಯಿಸಿ.',
      spokenOutputLabel: 'ಸಿಮ್ಯುಲೇಟೆಡ್ ಧ್ವನಿ ಔಟ್‌ಪುಟ್',
      lastSpokenLabel: 'ಕೊನೆಯ ಪ್ರಸಾರ:',
      replayReminder: 'ಮತ್ತೊಮ್ಮೆ ಕೇಳಿಸಿ',
      volumeLabel: 'ಶಬ್ದ',
      repeatLabel: 'ಪುನರಾವರ್ತನೆ',
      handsFreeHeading: 'ಸಿಮ್ಯುಲೇಟೆಡ್ ಹಿರಿಯರ ಹ್ಯಾಂಡ್ಸ್-ಫ್ರೀ ಸ್ಪೀಕರ್ ಬಟನ್‌ಗಳು',
      btnTookIt: '“ತೆಗೆದುಕೊಂಡಿದ್ದೇನೆ”',
      btnSnooze10: '10 ನಿಮಿಷ ಮುಂದೂಡಿ',
      btnNeedHelp: 'ಸಹಾಯ ಬೇಕು',
      sliderVolumeLabel: 'ಸ್ಪೀಕರ್ ಶಬ್ದ ಮಟ್ಟ',
      voiceLangLabel: 'ಸ್ಪೀಕರ್ ಧ್ವನಿ ಭಾಷೆ',
      repeatSelectLabel: 'ಪುನರಾವರ್ತನೆ ಸಂಖ್ಯೆ',
      speak1Time: '1 ಬಾರಿ ಹೇಳಿ',
      speak2Times: '2 ಬಾರಿ ಹೇಳಿ',
      speak3Times: '3 ಬಾರಿ ಹೇಳಿ',
      remoteControllerTitle: 'ದೂರಸ್ಥ ಕುಟುಂಬ ಪ್ರಸಾರ (ಸಿಮ್ಯುಲೇಟೆಡ್)',
      remoteControllerSubtitle: 'ಮನೆಯ ಸಿಮ್ಯುಲೇಟೆಡ್ ಸ್ಪೀಕರ್‌ನಲ್ಲಿ ಧ್ವನಿ ಜ್ಞಾಪನೆ ಕಳುಹಿಸಿ:',
      selectDoseLabel: 'ಪ್ರಸಾರ ಮಾಡಲು ನಿಗದಿತ ಔಷಧಿ ಆಯ್ಕೆಮಾಡಿ',
      noPendingDropdown: 'ಯಾವುದೇ ಬಾಕಿ ಔಷಧಿಗಳಿಲ್ಲ',
      voiceLanguageShort: 'ಧ್ವನಿ ಭಾಷೆ:',
      announceDoseBtn: 'ಸ್ಪೀಕರ್‌ನಲ್ಲಿ ಘೋಷಿಸಿ',
      customMessageLabel: 'ಅಥವಾ ಕುಟುಂಬದ ವಿಶೇಷ ಧ್ವನಿ ಸಂದೇಶ ಕಳುಹಿಸಿ',
      customMessagePlaceholder:
        'ಉದಾ: ಅಪ್ಪಾ, ದಯವಿಟ್ಟು ಊಟದ ನಂತರ ರಾತ್ರಿ 8 ಗಂಟೆಯ ಮೆಟ್‌ಫಾರ್ಮಿನ್ ಮಾತ್ರೆ ತೆಗೆದುಕೊಳ್ಳಿ.',
      speakCustomBtn: 'ವಿಶೇಷ ಸಂದೇಶ ಹೇಳಿಸಿ',
      pendingQueueTitle: 'ಸ್ಪೀಕರ್ ಪಟ್ಟಿಯಲ್ಲಿರುವ ಸಕ್ರಿಯ ಔಷಧಿಗಳು',
      allConfirmedMsg: 'ಇಂದಿನ ಎಲ್ಲಾ ಸಕ್ರಿಯ ಔಷಧಿಗಳು ದೃಢೀಕರಿಸಲ್ಪಟ್ಟಿವೆ ಅಥವಾ ಮ್ಯೂಟ್ ಆಗಿವೆ.',
      speakNowBtn: 'ಈಗ ಹೇಳಿ',
      mutedTag: 'ಮ್ಯೂಟ್',
      recentLogsPrefix: 'ಇತ್ತೀಚಿನ ಸಿಮ್ಯುಲೇಟೆಡ್ ಸ್ಪೀಕರ್ ದಾಖಲೆಗಳು:',
      recentLogsSuffix: 'ದಾಖಲೆಗಳು',
    },
    history: {
      subtitle: 'ಸಿಮ್ಯುಲೇಟೆಡ್ ಸ್ಮಾರ್ಟ್ ಸ್ಪೀಕರ್ ಜ್ಞಾಪನೆಗಳು, ಧ್ವನಿ ಸಂದೇಶಗಳು ಮತ್ತು ದೃಢೀಕರಣಗಳ ಲಾಗ್.',
      totalSent: 'ಒಟ್ಟು ಕಳುಹಿಸಿದ ಜ್ಞಾಪನೆಗಳು',
      viaSpeakerHelper: 'ಸಿಮ್ಯುಲೇಟೆಡ್ ಸ್ಪೀಕರ್ ಮೂಲಕ',
      confirmedTaken: 'ತೆಗೆದುಕೊಂಡದ್ದು ದೃಢೀಕರಿಸಲಾಗಿದೆ',
      verifiedHelper: 'ಧ್ವನಿ, ಬಟನ್ ಅಥವಾ ಆರೈಕೆದಾರರಿಂದ ದೃಢೀಕೃತ',
      escalatedFamily: 'ಕುಟುಂಬಕ್ಕೆ ಎಚ್ಚರಿಕೆ',
      unansweredHelper: 'ಉತ್ತರಿಸದಿದ್ದಾಗ ಕಳುಹಿಸಲಾಗಿದೆ',
      searchPlaceholder: 'ಔಷಧಿ, ಧ್ವನಿ ಸಂದೇಶ ಅಥವಾ ಉತ್ತರಿಸಿದವರನ್ನು ಹುಡುಕಿ...',
      filterAll: 'ಎಲ್ಲಾ',
      filterConfirmed: 'ದೃಢೀಕೃತ',
      filterSnoozed: '10 ನಿಮಿಷ ಮುಂದೂಡಲಾಗಿದೆ',
      filterPending: 'ಪ್ರತಿಕ್ರಿಯೆ ಬಾಕಿ',
      filterEscalated: 'ಕುಟುಂಬಕ್ಕೆ ಎಚ್ಚರಿಕೆ',
      emptyTitle: 'ಯಾವುದೇ ಜ್ಞಾಪನೆ ಇತಿಹಾಸ ಕಂಡುಬಂದಿಲ್ಲ',
      emptyDesc: 'ಸಿಮ್ಯುಲೇಟೆಡ್ ಸ್ಪೀಕರ್ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ನಿಂದ ಜ್ಞಾಪನೆ ಕಳುಹಿಸಿ ಅಥವಾ ಫಿಲ್ಟರ್ ಬದಲಾಯಿಸಿ.',
      colTimestamp: 'ಸಮಯ',
      colMedicineSlot: 'ಔಷಧಿ ಮತ್ತು ಸಮಯ',
      colSpokenScript: 'ಹೇಳಿದ ಸಂದೇಶ',
      colOutcomeResponder: 'ಫಲಿತಾಂಶ ಮತ್ತು ದೃಢೀಕರಿಸಿದವರು',
      colAudio: 'ಧ್ವನಿ',
      languageLabel: 'ಭಾಷೆ:',
      replayBtn: 'ಮತ್ತೆ ಕೇಳಿ',
      channelSpeaker: 'ಸ್ಮಾರ್ಟ್ ಸ್ಪೀಕರ್',
      channelVoiceFallback: 'ಧ್ವನಿ ಕರೆ',
      channelCaretaker: 'ಆರೈಕೆದಾರರ ಎಚ್ಚರಿಕೆ',
      csvDownloadedToast: 'ಜ್ಞಾಪನೆ ಇತಿಹಾಸ CSV ಡೌನ್‌ಲೋಡ್ ಆಗಿದೆ.',
    },
    adherence: {
      subtitle:
        'ತೆಗೆದುಕೊಂಡ, ತಪ್ಪಿದ ಮತ್ತು ಬಾಕಿ ಇರುವ ಲೆಕ್ಕಾಚಾರಗಳೊಂದಿಗೆ ದೈನಂದಿನ ಮತ್ತು ಸಾಪ್ತಾಹಿಕ ಔಷಧಿ ಪಾಲನೆ ವರದಿಗಳು.',
      dailySummaryTitle: 'ಇಂದಿನ ದೈನಂದಿನ ಸಾರಾಂಶ',
      weeklySummaryTitle: '7-ದಿನಗಳ ಸಾಪ್ತಾಹಿಕ ಸಾರಾಂಶ',
      todayTaken: 'ಇಂದು ತೆಗೆದುಕೊಂಡದ್ದು',
      todayPending: 'ಇಂದು ಬಾಕಿ ಇರುವುದು',
      todayMissed: 'ಇಂದು ತಪ್ಪಿದ್ದು',
      todayRate: 'ಇಂದಿನ ಪೂರ್ಣಗೊಂಡ ದರ',
      weeklyRate: '7-ದಿನಗಳ ಪಾಲನೆ ದರ',
      weeklyTaken: '7 ದಿನಗಳಲ್ಲಿ ತೆಗೆದುಕೊಂಡದ್ದು',
      weeklyMissed: '7 ದಿನಗಳಲ್ಲಿ ತಪ್ಪಿದ್ದು',
      activeMeds: 'ಸಕ್ರಿಯ ಔಷಧಿಗಳು',
      targetHelper: 'ಗುರಿ ≥ 90%',
      outOfScheduledPrefix: 'ಒಟ್ಟು',
      outOfScheduledSuffix: 'ನಿಗದಿತದಲ್ಲಿ',
      followUpHelper: '0 ಕ್ಕಿಂತ ಹೆಚ್ಚಿದ್ದರೆ ಗಮನ ಅಗತ್ಯ',
      trackedDailyHelper: 'ದೈನಂದಿನ ಟ್ರ್ಯಾಕಿಂಗ್',
      dailyCompletionTitle: 'ದೈನಂದಿನ ಔಷಧಿ ಪೂರ್ಣಗೊಳಿಸುವಿಕೆ (ಕಳೆದ 7 ದಿನಗಳು)',
      rateTrendTitle: 'ಪಾಲನೆ ದರ ಪ್ರವೃತ್ತಿ',
      range7d: '7 ದಿನಗಳು',
      range4w: '4 ವಾರಗಳು',
      timeOfDayTitle: 'ಸಮಯದ ಪ್ರಕಾರ ಇಂದಿನ ಪಾಲನೆ',
      perMedicineTitle: 'ಪ್ರತಿ ಔಷಧಿಯ ಪಾಲನೆ ಸಾರಾಂಶ',
      colMedicine: 'ಔಷಧಿ',
      colSchedule: 'ವೇಳಾಪಟ್ಟಿ',
      colTodayStatus: 'ಇಂದಿನ ಸ್ಥಿತಿ',
      colStockLeft: 'ಬಾಕಿ ದಾಸ್ತಾನು',
      unitsSuffix: 'ಘಟಕಗಳು',
      takenWord: 'ತೆಗೆದುಕೊಂಡಿದೆ',
      csvDownloadedToast: 'ಔಷಧಿ ಪಾಲನೆ CSV ವರದಿ ಡೌನ್‌ಲೋಡ್ ಆಗಿದೆ.',
    },
    catalogue: {
      title: 'ಔಷಧಿ ಮಾಹಿತಿ ಕೋಶ',
      subtitle:
        'ವರ್ಗ ಮತ್ತು ಔಷಧಿ ರೂಪದಂತೆ ವ್ಯವಸ್ಥಿತ ಮಾಹಿತಿ ಕೋಶ (ರೋಗಿಯ ಔಷಧ ಚೀಟಿಗಳಿಂದ ಪ್ರತ್ಯೇಕವಾಗಿದೆ).',
      disclaimerTitle: 'ದೃಢೀಕೃತ ಸಾಮಾನ್ಯ ಮಾಹಿತಿ ಮಾತ್ರ',
      disclaimerBody:
        'ಈ ಮಾಹಿತಿಯು ಸಾರ್ವಜನಿಕ ವೈದ್ಯಕೀಯ ಉಲ್ಲೇಖಗಳಿಂದ (MedlinePlus NIH, WHO, DailyMed, BNF) ಪಡೆಯಲಾಗಿದೆ. ಇದು ವೈದ್ಯರ ಸಲಹೆ ಅಥವಾ ವೈಯಕ್ತಿಕ ಡೋಸೇಜ್ ಸೂಚನೆಯಲ್ಲ.',
      searchPlaceholder: 'ಔಷಧಿ ಅಥವಾ ಜೆನೆರಿಕ್ ಹೆಸರಿನಿಂದ ಹುಡುಕಿ...',
      categoryAll: 'ಎಲ್ಲಾ ವರ್ಗಗಳು',
      formAll: 'ಎಲ್ಲಾ ರೂಪಗಳು',
      formTablet: 'ಮಾತ್ರೆ (Tablet)',
      formCapsule: 'ಕ್ಯಾಪ್ಸೂಲ್ (Capsule)',
      formSyrup: 'ಸಿರಪ್ (Syrup)',
      formDrops: 'ಹನಿಗಳು (Drops)',
      genericLabel: 'ಜೆನೆರಿಕ್ ಹೆಸರು',
      categoryLabel: 'ವರ್ಗ',
      formLabel: 'ರೂಪ',
      strengthsLabel: 'ಸಾಮಾನ್ಯ ಉಲ್ಲೇಖ ಸಾಮರ್ಥ್ಯಗಳು',
      precautionsLabel: 'ಸಾಮಾನ್ಯ ಮುನ್ನೆಚ್ಚರಿಕೆಗಳು',
      storageLabel: 'ಸಂಗ್ರಹಣೆ ಮಾರ್ಗದರ್ಶಿ',
      sourceLabel: 'ದೃಢೀಕೃತ ಮೂಲ',
      emptyTitle: 'ಯಾವುದೇ ಔಷಧಿ ಮಾಹಿತಿ ಕಂಡುಬಂದಿಲ್ಲ',
      emptyDesc: 'ಬೇರೆ ಹೆಸರನ್ನು ಹುಡುಕಿ ಅಥವಾ ವರ್ಗ/ರೂಪ ಫಿಲ್ಟರ್ ಮರುಹೊಂದಿಸಿ.',
    },
    family: {
      subtitle:
        'ಸ್ಪಷ್ಟ ಪ್ರವೇಶ ಅನುಮತಿಗಳೊಂದಿಗೆ ಕುಟುಂಬ ಸದಸ್ಯರು ಮತ್ತು ಆರೈಕೆದಾರರನ್ನು ಸಂಪರ್ಕದಲ್ಲಿಡುವ ಹಂಚಿಕೆಯ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್.',
      addMember: 'ಕುಟುಂಬ ಸದಸ್ಯರನ್ನು ಸೇರಿಸಿ',
      sharedStatusPrefix: 'ಹಂಚಿಕೆಯ ಆರೈಕೆ ಸ್ಥಿತಿ',
      sharedSyncActive: 'ಹಂಚಿಕೆಯ ಸಿಂಕ್ ಸಕ್ರಿಯ',
      subscribedSuffix: 'ಸದಸ್ಯರು ತಪ್ಪಿದ-ಔಷಧಿ ಎಚ್ಚರಿಕೆಗೆ ಚಂದಾದಾರರಾಗಿದ್ದಾರೆ',
      emergencyContact: 'ತುರ್ತು ಸಂಪರ್ಕ',
      standardContact: 'ಸಾಮಾನ್ಯ ಸಂಪರ್ಕ',
      receivesAlerts: 'ಎಚ್ಚರಿಕೆ ಪಡೆಯುತ್ತಾರೆ',
      alertsOff: 'ಎಚ್ಚರಿಕೆ ಆಫ್',
      canEditSchedule: 'ವೇಳಾಪಟ್ಟಿ ತಿದ್ದುಪಡಿ ಅನುಮತಿ',
      viewOnly: 'ವೀಕ್ಷಣೆ ಮಾತ್ರ',
      notesTitle: 'ಹಂಚಿಕೆಯ ಕುಟುಂಬ ಮತ್ತು ಆರೈಕೆ ಟಿಪ್ಪಣಿಗಳು',
      notesSubtitle: 'ಆಹಾರ, ಔಷಧಿ ಮರುಪೂರಣ ಅಥವಾ ಆರೈಕೆ ಕುರಿತು ಮಾಹಿತಿ ಹಂಚಿಕೊಳ್ಳಿ.',
      notePlaceholder: 'ಆರೈಕೆ ಮಾಹಿತಿ ಬರೆಯಿರಿ...',
      postNoteBtn: 'ಟಿಪ್ಪಣಿ ಪೋಸ್ಟ್ ಮಾಡಿ',
      permissionsCardTitle: 'ಪ್ರವೇಶ ಅನುಮತಿಗಳ ಸಾರಾಂಶ',
      permissionsCardDesc:
        'ಯಾವ ಕುಟುಂಬ ಸದಸ್ಯರು ವೇಳಾಪಟ್ಟಿ ಬದಲಾಯಿಸಬಹುದು ಮತ್ತು ಯಾರು ಕೇವಲ ಎಚ್ಚರಿಕೆ ಪಡೆಯುತ್ತಾರೆ ಎಂಬುದನ್ನು ನಿಯಂತ್ರಿಸುತ್ತದೆ.',
      fieldName: 'ಪೂರ್ಣ ಹೆಸರು',
      fieldRelationship: 'ಸಂಬಂಧ',
      fieldPhone: 'ದೂರವಾಣಿ ಸಂಖ್ಯೆ',
      fieldEmail: 'ಇಮೇಲ್',
      fieldLocation: 'ಸ್ಥಳ / ದೂರ',
      deleteConfirmMsg: 'ಕುಟುಂಬ ಆರೈಕೆ ವೃಂದದಿಂದ ತೆಗೆದುಹಾಕುವುದೇ?',
    },
    profile: {
      subtitle: 'ಹಿರಿಯ ರೋಗಿಯ ಸಂಪೂರ್ಣ ಆರೋಗ್ಯ ದಾಖಲೆ, ದೀರ್ಘಕಾಲೀನ ಕಾಯಿಲೆಗಳು, ಅಲರ್ಜಿಗಳು ಮತ್ತು ದೈನಂದಿನ ವೈಟಲ್ಸ್.',
      editProfileBtn: 'ವಿವರ ತಿದ್ದುಪಡಿ',
      updateHeading: 'ಹಿರಿಯರ ಆರೋಗ್ಯ ವಿವರಗಳನ್ನು ನವೀಕರಿಸಿ',
      fullName: 'ಪೂರ್ಣ ಹೆಸರು',
      age: 'ವಯಸ್ಸು',
      bloodGroup: 'ರಕ್ತದ ಗುಂಪು',
      phone: 'ದೂರವಾಣಿ ಸಂಖ್ಯೆ',
      primaryPhysician: 'ಪ್ರಾಥಮಿಕ ವೈದ್ಯರು',
      city: 'ನಗರ / ಪ್ರದೇಶ',
      allergiesInput: 'ಅಲರ್ಜಿಗಳು (ಕಾಮಾ ಮೂಲಕ ಪ್ರತ್ಯೇಕಿಸಿ)',
      conditionsInput: 'ಆರೋಗ್ಯ ಸ್ಥಿತಿಗಳು (ಕಾಮಾ ಮೂಲಕ ಪ್ರತ್ಯೇಕಿಸಿ)',
      dietaryNotes: 'ಆಹಾರ ಸೂಚನೆಗಳು',
      mobilityNotes: 'ಚಲನವಲನ ಮತ್ತು ವ್ಯಾಯಾಮ ಟಿಪ್ಪಣಿಗಳು',
      residentialAddress: 'ನಿವಾಸ ವಿಳಾಸ',
      knownAllergies: 'ತಿಳಿದಿರುವ ಅಲರ್ಜಿಗಳು',
      noneRecorded: 'ಯಾವುದೂ ದಾಖಲಾಗಿಲ್ಲ',
      managedConditions: 'ನಿರ್ವಹಿಸಲಾಗುತ್ತಿರುವ ಸ್ಥಿತಿಗಳು',
      careGuidanceTitle: 'ದೈನಂದಿನ ಆರೈಕೆ ಮತ್ತು ಆಹಾರ ಮಾರ್ಗದರ್ಶನ',
      dietaryInstructions: 'ಆಹಾರ ಸೂಚನೆಗಳು',
      mobilityExercise: 'ಚಲನವಲನ ಮತ್ತು ವ್ಯಾಯಾಮ',
      vitalsLogTitle: 'ಇತ್ತೀಚಿನ ವೈಟಲ್ಸ್ ದಾಖಲೆ',
      logVitalsBtn: 'ವೈಟಲ್ಸ್ ದಾಖಲಿಸಿ',
      colDateTime: 'ದಿನಾಂಕ ಮತ್ತು ಸಮಯ',
      colBp: 'ರಕ್ತದೊತ್ತಡ (BP)',
      colSugar: 'ರಕ್ತದ ಸಕ್ಕರೆ (Sugar)',
      colHeartRate: 'ಹೃದಯ ಬಡಿತ',
      colLoggedBy: 'ದಾಖಲಿಸಿದವರು',
      recordVitalsTitle: 'ವೈಟಲ್ಸ್ ದಾಖಲಿಸಿ',
      bpmSuffix: 'bpm',
      saveVitalsBtn: 'ವೈಟಲ್ಸ್ ಉಳಿಸಿ',
    },
    appointments: {
      subtitle: 'ನೇರ ಕ್ಲಿನಿಕ್ ಭೇಟಿಗಳು ಮತ್ತು ಕುಟುಂಬ ವೀಡಿಯೋ ಸಮಾಲೋಚನೆಗಳನ್ನು ನಿಗದಿಪಡಿಸಿ ಮತ್ತು ನಿರ್ವಹಿಸಿ.',
      scheduleBtn: 'ಭೇಟಿ ನಿಗದಿಪಡಿಸಿ',
      filterAll: 'ಎಲ್ಲಾ',
      filterScheduled: 'ನಿಗದಿತ',
      filterCompleted: 'ಪೂರ್ಣಗೊಂಡಿದೆ',
      filterCancelled: 'ರದ್ದಾಗಿದೆ',
      emptyTitle: 'ಈ ಫಿಲ್ಟರ್‌ಗೆ ಯಾವುದೇ ಭೇಟಿಗಳಿಲ್ಲ',
      emptyDesc: 'ಹೊಸ ವೈದ್ಯರ ಭೇಟಿಯನ್ನು ನಿಗದಿಪಡಿಸಿ ಅಥವಾ ಫಿಲ್ಟರ್ ಬದಲಾಯಿಸಿ.',
      purposeLabel: 'ಉದ್ದೇಶ:',
      noteLabel: 'ಟಿಪ್ಪಣಿ:',
      markCompleted: 'ಪೂರ್ಣಗೊಂಡಿದೆ',
      cancelVisit: 'ಭೇಟಿ ರದ್ದುಮಾಡಿ',
      editModalTitle: 'ವೈದ್ಯರ ಭೇಟಿ ತಿದ್ದುಪಡಿ',
      createModalTitle: 'ಹೊಸ ವೈದ್ಯರ ಭೇಟಿ ನಿಗದಿಪಡಿಸಿ',
      fieldDoctor: 'ವೈದ್ಯರ ಹೆಸರು',
      fieldSpecialty: 'ವಿಭಾಗ / ತಜ್ಞತೆ',
      fieldClinic: 'ಕ್ಲಿನಿಕ್ / ಆಸ್ಪತ್ರೆ',
      fieldDate: 'ದಿನಾಂಕ',
      fieldTime: 'ಸಮಯ',
      fieldVisitType: 'ಭೇಟಿ ವಿಧಾನ',
      fieldPurpose: 'ಭೇಟಿಯ ಉದ್ದೇಶ',
      fieldNotes: 'ತಯಾರಿ ಟಿಪ್ಪಣಿಗಳು',
      inPerson: 'ನೇರ ಭೇಟಿ',
      teleconsultation: 'ವೀಡಿಯೋ ಸಮಾಲೋಚನೆ',
      confirmBtn: 'ಭೇಟಿ ದೃಢೀಕರಿಸಿ',
      deleteTitle: 'ಭೇಟಿ ಅಳಿಸಿ',
      deleteMsgPrefix: 'ವೈದ್ಯರ ಭೇಟಿಯನ್ನು ತೆಗೆದುಹಾಕುವುದೇ:',
      deleteMsgOn: 'ದಿನಾಂಕ',
      deleteConfirmBtn: 'ಭೇಟಿ ಅಳಿಸಿ',
    },
    caretakers: {
      subtitle: 'ಮನೆ ನರ್ಸ್‌ಗಳು ಮತ್ತು ಆರೈಕೆದಾರರು, ಶಿಫ್ಟ್ ವೇಳಾಪಟ್ಟಿ, ಜವಾಬ್ದಾರಿಗಳು ಮತ್ತು ಚೆಕ್-ಇನ್ ನಿರ್ವಹಿಸಿ.',
      addBtn: 'ಆರೈಕೆದಾರರನ್ನು ಸೇರಿಸಿ',
      emptyTitle: 'ಯಾವುದೇ ಆರೈಕೆದಾರರು ನಿಯೋಜಿಸಲಾಗಿಲ್ಲ',
      emptyDesc: 'ದೈನಂದಿನ ಔಷಧಿ ಆರೈಕೆಗೆ ನರ್ಸ್ ಅಥವಾ ಸಹಾಯಕರನ್ನು ಸೇರಿಸಿ.',
      assignedShift: 'ನಿಗದಿತ ಶಿಫ್ಟ್',
      lastCheckIn: 'ಕೊನೆಯ ಚೆಕ್-ಇನ್',
      responsibilitiesLabel: 'ಆರೈಕೆ ಜವಾಬ್ದಾರಿಗಳು',
      logCheckInBtn: 'ಶಿಫ್ಟ್ ಚೆಕ್-ಇನ್ ದಾಖಲಿಸಿ',
      editModalTitle: 'ಆರೈಕೆದಾರರ ವಿವರ ತಿದ್ದುಪಡಿ',
      createModalTitle: 'ಹೊಸ ಆರೈಕೆದಾರರನ್ನು ಸೇರಿಸಿ',
      fieldName: 'ಪೂರ್ಣ ಹೆಸರು',
      fieldRoleTitle: 'ಹುದ್ದೆ / ಪಾತ್ರ',
      fieldPhone: 'ದೂರವಾಣಿ',
      fieldEmail: 'ಇಮೇಲ್',
      fieldShift: 'ಶಿಫ್ಟ್ ವೇಳಾಪಟ್ಟಿ',
      fieldStatus: 'ಪ್ರಸ್ತುತ ಸ್ಥಿತಿ',
      fieldDuties: 'ಜವಾಬ್ದಾರಿಗಳು (ಕಾಮಾ ಮೂಲಕ ಪ್ರತ್ಯೇಕಿಸಿ)',
      shiftMorning: 'ಬೆಳಿಗ್ಗೆ (7 AM - 2 PM)',
      shiftEvening: 'ಸಂಜೆ (2 PM - 9 PM)',
      shiftFullDay: 'ಪೂರ್ಣ ದಿನದ ಆರೈಕೆ',
      statusOnDuty: 'ಕರ್ತವ್ಯದಲ್ಲಿದ್ದಾರೆ',
      statusOffDuty: 'ಕರ್ತವ್ಯದಿಂದ ಹೊರಗೆ',
      statusOnLeave: 'ರಜೆಯಲ್ಲಿದ್ದಾರೆ',
      deleteTitle: 'ಆರೈಕೆದಾರರನ್ನು ತೆಗೆದುಹಾಕಿ',
      deleteMsgPrefix: 'ನಿಯೋಜಿತ ಆರೈಕೆದಾರರಿಂದ ತೆಗೆದುಹಾಕುವುದೇ:',
      deleteMsgSuffix: '?',
      deleteConfirmBtn: 'ಆರೈಕೆದಾರರನ್ನು ತೆಗೆದುಹಾಕಿ',
    },
    notifications: {
      subtitle: 'ತಪ್ಪಿದ ಔಷಧಿ ಎಚ್ಚರಿಕೆಗಳು, ಕಡಿಮೆ ದಾಸ್ತಾನು ಸೂಚನೆಗಳು, ಭೇಟಿ ಜ್ಞಾಪನೆಗಳು ಮತ್ತು ತುರ್ತು SOS ದಾಖಲೆಗಳು.',
      testAlertBtn: 'ತಪ್ಪಿದ ಔಷಧಿ ಎಚ್ಚರಿಕೆ ಪರೀಕ್ಷಿಸಿ',
      markAllReadBtn: 'ಎಲ್ಲಾ ಓದಿದಂತೆ ಗುರುತಿಸಿ',
      filterAll: 'ಎಲ್ಲಾ',
      filterUnread: 'ಓದದಿರುವವು',
      filterMissed: 'ತಪ್ಪಿದ ಔಷಧಿಗಳು',
      filterLowStock: 'ಕಡಿಮೆ ದಾಸ್ತಾನು',
      filterAppointments: 'ವೈದ್ಯರ ಭೇಟಿಗಳು',
      emptyTitle: 'ಈ ವಿಭಾಗದಲ್ಲಿ ಯಾವುದೇ ಸೂಚನೆಗಳಿಲ್ಲ',
      emptyDesc: 'ಎಲ್ಲಾ ಸೂಚನೆಗಳನ್ನು ಪರಿಶೀಲಿಸಲಾಗಿದೆ.',
      unreadTag: '· ಓದಿಲ್ಲ',
      reviewBtn: 'ಪರಿಶೀಲಿಸಿ',
      markReadBtn: 'ಓದಿದೆ',
      deleteAria: 'ಸೂಚನೆ ಅಳಿಸಿ',
    },
    prescriptions: {
      subtitle: 'ಸಕ್ರಿಯ ಔಷಧಿಗಳಿಗೆ ಲಿಂಕ್ ಮಾಡಲಾದ ವೈದ್ಯರ ಔಷಧ ಚೀಟಿಗಳನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ ಮತ್ತು ವೀಕ್ಷಿಸಿ.',
      uploadBtn: 'ಔಷಧ ಚೀಟಿ ಅಪ್‌ಲೋಡ್',
      emptyTitle: 'ಇನ್ನೂ ಯಾವುದೇ ಔಷಧ ಚೀಟಿ ಅಪ್‌ಲೋಡ್ ಮಾಡಿಲ್ಲ',
      emptyDesc: 'ಕುಟುಂಬ ಮತ್ತು ಔಷಧಾಲಯದ ಬಳಕೆಗಾಗಿ ಔಷಧ ಚೀಟಿಯ ಚಿತ್ರ ಅಥವಾ PDF ಅಪ್‌ಲೋಡ್ ಮಾಡಿ.',
      issuedPrefix: 'ನೀಡಿದ ದಿನಾಂಕ',
      pdfDocLabel: 'PDF ದಾಖಲೆ',
      medicinesLabel: 'ಔಷಧಿಗಳು:',
      viewDocBtn: 'ದಾಖಲೆ ನೋಡಿ',
      uploadModalTitle: 'ವೈದ್ಯರ ಔಷಧ ಚೀಟಿ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ',
      uploadModalSubtitle: 'ಸಾಧನದಿಂದ ಚಿತ್ರ ಅಥವಾ PDF ಲಗತ್ತಿಸಿ ಅಥವಾ ಮಾದರಿ ಚೀಟಿಯನ್ನು ಬಳಸಿ.',
      fieldTitle: 'ಔಷಧ ಚೀಟಿ ಶೀರ್ಷಿಕೆ',
      fieldDoctor: 'ವೈದ್ಯರ ಹೆಸರು',
      fieldIssueDate: 'ನೀಡಿದ ದಿನಾಂಕ',
      fieldClinic: 'ಕ್ಲಿನಿಕ್ / ಆಸ್ಪತ್ರೆ',
      fieldLinkedMeds: 'ಸಂಬಂಧಿತ ಔಷಧಿಗಳು (ಕಾಮಾ ಮೂಲಕ ಪ್ರತ್ಯೇಕಿಸಿ)',
      fieldFile: 'ಔಷಧ ಚೀಟಿ ಕಡತ (ಚಿತ್ರ ಅಥವಾ PDF)',
      chooseFilePrefix: 'ಕಡತ ಆಯ್ಕೆಮಾಡಿ',
      fieldNotes: 'ಫಾರ್ಮಸಿಸ್ಟ್ / ಆರೈಕೆ ಟಿಪ್ಪಣಿಗಳು',
      saveBtn: 'ಔಷಧ ಚೀಟಿ ಉಳಿಸಿ',
      previewDefaultTitle: 'ಔಷಧ ಚೀಟಿ ಮುನ್ನೋಟ',
      downloadPdfBtn: 'PDF ಡೌನ್‌ಲೋಡ್',
      notesLabel: 'ಟಿಪ್ಪಣಿಗಳು:',
      deleteTitle: 'ಔಷಧ ಚೀಟಿ ಅಳಿಸಿ',
      deleteMsgPrefix: 'ಉಳಿಸಿದ ಚೀಟಿಗಳಿಂದ ತೆಗೆದುಹಾಕುವುದೇ:',
      deleteMsgSuffix: '?',
      deleteConfirmBtn: 'ಔಷಧ ಚೀಟಿ ಅಳಿಸಿ',
      savingBtn: 'ಉಳಿಸಲಾಗುತ್ತಿದೆ...',
      localFileBadge: 'IndexedDB ಆಫ್‌ಲೈನ್ ಕಡತ',
      attachmentMissing: 'ಲಗತ್ತಿಸಿದ ಕಡತವನ್ನು ಸ್ಥಳೀಯ IndexedDB ಸಂಗ್ರಹಣೆಯಿಂದ ಲೋಡ್ ಮಾಡಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ.',
      duplicateRecordError:
        'ಈ ಶೀರ್ಷಿಕೆ, ದಿನಾಂಕ ಮತ್ತು ಕಡತವನ್ನು ಹೊಂದಿರುವ ಔಷಧ ಚೀಟಿ ಈಗಾಗಲೇ ಅಸ್ತಿತ್ವದಲ್ಲಿದೆ.',
      duplicateFileReusedInfo:
        'ಸಮಾನ ಕಡತ ಈಗಾಗಲೇ ಸ್ಥಳೀಯವಾಗಿ ಉಳಿಸಲಾಗಿದೆ — ನಕಲು ಇಲ್ಲದೆ ಅದೇ ಕಡತವನ್ನು ಮರುಬಳಕೆ ಮಾಡಲಾಗಿದೆ.',
      indexedDbUnavailableError:
        'ಈ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಸ್ಥಳೀಯ IndexedDB ಸಂಗ್ರಹಣೆ ಲಭ್ಯವಿಲ್ಲ ಅಥವಾ ನಿರ್ಬಂಧಿಸಲಾಗಿದೆ. ದೊಡ್ಡ ಕಡತವನ್ನು ಉಳಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ.',
      indexedDbQuotaError:
        'ಈ ಕಡತವನ್ನು ಉಳಿಸಲು ಸಾಧನದಲ್ಲಿ ಸಾಕಷ್ಟು ಸಂಗ್ರಹಣೆ ಇಲ್ಲ. ದಯವಿಟ್ಟು ಸಣ್ಣ ಕಡತವನ್ನು ಆಯ್ಕೆಮಾಡಿ ಅಥವಾ ಹಳೆಯ ಔಷಧ ಚೀಟಿಗಳನ್ನು ಅಳಿಸಿ.',
      indexedDbSaveError: 'ಔಷಧ ಚೀಟಿ ಕಡತವನ್ನು ಸ್ಥಳೀಯ IndexedDB ಸಂಗ್ರಹಣೆಯಲ್ಲಿ ಉಳಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ.',
      migrationPartialWarning:
        'ಕೆಲವು ಹಳೆಯ ಔಷಧ ಚೀಟಿ ಕಡತಗಳನ್ನು IndexedDB ಗೆ ವರ್ಗಾಯಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ; ಮೂಲ ದಾಖಲೆಗಳನ್ನು ಸುರಕ್ಷಿತವಾಗಿ ಉಳಿಸಲಾಗಿದೆ.',
    },
    settings: {
      subtitle: 'ಭಾಷೆ (ಇಂಗ್ಲಿಷ್ / ಕನ್ನಡ), ಹಿರಿಯರ ಅನುಕೂಲಕ್ಕಾಗಿ ದೊಡ್ಡ ಅಕ್ಷರಗಳು, ಕಾಂಟ್ರಾಸ್ಟ್ ಮತ್ತು ಪ್ರದರ್ಶನ ಡೇಟಾ ನಿರ್ವಹಿಸಿ.',
      langVoiceTitle: 'ಭಾಷೆ ಮತ್ತು ಧ್ವನಿ ಬೆಂಬಲ',
      englishTitle: 'English',
      englishDesc: 'ಪ್ರಮಾಣಿತ ಇಂಗ್ಲಿಷ್ ಇಂಟರ್‌ಫೇಸ್ ಮತ್ತು ಧ್ವನಿ',
      kannadaTitle: 'ಕನ್ನಡ (Kannada)',
      kannadaDesc: 'ದ್ವಿಭಾಷಾ ಆರೈಕೆ ಇಂಟರ್‌ಫೇಸ್ ಮತ್ತು ಧ್ವನಿ',
      testVoiceBtn: 'ಧ್ವನಿ ಪ್ಲೇಬ್ಯಾಕ್ ಪರೀಕ್ಷಿಸಿ',
      readabilityTitle: 'ಹಿರಿಯರ ಓದುವ ಅನುಕೂಲ ಮತ್ತು ಕಾಂಟ್ರಾಸ್ಟ್',
      textSizeLabel: 'ಪಠ್ಯದ ಗಾತ್ರ',
      scaleStandard: 'ಪ್ರಮಾಣಿತ (16px)',
      scaleLarge: 'ದೊಡ್ಡದು (18px)',
      scaleXlarge: 'ಅತಿ ದೊಡ್ಡದು (20px)',
      highContrastTitle: 'ಹೈ-ಕಾಂಟ್ರಾಸ್ಟ್ ಬಾರ್ಡರ್‌ಗಳು',
      highContrastDesc: 'ಕಡಿಮೆ ದೃಷ್ಟಿಯ ಸ್ಪಷ್ಟತೆಗಾಗಿ ಕಾರ್ಡ್ ಅಂಚುಗಳನ್ನು ಮತ್ತು ಬಿಳಿ ಹಿನ್ನೆಲೆಯನ್ನು ಗಟ್ಟಿಗೊಳಿಸುತ್ತದೆ.',
      demoControlsTitle: 'ಪ್ರದರ್ಶನ ಡೇಟಾ ನಿಯಂತ್ರಣಗಳು',
      demoControlsDesc:
        'ಈ ಅಪ್ಲಿಕೇಶನ್‌ನಲ್ಲಿರುವ ಎಲ್ಲಾ ದಾಖಲೆಗಳು ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಸ್ಥಳೀಯವಾಗಿ ಉಳಿಸಲಾದ ಮಾದರಿ ಡೇಟಾ ಆಗಿವೆ. ಯಾವಾಗ ಬೇಕಾದರೂ ಮರುಹೊಂದಿಸಬಹುದು.',
    },
    auth: {
      loginSubtitle: 'ElderlyCare ಪ್ರವೇಶಿಸಲು ಕುಟುಂಬ ಸದಸ್ಯರು, ಆರೈಕೆದಾರರು ಅಥವಾ ಹಿರಿಯರಾಗಿ ಲಾಗಿನ್ ಆಗಿ.',
      newAccountRegister: 'ಹೊಸ ಖಾತೆ? ನೋಂದಾಯಿಸಿ',
      signInEmailHeading: 'ಇಮೇಲ್ ಮೂಲಕ ಲಾಗಿನ್ ಆಗಿ',
      emailLabel: 'ಇಮೇಲ್ ವಿಳಾಸ',
      passwordDemoLabel: 'ಪಾಸ್‌ವರ್ಡ್ (ಪ್ರದರ್ಶನ)',
      signInBtn: 'ಲಾಗಿನ್ ಆಗಿ',
      quickRoleHeading: 'ಒಂದು ಕ್ಲಿಕ್ ಪಾತ್ರ ಲಾಗಿನ್ (ಪ್ರದರ್ಶನ)',
      activeSessionLabel: 'ಪ್ರಸ್ತುತ ಸೆಷನ್:',
      roleFamilyTitle: '1. ಕುಟುಂಬ ಸದಸ್ಯರು — ಅನನ್ಯಾ ರಾವ್',
      roleFamilyDesc: 'ದೂರದಿಂದಲೇ ವೇಳಾಪಟ್ಟಿ ನಿರ್ವಹಿಸಿ ಮತ್ತು ಕುಟುಂಬ ಎಚ್ಚರಿಕೆಗಳನ್ನು ನೋಡಿ',
      roleCaretakerTitle: '2. ಆರೈಕೆದಾರರು — ಕಾರ್ತಿಕ್ ನಾಯರ್, RN',
      roleCaretakerDesc: 'ನೀಡಿದ ಔಷಧಿಗಳು, ವೈಟಲ್ಸ್ ಮತ್ತು ದೈನಂದಿನ ಶಿಫ್ಟ್ ವಿವರ ದಾಖಲಿಸಿ',
      roleElderlyTitle: '3. ಹಿರಿಯ ನಾಗರಿಕರು — ಶ್ರೀ ರಮೇಶ್ ರಾವ್',
      roleElderlyDesc: 'ದೊಡ್ಡ ಅಕ್ಷರದ ವೀಕ್ಷಣೆ ಮತ್ತು ಹ್ಯಾಂಡ್ಸ್-ಫ್ರೀ ಸಿಮ್ಯುಲೇಟೆಡ್ ಸ್ಪೀಕರ್',
      errLoginEmpty: 'ದಯವಿಟ್ಟು ಇಮೇಲ್ ಮತ್ತು ಪಾಸ್‌ವರ್ಡ್ ಎರಡನ್ನೂ ನಮೂದಿಸಿ.',
      errLoginNotFound:
        'ಪ್ರದರ್ಶನ ಪಟ್ಟಿಯಲ್ಲಿ ಖಾತೆ ಕಂಡುಬಂದಿಲ್ಲ. ತ್ವರಿತ ಪಾತ್ರವನ್ನು ಆಯ್ಕೆಮಾಡಿ ಅಥವಾ ಹೊಸ ಖಾತೆಯನ್ನು ನೋಂದಾಯಿಸಿ.',
      registerSubtitle: 'ಕುಟುಂಬ ಸದಸ್ಯರು, ಆರೈಕೆದಾರರು ಅಥವಾ ಹಿರಿಯರಿಗಾಗಿ ಪ್ರದರ್ಶನ ಖಾತೆಯನ್ನು ರಚಿಸಿ.',
      alreadyRegistered: 'ಈಗಾಗಲೇ ನೋಂದಾಯಿಸಿದ್ದೀರಾ? ಲಾಗಿನ್ ಆಗಿ',
      registerHeading: 'ಆರೈಕೆ ವೃಂದದ ಖಾತೆ ನೋಂದಣಿ',
      fullName: 'ಪೂರ್ಣ ಹೆಸರು',
      phone: 'ದೂರವಾಣಿ ಸಂಖ್ಯೆ',
      selectRole: 'ಬಳಕೆದಾರರ ಪಾತ್ರ ಆಯ್ಕೆಮಾಡಿ',
      password: 'ಪಾಸ್‌ವರ್ಡ್',
      createEnterBtn: 'ಖಾತೆ ರಚಿಸಿ ಮತ್ತು ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ತೆರೆಯಿರಿ',
      registeredUsersHeading: 'ನೋಂದಾಯಿತ ಪ್ರದರ್ಶನ ಬಳಕೆದಾರರು',
      errRegisterIncomplete: 'ದಯವಿಟ್ಟು ಎಲ್ಲಾ ವಿವರಗಳನ್ನು ಭರ್ತಿ ಮಾಡಿ (ಕನಿಷ್ಠ 4 ಅಕ್ಷರಗಳ ಪಾಸ್‌ವರ್ಡ್).',
      authSubtitle: 'ಪ್ರದರ್ಶನ ಪಾತ್ರದೊಂದಿಗೆ ಲಾಗಿನ್ ಆಗಿ ಅಥವಾ ಹೊಸ ಆರೈಕೆ ಖಾತೆಯನ್ನು ನೋಂದಾಯಿಸಿ.',
      tabSignIn: 'ಲಾಗಿನ್',
      tabCreateAccount: 'ಖಾತೆ ರಚಿಸಿ',
      signInDashboardBtn: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ಗೆ ಲಾಗಿನ್ ಆಗಿ',
      mobileLabel: 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆ',
      careRoleLabel: 'ಆರೈಕೆ ಪಾತ್ರ',
      createPasswordLabel: 'ಪಾಸ್‌ವರ್ಡ್ ರಚಿಸಿ',
      registerDemoBtn: 'ಪ್ರದರ್ಶನ ಖಾತೆ ನೋಂದಾಯಿಸಿ',
      quickSwitchHeading: 'ತ್ವರಿತ ಪ್ರದರ್ಶನ ಪಾತ್ರ ಬದಲಾವಣೆ',
      currentlyActive: 'ಪ್ರಸ್ತುತ ಸಕ್ರಿಯ:',
      signInAsElderly: 'ಹಿರಿಯ ನಾಗರಿಕರಾಗಿ ಲಾಗಿನ್ ಆಗಿ',
      signInAsFamily: 'ಕುಟುಂಬ ಸದಸ್ಯರಾಗಿ ಲಾಗಿನ್ ಆಗಿ',
      signInAsCaretaker: 'ಆರೈಕೆದಾರರಾಗಿ ಲಾಗಿನ್ ಆಗಿ',
      registeredAccountsHeading: 'ನೋಂದಾಯಿತ ಪ್ರದರ್ಶನ ಖಾತೆಗಳು',
      errRegRequired: 'ದಯವಿಟ್ಟು ಅಗತ್ಯವಿರುವ ಎಲ್ಲಾ ನೋಂದಣಿ ಕ್ಷೇತ್ರಗಳನ್ನು ಭರ್ತಿ ಮಾಡಿ.',
    },
    status: {
      taken: 'ತೆಗೆದುಕೊಳ್ಳಲಾಗಿದೆ',
      pending: 'ಬಾಕಿ ಇದೆ',
      missed: 'ತಪ್ಪಿದೆ',
      skipped: 'ಬಿಡಲಾಗಿದೆ',
      lowStock: 'ಕಡಿಮೆ ದಾಸ್ತಾನು',
      adequateStock: 'ಲಭ್ಯವಿದೆ',
    },
    roles: {
      elderly: 'ಹಿರಿಯ ನಾಗರಿಕರು',
      family: 'ಕುಟುಂಬ ಸದಸ್ಯರು',
      caretaker: 'ಆರೈಕೆದಾರರು / ನರ್ಸ್',
    },
    voice: {
      title: 'ಆರೈಕೆ ಧ್ವನಿ ಸಹಾಯಕ',
      subtitle: 'ನಿಮ್ಮ ಔಷಧಿ ವೇಳಾಪಟ್ಟಿಯನ್ನು ಕನ್ನಡ ಅಥವಾ ಇಂಗ್ಲಿಷ್‌ನಲ್ಲಿ ಕೇಳಿ.',
      listening: 'ನಿಮ್ಮ ಧ್ವನಿ ಆಜ್ಞೆ ಕೇಳಲಾಗುತ್ತಿದೆ...',
      speakPrompt: 'ಕೆಳಗಿನ ಆಯ್ಕೆಯನ್ನು ಒತ್ತಿ ಅಥವಾ ಮೈಕ್ರೊಫೋನ್ ಬಳಸಿ.',
      startListening: 'ಧ್ವನಿ ಆಜ್ಞೆ ಪ್ರಾರಂಭಿಸಿ',
      stopListening: 'ನಿಲ್ಲಿಸಿ',
      readSchedule: 'ಇಂದಿನ ಔಷಧಿಗಳನ್ನು ಓದಿ',
      checkMissed: 'ತಪ್ಪಿದ ಔಷಧಿಗಳನ್ನು ಪರಿಶೀಲಿಸಿ',
      nextAppointment: 'ಮುಂದಿನ ವೈದ್ಯರ ಭೇಟಿ',
      openSos: 'ತುರ್ತು SOS ತೆರೆಯಿರಿ',
      heardPrefix: 'ಕೇಳಿಸಿದ್ದು:',
      spokenSummary: 'ಧ್ವನಿ ಸಾರಾಂಶ',
      replayAudio: 'ಮತ್ತೆ ಕೇಳಿ',
      unavailableTranscript: 'ಬ್ರೌಸರ್ ಧ್ವನಿ ಗುರುತಿಸುವಿಕೆ ಲಭ್ಯವಿಲ್ಲ — ಕೆಳಗಿನ ಬಟನ್‌ಗಳನ್ನು ಬಳಸಿ.',
      unclearTranscript: 'ಸ್ಪಷ್ಟವಾಗಿ ಕೇಳಿಸಲಿಲ್ಲ. ಕೆಳಗಿನ ತ್ವರಿತ ಆಯ್ಕೆಗಳನ್ನು ಒತ್ತಿ.',
    },
    sos: {
      title: 'ತುರ್ತು SOS ಸಹಾಯ',
      subtitle: 'ತುರ್ತು ಕರೆಗಳು, ಪ್ರಮುಖ ವೈದ್ಯಕೀಯ ಮಾಹಿತಿ ಮತ್ತು ಕುಟುಂಬಕ್ಕೆ ತಕ್ಷಣದ ಎಚ್ಚರಿಕೆ.',
      callAmbulance: 'ತುರ್ತು ಆಂಬ್ಯುಲೆನ್ಸ್ ಕರೆ (108)',
      callFamily: 'ಪ್ರಮುಖ ಕುಟುಂಬ ಸದಸ್ಯರಿಗೆ ಕರೆ',
      callCaretaker: 'ಆರೈಕೆದಾರರಿಗೆ ಕರೆ ಮಾಡಿ',
      sendAlert: 'ಕುಟುಂಬ ಮತ್ತು ಆರೈಕೆದಾರರಿಗೆ ತುರ್ತು ಎಚ್ಚರಿಕೆ ಕಳುಹಿಸಿ',
      alertSent: 'ತುರ್ತು SOS ಎಚ್ಚರಿಕೆಯನ್ನು ಕುಟುಂಬ ಮತ್ತು ಆರೈಕೆದಾರರಿಗೆ ಕಳುಹಿಸಲಾಗಿದೆ.',
      patientSummary: 'ತುರ್ತು ವೈದ್ಯಕೀಯ ಸಾರಾಂಶ',
      demoCall108: 'ಪ್ರದರ್ಶನ ಕರೆ: ತುರ್ತು ಆಂಬ್ಯುಲೆನ್ಸ್ 108 ಕ್ಕೆ ಕರೆ ಮಾಡಲಾಗುತ್ತಿದೆ',
      demoCallPrefix: 'ಪ್ರದರ್ಶನ ಕರೆ:',
    },
  },
};
