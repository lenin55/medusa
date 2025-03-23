import { MedusaService } from "@medusajs/framework/utils"
import Banner from "./models/banner"

class BannerModuleService extends MedusaService({
  Banner,
}){
  async getActiveBanners() {
    const now = new Date()
    
    return await this.listBanners({
      is_active: true,
      $and: [
        {
          $or: [
            { valid_from: null },
            { valid_from: { $lte: now } }
          ]
        },
        {
          $or: [
            { valid_until: null },
            { valid_until: { $gte: now } }
          ]
        }
      ]
    })
  }
}

export default BannerModuleService