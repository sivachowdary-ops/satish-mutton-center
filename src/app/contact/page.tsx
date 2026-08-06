'use client';

import { useState } from 'react';
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { contactFormSchema, type ContactFormData } from '@/lib/validations';
import { getWhatsAppInquiryLink } from '@/lib/whatsapp';
import { toast } from 'sonner';

export default function ContactPage() {
  const [form, setForm] = useState<ContactFormData>({
    name: '',
    phone: '',
    email: '',
    message: '',
    botField: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: keyof ContactFormData, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Honeypot spam check
    if (form.botField) {
      toast.error('Spam detected.');
      return;
    }

    const result = contactFormSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach(issue => {
        fieldErrors[issue.path[0] as string] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      // In a real environment, this inserts into contact_messages table via Supabase API
      // Since Supabase credentials are not connected yet, we mock successful submission
      await new Promise(resolve => setTimeout(resolve, 800));
      toast.success('Message sent successfully! We will get back to you soon.');
      setForm({ name: '', phone: '', email: '', message: '', botField: '' });
    } catch {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-heading text-4xl font-bold text-ink text-center mb-4">Contact Us</h1>
      <p className="text-ink-muted text-center mb-12 max-w-lg mx-auto">
        Have questions about bulk orders, pricing, or delivery areas? Get in touch with Satish Mutton.
      </p>

      <div className="grid md:grid-cols-5 gap-8">
        {/* Contact details */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-surface-card rounded-2xl p-6 shadow-sm border border-surface-muted space-y-6">
            <h2 className="font-heading text-xl font-bold text-ink">Get in Touch</h2>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5 text-brand" />
              </div>
              <div>
                <h3 className="font-semibold text-ink text-sm">Call Us</h3>
                <a href={`tel:${siteConfig.phone}`} className="text-ink-muted text-sm hover:text-brand transition-colors">
                  {siteConfig.phone}
                </a>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center shrink-0">
                <MessageCircle className="w-5 h-5 text-brand" />
              </div>
              <div>
                <h3 className="font-semibold text-ink text-sm">WhatsApp</h3>
                <a href={getWhatsAppInquiryLink()} target="_blank" rel="noopener noreferrer" className="text-ink-muted text-sm hover:text-brand transition-colors">
                  Chat with Satish
                </a>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 text-brand" />
              </div>
              <div>
                <h3 className="font-semibold text-ink text-sm">Email Us</h3>
                <a href={`mailto:${siteConfig.email}`} className="text-ink-muted text-sm hover:text-brand transition-colors">
                  {siteConfig.email}
                </a>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-brand" />
              </div>
              <div>
                <h3 className="font-semibold text-ink text-sm">Address</h3>
                <p className="text-ink-muted text-sm leading-relaxed">
                  {siteConfig.address.street}, {siteConfig.address.city},<br />
                  {siteConfig.address.state} - {siteConfig.address.pincode}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="md:col-span-3">
          <div className="bg-surface-card rounded-2xl p-6 shadow-sm border border-surface-muted">
            <h2 className="font-heading text-xl font-bold text-ink mb-6">Send a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Honeypot field (hidden) */}
              <input
                type="text"
                name="botField"
                value={form.botField}
                onChange={e => handleChange('botField', e.target.value)}
                className="hidden"
                autoComplete="off"
              />

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-ink mb-1">Name *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => handleChange('name', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-surface-muted bg-surface text-ink text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="Your name"
                  />
                  {errors.name && <p className="text-danger text-xs mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-ink mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={e => handleChange('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                    className="w-full px-4 py-2.5 rounded-xl border border-surface-muted bg-surface text-ink text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="10-digit mobile"
                  />
                  {errors.phone && <p className="text-danger text-xs mt-1">{errors.phone}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-ink mb-1">Email (optional)</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => handleChange('email', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-surface-muted bg-surface text-ink text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="Your email address"
                />
                {errors.email && <p className="text-danger text-xs mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-ink mb-1">Message *</label>
                <textarea
                  value={form.message}
                  onChange={e => handleChange('message', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2.5 rounded-xl border border-surface-muted bg-surface text-ink text-sm focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                  placeholder="How can we help you?"
                />
                {errors.message && <p className="text-danger text-xs mt-1">{errors.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-brand hover:bg-brand-dark text-white py-3 rounded-full font-semibold transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span className="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
                ) : (
                  'Send Message'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
