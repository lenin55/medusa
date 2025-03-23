// Simple in-memory storage for banners

// Banner type definition - exported for use in other files
export interface Banner {
  id: string;
  name: string;
  image_url: string;
  description?: string;
  is_active: boolean;
  link_url?: string;
  valid_from?: Date | string | null;
  valid_until?: Date | string | null;
  priority: number;
  placement: string;
  created_at: Date;
  updated_at: Date;
}

// In-memory storage
const banners: Banner[] = [];

// Simple ID generator
function generateId() {
  return 'banner_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

/**
 * Get all banners
 */
export function getAllBanners(): Banner[] {
  return [...banners].sort((a, b) => b.priority - a.priority);
}

/**
 * Get a specific banner by ID
 */
export function getBanner(id: string): Banner | undefined {
  return banners.find(banner => banner.id === id);
}

/**
 * Get all active banners for the current time
 */
export function getActiveBanners(placement?: string): Banner[] {
  const now = new Date();
  
  return banners
    .filter(banner => {
      // Must be active
      if (!banner.is_active) return false;
      
      // Check valid_from date if it exists
      if (banner.valid_from) {
        const validFrom = new Date(banner.valid_from);
        if (validFrom > now) return false;
      }
      
      // Check valid_until date if it exists
      if (banner.valid_until) {
        const validUntil = new Date(banner.valid_until);
        if (validUntil < now) return false;
      }
      
      // Check placement if specified
      if (placement && banner.placement !== placement) return false;
      
      return true;
    })
    .sort((a, b) => b.priority - a.priority);
}

/**
 * Create a new banner
 */
export function createBanner(data: Omit<Banner, "id" | "created_at" | "updated_at">): Banner {
  const now = new Date();
  
  const newBanner: Banner = {
    id: generateId(),
    ...data,
    priority: data.priority || 0,
    placement: data.placement || 'homepage_top',
    created_at: now,
    updated_at: now
  };
  
  banners.push(newBanner);
  return newBanner;
}

/**
 * Update an existing banner
 */
export function updateBanner(id: string, data: Partial<Banner>): Banner | undefined {
  const index = banners.findIndex(banner => banner.id === id);
  
  if (index === -1) {
    return undefined;
  }
  
  banners[index] = {
    ...banners[index],
    ...data,
    updated_at: new Date()
  };
  
  return banners[index];
}

/**
 * Delete a banner
 */
export function deleteBanner(id: string): boolean {
  const initialLength = banners.length;
  const filteredBanners = banners.filter(banner => banner.id !== id);
  
  if (initialLength !== filteredBanners.length) {
    banners.length = 0;
    banners.push(...filteredBanners);
    return true;
  }
  
  return false;
}