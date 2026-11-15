import React from 'react';
import { Eye, Globe, RotateCcw, Type, Volume2 } from 'lucide-react';
import { PageHeader } from '../components/common/UI';
import { useApp } from '../context/AppContext';
import { TextScale } from '../types';

export const SettingsPage: React.FC = () => {
  const {
    language,
    setLanguage,
    textScale,
    setTextScale,
    highContrast,
    setHighContrast,
    speakText,
    resetDemoData,
    showToast,
    t,
  } = useApp();

  return (
    <div className="space-y-6">
      <PageHeader title={t.nav.settings} subtitle={t.settings.subtitle} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="ec-card rounded-2xl border border-[#DCE7F2] bg-white p-6 space-y-5">
          <div className="flex items-center gap-2.5">
            <Globe className="w-5 h-5 text-[#0369A1]" />
            <h2 className="text-lg font-bold text-slate-900">{t.settings.langVoiceTitle}</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => {
                setLanguage('en');
                showToast('Language set to English.', 'info');
              }}
              className={`min-h-[60px] p-4 rounded-xl border text-left transition-colors cursor-pointer ${
                language === 'en'
                  ? 'border-[#0369A1] bg-[#F0F7FC] text-slate-900'
                  : 'border-[#DCE7F2] bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              <p className="font-bold text-base">{t.settings.englishTitle}</p>
              <p className="text-xs text-slate-600">{t.settings.englishDesc}</p>
            </button>

            <button
              type="button"
              onClick={() => {
                setLanguage('kn');
                showToast('ಭಾಷೆಯನ್ನು ಕನ್ನಡಕ್ಕೆ ಬದಲಾಯಿಸಲಾಗಿದೆ.', 'info');
              }}
              className={`min-h-[60px] p-4 rounded-xl border text-left transition-colors cursor-pointer ${
                language === 'kn'
                  ? 'border-[#0369A1] bg-[#F0F7FC] text-slate-900'
                  : 'border-[#DCE7F2] bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              <p className="font-bold text-base">{t.settings.kannadaTitle}</p>
              <p className="text-xs text-slate-600">{t.settings.kannadaDesc}</p>
            </button>
          </div>

          <button
            type="button"
            onClick={() =>
              speakText(
                language === 'kn'
                  ? 'ನಮಸ್ಕಾರ, ಇದು ಎಲ್ಡರ್ಲಿ ಕೇರ್ ಸ್ಮಾರ್ಟ್ ಆರೈಕೆ ವೇದಿಕೆ.'
                  : 'Hello, this is ElderlyCare smart medication assistant speaking clearly.',
                language
              )
            }
            className="min-h-[44px] px-4 py-2.5 rounded-xl border border-[#BAE6FD] bg-[#F0F9FF] hover:bg-[#E0F2FE] text-[#0369A1] font-semibold text-sm flex items-center gap-2 cursor-pointer"
          >
            <Volume2 className="w-4 h-4" />
            <span>
              {t.settings.testVoiceBtn} ({language === 'kn' ? 'ಕನ್ನಡ' : 'English'})
            </span>
          </button>
        </section>

        <section className="ec-card rounded-2xl border border-[#DCE7F2] bg-white p-6 space-y-5">
          <div className="flex items-center gap-2.5">
            <Type className="w-5 h-5 text-[#15803D]" />
            <h2 className="text-lg font-bold text-slate-900">{t.settings.readabilityTitle}</h2>
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-800 mb-2.5">
              {t.settings.textSizeLabel}
            </p>
            <div className="grid grid-cols-3 gap-2.5">
              {(
                [
                  { id: 'standard', label: t.settings.scaleStandard },
                  { id: 'large', label: t.settings.scaleLarge },
                  { id: 'xlarge', label: t.settings.scaleXlarge },
                ] as { id: TextScale; label: string }[]
              ).map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    setTextScale(opt.id);
                    showToast(
                      language === 'kn'
                        ? `ಪಠ್ಯ ಗಾತ್ರವನ್ನು ಬದಲಾಯಿಸಲಾಗಿದೆ: ${opt.label}`
                        : `Display text size changed to ${opt.label}.`,
                      'info'
                    );
                  }}
                  className={`min-h-[48px] px-3 py-2 rounded-xl border text-sm font-semibold transition-colors cursor-pointer ${
                    textScale === opt.id
                      ? 'border-[#15803D] bg-[#F0FAF4] text-[#15803D]'
                      : 'border-[#DCE7F2] bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <label className="flex items-center justify-between gap-4 p-4 rounded-xl border border-[#DCE7F2] bg-[#F5F9FC] cursor-pointer">
            <div className="flex items-center gap-3">
              <Eye className="w-5 h-5 text-slate-700 shrink-0" />
              <div>
                <p className="font-semibold text-slate-900">{t.settings.highContrastTitle}</p>
                <p className="text-xs text-slate-600">{t.settings.highContrastDesc}</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={highContrast}
              onChange={(e) => setHighContrast(e.target.checked)}
              className="w-5 h-5 accent-[#0369A1]"
            />
          </label>
        </section>

        <section className="lg:col-span-2 ec-card rounded-2xl border border-[#DCE7F2] bg-white p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">{t.settings.demoControlsTitle}</h2>
            <p className="mt-1 text-sm text-slate-600">{t.settings.demoControlsDesc}</p>
          </div>
          <button
            type="button"
            onClick={resetDemoData}
            className="min-h-[44px] px-5 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{t.actions.resetDemo}</span>
          </button>
        </section>
      </div>
    </div>
  );
};
