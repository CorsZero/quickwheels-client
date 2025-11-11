/**
 * Quick Wheel Vehicle Rental App
 * Service: Mock API
 * Description: Mock data and API functions for ads and authentication
 * Tech: TypeScript + Local Storage
 */

// Types
export interface Vehicle {
  id: string;
  title: string;
  category: 'Cars' | 'Scooters' | 'Motor Bicycle' | 'Vans' | 'Large Vehicles';
  image: string;
  images: string[];
  rentalAmount: number;
  available: boolean;
  sellerId: string;
  sellerName: string;
  description: string;
  manufacturer: string;
  model: string;
  year: number;
  deliveryDetails: string;
  location: string;
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

// Mock data
const mockVehicles: Vehicle[] = [
  {
    id: '1',
    title: 'Toyota Corolla 2020',
    category: 'Cars',
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1551830820-330a71b99659?w=800&h=600&fit=crop'
    ],
    rentalAmount: 8500,
    available: true,
    sellerId: 'seller1',
    sellerName: 'John Doe',
    description: 'Well-maintained Toyota Corolla with excellent fuel efficiency. Perfect for city driving and long trips.',
    manufacturer: 'Toyota',
    model: 'Corolla',
    year: 2020,
    deliveryDetails: 'Free delivery within Colombo city limits',
    location: 'Colombo',
    createdAt: '2024-11-01T10:00:00Z'
  },
  {
    id: '2',
    title: 'Honda Activa Scooter',
    category: 'Scooters',
    image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800&h=600&fit=crop'
    ],
    rentalAmount: 2500,
    available: true,
    sellerId: 'seller2',
    sellerName: 'Jane Smith',
    description: 'Fuel-efficient Honda Activa scooter, perfect for quick city rides.',
    manufacturer: 'Honda',
    model: 'Activa',
    year: 2022,
    deliveryDetails: 'Pickup only',
    location: 'Kandy',
    createdAt: '2024-11-02T14:30:00Z'
  },
  {
    id: '3',
    title: 'Bajaj Pulsar 150',
    category: 'Motor Bicycle',
    image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=600&fit=crop'
    ],
    rentalAmount: 3000,
    available: false,
    sellerId: 'seller3',
    sellerName: 'Mike Johnson',
    description: 'Powerful Bajaj Pulsar 150 for adventure rides.',
    manufacturer: 'Bajaj',
    model: 'Pulsar 150',
    year: 2021,
    deliveryDetails: 'Delivery available for additional cost',
    location: 'Galle',
    createdAt: '2024-11-03T09:15:00Z'
  },
  {
    id: '4',
    title: 'Toyota Hiace Van',
    category: 'Vans',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&h=600&fit=crop'
    ],
    rentalAmount: 12000,
    available: true,
    sellerId: 'seller4',
    sellerName: 'Sarah Wilson',
    description: 'Spacious Toyota Hiace van perfect for group travels and cargo transport.',
    manufacturer: 'Toyota',
    model: 'Hiace',
    year: 2019,
    deliveryDetails: 'Free delivery within 20km radius',
    location: 'Negombo',
    createdAt: '2024-11-04T11:45:00Z'
  },
  {
    id: '5',
    title: 'Isuzu Truck',
    category: 'Large Vehicles',
    image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800&h=600&fit=crop'
    ],
    rentalAmount: 18000,
    available: true,
    sellerId: 'seller5',
    sellerName: 'David Brown',
    description: 'Heavy-duty Isuzu truck for large cargo and construction needs.',
    manufacturer: 'Isuzu',
    model: 'NPR',
    year: 2018,
    deliveryDetails: 'Professional driver included',
    location: 'Colombo',
    createdAt: '2024-11-05T16:20:00Z'
  }
];

// Generate more mock data
const generateMockVehicles = (): Vehicle[] => {
  const categories: Vehicle['category'][] = ['Cars', 'Scooters', 'Motor Bicycle', 'Vans', 'Large Vehicles'];
  const manufacturers = ['Toyota', 'Honda', 'Nissan', 'Suzuki', 'BMW', 'Audi', 'Bajaj', 'Yamaha', 'Isuzu'];
  const locations = ['Colombo', 'Kandy', 'Galle', 'Negombo', 'Matara', 'Jaffna', 'Kurunegala'];
  
  const additionalVehicles: Vehicle[] = [];
  
  for (let i = 6; i <= 50; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const manufacturer = manufacturers[Math.floor(Math.random() * manufacturers.length)];
    const location = locations[Math.floor(Math.random() * locations.length)];
    
    additionalVehicles.push({
      id: i.toString(),
      title: `${manufacturer} ${category.slice(0, -1)} ${2015 + (i % 8)}`,
      category,
      image: `https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop&random=${i}`,
      images: [`https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop&random=${i}`],
      rentalAmount: Math.floor(Math.random() * 15000) + 2000,
      available: Math.random() > 0.2,
      sellerId: `seller${(i % 10) + 1}`,
      sellerName: `Seller ${i}`,
      description: `Quality ${manufacturer} ${category.slice(0, -1).toLowerCase()} available for rent.`,
      manufacturer,
      model: `Model ${i}`,
      year: 2015 + (i % 8),
      deliveryDetails: Math.random() > 0.5 ? 'Free delivery available' : 'Pickup only',
      location,
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
    });
  }
  
  return additionalVehicles;
};

