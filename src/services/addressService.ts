import { SavedAddress } from '../types';
import { POPULAR_LOCATIONS } from './mockData';

export const addressService = {
  async getSavedAddresses(): Promise<SavedAddress[]> {
    return POPULAR_LOCATIONS;
  },

  async searchAddress(query: string): Promise<SavedAddress[]> {
    const q = query.toLowerCase().trim();
    if (!q) return POPULAR_LOCATIONS;
    return POPULAR_LOCATIONS.filter(
      (loc) =>
        loc.title.toLowerCase().includes(q) ||
        loc.addressText.toLowerCase().includes(q) ||
        (loc.landmark && loc.landmark.toLowerCase().includes(q)) ||
        loc.city.toLowerCase().includes(q)
    );
  },
};
