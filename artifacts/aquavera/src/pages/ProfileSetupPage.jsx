import { useState } from 'react';
import { useLang } from '../context/LangContext';
import { useApp } from '../context/AppContext';
import { useLocation } from 'wouter';
import Header from '../components/Header';

export default function ProfileSetupPage() {
  const { t } = useLang();
  const { setProfile } = useApp();
  const [, navigate] = useLocation();

  const [form, setForm] = useState({
    name: '',
    aadhaar: '',
    landId: '',
    landArea: '',
    beneficiaryType: 'wua',
    waterSource: ''
  });
  const [errors, setErrors] = useState({});

  const waterSourceOptions = [
    { key: 'assuredMajor', label: t('assuredMajorReservoir') },
    { key: 'assuredMedium', label: t('assuredMediumCanal') },
    { key: 'regulatedLoss', label: t('regulatedWithLoss') },
    { key: 'partlyRegulated', label: t('partlyRegulated') },
    { key: 'userMaintained', label: t('userMaintainedReservoir') },
  ];

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = t('fieldRequired');
    if (!/^\d{4}$/.test(form.aadhaar)) e.aadhaar = t('invalidAadhaar');
    if (!form.landId.trim()) e.landId = t('fieldRequired');
    if (!form.landArea || isNaN(parseFloat(form.landArea)) || parseFloat(form.landArea) <= 0) e.landArea = t('fieldRequired');
    if (form.beneficiaryType === 'individual' && !form.waterSource) e.waterSource = t('fieldRequired');
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }
    setProfile({
      name: form.name,
      aadhaar: form.aadhaar,
      landId: form.landId,
      landArea: parseFloat(form.landArea),
      beneficiaryType: form.beneficiaryType,
      waterSource: form.beneficiaryType === 'individual' ? form.waterSource : null,
    });
    navigate('/dashboard');
  };

  const field = (key, val) => {
    setForm(f => ({ ...f, [key]: val }));
    if (errors[key]) setErrors(e => { const n = { ...e }; delete n[key]; return n; });
  };

  return (
    <div className="min-h-screen bg-[#F4F6F4]">
      <div className="max-w-[480px] mx-auto bg-white min-h-screen flex flex-col">
        <Header title={t('profileSetupTitle')} />

        <div className="flex-1 px-5 py-5 pb-28 overflow-y-auto">
          <p className="text-sm text-[#9CA3AF] mb-6">{t('profileSetupSubtitle')}</p>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-[#4B5563] mb-1.5">{t('fullNameLabel')}</label>
              <input
                type="text"
                placeholder={t('fullNamePlaceholder')}
                value={form.name}
                onChange={e => field('name', e.target.value)}
                className="w-full border border-[#D1D9D4] rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#1B5E37] bg-white"
              />
              {errors.name && <p className="text-xs text-[#991B1B] mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#4B5563] mb-1.5">{t('aadhaarLabel')}</label>
              <input
                type="number"
                maxLength={4}
                placeholder={t('aadhaarPlaceholder')}
                value={form.aadhaar}
                onChange={e => field('aadhaar', e.target.value.slice(0, 4))}
                className="w-full border border-[#D1D9D4] rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#1B5E37] bg-white"
              />
              {errors.aadhaar && <p className="text-xs text-[#991B1B] mt-1">{errors.aadhaar}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#4B5563] mb-1.5">{t('landIdLabel')}</label>
              <input
                type="text"
                placeholder={t('landIdPlaceholder')}
                value={form.landId}
                onChange={e => field('landId', e.target.value)}
                className="w-full border border-[#D1D9D4] rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#1B5E37] bg-white"
              />
              {errors.landId && <p className="text-xs text-[#991B1B] mt-1">{errors.landId}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#4B5563] mb-1.5">{t('landAreaLabel')}</label>
              <input
                type="number"
                placeholder={t('landAreaPlaceholder')}
                value={form.landArea}
                onChange={e => field('landArea', e.target.value)}
                className="w-full border border-[#D1D9D4] rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#1B5E37] bg-white"
                step="0.1"
                min="0"
              />
              {errors.landArea && <p className="text-xs text-[#991B1B] mt-1">{errors.landArea}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#4B5563] mb-2">{t('beneficiaryTypeLabel')}</label>
              <div className="flex gap-3">
                {[
                  { val: 'wua', label: t('registeredWUA') },
                  { val: 'individual', label: t('individualBeneficiary') },
                ].map(({ val, label }) => (
                  <button
                    key={val}
                    onClick={() => { field('beneficiaryType', val); field('waterSource', ''); }}
                    className={`flex-1 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors border text-center
                      ${form.beneficiaryType === val
                        ? 'bg-[#1B5E37] text-white border-[#1B5E37]'
                        : 'bg-white text-[#4B5563] border-[#D1D9D4]'
                      }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {form.beneficiaryType === 'individual' && (
              <div>
                <label className="block text-sm font-medium text-[#4B5563] mb-1.5">{t('waterSourceLabel')}</label>
                <select
                  value={form.waterSource}
                  onChange={e => field('waterSource', e.target.value)}
                  className="w-full border border-[#D1D9D4] rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#1B5E37] bg-white"
                >
                  <option value="">{t('cropTypePlaceholder')}</option>
                  {waterSourceOptions.map(({ key, label }) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
                {errors.waterSource && <p className="text-xs text-[#991B1B] mt-1">{errors.waterSource}</p>}
              </div>
            )}
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 max-w-[480px] mx-auto px-5 py-4 bg-white border-t border-[#D1D9D4]">
          <button
            onClick={handleSave}
            className="w-full bg-[#1B5E37] text-white rounded-xl px-6 py-3.5 font-semibold hover:bg-[#154d2e] transition-colors"
          >
            {t('saveProfile')}
          </button>
        </div>
      </div>
    </div>
  );
}
