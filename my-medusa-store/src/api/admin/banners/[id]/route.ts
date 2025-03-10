import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Banner } from "../../../../modules/banner/models/banner"
import { getBanner, updateBanner, deleteBanner } from "../../../../shared/banner-store"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const bannerId = req.params.id
  
  try {
    const banner = getBanner(bannerId)

    if (!banner) {
      return res.status(404).json({ message: `Banner with id ${bannerId} not found` })
    }

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
    // Cast req.body to Partial<Banner> to fix type error
    const updatedBanner = updateBanner(bannerId, req.body as Partial<Banner>)

    if (!updatedBanner) {
      return res.status(404).json({ message: `Banner with id ${bannerId} not found` })
    }

    res.json({ banner: updatedBanner })
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
    const result = deleteBanner(bannerId)

    if (!result) {
      return res.status(404).json({ message: `Banner with id ${bannerId} not found` })
    }

    res.status(204).end()
  } catch (error) {
    res.status(500).json({ 
      message: "Error deleting banner", 
      error: (error as Error).message 
    })
  }
}