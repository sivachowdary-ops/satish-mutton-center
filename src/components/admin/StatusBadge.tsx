import type { OrderStatus } from '@/lib/mockData';

export function StatusBadge({ status }: { status: OrderStatus }) {
  const styles: Record<OrderStatus, string> = {
    pending_confirmation: 'bg-warning/10 text-warning border-warning/20',
    confirmed: 'bg-accent/10 text-accent border-accent/20',
    out_for_delivery: 'bg-brand/10 text-brand border-brand/20',
    delivered: 'bg-success/10 text-success border-success/20',
    cancelled: 'bg-danger/10 text-danger border-danger/20',
  };

  const labels: Record<OrderStatus, string> = {
    pending_confirmation: 'Pending',
    confirmed: 'Confirmed',
    out_for_delivery: 'Out for Delivery',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styles[status]}`}>
      {labels[status] || status}
    </span>
  );
}
