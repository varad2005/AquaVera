import { IndianRupee } from 'lucide-react';
import { useLang } from '../context/LangContext';
import { useApp } from '../context/AppContext';
import GovLayout from '../components/GovLayout';
import BillCard from '../components/BillCard';
import StatusChip from '../components/StatusChip';
import { formatCurrency } from '../utils/billing';

export default function BillingPage() {
  const { t } = useLang();
  const { requests } = useApp();

  return (
    <GovLayout active="billing">
      <div className="p-6 space-y-4">
        <div>
          <h1 className="text-lg font-bold text-[#0F172A]">{t('billingTitle')}</h1>
          <p className="text-xs text-[#6B7280] mt-0.5">{requests.length} {requests.length === 1 ? 'record' : 'records'}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1">
            <BillCard requests={requests} />
          </div>
          <div className="md:col-span-2 bg-white rounded-lg border border-[#C7D0C9] p-4">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#C7D0C9]">
              <IndianRupee size={15} className="text-[#0D47A1]" />
              <span className="text-xs font-semibold text-[#0F172A] uppercase tracking-wide">Payment Summary</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Total Requests', value: requests.length, color: 'text-[#0F172A]' },
                { label: 'Approved', value: requests.filter(r => r.status === 'Approved').length, color: 'text-[#2E7D32]' },
                { label: 'Under Review', value: requests.filter(r => r.status === 'Needs Review').length, color: 'text-[#B91C1C]' },
                { label: 'Pending', value: requests.filter(r => r.status === 'Pending').length, color: 'text-[#B45309]' },
              ].map(({ label, value, color }) => (
                <div key={label} className="bg-[#F8FAFC] rounded p-3 border border-[#C7D0C9]">
                  <p className="text-xs text-[#6B7280]">{label}</p>
                  <p className={`text-2xl font-bold mt-0.5 ${color}`}>{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-[#C7D0C9]">
          <div className="px-4 py-3 border-b border-[#C7D0C9]">
            <span className="text-xs font-semibold text-[#0F172A] uppercase tracking-wide">{t('billingTitle')} Records</span>
          </div>

          {requests.length === 0 ? (
            <div className="flex flex-col items-center py-12 text-center">
              <IndianRupee size={32} className="text-[#C7D0C9] mb-3" />
              <p className="text-sm font-medium text-[#0F172A]">{t('noBillingRecords')}</p>
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
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#4B5563] uppercase tracking-wide">{t('paymentStatus')}</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-[#4B5563] uppercase tracking-wide">{t('amount')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F2]">
                  {requests.map(req => (
                    <tr key={req.id} className="hover:bg-[#F8FAFC] transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-[#4B5563]">{req.id}</td>
                      <td className="px-4 py-3 font-medium text-[#0F172A]">{t(req.cropKey)}</td>
                      <td className="px-4 py-3 text-[#4B5563]">{t(req.seasonKey)}</td>
                      <td className="px-4 py-3 text-[#4B5563]">{req.duration} {t('days')}</td>
                      <td className="px-4 py-3">
                        <StatusChip status={req.paid ? 'Approved' : 'Pending'} />
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-[#0F172A]">{formatCurrency(req.billAmount)}</td>
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
