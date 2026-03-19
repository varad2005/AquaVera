import { FileText } from 'lucide-react';
import { useLang } from '../context/LangContext';
import { useApp } from '../context/AppContext';
import GovLayout from '../components/GovLayout';
import StatusChip from '../components/StatusChip';
import { formatCurrency } from '../utils/billing';

export default function RequestsPage() {
  const { t } = useLang();
  const { requests } = useApp();

  const sorted = [...requests].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <GovLayout active="requests">
      <div className="p-6 space-y-4">
        <div>
          <h1 className="text-lg font-bold text-[#0F172A]">{t('requestsTitle')}</h1>
          <p className="text-xs text-[#6B7280] mt-0.5">{sorted.length} {sorted.length === 1 ? 'record' : 'records'} found</p>
        </div>

        <div className="bg-white rounded-lg border border-[#C7D0C9]">
          {sorted.length === 0 ? (
            <div className="flex flex-col items-center py-16 text-center">
              <FileText size={36} className="text-[#C7D0C9] mb-3" />
              <p className="text-sm font-medium text-[#0F172A]">{t('noRequests')}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#F8FAFC] border-b border-[#C7D0C9]">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#4B5563] uppercase tracking-wide">{t('requestId')}</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#4B5563] uppercase tracking-wide">{t('crop')}</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#4B5563] uppercase tracking-wide">{t('season')}</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#4B5563] uppercase tracking-wide">{t('duration')}</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#4B5563] uppercase tracking-wide">{t('submittedOn')}</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#4B5563] uppercase tracking-wide">{t('paymentStatus')}</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-[#4B5563] uppercase tracking-wide">{t('billAmount')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F2]">
                  {sorted.map(req => (
                    <tr key={req.id} className="hover:bg-[#F8FAFC] transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-[#4B5563]">{req.id}</td>
                      <td className="px-4 py-3 font-medium text-[#0F172A]">{t(req.cropKey)}</td>
                      <td className="px-4 py-3 text-[#4B5563]">{t(req.seasonKey)}</td>
                      <td className="px-4 py-3 text-[#4B5563]">{req.duration} {t('days')}</td>
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
