import { Leaf, FileText, ChevronRight } from 'lucide-react';
import { useLang } from '../context/LangContext';
import { useApp } from '../context/AppContext';
import { useLocation } from 'wouter';
import GovLayout from '../components/GovLayout';
import BillCard from '../components/BillCard';
import StatusChip from '../components/StatusChip';
import { formatCurrency } from '../utils/billing';

export default function DashboardPage() {
  const { t } = useLang();
  const { profile, requests } = useApp();
  const [, navigate] = useLocation();

  const lastRequest = requests[0];
  const lastCropKey = lastRequest?.cropKey || null;
  const sorted = [...requests].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <GovLayout active="dashboard">
      <div className="p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-[#0F172A]">{t('dashboardTitle')}</h1>
            <p className="text-sm text-[#4B5563]">{t('greeting')}, <span className="font-semibold text-[#0F172A]">{profile.name || 'Farmer'}</span></p>
          </div>
          <button
            onClick={() => navigate('/request')}
            className="hidden sm:flex items-center gap-2 bg-[#1B5E20] text-white text-sm font-semibold rounded px-4 py-2 hover:bg-[#154a19] transition-colors"
          >
            <span>{t('requestWater')}</span>
            <ChevronRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg border border-[#C7D0C9] p-4 border-l-4 border-l-[#1B5E20]">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#C7D0C9]">
              <Leaf size={15} className="text-[#1B5E20]" />
              <span className="text-sm font-semibold text-[#0F172A] uppercase tracking-wide">{t('landSummary')}</span>
            </div>
            <table className="w-full text-sm">
              <tbody className="divide-y divide-[#F1F5F2]">
                <tr>
                  <td className="py-1.5 text-[#4B5563] w-2/5">{t('landId')}</td>
                  <td className="py-1.5 font-medium text-[#0F172A] text-right">{profile.landId || '—'}</td>
                </tr>
                <tr>
                  <td className="py-1.5 text-[#4B5563]">{t('landArea')}</td>
                  <td className="py-1.5 font-medium text-[#0F172A] text-right">
                    {profile.landArea ? `${profile.landArea} ${t('hectares')}` : '—'}
                  </td>
                </tr>
                <tr>
                  <td className="py-1.5 text-[#4B5563]">{t('lastCrop')}</td>
                  <td className="py-1.5 font-medium text-[#0F172A] text-right">
                    {lastCropKey ? t(lastCropKey) : t('noCropOnRecord')}
                  </td>
                </tr>
                <tr>
                  <td className="py-1.5 text-[#4B5563]">{t('beneficiaryType')}</td>
                  <td className="py-1.5 font-medium text-[#0F172A] text-right capitalize">
                    {profile.beneficiaryType === 'wua' ? 'Registered WUA' : 'Individual'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <BillCard requests={requests} />
        </div>

        <div className="bg-white rounded-lg border border-[#C7D0C9]">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#C7D0C9]">
            <div className="flex items-center gap-2">
              <FileText size={15} className="text-[#0D47A1]" />
              <span className="text-sm font-semibold text-[#0F172A] uppercase tracking-wide">{t('myRequests')}</span>
              {requests.length > 0 && (
                <span className="bg-[#E3F2FD] text-[#0D47A1] rounded text-xs font-semibold px-1.5 py-0.5">
                  {requests.length}
                </span>
              )}
            </div>
            {requests.length > 0 && (
              <button
                onClick={() => navigate('/requests')}
                className="text-xs font-medium text-[#0D47A1] hover:underline"
              >
                {t('viewAll')}
              </button>
            )}
          </div>

          {sorted.length === 0 ? (
            <div className="flex flex-col items-center py-12 text-center">
              <FileText size={32} className="text-[#C7D0C9] mb-3" />
              <p className="text-sm font-medium text-[#0F172A]">{t('noRequests')}</p>
              <p className="text-xs text-[#6B7280] mt-1">{t('noRequestsSubtitle')}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#F8FAFC] border-b border-[#C7D0C9]">
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-[#4B5563] uppercase tracking-wide">{t('requestId')}</th>
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-[#4B5563] uppercase tracking-wide">{t('crop')}</th>
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-[#4B5563] uppercase tracking-wide">{t('season')}</th>
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-[#4B5563] uppercase tracking-wide">{t('submittedOn')}</th>
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-[#4B5563] uppercase tracking-wide">{t('paymentStatus')}</th>
                    <th className="text-right px-4 py-2.5 text-xs font-semibold text-[#4B5563] uppercase tracking-wide">{t('billAmount')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F2]">
                  {sorted.map(req => (
                    <tr key={req.id} className="hover:bg-[#F8FAFC] transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-[#4B5563]">{req.id}</td>
                      <td className="px-4 py-3 font-medium text-[#0F172A]">{t(req.cropKey)}</td>
                      <td className="px-4 py-3 text-[#4B5563]">{t(req.seasonKey)}</td>
                      <td className="px-4 py-3 text-[#4B5563]">{req.date}</td>
                      <td className="px-4 py-3"><StatusChip status={req.status} /></td>
                      <td className="px-4 py-3 text-right font-semibold text-[#1B5E20]">{formatCurrency(req.billAmount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </GovLayout>
  );
}
