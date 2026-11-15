import React, { useState } from 'react';
import { LogIn, UserCheck, UserRound, Users } from 'lucide-react';
import { PageHeader } from '../components/common/UI';
import { useApp } from '../context/AppContext';

export const LoginPage: React.FC = () => {
  const { currentUser, loginDemoUser, loginWithEmail, navigateTo, t } = useApp();
  const [email, setEmail] = useState(currentUser.email);
  const [password, setPassword] = useState('demo1234');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password.trim()) {
      setError(t.auth.errLoginEmpty);
      return;
    }
    const ok = loginWithEmail(email);
    if (!ok) {
      setError(t.auth.errLoginNotFound);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={t.nav.login}
        subtitle={t.auth.loginSubtitle}
        action={
          <button
            type="button"
            onClick={() => navigateTo('register')}
            className="min-h-[44px] px-4 py-2.5 rounded-xl border border-[#BAE6FD] bg-[#F0F9FF] hover:bg-[#E0F2FE] text-[#0369A1] font-semibold text-sm whitespace-nowrap cursor-pointer"
          >
            {t.auth.newAccountRegister}
          </button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-6 ec-card rounded-2xl border border-[#DCE7F2] bg-white p-6 sm:p-8 space-y-5"
        >
          <h2 className="text-xl font-bold text-slate-900">{t.auth.signInEmailHeading}</h2>

          <div>
            <label htmlFor="page-login-email" className="block text-sm font-semibold text-slate-800 mb-1.5">
              {t.auth.emailLabel}
            </label>
            <input
              id="page-login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full min-h-[48px] px-4 py-2.5 rounded-xl border border-[#CBD8E6] text-base"
            />
          </div>

          <div>
            <label htmlFor="page-login-pass" className="block text-sm font-semibold text-slate-800 mb-1.5">
              {t.auth.passwordDemoLabel}
            </label>
            <input
              id="page-login-pass"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full min-h-[48px] px-4 py-2.5 rounded-xl border border-[#CBD8E6] text-base"
            />
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full min-h-[48px] px-6 py-3 rounded-xl bg-[#0369A1] hover:bg-[#075985] text-white font-semibold text-base flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogIn className="w-5 h-5" />
            <span>{t.auth.signInBtn}</span>
          </button>
        </form>

        <div className="lg:col-span-6 ec-card rounded-2xl border border-[#DCE7F2] bg-white p-6 space-y-3">
          <h2 className="text-lg font-bold text-slate-900">{t.auth.quickRoleHeading}</h2>
          <p className="text-sm text-slate-600">
            {t.auth.activeSessionLabel} <strong>{currentUser.name}</strong> ({t.roles[currentUser.role]})
          </p>

          <button
            type="button"
            onClick={() => loginDemoUser('family')}
            className="w-full min-h-[60px] p-4 rounded-xl border border-[#C6EBD4] bg-[#F0FAF4] hover:border-[#15803D] text-left flex items-center gap-3.5 cursor-pointer"
          >
            <Users className="w-6 h-6 text-[#15803D] shrink-0" />
            <div>
              <p className="font-semibold text-slate-900">{t.auth.roleFamilyTitle}</p>
              <p className="text-xs text-slate-600">{t.auth.roleFamilyDesc}</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => loginDemoUser('caretaker')}
            className="w-full min-h-[60px] p-4 rounded-xl border border-[#DCE7F2] bg-[#F5F9FC] hover:border-[#0369A1] text-left flex items-center gap-3.5 cursor-pointer"
          >
            <UserCheck className="w-6 h-6 text-[#0369A1] shrink-0" />
            <div>
              <p className="font-semibold text-slate-900">{t.auth.roleCaretakerTitle}</p>
              <p className="text-xs text-slate-600">{t.auth.roleCaretakerDesc}</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => loginDemoUser('elderly')}
            className="w-full min-h-[60px] p-4 rounded-xl border border-[#DCE7F2] bg-[#F5F9FC] hover:border-[#0369A1] text-left flex items-center gap-3.5 cursor-pointer"
          >
            <UserRound className="w-6 h-6 text-[#0369A1] shrink-0" />
            <div>
              <p className="font-semibold text-slate-900">{t.auth.roleElderlyTitle}</p>
              <p className="text-xs text-slate-600">{t.auth.roleElderlyDesc}</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
