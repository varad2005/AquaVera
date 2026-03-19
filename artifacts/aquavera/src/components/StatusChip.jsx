import { useLang } from '../context/LangContext';

export default function StatusChip({ status }) {
  const { t } = useLang();

  const styles = {
    Approved: 'bg-[#DCFCE7] text-[#166534]',
    Pending: 'bg-[#FEF3C7] text-[#92400E]',
    'Needs Review': 'bg-[#FEE2E2] text-[#991B1B]',
  };

  const labels = {
    Approved: t('statusApproved'),
    Pending: t('statusPending'),
    'Needs Review': t('statusNeedsReview'),
  };

  const cls = styles[status] || 'bg-gray-100 text-gray-600';
  const label = labels[status] || status;

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${cls}`}>
      {label}
    </span>
  );
}
