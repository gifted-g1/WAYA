export interface Rider {
  id: string;
  name: string;
  avatarUrl: string;
  phone: string;
  rating: number; // e.g. 4.92
  totalTrips: number;
  vehicleType: 'Bajaj Boxer 150' | 'TVS HLX 125' | 'Yamaha Crux' | 'Electric EcoBike';
  plateNumber: string; // e.g. "KJA-482QX" (Lagos), "ABJ-913DA" (Abuja)
  currentLocation: {
    latitude: number;
    longitude: number;
  };
  heading: number; // 0 - 360 degrees
  estimatedArrivalMinutes: number;
  distanceKm: number;
  isOnline: boolean;
}
