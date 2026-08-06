import { siteConfig } from '@/config/site';
import type { OrderItem } from '@/lib/mockData';

interface OrderData {
  orderRef: string;
  name: string;
  phone: string;
  address: string;
  deliveryDate: string;
  deliverySlot: string;
  items: OrderItem[];
  total: number;
  notes?: string;
}

export function buildWhatsAppOrderMessage(order: OrderData): string {
  const itemLines = order.items
    .map(item => `- ${item.name} (${item.weight_label}) x${item.quantity} — ₹${item.line_total}`)
    .join('\n');

  return `New Order — ${order.orderRef}

Name: ${order.name}
Phone: ${order.phone}
Address: ${order.address}
Delivery Date: ${order.deliveryDate}
Delivery Slot: ${order.deliverySlot}

Items:
${itemLines}

Total: ₹${order.total}
Notes: ${order.notes || '-'}

Please confirm this order. Thank you!`;
}

export function getWhatsAppLink(message: string): string {
  const number = siteConfig.whatsappNumber;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function getWhatsAppInquiryLink(): string {
  return getWhatsAppLink(siteConfig.whatsappInquiryMessage);
}
