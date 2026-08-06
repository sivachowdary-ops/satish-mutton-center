'use client';

import { useState, useEffect } from 'react';
import { Search, Download, MessageSquare, ExternalLink, X } from 'lucide-react';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { formatPrice } from '@/lib/formatCurrency';
import { buildWhatsAppOrderMessage, getWhatsAppLink } from '@/lib/whatsapp';
import type { OrderStatus, OrderItem } from '@/lib/mockData';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

interface MockOrder {
  id: string;
  orderRef: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  deliveryDate: string;
  deliverySlot: string;
  notes?: string;
  items: OrderItem[];
  subtotal: number;
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<MockOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<MockOrder | null>(null);

  async function loadOrders() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formatted: MockOrder[] = (data || []).map((o: any) => ({
        id: o.id,
        orderRef: o.order_ref,
        customerName: o.customer_name,
        customerPhone: o.customer_phone,
        deliveryAddress: o.delivery_address,
        deliveryDate: o.delivery_date || '',
        deliverySlot: o.delivery_slot || '',
        notes: o.notes || '',
        items: Array.isArray(o.items) ? o.items : [],
        subtotal: Number(o.subtotal),
        totalAmount: Number(o.total_amount),
        status: o.status,
        createdAt: new Date(o.created_at).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
      }));

