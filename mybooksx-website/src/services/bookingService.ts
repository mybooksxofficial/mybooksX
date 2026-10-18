export interface BookingRecord {
  id: string;
  name: string;
  phone: string;
  businessType: string;
  service: string;
  details: string;
  promoCode?: string;
  createdAt: string;
  status: 'New' | 'Contacted' | 'Closed';
}

const STORAGE_KEY = 'mybooksx_bookings';

const INITIAL_SAMPLE_BOOKINGS: BookingRecord[] = [
  {
    id: 'MBX-BK-918204',
    name: 'Vikram Malhotra',
    phone: '+91 9826012345',
    businessType: 'Retail Supermarket Chain',
    service: 'Resto-X (Yearly: ₹4,999)',
    details: 'Need table QR ordering and inventory sync for 2 branch stores in Indore.',
    promoCode: 'FESTIVE10',
    createdAt: new Date(Date.now() - 3600000 * 4).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    status: 'New'
  },
  {
    id: 'MBX-BK-829103',
    name: 'Ananya Sharma',
    phone: '+91 9425098765',
    businessType: 'Boutique Event Management',
    service: 'Event-X (Wedding Suite) - Permanent',
    details: 'Looking for royal wedding guest RSVP and live photo vault for upcoming November wedding.',
    promoCode: 'LUCKY1000',
    createdAt: new Date(Date.now() - 3600000 * 22).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    status: 'Contacted'
  }
];

export const bookingService = {
  getAllBookings(): BookingRecord[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SAMPLE_BOOKINGS));
        return INITIAL_SAMPLE_BOOKINGS;
      }
      return JSON.parse(data);
    } catch (e) {
      console.error('Failed to read bookings from storage', e);
      return INITIAL_SAMPLE_BOOKINGS;
    }
  },

  createBooking(booking: Omit<BookingRecord, 'id' | 'createdAt' | 'status'>): BookingRecord {
    const existing = this.getAllBookings();
    const newRecord: BookingRecord = {
      ...booking,
      id: `MBX-BK-${Math.floor(100000 + Math.random() * 900000)}`,
      createdAt: new Date().toLocaleString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      status: 'New'
    };

    const updated = [newRecord, ...existing];
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save booking', e);
    }
    return newRecord;
  },

  updateStatus(id: string, status: BookingRecord['status']): BookingRecord[] {
    const existing = this.getAllBookings();
    const updated = existing.map((b) => (b.id === id ? { ...b, status } : b));
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {}
    return updated;
  },

  deleteBooking(id: string): BookingRecord[] {
    const existing = this.getAllBookings();
    const updated = existing.filter((b) => b.id !== id);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {}
    return updated;
  }
};
