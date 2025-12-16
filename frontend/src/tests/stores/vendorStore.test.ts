import { describe, it, expect, vi, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useVendorStore } from '../../stores/vendorStore';
import { VendorService } from '../../services/VendorService';

// Mock VendorService
vi.mock('../../services/VendorService', () => ({
  VendorService: {
    getVendors: vi.fn(),
    createVendor: vi.fn(),
    deleteVendor: vi.fn(),
  },
}));

describe('VendorStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('fetches vendors successfully', async () => {
    const store = useVendorStore();
    const mockVendors = [{ id: 1, name: 'Test Vendor', contact_person: 'Test', email: 'test@test.com', partner_type: 'Supplier' }];
    
    // @ts-ignore
    vi.mocked(VendorService.getVendors).mockResolvedValue(mockVendors);

    await store.fetchVendors();

    expect(store.vendors).toEqual(mockVendors.reverse());
    expect(store.loading).toBe(false);
    expect(store.fetchError).toBeNull();
  });

  it('handles fetch error', async () => {
    const store = useVendorStore();
    // @ts-ignore
    vi.mocked(VendorService.getVendors).mockRejectedValue(new Error('Network Error'));

    await store.fetchVendors();

    expect(store.vendors).toEqual([]);
    expect(store.fetchError).toBeTruthy();
    expect(store.loading).toBe(false);
  });

  it('adds vendor successfully', async () => {
    const store = useVendorStore();
    const newVendor = { name: 'New', contact_person: 'Person', email: 'new@test.com', partner_type: 'Partner' };
    
    // @ts-ignore
    vi.mocked(VendorService.createVendor).mockResolvedValue({ id: 2, ...newVendor });
    // @ts-ignore
    vi.mocked(VendorService.getVendors).mockResolvedValue([{ id: 2, ...newVendor }]); // Store refreshes list

    // @ts-ignore
    await store.addVendor(newVendor);

    expect(VendorService.createVendor).toHaveBeenCalledWith(newVendor);
    expect(store.actionError).toBeNull();
  });

  it('handles empty vendor ID on delete', async () => {
     // This logic is actually in the component, store expects ID.
     // Testing store delete
     const store = useVendorStore();
     // @ts-ignore
     vi.mocked(VendorService.deleteVendor).mockResolvedValue();
     // @ts-ignore
     vi.mocked(VendorService.getVendors).mockResolvedValue([]);

     await store.deleteVendor(123);

     expect(VendorService.deleteVendor).toHaveBeenCalledWith('123');
     expect(store.actionError).toBeNull();
  });
});
