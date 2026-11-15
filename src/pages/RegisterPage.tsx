import React, { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { PageHeader } from '../components/common/UI';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';

export const RegisterPage: React.FC = () => {
  const { registerUser, registeredUsers, navigateTo, t } = useApp();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('family');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name.trim() || !phone.trim() || !email.trim() || password.trim().length < 4) {
      setError(t.auth.errRegisterIncomplete);
      return;
    }
    registerUser({ name: name.trim(), phone: phone.trim(), email: email.trim(), role });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={t.nav.register}
        subtitle={t.auth.registerSubtitle}
        action={
          <button
            type="button"
            onClick={() => navigateTo('login')}
            className="min-h-[44px] px-4 py-2.5 rounded-xl border border-[#DCE7F2] bg-white hover:bg-[#F5F9FC] text-slate-800 font-semibold text-sm whitespace-nowrap cursor-pointer"
          >
            {t.auth.alreadyRegistered}
          </button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-7 ec-card rounded-2xl border border-[#DCE7F2] bg-white p-6 sm:p-8 space-y-4"
        >
          <h2 className="text-xl font-bold text-slate-900">{t.auth.registerHeading}</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="reg-fullname" className="block text-sm font-semibold text-slate-800 mb-1">
                {t.auth.fullName}
              </label>
              <input
                id="reg-fullname"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Meera Hegde"
                className="w-full min-h-[46px] px-3.5 py-2 rounded-xl border border-[#CBD8E6] text-base"
              />
            </div>

            <div>
              <label htmlFor="reg-phone-num" className="block text-sm font-semibold text-slate-800 mb-1">
                {t.auth.phone}
              </label>
              <input
                id="reg-phone-num"
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98450 00000"
                className="w-full min-h-[46px] px-3.5 py-2 rounded-xl border border-[#CBD8E6] text-base"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="reg-email-addr" className="block text-sm font-semibold text-slate-800 mb-1">
                {t.auth.emailLabel}
              </label>
              <input
                id="reg-email-addr"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="meera.demo@elderlycare.example"
                className="w-full min-h-[46px] px-3.5 py-2 rounded-xl border border-[#CBD8E6] text-base"
              />
            </div>

            <div>
              <label htmlFor="reg-user-role" className="block text-sm font-semibold text-slate-800 mb-1">
                {t.auth.selectRole}
              </label>
              <select
                id="reg-user-role"
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full min-h-[46px] px-3.5 py-2 rounded-xl border border-[#CBD8E6] bg-white text-base"
              >
                <option value="family">{t.roles.family}</option>
                <option value="caretaker">{t.roles.caretaker}</option>
                <option value="elderly">{t.roles.elderly}</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="reg-password" className="block text-sm font-semibold text-slate-800 mb-1">
              {t.auth.password}
            </label>
            <input
              id="reg-password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t.auth.passwordDemoLabel}
              className="w-full min-h-[46px] px-3.5 py-2 rounded-xl border border-[#CBD8E6] text-base"
            />
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full min-h-[48px] px-6 py-3 rounded-xl bg-[#15803D] hover:bg-[#166534] text-white font-semibold text-base flex items-center justify-center gap-2 cursor-pointer"
          >
            <UserPlus className="w-5 h-5" />
            <span>{t.auth.createEnterBtn}</span>
          </button>
        </form>

        <div className="lg:col-span-5 ec-card rounded-2xl border border-[#DCE7F2] bg-white p-6">
          <h3 className="text-base font-bold text-slate-900 mb-3">
            {t.auth.registeredUsersHeading} ({registeredUsers.length})
          </h3>
          <ul className="divide-y divide-slate-100 text-sm">
            {registeredUsers.map((u) => (
              <li key={u.id} className="py-2.5 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-semibold text-slate-900 truncate">{u.name}</p>
                  <p className="text-xs text-slate-500 truncate">{u.email}</p>
                </div>
                <span className="text-xs font-semibold text-[#0369A1] shrink-0">
                  {t.roles[u.role]}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
