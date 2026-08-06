'use client';

import { useState, useEffect } from 'react';
import { DollarSign, ShoppingBag, AlertTriangle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { KPICard } from '@/components/admin/KPICard';
import { formatPrice } from '@/lib/formatCurrency';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface LowStockItem {
  productName: string;
  weight: string;
  stock: number;
  threshold: number;
}

interface RecentOrder {
  ref: string;
  name: string;
  items: string;
  total: number;
  status: string;
  date: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    avgOrderValue: 0,
    pendingConfirmations: 0,
  });
  const [lowStockItems, setLowStockItems] = useState<LowStockItem[]>([]);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);

        // 1. Fetch Orders for KPIs and Recent Table
        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false });

        if (ordersError) throw ordersError;

        const orders = ordersData || [];
        const confirmedOrders = orders.filter(o => o.status !== 'cancelled');
        const totalRevenue = confirmedOrders.reduce((sum, o) => sum + Number(o.total_amount), 0);
        const totalOrders = orders.length;
        const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
        const pendingConfirmations = orders.filter(o => o.status === 'pending_confirmation').length;

        // Map recent orders
        const mappedRecent: RecentOrder[] = orders.slice(0, 5).map(o => {
          // Format item list display
          let itemSummary = '';
          if (Array.isArray(o.items)) {
            itemSummary = o.items
              .map((item: any) => `${item.name} (${item.weight_label}) x${item.quantity}`)
              .join(', ');
          }
          
          return {
            ref: o.order_ref,
            name: o.customer_name,
            items: itemSummary || 'Mutton items',
            total: Number(o.total_amount),
            status: o.status,
            date: new Date(o.created_at).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            }),
          };
        });

        // 2. Fetch Products and Variants for Low Stock check
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select(`
            name,
            low_stock_threshold,
            product_variants (
              weight_label,
              stock_qty
            )
          `);

        if (productsError) throw productsError;

        const lowStock: LowStockItem[] = [];
        if (productsData) {
          productsData.forEach((p: any) => {
            const threshold = p.low_stock_threshold || 5;
            const variants = p.product_variants || [];
            variants.forEach((v: any) => {
              if (v.stock_qty <= threshold) {
                lowStock.push({
                  productName: p.name,
                  weight: v.weight_label,
                  stock: v.stock_qty,
                  threshold: threshold,
                });
              }
            });
          });
        }

        setStats({
          totalRevenue,
          totalOrders,
          avgOrderValue,
          pendingConfirmations,
        });
        setRecentOrders(mappedRecent);
        setLowStockItems(lowStock);
      } catch (err: any) {
        console.error('Error loading dashboard data:', err);
        toast.error('Failed to load live dashboard statistics.');
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="animate-spin w-8 h-8 border-4 border-brand border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <KPICard
          title="Total Revenue (All Time)"
          value={formatPrice(stats.totalRevenue)}
          icon={DollarSign}
        />
        <KPICard
          title="Total Orders"
          value={stats.totalOrders.toString()}
          icon={ShoppingBag}
        />
        <KPICard
          title="Average Order Value"
          value={formatPrice(stats.avgOrderValue)}
          icon={DollarSign}
        />
        <KPICard
          title="Pending Confirmations"
          value={stats.pendingConfirmations.toString()}
          icon={AlertTriangle}
          className={stats.pendingConfirmations > 0 ? 'border-warning/30 bg-warning/5 text-warning-dark' : ''}
        />
      </div>


      {/* Low Stock Alerts — full width now that chart is removed */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Low Stock Alerts */}
        <div className="bg-surface-card rounded-2xl p-6 shadow-sm border border-surface-muted flex flex-col">
          <h3 className="font-heading font-bold text-ink text-lg mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-warning" /> Low Stock Warning
          </h3>
          <div className="flex-1 overflow-y-auto max-h-60 space-y-3">
            {lowStockItems.length === 0 ? (
              <p className="text-sm text-ink-muted italic">All products are well stocked.</p>
            ) : (
              lowStockItems.map((item, i) => (
                <div key={i} className="flex justify-between items-center p-3 bg-surface rounded-xl border border-surface-muted">
                  <div>
                    <h4 className="font-semibold text-ink text-sm truncate max-w-[140px]">{item.productName}</h4>
                    <p className="text-xs text-ink-muted">{item.weight}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-danger">{item.stock} left</span>
                    <p className="text-[10px] text-ink-muted">Threshold: {item.threshold}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent Orders List */}
      <div className="bg-surface-card rounded-2xl p-6 shadow-sm border border-surface-muted">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-heading font-bold text-ink text-lg">Recent Orders</h3>
          <Link href="/admin/orders" className="text-brand hover:text-brand-dark text-sm font-semibold flex items-center gap-1 transition-colors">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          {recentOrders.length === 0 ? (
            <p className="text-sm text-ink-muted py-6 italic text-center">No orders placed yet.</p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-surface-muted text-ink-muted">
                  <th className="py-3 px-4 font-semibold">Order Ref</th>
                  <th className="py-3 px-4 font-semibold">Customer</th>
                  <th className="py-3 px-4 font-semibold">Items</th>
                  <th className="py-3 px-4 font-semibold">Total Amount</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(order => (
                  <tr key={order.ref} className="border-b border-surface-muted/50 hover:bg-surface/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-brand">{order.ref}</td>
                    <td className="py-3 px-4 text-ink font-medium">{order.name}</td>
                    <td className="py-3 px-4 text-ink-muted max-w-[180px] truncate">{order.items}</td>
                    <td className="py-3 px-4 font-bold text-ink">{formatPrice(order.total)}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase ${
                        order.status === 'delivered'
                          ? 'bg-success/10 text-success'
                          : order.status === 'cancelled'
                          ? 'bg-danger/10 text-danger'
                          : 'bg-warning/10 text-warning'
                      }`}>
                        {order.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-ink-muted">{order.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
