import React, { useState } from 'react';
import { HeartPulse, LogIn, UserCheck, UserPlus, UserRound, Users } from 'lucide-react';
import { PageHeader } from '../components/common/UI';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';

export const AuthPage: React.FC = () => {
  const { currentUser, registeredUsers, loginDemoUser, loginWithEmail, registerUser, t } = useApp();
  const [tab, setTab] = useState<'login' | 'register'>('login');

  const [loginEmail, setLoginEmail] = useState(currentUser.email);
  const [loginPassword, setLoginPassword] = useState('demo1234');
  const [loginError, setLoginError] = useState('');

  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('family');
  const [regPassword, setRegPassword] = useState('');
  const [regError, setRegError] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    if (!loginEmail.trim() || !loginPassword.trim()) {
      setLoginError(t.auth.errLoginEmpty);
      return;
    }
    const ok = loginWithEmail(loginEmail);
    if (!ok) {
      setLoginError(t.auth.errLoginNotFound);
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');
    if (!regName.trim() || !regEmail.trim() || !regPhone.trim() || !regPassword.trim()) {
      setRegError(t.auth.errRegRequired);
      return;
    }
    registerUser({
      name: regName.trim(),
      email: regEmail.trim(),
      phone: regPhone.trim(),
      role: regRole,
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader title={t.nav.auth} subtitle={t.auth.authSubtitle} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 ec-card rounded-2xl border border-[#DCE7F2] bg-white p-6 sm:p-8">
          <div className="flex items-center gap-2 p-1 rounded-xl bg-[#F0F7FC] border border-[#DCE7F2] w-fit mb-6">
            <button
              type="button"
              onClick={() => setTab('login')}
              className={`min-h-[42px] px-5 py-2 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                tab === 'login' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.auth.tabSignIn}
            </button>
            <button
              type="button"
              onClick={() => setTab('register')}
              className={`min-h-[42px] px-5 py-2 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                tab === 'register' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.auth.tabCreateAccount}
            </button>
          </div>

          {tab === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-5">
              <div>
                <label htmlFor="login-email" className="block text-sm font-semibold text-slate-800 mb-1.5">
                  {t.auth.emailLabel}
                </label>
                <input
                  id="login-email"
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="ramesh.demo@elderlycare.example"
                  className="w-full min-h-[48px] px-4 py-2.5 rounded-xl border border-[#CBD8E6] bg-white text-base text-slate-900 focus:outline-2 focus:outline-[#0369A1]"
                />
              </div>

              <div>
                <label htmlFor="login-password" className="block text-sm font-semibold text-slate-800 mb-1.5">
                  {t.auth.passwordDemoLabel}
                </label>
                <input
                  id="login-password"
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full min-h-[48px] px-4 py-2.5 rounded-xl border border-[#CBD8E6] bg-white text-base text-slate-900 focus:outline-2 focus:outline-[#0369A1]"
                />
              </div>

              {loginError && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                  {loginError}
                </div>
              )}

              <button
                type="submit"
                className="w-full min-h-[48px] px-6 py-3 rounded-xl bg-[#0369A1] hover:bg-[#075985] text-white font-semibold text-base flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <LogIn className="w-5 h-5" />
                <span>{t.auth.signInDashboardBtn}</span>
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="reg-name" className="block text-sm font-semibold text-slate-800 mb-1.5">
                    {t.auth.fullName}
                  </label>
                  <input
                    id="reg-name"
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g., Priya Sharma"
                    className="w-full min-h-[46px] px-4 py-2 rounded-xl border border-[#CBD8E6] text-base text-slate-900 focus:outline-2 focus:outline-[#0369A1]"
                  />
                </div>
                <div>
                  <label htmlFor="reg-phone" className="block text-sm font-semibold text-slate-800 mb-1.5">
                    {t.auth.mobileLabel}
                  </label>
                  <input
                    id="reg-phone"
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="+91 98450 00000"
                    className="w-full min-h-[46px] px-4 py-2 rounded-xl border border-[#CBD8E6] text-base text-slate-900 focus:outline-2 focus:outline-[#0369A1]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="reg-email" className="block text-sm font-semibold text-slate-800 mb-1.5">
                    {t.auth.emailLabel}
                  </label>
                  <input
                    id="reg-email"
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="priya.demo@elderlycare.example"
                    className="w-full min-h-[46px] px-4 py-2 rounded-xl border border-[#CBD8E6] text-base text-slate-900 focus:outline-2 focus:outline-[#0369A1]"
                  />
                </div>
                <div>
                  <label htmlFor="reg-role" className="block text-sm font-semibold text-slate-800 mb-1.5">
                    {t.auth.careRoleLabel}
                  </label>
                  <select
                    id="reg-role"
                    value={regRole}
                    onChange={(e) => setRegRole(e.target.value as UserRole)}
                    className="w-full min-h-[46px] px-4 py-2 rounded-xl border border-[#CBD8E6] bg-white text-base text-slate-900 focus:outline-2 focus:outline-[#0369A1]"
                  >
                    <option value="elderly">{t.roles.elderly}</option>
                    <option value="family">{t.roles.family}</option>
                    <option value="caretaker">{t.roles.caretaker}</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="reg-pass" className="block text-sm font-semibold text-slate-800 mb-1.5">
                  {t.auth.createPasswordLabel}
                </label>
                <input
                  id="reg-pass"
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder={t.auth.passwordDemoLabel}
                  className="w-full min-h-[46px] px-4 py-2 rounded-xl border border-[#CBD8E6] text-base text-slate-900 focus:outline-2 focus:outline-[#0369A1]"
                />
              </div>

              {regError && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                  {regError}
                </div>
              )}

              <button
                type="submit"
                className="w-full min-h-[48px] px-6 py-3 rounded-xl bg-[#15803D] hover:bg-[#166534] text-white font-semibold text-base flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <UserPlus className="w-5 h-5" />
                <span>{t.auth.registerDemoBtn}</span>
              </button>
            </form>
          )}
        </div>

        <div className="lg:col-span-5 space-y-4">
          <div className="ec-card rounded-2xl border border-[#DCE7F2] bg-white p-6">
            <div className="flex items-center gap-2.5 mb-2">
              <HeartPulse className="w-5 h-5 text-[#0369A1]" />
              <h2 className="text-lg font-bold text-slate-900">{t.auth.quickSwitchHeading}</h2>
            </div>
            <p className="text-sm text-slate-600 mb-4">
              {t.auth.currentlyActive} <strong className="text-slate-900">{currentUser.name}</strong> ({t.roles[currentUser.role]})
            </p>

            <div className="space-y-3">
              <button
                type="button"
                onClick={() => loginDemoUser('elderly')}
                className="w-full min-h-[56px] p-4 rounded-xl border border-[#DCE7F2] bg-[#F5F9FC] hover:border-[#0369A1] text-left flex items-center gap-3.5 transition-colors cursor-pointer"
              >
                <UserRound className="w-6 h-6 text-[#0369A1] shrink-0" />
                <div>
                  <p className="font-semibold text-slate-900">{t.auth.signInAsElderly}</p>
                  <p className="text-xs text-slate-600">Sri Ramesh Rao · ramesh.demo@elderlycare.example</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => loginDemoUser('family')}
                className="w-full min-h-[56px] p-4 rounded-xl border border-[#DCE7F2] bg-[#F0FAF4] hover:border-[#15803D] text-left flex items-center gap-3.5 transition-colors cursor-pointer"
              >
                <Users className="w-6 h-6 text-[#15803D] shrink-0" />
                <div>
                  <p className="font-semibold text-slate-900">{t.auth.signInAsFamily}</p>
                  <p className="text-xs text-slate-600">Ananya Rao · ananya.demo@elderlycare.example</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => loginDemoUser('caretaker')}
                className="w-full min-h-[56px] p-4 rounded-xl border border-[#DCE7F2] bg-[#F5F9FC] hover:border-[#0369A1] text-left flex items-center gap-3.5 transition-colors cursor-pointer"
              >
                <UserCheck className="w-6 h-6 text-[#0369A1] shrink-0" />
                <div>
                  <p className="font-semibold text-slate-900">{t.auth.signInAsCaretaker}</p>
                  <p className="text-xs text-slate-600">Karthik Nair, RN · karthik.demo@elderlycare.example</p>
                </div>
              </button>
            </div>
          </div>

          <div className="ec-card rounded-2xl border border-[#DCE7F2] bg-white p-5">
            <h3 className="text-sm font-bold text-slate-900 mb-2">
              {t.auth.registeredAccountsHeading} ({registeredUsers.length})
            </h3>
            <ul className="divide-y divide-slate-100 text-sm">
              {registeredUsers.slice(0, 6).map((u) => (
                <li key={u.id} className="py-2 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <span className="truncate block font-medium text-slate-800">{u.name}</span>
                    <span className="truncate block text-xs text-slate-500">{u.email}</span>
                  </div>
                  <span className="text-xs text-slate-500 shrink-0">{t.roles[u.role]}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
