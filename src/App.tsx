import React, { useState } from 'react';
import { OfflineBanner } from './components/common/PWAStatus';
import { DemoBanner, ToastNotification } from './components/common/UI';
import { EmergencySOSModal } from './components/features/EmergencySOSModal';
import { VoiceAssistantModal } from './components/features/VoiceAssistantModal';
import { Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
import { AppProvider, useApp } from './context/AppContext';
import { AdherencePage } from './pages/AdherencePage';
import { AppointmentsPage } from './pages/AppointmentsPage';
import { AuthPage } from './pages/AuthPage';
import { CaretakersPage } from './pages/CaretakersPage';
import { CataloguePage } from './pages/CataloguePage';
import { DashboardPage } from './pages/DashboardPage';
import { FamilyPage } from './pages/FamilyPage';
import { LoginPage } from './pages/LoginPage';
import { MedicationsPage } from './pages/MedicationsPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { PrescriptionsPage } from './pages/PrescriptionsPage';
import { ProfilePage } from './pages/ProfilePage';
import { RegisterPage } from './pages/RegisterPage';
import { ReminderHistoryPage } from './pages/ReminderHistoryPage';
import { RemindersPage } from './pages/RemindersPage';
import { SchedulePage } from './pages/SchedulePage';
import { SettingsPage } from './pages/SettingsPage';
import { SpeakerDashboardPage } from './pages/SpeakerDashboardPage';

const AppShell: React.FC = () => {
  const { currentPage, t, toast, dismissToast } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'profile':
        return <ProfilePage />;
      case 'medications':
        return <MedicationsPage />;
      case 'schedule':
        return <SchedulePage />;
      case 'reminders':
        return <RemindersPage />;
      case 'speaker':
        return <SpeakerDashboardPage />;
      case 'history':
        return <ReminderHistoryPage />;
      case 'adherence':
        return <AdherencePage />;
      case 'catalogue':
        return <CataloguePage />;
      case 'appointments':
        return <AppointmentsPage />;
      case 'family':
        return <FamilyPage />;
      case 'caretakers':
        return <CaretakersPage />;
      case 'notifications':
        return <NotificationsPage />;
      case 'prescriptions':
        return <PrescriptionsPage />;
      case 'settings':
        return <SettingsPage />;
      case 'login':
        return <LoginPage />;
      case 'register':
        return <RegisterPage />;
      case 'auth':
        return <AuthPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="min-h-screen flex bg-[#F5F9FC] text-slate-900">
      <Sidebar mobileOpen={mobileMenuOpen} onCloseMobile={() => setMobileMenuOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <TopBar onOpenMobileMenu={() => setMobileMenuOpen(true)} />

        <main className="flex-1 px-4 sm:px-8 py-6">
          <div className="max-w-[1280px] mx-auto">
            <OfflineBanner />
            <DemoBanner text={t.demoNotice} />
            {renderPage()}
          </div>
        </main>

        <footer className="border-t border-[#DCE7F2] bg-white px-4 sm:px-8 py-4 text-sm text-slate-500">
          <div className="max-w-[1280px] mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span>{t.common.footerTitle}</span>
            <span>{t.common.footerNote}</span>
          </div>
        </footer>
      </div>

      <VoiceAssistantModal />
      <EmergencySOSModal />
      <ToastNotification toast={toast} onDismiss={dismissToast} dismissLabel={t.common.dismissNotification} />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