      setOrders(formatted);
    } catch (err: any) {
      toast.error(err.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;

      setOrders(prev =>
        prev.map(o => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(prev => (prev ? { ...prev, status: newStatus } : null));
      }
      toast.success(`Status updated to ${newStatus}`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to update order status');
    }
  };

  const handleResendWhatsApp = (order: MockOrder) => {
    const orderData = {
      orderRef: order.orderRef,
      name: order.customerName,
      phone: order.customerPhone,
      address: order.deliveryAddress,
      deliveryDate: order.deliveryDate,
      deliverySlot: order.deliverySlot,
      items: order.items,
      total: order.totalAmount,
      notes: order.notes,
    };
    const message = buildWhatsAppOrderMessage(orderData);
    const url = getWhatsAppLink(message);
    window.open(url, '_blank');
    toast.success('WhatsApp redirect opened!');
  };

  const handleExportCSV = () => {
    const headers = ['Order Ref', 'Customer Name', 'Phone', 'Delivery Address', 'Slot', 'Total Amount', 'Status', 'Date'];
    const rows = orders.map(o => [
      o.orderRef,
      o.customerName,
      o.customerPhone,
      `"${o.deliveryAddress.replace(/"/g, '""')}"`,
      o.deliverySlot,
      o.totalAmount.toString(),
      o.status,
      o.createdAt,
    ]);

    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'satish_mutton_orders.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Orders exported to CSV!');
  };

  const filteredOrders = orders.filter(o => {
    const matchesSearch =
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.orderRef.toLowerCase().includes(search.toLowerCase()) ||
      o.customerPhone.includes(search);

    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="animate-spin w-8 h-8 border-4 border-brand border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-1 gap-2 w-full max-w-xl">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 w-5 h-5 text-ink-muted/50" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by customer, ref, or phone..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-surface-muted bg-surface-card text-ink text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-surface-muted bg-surface-card text-ink text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="all">All Statuses</option>
            <option value="pending_confirmation">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="out_for_delivery">Out for Delivery</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <button
          onClick={handleExportCSV}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-surface-card hover:bg-surface-muted text-ink border border-surface-muted rounded-full text-sm font-semibold transition-colors w-full sm:w-auto"
        >
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      <div className="bg-surface-card rounded-2xl shadow-sm border border-surface-muted overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-surface-muted bg-surface/50 text-ink-muted">
                <th className="py-3.5 px-6 font-semibold">Order Ref</th>
                <th className="py-3.5 px-6 font-semibold">Customer</th>
                <th className="py-3.5 px-6 font-semibold">Phone</th>
                <th className="py-3.5 px-6 font-semibold">Delivery Slot</th>
                <th className="py-3.5 px-6 font-semibold">Total Amount</th>
                <th className="py-3.5 px-6 font-semibold">Status</th>
                <th className="py-3.5 px-6 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-ink-muted italic">
                    No orders found matching the filters.
                  </td>
                </tr>
              ) : (
                filteredOrders.map(order => (
                  <tr
                    key={order.id}
                    className="border-b border-surface-muted hover:bg-surface/10 transition-colors cursor-pointer"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <td className="py-4 px-6 font-mono font-bold text-brand">{order.orderRef}</td>
                    <td className="py-4 px-6 text-ink font-semibold">{order.customerName}</td>
                    <td className="py-4 px-6 text-ink-muted">{order.customerPhone}</td>
                    <td className="py-4 px-6 text-ink-muted">{order.deliverySlot}</td>
                    <td className="py-4 px-6 font-bold text-ink">{formatPrice(order.totalAmount)}</td>
                    <td className="py-4 px-6">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="py-4 px-6" onClick={e => e.stopPropagation()}>
                      <button
                        onClick={() => handleResendWhatsApp(order)}
                        className="p-2 text-brand hover:bg-brand/10 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-semibold"
                      >
                        <MessageSquare className="w-4 h-4" /> Send WA
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Drawer overlay */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSelectedOrder(null)} />
          <div className="relative w-full max-w-md bg-surface-card h-full shadow-2xl flex flex-col p-6 overflow-y-auto">
            <div className="flex items-center justify-between border-b border-surface-muted pb-4 mb-6">
              <h2 className="font-heading font-bold text-xl text-brand">Order Details</h2>
              <button onClick={() => setSelectedOrder(null)} className="p-1 hover:bg-surface rounded-lg">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6 flex-1">
              <div>
                <span className="text-xs text-ink-muted">Order Reference</span>
                <p className="font-mono font-bold text-lg text-brand mt-0.5">{selectedOrder.orderRef}</p>
              </div>

              <div>
                <span className="text-xs text-ink-muted">Customer details</span>
                <p className="font-bold text-ink text-sm mt-0.5">{selectedOrder.customerName}</p>
                <p className="text-ink-muted text-sm">{selectedOrder.customerPhone}</p>
              </div>

              <div>
                <span className="text-xs text-ink-muted">Delivery address</span>
                <p className="text-ink text-sm leading-relaxed mt-0.5">{selectedOrder.deliveryAddress}</p>
              </div>

              <div>
                <span className="text-xs text-ink-muted">Delivery schedule</span>
                <p className="text-ink text-sm mt-0.5 font-semibold">
                  Date: {selectedOrder.deliveryDate} <br />
                  Slot: {selectedOrder.deliverySlot}
                </p>
              </div>

              <div>
                <span className="text-xs text-ink-muted">Status manager</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {(['pending_confirmation', 'confirmed', 'out_for_delivery', 'delivered', 'cancelled'] as OrderStatus[]).map(status => (
                    <button
                      key={status}
                      onClick={() => handleUpdateStatus(selectedOrder.id, status)}
                      className={`text-xs px-2.5 py-1.5 rounded-full font-medium transition-colors border ${
                        selectedOrder.status === status
                          ? 'bg-brand text-white border-brand'
                          : 'bg-surface hover:bg-brand/10 border-surface-muted text-ink'
                      }`}
                    >
                      {status.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-surface-muted/50 pt-4">
                <h4 className="font-semibold text-ink text-sm mb-3">Order Items</h4>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs p-2.5 bg-surface rounded-xl">
                      <div>
                        <p className="font-bold text-ink">{item.name}</p>
                        <p className="text-ink-muted">{item.weight_label} x {item.quantity}</p>
                      </div>
                      <span className="font-bold text-brand">{formatPrice(item.line_total)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {selectedOrder.notes && (
                <div className="border-t border-surface-muted/50 pt-4">
                  <span className="text-xs text-ink-muted">Customer Notes</span>
                  <p className="text-ink text-sm leading-relaxed mt-1 italic">&ldquo;{selectedOrder.notes}&rdquo;</p>
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-surface-muted/50 flex gap-2">
              <button
                onClick={() => handleResendWhatsApp(selectedOrder)}
                className="flex-1 bg-[#25D366] hover:bg-[#20bd5a] text-white py-3 rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-1.5"
              >
                <MessageSquare className="w-4 h-4" /> Send Confirmation Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
