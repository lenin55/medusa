import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { getActiveBanners } from "../../../shared/banner-store"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    // Get active banners only (those that are active and within valid date range)
    const activeBanners = getActiveBanners()
    
    // Set CORS headers to allow requests from your storefront
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    
    // Return the banners as JSON
    res.status(200).json({ banners: activeBanners })
  } catch (error) {
    console.error("Error in /store/banners endpoint:", error)
    res.status(500).json({ 
      message: "Error fetching active banners", 
      error: (error as Error).message 
    })
  }
}

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS(req: MedusaRequest, res: MedusaResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.status(200).end()
}