'use client';

import { useState, useEffect } from 'react';
import { Mail, Phone, Check, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

interface MockMessage {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<MockMessage[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadMessages() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formatted: MockMessage[] = (data || []).map((m: any) => ({
        id: m.id,
        name: m.name,
        phone: m.phone || '',
        email: m.email || '',
        message: m.message,
        isRead: m.is_read,
        createdAt: new Date(m.created_at).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
      }));

      setMessages(formatted);
    } catch (err: any) {
      toast.error(err.message || 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMessages();
  }, []);

  const handleToggleRead = async (id: string, currentRead: boolean) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ is_read: !currentRead })
        .eq('id', id);

      if (error) throw error;

      setMessages(prev =>
        prev.map(m => (m.id === id ? { ...m, isRead: !m.isRead } : m))
      );
      toast.success('Message status updated!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update message status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    try {
      const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setMessages(prev => prev.filter(m => m.id !== id));
      toast.success('Message deleted!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete message');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="animate-spin w-8 h-8 border-4 border-brand border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {messages.length === 0 ? (
        <div className="text-left py-20 px-8 bg-surface-card rounded-2xl border border-surface-muted">
          <p className="text-4xl mb-4">💬</p>
          <h3 className="font-heading text-xl font-semibold text-ink mb-2">No messages</h3>
          <p className="text-ink-muted">All clear! No pending customer messages.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`bg-surface-card rounded-2xl p-6 border shadow-sm transition-colors ${
                msg.isRead ? 'border-surface-muted opacity-80' : 'border-brand/20 bg-brand/5'
              }`}
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <div>
                  <h3 className="font-heading font-bold text-lg text-ink flex items-center gap-2">
                    {msg.name}
                    {!msg.isRead && (
                      <span className="text-[10px] bg-brand text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                        New
                      </span>
                    )}
                  </h3>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-muted mt-1.5">
                    {msg.phone && (
                      <a href={`tel:${msg.phone}`} className="flex items-center gap-1 hover:text-brand transition-colors">
                        <Phone className="w-3.5 h-3.5" /> {msg.phone}
                      </a>
                    )}
                    {msg.email && (
                      <a href={`mailto:${msg.email}`} className="flex items-center gap-1 hover:text-brand transition-colors">
                        <Mail className="w-3.5 h-3.5" /> {msg.email}
                      </a>
                    )}
                  </div>
                </div>
                <div className="text-right sm:text-right w-full sm:w-auto">
                  <span className="text-xs text-ink-muted">{msg.createdAt}</span>
                </div>
              </div>

              <div className="bg-surface rounded-xl p-4 border border-surface-muted/50 mb-4">
                <p className="text-ink text-sm leading-relaxed whitespace-pre-wrap">{msg.message}</p>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => handleToggleRead(msg.id, msg.isRead)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    msg.isRead
                      ? 'bg-surface hover:bg-brand/10 text-ink border border-surface-muted'
                      : 'bg-brand text-white hover:bg-brand-dark'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                  {msg.isRead ? 'Mark Unread' : 'Mark Read'}
                </button>
                <button
                  onClick={() => handleDelete(msg.id)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-surface hover:bg-danger/10 hover:text-danger text-ink-muted border border-surface-muted rounded-lg text-xs font-semibold transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
