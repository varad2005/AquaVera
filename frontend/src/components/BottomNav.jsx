import { Home, FileText, IndianRupee } from 'lucide-react';
import { useLang } from '../context/LangContext';
import { useLocation } from 'wouter';

export default function BottomNav({ active }) {
  const { t } = useLang();
  const [, navigate] = useLocation();

  const tabs = [
    { key: 'dashboard', icon: Home, label: t('navDashboard'), path: '/dashboard' },
    { key: 'requests', icon: FileText, label: t('navRequests'), path: '/requests' },
    { key: 'billing', icon: IndianRupee, label: t('navBilling'), path: '/billing' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#D1D9D4] z-10">
      <div className="max-w-[480px] mx-auto flex">
        {tabs.map(({ key, icon: Icon, label, path }) => {
          const isActive = active === key;
          return (
            <button
              key={key}
              onClick={() => navigate(path)}
              className={`flex-1 flex flex-col items-center py-2 pt-2.5 gap-1 transition-colors
                ${isActive
                  ? 'text-[#1B5E37] border-t-2 border-[#1B5E37] -mt-[2px]'
                  : 'text-[#9CA3AF]'
                }`}
            >
              <Icon size={20} />
              <span className="text-xs font-medium">{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
