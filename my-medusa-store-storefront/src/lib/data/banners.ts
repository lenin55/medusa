import { sdk } from "../config"
import { getCacheOptions } from "./cookies"

export type Banner = {
  id: string
  name: string
  image_url: string
  description?: string
  is_active: boolean
  link_url?: string
  valid_from?: Date
  valid_until?: Date
}

export type BannersResponse = {
  banners: Banner[]
}

/**
 * Fetch active banners from the Medusa backend
 */
export async function getActiveBanners(): Promise<Banner[]> {
  try {
    // Get cache options
    const cacheOptions = await getCacheOptions("banners")
    
    // Use the SDK client instead of direct fetch for proper URL handling
    const { banners } = await sdk.client.fetch<BannersResponse>(
      `/store/banners`,
      {
        next: cacheOptions
      }
    )
    
    return banners || []
  } catch (error) {
    console.error("Error fetching banners:", error)
    return []
  }
}