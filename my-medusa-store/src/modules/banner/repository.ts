import { EntityRepository } from "@mikro-orm/postgresql"
import { Banner } from "./models/banner"

export class BannerRepository extends EntityRepository<Banner> {
  async persistAndFlush(entity: Banner): Promise<void> {
    await this.persist(entity);
    await this.flush();
  }

  async removeAndFlush(entity: Banner): Promise<void> {
    await this.remove(entity);
    await this.flush();
  }
}