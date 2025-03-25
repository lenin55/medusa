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

export async function PUT(req: MedusaRequest, res: MedusaResponse) {
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
      valid_from?: string | Date | null
      valid_until?: string | Date | null
    }
    
    // Type cast the request body
    const bannerData = req.body as BannerData
    
    console.log("Route handler received data for update:", {
      bannerId,
      bannerData
    })
    
    try {
      // First retrieve the existing banner to get the full object
      const existingBanner = await bannerService.retrieveBanner(bannerId)
      
      // Process the data to ensure date fields are properly formatted
      const processedData: Record<string, any> = { ...bannerData }
      
      // Convert valid_from to Date if it's a string
      if (typeof processedData.valid_from === 'string') {
        processedData.valid_from = new Date(processedData.valid_from)
      }
      
      // Convert valid_until to Date if it's a string
      if (typeof processedData.valid_until === 'string') {
        processedData.valid_until = new Date(processedData.valid_until)
      }
      
      // Create a properly typed update object
      const updateData = {
        id: bannerId,
        ...processedData
      }
      
      // Use updateBanners with the properly typed object
      const updatedBanner = await bannerService.updateBanners(updateData)
      
      // Validate that we got a response
      if (!updatedBanner) {
        throw new Error("No banner returned after update")
      }
      
      console.log("Banner successfully updated:", updatedBanner)
      
      // Return the updated banner with proper type
      res.json({ banner: updatedBanner })
    } catch (updateError) {
      console.error("Error updating banner:", updateError)
      return res.status(500).json({ 
        message: "Error updating banner", 
        error: (updateError as Error).message,
        stack: (updateError as Error).stack
      })
    }
  } catch (error) {
    console.error("General error in PUT handler:", error)
    res.status(500).json({ 
      message: "Error processing banner update request", 
      error: (error as Error).message,
      stack: (error as Error).stack
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