import { FilterQuery } from "@mikro-orm/core"
import { BannerRepository } from "./repository"
import { Banner } from "./models/banner"

type BannerServiceProps = {
  bannerRepository: BannerRepository
}

type CreateBannerInput = {
  name: string
  image_url: string
  description?: string
  is_active: boolean  // Changed from optional to required
  link_url?: string
  valid_from?: Date
  valid_until?: Date
}

type UpdateBannerInput = Partial<CreateBannerInput>

class BannerService {
  protected bannerRepository_: BannerRepository

  constructor({ bannerRepository }: BannerServiceProps) {
    this.bannerRepository_ = bannerRepository
  }

  async list(
    selector: FilterQuery<Banner> = {},
    config: { skip?: number; take?: number } = {
      skip: 0,
      take: 50,
    }
  ): Promise<Banner[]> {
    return await this.bannerRepository_.find(selector, {
      limit: config.take,
      offset: config.skip,
    })
  }

  async retrieve(bannerId: string): Promise<Banner> {
    const banner = await this.bannerRepository_.findOne({ id: bannerId })

    if (!banner) {
      throw new Error(`Banner with id: ${bannerId} not found`)
    }

    return banner
  }

  async create(data: CreateBannerInput): Promise<Banner> {
    // Ensure is_active has a default value even if not provided
    const bannerData = {
      ...data,
      is_active: data.is_active ?? false,
      created_at: new Date(),
      updated_at: new Date(),
    }
    
    const banner = this.bannerRepository_.create(bannerData)
    await this.bannerRepository_.persistAndFlush(banner)
    return banner
  }

  async update(bannerId: string, data: UpdateBannerInput): Promise<Banner> {
    const banner = await this.retrieve(bannerId)
    
    Object.assign(banner, data)
    await this.bannerRepository_.persistAndFlush(banner)
    
    return banner
  }

  async delete(bannerId: string): Promise<void> {
    const banner = await this.retrieve(bannerId)
    await this.bannerRepository_.removeAndFlush(banner)
  }
}

export default BannerService