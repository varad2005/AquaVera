import { IndianRupee } from 'lucide-react';
import { useLang } from '../context/LangContext';
import { useApp } from '../context/AppContext';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import BillCard from '../components/BillCard';
import StatusChip from '../components/StatusChip';
import { formatCurrency } from '../utils/billing';

export default function BillingPage() {
  const { t } = useLang();
  const { requests } = useApp();

  return (
    <div className="min-h-screen bg-[#F4F6F4]">
      <div className="max-w-[480px] mx-auto bg-white min-h-screen flex flex-col">
        <Header title={t('billingTitle')} />

        <div className="flex-1 px-4 py-5 pb-28 overflow-y-auto space-y-4">
          <BillCard requests={requests} />

          {requests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <IndianRupee size={48} className="text-[#D1D9D4] mb-4" />
              <p className="font-semibold text-[#111827]">{t('noBillingRecords')}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {requests.map(req => (
                <div key={req.id} className="bg-white rounded-2xl border border-[#D1D9D4] shadow-sm p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="text-xs text-[#9CA3AF]">{t('requestId')}</p>
                      <p className="text-sm font-mono font-medium text-[#111827]">{req.id}</p>
                    </div>
                    <StatusChip status={req.paid ? 'Approved' : 'Pending'} />
                  </div>
                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between">
                      <span className="text-[#4B5563]">{t('crop')}</span>
                      <span className="font-medium text-[#111827]">{t(req.cropKey)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#4B5563]">{t('season')}</span>
                      <span className="font-medium text-[#111827]">{t(req.seasonKey)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#4B5563]">{t('duration')}</span>
                      <span className="font-medium text-[#111827]">{req.duration} {t('days')}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-[#D1D9D4]">
                      <span className="text-[#4B5563] font-medium">{t('amount')}</span>
                      <span className="font-semibold text-[#111827]">{formatCurrency(req.billAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#4B5563]">{t('paymentStatus')}</span>
                      <span className={`text-xs font-semibold ${req.paid ? 'text-[#166534]' : 'text-[#991B1B]'}`}>
                        {req.paid ? t('paid') : t('unpaid')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <BottomNav active="billing" />
      </div>
    </div>
  );
}
