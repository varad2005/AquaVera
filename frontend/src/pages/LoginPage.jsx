import { useState, useRef } from 'react';
import { Droplets, Globe } from 'lucide-react';
import { useLang } from '../context/LangContext';
import { useLocation } from 'wouter';
import { useApp } from '../context/AppContext';
import { supabase } from '../lib/supabaseClient';

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

  const handleSendOtp = async () => {
    if (!/^\d{10}$/.test(phone)) {
      setPhoneError(t('invalidMobile'));
      return;
    }
    setPhoneError('');
    
    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: `+91${phone}`, // Assuming Indian numbers as per context
      });
      if (error) throw error;
      setStep('otp');
    } catch (err) {
      setPhoneError(err.message || 'Failed to send OTP');
    }
  };

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length !== 4) {
      setOtpError(t('invalidOtp'));
      return;
    }
    setOtpError('');
    
    try {
      const { error, data: { session } } = await supabase.auth.verifyOtp({
        phone: `+91${phone}`,
        token: code,
        type: 'sms',
      });
      
      if (error) throw error;

      if (profile.isSetup) {
        navigate('/dashboard');
      } else {
        navigate('/profile');
      }
    } catch (err) {
      setOtpError(err.message || 'Invalid OTP');
    }
  };

  const handleResend = () => {
    setOtp(['', '', '', '']);
    setOtpError('');
    otpRefs[0].current?.focus();
  };

  return (
    <div className="min-h-screen bg-[#F4F6F4] flex flex-col">
      <div className="max-w-[480px] mx-auto w-full flex-1 relative bg-white min-h-screen">
        <button
          onClick={cycleLang}
          className="absolute top-4 right-4 flex items-center gap-1.5 text-sm font-medium text-[#1B5E37] border border-[#1B5E37] rounded-lg px-2.5 py-1 hover:bg-[#E8F5EE] transition-colors z-10"
        >
          <Globe size={14} />
          <span>{t('langLabel')}</span>
        </button>

        <div className="flex flex-col items-center justify-center min-h-screen px-6 py-12">
          <div className="flex flex-col items-center mb-10">
            <Droplets size={48} className="text-[#1B5E37] mb-3" />
            <h1 className="text-3xl font-bold text-[#1B5E37]">{t('appName')}</h1>
            <p className="text-sm text-[#9CA3AF] text-center mt-1">{t('appTagline')}</p>
          </div>

          {step === 'phone' ? (
            <div className="w-full space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-[#111827] mb-1">{t('loginTitle')}</h2>
                <p className="text-sm text-[#9CA3AF]">{t('loginSubtitle')}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#4B5563] mb-1.5">{t('mobileLabel')}</label>
                <input
                  type="tel"
                  maxLength={10}
                  placeholder={t('mobilePlaceholder')}
                  value={phone}
                  onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                  className="w-full border border-[#D1D9D4] rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#1B5E37] bg-white"
                />
                {phoneError && <p className="text-xs text-[#991B1B] mt-1">{phoneError}</p>}
              </div>
              <button
                onClick={handleSendOtp}
                className="w-full bg-[#1B5E37] text-white rounded-xl px-6 py-3.5 font-semibold hover:bg-[#154d2e] transition-colors"
              >
                {t('sendOtp')}
              </button>
            </div>
          ) : (
            <div className="w-full space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-[#111827] mb-1">{t('otpTitle')}</h2>
                <p className="text-sm text-[#9CA3AF]">{t('otpSubtitle')} <span className="font-medium text-[#111827]">{phone}</span></p>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#4B5563] mb-3">{t('otpLabel')}</label>
                <div className="flex gap-3 justify-center">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={otpRefs[idx]}
                      type="tel"
                      maxLength={1}
                      value={digit}
                      onChange={e => handleOtpChange(idx, e.target.value)}
                      onKeyDown={e => handleOtpKeyDown(idx, e)}
                      className="w-12 h-12 text-center text-xl border border-[#D1D9D4] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B5E37] bg-white font-semibold"
                      autoFocus={idx === 0}
                    />
                  ))}
                </div>
                {otpError && <p className="text-xs text-[#991B1B] mt-2 text-center">{otpError}</p>}
              </div>
              <button
                onClick={handleVerify}
                className="w-full bg-[#1B5E37] text-white rounded-xl px-6 py-3.5 font-semibold hover:bg-[#154d2e] transition-colors"
              >
                {t('verifyOtp')}
              </button>
              <div className="flex justify-center gap-4 text-sm">
                <button onClick={handleResend} className="text-[#1B5E37] font-medium hover:underline">
                  {t('resendOtp')}
                </button>
                <span className="text-[#D1D9D4]">|</span>
                <button onClick={() => setStep('phone')} className="text-[#4B5563] hover:underline">
                  {t('changeMobile')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
