'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Tags,
  ShoppingBag,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { siteConfig } from '@/config/site';
import { supabase } from '@/lib/supabase';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    if (pathname === '/admin/login') {
      setLoading(false);
      return;
    }

    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setAuthenticated(true);
        setLoading(false);
      } else {
        router.push('/admin/login');
      }
    };
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setAuthenticated(true);
        setLoading(false);
      } else {
        setAuthenticated(false);
        if (pathname !== '/admin/login') {
          router.push('/admin/login');
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [pathname, router]);

  // If we are on the login page, don't show sidebar
  if (pathname === '/admin/login') {
    return <div className="min-h-screen bg-surface-muted">{children}</div>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-muted flex items-center justify-center">
        <span className="animate-spin w-8 h-8 border-4 border-brand border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!authenticated) return null;

  const menuItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/products', label: 'Products', icon: Package },
    { href: '/admin/categories', label: 'Categories', icon: Tags },
    { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen flex bg-surface-muted">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-brand-dark text-white border-r border-brand shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-brand">
          <span className="font-heading text-lg font-bold text-accent-light">{siteConfig.name} Admin</span>
        </div>
        <nav className="flex-1 py-6 px-4 space-y-1">
          {menuItems.map(item => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-brand text-white shadow-[0_4px_12px_rgba(122,31,31,0.2)]'
                    : 'text-surface/70 hover:text-white hover:bg-brand/20'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-brand">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-surface/70 hover:text-white hover:bg-brand/20 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Sidebar - Mobile */}
      <aside
        className={`fixed top-0 bottom-0 left-0 w-64 bg-brand-dark text-white z-50 transform transition-transform duration-300 lg:hidden flex flex-col ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-brand">
          <span className="font-heading text-lg font-bold text-accent-light">{siteConfig.name} Admin</span>
          <button onClick={() => setIsSidebarOpen(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>
        <nav className="flex-1 py-6 px-4 space-y-1">
          {menuItems.map(item => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-brand text-white'
                    : 'text-surface/70 hover:text-white hover:bg-brand/20'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-brand">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-surface/70 hover:text-white hover:bg-brand/20 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-surface-card border-b border-surface-muted flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden p-2 text-ink hover:bg-surface-muted rounded-lg"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="ml-4 font-heading text-lg font-bold text-ink">
            {menuItems.find(item => pathname === item.href)?.label || 'Admin'}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-ink-muted">Satish</span>
            <div className="w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center font-bold text-sm">
              S
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
