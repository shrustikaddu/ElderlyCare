import React, { useMemo, useState } from 'react';
import { BookOpen, Info, Search } from 'lucide-react';
import { EmptyState, PageHeader } from '../components/common/UI';
import { useApp } from '../context/AppContext';
import { MEDICINE_CATALOGUE } from '../data/medicineCatalogue';
import { CatalogueForm } from '../types';

const FORMS: ('All' | CatalogueForm)[] = ['All', 'Tablet', 'Capsule', 'Syrup', 'Drops'];

export const CataloguePage: React.FC = () => {
  const { language, t } = useApp();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedForm, setSelectedForm] = useState<'All' | CatalogueForm>('All');

  const categories = useMemo(() => {
    const unique = Array.from(new Set(MEDICINE_CATALOGUE.map((item) => item.category)));
    return ['All', ...unique];
  }, []);

  const formLabels: Record<'All' | CatalogueForm, string> = {
    All: t.catalogue.formAll,
    Tablet: t.catalogue.formTablet,
    Capsule: t.catalogue.formCapsule,
    Syrup: t.catalogue.formSyrup,
    Drops: t.catalogue.formDrops,
  };

  const filtered = MEDICINE_CATALOGUE.filter((item) => {
    const q = search.trim().toLowerCase();
    const matchesSearch =
      !q ||
      item.brandName.toLowerCase().includes(q) ||
      item.genericName.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q);
    if (!matchesSearch) return false;
    if (selectedCategory !== 'All' && item.category !== selectedCategory) return false;
    if (selectedForm !== 'All' && item.form !== selectedForm) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <PageHeader title={t.catalogue.title} subtitle={t.catalogue.subtitle} />

      <div
        role="note"
        className="rounded-2xl border border-[#CBE2F5] bg-[#EFF7FD] p-5 flex items-start gap-3.5"
      >
        <Info className="w-5 h-5 text-[#0369A1] shrink-0 mt-0.5" />
        <div>
          <h2 className="text-sm font-bold text-sky-950">{t.catalogue.disclaimerTitle}</h2>
          <p className="mt-1 text-sm text-sky-900 leading-relaxed">{t.catalogue.disclaimerBody}</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.catalogue.searchPlaceholder}
            className="w-full min-h-[44px] pl-10 pr-4 py-2 rounded-xl border border-[#DCE7F2] bg-white text-sm text-slate-900 focus:outline-2 focus:outline-[#0369A1]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            aria-label={t.catalogue.categoryLabel}
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="min-h-[42px] px-3.5 py-2 rounded-xl border border-[#DCE7F2] bg-white text-sm font-medium text-slate-800"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'All' ? t.catalogue.categoryAll : cat}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-1 p-1 rounded-xl bg-[#EFF6FB] border border-[#DCE7F2] overflow-x-auto">
            {FORMS.map((form) => (
              <button
                key={form}
                type="button"
                onClick={() => setSelectedForm(form)}
                className={`min-h-[36px] px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap cursor-pointer ${
                  selectedForm === form
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {formLabels[form]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title={t.catalogue.emptyTitle}
          description={t.catalogue.emptyDesc}
          actionLabel={t.catalogue.formAll}
          onAction={() => {
            setSearch('');
            setSelectedCategory('All');
            setSelectedForm('All');
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map((item) => (
            <article
              key={item.id}
              className="ec-card rounded-2xl border border-[#DCE7F2] bg-white p-6 space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold text-[#0369A1]">
                    {item.category} · {formLabels[item.form]}
                  </p>
                  <h2 className="mt-1 text-lg font-bold text-slate-900">{item.genericName}</h2>
                  <p className="text-sm text-slate-600">{item.brandName}</p>
                </div>
                <BookOpen className="w-5 h-5 text-[#0369A1] shrink-0 mt-1" />
              </div>

              <p className="text-sm text-slate-700 leading-relaxed">
                {language === 'kn' ? item.summaryKn : item.summaryEn}
              </p>

              <dl className="space-y-2.5 pt-3 border-t border-slate-100 text-sm">
                <div>
                  <dt className="text-xs font-semibold text-slate-500">
                    {t.catalogue.strengthsLabel}
                  </dt>
                  <dd className="mt-0.5 text-slate-800 font-mono-num">{item.strengthOptions}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold text-slate-500">
                    {t.catalogue.precautionsLabel}
                  </dt>
                  <dd className="mt-0.5 text-slate-700">
                    {language === 'kn' ? item.precautionsKn : item.precautionsEn}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold text-slate-500">
                    {t.catalogue.storageLabel}
                  </dt>
                  <dd className="mt-0.5 text-slate-700">
                    {language === 'kn' ? item.storageNotesKn : item.storageNotesEn}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold text-slate-500">
                    {t.catalogue.sourceLabel}
                  </dt>
                  <dd className="mt-0.5 text-xs font-medium text-[#15803D]">
                    {item.verifiedSource}
                  </dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};
