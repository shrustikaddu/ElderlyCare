import React from 'react';
import { Globe, Menu, Mic, ShieldAlert } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ConnectivityStatusBadge, PWAInstallButton } from '../common/PWAStatus';

interface TopBarProps {
  onOpenMobileMenu: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onOpenMobileMenu }) => {
  const {
    currentPage,
    t,
    language,
    setLanguage,
    setVoiceModalOpen,
    setSosModalOpen,
    currentUser,
    navigateTo,
  } = useApp();

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-[#DCE7F2] px-4 sm:px-8 py-3.5">
      <div className="max-w-[1280px] mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onOpenMobileMenu}
            aria-label={t.common.openMenu}
            className="lg:hidden min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl border border-[#DCE7F2] text-slate-700 hover:bg-[#F5F9FC] cursor-pointer shrink-0"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500">
              <span className="font-medium text-[#0369A1] whitespace-nowrap">{t.appName}</span>
              <span aria-hidden="true">/</span>
              <span className="truncate font-medium text-slate-800">{t.nav[currentPage]}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <ConnectivityStatusBadge />
          <PWAInstallButton />

          <div
            className="hidden sm:flex items-center rounded-xl border border-[#DCE7F2] bg-[#F5F9FC] p-1"
            role="group"
            aria-label={t.common.languageSwitcher}
          >
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`min-h-[34px] px-3 py-1 rounded-lg text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                language === 'en'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => setLanguage('kn')}
              className={`min-h-[34px] px-3 py-1 rounded-lg text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                language === 'kn'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ಕನ್ನಡ
            </button>
          </div>

          <button
            type="button"
            onClick={() => setLanguage(language === 'en' ? 'kn' : 'en')}
            aria-label={t.common.toggleLanguage}
            className="sm:hidden min-h-[40px] px-2.5 rounded-xl border border-[#DCE7F2] bg-[#F5F9FC] text-sm font-medium text-slate-700 flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Globe className="w-4 h-4 text-[#0369A1]" />
            <span>{language === 'en' ? 'KN' : 'EN'}</span>
          </button>

          <button
            type="button"
            onClick={() => setVoiceModalOpen(true)}
            aria-label={t.actions.voiceAssistant}
            className="min-h-[42px] px-3.5 py-2 rounded-xl border border-[#BAE6FD] bg-[#F0F9FF] text-[#0369A1] hover:bg-[#E0F2FE] text-sm font-semibold flex items-center gap-2 whitespace-nowrap shrink-0 transition-colors cursor-pointer"
          >
            <Mic className="w-4 h-4 shrink-0" />
            <span className="hidden md:inline">{t.actions.voiceAssistant}</span>
          </button>

          <button
            type="button"
            onClick={() => setSosModalOpen(true)}
            aria-label={t.actions.emergencySos}
            className="min-h-[42px] px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold flex items-center gap-2 whitespace-nowrap shrink-0 transition-colors cursor-pointer"
          >
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline">SOS</span>
          </button>

          <button
            type="button"
            onClick={() => navigateTo('login')}
            className="hidden xl:inline-flex min-h-[42px] px-3.5 py-2 rounded-xl border border-[#DCE7F2] bg-white hover:bg-[#F5F9FC] text-sm font-medium text-slate-700 whitespace-nowrap shrink-0 cursor-pointer"
          >
            {currentUser.name.split(' (')[0]}
          </button>
        </div>
      </div>
    </header>
  );
};
