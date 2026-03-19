import { Droplets, Globe, User, LogOut, Home, FileText, IndianRupee, Plus } from 'lucide-react';
import { useLang } from '../context/LangContext';
import { useApp } from '../context/AppContext';
import { useLocation } from 'wouter';

export default function GovLayout({ children, active }) {
  const { t, cycleLang } = useLang();
  const { profile } = useApp();
  const [, navigate] = useLocation();

  const navItems = [
    { key: 'dashboard', icon: Home, label: t('navDashboard'), path: '/dashboard' },
    { key: 'requests', icon: FileText, label: t('navRequests'), path: '/requests' },
    { key: 'billing', icon: IndianRupee, label: t('navBilling'), path: '/billing' },
  ];

  return (
    <div className="min-h-screen bg-[#F1F5F2] flex flex-col">
      <header className="bg-[#0D47A1] text-white h-14 flex items-center px-6 flex-shrink-0 z-20 shadow">
        <div className="flex items-center gap-3 flex-1">
          <Droplets size={20} className="text-white" />
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-bold tracking-wide">{t('appName')}</span>
            <span className="text-xs text-blue-200 hidden sm:block">{t('appTagline')}</span>
          </div>
          <div className="hidden md:block ml-4 h-6 border-l border-blue-400" />
          <span className="hidden md:block text-xs text-blue-200 ml-1">Government of Maharashtra — Water Resources Department</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={cycleLang}
            className="flex items-center gap-1.5 text-xs font-semibold border border-blue-300 rounded px-2.5 py-1 hover:bg-blue-700 transition-colors"
          >
            <Globe size={13} />
            {t('langLabel')}
          </button>
          <div className="flex items-center gap-1.5 text-xs text-blue-100">
            <User size={14} />
            <span className="hidden sm:block">{profile.name || 'Farmer'}</span>
          </div>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1 text-xs text-blue-200 hover:text-white transition-colors"
          >
            <LogOut size={14} />
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-52 bg-white border-r border-[#C7D0C9] flex-shrink-0 flex flex-col">
          <nav className="flex-1 py-3">
            {navItems.map(({ key, icon: Icon, label, path }) => {
              const isActive = active === key;
              return (
                <button
                  key={key}
                  onClick={() => navigate(path)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left
                    ${isActive
                      ? 'bg-[#E3F2FD] text-[#0D47A1] font-semibold border-r-2 border-[#0D47A1]'
                      : 'text-[#374151] hover:bg-gray-50'
                    }`}
                >
                  <Icon size={16} />
                  {label}
                </button>
              );
            })}
          </nav>
          <div className="p-3 border-t border-[#C7D0C9]">
            <button
              onClick={() => navigate('/request')}
              className="w-full flex items-center justify-center gap-2 bg-[#1B5E20] text-white text-xs font-semibold rounded px-3 py-2 hover:bg-[#154a19] transition-colors"
            >
              <Plus size={14} />
              {t('requestWater')}
            </button>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
