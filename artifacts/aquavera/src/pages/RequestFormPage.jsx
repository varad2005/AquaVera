import { useState, useRef, useEffect } from 'react';
import { Camera, Upload, MapPin, CheckCircle, AlertTriangle } from 'lucide-react';
import { useLang } from '../context/LangContext';
import { useApp } from '../context/AppContext';
import { useLocation } from 'wouter';
import GovLayout from '../components/GovLayout';
import { calculateAreaBill, getAreaRate, formatCurrency } from '../utils/billing';

const CROP_KEYS = ['foodGrains', 'sugarcane', 'banana', 'cotton', 'horticulture'];
const SEASON_KEYS = ['kharif', 'rabi', 'hotWeather'];

export default function RequestFormPage() {
  const { t } = useLang();
  const { profile, addRequest } = useApp();
  const [, navigate] = useLocation();

  const [cropKey, setCropKey] = useState('');
  const [seasonKey, setSeasonKey] = useState('');
  const [duration, setDuration] = useState('');
  const [imageUrl, setImageUrl] = useState(null);
  const [errors, setErrors] = useState({});
  const [phase, setPhase] = useState(null);
  const [result, setResult] = useState(null);
  const [calculatedBill, setCalculatedBill] = useState(0);

  const cameraRef = useRef();
  const galleryRef = useRef();

  useEffect(() => {
    if (cropKey && seasonKey && profile.landArea) {
      setCalculatedBill(calculateAreaBill(cropKey, seasonKey, profile.landArea));
    } else {
      setCalculatedBill(0);
    }
  }, [cropKey, seasonKey, profile.landArea]);

  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (file) setImageUrl(URL.createObjectURL(file));
  };

  const validate = () => {
    const e = {};
    if (!cropKey) e.crop = t('cropRequired');
    if (!seasonKey) e.season = t('seasonRequired');
    if (!duration || parseInt(duration) < 1) e.duration = t('durationRequired');
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setErrors({});
    setPhase('verifying');
    setTimeout(() => {
      const approved = Math.random() < 0.7;
      setResult(approved ? 'Approved' : 'Needs Review');
      setPhase('result');
    }, 2000);
  };

  const handleGoToDashboard = () => {
    addRequest({
      id: 'REQ-' + Date.now(),
      cropKey, seasonKey,
      duration: parseInt(duration),
      landArea: profile.landArea,
      imageUrl: imageUrl || null,
      status: result,
      billAmount: calculatedBill,
      paid: false,
      date: new Date().toISOString().split('T')[0],
      beneficiaryType: profile.beneficiaryType,
      waterSource: profile.waterSource
    });
    navigate('/dashboard');
  };

  const clrErr = (key) => setErrors(err => { const n = {...err}; delete n[key]; return n; });
  const showBillPreview = cropKey && seasonKey;

  const inputCls = "w-full border border-[#C7D0C9] rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D47A1] bg-white";
  const labelCls = "block text-xs font-semibold text-[#374151] mb-1 uppercase tracking-wide";
  const errCls = "text-xs text-[#B91C1C] mt-1";

  return (
    <GovLayout active="requests">
      <div className="p-6">
        <div className="mb-5">
          <h1 className="text-lg font-bold text-[#0F172A]">{t('requestFormTitle')}</h1>
          <p className="text-xs text-[#6B7280] mt-0.5">Submit a new irrigation water request for AI verification</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-white rounded-lg border border-[#C7D0C9] p-5">
              <h2 className="text-xs font-bold text-[#0F172A] uppercase tracking-wide mb-4 pb-2 border-b border-[#C7D0C9]">Crop & Season Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>{t('cropTypeLabel')}</label>
                  <select
                    value={cropKey}
                    onChange={e => { setCropKey(e.target.value); clrErr('crop'); }}
                    className={inputCls}
                  >
                    <option value="">{t('cropTypePlaceholder')}</option>
                    {CROP_KEYS.map(k => <option key={k} value={k}>{t(k)}</option>)}
                  </select>
                  {errors.crop && <p className={errCls}>{errors.crop}</p>}
                </div>

                <div>
                  <label className={labelCls}>{t('durationLabel')}</label>
                  <input
                    type="number" min={1} max={365}
                    placeholder={t('durationPlaceholder')}
                    value={duration}
                    onChange={e => { setDuration(e.target.value); clrErr('duration'); }}
                    className={inputCls}
                  />
                  <p className="text-xs text-[#6B7280] mt-1">{t('durationHelper')}</p>
                  {errors.duration && <p className={errCls}>{errors.duration}</p>}
                </div>

                <div className="sm:col-span-2">
                  <label className={labelCls}>{t('seasonLabel')}</label>
                  <div className="flex gap-2">
                    {SEASON_KEYS.map(k => (
                      <button
                        key={k}
                        onClick={() => { setSeasonKey(k); clrErr('season'); }}
                        className={`flex-1 rounded px-3 py-2 text-sm font-medium transition-colors border
                          ${seasonKey === k
                            ? 'bg-[#0D47A1] text-white border-[#0D47A1]'
                            : 'bg-white text-[#374151] border-[#C7D0C9] hover:bg-[#F1F5F2]'
                          }`}
                      >
                        {t(k)}
                      </button>
                    ))}
                  </div>
                  {errors.season && <p className={errCls}>{errors.season}</p>}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-[#C7D0C9] p-5">
              <h2 className="text-xs font-bold text-[#0F172A] uppercase tracking-wide mb-4 pb-2 border-b border-[#C7D0C9]">Land Record (Auto-filled)</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>{t('landId')}</label>
                  <input readOnly value={profile.landId || '—'} className={`${inputCls} bg-[#F8FAFC] text-[#6B7280]`} />
                </div>
                <div>
                  <label className={labelCls}>{t('landArea')}</label>
                  <input readOnly value={profile.landArea ? `${profile.landArea} ${t('hectares')}` : '—'} className={`${inputCls} bg-[#F8FAFC] text-[#6B7280]`} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-[#C7D0C9] p-5">
              <h2 className="text-xs font-bold text-[#0F172A] uppercase tracking-wide mb-4 pb-2 border-b border-[#C7D0C9]">{t('uploadPhotoLabel')}</h2>
              <p className="text-xs text-[#6B7280] mb-3">{t('uploadPhotoHelper')}</p>

              {imageUrl ? (
                <div>
                  <img src={imageUrl} alt="field" className="w-full rounded max-h-48 object-cover border border-[#C7D0C9]" />
                  <button onClick={() => setImageUrl(null)} className="mt-2 text-xs text-[#0D47A1] font-medium hover:underline">
                    {t('changePhoto')}
                  </button>
                </div>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={() => cameraRef.current?.click()}
                    className="flex-1 flex items-center justify-center gap-2 bg-white border border-[#C7D0C9] rounded py-2.5 text-sm text-[#374151] hover:bg-[#F1F5F2] transition-colors"
                  >
                    <Camera size={15} />
                    {t('openCamera')}
                  </button>
                  <button
                    onClick={() => galleryRef.current?.click()}
                    className="flex-1 flex items-center justify-center gap-2 bg-white border border-[#C7D0C9] rounded py-2.5 text-sm text-[#374151] hover:bg-[#F1F5F2] transition-colors"
                  >
                    <Upload size={15} />
                    {t('uploadFromGallery')}
                  </button>
                </div>
              )}

              <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleImage} />
              <input ref={galleryRef} type="file" accept="image/*" className="hidden" onChange={handleImage} />

              <div className="flex items-center gap-2 mt-3 text-xs text-[#6B7280]">
                <MapPin size={12} className="flex-shrink-0" />
                <span>{t('geoTagLabel')}: {t('geoTagValue')} — {t('geoTagNote')}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {showBillPreview && (
              <div className="bg-white rounded-lg border-2 border-[#1B5E20] p-4">
                <p className="text-xs font-bold text-[#4B5563] uppercase tracking-wide mb-2">{t('billPreviewTitle')}</p>
                <p className="text-3xl font-bold text-[#1B5E20]">{formatCurrency(calculatedBill)}</p>
                <p className="text-xs text-[#6B7280] mt-1">
                  {t('rateApplied')}: ₹{getAreaRate(cropKey, seasonKey)} {t('perHectare')}
                </p>
                <p className="text-xs text-[#6B7280] mt-2 border-t border-[#C7D0C9] pt-2">{t('billPreviewNote')}</p>
              </div>
            )}

            <div className="bg-white rounded-lg border border-[#C7D0C9] p-4">
              <p className="text-xs font-bold text-[#0F172A] uppercase tracking-wide mb-3">Submission Checklist</p>
              <ul className="space-y-2 text-xs text-[#4B5563]">
                {[
                  { label: 'Crop type selected', done: !!cropKey },
                  { label: 'Season selected', done: !!seasonKey },
                  { label: 'Duration entered', done: !!duration && parseInt(duration) > 0 },
                  { label: 'Photo uploaded', done: !!imageUrl },
                ].map(({ label, done }) => (
                  <li key={label} className="flex items-center gap-2">
                    <span className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 text-xs ${done ? 'bg-[#2E7D32] border-[#2E7D32] text-white' : 'border-[#C7D0C9]'}`}>
                      {done && '✓'}
                    </span>
                    <span className={done ? 'text-[#2E7D32]' : ''}>{label}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={handleSubmit}
              className="w-full bg-[#1B5E20] text-white rounded px-4 py-3 text-sm font-bold hover:bg-[#154a19] transition-colors uppercase tracking-wide"
            >
              {t('submitRequest')}
            </button>
          </div>
        </div>
      </div>

      {phase === 'verifying' && (
        <div className="fixed inset-0 bg-white/90 z-50 flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-full border-4 border-[#E3F2FD] border-t-[#0D47A1] animate-spin" />
          <p className="text-lg font-semibold mt-6 text-[#0F172A]">{t('aiVerifyingTitle')}</p>
          <p className="text-sm text-[#6B7280] text-center px-8 mt-2">{t('aiVerifyingSubtitle')}</p>
        </div>
      )}

      {phase === 'result' && result && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-6">
          <div className="bg-white max-w-sm w-full rounded-lg p-8 text-center shadow-xl border border-[#C7D0C9]">
            {result === 'Approved' ? (
              <>
                <CheckCircle size={48} className="text-[#2E7D32] mx-auto" />
                <h2 className="text-xl font-bold mt-4 text-[#0F172A]">{t('approvedTitle')}</h2>
                <p className="text-sm text-[#6B7280] mt-2">{t('approvedMessage')}</p>
              </>
            ) : (
              <>
                <AlertTriangle size={48} className="text-[#B45309] mx-auto" />
                <h2 className="text-xl font-bold mt-4 text-[#B45309]">{t('reviewTitle')}</h2>
                <p className="text-sm text-[#6B7280] mt-2">{t('reviewMessage')}</p>
              </>
            )}
            <hr className="mt-4 border-[#C7D0C9]" />
            <p className="text-xs uppercase text-[#6B7280] mt-4 tracking-wide">{t('estimatedBill')}</p>
            <p className="text-2xl font-bold text-[#1B5E20] mt-1">{formatCurrency(calculatedBill)}</p>
            <button
              onClick={handleGoToDashboard}
              className="w-full bg-[#1B5E20] text-white rounded px-6 py-3 font-bold hover:bg-[#154a19] transition-colors mt-6 uppercase tracking-wide text-sm"
            >
              {t('goToDashboard')}
            </button>
          </div>
        </div>
      )}
    </GovLayout>
  );
}
