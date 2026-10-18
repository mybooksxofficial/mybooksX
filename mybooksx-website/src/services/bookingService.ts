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

export const bookingService = {
  getAllBookings(): BookingRecord[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        return [];
      }
      const parsed = JSON.parse(data);
      // Filter out any past dummy test data with Vikram Malhotra or Ananya Sharma
      const realOnly = parsed.filter(
        (b: BookingRecord) =>
          b.name !== 'Vikram Malhotra' && b.name !== 'Ananya Sharma' && !b.id.startsWith('SAMPLE-')
      );
      if (realOnly.length !== parsed.length) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(realOnly));
      }
      return realOnly;
    } catch (e) {
      console.error('Failed to read bookings from storage', e);
      return [];
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
