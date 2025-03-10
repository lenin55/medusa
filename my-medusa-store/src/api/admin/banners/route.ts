import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Banner } from "../../../modules/banner/models/banner"
import { getAllBanners, createBanner } from "../../../shared/banner-store"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const skip = parseInt(req.query.offset as string) || 0
    const limit = parseInt(req.query.limit as string) || 100
    
    // Get all banners
    const allBanners = getAllBanners()
    
    // Apply pagination
    const paginatedBanners = allBanners.slice(skip, skip + limit)

    res.json({ banners: paginatedBanners })
  } catch (error) {
    res.status(500).json({ 
      message: "Error fetching banners", 
      error: (error as Error).message 
    })
  }
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    // Cast req.body to the appropriate type
    const bannerData = req.body as Omit<Banner, "id" | "created_at" | "updated_at">
    const banner = createBanner(bannerData)
    res.status(201).json({ banner })
  } catch (error) {
    res.status(500).json({ 
      message: "Error creating banner", 
      error: (error as Error).message 
    })
  }
}