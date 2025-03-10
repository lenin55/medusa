import { v4 as uuidv4 } from 'uuid'
import { Banner } from '../modules/banner/models/banner'

// In-memory store for banners
// Using localStorage to persist data between page refreshes
const STORAGE_KEY = 'medusa_banners'

// Helper to load banners from localStorage
const loadBannersFromStorage = (): Banner[] => {
  try {
    // Check if running in browser environment
    if (typeof window === 'undefined') {
      return []
    }
    
    const storedBanners = localStorage.getItem(STORAGE_KEY)
    if (storedBanners) {
      const parsedBanners = JSON.parse(storedBanners)
      
      // Convert string dates back to Date objects
      return parsedBanners.map((banner: any) => ({
        ...banner,
        created_at: banner.created_at ? new Date(banner.created_at) : new Date(),
        updated_at: banner.updated_at ? new Date(banner.updated_at) : new Date(),
        valid_from: banner.valid_from ? new Date(banner.valid_from) : undefined,
        valid_until: banner.valid_until ? new Date(banner.valid_until) : undefined,
        deleted_at: banner.deleted_at ? new Date(banner.deleted_at) : undefined,
      }))
    }
    return []
  } catch (error) {
    console.error('Failed to load banners from localStorage:', error)
    return []
  }
}

// Helper to save banners to localStorage
const saveBannersToStorage = (banners: Banner[]): void => {
  try {
    // Check if running in browser environment
    if (typeof window === 'undefined') {
      return
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(banners))
    
    // Dispatch a custom event to notify other tabs/windows
    const event = new CustomEvent('bannersUpdated', { detail: { banners } })
    window.dispatchEvent(event)
  } catch (error) {
    console.error('Failed to save banners to localStorage:', error)
  }
}

// Create a singleton instance to maintain state across imports
class BannerStore {
  private static instance: BannerStore;
  private banners: Banner[] = [];
  private initialized = false;

  private constructor() {
    this.loadBanners();
  }

  public static getInstance(): BannerStore {
    if (!BannerStore.instance) {
      BannerStore.instance = new BannerStore();
    }
    return BannerStore.instance;
  }

  private loadBanners() {
    if (!this.initialized) {
      this.banners = loadBannersFromStorage();
      this.initialized = true;
    }
  }

  public getAllBanners(): Banner[] {
    this.loadBanners();
    return [...this.banners];
  }

  public getActiveBanners(): Banner[] {
    this.loadBanners();
    const now = new Date();
    
    return this.banners.filter(banner => {
      // Must be active
      if (!banner.is_active) return false;
      
      // If there's a valid_from date, the current date must be after it
      if (banner.valid_from && now < new Date(banner.valid_from)) return false;
      
      // If there's a valid_until date, the current date must be before it
      if (banner.valid_until && now > new Date(banner.valid_until)) return false;
      
      return true;
    });
  }

  public getBanner(id: string): Banner | undefined {
    this.loadBanners();
    return this.banners.find(banner => banner.id === id);
  }

  public createBanner(data: Omit<Banner, 'id' | 'created_at' | 'updated_at'>): Banner {
    this.loadBanners();
    const now = new Date();
    
    const newBanner: Banner = {
      id: uuidv4(),
      created_at: now,
      updated_at: now,
      ...data
    };
    
    this.banners.push(newBanner);
    saveBannersToStorage(this.banners);
    
    return newBanner;
  }

  public updateBanner(id: string, data: Partial<Banner>): Banner | undefined {
    this.loadBanners();
    const index = this.banners.findIndex(banner => banner.id === id);
    
    if (index === -1) return undefined;
    
    const updatedBanner = {
      ...this.banners[index],
      ...data,
      updated_at: new Date()
    };
    
    this.banners[index] = updatedBanner;
    saveBannersToStorage(this.banners);
    
    return updatedBanner;
  }

  public deleteBanner(id: string): boolean {
    this.loadBanners();
    const initialLength = this.banners.length;
    this.banners = this.banners.filter(banner => banner.id !== id);
    
    if (this.banners.length !== initialLength) {
      saveBannersToStorage(this.banners);
      return true;
    }
    
    return false;
  }
}

// Singleton instance
const bannerStore = BannerStore.getInstance();

// Export the functions that use the singleton
export const getAllBanners = () => bannerStore.getAllBanners();
export const getActiveBanners = () => bannerStore.getActiveBanners();
export const getBanner = (id: string) => bannerStore.getBanner(id);
export const createBanner = (data: Omit<Banner, 'id' | 'created_at' | 'updated_at'>) => bannerStore.createBanner(data);
export const updateBanner = (id: string, data: Partial<Banner>) => bannerStore.updateBanner(id, data);
export const deleteBanner = (id: string) => bannerStore.deleteBanner(id);