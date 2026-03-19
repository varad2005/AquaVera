import { useLang } from '../context/LangContext';
import { formatCurrency } from '../utils/billing';
import StatusChip from './StatusChip';

export default function RequestCard({ request }) {
  const { t } = useLang();

  return (
    <div className="bg-white rounded-2xl border border-[#D1D9D4] shadow-sm p-4 mb-3">
      <div className="flex justify-between items-start mb-2">
        <span className="text-xs text-[#9CA3AF] font-mono">{request.id}</span>
        <StatusChip status={request.status} />
      </div>
      <div className="space-y-1">
        <div className="flex justify-between text-sm">
          <span className="text-[#4B5563]">{t('crop')}</span>
          <span className="font-medium text-[#111827]">{t(request.cropKey)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[#4B5563]">{t('season')}</span>
          <span className="font-medium text-[#111827]">{t(request.seasonKey)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[#4B5563]">{t('submittedOn')}</span>
          <span className="font-medium text-[#111827]">{request.date}</span>
        </div>
        <div className="flex justify-between text-sm pt-1 border-t border-[#D1D9D4] mt-2">
          <span className="text-[#4B5563]">{t('billAmount')}</span>
          <span className="font-semibold text-[#1B5E37]">{formatCurrency(request.billAmount)}</span>
        </div>
      </div>
    </div>
  );
}
