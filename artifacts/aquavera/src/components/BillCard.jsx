import { IndianRupee } from 'lucide-react';
import { useLang } from '../context/LangContext';
import { formatCurrency } from '../utils/billing';

export default function BillCard({ requests }) {
  const { t } = useLang();

  const totalBill = requests.reduce((sum, r) => sum + r.billAmount, 0);
  const totalPaid = requests.filter(r => r.paid).reduce((sum, r) => sum + r.billAmount, 0);
  const totalUnpaid = totalBill - totalPaid;

  return (
    <div className="bg-white rounded-lg border border-[#C7D0C9] p-4">
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#C7D0C9]">
        <IndianRupee size={16} className="text-[#1B5E20]" />
        <span className="text-sm font-semibold text-[#0F172A] uppercase tracking-wide">{t('billingSummary')}</span>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-[#4B5563]">{t('totalBill')}</span>
          <span className="font-semibold text-[#0F172A]">{formatCurrency(totalBill)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[#4B5563]">{t('totalPaid')}</span>
          <span className="font-semibold text-[#2E7D32]">{formatCurrency(totalPaid)}</span>
        </div>
        <div className="flex justify-between text-sm pt-2 border-t border-[#C7D0C9]">
          <span className="text-[#4B5563] font-medium">{t('totalUnpaid')}</span>
          <span className="font-semibold text-[#B91C1C]">{formatCurrency(totalUnpaid)}</span>
        </div>
      </div>
    </div>
  );
}
