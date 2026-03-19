import { useState } from 'react';
import { Droplets, Globe } from 'lucide-react';
import { useLang } from '../context/LangContext';
import { useApp } from '../context/AppContext';
import { useLocation } from 'wouter';

export default function ProfileSetupPage() {
  const { t, cycleLang } = useLang();
  const { setProfile } = useApp();
  const [, navigate] = useLocation();

  const [form, setForm] = useState({
    name: '', aadhaar: '', landId: '', landArea: '',
    beneficiaryType: 'wua', waterSource: ''
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
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setProfile({
      name: form.name, aadhaar: form.aadhaar,
      landId: form.landId, landArea: parseFloat(form.landArea),
      beneficiaryType: form.beneficiaryType,
      waterSource: form.beneficiaryType === 'individual' ? form.waterSource : null,
    });
    navigate('/dashboard');
  };

  const field = (key, val) => {
    setForm(f => ({ ...f, [key]: val }));
    if (errors[key]) setErrors(e => { const n = { ...e }; delete n[key]; return n; });
  };

  const inputCls = "w-full border border-[#C7D0C9] rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D47A1] bg-white";
  const labelCls = "block text-xs font-semibold text-[#374151] mb-1 uppercase tracking-wide";
  const errCls = "text-xs text-[#B91C1C] mt-1";

  return (
    <div className="min-h-screen bg-[#F1F5F2] flex flex-col">
      <div className="bg-[#0D47A1] text-white py-3 px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Droplets size={18} />
          <span className="text-sm font-bold tracking-wide">{t('appName')}</span>
        </div>
        <button
          onClick={cycleLang}
          className="flex items-center gap-1.5 text-xs font-semibold border border-blue-300 rounded px-2.5 py-1 hover:bg-blue-700 transition-colors"
        >
          <Globe size={13} />
          {t('langLabel')}
        </button>
      </div>

      <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-8">
        <div className="mb-5">
          <h1 className="text-lg font-bold text-[#0F172A]">{t('profileSetupTitle')}</h1>
          <p className="text-xs text-[#6B7280] mt-0.5">{t('profileSetupSubtitle')}</p>
        </div>

        <div className="bg-white rounded-lg border border-[#C7D0C9] overflow-hidden">
          <div className="bg-[#F8FAFC] px-5 py-3 border-b border-[#C7D0C9]">
            <p className="text-xs font-bold text-[#0F172A] uppercase tracking-wide">Personal & Land Information</p>
          </div>
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>{t('fullNameLabel')}</label>
                <input type="text" placeholder={t('fullNamePlaceholder')} value={form.name}
                  onChange={e => field('name', e.target.value)} className={inputCls} />
                {errors.name && <p className={errCls}>{errors.name}</p>}
              </div>
              <div>
                <label className={labelCls}>{t('aadhaarLabel')}</label>
                <input type="number" maxLength={4} placeholder={t('aadhaarPlaceholder')} value={form.aadhaar}
                  onChange={e => field('aadhaar', e.target.value.slice(0, 4))} className={inputCls} />
                {errors.aadhaar && <p className={errCls}>{errors.aadhaar}</p>}
              </div>
              <div>
                <label className={labelCls}>{t('landIdLabel')}</label>
                <input type="text" placeholder={t('landIdPlaceholder')} value={form.landId}
                  onChange={e => field('landId', e.target.value)} className={inputCls} />
                {errors.landId && <p className={errCls}>{errors.landId}</p>}
              </div>
              <div>
                <label className={labelCls}>{t('landAreaLabel')}</label>
                <input type="number" placeholder={t('landAreaPlaceholder')} value={form.landArea}
                  onChange={e => field('landArea', e.target.value)} className={inputCls} step="0.1" min="0" />
                {errors.landArea && <p className={errCls}>{errors.landArea}</p>}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-[#C7D0C9] overflow-hidden mt-4">
          <div className="bg-[#F8FAFC] px-5 py-3 border-b border-[#C7D0C9]">
            <p className="text-xs font-bold text-[#0F172A] uppercase tracking-wide">Beneficiary Classification</p>
          </div>
          <div className="p-5 space-y-4">
            <div>
              <label className={labelCls}>{t('beneficiaryTypeLabel')}</label>
              <div className="flex gap-3">
                {[{ val: 'wua', label: t('registeredWUA') }, { val: 'individual', label: t('individualBeneficiary') }].map(({ val, label }) => (
                  <button key={val} onClick={() => { field('beneficiaryType', val); field('waterSource', ''); }}
                    className={`flex-1 rounded px-3 py-2 text-sm font-medium transition-colors border text-center
                      ${form.beneficiaryType === val
                        ? 'bg-[#0D47A1] text-white border-[#0D47A1]'
                        : 'bg-white text-[#374151] border-[#C7D0C9] hover:bg-[#F1F5F2]'
                      }`}>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {form.beneficiaryType === 'individual' && (
              <div>
                <label className={labelCls}>{t('waterSourceLabel')}</label>
                <select value={form.waterSource} onChange={e => field('waterSource', e.target.value)} className={inputCls}>
                  <option value="">{t('cropTypePlaceholder')}</option>
                  {waterSourceOptions.map(({ key, label }) => <option key={key} value={key}>{label}</option>)}
                </select>
                {errors.waterSource && <p className={errCls}>{errors.waterSource}</p>}
              </div>
            )}
          </div>
        </div>

        <div className="mt-5">
          <button
            onClick={handleSave}
            className="w-full bg-[#1B5E20] text-white rounded px-4 py-3 text-sm font-bold hover:bg-[#154a19] transition-colors uppercase tracking-wide"
          >
            {t('saveProfile')}
          </button>
        </div>
      </div>
    </div>
  );
}
