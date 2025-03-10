import { BannerRepository } from "./repository"
import BannerService from "./service"

// Since Banner is just an interface, we don't export it as an entity
// Export an empty array for entities since we're using in-memory storage
export const entities = []

// Default export for service registration
export default {
  scope: "bannerModule",
  register: ({ container }) => {
    container.register({
      bannerRepository: asClass(BannerRepository).singleton(),
      bannerService: asClass(BannerService).singleton(),
    })
  },
}

// Helper functions for DI
function asClass(Class: any) {
  return {
    singleton: () => ({
      resolve: () => new Class(),
    }),
  }
}