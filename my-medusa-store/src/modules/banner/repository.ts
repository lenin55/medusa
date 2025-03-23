import { EntityRepository } from "@mikro-orm/postgresql";
import Banner from "./models/banner";

// Define the interface for Banner entity type
interface BannerEntity {
  id: string;
  name: string;
  image_url: string;
  description?: string;
  is_active: boolean;
  link_url?: string;
  valid_from?: Date;
  valid_until?: Date;
}

export class BannerRepository extends EntityRepository<BannerEntity> {
  async persistAndFlush(entity: BannerEntity): Promise<void> {
    this.getEntityManager().persist(entity);
    await this.getEntityManager().flush();
  }

  async removeAndFlush(entity: BannerEntity): Promise<void> {
    this.getEntityManager().remove(entity);
    await this.getEntityManager().flush();
  }
}