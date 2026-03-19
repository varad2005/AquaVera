import { IndianRupee } from 'lucide-react';
import { useLang } from '../context/LangContext';
import { formatCurrency } from '../utils/billing';

export default function BillCard({ requests }) {
  const { t } = useLang();

  const totalBill = requests.reduce((sum, r) => sum + r.billAmount, 0);
  const totalPaid = requests.filter(r => r.paid).reduce((sum, r) => sum + r.billAmount, 0);
  const totalUnpaid = totalBill - totalPaid;

  return (
    <div className="bg-white rounded-2xl border border-[#D1D9D4] shadow-sm p-5">
      <div className="flex items-center gap-2 mb-4">
        <IndianRupee size={18} className="text-[#1B5E37]" />
        <span className="text-lg font-semibold text-[#111827]">{t('billingSummary')}</span>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-[#4B5563]">{t('totalBill')}</span>
          <span className="font-semibold text-[#111827]">{formatCurrency(totalBill)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[#4B5563]">{t('totalPaid')}</span>
          <span className="font-semibold text-[#166534]">{formatCurrency(totalPaid)}</span>
        </div>
        <div className="flex justify-between text-sm pt-2 border-t border-[#D1D9D4]">
          <span className="text-[#4B5563]">{t('totalUnpaid')}</span>
          <span className="font-semibold text-[#991B1B]">{formatCurrency(totalUnpaid)}</span>
        </div>
      </div>
    </div>
  );
}
