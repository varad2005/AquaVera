import { useState, useRef, useEffect } from 'react';
import { Camera, Upload, MapPin, CheckCircle, AlertTriangle } from 'lucide-react';
import { useLang } from '../context/LangContext';
import { useApp } from '../context/AppContext';
import { useLocation } from 'wouter';
import Header from '../components/Header';
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
    if (file) {
      setImageUrl(URL.createObjectURL(file));
    }
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
    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }
    setErrors({});
    setPhase('verifying');

    setTimeout(() => {
      const approved = Math.random() < 0.7;
      const status = approved ? 'Approved' : 'Needs Review';
      setResult(status);
      setPhase('result');
    }, 2000);
  };

  const handleGoToDashboard = () => {
    addRequest({
      id: 'REQ-' + Date.now(),
      cropKey,
      seasonKey,
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

  const showBillPreview = cropKey && seasonKey;

  return (
    <div className="min-h-screen bg-[#F4F6F4]">
      <div className="max-w-[480px] mx-auto bg-white min-h-screen flex flex-col relative">
        <Header title={t('requestFormTitle')} showBack />

        <div className="flex-1 px-5 py-5 pb-28 overflow-y-auto space-y-5">
          <div>
            <label className="block text-sm font-medium text-[#4B5563] mb-1.5">{t('cropTypeLabel')}</label>
            <select
              value={cropKey}
              onChange={e => { setCropKey(e.target.value); setErrors(err => { const n = {...err}; delete n.crop; return n; }); }}
              className="w-full border border-[#D1D9D4] rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#1B5E37] bg-white"
            >
              <option value="">{t('cropTypePlaceholder')}</option>
              {CROP_KEYS.map(k => (
                <option key={k} value={k}>{t(k)}</option>
              ))}
            </select>
            {errors.crop && <p className="text-xs text-[#991B1B] mt-1">{errors.crop}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#4B5563] mb-2">{t('seasonLabel')}</label>
            <div className="flex gap-2">
              {SEASON_KEYS.map(k => (
                <button
                  key={k}
                  onClick={() => { setSeasonKey(k); setErrors(err => { const n = {...err}; delete n.season; return n; }); }}
                  className={`flex-1 rounded-xl px-2 py-2.5 text-sm font-medium transition-colors border
                    ${seasonKey === k
                      ? 'bg-[#1B5E37] text-white border-[#1B5E37]'
                      : 'bg-white text-[#4B5563] border-[#D1D9D4]'
                    }`}
                >
                  {t(k)}
                </button>
              ))}
            </div>
            {errors.season && <p className="text-xs text-[#991B1B] mt-1">{errors.season}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#4B5563] mb-1.5">{t('durationLabel')}</label>
            <input
              type="number"
              min={1}
              max={365}
              placeholder={t('durationPlaceholder')}
              value={duration}
              onChange={e => { setDuration(e.target.value); setErrors(err => { const n = {...err}; delete n.duration; return n; }); }}
              className="w-full border border-[#D1D9D4] rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#1B5E37] bg-white"
            />
            <p className="text-xs text-[#9CA3AF] mt-1">{t('durationHelper')}</p>
            {errors.duration && <p className="text-xs text-[#991B1B] mt-1">{errors.duration}</p>}
          </div>

          <div className="bg-[#F4F6F4] rounded-xl p-4">
            <p className="text-sm font-medium text-[#4B5563] mb-2">{t('selectedLand')}</p>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-[#9CA3AF]">{t('landId')}</span>
                <span className="font-medium text-[#111827]">{profile.landId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#9CA3AF]">{t('landArea')}</span>
                <span className="font-medium text-[#111827]">{profile.landArea} {t('hectares')}</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#4B5563] mb-1.5">{t('uploadPhotoLabel')}</label>
            <p className="text-xs text-[#9CA3AF] mb-3">{t('uploadPhotoHelper')}</p>

            {imageUrl ? (
              <div>
                <img
                  src={imageUrl}
                  alt="field"
                  className="w-full rounded-xl max-h-52 object-cover"
                />
                <button
                  onClick={() => setImageUrl(null)}
                  className="mt-2 text-sm text-[#1B5E37] font-medium hover:underline"
                >
                  {t('changePhoto')}
                </button>
              </div>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={() => cameraRef.current?.click()}
                  className="flex-1 flex items-center justify-center gap-2 bg-white border border-[#D1D9D4] rounded-xl py-3 text-sm font-medium text-[#4B5563] hover:bg-[#F4F6F4] transition-colors"
                >
                  <Camera size={16} />
                  {t('openCamera')}
                </button>
                <button
                  onClick={() => galleryRef.current?.click()}
                  className="flex-1 flex items-center justify-center gap-2 bg-white border border-[#D1D9D4] rounded-xl py-3 text-sm font-medium text-[#4B5563] hover:bg-[#F4F6F4] transition-colors"
                >
                  <Upload size={16} />
                  {t('uploadFromGallery')}
                </button>
              </div>
            )}

            <input
              ref={cameraRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handleImage}
            />
            <input
              ref={galleryRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImage}
            />

            <div className="flex items-center gap-2 mt-3">
              <MapPin size={12} className="text-[#9CA3AF] flex-shrink-0" />
              <div>
                <span className="text-xs text-[#4B5563] font-medium">{t('geoTagLabel')}: </span>
                <span className="text-xs text-[#4B5563]">{t('geoTagValue')}</span>
                <p className="text-xs text-[#9CA3AF]">{t('geoTagNote')}</p>
              </div>
            </div>
          </div>

          {showBillPreview && (
            <div className="bg-[#E8F5EE] border border-[#1B5E37] rounded-2xl p-4">
              <p className="text-sm font-medium text-[#4B5563] uppercase tracking-wide mb-2">{t('billPreviewTitle')}</p>
              <p className="text-2xl font-bold text-[#1B5E37]">{formatCurrency(calculatedBill)}</p>
              <p className="text-xs text-[#9CA3AF] mt-1">
                {t('rateApplied')}: ₹{getAreaRate(cropKey, seasonKey)} {t('perHectare')}
              </p>
              <p className="text-xs text-[#9CA3AF] mt-2">{t('billPreviewNote')}</p>
            </div>
          )}
        </div>

        <div className="fixed bottom-0 left-0 right-0 max-w-[480px] mx-auto px-5 py-4 bg-white border-t border-[#D1D9D4]">
          <button
            onClick={handleSubmit}
            className="w-full bg-[#1B5E37] text-white rounded-xl px-6 py-3.5 font-semibold hover:bg-[#154d2e] transition-colors"
          >
            {t('submitRequest')}
          </button>
        </div>

        {phase === 'verifying' && (
          <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-full border-4 border-[#E8F5EE] border-t-[#1B5E37] animate-spin" />
            <p className="text-lg font-semibold mt-6 text-[#111827]">{t('aiVerifyingTitle')}</p>
            <p className="text-sm text-[#9CA3AF] text-center px-8 mt-2">{t('aiVerifyingSubtitle')}</p>
          </div>
        )}

        {phase === 'result' && result && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-6">
            <div className="bg-white max-w-xs w-full rounded-2xl p-8 text-center shadow-xl">
              {result === 'Approved' ? (
                <>
                  <CheckCircle size={52} className="text-[#166534] mx-auto" />
                  <h2 className="text-xl font-bold mt-4 text-[#111827]">{t('approvedTitle')}</h2>
                  <p className="text-sm text-[#9CA3AF] mt-2">{t('approvedMessage')}</p>
                </>
              ) : (
                <>
                  <AlertTriangle size={52} className="text-[#92400E] mx-auto" />
                  <h2 className="text-xl font-bold mt-4 text-[#92400E]">{t('reviewTitle')}</h2>
                  <p className="text-sm text-[#9CA3AF] mt-2">{t('reviewMessage')}</p>
                </>
              )}
              <hr className="mt-4 border-[#D1D9D4]" />
              <p className="text-xs uppercase text-[#9CA3AF] mt-4 tracking-wide">{t('estimatedBill')}</p>
              <p className="text-2xl font-bold text-[#1B5E37] mt-1">{formatCurrency(calculatedBill)}</p>
              <button
                onClick={handleGoToDashboard}
                className="w-full bg-[#1B5E37] text-white rounded-xl px-6 py-3.5 font-semibold hover:bg-[#154d2e] transition-colors mt-6"
              >
                {t('goToDashboard')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
