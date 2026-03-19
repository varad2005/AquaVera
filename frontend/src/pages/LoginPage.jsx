import { useEffect, useState } from 'react';
import { Droplets, Globe } from 'lucide-react';
import { useLang } from '../context/LangContext';
import { useLocation } from 'wouter';
import { useApp } from '../context/AppContext';

export default function LoginPage() {
  const { t, cycleLang } = useLang();
  const { profile, session, loginWithPhone } = useApp();
  const [, navigate] = useLocation();

  const [step, setStep] = useState('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [otpError, setOtpError] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    if (session?.loggedIn) {
      navigate('/dashboard');
    }
  }, [navigate, session]);

  const generateDemoOtp = () => String(Math.floor(100000 + Math.random() * 900000));

  const handleSendOtp = () => {
    if (!/^\d{10}$/.test(phone)) {
      setPhoneError(t('invalidMobile'));
      return;
    }

    setPhoneError('');
    const newOtp = generateDemoOtp();

    setGeneratedOtp(newOtp);
    setOtp('');
    setOtpError('');
    setStatusMessage('Demo OTP generated. Check console or use the value shown below.');
    setStep('otp');

    // Demo-only OTP for local development/hackathon use.
    console.log('[AquaVera Demo OTP]', { phone: `+91${phone}`, otp: newOtp });
  };

  const handleVerify = () => {
    if (!/^\d{6}$/.test(otp)) {
      setOtpError(t('invalidOtp'));
      return;
    }

    if (otp !== generatedOtp) {
      setOtpError('Incorrect OTP. Please try again.');
      return;
    }

    setOtpError('');
    setStatusMessage('OTP verified successfully. Logged in with demo session.');

    loginWithPhone(`+91${phone}`);
    if (profile.isSetup) {
      navigate('/dashboard');
    } else {
      navigate('/dashboard');
    }
  };

  const handleResend = () => {
    const newOtp = generateDemoOtp();
    setGeneratedOtp(newOtp);
    setOtp('');
    setOtpError('');
    setStatusMessage('New demo OTP generated. Check console or use the value shown below.');

    console.log('[AquaVera Demo OTP - Resend]', { phone: `+91${phone}`, otp: newOtp });
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
                <input
                  type="tel"
                  maxLength={6}
                  inputMode="numeric"
                  value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full border border-[#D1D9D4] rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#1B5E37] bg-white"
                  placeholder="Enter 6-digit OTP"
                  autoFocus
                />
                {generatedOtp && (
                  <p className="text-xs text-[#1B5E37] mt-2">
                    Demo OTP: <span className="font-semibold">{generatedOtp}</span>
                  </p>
                )}
                {statusMessage && <p className="text-xs text-[#4B5563] mt-2">{statusMessage}</p>}
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
