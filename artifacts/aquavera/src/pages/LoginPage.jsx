import { useState, useRef } from 'react';
import { Droplets, Globe } from 'lucide-react';
import { useLang } from '../context/LangContext';
import { useLocation } from 'wouter';
import { useApp } from '../context/AppContext';

export default function LoginPage() {
  const { t, cycleLang } = useLang();
  const { profile } = useApp();
  const [, navigate] = useLocation();

  const [step, setStep] = useState('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [phoneError, setPhoneError] = useState('');
  const [otpError, setOtpError] = useState('');

  const otpRefs = [useRef(), useRef(), useRef(), useRef()];

  const handleSendOtp = () => {
    if (!/^\d{10}$/.test(phone)) { setPhoneError(t('invalidMobile')); return; }
    setPhoneError('');
    setStep('otp');
  };

  const handleOtpChange = (idx, val) => {
    if (!/^\d*$/.test(val)) return;
    const newOtp = [...otp];
    newOtp[idx] = val.slice(-1);
    setOtp(newOtp);
    if (val && idx < 3) otpRefs[idx + 1].current?.focus();
  };

  const handleOtpKeyDown = (idx, e) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) otpRefs[idx - 1].current?.focus();
  };

  const handleVerify = () => {
    const code = otp.join('');
    if (code.length !== 4) { setOtpError(t('invalidOtp')); return; }
    setOtpError('');
    navigate(profile.isSetup ? '/dashboard' : '/profile');
  };

  const inputCls = "w-full border border-[#C7D0C9] rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D47A1] bg-white";

  return (
    <div className="min-h-screen bg-[#F1F5F2] flex flex-col">
      <div className="bg-[#0D47A1] text-white py-3 px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Droplets size={18} className="text-white" />
          <span className="text-sm font-bold tracking-wide">{t('appName')}</span>
          <span className="hidden sm:block text-xs text-blue-200 ml-2">— Government of Maharashtra</span>
        </div>
        <button
          onClick={cycleLang}
          className="flex items-center gap-1.5 text-xs font-semibold border border-blue-300 rounded px-2.5 py-1 hover:bg-blue-700 transition-colors"
        >
          <Globe size={13} />
          {t('langLabel')}
        </button>
      </div>

      <div className="flex-1 flex items-start justify-center pt-16 px-4">
        <div className="w-full max-w-sm">
          <div className="bg-white rounded-lg border border-[#C7D0C9] shadow-sm overflow-hidden">
            <div className="bg-[#1B5E20] px-6 py-4">
              <div className="flex items-center gap-2 mb-1">
                <Droplets size={20} className="text-white" />
                <h1 className="text-base font-bold text-white">{t('appName')}</h1>
              </div>
              <p className="text-xs text-green-200">{t('appTagline')}</p>
            </div>

            <div className="px-6 py-6">
              {step === 'phone' ? (
                <div className="space-y-4">
                  <div>
                    <h2 className="text-sm font-bold text-[#0F172A] uppercase tracking-wide">{t('loginTitle')}</h2>
                    <p className="text-xs text-[#6B7280] mt-0.5">{t('loginSubtitle')}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#374151] mb-1 uppercase tracking-wide">{t('mobileLabel')}</label>
                    <input
                      type="tel"
                      maxLength={10}
                      placeholder={t('mobilePlaceholder')}
                      value={phone}
                      onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                      className={inputCls}
                    />
                    {phoneError && <p className="text-xs text-[#B91C1C] mt-1">{phoneError}</p>}
                  </div>
                  <button
                    onClick={handleSendOtp}
                    className="w-full bg-[#0D47A1] text-white rounded px-4 py-2.5 text-sm font-bold hover:bg-[#0a3d8f] transition-colors uppercase tracking-wide"
                  >
                    {t('sendOtp')}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <h2 className="text-sm font-bold text-[#0F172A] uppercase tracking-wide">{t('otpTitle')}</h2>
                    <p className="text-xs text-[#6B7280] mt-0.5">{t('otpSubtitle')} <span className="font-semibold text-[#0F172A]">{phone}</span></p>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#374151] mb-2 uppercase tracking-wide">{t('otpLabel')}</label>
                    <div className="flex gap-2">
                      {otp.map((digit, idx) => (
                        <input
                          key={idx}
                          ref={otpRefs[idx]}
                          type="tel"
                          maxLength={1}
                          value={digit}
                          onChange={e => handleOtpChange(idx, e.target.value)}
                          onKeyDown={e => handleOtpKeyDown(idx, e)}
                          className="flex-1 h-11 text-center text-lg border border-[#C7D0C9] rounded focus:outline-none focus:ring-2 focus:ring-[#0D47A1] bg-white font-bold"
                          autoFocus={idx === 0}
                        />
                      ))}
                    </div>
                    {otpError && <p className="text-xs text-[#B91C1C] mt-1 text-center">{otpError}</p>}
                  </div>
                  <button
                    onClick={handleVerify}
                    className="w-full bg-[#0D47A1] text-white rounded px-4 py-2.5 text-sm font-bold hover:bg-[#0a3d8f] transition-colors uppercase tracking-wide"
                  >
                    {t('verifyOtp')}
                  </button>
                  <div className="flex justify-between text-xs">
                    <button onClick={() => { setOtp(['','','','']); setOtpError(''); }} className="text-[#0D47A1] font-medium hover:underline">
                      {t('resendOtp')}
                    </button>
                    <button onClick={() => setStep('phone')} className="text-[#6B7280] hover:underline">
                      {t('changeMobile')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <p className="text-center text-xs text-[#9CA3AF] mt-4">
            Maharashtra Water Resources Department · Secure Portal
          </p>
        </div>
      </div>
    </div>
  );
}
