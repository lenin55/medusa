// src/api/store/banners/route.ts
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { BANNER_MODULE } from "../../../modules/banner"
import BannerModuleService from "../../../modules/banner/service"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const bannerService: BannerModuleService = req.scope.resolve(BANNER_MODULE)
    
    // Get active banners only
    const banners = await bannerService.getActiveBanners()
    
    // Set CORS headers to allow requests from your storefront
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    
    res.status(200).json({ banners })
  } catch (error) {
    console.error("Error in /store/banners endpoint:", error)
    res.status(500).json({ 
      message: "Error fetching active banners", 
      error: (error as Error).message 
    })
  }
}

export async function OPTIONS(req: MedusaRequest, res: MedusaResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.status(200).end()
} 