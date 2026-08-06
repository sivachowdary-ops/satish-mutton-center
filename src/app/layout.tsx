import type { Metadata } from 'next';
import { Fraunces, Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';
import { Header } from '@/components/layout/Header';
import { MarqueeBar } from '@/components/layout/MarqueeBar';
import { Footer } from '@/components/layout/Footer';
import { WhatsAppFloatButton } from '@/components/layout/WhatsAppFloatButton';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { siteConfig } from '@/config/site';

const fraunces = Fraunces({
  variable: '--font-fraunces',
  subsets: ['latin'],
  display: 'swap',
});

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} | Fresh Mutton Delivery in Rajahmundry`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: ['fresh mutton', 'mutton delivery', 'Rajahmundry', 'goat meat', 'Andhra Pradesh', 'Satish Mutton'],
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">
        <Providers>
          <MarqueeBar />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <WhatsAppFloatButton />
          <CartDrawer />
        </Providers>
      </body>
    </html>
  );
}
