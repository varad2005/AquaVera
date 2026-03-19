import { FileText } from 'lucide-react';
import { useLang } from '../context/LangContext';
import { useApp } from '../context/AppContext';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import StatusChip from '../components/StatusChip';
import { formatCurrency } from '../utils/billing';

export default function RequestsPage() {
  const { t } = useLang();
  const { requests } = useApp();

  const sorted = [...requests].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="min-h-screen bg-[#F4F6F4]">
      <div className="max-w-[480px] mx-auto bg-white min-h-screen flex flex-col">
        <Header title={t('requestsTitle')} showBack />

        <div className="flex-1 px-4 py-5 pb-28 overflow-y-auto">
          {sorted.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <FileText size={48} className="text-[#D1D9D4] mb-4" />
              <p className="font-semibold text-[#111827]">{t('noRequests')}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sorted.map(req => (
                <div key={req.id} className="bg-white rounded-2xl border border-[#D1D9D4] shadow-sm p-4">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-xs text-[#9CA3AF] font-mono">{req.id}</span>
                    <StatusChip status={req.status} />
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
                    <div className="flex justify-between">
                      <span className="text-[#4B5563]">{t('submittedOn')}</span>
                      <span className="font-medium text-[#111827]">{req.date}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-[#D1D9D4]">
                      <span className="text-[#4B5563]">{t('billAmount')}</span>
                      <span className="font-semibold text-[#1B5E37]">{formatCurrency(req.billAmount)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <BottomNav active="requests" />
      </div>
    </div>
  );
}
