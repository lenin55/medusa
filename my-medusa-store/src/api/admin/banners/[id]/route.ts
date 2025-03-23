// src/api/admin/banners/[id]/route.ts
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { BANNER_MODULE } from "../../../../modules/banner"
import BannerModuleService from "../../../../modules/banner/service"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const bannerId = req.params.id
  
  try {
    const bannerService: BannerModuleService = req.scope.resolve(BANNER_MODULE)
    const banner = await bannerService.retrieveBanner(bannerId)

    res.json({ banner })
  } catch (error) {
    res.status(500).json({ 
      message: "Error retrieving banner", 
      error: (error as Error).message 
    })
  }
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const bannerId = req.params.id
  
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
      valid_from?: string | Date
      valid_until?: string | Date
    }
    
    // Type cast the request body
    const bannerData = req.body as BannerData
    
    // Update the banner - pass first the filter, then the data
    const banner = await bannerService.updateBanners({ id: bannerId }, bannerData)

    res.json({ banner })
  } catch (error) {
    res.status(500).json({ 
      message: "Error updating banner", 
      error: (error as Error).message 
    })
  }
}

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  const bannerId = req.params.id
  
  try {
    const bannerService: BannerModuleService = req.scope.resolve(BANNER_MODULE)
    // Use deleteBanners (plural) instead of deleteBanner
    await bannerService.deleteBanners([bannerId])

    res.status(204).end()
  } catch (error) {
    res.status(500).json({ 
      message: "Error deleting banner", 
      error: (error as Error).message 
    })
  }
}