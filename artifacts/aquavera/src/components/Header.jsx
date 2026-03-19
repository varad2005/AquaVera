import { ArrowLeft, Droplets, Globe } from 'lucide-react';
import { useLang } from '../context/LangContext';
import { useLocation } from 'wouter';

export default function Header({ title, showBack = false, showLogo = false }) {
  const { t, cycleLang } = useLang();
  const [, navigate] = useLocation();

  return (
    <div className="flex items-center justify-between px-4 py-4 bg-white border-b border-[#D1D9D4] sticky top-0 z-10">
      <div className="flex items-center gap-2">
        {showBack && (
          <button
            onClick={() => navigate(-1)}
            className="mr-1 p-1 rounded-lg text-[#4B5563] hover:bg-[#F4F6F4] transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
        )}
        {showLogo && (
          <Droplets size={22} className="text-[#1B5E37]" />
        )}
        <span className="text-base font-semibold text-[#111827]">{title}</span>
      </div>
      <button
        onClick={cycleLang}
        className="flex items-center gap-1.5 text-sm font-medium text-[#1B5E37] border border-[#1B5E37] rounded-lg px-2.5 py-1 hover:bg-[#E8F5EE] transition-colors"
      >
        <Globe size={14} />
        <span>{t('langLabel')}</span>
      </button>
    </div>
  );
}
