/**
 * Quick Wheel Vehicle Rental App
 * Service: Mock API
 * Description: Mock data and API functions for ads and authentication
 * Tech: TypeScript + Local Storage
 */

// Types
export interface Vehicle {
  id: string;
  ownerId?: string;
  title?: string;
  make: string;
  model: string;
  year: number;
  category: string;
  transmission?: string;
  fuelType?: string;
  seats: number;
  pricePerDay: number;
  location: string;
  district: string;
  description: string;
  features?: string[];
  image?: string;
  images: string[];
  status: string;
  rentalAmount?: number;
  available?: boolean;
  sellerId?: string;
  sellerName?: string;
  manufacturer?: string;
  deliveryDetails?: string;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  bookedRides: BookedRide[];
  createdAds: string[];
}

export interface BookedRide {
  id: string;
  vehicleId: string;
  vehicleTitle: string;
  vehicleImage: string;
  startDate: string;
  endDate: string;
  totalAmount: number;
  status: 'active' | 'completed' | 'cancelled';
}

export interface CreateAdData {
  title: string;
  category: Vehicle['category'];
  image: string;
  images: string[];
  rentalAmount: number;
  description: string;
  manufacturer: string;
  model: string;
  year: number;
  deliveryDetails: string;
  location: string;
}