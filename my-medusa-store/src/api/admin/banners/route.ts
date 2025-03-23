import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { BANNER_MODULE } from "../../../modules/banner"
import BannerModuleService from "../../../modules/banner/service"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const bannerService: BannerModuleService = req.scope.resolve(BANNER_MODULE)
    
    const skip = parseInt(req.query.offset as string) || 0
    const limit = parseInt(req.query.limit as string) || 100
    
    const [banners, count] = await bannerService.listAndCountBanners(
      {},
      {
        skip,
        take: limit,
      }
    )

    res.json({ banners, count })
  } catch (error) {
    res.status(500).json({ 
      message: "Error fetching banners", 
      error: (error as Error).message 
    })
  }
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const bannerService: BannerModuleService = req.scope.resolve(BANNER_MODULE)
    
    // Define the expected banner structure based on the model
    interface BannerData {
      id?: string
      name?: string
      image_url?: string
      description?: string | null
      is_active?: boolean
      link_url?: string | null
      valid_from?: string | null
      valid_until?: string | null
    }
    
    // Type cast the request body
    const bannerData = req.body as BannerData
    
    const banner = await bannerService.createBanners(bannerData)
    
    res.status(201).json({ banner })
  } catch (error) {
    res.status(500).json({ 
      message: "Error creating banner", 
      error: (error as Error).message 
    })
  }
}