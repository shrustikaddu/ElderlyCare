import React from 'react';
import {
  Activity,
  Bell,
  BookOpen,
  CalendarClock,
  ClipboardList,
  FileText,
  HeartPulse,
  History,
  LayoutDashboard,
  LogIn,
  Pill,
  Settings,
  ShieldAlert,
  Speaker,
  Stethoscope,
  UserCheck,
  UserPlus,
  UserRound,
  Users,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PageId } from '../../types';
import { SafeImage } from '../common/UI';

interface SidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onCloseMobile }) => {
  const {
    currentPage,
    navigateTo,
    t,
    notifications,
    currentUser,
    patientProfile,
    setSosModalOpen,
  } = useApp();

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const groups: {
    label: string;
    items: { id: PageId; icon: React.ReactNode; badge?: number }[];
  }[] = [
    {
      label: t.navGroups.careOverview,
      items: [
        { id: 'dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
        { id: 'speaker', icon: <Speaker className="w-5 h-5" /> },
        { id: 'profile', icon: <UserRound className="w-5 h-5" /> },
        { id: 'notifications', icon: <Bell className="w-5 h-5" />, badge: unreadCount },
      ],
    },
    {
      label: t.navGroups.medicationSuite,
      items: [
        { id: 'medications', icon: <Pill className="w-5 h-5" /> },
        { id: 'schedule', icon: <CalendarClock className="w-5 h-5" /> },
        { id: 'reminders', icon: <ClipboardList className="w-5 h-5" /> },
        { id: 'history', icon: <History className="w-5 h-5" /> },
        { id: 'adherence', icon: <Activity className="w-5 h-5" /> },
        { id: 'catalogue', icon: <BookOpen className="w-5 h-5" /> },
        { id: 'prescriptions', icon: <FileText className="w-5 h-5" /> },
      ],
    },
    {
      label: t.navGroups.careNetwork,
      items: [
        { id: 'appointments', icon: <Stethoscope className="w-5 h-5" /> },
        { id: 'family', icon: <Users className="w-5 h-5" /> },
        { id: 'caretakers', icon: <UserCheck className="w-5 h-5" /> },
      ],
    },
    {
      label: t.navGroups.system,
      items: [
        { id: 'settings', icon: <Settings className="w-5 h-5" /> },
        { id: 'login', icon: <LogIn className="w-5 h-5" /> },
        { id: 'register', icon: <UserPlus className="w-5 h-5" /> },
      ],
    },
  ];

  const handleSelect = (id: PageId) => {
    navigateTo(id);
    onCloseMobile();
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#EFF6FB] border-r border-[#D9E5F0]">
      <div className="flex items-center justify-between px-5 py-5 border-b border-[#D9E5F0]">
        <button
          type="button"
          onClick={() => handleSelect('dashboard')}
          className="flex items-center gap-3 text-left cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-[#0369A1] text-white flex items-center justify-center shrink-0">
            <HeartPulse className="w-6 h-6" />
          </div>
          <div>
            <span className="block font-display text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap">
              {t.appName}
            </span>
            <span className="block text-xs text-slate-600">{t.common.brandTagline}</span>
          </div>
        </button>

        <button
          type="button"
          onClick={onCloseMobile}
          aria-label={t.common.closeMenu}
          className="lg:hidden min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg text-slate-600 hover:bg-white cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="px-4 py-3.5 border-b border-[#D9E5F0] bg-white/70">
        <div className="flex items-center gap-3">
          <SafeImage
            src={patientProfile.avatarUrl}
            alt={patientProfile.fullName}
            className="w-10 h-10 rounded-full object-cover border border-[#CBE2F5] shrink-0"
          />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-900 truncate">{patientProfile.fullName}</p>
            <p className="text-xs text-slate-600 truncate">
              {t.roles[currentUser.role]} · {patientProfile.age} {t.common.yearsShort}
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5" aria-label={t.common.primaryNav}>
        {groups.map((group) => (
          <div key={group.label}>
            <p className="px-3 mb-1.5 text-xs font-semibold text-slate-500">{group.label}</p>
            <div className="space-y-1">
              {group.items.map((item) => {
                const active = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelect(item.id)}
                    aria-current={active ? 'page' : undefined}
                    className={`w-full min-h-[44px] flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-left text-[15px] font-medium transition-colors duration-150 cursor-pointer ${
                      active
                        ? 'bg-[#0369A1] text-white'
                        : 'text-slate-700 hover:bg-white hover:text-slate-900'
                    }`}
                  >
                    <span className="flex items-center gap-3 min-w-0">
                      <span className="shrink-0">{item.icon}</span>
                      <span className="truncate">{t.nav[item.id]}</span>
                    </span>
                    {typeof item.badge === 'number' && item.badge > 0 && (
                      <span
                        className={`text-xs font-bold tabular-nums px-2 py-0.5 rounded-md ${
                          active ? 'bg-white/20 text-white' : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-[#D9E5F0] bg-white/80">
        <button
          type="button"
          onClick={() => {
            setSosModalOpen(true);
            onCloseMobile();
          }}
          className="w-full min-h-[48px] flex items-center justify-center gap-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-base transition-colors cursor-pointer whitespace-nowrap"
        >
          <ShieldAlert className="w-5 h-5 shrink-0" />
          <span>{t.actions.emergencySos}</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:block w-[272px] shrink-0 h-screen sticky top-0">
        {sidebarContent}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/50"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <aside className="relative w-[280px] max-w-[85vw] h-full z-50">{sidebarContent}</aside>
        </div>
      )}
    </>
  );
};
