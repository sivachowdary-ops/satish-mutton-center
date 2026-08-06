import { z } from 'zod';

export const checkoutFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number'),
  address: z.string().min(10, 'Please provide a detailed address'),
  deliveryDate: z.string().min(1, 'Please select a delivery date'),
  deliverySlot: z.string().min(1, 'Please select a delivery slot'),
  notes: z.string().optional(),
});

export type CheckoutFormData = z.infer<typeof checkoutFormSchema>;

export const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number'),
  email: z.string().email('Please enter a valid email address').optional().or(z.literal('')),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  botField: z.string().optional(), // Honeypot
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
