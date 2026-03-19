import { useLang } from '../context/LangContext';

export default function StatusChip({ status }) {
  const { t } = useLang();

  const styles = {
    Approved: 'bg-[#DCFCE7] text-[#2E7D32]',
    Pending: 'bg-[#FEF3C7] text-[#B45309]',
    'Needs Review': 'bg-[#FEE2E2] text-[#B91C1C]',
  };

  const labels = {
    Approved: t('statusApproved'),
    Pending: t('statusPending'),
    'Needs Review': t('statusNeedsReview'),
  };

  const cls = styles[status] || 'bg-gray-100 text-gray-600';
  const label = labels[status] || status;

  return (
    <span className={`inline-flex rounded px-2 py-0.5 text-xs font-semibold uppercase tracking-wide ${cls}`}>
      {label}
    </span>
  );
}
