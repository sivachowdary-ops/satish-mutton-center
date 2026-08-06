export const siteConfig = {
  name: 'Satish Mutton',
  description: 'Fresh mutton delivery near Rajahmundry, Andhra Pradesh. Farm-sourced, hygienically packed, delivered to your doorstep.',
  url: 'https://satishmutton.com',
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919030458174',
  phone: '+91 90304 58174',
  email: 'contact@satishmutton.com',
  address: {
    street: 'Main Road',
    city: 'Rajahmundry',
    state: 'Andhra Pradesh',
    pincode: '533101',
    country: 'India',
  },
  socialLinks: {
    instagram: '#',
    facebook: '#',
  },
  deliverySlots: [
    'Morning (8 AM - 11 AM)',
    'Afternoon (12 PM - 3 PM)',
    'Evening (4 PM - 7 PM)',
  ] as const,
  serviceablePincodes: ['533101', '533103', '533104', '533105', '533106', '533201', '533296'],
  marqueeItems: ['Fresh Mutton', 'Taste Real Mutton', 'Low Cost', 'Contact for Bulk Orders'],
  openingHours: 'Mon-Sun: 6:00 AM - 10:00 PM',
  whatsappInquiryMessage: "Hi, I visited the Satish Mutton website and I'd like to make an order/inquiry.",
};
