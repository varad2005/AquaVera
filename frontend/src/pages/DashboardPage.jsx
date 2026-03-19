import { Droplets, Leaf, ChevronRight, FileText } from 'lucide-react';
import { useLang } from '../context/LangContext';
import { useApp } from '../context/AppContext';
import { useLocation } from 'wouter';
import BottomNav from '../components/BottomNav';
import RequestCard from '../components/RequestCard';
import BillCard from '../components/BillCard';

export default function DashboardPage() {
  const { t, cycleLang } = useLang();
  const { profile, requests, logout } = useApp();
  const [, navigate] = useLocation();

  const lastRequest = requests[0];
  const lastCropKey = lastRequest?.cropKey || null;
  const latest3 = requests.slice(0, 3);

  return (
    <div className="min-h-screen bg-[#F4F6F4]">
      <div className="max-w-[480px] mx-auto bg-white min-h-screen flex flex-col">
        <div className="flex items-center justify-between px-4 py-4 bg-white border-b border-[#D1D9D4] sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <Droplets size={22} className="text-[#1B5E37]" />
            <span className="text-base font-semibold text-[#1B5E37]">{t('appName')}</span>
          </div>
          <button
            onClick={cycleLang}
            className="flex items-center gap-1.5 text-sm font-medium text-[#1B5E37] border border-[#1B5E37] rounded-lg px-2.5 py-1 hover:bg-[#E8F5EE] transition-colors"
          >
            <span>{t('langLabel')}</span>
          </button>
          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="ml-2 text-sm font-medium text-[#991B1B] border border-[#991B1B] rounded-lg px-2.5 py-1 hover:bg-[#FEE2E2] transition-colors"
          >
            Logout
          </button>
        </div>

        <div className="flex-1 px-4 py-5 pb-28 overflow-y-auto space-y-5">
          <div>
            <p className="text-xl font-semibold text-[#111827]">{t('greeting')}, {profile.name || 'Farmer'}</p>
          </div>

          <div className="bg-white rounded-2xl border-l-4 border-[#1B5E37] border border-[#D1D9D4] shadow-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <Leaf size={16} className="text-[#1B5E37]" />
              <span className="text-base font-semibold text-[#111827]">{t('landSummary')}</span>
            </div>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-[#4B5563]">{t('landId')}</span>
                <span className="font-medium text-[#111827]">{profile.landId || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#4B5563]">{t('landArea')}</span>
                <span className="font-medium text-[#111827]">{profile.landArea ? `${profile.landArea} ${t('hectares')}` : '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#4B5563]">{t('lastCrop')}</span>
                <span className="font-medium text-[#111827]">
                  {lastCropKey ? t(lastCropKey) : t('noCropOnRecord')}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate('/request')}
            className="w-full bg-[#1B5E37] text-white rounded-2xl p-5 flex items-center justify-between hover:bg-[#154d2e] transition-colors"
          >
            <div className="flex items-start gap-3">
              <Droplets size={28} className="text-white mt-0.5 flex-shrink-0" />
              <div className="text-left">
                <p className="text-lg font-semibold">{t('requestWater')}</p>
                <p className="text-sm opacity-75 mt-0.5">{t('requestWaterSubtitle')}</p>
              </div>
            </div>
            <ChevronRight size={22} className="text-white flex-shrink-0" />
          </button>

          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold text-[#111827]">{t('myRequests')}</span>
                {requests.length > 0 && (
                  <span className="bg-[#E8F5EE] text-[#1B5E37] rounded-full text-xs font-semibold px-2 py-0.5">
                    {requests.length}
                  </span>
                )}
              </div>
              {requests.length > 0 && (
                <button
                  onClick={() => navigate('/requests')}
                  className="text-sm font-medium text-[#1B5E37] hover:underline"
                >
                  {t('viewAll')}
                </button>
              )}
            </div>

            {requests.length === 0 ? (
              <div className="bg-white rounded-2xl border border-[#D1D9D4] shadow-sm p-8 flex flex-col items-center text-center">
                <FileText size={36} className="text-[#D1D9D4] mb-3" />
                <p className="font-semibold text-[#111827]">{t('noRequests')}</p>
                <p className="text-sm text-[#9CA3AF] mt-1">{t('noRequestsSubtitle')}</p>
              </div>
            ) : (
              <div>
                {latest3.map(req => (
                  <RequestCard key={req.id} request={req} />
                ))}
              </div>
            )}
          </div>

          <BillCard requests={requests} />
        </div>

        <BottomNav active="dashboard" />
      </div>
    </div>
  );
}
