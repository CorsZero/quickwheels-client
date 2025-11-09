/**
 * Quick Wheel Vehicle Rental App
 * Context: Ads Context
 * Description: Manages vehicle ads state and ads-related functions
 * Tech: React Context API + TypeScript
 */

import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Vehicle, CreateAdData } from '../services/api';
import { getAds, getAdById, createAd as apiCreateAd } from '../services/api';

interface AdsContextType {
  ads: Vehicle[];
  loading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
  selectedCategory: string;
  searchQuery: string;
  fetchAds: (page?: number, category?: string, search?: string) => Promise<void>;
  getAdDetails: (id: string) => Promise<Vehicle | null>;
  createAd: (data: CreateAdData) => Promise<Vehicle | null>;
  setSelectedCategory: (category: string) => void;
  setSearchQuery: (query: string) => void;
  clearError: () => void;
}

const AdsContext = createContext<AdsContextType | undefined>(undefined);

export function useAds(): AdsContextType {
  const context = useContext(AdsContext);
  if (context === undefined) {
    throw new Error('useAds must be used within an AdsProvider');
  }
  return context;
}

interface AdsProviderProps {
  children: ReactNode;
}

export function AdsProvider({ children }: AdsProviderProps) {
  const [ads, setAds] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchAds = async (page = 1, category?: string, search?: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const categoryToUse = category !== undefined ? category : selectedCategory;
      const searchToUse = search !== undefined ? search : searchQuery;
      
      const response = await getAds(page, 20, categoryToUse, searchToUse);
      
      setAds(response.ads);
      setTotalPages(response.totalPages);
      setCurrentPage(response.page);
      
      if (category !== undefined) {
        setSelectedCategory(category);
      }
      if (search !== undefined) {
        setSearchQuery(search);
      }
    } catch (err) {
      setError('Failed to fetch ads. Please try again.');
      console.error('Error fetching ads:', err);
    } finally {
      setLoading(false);
    }
  };

  const getAdDetails = async (id: string): Promise<Vehicle | null> => {
    try {
      setError(null);
      const ad = await getAdById(id);
      return ad;
    } catch (err) {
      setError('Failed to fetch ad details. Please try again.');
      console.error('Error fetching ad details:', err);
      return null;
    }
  };

  const createAd = async (data: CreateAdData): Promise<Vehicle | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const newAd = await apiCreateAd(data);
      
      // Add the new ad to the beginning of the current ads list
      setAds(prevAds => [newAd, ...prevAds]);
      
      return newAd;
    } catch (err) {
      setError('Failed to create ad. Please try again.');
      console.error('Error creating ad:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const clearError = (): void => {
    setError(null);
  };

  // Fetch initial ads on component mount
  useEffect(() => {
    fetchAds();
  }, []);

  const value: AdsContextType = {
    ads,
    loading,
    error,
    totalPages,
    currentPage,
    selectedCategory,
    searchQuery,
    fetchAds,
    getAdDetails,
    createAd,
    setSelectedCategory,
    setSearchQuery,
    clearError
  };

  return <AdsContext.Provider value={value}>{children}</AdsContext.Provider>;
}