const allMockVehicles = [...mockVehicles, ...generateMockVehicles()];

const mockUsers: { [key: string]: User } = {
  'user1@example.com': {
    id: 'user1',
    name: 'Test User',
    email: 'user1@example.com',
    bookedRides: [
      {
        id: 'booking1',
        vehicleId: '1',
        vehicleTitle: 'Toyota Corolla 2020',
        vehicleImage: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop',
        startDate: '2024-11-10',
        endDate: '2024-11-12',
        totalAmount: 17000,
        status: 'active'
      },
      {
        id: 'booking2',
        vehicleId: '2',
        vehicleTitle: 'Honda Activa Scooter',
        vehicleImage: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=600&fit=crop',
        startDate: '2024-11-05',
        endDate: '2024-11-06',
        totalAmount: 2500,
        status: 'completed'
      }
    ],
    createdAds: ['1', '2']
  }
};

// API Functions
export async function getAds(page = 1, limit = 20, category?: string, search?: string): Promise<{ ads: Vehicle[], total: number, page: number, totalPages: number }> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  let filteredAds = [...allMockVehicles];
  
  // Filter by category
  if (category && category !== 'All') {
    filteredAds = filteredAds.filter(ad => ad.category === category);
  }
  
  // Filter by search
  if (search) {
    const searchLower = search.toLowerCase();
    filteredAds = filteredAds.filter(ad => 
      ad.title.toLowerCase().includes(searchLower) ||
      ad.description.toLowerCase().includes(searchLower) ||
      ad.manufacturer.toLowerCase().includes(searchLower) ||
      ad.location.toLowerCase().includes(searchLower)
    );
  }
  
  // Sort by creation date (newest first)
  filteredAds.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
  const total = filteredAds.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const ads = filteredAds.slice(startIndex, endIndex);
  
  return {
    ads,
    total,
    page,
    totalPages
  };
}

export async function getAdById(id: string): Promise<Vehicle | null> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const ad = allMockVehicles.find(vehicle => vehicle.id === id);
  return ad || null;
}

export async function createAd(data: CreateAdData): Promise<Vehicle> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const newAd: Vehicle = {
    ...data,
    id: (allMockVehicles.length + 1).toString(),
    available: true,
    sellerId: 'user1', // Current user
    sellerName: 'Test User',
    createdAt: new Date().toISOString()
  };
  
  allMockVehicles.unshift(newAd);
  
  // Update user's created ads
  const user = mockUsers['user1@example.com'];
  if (user) {
    user.createdAds.unshift(newAd.id);
  }
  
  return newAd;
}

export async function login(email: string, password: string): Promise<User | null> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simple mock authentication
  if (password === 'password') {
    const user = mockUsers[email];
    if (user) {
      // Store user in localStorage for persistence
      localStorage.setItem('currentUser', JSON.stringify(user));
      return user;
    }
  }
  
  return null;
}

export async function getCurrentUser(): Promise<User | null> {
  const userString = localStorage.getItem('currentUser');
  if (userString) {
    return JSON.parse(userString);
  }
  return null;
}

export async function logout(): Promise<void> {
  localStorage.removeItem('currentUser');
}

export async function bookVehicle(vehicleId: string, startDate: string, endDate: string): Promise<BookedRide> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  const vehicle = await getAdById(vehicleId);
  if (!vehicle) {
    throw new Error('Vehicle not found');
  }
  
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('User not logged in');
  }
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  
  const booking: BookedRide = {
    id: `booking_${Date.now()}`,
    vehicleId,
    vehicleTitle: vehicle.title,
    vehicleImage: vehicle.image,
    startDate,
    endDate,
    totalAmount: vehicle.rentalAmount * days,
    status: 'active'
  };
  
  // Update user's booked rides
  user.bookedRides.unshift(booking);
  localStorage.setItem('currentUser', JSON.stringify(user));
  
  return booking;
}

export async function getUserAds(userId: string): Promise<Vehicle[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 400));
  
  return allMockVehicles.filter(ad => ad.sellerId === userId);
}