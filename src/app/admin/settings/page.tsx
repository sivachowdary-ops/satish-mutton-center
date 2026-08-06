'use client';

import { useState, useEffect } from 'react';
import { Save, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

export default function AdminSettingsPage() {
  const [whatsapp, setWhatsapp] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [slots, setSlots] = useState<string[]>([]);
  const [newSlot, setNewSlot] = useState('');
  const [pincodes, setPincodes] = useState<string[]>([]);
  const [newPincode, setNewPincode] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSettings() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('settings')
          .select('*');

        if (error) throw error;

        if (data) {
          const waConfig = data.find(s => s.key === 'whatsapp_config')?.value || {};
          const delConfig = data.find(s => s.key === 'delivery_config')?.value || {};

          setWhatsapp(waConfig.whatsappNumber || '');
          setPhone(waConfig.phone || '');
          setEmail(waConfig.email || '');
          setSlots(delConfig.slots || []);
          setPincodes(delConfig.pincodes || []);
        }
      } catch (err: any) {
        toast.error(err.message || 'Failed to load settings');
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // 1. Save whatsapp_config
      const { error: waError } = await supabase
        .from('settings')
        .upsert({
          key: 'whatsapp_config',
          value: {
            whatsappNumber: whatsapp,
            phone,
            email,
          },
        });

      if (waError) throw waError;

      // 2. Save delivery_config
      const { error: delError } = await supabase
        .from('settings')
        .upsert({
          key: 'delivery_config',
          value: {
            slots,
            pincodes,
          },
        });

      if (delError) throw delError;

      toast.success('Configuration saved successfully in Supabase!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to save configuration');
    }
  };

  const handleAddSlot = () => {
    if (!newSlot) return;
    setSlots(prev => [...prev, newSlot]);
    setNewSlot('');
  };

  const handleRemoveSlot = (index: number) => {
    setSlots(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddPincode = () => {
    if (newPincode.length !== 6) {
      toast.error('Pincode must be 6 digits');
      return;
    }
    setPincodes(prev => [...prev, newPincode]);
    setNewPincode('');
  };

  const handleRemovePincode = (pin: string) => {
    setPincodes(prev => prev.filter(p => p !== pin));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="animate-spin w-8 h-8 border-4 border-brand border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="max-w-4xl space-y-6">
      {/* Business Profile */}
      <div className="bg-surface-card rounded-2xl p-6 shadow-sm border border-surface-muted space-y-4">
        <h3 className="font-heading font-bold text-lg text-ink">Business Profile</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-ink mb-1">WhatsApp Number</label>
            <input
              type="text"
              required
              value={whatsapp}
              onChange={e => setWhatsapp(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-surface-muted bg-surface text-ink text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Support Phone Number</label>
            <input
              type="text"
              required
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-surface-muted bg-surface text-ink text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-ink mb-1">Support Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-surface-muted bg-surface text-ink text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
        </div>
      </div>

      {/* Delivery Configuration */}
      <div className="bg-surface-card rounded-2xl p-6 shadow-sm border border-surface-muted space-y-6">
        <h3 className="font-heading font-bold text-lg text-ink">Delivery Configuration</h3>

        {/* Delivery Slots */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-ink">Delivery Slots</label>
          <div className="flex flex-wrap gap-2">
            {slots.map((slot, index) => (
              <span
                key={index}
                className="bg-surface border border-surface-muted text-ink text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5"
              >
                {slot}
                <button
                  type="button"
                  onClick={() => handleRemoveSlot(index)}
                  className="text-ink-muted hover:text-danger"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2 max-w-md">
            <input
              type="text"
              value={newSlot}
              onChange={e => setNewSlot(e.target.value)}
              placeholder="e.g. Late Night (8 PM - 10 PM)"
              className="flex-1 px-4 py-2 rounded-xl border border-surface-muted bg-surface text-ink text-xs focus:outline-none"
            />
            <button
              type="button"
              onClick={handleAddSlot}
              className="bg-brand hover:bg-brand-dark text-white p-2 rounded-xl"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Serviceable Pincodes */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-ink">Serviceable Pincodes</label>
          <div className="flex flex-wrap gap-2">
            {pincodes.map(pin => (
              <span
                key={pin}
                className="bg-surface border border-surface-muted text-ink text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5"
              >
                {pin}
                <button
                  type="button"
                  onClick={() => handleRemovePincode(pin)}
                  className="text-ink-muted hover:text-danger"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2 max-w-xs">
            <input
              type="text"
              value={newPincode}
              onChange={e => setNewPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="e.g. 533102"
              className="flex-1 px-4 py-2 rounded-xl border border-surface-muted bg-surface text-ink text-xs focus:outline-none"
            />
            <button
              type="button"
              onClick={handleAddPincode}
              className="bg-brand hover:bg-brand-dark text-white p-2 rounded-xl"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="flex items-center justify-center gap-2 px-6 py-3 bg-brand hover:bg-brand-dark text-white rounded-full font-semibold transition-colors shadow-lg"
      >
        <Save className="w-5 h-5" /> Save Configuration
      </button>
    </form>
  );
}
